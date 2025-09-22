import {
	decodeJwt,
	type JWTHeaderParameters,
	type JWTPayload,
	jwtVerify,
	SignJWT,
} from "jose";

export type JwtAlgorithm = "HS256" | "HS384" | "HS512";

export type JwtManagerContext = {
	correlationId?: string;
};

export type CreateTokenRequest = {
	subject: string;
	claims?: Record<string, unknown>;
	expiresIn?: string;
	audience?: string | string[];
	issuer?: string;
	header?: JWTHeaderParameters;
};

export type CreateTokenResponse = {
	token: string;
};

export type VerifyTokenRequest = {
	token: string;
	audience?: string | string[];
	issuer?: string;
};

export type VerifyTokenResponse = {
	payload: JWTPayload;
};

export type DecodeTokenRequest = {
	token: string;
};

export type DecodeTokenResponse = {
	payload: JWTPayload;
};

export class TokenSigningError extends Error {
	readonly code = "TOKEN_SIGNING_ERROR" as const;
	constructor(
		message: string,
		public override readonly cause?: unknown,
	) {
		super(message);
		this.name = "TokenSigningError";
	}
}

export class TokenVerificationError extends Error {
	readonly code = "TOKEN_VERIFICATION_ERROR" as const;
	constructor(
		message: string,
		public override readonly cause?: unknown,
	) {
		super(message);
		this.name = "TokenVerificationError";
	}
}

export interface JwtManager {
	sign(
		ctx: JwtManagerContext,
		req: CreateTokenRequest,
	): Promise<CreateTokenResponse>;
	verify(
		ctx: JwtManagerContext,
		req: VerifyTokenRequest,
	): Promise<VerifyTokenResponse>;
	decode(
		ctx: JwtManagerContext,
		req: DecodeTokenRequest,
	): Promise<DecodeTokenResponse>;
}

export type JwtManagerConfig = {
	algorithm?: JwtAlgorithm;
	secret: string | Uint8Array;
	issuer?: string;
	audience?: string | string[];
	defaultExpiresIn?: string;
	clockTolerance?: string | number;
};

function normalizeSecret(secret: string | Uint8Array): Uint8Array {
	return typeof secret === "string" ? new TextEncoder().encode(secret) : secret;
}

export function createJwtManager(config: JwtManagerConfig): JwtManager {
	const algorithm = config.algorithm ?? "HS256";
	const key = normalizeSecret(config.secret);

	return {
		async sign(_ctx, req) {
			try {
				const now = Math.floor(Date.now() / 1000);
				const payload: JWTPayload = {
					...req.claims,
					sub: req.subject,
					iat: now,
				};

				const header: JWTHeaderParameters = {
					alg: algorithm,
					typ: "JWT",
					...req.header,
				};

				const jwt = await new SignJWT(payload)
					.setProtectedHeader(header)
					.setIssuer(<string>req.issuer ?? config.issuer ?? undefined)
					.setAudience(<string>req.audience ?? config.audience ?? undefined)
					.setSubject(req.subject)
					.setIssuedAt()
					.setExpirationTime(req.expiresIn ?? config.defaultExpiresIn ?? "15m")
					.sign(key);

				return { token: jwt };
			} catch (err) {
				throw new TokenSigningError("Failed to sign token", err);
			}
		},

		async verify(_ctx, req) {
			try {
				const { payload } = await jwtVerify(req.token, key, {
					algorithms: [algorithm],
					issuer: req.issuer ?? config.issuer,
					audience: req.audience ?? config.audience,
					clockTolerance: config.clockTolerance,
				});

				return { payload };
			} catch (err) {
				throw new TokenVerificationError("Failed to verify token", err);
			}
		},

		async decode(_ctx, req) {
			const payload = decodeJwt(req.token);
			return { payload };
		},
	} satisfies JwtManager;
}
