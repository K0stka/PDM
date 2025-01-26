import {
    archetypes,
    attendance,
    blockArchetypeLookup,
    blocks,
    claims,
    events,
    interests,
    places,
    presenters,
    users,
} from "./models";

import { relations } from "drizzle-orm";

export const userRelations = relations(users, ({ many }) => ({
    presents: many(presenters),
    interests: many(interests),
    claims: many(claims),
    attendances: many(attendance),
}));

export const archetypeRelations = relations(archetypes, ({ many }) => ({
    interests: many(interests),
    claims: many(claims),
    events: many(events),
    blockLookup: many(blockArchetypeLookup),
}));

export const blockRelations = relations(blocks, ({ many }) => ({
    events: many(events),
    claims: many(claims),
    archetypeLookup: many(blockArchetypeLookup),
}));

export const placeRelations = relations(places, ({ many }) => ({
    events: many(events),
}));

export const eventRelations = relations(events, ({ many, one }) => ({
    archetype: one(archetypes, {
        fields: [events.archetype],
        references: [archetypes.id],
    }),
    block: one(blocks, {
        fields: [events.block],
        references: [blocks.id],
    }),
    place: one(places, {
        fields: [events.place],
        references: [places.id],
    }),
    presenters: many(presenters),
    attendances: many(attendance),
}));

export const presenterRelations = relations(presenters, ({ one }) => ({
    user: one(users, {
        fields: [presenters.user],
        references: [users.id],
    }),
    event: one(events, {
        fields: [presenters.event],
        references: [events.id],
    }),
}));

export const interestRelations = relations(interests, ({ one }) => ({
    user: one(users, {
        fields: [interests.user],
        references: [users.id],
    }),
    archetype: one(archetypes, {
        fields: [interests.archetype],
        references: [archetypes.id],
    }),
}));

export const claimRelations = relations(claims, ({ one }) => ({
    user: one(users, {
        fields: [claims.user],
        references: [users.id],
    }),
    archetype: one(archetypes, {
        fields: [claims.archetype],
        references: [archetypes.id],
    }),
    block: one(blocks, {
        fields: [claims.block],
        references: [blocks.id],
    }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
    user: one(users, {
        fields: [attendance.user],
        references: [users.id],
    }),
    event: one(events, {
        fields: [attendance.event],
        references: [events.id],
    }),
}));

export const blockArchetypeLookupRelations = relations(
    blockArchetypeLookup,
    ({ one }) => ({
        block: one(blocks, {
            fields: [blockArchetypeLookup.block],
            references: [blocks.id],
        }),
        archetype: one(archetypes, {
            fields: [blockArchetypeLookup.archetype],
            references: [archetypes.id],
        }),
    }),
);
