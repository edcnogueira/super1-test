import { beforeEach, describe, expect, it } from "bun:test";
import { buildTestApp } from "../../testhelpers/api/app.ts";
import { signup } from "../../testhelpers/api/userprovider.ts";
import { truncateUserProviders } from "../../testhelpers/database/cleanup.ts";

describe("UserProvider - signup", () => {
	const app = buildTestApp();

	beforeEach(async () => {
		await truncateUserProviders();
	});

	it("creates a user provider and returns 201", async () => {
		const payload = {
			email: "pro.user@example.com",
			password: "supersecret",
			name: "Pro User",
			phone: "+11234567890",
		};

		const res = await signup(app, payload, { correlationId: "test-corr-id-1" });

		expect(res.status).toBe(201);
		expect(res.body?.user_provider?.id).toBeString();
		expect(res.body.user_provider.email).toBe(payload.email);
		expect(res.body.user_provider.name).toBe(payload.name);
		expect(res.body.user_provider.phone).toBe(payload.phone);
	});

	it("fails with 400 when payload is invalid (short password)", async () => {
		const payload = {
			email: "invalidexample.com",
			password: "short",
			name: "A",
		};

		const res = await signup(app, payload);

		expect(res.status).toBe(400);
		expect(res.body.code).toBe("VALIDATION_ERROR");
		expect(res.body.message).toBe("Validation failed");
		expect(Array.isArray(res.body.details)).toBe(true);
		expect(res.body.details.length).toBe(3);
		expect(res.body.details).toContainEqual({
			field: "email",
			message: "Email must be a valid email address",
		});
		expect(res.body.details).toContainEqual({
			field: "password",
			message: "Password must have at least 8 characters",
		});
		expect(res.body.details).toContainEqual({
			field: "name",
			message: "Name must have at least 2 characters",
		});
	});
});
