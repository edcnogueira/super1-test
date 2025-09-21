import { Database } from "@/repositories/drizzle/client.ts";
import { schema } from "@/repositories/drizzle/schema";

/**
 * Deletes all rows from user_provider table to keep tests isolated.
 */
export async function truncateUserProviders() {
	const db = Database.instance;
	await db.delete(schema.userProviders);
}
