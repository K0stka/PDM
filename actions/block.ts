"use server";

import { UnauthorizedError, UserError, inlineCatch, pluralHelper } from "@/lib/utils";
import { addBlockSchema, editBlockSchema } from "@/validation/block";
import { blocks, count, db, eq, events, getTableColumns } from "@/db";
import { session, validateUser } from "@/auth/session";

import { Block } from "@/lib/types";
import { UserErrorType } from "@/lib/utilityTypes";
import { revalidatePath } from "next/cache";

export const addBlock = async (unsafe: addBlockSchema) => {
	const user = await session();

	if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

	const [block, error] = inlineCatch(() => addBlockSchema.parse(unsafe));

	if (error) return UserError(error);

	await db.insert(blocks).values(block);

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

	const exists = (
		await db
			.select({
				id: blocks.id,
				events: count(events.id),
			})
			.from(blocks)
			.leftJoin(events, eq(blocks.id, events.block))
			.where(eq(blocks.id, id))
			.groupBy(blocks.id)
			.limit(1)
	)[0];

	if (!exists) return UserError("Blok neexistuje");

	if (exists.events > 0) return UserError(`Blok nelze odstranit, protože se během něj ${pluralHelper(exists.events, "koná", "konají")} ${exists.events} ${pluralHelper(exists.events, "událost", "události", "událostí")}`);

	await db.delete(blocks).where(eq(blocks.id, id));

	revalidatePath("/admin/blocks");
};
