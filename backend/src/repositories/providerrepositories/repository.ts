import type { DrizzleClient } from "@/repositories/drizzle/types.ts";
import {
	type CreateRequest,
	type CreateResponse,
	createProvider,
} from "@/repositories/providerrepositories/create.ts";

export type RepositoryContext = {
	correlationId?: string;
};

export interface ProviderRepository {
	create(ctx: RepositoryContext, req: CreateRequest): Promise<CreateResponse>;
}

export class DrizzleProviderRepository implements ProviderRepository {
	private readonly db: DrizzleClient;

	constructor(db: DrizzleClient) {
		this.db = db;
	}

	async create(
		ctx: RepositoryContext,
		req: CreateRequest,
	): Promise<CreateResponse> {
		return createProvider(this.db, ctx, req);
	}
}
