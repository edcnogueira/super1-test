// Validation functions for UserProvider Service
// Throw ValidationError with details when validation fails

export class ValidationError extends Error {
	readonly code = "VALIDATION_ERROR" as const;
	constructor(public readonly details: { field: string; message: string }[]) {
		super("Validation failed");
		this.name = "ValidationError";
	}
}

export class ConflictError extends Error {
	readonly code = "CONFLICT_ERROR" as const;
	constructor(message: string) {
		super(message);
		this.name = "ConflictError";
	}
}

export class UnauthorizedError extends Error {
	readonly code = "UNAUTHORIZED_ERROR" as const;
	constructor(message: string) {
		super(message);
		this.name = "UnauthorizedError";
	}
}
