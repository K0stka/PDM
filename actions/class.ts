"use server";

import { UserError, inlineCatch } from "@/lib/utils";
import { db, eq, users } from "@/db";
import { session, validateUser } from "@/auth/session";

import { ClassSelectorForm } from "@/validation/class";

export const setClass = async (values: { className: string }) => {
	const user = await session();

	validateUser(user, {
		isAttending: true,
		throwError: true,
	});

	const [validated, error] = inlineCatch(() => ClassSelectorForm.parse(values));

	if (error) return UserError(error);

	if (validated.className === user.class) return;

	await db
		.update(users)
		.set({
			class: validated.className,
		})
		.where(eq(users.id, user.id));
};
