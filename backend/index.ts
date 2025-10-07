import { loadConfig } from "@/config/config.ts";
import { createApp } from "@/transport/http/elysiaapp/app.ts";

function main() {
	const config = loadConfig();
	const app = createApp(config);
	const server = app.listen(config.httpPort);
	console.info(
		`HTTP listening on http://localhost:${config.httpPort} (env=${config.appEnv})`,
	);

	return server;
}

main();
