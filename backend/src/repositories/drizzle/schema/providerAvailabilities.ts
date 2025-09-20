import { randomUUIDv7 } from "bun";
import {
	boolean,
	index,
	pgTable,
	smallint,
	time,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { providers } from "@/repositories/drizzle/schema/providers.ts";

export const providerAvailabilities = pgTable(
	"provider_availabilities",
	{
		id: uuid("id")
			.primaryKey()
			.$defaultFn(() => randomUUIDv7()),
		providerId: uuid("provider_id")
			.notNull()
			.references(() => providers.userProviderId),
		dayOfWeek: smallint("day_of_week").notNull(),
		startTime: time("start_time").notNull(),
		endTime: time("end_time").notNull(),
		isActive: boolean("is_active").default(true),
		createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow(),
	},
	(table) => ({
		idxProviderDay: index("idx_provider_day").on(
			table.providerId,
			table.dayOfWeek,
		),
	}),
);
