import { randomUUIDv7 } from "bun";
import {
	boolean,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const serviceTypes = pgTable("service_types", {
	id: uuid("id")
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	icon: varchar("icon", { length: 255 }),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
});
