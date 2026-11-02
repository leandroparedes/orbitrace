const { Sender, cleanUrl, filterSensitive, pushBreadcrumb, recordConsole, recordFetch, truncate } = require("./shared");

// Requests with keepalive survive the page being closed, but browsers cap them at 64 KB in flight.
// Larger events (long stacks with many breadcrumbs) are sent without it.
const MAX_KEEPALIVE_BODY_BYTES = 60 * 1024;
const MAX_CONSOLE_ARG_LENGTH = 200;

// One line for a console call, like the console shows it.
function formatConsoleArgs(args) {
	return args
		.map((arg) => {
			if (typeof arg === "string") {
				return arg;
			}

			if (arg instanceof Error) {
				return arg.stack || arg.message;
			}

			try {
				return truncate(JSON.stringify(arg), MAX_CONSOLE_ARG_LENGTH);
			} catch {
				return String(arg);
			}
		})
		.join(" ");
}

// Describes a clicked element without its text, which may be personal: "button#save.primary".
function describeElement(element) {
	if (!element || typeof element.tagName !== "string") {
		return "unknown";
	}

	const tag = element.tagName.toLowerCase();
	const id = element.id ? `#${element.id}` : "";
	const classes =
		typeof element.className === "string" && element.className.trim()
			? `.${element.className.trim().split(/\s+/).slice(0, 3).join(".")}`
			: "";

	return `${tag}${id}${classes}`;
}

class Orbitrace {
	static #config = null;
	static #sender = null;
	static #breadcrumbs = [];
	static #user = null;
	// Undo functions for everything automatic capture installed; close() runs them.
	static #restore = [];
	static #fetch = null;

	// Automatic capture is on unless autoCapture is false or parts of it are switched off.
	static init(config) {
		this.assertBrowserRuntime();
		this.validateConfig(config);
		this.close();

		this.#config = {
			orgId: config.orgId,
			projectId: config.projectId,
			endpoint: config.endpoint,
			environment: config.environment || "production",
			version: config.version || "1.0.0",
			service: config.service || "browser",
			disabled: config.disabled || false,
		};
		this.#sender = new Sender({
			endpoint: config.endpoint,
			headers: {
				"x-orbitrace-api-key": config.publicKey,
				"x-orbitrace-org-id": config.orgId,
				"x-orbitrace-project-id": config.projectId,
			},
			// Orbitrace's own requests use the original fetch, so they are never recorded.
			getFetch: () => this.#fetch || window.fetch.bind(window),
			requestOptions: (body) => ({ keepalive: body.length <= MAX_KEEPALIVE_BODY_BYTES }),
		});

		const autoCapture = this.#autoCaptureOptions(config.autoCapture);

		if (autoCapture && !this.#config.disabled) {
			this.#installAutoCapture(autoCapture);
		}
	}

	static validateConfig(config) {
		if (config.apiKey) {
			throw new Error(
				"Orbitrace: apiKey is a server secret and must not ship in a browser bundle; use the project's publicKey"
			);
		}

		const requiredFields = ["publicKey", "orgId", "projectId", "endpoint"];
		const missingFields = requiredFields.filter((field) => !config[field]);

		if (missingFields.length > 0) {
			throw new Error(`Missing required configuration fields: ${missingFields.join(", ")}`);
		}
	}

	static assertBrowserRuntime() {
		if (typeof window === "undefined" || typeof document === "undefined") {
			throw new Error("Orbitrace: @orbitai/orbitrace/browser runs in browsers; use @orbitai/orbitrace on servers");
		}
	}

	// Queues the event and returns at once; it is sent in the background. flush() waits for delivery.
	static captureException(error, metadata = {}) {
		const message = error?.message || error?.name || String(error);

		this.#capture("capture_exception", {
			message,
			stack: error?.stack || message,
			metadata,
		});
	}

	static captureMessage(message, metadata = {}) {
		this.#capture("capture_message", { message, metadata });
	}

	// Records something that happened, sent with the next event.
	static addBreadcrumb(breadcrumb) {
		pushBreadcrumb(this.#breadcrumbs, breadcrumb);
	}

	// Identifies the signed-in user on every following event. Send a stable id, not personal data.
	// Pass null when the user signs out.
	static setUser(user) {
		this.#user = user ? filterSensitive(user) : null;
	}

	// Sends counts still held by the dedupe window and waits for in-flight requests.
	static async flush() {
		await this.#sender?.flush();
	}

	// Removes the listeners and wrappers automatic capture installed and forgets breadcrumbs and the user.
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
		this.#user = null;
	}

	// Vue 3 plugin: app.use(Orbitrace.vue). Errors Vue catches in components are captured with the component
	// name and where Vue caught them, then passed to the handler the app had, or logged as Vue would.
	static get vue() {
		return {
			install(app) {
				const previous = app.config.errorHandler;

				app.config.errorHandler = (error, instance, info) => {
					Orbitrace.captureException(error, {
						mechanism: "vue",
						component: instance?.$options?.name || instance?.$?.type?.__name || "anonymous",
						info,
					});

					if (previous) {
						previous(error, instance, info);
					} else {
						console.error(error);
					}
				};
			},
		};
	}

	// autoCapture: omitted or true for everything, false for nothing, or { exceptions, console, fetch,
	// clicks, navigation } to switch parts off.
	static #autoCaptureOptions(value) {
		if (value === false) {
			return null;
		}

		const options = value === true || value === undefined ? {} : value;

		return {
			exceptions: options.exceptions !== false,
			console: options.console !== false,
			fetch: options.fetch !== false,
			clicks: options.clicks !== false,
			navigation: options.navigation !== false,
		};
	}

	static #installAutoCapture(options) {
		const addBreadcrumb = (breadcrumb) => this.addBreadcrumb(breadcrumb);
		const listen = (target, type, listener, capture = false) => {
			target.addEventListener(type, listener, capture);
			this.#restore.push(() => target.removeEventListener(type, listener, capture));
		};

		if (options.exceptions) {
			listen(window, "error", (event) => {
				// A script from another origin only yields "Script error." with no stack; it is still worth a group.
				const error = event.error ?? new Error(event.message || "Unknown error");
				this.captureException(error, {
					mechanism: "onerror",
					...(event.filename && { source: `${cleanUrl(event.filename)}:${event.lineno}:${event.colno}` }),
				});
			});
			listen(window, "unhandledrejection", (event) => {
				const reason = event.reason;
				const error =
					reason instanceof Error ? reason : new Error(`Unhandled rejection: ${formatConsoleArgs([reason])}`);
				this.captureException(error, { mechanism: "unhandledrejection" });
			});
		}

		if (options.console) {
			recordConsole({ addBreadcrumb, restore: this.#restore, format: formatConsoleArgs });
		}

		if (options.fetch) {
			this.#fetch = recordFetch({ endpoint: this.#config.endpoint, addBreadcrumb, restore: this.#restore });
		}

		if (options.clicks) {
			listen(
				document,
				"click",
				(event) => addBreadcrumb({ category: "ui.click", message: describeElement(event.target) }),
				true
			);
		}

		if (options.navigation) {
			let from = cleanUrl(window.location.href);
			const navigated = () => {
				const to = cleanUrl(window.location.href);

				if (to !== from) {
					addBreadcrumb({ category: "navigation", message: `${from} -> ${to}`, data: { from, to } });
					from = to;
				}
			};

			for (const method of ["pushState", "replaceState"]) {
				const original = window.history[method];

				if (typeof original !== "function") {
					continue;
				}

				window.history[method] = function orbitraceHistory(...args) {
					const result = original.apply(this, args);
					navigated();
					return result;
				};
				this.#restore.push(() => {
					window.history[method] = original;
				});
			}

			listen(window, "popstate", navigated);
			listen(window, "hashchange", navigated);
		}

		// Repeats counted during the dedupe window would be lost when the page closes; keepalive lets them out.
		listen(window, "pagehide", () => this.#sender.flush());
	}

	static #capture(event, { metadata, ...fields }) {
		if (!this.#config) {
			console.error("Orbitrace: call Orbitrace.init() before capturing events");
			return;
		}

		if (this.#config.disabled) {
			return;
		}

		try {
			const breadcrumbs = [...this.#breadcrumbs];

			this.#sender.capture(event, {
				...fields,
				metadata: {
					...filterSensitive(metadata),
					env: this.#config.environment,
					version: this.#config.version,
					service: this.#config.service,
					...(this.#user && { user: this.#user }),
					// Where it happened. URLs lose their query string and fragment.
					page: {
						url: cleanUrl(window.location.href),
						...(document.referrer && { referrer: cleanUrl(document.referrer) }),
						viewport: `${window.innerWidth}x${window.innerHeight}`,
						language: window.navigator?.language,
					},
				},
				...(breadcrumbs.length > 0 && { breadcrumbs }),
			});
		} catch (error) {
			console.error("Orbitrace: could not capture the event", error?.message);
		}
	}
}

module.exports = Orbitrace;
