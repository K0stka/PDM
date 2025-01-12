import { NextRequest, NextResponse } from "next/server";
import { db, eq, users } from "@/db";

import { User } from "@/lib/types";
import { env } from "@/env";
import { getColorsFromString } from "@/theme/colors";
import { setSession } from "@/auth/session-edge";

type MicrosoftUserInfo = {
	id: string;
	displayName: string;
	mail: string;
};

async function getUserInfoFromCode(code: string): Promise<MicrosoftUserInfo | null> {
	const tokenResponse = await fetch(`https://login.microsoftonline.com/${env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: env.MICROSOFT_CLIENT_ID,
			scope: "User.Read",
			code: code,
			redirect_uri: env.AUTH_CALLBACK_URL,
			grant_type: "authorization_code",
			client_secret: env.MICROSOFT_CLIENT_SECRET,
		}),
	}).then((res) => res.json());

	const accessToken = tokenResponse.access_token;

	if (!accessToken) return null;

	const userData = await fetch("https://graph.microsoft.com/v1.0/me", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	}).then((res) => res.json());

	if (!userData.id) return null;

	const user: MicrosoftUserInfo = {
		id: userData.id,
		displayName: userData.displayName,
		mail: userData.mail?.toLowerCase(),
	};

	return user;
}

export async function GET(req: NextRequest) {
	const code = new URL(req.url).searchParams.get("code") ?? "";

	const userInfo = await getUserInfoFromCode(code);

	if (!userInfo) return NextResponse.redirect(new URL("/login-failed", req.url));

	let user: User | undefined = await db.query.users.findFirst({
		where: eq(users.microsoftId, userInfo.id),
	});

	if (!user) {
		const colors = getColorsFromString(userInfo.displayName);

		const newUser = await db
			.insert(users)
			.values({
				microsoftId: userInfo.id,
				name: userInfo.displayName,
				email: userInfo.mail,
				colors,
			})
			.returning({ insertedId: users.id });

		user = {
			id: newUser[0].insertedId,
			microsoftId: userInfo.id,
			name: userInfo.displayName,
			email: userInfo.mail,
			colors,
			class: null,
			isAttending: false,
			isTeacher: false,
			isPresenting: false,
			isAdmin: false,
		};
	}

	await setSession(user);

	return NextResponse.redirect(new URL("/", req.url));
}
