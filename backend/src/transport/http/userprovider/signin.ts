import { z } from "zod";
import {
	UnauthorizedError,
	ValidationError,
} from "@/services/userproviderservice/erros.ts";
import type { Service } from "@/services/userproviderservice/service.ts";

type ElysiaRequest = { request: Request; body: any; set: any };

type SigninUserRequest = {
	service: Service;
} & ElysiaRequest;

export async function signin({
	request,
	body,
	set,
	service,
}: SigninUserRequest) {
	try {
		const correlationId = request.headers.get("x-correlation-id") ?? undefined;

		const res = await service.signin(
			{ correlationId },
			{
				email: body.email,
				password: body.password,
			},
		);

		set.status = 200;
		return {
			token: res.token,
			user_provider: {
				id: res.userProvider.id,
				email: res.userProvider.email,
				name: res.userProvider.name,
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
		if (err instanceof UnauthorizedError) {
			set.status = 401;
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
		summary: "Signin user provider",
		description: "Authenticates a user provider and returns a JWT token",
	},
	body: z.object({
		email: z.string().describe("Email address"),
		password: z.string().describe("Plain password (min 8 chars)"),
	}),
	response: {
		200: z.object({
			token: z.string(),
			user_provider: z.object({
				id: z.string(),
				email: z.string(),
				name: z.string(),
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
