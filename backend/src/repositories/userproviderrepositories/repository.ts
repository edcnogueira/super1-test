import type { DrizzleClient } from "@/repositories/drizzle/types.ts";
import {
	type CreateRequest,
	type CreateResponse,
	createUserProvider,
} from "@/repositories/userproviderrepositories/create.ts";
import {
	type GetByEmailRequest,
	type GetByEmailResponse,
	getUserProviderByEmail,
} from "@/repositories/userproviderrepositories/getByEmail.ts";

export type RepositoryContext = {
	correlationId?: string;
};

export interface UserProviderRepository {
	create(ctx: RepositoryContext, req: CreateRequest): Promise<CreateResponse>;
	getByEmail(
		ctx: RepositoryContext,
		req: GetByEmailRequest,
	): Promise<GetByEmailResponse>;
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

	async getByEmail(
		ctx: RepositoryContext,
		req: GetByEmailRequest,
	): Promise<GetByEmailResponse> {
		return getUserProviderByEmail(this.db, ctx, req);
	}
}
