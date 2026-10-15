// Reporting must never slow down or break the host application, so every failure is logged and swallowed.
const REQUEST_TIMEOUT_MS = 5000;
// Repeats of the same event inside this window are counted locally and sent once as a single request.
const DEDUPE_WINDOW_MS = 10000;
// Caps concurrent requests so a loop of distinct errors cannot exhaust the host's sockets or memory.
const MAX_IN_FLIGHT = 10;
const DEFAULT_RETRY_AFTER_SECONDS = 60;

class Orbitrace {
	static #config = null;
	static #pending = new Map();
	static #inFlight = new Set();
	static #pausedUntil = 0;

	static getInstance(config) {
		this.assertServerRuntime();
		this.validateConfig(config);

		this.#config = {
			apiKey: config.apiKey,
			orgId: config.orgId,
			projectId: config.projectId,
			endpoint: config.endpoint,
			environment: config.environment || "production",
			version: config.version || "1.0.0",
			service: config.service || "not-specified",
			disabled: config.disabled || false,
		};
	}

	static validateConfig(config) {
		const requiredFields = ["apiKey", "orgId", "projectId", "endpoint"];
		const missingFields = requiredFields.filter((field) => !config[field]);

		if (missingFields.length > 0) {
			throw new Error(
				`Missing required configuration fields: ${missingFields.join(", ")}`
			);
		}
	}

	static assertServerRuntime() {
		if (typeof window !== "undefined" || typeof document !== "undefined") {
			throw new Error(
				"Orbitrace can only be initialized in backend/server runtimes"
			);
		}
	}

	static async captureException(error, metadata = {}) {
		const message = error?.message || error?.name || String(error);

		return this.#capture("capture_exception", {
			message,
			stack: error?.stack || message,
			metadata,
		});
	}

	static async captureMessage(message, metadata = {}) {
		return this.#capture("capture_message", { message, metadata });
	}

	// Sends counts still held by the dedupe window and waits for in-flight requests.
	// Call it before a short-lived process or serverless invocation ends.
	static async flush() {
		await Promise.all([...this.#pending.keys()].map((key) => this.#flushPending(key)));
		await Promise.all(this.#inFlight);
	}

	static async #capture(event, { metadata, ...fields }) {
		if (!this.#config) {
			console.error("Orbitrace: call Orbitrace.getInstance() before capturing events");
			return;
		}

		if (this.#config.disabled) {
			console.log("Orbitrace: Logging is disabled");
			return;
		}

		const payload = {
			...fields,
			metadata: {
				...metadata,
				env: this.#config.environment,
				version: this.#config.version,
				service: this.#config.service,
			},
		};
		const key = JSON.stringify([event, payload.message, payload.stack ?? null]);
		const pending = this.#pending.get(key);

		if (pending) {
			pending.count++;
			return;
		}

		if (!this.#canSend()) {
			return;
		}

		const entry = { event, payload, count: 0 };
		entry.timer = setTimeout(() => this.#flushPending(key), DEDUPE_WINDOW_MS);
		entry.timer.unref?.();
		this.#pending.set(key, entry);

		return this.#send(event, payload, 1);
	}

	static async #flushPending(key) {
		const entry = this.#pending.get(key);

		if (!entry) {
			return;
		}

		this.#pending.delete(key);
		clearTimeout(entry.timer);

		if (entry.count > 0 && this.#canSend()) {
			await this.#send(entry.event, entry.payload, entry.count);
		}
	}

	static #canSend() {
		return Date.now() >= this.#pausedUntil && this.#inFlight.size < MAX_IN_FLIGHT;
	}

	static #send(event, payload, count) {
		const request = this.#post(event, payload, count).finally(() => this.#inFlight.delete(request));
		this.#inFlight.add(request);

		return request;
	}

	static async #post(event, payload, count) {
		try {
			const response = await fetch(this.#config.endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-orbitrace-api-key": this.#config.apiKey,
					"x-orbitrace-org-id": this.#config.orgId,
					"x-orbitrace-project-id": this.#config.projectId,
				},
				body: JSON.stringify({
					event,
					...(count > 1 && { count }),
					payload,
				}),
				signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
			});

			if (response.status === 429) {
				const retryAfterSeconds = Number(response.headers.get("retry-after")) || DEFAULT_RETRY_AFTER_SECONDS;
				this.#pausedUntil = Date.now() + retryAfterSeconds * 1000;
				console.warn(`Orbitrace: rate limited, dropping events for ${retryAfterSeconds}s`);
				return;
			}

			if (!response.ok) {
				console.error(`Orbitrace: API responded with status ${response.status}`);
				return;
			}

			return await response.json();
		} catch (error) {
			console.error("Orbitrace: Error sending data to API", error.message);
		}
	}
}

module.exports = Orbitrace;
