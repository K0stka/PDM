"use server";

import { UnauthorizedError, UserError, inlineCatch } from "@/lib/utils";
import { db, eq, users } from "@/db";
import { session, validateUser } from "@/auth/session";

import { ClassSelectorForm } from "@/validation/class";

export const setClass = async (unsafe: { className: string }) => {
	const user = await session();

	if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

	const [data, error] = inlineCatch(() => ClassSelectorForm.parse(unsafe));

	if (error) return UserError(error);

	if (data.className === user.class) return;

	await db
		.update(users)
		.set({
			class: data.className,
		})
		.where(eq(users.id, user.id));
};
