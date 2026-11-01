const { AsyncLocalStorage } = require("node:async_hooks");
const util = require("node:util");

// Reporting must never slow down or break the host application: capture calls return before anything is sent,
// requests go out in the background, and every failure is logged and swallowed.
const REQUEST_TIMEOUT_MS = 5000;
// Repeats of the same event inside this window are counted locally and sent once as a single request.
const DEDUPE_WINDOW_MS = 10000;
// Caps concurrent requests so a loop of distinct errors cannot exhaust the host's sockets or memory.
const MAX_IN_FLIGHT = 10;
const DEFAULT_RETRY_AFTER_SECONDS = 60;
// Breadcrumbs kept per scope; the oldest is dropped when a new one arrives.
const MAX_BREADCRUMBS = 30;
const MAX_BREADCRUMB_MESSAGE_LENGTH = 200;
const BREADCRUMB_LEVELS = ["debug", "info", "warning", "error"];
// How long a crashing process waits for its last event before exiting.
const CRASH_FLUSH_TIMEOUT_MS = 2000;
const CONSOLE_LEVELS = { debug: "debug", log: "info", info: "info", warn: "warning", error: "error" };
// Metadata keys containing any of these (ignoring case, "-" and "_") have their values replaced before sending.
const SENSITIVE_KEY_PARTS = [
	"password",
	"passwd",
	"secret",
	"token",
	"authorization",
	"cookie",
	"apikey",
	"privatekey",
	"credential",
	"session",
];
const FILTERED_VALUE = "[Filtered]";

// Each request or wrapped invocation gets its own breadcrumbs, so concurrent work never mixes histories.
const scopes = new AsyncLocalStorage();

function isSensitiveKey(key) {
	const normalized = key.toLowerCase().replace(/[-_]/g, "");
	return SENSITIVE_KEY_PARTS.some((part) => normalized.includes(part));
}

// Recurses only into plain objects and arrays so values like Date keep their JSON form.
// `ancestors` breaks reference cycles, which would otherwise make the request body unserializable.
function filterSensitive(value, ancestors = new WeakSet()) {
	if (value === null || typeof value !== "object") {
		return value;
	}

	if (ancestors.has(value)) {
		return "[Circular]";
	}

	const isArray = Array.isArray(value);
	const prototype = Object.getPrototypeOf(value);

	if (!isArray && prototype !== Object.prototype && prototype !== null) {
		return value;
	}

	ancestors.add(value);
	const filtered = isArray
		? value.map((item) => filterSensitive(item, ancestors))
		: Object.fromEntries(
				Object.entries(value).map(([key, item]) => [
					key,
					isSensitiveKey(key) ? FILTERED_VALUE : filterSensitive(item, ancestors),
				])
			);
	ancestors.delete(value);

	return filtered;
}

function truncate(value, maxLength) {
	return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

// URLs are recorded without credentials, query string or fragment, which often carry tokens or personal data.
function cleanUrl(url) {
	try {
		const parsed = new URL(url);
		return `${parsed.origin}${parsed.pathname}`;
	} catch {
		return String(url).split(/[?#]/)[0];
	}
}

// What Node does with an unhandled rejection when nothing else handles it (--unhandled-rejections).
function unhandledRejectionMode() {
	const flags = [...process.execArgv, ...(process.env.NODE_OPTIONS || "").split(/\s+/)].join(" ");
	return flags.match(/--unhandled-rejections[= ](\S+)/)?.[1] || "throw";
}

class Orbitrace {
	static #config = null;
	static #pending = new Map();
	static #inFlight = new Set();
	static #pausedUntil = 0;
	static #breadcrumbs = [];
	// Undo functions for everything automatic capture installed; close() runs them.
	static #restore = [];
	static #fetch = null;
	static #handlingCrash = false;

	static getInstance(config) {
		this.assertServerRuntime();
		this.validateConfig(config);
		this.close();

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

		const autoCapture = this.#autoCaptureOptions(config.autoCapture);

		if (autoCapture && !this.#config.disabled) {
			this.#installAutoCapture(autoCapture);
		}
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

	// Queues the event and returns at once; it is sent in the background. flush() waits for delivery.
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

	// Records something that happened, sent with the next event of the current scope.
	static addBreadcrumb({ category = "manual", message = "", level = "info", data } = {}) {
		try {
			const breadcrumbs = scopes.getStore()?.breadcrumbs ?? this.#breadcrumbs;

			breadcrumbs.push({
				timestamp: Date.now(),
				category: String(category).slice(0, 64),
				level: BREADCRUMB_LEVELS.includes(level) ? level : "info",
				message: truncate(String(message), MAX_BREADCRUMB_MESSAGE_LENGTH),
				...(data !== undefined && { data: filterSensitive(data) }),
			});

			if (breadcrumbs.length > MAX_BREADCRUMBS) {
				breadcrumbs.shift();
			}
		} catch {
			// A breadcrumb that cannot be recorded is skipped.
		}
	}

	// Runs callback with its own breadcrumbs, for work that is not an Express request or wrapped function.
	static withScope(callback) {
		return scopes.run({ breadcrumbs: [] }, callback);
	}

	// Wraps a serverless handler: each invocation gets its own breadcrumbs, a thrown error is captured, and
	// pending events are sent before the handler returns, because the runtime may freeze right after.
	static wrap(handler) {
		return function orbitraceWrapped(...args) {
			return Orbitrace.withScope(async () => {
				try {
					return await handler.apply(this, args);
				} catch (error) {
					await Orbitrace.captureException(error, { mechanism: "wrap" });
					throw error;
				} finally {
					await Orbitrace.flush();
				}
			});
		};
	}

	// Express middleware, registered before the routes, that gives each request its own breadcrumbs.
	static expressRequestHandler() {
		return function orbitraceRequestHandler(req, res, next) {
			Orbitrace.withScope(() => next());
		};
	}

	// Express error middleware, registered after the routes: captures the error and passes it on unchanged.
	static expressErrorHandler() {
		return function orbitraceErrorHandler(error, req, res, next) {
			Orbitrace.captureException(error, {
				mechanism: "express",
				request: {
					method: req.method,
					path: String(req.originalUrl || req.url || "").split(/[?#]/)[0],
					statusCode: error?.status || error?.statusCode || 500,
				},
			});
			next(error);
		};
	}

	// Sends counts still held by the dedupe window and waits for in-flight requests.
	// Call it before a short-lived process or serverless invocation ends.
	static async flush() {
		await Promise.all([...this.#pending.keys()].map((key) => this.#flushPending(key)));
		await Promise.all(this.#inFlight);
	}

	// Removes the handlers and wrappers automatic capture installed and forgets the global breadcrumbs.
	static close() {
		for (const undo of this.#restore.splice(0).reverse()) {
			try {
				undo();
			} catch {
				// Restoring one hook must not stop the others.
			}
		}

		this.#fetch = null;
		this.#breadcrumbs = [];
		this.#handlingCrash = false;
	}

	// autoCapture: true, or { exceptions, console, fetch } to switch parts off. Off unless asked for, so
	// upgrading never changes how an existing application handles crashes or logs.
	static #autoCaptureOptions(value) {
		if (!value) {
			return null;
		}

		const options = value === true ? {} : value;

		return {
			exceptions: options.exceptions !== false,
			console: options.console !== false,
			fetch: options.fetch !== false,
		};
	}

	static #installAutoCapture(options) {
		if (options.exceptions) {
			const onUncaughtException = (error) => this.#handleCrash(error, "uncaughtException");
			const onUnhandledRejection = (reason) => this.#handleCrash(reason, "unhandledRejection");

			process.on("uncaughtException", onUncaughtException);
			process.on("unhandledRejection", onUnhandledRejection);
			this.#restore.push(() => {
				process.removeListener("uncaughtException", onUncaughtException);
				process.removeListener("unhandledRejection", onUnhandledRejection);
			});
		}

		if (options.console) {
			let recording = false;

			for (const [method, level] of Object.entries(CONSOLE_LEVELS)) {
				const original = console[method];

				if (typeof original !== "function") {
					continue;
				}

				console[method] = function orbitraceConsole(...args) {
					// The guard stops a breadcrumb that logs from recording itself again.
					if (!recording) {
						recording = true;
						try {
							const message = util.formatWithOptions(
								{
									depth: 1,
									maxArrayLength: 10,
									maxStringLength: MAX_BREADCRUMB_MESSAGE_LENGTH,
									breakLength: Infinity,
								},
								...args
							);

							if (!message.startsWith("Orbitrace:")) {
								Orbitrace.addBreadcrumb({ category: "console", level, message });
							}
						} catch {
							// Unformattable arguments only lose their breadcrumb.
						} finally {
							recording = false;
						}
					}

					return original.apply(this, args);
				};
				this.#restore.push(() => {
					console[method] = original;
				});
			}
		}

		if (options.fetch && typeof globalThis.fetch === "function") {
			const originalFetch = globalThis.fetch;
			const endpoint = this.#config.endpoint;

			// Orbitrace's own requests use the original fetch, so they are never recorded.
			this.#fetch = originalFetch;
			globalThis.fetch = async function orbitraceFetch(input, init) {
				const url = typeof input === "string" || input instanceof URL ? String(input) : input?.url;

				if (!url || url.startsWith(endpoint)) {
					return originalFetch.call(this, input, init);
				}

				const method = String(init?.method || input?.method || "GET").toUpperCase();
				const started = Date.now();
				const data = { method, url: cleanUrl(url) };

				try {
					const response = await originalFetch.call(this, input, init);

					Orbitrace.addBreadcrumb({
						category: "http",
						level: response.status >= 500 ? "error" : response.status >= 400 ? "warning" : "info",
						message: `${method} ${data.url} ${response.status}`,
						data: { ...data, status: response.status, durationMs: Date.now() - started },
					});

					return response;
				} catch (error) {
					Orbitrace.addBreadcrumb({
						category: "http",
						level: "error",
						message: `${method} ${data.url} failed`,
						data: { ...data, error: error?.message, durationMs: Date.now() - started },
					});

					throw error;
				}
			};
			this.#restore.push(() => {
				globalThis.fetch = originalFetch;
			});
		}
	}

	// Captures a crash, then does what Node would have done without this handler: exit with code 1, or follow
	// --unhandled-rejections. When the application registered its own handlers, it decides instead.
	static #handleCrash(reason, kind) {
		if (this.#handlingCrash) {
			return;
		}

		const decidesExit = process.listenerCount(kind) === 1;
		const mode = kind === "unhandledRejection" ? unhandledRejectionMode() : "throw";
		const error = reason instanceof Error ? reason : new Error(`Unhandled rejection: ${util.inspect(reason)}`);
		const exits = decidesExit && ["throw", "strict"].includes(mode);

		if (exits) {
			this.#handlingCrash = true;
		}

		const delivered = Promise.race([
			this.captureException(error, { mechanism: kind }).then(() => this.flush()),
			// Not unref'd: this timer keeps a crashing process alive until it exits with code 1.
			new Promise((resolve) => setTimeout(resolve, CRASH_FLUSH_TIMEOUT_MS)),
		]).catch(() => {});

		if (!decidesExit || mode === "none") {
			return;
		}

		process.stderr.write(`${error.stack || error.message}\n`);

		if (mode === "warn-with-error-code") {
			process.exitCode = 1;
		}

		if (exits) {
			delivered.finally(() => process.exit(1));
		}
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

		const breadcrumbs = [...(scopes.getStore()?.breadcrumbs ?? this.#breadcrumbs)];
		const payload = {
			...fields,
			metadata: {
				...filterSensitive(metadata),
				env: this.#config.environment,
				version: this.#config.version,
				service: this.#config.service,
			},
			...(breadcrumbs.length > 0 && { breadcrumbs }),
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

		// Not awaited: the caller never waits for the network. flush() waits for in-flight requests.
		this.#send(event, payload, 1);
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
			const response = await (this.#fetch || fetch)(this.#config.endpoint, {
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
