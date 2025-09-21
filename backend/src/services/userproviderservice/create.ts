import { ZodError, z } from "zod";
import type {
	CreateRequest as RepoCreateRequest,
	CreateResponse as RepoCreateResponse,
} from "@/repositories/userproviderrepositories/create.ts";
import type { UserProviderRepository } from "@/repositories/userproviderrepositories/repository.ts";
import { ValidationError } from "@/services/userproviderservice/erros.ts";
import type { ServiceContext } from "@/services/userproviderservice/service.ts";

export type CreateRequest = {
	email: string;
	password: string;
	name: string;
	phone?: string | null;
};

export type CreateResponse = {
	userProvider: {
		id: string;
		email: string;
		name: string;
		phone?: string | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};
};

export async function createUserProvider(
	repository: UserProviderRepository,
	ctx: ServiceContext,
	req: CreateRequest,
) {
	validateCreateRequest(req);

	try {
		const passwordHashed = await Bun.password.hash(req.password);

		const repoReq: RepoCreateRequest = {
			email: req.email,
			passwordHash: passwordHashed,
			name: req.name,
			phone: req.phone ?? null,
		};

		const repoRes: RepoCreateResponse = await repository.create(
			{ correlationId: ctx.correlationId },
			repoReq,
		);

		return {
			userProvider: {
				id: repoRes.userProvider.id,
				email: repoRes.userProvider.email,
				name: repoRes.userProvider.name,
				phone: repoRes.userProvider.phone ?? null,
				createdAt: repoRes.userProvider.createdAt ?? null,
				updatedAt: repoRes.userProvider.updatedAt ?? null,
			},
		} satisfies CreateResponse;
	} catch (err) {
		if (err instanceof ValidationError) {
			throw err;
		}
		const message = err instanceof Error ? err.message : String(err);
		const e = new Error(`Failed to create user provider: ${message}`);
		(e as any).code = "INTERNAL_ERROR";
		throw e;
	}
}

const createRequestSchema = z.object({
	email: z
		.email({ message: "Email must be a valid email address" })
		.trim()
		.min(1, { message: "Email is required" }),
	password: z
		.string({ error: "Password is required" })
		.trim()
		.min(8, { message: "Password must have at least 8 characters" }),
	name: z
		.string({ error: "Name is required" })
		.trim()
		.min(2, { message: "Name must have at least 2 characters" }),
	phone: z
		.union([
			z.string({ error: "Phone must be a string when provided" }),
			z.null(),
		])
		.optional()
		.transform((v) => (v == null ? null : v.trim())),
});

export function validateCreateRequest(req: {
	email: string;
	password: string;
	name: string;
	phone?: string | null;
}): void {
	try {
		createRequestSchema.parse(req);
	} catch (err) {
		if (err instanceof ZodError) {
			const details = err.issues.map((i) => ({
				field: String(i.path?.[0] ?? "unknown"),
				message: i.message,
			}));
			throw new ValidationError(details);
		}
		throw err;
	}
}
