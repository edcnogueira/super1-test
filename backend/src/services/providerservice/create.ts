import { ZodError, z } from "zod";
import { ValidationError } from "@/domain/erros.ts";
import type {
	CreateRequest as RepoCreateRequest,
	CreateResponse as RepoCreateResponse,
} from "@/repositories/providerrepositories/create.ts";
import type { ProviderRepository } from "@/repositories/providerrepositories/repository.ts";
import type { ServiceContext } from "@/services/providerservice/service.ts";

export type CreateRequest = {
	userProviderId: string;
	description?: string | null;
	experienceYears?: number | null;
	city?: string | null;
	neighborhood?: string | null;
	latitude?: number | null;
	longitude?: number | null;
	isActive?: boolean | null;
};

export type CreateResponse = {
	provider: {
		userProviderId: string;
		description?: string | null;
		experienceYears?: number | null;
		city?: string | null;
		neighborhood?: string | null;
		latitude?: number | null;
		longitude?: number | null;
		isActive?: boolean | null;
		createdAt: Date | null;
		updatedAt: Date | null;
	};
};

export async function createProvider(
	repository: ProviderRepository,
	ctx: ServiceContext,
	req: CreateRequest,
): Promise<CreateResponse> {
	validateCreateRequest(req);

	try {
		const repoReq: RepoCreateRequest = {
			userProviderId: req.userProviderId,
			description: req.description ?? null,
			experienceYears: req.experienceYears ?? null,
			city: req.city ?? null,
			neighborhood: req.neighborhood ?? null,
			latitude: req.latitude ?? null,
			longitude: req.longitude ?? null,
			isActive: req.isActive ?? null,
		};

		const repoRes: RepoCreateResponse = await repository.create(
			{ correlationId: ctx.correlationId },
			repoReq,
		);

		return {
			provider: {
				userProviderId: repoRes.provider.userProviderId,
				description: repoRes.provider.description ?? null,
				experienceYears: repoRes.provider.experienceYears ?? null,
				city: repoRes.provider.city ?? null,
				neighborhood: repoRes.provider.neighborhood ?? null,
				latitude: repoRes.provider.latitude ?? null,
				longitude: repoRes.provider.longitude ?? null,
				isActive: repoRes.provider.isActive ?? null,
				createdAt: repoRes.provider.createdAt ?? null,
				updatedAt: repoRes.provider.updatedAt ?? null,
			},
		};
	} catch (err) {
		if (err instanceof ValidationError) {
			throw err;
		}
		const message = err instanceof Error ? err.message : String(err);
		const e = new Error(`Failed to create provider: ${message}`);
		(e as any).code = "INTERNAL_ERROR";
		throw e;
	}
}

const createRequestSchema = z.object({
	userProviderId: z.uuid({ message: "userProviderId must be a valid UUID" }),
	description: z
		.union([z.string({ error: "description must be a string" }), z.null()])
		.optional()
		.transform((v) => (v == null ? null : v.trim()))
		.refine((v) => (v == null ? true : v.length <= 5000), {
			message: "description must be at most 5000 characters",
		}),
	experienceYears: z
		.union([z.number({ error: "experienceYears must be a number" }), z.null()])
		.optional()
		.refine((v) => (v == null ? true : v >= 0 && Number.isInteger(v)), {
			message: "experienceYears must be a non-negative integer",
		}),
	city: z
		.union([z.string({ error: "city must be a string" }), z.null()])
		.optional()
		.transform((v) => (v == null ? null : v.trim()))
		.refine((v) => (v == null ? true : v.length <= 100), {
			message: "city must be at most 100 characters",
		}),
	neighborhood: z
		.union([z.string({ error: "neighborhood must be a string" }), z.null()])
		.optional()
		.transform((v) => (v == null ? null : v.trim()))
		.refine((v) => (v == null ? true : v.length <= 100), {
			message: "neighborhood must be at most 100 characters",
		}),
	latitude: z
		.union([z.number({ error: "latitude must be a number" }), z.null()])
		.optional()
		.refine((v) => (v == null ? true : v >= -90 && v <= 90), {
			message: "latitude must be between -90 and 90",
		}),
	longitude: z
		.union([z.number({ error: "longitude must be a number" }), z.null()])
		.optional()
		.refine((v) => (v == null ? true : v >= -180 && v <= 180), {
			message: "longitude must be between -180 and 180",
		}),
	isActive: z
		.union([z.boolean({ error: "isActive must be a boolean" }), z.null()])
		.optional(),
});

export function validateCreateRequest(req: CreateRequest): void {
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
