import type { DrizzleClient } from "@/repositories/drizzle/types.ts";
import {
	type CreateRequest,
	type CreateResponse,
	createUserProvider,
} from "@/repositories/userproviderrepositories/create.ts";

export type RepositoryContext = {
	correlationId?: string;
};

export interface UserProviderRepository {
	create(ctx: RepositoryContext, req: CreateRequest): Promise<CreateResponse>;
}

export class DrizzleUserProviderRepository implements UserProviderRepository {
	private readonly db: DrizzleClient;

	constructor(db: DrizzleClient) {
		this.db = db;
	}

	async create(
		ctx: RepositoryContext,
		req: CreateRequest,
	): Promise<CreateResponse> {
		return createUserProvider(this.db, ctx, req);
	}
}
