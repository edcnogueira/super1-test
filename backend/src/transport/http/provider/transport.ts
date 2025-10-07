import type { AnyElysia } from "elysia";
import { Database } from "@/repositories/drizzle/client.ts";
import { DrizzleProviderRepository } from "@/repositories/providerrepositories/repository.ts";
import { ProviderService } from "@/services/providerservice/service.ts";
import { auth } from "@/transport/http/middlewares/auth.ts";
import { create, documentation as createDoc } from "./create.ts";

export function registerProviderTransport(app: AnyElysia) {
	const db = Database.instance;
	const repo = new DrizzleProviderRepository(db);
	const service = new ProviderService(repo);

	return app.group("/providers", (api) => {
		api.use(auth());

		api.post(
			"/",
			async ({ request, body, set, identity }) =>
				create({ request, body, set, service, identity }),
			createDoc,
		);

		return api;
	});
}
