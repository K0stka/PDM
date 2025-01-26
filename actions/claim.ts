"use server";

import { Archetype, Block, Claim } from "@/lib/types";
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
import { UnauthorizedError, UserError, inlineCatch } from "@/lib/utils";
import { canEditClaimsNow, saveClaimsSchema } from "@/validation/claim";
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

export const getBlocksState = async (): Promise<
    UserErrorType | BlocksState
> => {
    const user = await session();

    if (!validateUser(user, { isAttending: true })) return UnauthorizedError();

    if (!canEditClaimsNow(user)) return UnauthorizedError();

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
        where: eq(Claims.user, user.id),
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

export const saveClaims = async (unsafe: saveClaimsSchema) => {
    const user = await session();

    if (!validateUser(user, { isAttending: true })) return UnauthorizedError();

    if (!canEditClaimsNow(user)) return UnauthorizedError();

    const [data, error] = inlineCatch(() => saveClaimsSchema.parse(unsafe));

    if (error) return error;

    const userClaims = await db.query.claims.findMany({
        where: eq(Claims.user, user.id),
    });

    const primaryClaimsToHandle: {
        block: Block["id"];
        archetype: Archetype["id"];
        replacing: Claim["id"] | null;
        replacingArchetype: Archetype["id"] | null;
    }[] = [];
    const secondaryClaimsToHandle: {
        block: Block["id"];
        archetype: Archetype["id"];
        replacing: Claim["id"] | null;
    }[] = [];

    for (const claim of data) {
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
            if (!claim.secondaryArchetype)
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
        return;

    console.log(primaryClaimsToHandle, secondaryClaimsToHandle);

    const succeeded = await db.transaction(async (tx) => {
        for await (const claim of primaryClaimsToHandle) {
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

            const freeSpace = (await db.query.blockArchetypeLookup.findFirst({
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

            await db.insert(Claims).values({
                user: user.id,
                archetype: claim.archetype,
                block: claim.block,
                secondary: false,
                timestamp: new Date(),
            });
        }

        for await (const claim of secondaryClaimsToHandle) {
            const capacity = (await db.query.blockArchetypeLookup.findFirst({
                columns: {
                    capacity: true,
                },
                where: and(
                    eq(blockArchetypeLookup.block, claim.block),
                    eq(blockArchetypeLookup.archetype, claim.archetype),
                ),
            }))!.capacity;

            if (capacity < 1) {
                tx.rollback();
                return false;
            }

            if (claim.replacing !== null)
                await db.delete(Claims).where(eq(Claims.id, claim.replacing));

            await db.insert(Claims).values({
                user: user.id,
                archetype: claim.archetype,
                block: claim.block,
                secondary: true,
                timestamp: new Date(),
            });
        }

        return true;
    });

    if (!succeeded)
        return UserError("Některá z vámi zvolených přednášek je již plná");
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

export const getUserClaims = async (userId: number) => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const questionedUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!questionedUser) return UserError("Neplatné ID uživatele");
    if (!validateUser(questionedUser, { isAttending: true }))
        return UserError("Uživatel není účastníkem");

    return await db.query.claims.findMany({
        where: eq(Claims.user, userId),
        orderBy: asc(Claims.timestamp),
        with: {
            block: {
                columns: {
                    from: true,
                    to: true,
                },
            },
            archetype: {
                columns: {
                    name: true,
                },
            },
        },
    });
};
