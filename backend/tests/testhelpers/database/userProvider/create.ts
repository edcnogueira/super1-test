import { Database } from "@/repositories/drizzle/client.ts";
import { schema } from "@/repositories/drizzle/schema";

const userInsert = {
	email: "pro.create@example.com",
	password: "supersecret",
	name: "Create Pro",
	phone: "+5511999999999",
};

export async function createUserProvider() {
	const db = Database.instance;
	const user = await db
		.insert(schema.userProviders)
		.values({
			name: userInsert.name,
			email: userInsert.email,
			passwordHash: userInsert.password,
			phone: userInsert.phone,
		})
		.returning();

	return user[0];
}
