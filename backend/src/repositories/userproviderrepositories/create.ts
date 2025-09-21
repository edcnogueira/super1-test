import { schema } from "@/repositories/drizzle/schema";
import type { DrizzleClient } from "@/repositories/drizzle/types.ts";
import {
	toUserProvider,
	type UserProvider,
} from "@/repositories/userproviderrepositories/models.ts";
import type { RepositoryContext } from "@/repositories/userproviderrepositories/repository.ts";

export type CreateRequest = {
	email: string;
	passwordHash: string;
	name: string;
	phone?: string | null;
};
export type CreateResponse = { userProvider: UserProvider };

export async function createUserProvider(
	db: DrizzleClient,
	_ctx: RepositoryContext,
	req: CreateRequest,
): Promise<CreateResponse> {
	try {
		const [row] = await db
			.insert(schema.userProviders)
			.values({
				email: req.email,
				passwordHash: req.passwordHash,
				name: req.name,
				phone: req.phone ?? null,
			})
			.returning();

		return { userProvider: toUserProvider(row) };
	} catch (error) {
		throw new Error(
			"Error creating user provider: " +
				(error instanceof Error ? error.message : String(error)),
		);
	}
}
