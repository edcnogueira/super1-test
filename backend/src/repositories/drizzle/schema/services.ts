import { randomUUIDv7 } from "bun";
import {
	boolean,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { providers } from "@/repositories/drizzle/schema/providers.ts";
import { serviceTypes } from "@/repositories/drizzle/schema/serviceTypes.ts";

export const services = pgTable("services", {
	id: uuid("id")
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	providerId: uuid("provider_id")
		.notNull()
		.references(() => providers.userProviderId),
	serviceTypeId: uuid("service_type_id")
		.notNull()
		.references(() => serviceTypes.id),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow(),
});
