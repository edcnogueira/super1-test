import { randomUUIDv7 } from "bun";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userProviders = pgTable("user_provider", {
	id: uuid("id")
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	email: varchar("email", { length: 255 }).notNull().unique(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	phone: varchar("phone", { length: 20 }),
	createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow(),
});
