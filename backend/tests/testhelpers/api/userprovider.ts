import type { AnyElysia } from "elysia";

export type SignupPayload = {
	email: string;
	password: string;
	name: string;
	phone?: string | null;
};

export async function signup(
	app: AnyElysia,
	payload: SignupPayload,
	init?: { correlationId?: string },
) {
	const url = "http://test/api/user-providers/signup";
	const res = await app.handle(
		new Request(url, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				...(init?.correlationId
					? { "x-correlation-id": init.correlationId }
					: {}),
			},
			body: JSON.stringify(payload),
		}),
	);

	const status = res.status;
	const headers = res.headers;

	let body: any = null;
	try {
		const text = await res.text();
		body = text ? JSON.parse(text) : null;
	} catch {
		body = null;
	}
	return { status, body, headers } as const;
}
