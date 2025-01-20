import {
    boolean,
    index,
    integer,
    jsonb,
    pgTable,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/pg-core";

import { User } from "@/lib/types";

export const users = pgTable(
    "users",
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        microsoftId: varchar("microsoft_id", { length: 63 }).notNull().unique(),
        name: varchar("name", { length: 255 }).notNull(),
        email: varchar("email", { length: 255 }).notNull().unique(),
        colors: jsonb("colors").notNull().$type<User["colors"]>(),
        class: varchar("class", { length: 16 }),
        isAttending: boolean("is_attending").notNull().default(false),
        isTeacher: boolean("is_teacher").notNull().default(false),
        isPresenting: boolean("is_presenting").notNull().default(false),
        isAdmin: boolean("is_admin").notNull().default(false),
    },
    (table) => [uniqueIndex("microsoft_id_index").on(table.microsoftId)],
);

export const archetypes = pgTable("archetypes", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 2047 }).notNull(),
    canceled: boolean("canceled").notNull().default(false),
});

export const blocks = pgTable("blocks", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    from: timestamp("from", { mode: "date" }).notNull(),
    to: timestamp("to", { mode: "date" }).notNull(),
});

export const places = pgTable("places", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 63 }).notNull(),
});

export const events = pgTable(
    "events",
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        archetype: integer("archetype")
            .notNull()
            .references(() => archetypes.id),
        block: integer("block")
            .notNull()
            .references(() => blocks.id),
        place: integer("place")
            .notNull()
            .references(() => places.id),
        capacity: integer("capacity").notNull(),
    },
    (table) => [
        uniqueIndex("event_block_place_index").on(table.block, table.place),
        index("event_block_index").on(table.block),
        index("event_place_index").on(table.place),
        index("event_archetype_index").on(table.archetype),
        index("event_block_archetype_index").on(table.block, table.archetype),
    ],
);

export const presenters = pgTable(
    "presenters",
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        user: integer("user")
            .notNull()
            .references(() => users.id),
        event: integer("event")
            .notNull()
            .references(() => events.id),
    },
    (table) => [
        index("presenter_user_index").on(table.user),
        index("presenter_event_index").on(table.event),
    ],
);

export const interests = pgTable(
    "interests",
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        user: integer("user")
            .notNull()
            .references(() => users.id),
        archetype: integer("archetype")
            .notNull()
            .references(() => archetypes.id),
    },
    (table) => [
        index("interest_user_index").on(table.user),
        index("interest_archetype_index").on(table.archetype),
    ],
);

export const claims = pgTable(
    "claims",
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        user: integer("user")
            .notNull()
            .references(() => users.id),
        archetype: integer("archetype")
            .notNull()
            .references(() => archetypes.id),
        block: integer("block")
            .notNull()
            .references(() => blocks.id),
        secondary: boolean("secondary").notNull().default(false),
        cancelled: boolean("cancelled").notNull().default(false),
        timestamp: timestamp("timestamp").notNull(),
    },
    (table) => [
        index("claim_user_index").on(table.user),
        index("claim_archetype_index").on(table.archetype),
        index("claim_backup_archetype_index").on(table.archetype),
        index("claim_block_index").on(table.block),
    ],
);

export const attendance = pgTable(
    "attendance",
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        user: integer("user")
            .notNull()
            .references(() => users.id),
        event: integer("event")
            .notNull()
            .references(() => events.id),
        wasPresent: boolean("was_present").notNull().default(false),
    },
    (table) => [
        index("attendance_user_index").on(table.user),
        index("attendance_event_index").on(table.event),
    ],
);
