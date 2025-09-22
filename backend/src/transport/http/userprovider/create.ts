import { z } from "zod";
import { ConflictError, ValidationError } from "@/services/userproviderservice/erros.ts";
import type { Service } from "@/services/userproviderservice/service.ts";

type ElysiaRequest = { request: Request; body: any; set: any };

type CreateUserRequest = {
	service: Service;
} & ElysiaRequest;

export async function create({
	request,
	body,
	set,
	service,
}: CreateUserRequest) {
	try {
		const correlationId = request.headers.get("x-correlation-id") ?? undefined;

		const res = await service.create(
			{ correlationId },
			{
				email: body.email,
				password: body.password,
				name: body.name,
				phone: body.phone ?? null,
			},
		);

		set.status = 201;
		return {
			user_provider: {
				id: res.userProvider.id,
				email: res.userProvider.email,
				name: res.userProvider.name,
				phone: res.userProvider.phone ?? null,
				created_at: res.userProvider.createdAt,
				updated_at: res.userProvider.updatedAt,
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
		if (err instanceof ConflictError) {
			set.status = 409;
			return {
				code: err.code,
				message: err.message,
			};
		}
		const message = err instanceof Error ? err.message : String(err);
		set.status = 500;
		return { code: "INTERNAL_ERROR", message };
	}
}

export const documentation = {
	detail: {
		tags: ["UserProviders"],
		summary: "Create user provider",
		description: "Creates a new user provider",
	},
	body: z.object({
		email: z.string().describe("Email address"),
		password: z.string().describe("Plain password (min 8 chars)"),
		name: z.string().describe("Full name"),
		phone: z.string().describe("Phone number").nullable().optional(),
	}),
	response: {
		201: z.object({
			user_provider: z.object({
				id: z.string(),
				email: z.string(),
				name: z.string(),
				phone: z.string().nullable(),
				created_at: z.date().nullable(),
				updated_at: z.date().nullable(),
			}),
		}),
		400: z.object({
			code: z.literal("VALIDATION_ERROR"),
			message: z.string(),
			details: z.array(z.object({ field: z.string(), message: z.string() })),
		}),
		409: z.object({
			code: z.literal("CONFLICT_ERROR"),
			message: z.string(),
		}),
		500: z.object({
			code: z.literal("INTERNAL_ERROR"),
			message: z.string(),
		}),
	},
};
