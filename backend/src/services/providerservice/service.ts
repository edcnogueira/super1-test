import type { ProviderRepository } from "@/repositories/providerrepositories/repository.ts";

import {
	type CreateRequest,
	type CreateResponse,
	createProvider,
} from "@/services/providerservice/create.ts";

export type ServiceContext = {
	correlationId?: string;
};

export interface Service {
	create(ctx: ServiceContext, req: CreateRequest): Promise<CreateResponse>;
}

export class ProviderService implements Service {
	private readonly repository: ProviderRepository;

	constructor(repository: ProviderRepository) {
		this.repository = repository;
	}

	async create(
		ctx: ServiceContext,
		req: CreateRequest,
	): Promise<CreateResponse> {
		return createProvider(this.repository, ctx, req);
	}
}
