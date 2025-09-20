import { randomUUIDv7 } from "bun";
import {
	boolean,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { services } from "@/repositories/drizzle/schema/services.ts";

export const serviceVariations = pgTable("service_variations", {
	id: uuid("id")
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	serviceId: uuid("service_id")
		.notNull()
		.references(() => services.id),
	name: varchar("name", { length: 255 }).notNull(),
	price: numeric("price", { precision: 10, scale: 2 }).notNull(),
	durationMinutes: integer("duration_minutes").notNull(),
	description: text("description"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow(),
});
