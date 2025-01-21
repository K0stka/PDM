"use server";

import { UnauthorizedError, UserError, inlineCatch } from "@/lib/utils";
import { claims, db, eq, users } from "@/db";
import { session, validateUser } from "@/auth/session";

import { accountSetupSchema } from "@/validation/accountSetup";
import { configuration } from "@/configuration/configuration";
import { revalidatePath } from "next/cache";

export const accountSetup = async (unsafe: accountSetupSchema) => {
    const user = await session();

    if (user.isAttending || user.isTeacher || user.isPresenting || user.isAdmin)
        return UserError("Neplatný stav uživatele");

    const [data, error] = inlineCatch(() => accountSetupSchema.parse(unsafe));

    if (error) return UserError(error);

    if (data.class && data.isTeacher)
        return UserError("Nemůžete být učitelem a současně být žákem třídy");
    if (!data.class && !data.isTeacher)
        return UserError("Musíte být buď učitelem nebo žákem třídy");

    if (data.class)
        await db
            .update(users)
            .set({ isAttending: true, class: data.class })
            .where(eq(users.id, user.id));
    else
        await db
            .update(users)
            .set({ isTeacher: true })
            .where(eq(users.id, user.id));

    revalidatePath("/", "layout");
};

export const setWillAttend = async (willAttend: boolean) => {
    const user = await session();

    if (
        configuration.openClaimsOn.getTime() > Date.now() ||
        configuration.closeClaimsOn.getTime() < Date.now()
    )
        return UnauthorizedError();

    if (validateUser(user, { isAttending: true }) === willAttend) return;

    if (!user.class) return UserError("Musíte být žákem třídy");

    if (validateUser(user, { isAttending: true }))
        await db.delete(claims).where(eq(claims.user, user.id));

    await db
        .update(users)
        .set({ isAttending: !user.isAttending })
        .where(eq(users.id, user.id));

    revalidatePath("/", "layout");
};
