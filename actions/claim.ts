"use server";

import { Archetype, Block, Claim, User } from "@/lib/types";
import {
    claims as Claims,
    and,
    asc,
    blockArchetypeLookup,
    blocks as blocksTable,
    db,
    eq,
    sql,
    users,
} from "@/db";
import {
    UnauthorizedError,
    UserError,
    asyncInlineCatch,
    catchUserError,
    inlineCatch,
} from "@/lib/utils";
import {
    adminSaveClaimsSchema,
    canEditClaimsNow,
    claimsVisible,
    saveClaimsSchema,
} from "@/validation/claim";
import { session, validateUser } from "@/auth/session";

import { UserErrorType } from "@/lib/utilityTypes";
import { configuration } from "@/configuration/configuration";
import { revalidatePath } from "next/cache";

export type BlocksState = {
    id: number;
    from: Date;
    to: Date;
    primaryClaim: Archetype["id"] | null;
    secondaryClaim: Archetype["id"] | null;
    archetypes: {
        id: number;
        name: string;
        spaceLeft: number;
        spaceTotal: number;
    }[];
}[];

const getBlockStateForUserId = async (
    userId: User["id"],
): Promise<BlocksState> => {
    const blocks = await db.query.blocks.findMany({
        orderBy: asc(blocksTable.from),
        with: {
            archetypeLookup: {
                with: {
                    archetype: true,
                },
            },
        },
    });

    const userClaims = await db.query.claims.findMany({
        where: eq(Claims.user, userId),
    });

    const blockClaims: { [key: string]: Archetype["id"] } = {};

    userClaims.forEach((claim) => {
        if (!claim.secondary) blockClaims["p" + claim.block] = claim.archetype;
        else blockClaims["s" + claim.block] = claim.archetype;
    });

    return blocks.map((block) => ({
        id: block.id,
        from: block.from,
        to: block.to,
        primaryClaim: blockClaims["p" + block.id] ?? null,
        secondaryClaim: blockClaims["s" + block.id] ?? null,
        archetypes: block.archetypeLookup
            .filter((a) => a.capacity > 0)
            .map((a) => ({
                id: a.archetype.id,
                name: a.archetype.name,
                spaceLeft: Math.max(a.freeSpace, 0),
                spaceTotal: a.capacity,
            })),
    }));
};

export const getBlocksState = async (): Promise<
    UserErrorType | BlocksState
> => {
    const user = await session();

    if (!validateUser(user, { isAttending: true })) return UnauthorizedError();

    if (!claimsVisible(user)) return UnauthorizedError();

    return await getBlockStateForUserId(user.id);
};

export const getUserBlockState = async (
    userId: number,
): Promise<UserErrorType | BlocksState> => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const exists = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!exists) return UserError("Uživatel neexistuje");

    return await getBlockStateForUserId(userId);
};

const saveUserClaims = async (
    claims: saveClaimsSchema | adminSaveClaimsSchema["claims"],
    userId: User["id"],
    ignoreCapacity?: true,
): Promise<boolean | UserErrorType> => {
    const userClaims = await db.query.claims.findMany({
        where: eq(Claims.user, userId),
    });

    const primaryClaimsToHandle: {
        block: Block["id"];
        archetype: Archetype["id"] | null;
        replacing: Claim["id"] | null;
        replacingArchetype: Archetype["id"] | null;
    }[] = [];
    const secondaryClaimsToHandle: {
        block: Block["id"];
        archetype: Archetype["id"] | null;
        replacing: Claim["id"] | null;
    }[] = [];

    for (const claim of claims) {
        const primaryUserClaim = userClaims.find(
            (c) => c.block === claim.block && c.secondary === false,
        );

        if (!primaryUserClaim)
            primaryClaimsToHandle.push({
                block: claim.block,
                archetype: claim.primaryArchetype,
                replacing: null,
                replacingArchetype: null,
            });
        else if (primaryUserClaim.archetype !== claim.primaryArchetype)
            primaryClaimsToHandle.push({
                block: claim.block,
                archetype: claim.primaryArchetype,
                replacing: primaryUserClaim.id,
                replacingArchetype: primaryUserClaim.archetype,
            });

        if (configuration.secondaryClaims) {
            if (claim.secondaryArchetype === undefined)
                return UserError("Nebyly odeslány všechny sekundární volby");

            const secondaryUserClaim = userClaims.find(
                (c) => c.block === claim.block && c.secondary === true,
            );

            if (!secondaryUserClaim)
                secondaryClaimsToHandle.push({
                    block: claim.block,
                    archetype: claim.secondaryArchetype,
                    replacing: null,
                });
            else if (secondaryUserClaim.archetype !== claim.secondaryArchetype)
                secondaryClaimsToHandle.push({
                    block: claim.block,
                    archetype: claim.secondaryArchetype,
                    replacing: secondaryUserClaim.id,
                });
        }
    }

    if (
        primaryClaimsToHandle.length === 0 &&
        secondaryClaimsToHandle.length === 0
    )
        return true;

    const succeeded = await db.transaction(async (tx) => {
        for await (const claim of primaryClaimsToHandle) {
            if (claim.archetype !== null) {
                await db
                    .update(blockArchetypeLookup)
                    .set({
                        freeSpace: sql`${blockArchetypeLookup.freeSpace} - 1`,
                    })
                    .where(
                        and(
                            eq(blockArchetypeLookup.block, claim.block),
                            eq(blockArchetypeLookup.archetype, claim.archetype),
                        ),
                    );
            }

            if (!ignoreCapacity && claim.archetype !== null) {
                const freeSpace =
                    (await db.query.blockArchetypeLookup.findFirst({
                        columns: {
                            freeSpace: true,
                        },
                        where: and(
                            eq(blockArchetypeLookup.block, claim.block),
                            eq(blockArchetypeLookup.archetype, claim.archetype),
                        ),
                    }))!.freeSpace;

                if (freeSpace < 0) {
                    tx.rollback();
                    return false;
                }
            }

            if (claim.replacing !== null) {
                await db.delete(Claims).where(eq(Claims.id, claim.replacing));
                await db
                    .update(blockArchetypeLookup)
                    .set({
                        freeSpace: sql`${blockArchetypeLookup.freeSpace} + 1`,
                    })
                    .where(
                        and(
                            eq(blockArchetypeLookup.block, claim.block),
                            eq(
                                blockArchetypeLookup.archetype,
                                claim.replacingArchetype!,
                            ),
                        ),
                    );
            }

            if (claim.archetype !== null) {
                await db.insert(Claims).values({
                    user: userId,
                    archetype: claim.archetype,
                    block: claim.block,
                    secondary: false,
                    timestamp: new Date(),
                });
            }
        }

        for await (const claim of secondaryClaimsToHandle) {
            if (claim.archetype !== null) {
                const capacity = (await db.query.blockArchetypeLookup.findFirst(
                    {
                        columns: {
                            capacity: true,
                        },
                        where: and(
                            eq(blockArchetypeLookup.block, claim.block),
                            eq(blockArchetypeLookup.archetype, claim.archetype),
                        ),
                    },
                ))!.capacity;

                if (capacity < 1) {
                    tx.rollback();
                    return false;
                }
            }

            if (claim.replacing !== null)
                await db.delete(Claims).where(eq(Claims.id, claim.replacing));

            if (claim.archetype !== null)
                await db.insert(Claims).values({
                    user: userId,
                    archetype: claim.archetype,
                    block: claim.block,
                    secondary: true,
                    timestamp: new Date(),
                });
        }

        return true;
    });

    return succeeded;
};

export const saveClaims = async (unsafe: saveClaimsSchema) => {
    const user = await session();

    if (!validateUser(user, { isAttending: true })) return UnauthorizedError();

    if (!canEditClaimsNow(user)) return UnauthorizedError();

    const [data, error] = inlineCatch(() => saveClaimsSchema.parse(unsafe));

    if (error) return UserError(error);

    for (const row of data) {
        if (configuration.secondaryClaims) {
            if (
                data.some(
                    (r) =>
                        r.block !== row.block &&
                        (r.primaryArchetype === row.primaryArchetype ||
                            r.primaryArchetype === row.secondaryArchetype),
                )
            )
                return UserError(
                    "Nelze mít 2 stejné přednášky ve dvou blocích",
                );

            if (row.primaryArchetype === row.secondaryArchetype)
                return UserError(
                    "Nelze mít zvolenou stejnou primární a sekundární přednášku",
                );
        } else {
            if (
                data.some(
                    (r) =>
                        r.block !== row.block &&
                        r.primaryArchetype === row.primaryArchetype,
                )
            )
                return UserError(
                    "Nelze mít 2 stejné přednášky ve dvou blocích",
                );
        }
    }

    const [succeeded, saveError] = inlineCatch(
        async () => await saveUserClaims(data, user.id),
    );

    if (saveError) return UserError(saveError);

    if (!succeeded)
        return UserError("Některá z vámi zvolených přednášek je již plná");
};

export const adminSaveClaims = async (unsafe: adminSaveClaimsSchema) => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const [data, error] = inlineCatch(() =>
        adminSaveClaimsSchema.parse(unsafe),
    );

    if (error) return UserError(error);

    const targetUser = await db.query.users.findFirst({
        where: and(eq(users.id, data.user), eq(users.isAttending, true)),
    });
    if (!targetUser) return UserError("Uživatel neexistuje");

    const [succeeded, saveError] = catchUserError(
        await saveUserClaims(data.claims, data.user, true),
    );

    if (saveError) return saveError;

    if (!succeeded) return UserError("Volby přednášek se nepodařilo uložit");
};

export const removeClaim = async (claimId: Claim["id"]) => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const claim = await db.query.claims.findFirst({
        where: eq(Claims.id, claimId),
    });

    if (!claim) return UserError("Neplatné ID volby");

    await db.delete(Claims).where(eq(Claims.id, claimId));

    if (!claim.secondary)
        await db
            .update(blockArchetypeLookup)
            .set({
                freeSpace: sql`${blockArchetypeLookup.freeSpace} + 1`,
            })
            .where(
                and(
                    eq(blockArchetypeLookup.block, claim.block),
                    eq(blockArchetypeLookup.archetype, claim.archetype),
                ),
            );

    revalidatePath("/admin/claims");
};
