import { z } from "zod";

const envSchema = z.object({
	APP_ENV: z.enum(["development", "test", "production"]).optional(),
	NODE_ENV: z.enum(["development", "test", "production"]).optional(),
	HTTP_PORT: z.string().regex(/^\d+$/).optional(),
	LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional(),
	DATABASE_URL: z.url().startsWith("postgres://"),
	JWT_SECRET: z.string().optional(),
	JWT_ISSUER: z.string().optional(),
	JWT_AUDIENCE: z.string().optional(),
	JWT_EXPIRES_IN: z.string().optional(),
});

export const env = envSchema.parse(Bun.env);
