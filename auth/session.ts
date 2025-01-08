import "server-only";

import { db, users } from "@/db";
import { getSessionUserRecord, removeSessionUserRecord, updateSessionUserRecord } from "./session-edge";

import { SessionUserRecord } from "@/lib/types";
import { User } from "@/lib/types";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { rethrowRedirect } from "@/lib/utils";

export const session: () => Promise<User> = cache(async () => {
	const sessionUser = await getSessionUserRecord();

	if (!sessionUser) throw new Error("You are not logged in");

	const user = await db.query.users.findFirst({
		where: eq(users.id, sessionUser.id),
	});

	if (!user)
		try {
			await removeSessionUserRecord();

			redirect("/logged-out");
		} catch (e) {
			rethrowRedirect(e);

			redirect("/api/auth/update");
		}

	if (!validateSession(user, sessionUser))
		try {
			await updateSessionUserRecord(user);
		} catch {
			redirect("/api/auth/update");
		}

	return user;
});

export const validateSession = (user: User, sessionUser: SessionUserRecord): boolean => user.isAttending === sessionUser.isAttending && user.isPresenting === sessionUser.isPresenting && user.isAdmin === sessionUser.isAdmin;

type ValidateUserOptions = {
	throwError?: true;
	isAttending?: true;
	isPresenting?: true;
	isAdmin?: true;
	classSet?: true;
};

export const validateUser = (user: User, { throwError, isAttending, isPresenting, isAdmin, classSet }: ValidateUserOptions): boolean => {
	const valid = (() => {
		if (isAttending && !user.isAttending) return false;
		if (isPresenting && !user.isPresenting) return false;
		if (isAdmin && !user.isAdmin) return false;
		if (classSet && !user.class) return false;

		return true;
	})();

	if (throwError && !valid) throw new Error("You are not authorized to perform this action");

	return valid;
};
