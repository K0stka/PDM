"use server";

import { UnauthorizedError, UserError, inlineCatch } from "@/lib/utils";
import { addBlockSchema, editBlockSchema } from "@/validation/block";
import { blockArchetypeLookup, blocks, db, eq } from "@/db";
import { session, validateUser } from "@/auth/session";

import { revalidatePath } from "next/cache";

export const addBlock = async (unsafe: addBlockSchema) => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const [block, error] = inlineCatch(() => addBlockSchema.parse(unsafe));

    if (error) return UserError(error);

    const newId = (
        await db
            .insert(blocks)
            .values(block)
            .returning({ insertedId: blocks.id })
    )[0].insertedId;

    const archetypes = await db.query.archetypes.findMany({
        columns: {
            id: true,
        },
    });

    await db.insert(blockArchetypeLookup).values(
        archetypes.map(({ id }) => ({
            archetype: id,
            block: newId,
            freeSpace: 0,
            capacity: 0,
        })),
    );

    revalidatePath("/admin/blocks");
};

export const editBlock = async (unsafe: editBlockSchema) => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const [block, error] = inlineCatch(() => editBlockSchema.parse(unsafe));

    if (error) return UserError(error);

    const exists = await db.query.blocks.findFirst({
        where: eq(blocks.id, block.id),
    });

    if (!exists) return UserError("Blok neexistuje");

    await db
        .update(blocks)
        .set({
            from: block.from,
            to: block.to,
        })
        .where(eq(blocks.id, block.id));

    revalidatePath("/admin/blocks");
};

export const deleteBlock = async (id: number) => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const exists = await db.query.blocks.findFirst({
        where: eq(blocks.id, id),
        with: {
            events: {
                columns: {
                    id: true,
                },
                limit: 1,
            },
        },
    });

    if (!exists) return UserError("Blok neexistuje");

    if (exists.events.length > 0)
        return UserError("Blok nelze smazat, protože se během něj konají akce");

    await db.delete(blocks).where(eq(blocks.id, id));

    await db
        .delete(blockArchetypeLookup)
        .where(eq(blockArchetypeLookup.block, id));

    revalidatePath("/admin/blocks");
};
