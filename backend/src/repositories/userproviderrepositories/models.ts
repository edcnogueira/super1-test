import type { InferSelectModel } from "drizzle-orm";
import type { schema } from "@/repositories/drizzle/schema";

export type UserProvider = {
	id: string;
	email: string;
	passwordHash: string;
	name: string;
	phone?: string | null;
	createdAt: Date | null;
	updatedAt: Date | null;
};

export type DbUserProvider = InferSelectModel<typeof schema.userProviders>;

export function toUserProvider(row: DbUserProvider | undefined): UserProvider {
	if (!row) {
		throw new Error("User provider not found");
	}
	return {
		id: row.id,
		email: row.email,
		passwordHash: row.passwordHash,
		name: row.name,
		phone: row.phone ?? null,
		createdAt: row.createdAt ?? null,
		updatedAt: row.updatedAt ?? null,
	};
}
