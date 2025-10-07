import { schema } from "@/repositories/drizzle/schema";
import type { DrizzleClient } from "@/repositories/drizzle/types.ts";
import {
	type Provider,
	toProvider,
} from "@/repositories/providerrepositories/models.ts";
import type { RepositoryContext } from "@/repositories/providerrepositories/repository.ts";

export type CreateRequest = {
	userProviderId: string;
	description?: string | null;
	experienceYears?: number | null;
	city?: string | null;
	neighborhood?: string | null;
	latitude?: number | null;
	longitude?: number | null;
	isActive?: boolean | null;
};
export type CreateResponse = { provider: Provider };

export async function createProvider(
	db: DrizzleClient,
	_ctx: RepositoryContext,
	req: CreateRequest,
): Promise<CreateResponse> {
	try {
		const [row] = await db
			.insert(schema.providers)
			.values({
				userProviderId: req.userProviderId,
				description: req.description ?? null,
				experienceYears: req.experienceYears ?? null,
				city: req.city ?? null,
				neighborhood: req.neighborhood ?? null,
				latitude:
					req.latitude === null || req.latitude === undefined
						? null
						: String(req.latitude),
				longitude:
					req.longitude === null || req.longitude === undefined
						? null
						: String(req.longitude),
				isActive: req.isActive ?? true,
			})
			.returning();

		return { provider: toProvider(row) };
	} catch (error) {
		throw new Error(
			"Error creating provider: " +
				(error instanceof Error ? error.message : String(error)),
		);
	}
}
