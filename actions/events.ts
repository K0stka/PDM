"use server";

import { Event, Presenter, User } from "@/lib/types";
import {
    UnauthorizedError,
    UserError,
    catchUserError,
    inlineCatch,
} from "@/lib/utils";
import { and, archetypes, db, eq, events, inArray, presenters } from "@/db";
import { createNewEventSchema, editEventSchema } from "@/validation/events";
import { session, validateUser } from "@/auth/session";

import { UserErrorType } from "@/lib/utilityTypes";
import { getPossibleEventPresenters } from "./user";
import { getPossiblePlacesForEvent } from "./place";
import { revalidatePath } from "next/cache";

export type EditEventDetails = Omit<Event, "archetype"> & {
    presenters: {
        id: Presenter["id"];
        user: Pick<User, "id" | "name" | "colors">;
    }[];
};

export const createNewEvent = async (unsafe: createNewEventSchema) => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const [data, error] = inlineCatch(() => createNewEventSchema.parse(unsafe));

    if (error) return UserError(error);

    // Archetype
    const archetype = await db.query.archetypes.findFirst({
        where: eq(archetypes.id, data.archetype),
    });

    if (!archetype) return UserError("Neplatné ID přednášky");

    // Block
    const block = await db.query.blocks.findFirst({
        where: eq(archetypes.id, data.block),
    });

    if (!block) return UserError("Neplatné ID bloku");

    // Place
    const places_unsafe = await getPossiblePlacesForEvent(data.block);

    const [places, error_places] = catchUserError(places_unsafe);

    if (error_places) return error_places;

    if (!places.find((place) => place.id === data.place))
        return UserError("Neplatné ID místa");

    // Presenters
    const presenters_unsafe = await getPossibleEventPresenters(data.block);

    const [presenters_safe, error_presenters] =
        catchUserError(presenters_unsafe);

    if (error_presenters) return error_presenters;

    if (
        data.presenters.some(
            (p) => !presenters_safe.find((pres) => pres.id === p),
        )
    )
        return UserError("Neplatné ID prezentujícího");

    const inserted_id = (
        await db
            .insert(events)
            .values({
                archetype: data.archetype,
                block: data.block,
                place: data.place,
                capacity: data.capacity,
            })
            .returning({ insertedId: events.id })
    )[0].insertedId;

    if (!inserted_id) return UserError("Nepodařilo se vytvořit přednášku");

    if (data.presenters.length > 0)
        await db.insert(presenters).values(
            data.presenters.map((presenter) => ({
                event: inserted_id,
                user: presenter,
            })),
        );

    revalidatePath("/admin/archetypes");
};

export const editEvent = async (unsafe: editEventSchema) => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const [data, error] = inlineCatch(() => editEventSchema.parse(unsafe));

    if (error) return UserError(error);

    // Event
    const event = await db.query.events.findFirst({
        where: eq(events.id, data.id),
        with: {
            presenters: {
                columns: {
                    user: true,
                },
            },
        },
    });

    if (!event) return UserError("Neplatné ID přednášky");

    // Archetype
    if (event.archetype !== data.archetype)
        return UserError("Nelze změnit typ přednášky");

    // Block
    if (event.block !== data.block) {
        const block = await db.query.blocks.findFirst({
            where: eq(archetypes.id, data.block),
        });

        if (!block) return UserError("Neplatné ID bloku");
    }

    // Place
    if (event.place !== data.place) {
        const places_unsafe = await getPossiblePlacesForEvent(data.block);

        const [places, error_places] = catchUserError(places_unsafe);

        if (error_places) return error_places;

        if (!places.find((place) => place.id === data.place))
            return UserError("Neplatné ID místa");
    }

    // Presenters
    const presenters_unsafe = await getPossibleEventPresenters(data.block);

    const [presenters_safe, error_presenters] =
        catchUserError(presenters_unsafe);

    if (error_presenters) return error_presenters;

    if (
        data.presenters.some(
            (p) =>
                !event.presenters.find((e_p) => e_p.user === p) &&
                !presenters_safe.find((pres) => pres.id === p),
        )
    )
        return UserError("Neplatné ID prezentujícího");

    await db.update(events).set({
        block: data.block,
        place: data.place,
        capacity: data.capacity,
    });

    const to_remove = event.presenters.filter(
        (p) => !data.presenters.includes(p.user),
    );
    if (to_remove.length > 0)
        await db.delete(presenters).where(
            and(
                inArray(
                    presenters.user,
                    to_remove.map((p) => p.user),
                ),
                eq(presenters.event, data.id),
            ),
        );

    const to_add = data.presenters.filter(
        (p) => !event.presenters.find((e_p) => e_p.user === p),
    );
    if (to_add.length > 0)
        await db.insert(presenters).values(
            to_add.map((presenter) => ({
                event: data.id,
                user: presenter,
            })),
        );

    revalidatePath("/admin/archetypes");
};

export const getArchetypeEvents = async (
    archetypeId: number,
): Promise<UserErrorType | EditEventDetails[]> => {
    const user = await session();

    if (!validateUser(user, { isAdmin: true })) return UnauthorizedError();

    const archetype = await db.query.archetypes.findFirst({
        where: eq(archetypes.id, archetypeId),
        columns: {},
        with: {
            events: {
                columns: {
                    id: true,
                    capacity: true,
                },
                with: {
                    block: true,
                    place: true,
                    presenters: {
                        columns: {
                            id: true,
                        },
                        with: {
                            user: {
                                columns: {
                                    id: true,
                                    name: true,
                                    colors: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!archetype) return UserError("Neplatné ID přednášky");

    return archetype.events;
};
