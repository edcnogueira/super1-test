import { env } from "./env.ts";

export type AppConfig = {
	appEnv: string;
	httpPort: number;
	logLevel: "debug" | "info" | "warn" | "error";
};

export function loadConfig(): AppConfig {
	const parseNumber = (value: string | undefined, fallback: number) => {
		const n = Number(value);
		return Number.isFinite(n) ? n : fallback;
	};

	const appEnv = env.APP_ENV ?? env.NODE_ENV ?? "development";
	const httpPort = parseNumber(env.HTTP_PORT, 3333);
	const logLevel = (env.LOG_LEVEL as AppConfig["logLevel"]) ?? "info";

	return { appEnv, httpPort, logLevel };
}
