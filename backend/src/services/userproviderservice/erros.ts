// Validation functions for UserProvider Service
// Throw ValidationError with details when validation fails

export class ValidationError extends Error {
	readonly code = "VALIDATION_ERROR" as const;
	constructor(public readonly details: { field: string; message: string }[]) {
		super("Validation failed");
		this.name = "ValidationError";
	}
}
