import type { AnyElysia } from "elysia";
import { Database } from "@/repositories/drizzle/client.ts";
import { DrizzleUserProviderRepository } from "@/repositories/userproviderrepositories/repository.ts";
import { UserProviderService } from "@/services/userproviderservice/service.ts";
import { create, documentation } from "./create.ts";

export function registerUserProviderTransport(app: AnyElysia) {
	const db = Database.instance;
	const repo = new DrizzleUserProviderRepository(db);
	const service = new UserProviderService(repo);

	return app.group("/user-providers", (api) => {
		api.post(
			"/signup",
			async ({ request, body, set }) => create({ request, body, set, service }),
			documentation,
		);
		return api;
	});
}
