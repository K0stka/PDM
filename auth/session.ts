import "server-only";

import { db, users } from "@/db";
import { getSession, removeSession, updateSession } from "./session-edge";

import { Session } from "@/lib/types";
import { User } from "@/lib/types";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { rethrowRedirect } from "@/lib/utils";

export const session: () => Promise<User> = cache(async () => {
	const session = await getSession();

	if (!session) throw Error("You are not logged in");

	const user: User | undefined = await db.query.users.findFirst({
		where: eq(users.id, session.id),
	});

	if (!user)
		try {
			await removeSession();

			redirect("/logged-out");
		} catch (e) {
			rethrowRedirect(e);

			redirect("/api/auth/update");
		}

	if (!validateSession(user, session))
		try {
			await updateSession(user);
		} catch {
			redirect("/api/auth/update");
		}

	return user;
});

export const validateSession = (user: User, sessionUser: Session): boolean =>
	user.isAttending === sessionUser.isAttending && user.isTeacher === sessionUser.isTeacher && user.isPresenting === sessionUser.isPresenting && user.isAdmin === sessionUser.isAdmin;

type ValidateUserOptions = {
	isAttending?: true;
	isPresenting?: true;
	isAdmin?: true;
	classSet?: true;
};

export const validateUser = (user: User, { isAttending, isPresenting, isAdmin, classSet }: ValidateUserOptions): boolean => {
	if (isAttending && !user.isAttending) return false;
	if (isPresenting && !user.isPresenting) return false;
	if (isAdmin && !user.isAdmin) return false;
	if (classSet && !user.class) return false;

	return true;
};
