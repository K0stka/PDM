"use server";

import { Event, Presenter, User } from "@/lib/types";
import { UnauthorizedError, UserError } from "@/lib/utils";
import { archetypes, db, eq } from "@/db";
import { session, validateUser } from "@/auth/session";

import { UserErrorType } from "@/lib/utilityTypes";

export type EditEventDetails = Omit<Event, "archetype"> & {
	presenters: {
		id: Presenter["id"];
		user: Pick<User, "id" | "name" | "colors">;
	}[];
};

export const getArchetypeEvents = async (archetypeId: number): Promise<UserErrorType | EditEventDetails[]> => {
	const user = await session();

	if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

	const archetype = await db.query.archetypes.findFirst({
		where: eq(archetypes.id, archetypeId),
		columns: {},
		with: {
			events: {
				columns: {
					id: true,
					capacity: true,
				},
				with: {
					block: true,
					place: true,
					presenters: {
						columns: {
							id: true,
						},
						with: {
							user: {
								columns: {
									id: true,
									name: true,
									colors: true,
								},
							},
						},
					},
				},
			},
		},
	});

	if (!archetype) return UserError("Neplatné ID přednášky");

	return archetype.events;
};
