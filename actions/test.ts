"use server";

import { UserError } from "@/lib/utils";

export const test = async (id: string) => {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	return { id };
};

export const test2 = async (id: string) => {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	if (id === "user-error") throw new UserError("User error");

	if (id === "server-error") throw new Error("Server error");

	return { id };
};
