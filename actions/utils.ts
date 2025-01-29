"use server";

import { Archetype, Block, Event, Place } from "@/lib/types";
import { claims as Claims, users as Users, attendance, db, eq } from "@/db";
import { UnauthorizedError, createMapById } from "@/lib/utils";
import { session, validateUser } from "@/auth/session";

import { recalculateAll } from "./lookup";

export const generateAttendances = async () => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    await db.delete(attendance);

    await recalculateAll();

    const attendees = await db.query.users.findMany({
        where: eq(Users.isAttending, true),
        with: {
            claims: {
                where: eq(Claims.secondary, false),
            },
        },
    });

    const blocks = await db.query.blocks.findMany({
        with: {
            events: true,
        },
    });

    for await (const block of blocks) {
        const eventsByArchetype = new Map<
            Archetype["id"],
            (Pick<Event, "id" | "capacity" | "attending"> & {
                archetype: Archetype["id"];
                block: Block["id"];
                place: Place["id"];
            })[]
        >();

        const eventPercentage = new Map<Event["id"], number>();
        const eventPercentPointPerUser = new Map<Event["id"], number>();

        const attendances: {
            user: number;
            event: number;
        }[] = [];

        block.events.forEach((event) => {
            if (!eventsByArchetype.has(event.archetype))
                eventsByArchetype.set(event.archetype, [] as any);

            eventsByArchetype.get(event.archetype)!.push({
                id: event.id,
                capacity: event.capacity,
                attending: 0,
                archetype: event.archetype,
                block: event.block,
                place: event.place,
            });

            eventPercentage.set(event.id, 0);
            eventPercentPointPerUser.set(event.id, 1 / event.capacity);
        });

        const usersWithoutClaim: typeof attendees = [];

        attendees.forEach((user) => {
            const claim = user.claims.find((claim) => claim.block === block.id);

            if (!claim) {
                usersWithoutClaim.push(user);
                return;
            }

            const events = eventsByArchetype.get(claim.archetype)!;

            // Implement round-robin
            const chosenEvent = events[0];

            attendances.push({
                user: claim.user,
                event: chosenEvent.id,
            });

            eventPercentage.set(
                chosenEvent.id,
                eventPercentage.get(chosenEvent.id)! +
                    eventPercentPointPerUser.get(chosenEvent.id)!,
            );
        });

        usersWithoutClaim.forEach((user) => {
            const eventWithLowestPercentage = Array.from(
                eventPercentage,
            ).reduce(
                (acc, [id, percentage]) =>
                    percentage < acc.percentage ? { id, percentage } : acc,
                { id: -1, percentage: 1000 },
            );

            attendances.push({
                user: user.id,
                event: eventWithLowestPercentage.id,
            });

            eventPercentage.set(
                eventWithLowestPercentage.id,
                eventWithLowestPercentage.percentage +
                    eventPercentPointPerUser.get(eventWithLowestPercentage.id)!,
            );
        });

        await db.insert(attendance).values(attendances);
    }

    await recalculateAll();
};
