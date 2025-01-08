"use server";

import "server-only";

import { env } from "@/env";
import { redirect } from "next/navigation";
import { removeSessionUserRecord } from "./session-edge";

export async function login() {
	const TenantId = env.MICROSOFT_TENANT_ID;
	const ClientId = env.MICROSOFT_CLIENT_ID;
	const RedirectURL = env.AUTH_CALLBACK_URL;
	const ApiScope = "User.Read";

	const url = "https://login.microsoftonline.com/" + TenantId + "/oauth2/v2.0/authorize?client_id=" + ClientId + "&response_type=code&redirect_uri=" + RedirectURL + "&response_mode=query&scope=" + ApiScope + "&sso_reload=true";

	redirect(url);
}

export async function logout() {
	await removeSessionUserRecord();

	redirect("/");
}
