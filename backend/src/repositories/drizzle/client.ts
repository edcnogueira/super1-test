import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/config/env.ts";
import { schema } from "./schema";

export class Database {
	private static _instance: Database | undefined;
	private readonly _db: ReturnType<typeof drizzle>;

	private constructor() {
		this._db = drizzle(env.DATABASE_URL, {
			schema,
			casing: "snake_case",
		});
	}

	static get instance() {
		if (!Database._instance) Database._instance = new Database();
		return Database._instance._db;
	}
}
