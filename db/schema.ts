import { boolean, integer, jsonb, pgTable, varchar } from "drizzle-orm/pg-core";

import { User } from "@/lib/types";

export const users = pgTable("users", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	microsoftId: varchar("microsoft_id", { length: 63 }).notNull().unique(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	colors: jsonb("colors").notNull().$type<User["colors"]>(),
	class: varchar("class", { length: 16 }),
	isAttending: boolean("is_attending").notNull().default(false),
	isPresenting: boolean("is_presenting").notNull().default(false),
	isAdmin: boolean("is_admin").notNull().default(false),
});
