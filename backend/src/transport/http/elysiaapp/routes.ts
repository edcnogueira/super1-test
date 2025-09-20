import type { AnyElysia } from "elysia";
import { t } from "elysia";

export function registerRoutes(app: AnyElysia) {
	app.get("/health", () => ({ status: "ok" as const }), {
		detail: { tags: ["System"], summary: "Health check" },
		response: { 200: t.Object({ status: t.Literal("ok") }) },
	});

	app.group("/api", (api) => api);

	return app;
}
