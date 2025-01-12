import { SignJWT, jwtVerify } from "jose";

import { Session } from "@/lib/types";
import { cache } from "react";
import { cookies } from "next/headers";
import { env } from "@/env";
import { z } from "zod";

const encodedKey = new TextEncoder().encode(env.AUTH_SECRET);

const session_cookie_name = "session";
const session_cookie_max_age = 1000 * 60 * 60 * 24 * 7; // 1 week

const SessionUserRecordSchema = z.object({
	id: z.number(),
	isAttending: z.boolean(),
	isPresenting: z.boolean(),
	isAdmin: z.boolean(),
});

export const getSession: () => Promise<Session | null> = cache(async () => {
	const cookieStore = await cookies();
	const cookie = cookieStore.get(session_cookie_name)?.value;

	if (!cookie) return null;

	return decryptSession(cookie);
});

export async function setSession(user: Session) {
	const cookieStore = await cookies();

	const expiresAt = new Date(Date.now() + session_cookie_max_age);
	const cookie = await encryptSession(user);

	await cookieStore.set(session_cookie_name, cookie, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: "lax",
		path: "/",
	});
}

export async function updateSession(user: Partial<Session>) {
	const sessionUser = await getSession();

	if (!sessionUser) return;

	await setSession({ ...sessionUser, ...user });
}

export async function removeSession() {
	const cookieStore = await cookies();
	await cookieStore.delete(session_cookie_name);
}

async function encryptSession(user: Session): Promise<string> {
	return new SignJWT(user as any).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(encodedKey);
}

async function decryptSession(session: string): Promise<Session | null> {
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ["HS256"],
		});

		return SessionUserRecordSchema.parse(payload);
	} catch (error) {
		return null;
	}
}
