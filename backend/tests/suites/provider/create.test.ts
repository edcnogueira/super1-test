import { beforeEach, describe, expect, it } from "bun:test";
import { buildTestApp } from "../../testhelpers/api/app.ts";
import { createProvider } from "../../testhelpers/api/provider.ts";
import { signup } from "../../testhelpers/api/userprovider.ts";
import {
	truncateProviders,
	truncateUserProviders,
} from "../../testhelpers/database/cleanup.ts";

describe.skip("Provider - create", () => {
	const app = buildTestApp();

	beforeEach(async () => {
		await truncateProviders();
		await truncateUserProviders();
	});

	it("creates a provider for the authenticated user and returns 201", async () => {
		const user = {
			email: "pro.create@example.com",
			password: "supersecret",
			name: "Create Pro",
			phone: "+5511999999999",
		};

		const signupRes = await signup(app, user, { correlationId: "corr-pro-1" });
		expect(signupRes.status).toBe(201);
		const token = signupRes.body.token as string;
		const userId = signupRes.body.user_provider.id as string;

		const payload = {
			description: "Experienced professional in home services",
			experience_years: 7,
			city: "Sao Paulo",
			neighborhood: "Centro",
			latitude: -23.55052,
			longitude: -46.633308,
			is_active: true,
		} as const;

		const res = await createProvider(app, payload, {
			token,
			correlationId: "corr-pro-2",
		});

		expect(res.status).toBe(201);
		expect(res.body?.provider?.user_provider_id).toBe(userId);
		expect(res.body.provider.description).toBe(payload.description);
		expect(res.body.provider.experience_years).toBe(payload.experience_years);
		expect(res.body.provider.city).toBe(payload.city);
		expect(res.body.provider.neighborhood).toBe(payload.neighborhood);
		expect(res.body.provider.latitude).toBeCloseTo(payload.latitude, 5);
		expect(res.body.provider.longitude).toBeCloseTo(payload.longitude, 5);
		expect(res.body.provider.is_active).toBe(payload.is_active);
		expect(
			res.body.provider.created_at === null ||
				typeof res.body.provider.created_at === "string" ||
				res.body.provider.created_at instanceof Date,
		).toBeTrue();
		expect(
			res.body.provider.updated_at === null ||
				typeof res.body.provider.updated_at === "string" ||
				res.body.provider.updated_at instanceof Date,
		).toBeTrue();
	});

	it("returns 401 when missing Bearer token", async () => {
		const res = await createProvider(
			app,
			{ description: "No auth" },
			{ correlationId: "corr-pro-unauth" },
		);
		expect(res.status).toBe(401);
		expect(res.body.code).toBe("UNAUTHORIZED_ERROR");
	});

	it("returns 400 on validation error (invalid coordinates)", async () => {
		const user = {
			email: "pro.invalid@example.com",
			password: "supersecret",
			name: "Invalid Pro",
		};

		const signupRes = await signup(app, user);
		expect(signupRes.status).toBe(201);
		const token = signupRes.body.token as string;

		const res = await createProvider(
			app,
			{ latitude: -123, longitude: 999 },
			{ token },
		);

		expect(res.status).toBe(400);
		expect(res.body.code).toBe("VALIDATION_ERROR");
		expect(Array.isArray(res.body.details)).toBeTrue();
	});
});
