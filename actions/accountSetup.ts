"use server";

import { UserError, inlineCatch } from "@/lib/utils";
import { db, eq, users } from "@/db";

import { accountSetupSchema } from "@/validation/accountSetup";
import { revalidatePath } from "next/cache";
import { session } from "@/auth/session";

export const accountSetup = async (unsafe: accountSetupSchema) => {
	const user = await session();

	if (user.isAttending || user.isTeacher || user.isPresenting || user.isAdmin) return UserError("Neplatný stav uživatele");

	const [data, error] = inlineCatch(() => accountSetupSchema.parse(unsafe));

	if (error) return UserError(error);

	if (data.class && data.isTeacher) return UserError("Nemůžete být učitelem a současně být žákem třídy");
	if (!data.class && !data.isTeacher) return UserError("Musíte být buď učitelem nebo žákem třídy");

	if (data.class) await db.update(users).set({ isAttending: true, class: data.class }).where(eq(users.id, user.id));
	else await db.update(users).set({ isTeacher: true }).where(eq(users.id, user.id));

	revalidatePath("/", "layout");
};
