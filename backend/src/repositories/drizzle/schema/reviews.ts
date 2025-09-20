import { randomUUIDv7 } from "bun";
import { pgTable, smallint, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { bookings } from "@/repositories/drizzle/schema/bookings.ts";
import { providers } from "@/repositories/drizzle/schema/providers.ts";
import { userCustomers } from "@/repositories/drizzle/schema/userCustomers.ts";

export const reviews = pgTable("reviews", {
	id: uuid("id")
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	bookingId: uuid("booking_id")
		.notNull()
		.references(() => bookings.id),
	clientId: uuid("client_id")
		.notNull()
		.references(() => userCustomers.id),
	providerId: uuid("provider_id")
		.notNull()
		.references(() => providers.userProviderId),
	rating: smallint("rating").notNull(),
	comment: text("comment"),
	createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
});
