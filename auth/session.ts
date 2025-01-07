import "server-only";

import { JWTPayload, SignJWT, jwtVerify } from "jose";

import { SessionUserRecord } from "@/lib/types";
import { cache } from "react";
import { cookies } from "next/headers";
import { env } from "@/env";
import { redirect } from "next/navigation";
import { z } from "zod";

const encodedKey = new TextEncoder().encode(env.AUTH_SECRET);

const session_cookie_name = "session";
const session_cookie_max_age = 1000 * 60 * 60 * 24 * 7; // 1 week

export async function setSessionUserRecord(user: SessionUserRecord) {
	const cookieStore = await cookies();

	const expiresAt = new Date(Date.now() + session_cookie_max_age);
	const cookie = await encryptSessionUserRecord(user);

	cookieStore.set(session_cookie_name, cookie, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: "lax",
		path: "/",
	});

	redirect("/");
}

export const getSessionUserRecord: () => Promise<SessionUserRecord | null> = cache(async () => {
	const cookieStore = await cookies();
	const cookie = cookieStore.get(session_cookie_name)?.value;

	if (!cookie) return null;

	return decryptSessionUserRecord(cookie);
});

export async function removeSessionUser() {
	const cookieStore = await cookies();
	cookieStore.delete(session_cookie_name);

	redirect("/");
}

async function encryptSessionUserRecord(user: SessionUserRecord): Promise<string> {
	return new SignJWT(user as any).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(encodedKey);
}

async function decryptSessionUserRecord(session: string): Promise<SessionUserRecord | null> {
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ["HS256"],
		});

		return z
			.object({
				id: z.number(),
				isAttending: z.boolean(),
				isPresenting: z.boolean(),
				isAdmin: z.boolean(),
			})
			.parse(payload);
	} catch (error) {
		return null;
	}
}
