"use server";

import { UnauthorizedError, UserError, inlineCatch } from "@/lib/utils";
import { db, eq, events, users } from "@/db";
import { session, validateUser } from "@/auth/session";

import { User } from "@/lib/types";
import { UserErrorType } from "@/lib/utilityTypes";
import { editUserSchema } from "@/validation/user";
import { revalidatePath } from "next/cache";

export const editUser = async (unsafe: editUserSchema) => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const [date, error] = inlineCatch(() => editUserSchema.parse(unsafe));

    if (error) return UserError(error);

    const exists = await db.query.users.findFirst({
        where: eq(users.id, date.id),
    });

    if (!exists) return UserError("Neplatné ID uživatele");

    const userClass = date.class === "none" ? null : date.class;

    await db
        .update(users)
        .set({
            name: date.name,
            email: date.email,
            class: userClass,
            isAttending: date.isAttending,
            isTeacher: date.isTeacher,
            isPresenting: date.isPresenting,
            isAdmin: date.isAdmin,
        })
        .where(eq(users.id, date.id));

    revalidatePath("/admin/users");
};

export const getPossibleEventPresenters = async (
    blockId: number,
): Promise<UserErrorType | Pick<User, "id" | "name">[]> => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const exists = await db.query.blocks.findFirst({
        where: eq(users.id, blockId),
    });

    if (!exists) return UserError("Neplatné ID bloku");

    // TODO: Fix

    // const presenters = await db.query.users.findMany({
    // 	where: eq(users.isPresenting, true),
    // 	with: {
    // 		presents: {
    // 			columns: {},
    // 			with: {
    // 				event: {
    // 					columns: {
    // 						block: true,
    // 					},
    // 				},
    // 			},
    // 			where: eq(events.block, blockId),
    // 		},
    // 	},
    // });

    return [];
};
