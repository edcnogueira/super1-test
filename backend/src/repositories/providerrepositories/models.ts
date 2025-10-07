import type { InferSelectModel } from "drizzle-orm";
import type { schema } from "@/repositories/drizzle/schema";

export type Provider = {
	userProviderId: string;
	description?: string | null;
	experienceYears?: number | null;
	city?: string | null;
	neighborhood?: string | null;
	latitude?: number | null;
	longitude?: number | null;
	isActive?: boolean | null;
	createdAt: Date | null;
	updatedAt: Date | null;
};

export type DbProvider = InferSelectModel<typeof schema.providers>;

function toNullableNumber(value: unknown): number | null {
	if (value === null || value === undefined) return null;
	const n = Number(value);
	return Number.isNaN(n) ? null : n;
}

export function toProvider(row: DbProvider | undefined): Provider {
	if (!row) {
		throw new Error("Provider not found");
	}
	return {
		userProviderId: row.userProviderId,
		description: row.description ?? null,
		experienceYears: row.experienceYears ?? null,
		city: row.city ?? null,
		neighborhood: row.neighborhood ?? null,
		latitude: toNullableNumber((row as any).latitude ?? null),
		longitude: toNullableNumber((row as any).longitude ?? null),
		isActive: (row as any).isActive ?? null,
		createdAt: row.createdAt ?? null,
		updatedAt: row.updatedAt ?? null,
	};
}
