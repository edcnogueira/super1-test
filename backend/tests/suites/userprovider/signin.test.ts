import { beforeEach, describe, expect, it } from "bun:test";
import { decodeJwt } from "jose";
import { buildTestApp } from "../../testhelpers/api/app.ts";
import { signin, signup } from "../../testhelpers/api/userprovider.ts";
import { truncateUserProviders } from "../../testhelpers/database/cleanup.ts";

describe("UserProvider - signin", () => {
	const app = buildTestApp();

	beforeEach(async () => {
		await truncateUserProviders();
	});

	it("authenticates a user provider and returns 200 with token", async () => {
		const email = "signin.user@example.com";
		const password = "supersecret";
		const name = "Signin User";

		const created = await signup(app, { email, password, name });
		expect(created.status).toBe(201);

		const res = await signin(
			app,
			{ email, password },
			{ correlationId: "test-corr-id-2" },
		);

		expect(res.status).toBe(200);
		expect(res.body?.user_provider?.id).toBeString();
		expect(res.body.user_provider.email).toBe(email);
		expect(res.body.user_provider.name).toBe(name);

		expect(res.body.token).toBeString();
		const decoded = decodeJwt(res.body.token);
		expect(decoded.sub).toBe(res.body.user_provider.id);
		expect(decoded.email).toBe(email);
		expect(decoded.name).toBe(name);
	});

	it("fails with 400 when payload is invalid", async () => {
		const res = await signin(app, { email: "invalid", password: "short" });

		expect(res.status).toBe(400);
		expect(res.body.code).toBe("VALIDATION_ERROR");
		expect(res.body.message).toBe("Validation failed");
		expect(Array.isArray(res.body.details)).toBe(true);
		expect(res.body.details.length).toBeGreaterThanOrEqual(2);
	});

	it("returns 401 when email does not exist", async () => {
		const res = await signin(app, {
			email: "unknown.user@example.com",
			password: "somestrongpass",
		});

		expect(res.status).toBe(401);
		expect(res.body.code).toBe("UNAUTHORIZED_ERROR");
		expect(res.body.message).toBe("Invalid credentials");
	});

	it("returns 401 when password is incorrect", async () => {
		const email = "wrong.pass@example.com";
		const name = "Wrong Pass";
		await signup(app, { email, password: "correctpassword", name });

		const res = await signin(app, { email, password: "incorrectpassword" });

		expect(res.status).toBe(401);
		expect(res.body.code).toBe("UNAUTHORIZED_ERROR");
		expect(res.body.message).toBe("Invalid credentials");
	});
});
