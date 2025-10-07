import type { AnyElysia } from "elysia";

export type CreateProviderPayload = {
	description?: string | null;
	experience_years?: number | null;
	city?: string | null;
	neighborhood?: string | null;
	latitude?: number | null;
	longitude?: number | null;
	is_active?: boolean | null;
};

export async function createProvider(
	app: AnyElysia,
	payload: CreateProviderPayload,
	init: { token?: string; correlationId?: string } = {},
) {
	const url = "http://test/api/providers";
	const headers: Record<string, string> = {
		"content-type": "application/json",
	};
	if (init.correlationId) headers["x-correlation-id"] = init.correlationId;
	if (init.token) headers.authorization = `Bearer ${init.token}`;

	const res = await app.handle(
		new Request(url, {
			method: "POST",
			headers,
			body: JSON.stringify(payload),
		}),
	);

	const status = res.status;
	const h = res.headers;

	let body: any = null;
	try {
		const text = await res.text();
		body = text ? JSON.parse(text) : null;
	} catch {
		body = null;
	}

	return { status, body, headers: h } as const;
}
