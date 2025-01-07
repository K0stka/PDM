import { SessionUserRecord, User } from "@/lib/types";
import { db, users } from "@/db";

import { cache } from "react";
import { eq } from "drizzle-orm";
import { getSessionUserRecord } from "./session";
import { redirect } from "next/navigation";

interface GetSessionUserOptions {
	throwErrorOnInvalidSession?: true;
}

export const getSessionUserInfo: (options?: GetSessionUserOptions) => Promise<User> = cache(async ({ throwErrorOnInvalidSession }: GetSessionUserOptions = {}) => {
	const sessionUser = await getSessionUserRecord();

	if (!sessionUser) throw new Error("You are not logged in");

	const user = await db.query.users.findFirst({
		where: eq(users.id, sessionUser.id),
	});

	if (!user || isSessionInvalid(user, sessionUser))
		if (throwErrorOnInvalidSession) throw new Error("Invalid session");
		else redirect("/api/auth/update");

	return user;
});

export const isSessionInvalid = (user: User, sessionUser: SessionUserRecord): boolean => user.isAttending !== sessionUser.isAttending || user.isPresenting !== sessionUser.isPresenting || user.isAdmin !== sessionUser.isAdmin;

type ValidateUserOptions = {
	throwError?: true;
	isAttending?: true;
	isPresenting?: true;
	isAdmin?: true;
};

export const validateUser = (user: User, { throwError, isAttending, isPresenting, isAdmin }: ValidateUserOptions): boolean => {
	const valid = (() => {
		if (isAttending && !user.isAttending) return false;
		if (isPresenting && !user.isPresenting) return false;
		if (isAdmin && !user.isAdmin) return false;

		return true;
	})();

	if (throwError && !valid) throw new Error("You are not authorized to perform this action");

	return valid;
};
