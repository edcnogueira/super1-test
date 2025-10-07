import Elysia from "elysia";
import { env } from "@/config/env.ts";
import { createJwtManager } from "@/providers/jwtmanager/provider.ts";

export type AuthIdentity = {
	type: "auth";
	userId: string;
	email?: string;
	name?: string;
	claims: Record<string, unknown>;
};

export function auth() {
	const jwt = createJwtManager({
		secret: env.JWT_SECRET || "dev-secret",
		issuer: env.JWT_ISSUER || "super1",
		audience: env.JWT_AUDIENCE || "user_provider",
	});

	return new Elysia({ name: "auth" }).resolve(async ({ request, set }) => {
		const authz = request.headers.get("authorization") ?? "";
		const token = authz.startsWith("Bearer ") ? authz.substring(7) : null;

		if (!token) {
			set.status = 401;
			throw Object.assign(new Error("Missing Authorization header"), {
				code: "UNAUTHORIZED_ERROR",
			});
		}

		try {
			const { payload } = await jwt.verify(
				{ correlationId: crypto.randomUUID() },
				{ token },
			);

			const identity: AuthIdentity = {
				type: "auth",
				userId: String(payload.sub ?? ""),
				email: typeof payload.email === "string" ? payload.email : undefined,
				name: typeof payload.name === "string" ? payload.name : undefined,
				claims: payload as unknown as Record<string, unknown>,
			};

			return { identity };
		} catch (_err) {
			set.status = 401;
			throw Object.assign(new Error("Invalid token"), {
				code: "UNAUTHORIZED_ERROR",
			});
		}
	});
}
