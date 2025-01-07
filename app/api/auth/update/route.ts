import { NextRequest, NextResponse } from "next/server";
import { db, eq, users } from "@/db";
import { getSessionUserRecord, removeSessionUser } from "@/auth/session";

import { isSessionInvalid } from "@/auth/session-utils";

export const GET = async (req: NextRequest) => {
	const sessionUser = await getSessionUserRecord();

	if (!sessionUser) return NextResponse.error();

	const user = await db.query.users.findFirst({
		where: eq(users.id, sessionUser.id),
	});

	if (!user || isSessionInvalid(user, sessionUser)) await removeSessionUser();

	return NextResponse.redirect(new URL("/logged-out", req.nextUrl));
};
