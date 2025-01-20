"use server";

import { Archetype, Block } from "@/lib/types";
import {
    UnauthorizedError,
    UserError,
    catchUserError,
    inlineCatch,
} from "@/lib/utils";
import {
    archetypes as archetypesTable,
    asc,
    blocks as blocksTable,
    claims as claimsTable,
    db,
    eq,
} from "@/db";
import { session, validateUser } from "@/auth/session";

import { revalidatePath } from "next/cache";
import { saveClaimsSchema } from "@/validation/claims";

export type ClaimInfo = Archetype & {
    claimsPerBlock: {
        [key: Block["id"]]: number;
    };
    capacityPerBlock: {
        [key: Block["id"]]: number;
    };
};

export const getClaimStatus = async () => {
    const user = await session();

    if (!validateUser(user, { isAttending: true })) return UnauthorizedError();

    const blocks = await db.query.blocks.findMany({
        orderBy: asc(blocksTable.from),
    });

    return (
        await db.query.archetypes.findMany({
            columns: {
                id: true,
                name: true,
            },
            with: {
                claims: {
                    columns: {
                        block: true,
                    },
                    where: eq(claimsTable.secondary, false),
                },
                events: {
                    columns: {
                        block: true,
                        capacity: true,
                    },
                },
            },
            where: eq(archetypesTable.canceled, false),
            orderBy: asc(archetypesTable.name),
        })
    ).map((archetype) => {
        const claimsPerBlock: { [key: Block["id"]]: number } = {};
        const capacityPerBlock: { [key: Block["id"]]: number } = {};

        blocks.forEach((block) => {
            claimsPerBlock[block.id] = 0;
            capacityPerBlock[block.id] = 0;
        });

        archetype.claims.forEach((claim) => {
            claimsPerBlock[claim.block] += 1;
        });

        archetype.events.forEach((event) => {
            capacityPerBlock[event.block] = event.capacity;
        });

        return {
            id: archetype.id,
            name: archetype.name,
            claimsPerBlock,
            capacityPerBlock,
        };
    }) as ClaimInfo[];
};

export const saveClaims = async (unsafe: saveClaimsSchema) => {
    const user = await session();

    if (!validateUser(user, { isAttending: true })) return UnauthorizedError();

    const [newClaims, errors] = inlineCatch(() =>
        saveClaimsSchema.parse(unsafe),
    );

    if (errors) return UserError(errors);

    const blocks = await db.query.blocks.findMany();

    if (
        blocks.some(
            (block) =>
                newClaims.find(
                    (claim) => claim.primaryClaim.block === block.id,
                ) === undefined,
        )
    )
        return UserError("Chybí některé bloky.");

    const status_unsafe = await getClaimStatus();

    const [status, error] = catchUserError(status_unsafe);

    if (error) return error;

    const currentClaims = await db.query.claims.findMany({
        where: eq(claimsTable.id, user.id),
        columns: {
            id: true,
            block: true,
            archetype: true,
            secondary: true,
        },
    });

    if (
        newClaims.some((claim) => {
            const archetypeStatus = status.find(
                (s) => s.id === claim.primaryClaim.archetype,
            )!;

            if (
                currentClaims.find(
                    (c) =>
                        c.block === claim.primaryClaim.block &&
                        c.secondary === false &&
                        c.archetype === claim.primaryClaim.archetype,
                )
            )
                return false;

            return (
                archetypeStatus.claimsPerBlock[claim.primaryClaim.block] >=
                archetypeStatus.capacityPerBlock[claim.primaryClaim.block]
            );
        })
    )
        return UserError("Vybrané přednášky jsou již plné.");

    if (currentClaims.length > 0)
        await db.delete(claimsTable).where(eq(claimsTable.user, user.id));

    const claimsToBeInserted: {
        user: number;
        block: number;
        archetype: number;
        secondary: boolean;
        timestamp: Date;
    }[] = [];

    newClaims.forEach((claim) => {
        claimsToBeInserted.push({
            user: user.id,
            block: claim.primaryClaim.block,
            archetype: claim.primaryClaim.archetype,
            secondary: false,
            timestamp: new Date(),
        });

        claimsToBeInserted.push({
            user: user.id,
            block: claim.primaryClaim.block,
            archetype: claim.secondaryClaim.archetype,
            secondary: true,
            timestamp: new Date(),
        });
    });

    await db.insert(claimsTable).values(claimsToBeInserted);

    revalidatePath("/attending/claims");
};
