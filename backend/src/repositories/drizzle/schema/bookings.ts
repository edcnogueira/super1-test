import { randomUUIDv7 } from "bun";
import {
	date,
	index,
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	time,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { providers } from "@/repositories/drizzle/schema/providers.ts";
import { services } from "@/repositories/drizzle/schema/services.ts";
import { serviceVariations } from "@/repositories/drizzle/schema/serviceVariations.ts";
import { userCustomers } from "@/repositories/drizzle/schema/userCustomers.ts";

export const bookingStatusEnum = pgEnum("booking_status", [
	"pending",
	"confirmed",
	"completed",
	"cancelled",
]);

export const bookings = pgTable(
	"bookings",
	{
		id: uuid("id")
			.primaryKey()
			.$defaultFn(() => randomUUIDv7()),
		clientId: uuid("client_id")
			.notNull()
			.references(() => userCustomers.id),
		providerId: uuid("provider_id")
			.notNull()
			.references(() => providers.userProviderId),
		serviceId: uuid("service_id")
			.notNull()
			.references(() => services.id),
		serviceVariationId: uuid("service_variation_id")
			.notNull()
			.references(() => serviceVariations.id),
		bookingDate: date("booking_date").notNull(),
		bookingTime: time("booking_time").notNull(),
		durationMinutes: integer("duration_minutes").notNull(),
		price: numeric("price", { precision: 10, scale: 2 }).notNull(),
		status: bookingStatusEnum("status").default("confirmed"),
		notes: text("notes"),
		createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow(),
	},
	(table) => ({
		idxProviderDate: index("idx_provider_date").on(
			table.providerId,
			table.bookingDate,
			table.bookingTime,
		),
		idxClientBookings: index("idx_client_bookings").on(
			table.clientId,
			table.createdAt,
		),
		uniqueBooking: uniqueIndex("unique_booking").on(
			table.providerId,
			table.bookingDate,
			table.bookingTime,
			table.durationMinutes,
		),
	}),
);
