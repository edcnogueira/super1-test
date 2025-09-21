import { loadConfig } from "@/config/config.ts";
import { createApp } from "@/transport/http/elysiaapp/app.ts";

/**
 * Builds an Elysia app instance for tests with the default configuration.
 * Tests should use app.handle(new Request(url, opts)) for HTTP calls.
 */
export function buildTestApp() {
	const config = loadConfig();
	return createApp(config);
}
