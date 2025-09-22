import { eq } from "drizzle-orm";
import { schema } from "@/repositories/drizzle/schema";
import type { DrizzleClient } from "@/repositories/drizzle/types.ts";
import type { UserProvider } from "@/repositories/userproviderrepositories/models.ts";
import type { RepositoryContext } from "@/repositories/userproviderrepositories/repository.ts";

export type GetByEmailRequest = {
	email: string;
};
export type GetByEmailResponse = {
	userProvider: Pick<UserProvider, "id" | "email"> | null;
};

export async function getUserProviderByEmail(
	db: DrizzleClient,
	_ctx: RepositoryContext,
	req: GetByEmailRequest,
): Promise<GetByEmailResponse> {
	try {
		const [row] = await db
			.select({ id: schema.userProviders.id, email: schema.userProviders.email })
			.from(schema.userProviders)
			.where(eq(schema.userProviders.email, req.email))
			.limit(1);

		return { userProvider: row ?? null };
	} catch (error) {
		throw new Error(
			"Error getting user provider by email: " +
				(error instanceof Error ? error.message : String(error)),
		);
	}
}
