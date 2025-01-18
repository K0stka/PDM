"use server";

import { UserError, inlineCatch, pluralHelper } from "@/lib/utils";
import { and, count, db, eq, interests } from "@/db";
import { expressInterestSchema, interestsActive } from "@/validation/interest";
import { session, validateUser } from "@/auth/session";

import { configuration } from "@/configuration/configuration";
import { revalidatePath } from "next/cache";

export const expressInterest = async (unsafe: expressInterestSchema) => {
	if (interestsActive() === false) return UserError("Projevování zájmu o přednášky není aktivní");

	const user = await session();

	validateUser(user, {
		isAttending: true,
		throwError: true,
	});

	const [data, error] = inlineCatch(() => expressInterestSchema.parse(unsafe));

	if (error) return UserError(error);

	const exists = await db.query.interests.findFirst({
		where: and(eq(interests.archetype, data.archetypeId), eq(interests.user, user.id)),
	});

	if (!!exists === data.isInterested) {
		revalidatePath("/workshops");
		return;
	}

	if (data.isInterested) {
		if (configuration.maxInterests) {
			const numberOfInterests = (await db.select({ count: count() }).from(interests).where(eq(interests.user, user.id)))[0].count;

			if (numberOfInterests >= configuration.maxInterests) return UserError(`Nemůžete vyjádřit zájem o více než ${configuration.maxInterests} ${pluralHelper(configuration.maxInterests, "přednášku", "přednášky", "přednášek")}`);
		}

		await db.insert(interests).values({
			archetype: data.archetypeId,
			user: user.id,
		});
	} else await db.delete(interests).where(and(eq(interests.archetype, data.archetypeId), eq(interests.user, user.id)));

	revalidatePath("/workshops");
};
