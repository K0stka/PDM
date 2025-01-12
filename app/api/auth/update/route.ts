import { db, eq, users } from "@/db";
import { getSession, removeSession, updateSession } from "@/auth/session-edge";

import { NextResponse } from "next/server";
import { User } from "@/lib/types";
import { env } from "@/env";
import { revalidatePath } from "next/cache";
import { validateSession } from "@/auth/session";

export const GET = async () => {
	const sessionUser = await getSession();

	if (!sessionUser) return NextResponse.error();

	const user: User | undefined = await db.query.users.findFirst({
		where: eq(users.id, sessionUser.id),
	});

	if (!user) {
		await removeSession();

		revalidatePath("/", "layout");

		return NextResponse.redirect(new URL("/logged-out", env.BASE_URL));
	}

	if (!validateSession(user, sessionUser)) await updateSession(user);

	revalidatePath("/", "layout");
	return Response.redirect(new URL("/", env.BASE_URL), 303);
};
