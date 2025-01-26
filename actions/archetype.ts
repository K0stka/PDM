"use server";

import { UnauthorizedError, UserError, inlineCatch } from "@/lib/utils";
import {
    addArchetypeSchema,
    editArchetypeSchema,
} from "@/validation/archetype";
import {
    and,
    archetypes,
    blockArchetypeLookup,
    claims,
    db,
    eq,
    interests,
} from "@/db";
import { session, validateUser } from "@/auth/session";

import { recalculateBlockArchetypeLookup } from "./lookup";
import { revalidatePath } from "next/cache";

export const addArchetype = async (unsafe: addArchetypeSchema) => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const [archetype, error] = inlineCatch(() =>
        addArchetypeSchema.parse(unsafe),
    );

    if (error) return UserError(error);

    const newId = (
        await db
            .insert(archetypes)
            .values(archetype)
            .returning({ insertedId: archetypes.id })
    )[0].insertedId;

    const blocks = await db.query.blocks.findMany({
        columns: {
            id: true,
        },
    });

    await db.insert(blockArchetypeLookup).values(
        blocks.map(({ id }) => ({
            archetype: newId,
            block: id,
            freeSpace: 0,
            capacity: 0,
        })),
    );

    revalidatePath("/workshops/edit");
};

export const editArchetype = async (unsafe: editArchetypeSchema) => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const [archetype, error] = inlineCatch(() =>
        editArchetypeSchema.parse(unsafe),
    );

    if (error) return UserError(error);

    const exists = await db.query.archetypes.findFirst({
        where: eq(archetypes.id, archetype.id),
    });

    if (!exists) return UserError("Neplatné ID přednášky");

    await db
        .update(archetypes)
        .set({
            name: archetype.name,
            description: archetype.description,
        })
        .where(eq(archetypes.id, archetype.id));

    revalidatePath("/workshops/edit");
};

export const deleteArchetype = async (id: number) => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const exists = await db.query.archetypes.findFirst({
        where: eq(archetypes.id, id),
        with: {
            events: {
                columns: {
                    id: true,
                },
                limit: 1,
            },
        },
    });

    if (!exists) return UserError("Neplatné ID přednášky");

    if (exists.events.length > 0)
        return UserError(
            "Nelze smazat přednášku, která je přiřazena k události",
        );

    const archetypeClaims = await db.query.claims.findMany({
        where: eq(claims.archetype, id),
    });

    await db.delete(claims).where(eq(claims.archetype, id));

    await Promise.allSettled(
        archetypeClaims
            .filter((claim) => !claim.secondary)
            .map((claim) =>
                db
                    .update(claims)
                    .set({ secondary: false })
                    .where(
                        and(
                            eq(claims.user, claim.user),
                            eq(claims.block, claim.block),
                        ),
                    ),
            ),
    );

    await db
        .delete(blockArchetypeLookup)
        .where(eq(blockArchetypeLookup.archetype, id));

    await db.delete(interests).where(eq(interests.archetype, id));

    await db.delete(archetypes).where(eq(archetypes.id, id));

    await recalculateBlockArchetypeLookup();

    revalidatePath("/workshops/edit");
};
