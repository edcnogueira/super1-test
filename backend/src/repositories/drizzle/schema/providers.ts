import {
	boolean,
	integer,
	numeric,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { userProviders } from "@/repositories/drizzle/schema/userProviders.ts";

export const providers = pgTable(
	"providers",
	{
		userProviderId: uuid("user_provider_id")
			.notNull()
			.references(() => userProviders.id),
		description: text("description"),
		experienceYears: integer("experience_years"),
		city: varchar("city", { length: 100 }),
		neighborhood: varchar("neighborhood", { length: 100 }),
		latitude: numeric("latitude", { precision: 10, scale: 8 }),
		longitude: numeric("longitude", { precision: 11, scale: 8 }),
		isActive: boolean("is_active").default(true),
		createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userProviderId], name: "providers_pkey" }),
	}),
);
