import "server-only";

import { db, users } from "@/db";
import { getSession, removeSession, updateSession } from "./session-edge";

import { Session } from "@/lib/types";
import { User } from "@/lib/types";
import { cache } from "react";
import { env } from "@/env";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { rethrowRedirect } from "@/lib/utils";

export const session: () => Promise<User> = cache(async () => {
	const session = await getSession();

	if (!session) throw Error("You are not logged in");

	const user: User | undefined = env.OFFLINE_MODE
		? {
				id: 1,
				microsoftId: "",
				name: "Jan Kostka",
				email: "kostkaj@gytool.cz",
				colors: {
					light: "#FFFFFF",
					dark: "#000000",
				},
				class: "IV.A4",
				isAttending: true,
				isPresenting: true,
				isAdmin: true,
		  }
		: await db.query.users.findFirst({
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

export const validateSession = (user: User, sessionUser: Session): boolean => user.isAttending === sessionUser.isAttending && user.isPresenting === sessionUser.isPresenting && user.isAdmin === sessionUser.isAdmin;

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
