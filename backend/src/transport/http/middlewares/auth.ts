import Elysia from "elysia";

export type AuthIdentity = {
	userId: string;
	roles: string[];
} | null;

export function authOptional() {
	return new Elysia({ name: "authOptional" }).derive(({ request }) => {
		const auth = request.headers.get("authorization");
		let identity: AuthIdentity = null;
		if (auth?.startsWith("Bearer ")) {
			const token = auth.slice("Bearer ".length).trim();
			identity = { userId: token || "anonymous", roles: [] };
		}
		return { identity };
	});
}

export function requireAuth() {
	return new Elysia({ name: "requireAuth" })
		.onBeforeHandle(({ request, set }) => {
			const auth = request.headers.get("authorization");
			if (!auth || !auth.startsWith("Bearer ")) {
				set.status = 401;
				return { code: "unauthorized", message: "Unauthorized" };
			}
		})
		.derive(({ request }) => {
			const token = request.headers
				.get("authorization")
				?.slice("Bearer ".length)
				.trim();
			const identity: AuthIdentity = {
				userId: token || "anonymous",
				roles: [],
			};
			return { identity };
		});
}
