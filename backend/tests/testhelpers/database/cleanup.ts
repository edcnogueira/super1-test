import { Database } from "@/repositories/drizzle/client.ts";
import { schema } from "@/repositories/drizzle/schema";

export async function truncateUserProviders() {
	const db = Database.instance;
	await db.delete(schema.userProviders);
}

export async function truncateProviders() {
	const db = Database.instance;
	await db.delete(schema.providers);
}
