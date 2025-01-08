import { NextRequest, NextResponse } from "next/server";
import { db, eq, users } from "@/db";
import { getSessionUserRecord, removeSessionUserRecord, updateSessionUserRecord } from "@/auth/session-edge";

import { validateSession } from "@/auth/session";

export const GET = async (req: NextRequest) => {
	const sessionUser = await getSessionUserRecord();

	if (!sessionUser) return NextResponse.error();

	const user = await db.query.users.findFirst({
		where: eq(users.id, sessionUser.id),
	});

	if (!user) {
		await removeSessionUserRecord();

		return NextResponse.redirect(new URL("/logged-out", req.nextUrl));
	}

	if (!validateSession(user, sessionUser)) await updateSessionUserRecord(user);

	return NextResponse.redirect(new URL("/", req.nextUrl));
};
