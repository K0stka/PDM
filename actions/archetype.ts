"use server";

import { UserError, inlineCatch } from "@/lib/utils";
import { addArchetypeSchema, editArchetypeSchema } from "@/validation/archetype";
import { archetypes, db, eq } from "@/db";
import { session, validateUser } from "@/auth/session";

import { revalidatePath } from "next/cache";

export const addArchetype = async (unsafe: addArchetypeSchema) => {
	const user = await session();

	validateUser(user, {
		isAdmin: true,
		throwError: true,
	});

	const [archetype, error] = inlineCatch(() => addArchetypeSchema.parse(unsafe));

	if (error) return UserError(error);

	await db.insert(archetypes).values(archetype);

	revalidatePath("/workshops/edit");
};

export const editArchetype = async (unsafe: editArchetypeSchema) => {
	const user = await session();

	validateUser(user, {
		isAdmin: true,
		throwError: true,
	});

	const [archetype, error] = inlineCatch(() => editArchetypeSchema.parse(unsafe));

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
