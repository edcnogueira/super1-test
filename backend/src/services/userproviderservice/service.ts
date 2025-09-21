import type { UserProviderRepository } from "@/repositories/userproviderrepositories/repository.ts";
import {
	type CreateRequest,
	type CreateResponse,
	createUserProvider,
} from "@/services/userproviderservice/create.ts";

export type ServiceContext = {
	correlationId?: string;
};

export interface Service {
	create(ctx: ServiceContext, req: CreateRequest): Promise<CreateResponse>;
}

export class UserProviderService implements Service {
	private readonly repository: UserProviderRepository;

	constructor(repository: UserProviderRepository) {
		this.repository = repository;
	}

	async create(
		ctx: ServiceContext,
		req: CreateRequest,
	): Promise<CreateResponse> {
		return createUserProvider(this.repository, ctx, req);
	}
}
