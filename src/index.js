const { AsyncLocalStorage } = require("node:async_hooks");
const util = require("node:util");
const {
	MAX_BREADCRUMB_MESSAGE_LENGTH,
	Sender,
	filterSensitive,
	pushBreadcrumb,
	recordConsole,
	recordFetch,
} = require("./shared");

// How long a crashing process waits for its last event before exiting.
const CRASH_FLUSH_TIMEOUT_MS = 2000;

// Each request or wrapped invocation gets its own breadcrumbs, so concurrent work never mixes histories.
const scopes = new AsyncLocalStorage();

// What Node does with an unhandled rejection when nothing else handles it (--unhandled-rejections).
function unhandledRejectionMode() {
	const flags = [...process.execArgv, ...(process.env.NODE_OPTIONS || "").split(/\s+/)].join(" ");
	return flags.match(/--unhandled-rejections[= ](\S+)/)?.[1] || "throw";
}

class Orbitrace {
	static #config = null;
	static #sender = null;
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
		this.#sender = new Sender({
			endpoint: config.endpoint,
			headers: {
				"x-orbitrace-api-key": config.apiKey,
				"x-orbitrace-org-id": config.orgId,
				"x-orbitrace-project-id": config.projectId,
			},
			// Orbitrace's own requests use the original fetch, so they are never recorded.
			getFetch: () => this.#fetch || fetch,
		});

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
				"Orbitrace can only be initialized in backend/server runtimes; use @orbitai/orbitrace/browser in the browser"
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
	static addBreadcrumb(breadcrumb) {
		pushBreadcrumb(scopes.getStore()?.breadcrumbs ?? this.#breadcrumbs, breadcrumb);
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
		await this.#sender?.flush();
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
		const addBreadcrumb = (breadcrumb) => this.addBreadcrumb(breadcrumb);

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
			recordConsole({
				addBreadcrumb,
				restore: this.#restore,
				format: (args) =>
					util.formatWithOptions(
						{
							depth: 1,
							maxArrayLength: 10,
							maxStringLength: MAX_BREADCRUMB_MESSAGE_LENGTH,
							breakLength: Infinity,
						},
						...args
					),
			});
		}

		if (options.fetch) {
			this.#fetch = recordFetch({ endpoint: this.#config.endpoint, addBreadcrumb, restore: this.#restore });
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

		this.#sender.capture(event, {
			...fields,
			metadata: {
				...filterSensitive(metadata),
				env: this.#config.environment,
				version: this.#config.version,
				service: this.#config.service,
			},
			...(breadcrumbs.length > 0 && { breadcrumbs }),
		});
	}
}

module.exports = Orbitrace;
