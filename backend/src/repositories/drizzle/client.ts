import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/config/env.ts";
import type { DrizzleClient } from "@/repositories/drizzle/types.ts";
import { schema } from "./schema";

export class Database {
	private static _instance: Database | undefined;
	private readonly _db: DrizzleClient;

	private constructor() {
		const pool = new Pool({ connectionString: env.DATABASE_URL });
		this._db = drizzle(pool, {
			schema,
			casing: "snake_case",
		});
	}

	static get instance() {
		if (!Database._instance) Database._instance = new Database();
		return Database._instance._db;
	}
}
