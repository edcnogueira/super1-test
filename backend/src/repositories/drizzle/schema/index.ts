import {
	bookingStatusEnum,
	bookings,
} from "@/repositories/drizzle/schema/bookings.ts";
import { providerAvailabilities } from "@/repositories/drizzle/schema/providerAvailabilities.ts";
import { providers } from "@/repositories/drizzle/schema/providers.ts";
import { reviews } from "@/repositories/drizzle/schema/reviews.ts";
import { servicePhotos } from "@/repositories/drizzle/schema/servicePhotos.ts";
import { services } from "@/repositories/drizzle/schema/services.ts";
import { serviceTypes } from "@/repositories/drizzle/schema/serviceTypes.ts";
import { serviceVariations } from "@/repositories/drizzle/schema/serviceVariations.ts";
import { userCustomers } from "@/repositories/drizzle/schema/userCustomers.ts";
import { userProviders } from "@/repositories/drizzle/schema/userProviders.ts";

export const schema = {
	bookingStatusEnum,
	userCustomers,
	userProviders,
	providers,
	serviceTypes,
	services,
	servicePhotos,
	serviceVariations,
	providerAvailabilities,
	bookings,
	reviews,
};
