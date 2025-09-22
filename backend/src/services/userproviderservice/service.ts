import type { JwtManager } from "@/providers/jwtmanager/provider.ts";
import type { UserProviderRepository } from "@/repositories/userproviderrepositories/repository.ts";
import {
	type CreateRequest,
	type CreateResponse,
	createUserProvider,
} from "@/services/userproviderservice/create.ts";
import type {
	SigninRequest,
	SigninResponse,
} from "@/services/userproviderservice/signin.ts";

export type ServiceContext = {
	correlationId?: string;
};

export interface Service {
	create(ctx: ServiceContext, req: CreateRequest): Promise<CreateResponse>;
	signin(ctx: ServiceContext, req: SigninRequest): Promise<SigninResponse>;
}

export class UserProviderService implements Service {
	private readonly repository: UserProviderRepository;
	private readonly jwt: JwtManager;

	constructor(repository: UserProviderRepository, jwt: JwtManager) {
		this.repository = repository;
		this.jwt = jwt;
	}

	async create(
		ctx: ServiceContext,
		req: CreateRequest,
	): Promise<CreateResponse> {
		return createUserProvider(this.repository, this.jwt, ctx, req);
	}

	async signin(
		ctx: ServiceContext,
		req: SigninRequest,
	): Promise<SigninResponse> {
		const { signinUserProvider } = await import(
			"@/services/userproviderservice/signin.ts"
		);
		return signinUserProvider(this.repository, this.jwt, ctx, req);
	}
}
