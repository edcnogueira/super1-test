import { defineConfig } from "drizzle-kit";
import { env } from "@/config/env.ts";

export default defineConfig({
	schema: "./src/repositories/drizzle/schema/**",
	out: "./src/repositories/drizzle/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	casing: "snake_case",
});
