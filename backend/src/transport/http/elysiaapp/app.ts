import { swagger } from "@elysiajs/swagger";
import Elysia from "elysia";
import type { AppConfig } from "@/config/config.ts";
import { logger } from "../middlewares/logger";
import { registerRoutes } from "./routes";

export type ErrorPayload = { code: string; message: string; details?: unknown };

export function createApp(_: AppConfig) {
	const app = new Elysia({ name: "app" })
		.use(logger)
		.use(
			swagger({
				path: "/docs",
				documentation: {
					info: { title: "API", version: "1.0.0" },
					tags: [{ name: "System", description: "System endpoints" }],
				},
			}),
		)
		.onError(({ code, error, set }) => {
			const payload: ErrorPayload = {
				code: (code as string) ?? "internal_error",
				message:
					error instanceof Error
						? error.message
						: String(error ?? "Internal Server Error"),
			};

			switch (code) {
				case "VALIDATION":
					set.status = 400;
					payload.code = "validation_error";
					payload.details = error?.cause ?? undefined;
					break;
				case "NOT_FOUND":
					set.status = 404;
					payload.code = "not_found";
					break;
				case "UNKNOWN":
					set.status = 401;
					payload.code = "unauthorized";
					break;
				default:
					set.status = 500;
					payload.code = "internal_error";
			}

			return payload;
		});

	registerRoutes(app);

	return app;
}
