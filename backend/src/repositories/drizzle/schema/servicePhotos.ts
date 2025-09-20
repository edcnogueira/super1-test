import { randomUUIDv7 } from "bun";
import {
	integer,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { services } from "@/repositories/drizzle/schema/services.ts";

export const servicePhotos = pgTable("service_photos", {
	id: uuid("id")
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	serviceId: uuid("service_id")
		.notNull()
		.references(() => services.id),
	photoUrl: varchar("photo_url", { length: 500 }).notNull(),
	altText: varchar("alt_text", { length: 255 }),
	orderIndex: integer("order_index").default(0),
	createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
});
