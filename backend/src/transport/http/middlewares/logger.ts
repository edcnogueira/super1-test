import Elysia from "elysia";

export function logger() {
	const startTimes = new WeakMap<Request, number>();

	if (import.meta.env.NODE_ENV === "test") {
		return new Elysia({ name: "logger" });
	}

	return new Elysia({ name: "logger" })
		.onBeforeHandle(({ request, set, path }) => {
			const correlationId =
				request.headers.get("x-correlation-id") ?? crypto.randomUUID();
			set.headers ||= {};
			set.headers["x-correlation-id"] = correlationId;

			startTimes.set(request, Date.now());

			console.info(
				"[HTTP] -->",
				request.method,
				path ?? new URL(request.url).pathname,
				{
					correlationId,
				},
			);
		})
		.onAfterHandle(({ request, set, path }) => {
			const startedAt = startTimes.get(request) ?? Date.now();
			const durationMs = Date.now() - startedAt;
			set.headers ||= {};
			set.headers["x-response-time"] = `${durationMs}ms`;
			const correlationId = set.headers["x-correlation-id"];
			console.info(
				"[HTTP] <--",
				request.method,
				path ?? new URL(request.url).pathname,
				{
					correlationId,
					durationMs,
				},
			);
		});
}
