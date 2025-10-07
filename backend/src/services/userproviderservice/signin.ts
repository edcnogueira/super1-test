import { ZodError, z } from "zod";
import { UnauthorizedError, ValidationError } from "@/domain/erros.ts";
import type { JwtManager } from "@/providers/jwtmanager/provider.ts";
import type { UserProviderRepository } from "@/repositories/userproviderrepositories/repository.ts";
import type { ServiceContext } from "@/services/userproviderservice/service.ts";

export type SigninRequest = {
	email: string;
	password: string;
};

export type SigninResponse = {
	token: string;
	userProvider: {
		id: string;
		email: string;
		name: string;
	};
};

export async function signinUserProvider(
	repository: UserProviderRepository,
	jwt: JwtManager,
	ctx: ServiceContext,
	req: SigninRequest,
): Promise<SigninResponse> {
	validateSigninRequest(req);

	try {
		const { userProvider } = await repository.getByEmail(
			{ correlationId: ctx.correlationId },
			{ email: req.email },
		);

		if (!userProvider) {
			throw new UnauthorizedError("Invalid credentials");
		}

		const ok = await Bun.password.verify(
			req.password,
			userProvider.passwordHash,
		);
		if (!ok) {
			throw new UnauthorizedError("Invalid credentials");
		}

		const { token } = await jwt.sign(
			{ correlationId: ctx.correlationId },
			{
				subject: userProvider.id,
				claims: { email: userProvider.email, name: userProvider.name },
			},
		);

		return {
			token,
			userProvider: {
				id: userProvider.id,
				email: userProvider.email,
				name: userProvider.name,
			},
		};
	} catch (err) {
		if (err instanceof ValidationError || err instanceof UnauthorizedError) {
			throw err;
		}
		const message = err instanceof Error ? err.message : String(err);
		const e = new Error(`Failed to signin user provider: ${message}`);
		(e as any).code = "INTERNAL_ERROR";
		throw e;
	}
}

const signinRequestSchema = z.object({
	email: z
		.email({ message: "Email must be a valid email address" })
		.trim()
		.min(1, { message: "Email is required" }),
	password: z
		.string({ error: "Password is required" })
		.trim()
		.min(8, { message: "Password must have at least 8 characters" }),
});

export function validateSigninRequest(req: {
	email: string;
	password: string;
}): void {
	try {
		signinRequestSchema.parse(req);
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
