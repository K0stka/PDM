"use server";

import {
    archetypes as archetypesTable,
    asc,
    blockArchetypeLookup,
    blocks as blocksTable,
    claims as claimsTable,
    db,
    eq,
    events as eventsTable,
} from "@/db";
import { session, validateUser } from "@/auth/session";

import { UnauthorizedError } from "@/lib/utils";

export const recalculateArchetypeInterested = async () => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const archetypes = await db.query.archetypes.findMany({
        columns: {
            id: true,
        },
        with: {
            interests: {
                columns: {
                    id: true,
                },
            },
        },
    });

    await Promise.allSettled(
        archetypes.map((archetype) =>
            db
                .update(archetypesTable)
                .set({ interested: archetype.interests.length })
                .where(eq(archetypesTable.id, archetype.id)),
        ),
    );
};

export const recalculateEventAttending = async () => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const events = await db.query.events.findMany({
        columns: {
            id: true,
        },
        with: {
            attendances: {
                columns: {
                    id: true,
                },
            },
        },
    });

    await Promise.allSettled(
        events.map((event) =>
            db
                .update(eventsTable)
                .set({ attending: event.attendances.length })
                .where(eq(eventsTable.id, event.id)),
        ),
    );
};

export const recalculateBlockArchetypeLookup = async () => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const blocks = await db.query.blocks.findMany({
        orderBy: asc(blocksTable.from),
    });

    const archetypes = await db.query.archetypes.findMany({
        columns: {
            id: true,
        },
        with: {
            events: {
                columns: {
                    block: true,
                    capacity: true,
                },
            },
        },
    });

    const claims = await db.query.claims.findMany({
        columns: {
            block: true,
            archetype: true,
        },
        where: eq(claimsTable.secondary, false),
    });

    await db.delete(blockArchetypeLookup);

    await db.insert(blockArchetypeLookup).values(
        blocks.flatMap((block) =>
            archetypes.map((archetype) => {
                const events = archetype.events.filter(
                    (e) => e.block === block.id,
                );
                const capacity = events.reduce((acc, e) => acc + e.capacity, 0);
                let numOfClaims = 0;

                claims.forEach((c) => {
                    if (c.block === block.id && c.archetype === archetype.id)
                        numOfClaims++;
                });

                return {
                    block: block.id,
                    archetype: archetype.id,
                    freeSpace: capacity - numOfClaims,
                    capacity: capacity,
                };
            }),
        ),
    );
};

export const recalculateAll = async () => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    await recalculateArchetypeInterested();

    await recalculateEventAttending();

    await recalculateBlockArchetypeLookup();
};
