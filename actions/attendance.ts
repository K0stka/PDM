"use server";

import { Event, User } from "@/lib/types";
import { UnauthorizedError, UserError } from "@/lib/utils";
import {
    and,
    asc,
    attendance,
    blocks as blocksTable,
    db,
    eq,
    users,
} from "@/db";
import { recalculateAll, recalculateEventAttending } from "./lookup";
import { session, validateUser } from "@/auth/session";

import { AttendanceClientState } from "@/app/private/admin/utility/_components/editUser";
import { UserErrorType } from "@/lib/utilityTypes";

export type AttendanceState = {
    id: number;
    from: Date;
    to: Date;
    attendance: Event["id"] | null;
    events: {
        id: number;
        name: string;
    }[];
}[];

export const getAttendanceStateForUserId = async (
    userId: User["id"],
): Promise<AttendanceState | UserErrorType> => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const blocks = await db.query.blocks.findMany({
        orderBy: asc(blocksTable.from),
        with: {
            events: {
                with: {
                    archetype: {
                        columns: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    const userAttendances = await db.query.attendance.findMany({
        where: eq(attendance.user, userId),
        with: {
            event: true,
        },
    });

    const blockAttendances: { [key: number]: Event["id"] } = {};

    userAttendances.forEach((a) => {
        blockAttendances[a.event.block] = a.event.id;
    });

    return blocks.map((block) => ({
        id: block.id,
        from: block.from,
        to: block.to,
        attendance: blockAttendances[block.id] ?? null,
        events: block.events.map((e) => ({
            id: e.id,
            name: e.archetype.name,
        })),
    }));
};

export const saveUserAttendances = async (
    userId: number,
    attendances: AttendanceClientState,
) => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const target = await db.query.users.findFirst({
        where: and(eq(users.id, userId), eq(users.isAttending, true)),
    });

    if (!target) return UserError("Uživatel není účastníkem");

    await db.delete(attendance).where(eq(attendance.user, userId));

    const inserts = Object.values(attendances)
        .filter((a) => a !== null)
        .map((a) => ({
            user: userId,
            event: a,
        }));

    await db.insert(attendance).values(inserts);

    await recalculateAll();
};
