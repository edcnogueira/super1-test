import type { AnyElysia } from "elysia";
import { env } from "@/config/env.ts";
import { createJwtManager } from "@/providers/jwtmanager/provider.ts";
import { Database } from "@/repositories/drizzle/client.ts";
import { DrizzleUserProviderRepository } from "@/repositories/userproviderrepositories/repository.ts";
import { UserProviderService } from "@/services/userproviderservice/service.ts";
import { create, documentation } from "./create.ts";

export function registerUserProviderTransport(app: AnyElysia) {
	const db = Database.instance;
	const repo = new DrizzleUserProviderRepository(db);
	const jwt = createJwtManager({
		secret: env.JWT_SECRET || "dev-secret",
		issuer: env.JWT_ISSUER || "super1",
		audience: env.JWT_AUDIENCE || "user_provider",
		defaultExpiresIn: env.JWT_EXPIRES_IN || "1d",
	});
	const service = new UserProviderService(repo, jwt);

	return app.group("/user-providers", (api) => {
		api.post(
			"/signup",
			async ({ request, body, set }) => create({ request, body, set, service }),
			documentation,
		);
		return api;
	});
}
