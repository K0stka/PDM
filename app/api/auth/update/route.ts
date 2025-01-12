import { NextRequest, NextResponse } from "next/server";
import { db, eq, users } from "@/db";
import { getSession, removeSession, updateSession } from "@/auth/session-edge";

import { User } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { validateSession } from "@/auth/session";

export const GET = async (req: NextRequest) => {
	const sessionUser = await getSession();

	if (!sessionUser) return NextResponse.error();

	const user: User | undefined = await db.query.users.findFirst({
		where: eq(users.id, sessionUser.id),
	});

	if (!user) {
		await removeSession();

		revalidatePath("/", "layout");

		return NextResponse.redirect(new URL("/logged-out", req.nextUrl));
	}

	if (!validateSession(user, sessionUser)) await updateSession(user);

	revalidatePath("/", "layout");
	return Response.redirect(new URL("/", req.nextUrl), 303);
};
