import { z } from "zod";
import { ValidationError } from "@/domain/erros.ts";
import type { Service } from "@/services/providerservice/service.ts";
import type { AuthIdentity } from "@/transport/http/middlewares/auth.ts";

type ElysiaRequest = { request: Request; body: any; set: any };

type CreateProviderRequest = {
	service: Service;
	identity: AuthIdentity;
} & ElysiaRequest;

export async function create({
	request,
	body,
	set,
	service,
	identity,
}: CreateProviderRequest) {
	try {
		const correlationId = request.headers.get("x-correlation-id") ?? undefined;

		console.log(identity);

		const res = await service.create(
			{ correlationId },
			{
				userProviderId: identity.userId,
				description: body.description ?? null,
				experienceYears: body.experience_years ?? null,
				city: body.city ?? null,
				neighborhood: body.neighborhood ?? null,
				latitude: body.latitude ?? null,
				longitude: body.longitude ?? null,
				isActive: body.is_active ?? null,
			},
		);

		set.status = 201;
		return {
			provider: {
				user_provider_id: res.provider.userProviderId,
				description: res.provider.description ?? null,
				experience_years: res.provider.experienceYears ?? null,
				city: res.provider.city ?? null,
				neighborhood: res.provider.neighborhood ?? null,
				latitude: res.provider.latitude ?? null,
				longitude: res.provider.longitude ?? null,
				is_active: res.provider.isActive ?? null,
				created_at: res.provider.createdAt ?? null,
				updated_at: res.provider.updatedAt ?? null,
			},
		};
	} catch (err) {
		if (err instanceof ValidationError) {
			set.status = 400;
			return {
				code: err.code,
				message: err.message,
				details: err.details,
			};
		}
		if ((err as any)?.code === "UNAUTHORIZED_ERROR") {
			set.status = 401;
			return { code: "UNAUTHORIZED_ERROR", message: (err as Error).message };
		}

		const message = err instanceof Error ? err.message : String(err);
		set.status = 500;
		return { code: "INTERNAL_ERROR", message };
	}
}

export const documentation = {
	detail: {
		tags: ["Providers"],
		summary: "Create provider profile",
		description:
			"Creates a provider profile for the authenticated user provider. Requires Bearer token.",
	},
	body: z.object({
		description: z
			.string()
			.max(5000)
			.nullable()
			.optional()
			.describe("Provider description"),
		experience_years: z
			.number()
			.int()
			.min(0)
			.nullable()
			.optional()
			.describe("Years of experience (non-negative integer)"),
		city: z.string().max(100).nullable().optional().describe("City"),
		neighborhood: z
			.string()
			.max(100)
			.nullable()
			.optional()
			.describe("Neighborhood"),
		latitude: z
			.number()
			.min(-90)
			.max(90)
			.nullable()
			.optional()
			.describe("Latitude between -90 and 90"),
		longitude: z
			.number()
			.min(-180)
			.max(180)
			.nullable()
			.optional()
			.describe("Longitude between -180 and 180"),
		is_active: z
			.boolean()
			.nullable()
			.optional()
			.describe("Whether the provider is active"),
	}),
	identity: z.object({
		type: z.literal("auth"),
		userId: z.string(),
	}),
	response: {
		201: z.object({
			provider: z.object({
				user_provider_id: z.string().uuid(),
				description: z.string().nullable(),
				experience_years: z.number().nullable(),
				city: z.string().nullable(),
				neighborhood: z.string().nullable(),
				latitude: z.number().nullable(),
				longitude: z.number().nullable(),
				is_active: z.boolean().nullable(),
				created_at: z.date().nullable(),
				updated_at: z.date().nullable(),
			}),
		}),
		400: z.object({
			code: z.literal("VALIDATION_ERROR"),
			message: z.string(),
			details: z.array(z.object({ field: z.string(), message: z.string() })),
		}),
		401: z.object({
			code: z.literal("UNAUTHORIZED_ERROR"),
			message: z.string(),
		}),
		500: z.object({ code: z.literal("INTERNAL_ERROR"), message: z.string() }),
	},
};
