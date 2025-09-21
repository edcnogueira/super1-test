import type { AnyElysia } from "elysia";
import { z } from "zod";
import { registerUserProviderTransport } from "@/transport/http/userprovider/transport.ts";

export function registerRoutes(app: AnyElysia) {
	app.get("/health", () => ({ status: "ok" as const }), {
		detail: { tags: ["System"], summary: "Health check" },
		response: { 200: z.object({ status: z.literal("ok") }) },
	});

	app.group("/api", (api) => {
		registerUserProviderTransport(api);
		return api;
	});

	return app;
}
