// What the Node and browser entries have in common: bounding and filtering what is sent, breadcrumb
// records, and delivery. Reporting must never slow down or break the host application: capture calls
// return before anything is sent, requests go out in the background, and every failure is logged and
// swallowed.
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

// Records a breadcrumb on `breadcrumbs`, dropping the oldest beyond the limit. Never throws.
function pushBreadcrumb(breadcrumbs, { category = "manual", message = "", level = "info", data } = {}) {
	try {
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

// Breadcrumb for a fetch call: the request is recorded without URL secrets, with its status or failure.
function httpBreadcrumb({ method, url, status, error, started }) {
	const data = { method, url: cleanUrl(url), durationMs: Date.now() - started };

	if (error) {
		return { category: "http", level: "error", message: `${method} ${data.url} failed`, data: { ...data, error } };
	}

	return {
		category: "http",
		level: status >= 500 ? "error" : status >= 400 ? "warning" : "info",
		message: `${method} ${data.url} ${status}`,
		data: { ...data, status },
	};
}

// Wraps globalThis.fetch so each call leaves a breadcrumb; the SDK's own requests to `endpoint` are skipped
// and keep using the original. Returns the original fetch, or null when there is none to wrap.
function recordFetch({ endpoint, addBreadcrumb, restore }) {
	if (typeof globalThis.fetch !== "function") {
		return null;
	}

	const originalFetch = globalThis.fetch;

	globalThis.fetch = async function orbitraceFetch(input, init) {
		const url = typeof input === "string" || input instanceof URL ? String(input) : input?.url;

		if (!url || url.startsWith(endpoint)) {
			return originalFetch.call(this, input, init);
		}

		const method = String(init?.method || input?.method || "GET").toUpperCase();
		const started = Date.now();

		try {
			const response = await originalFetch.call(this, input, init);
			addBreadcrumb(httpBreadcrumb({ method, url, status: response.status, started }));
			return response;
		} catch (error) {
			addBreadcrumb(httpBreadcrumb({ method, url, error: error?.message, started }));
			throw error;
		}
	};
	restore.push(() => {
		globalThis.fetch = originalFetch;
	});

	return originalFetch;
}

// Wraps the console methods so each call leaves a breadcrumb. `format` turns the arguments into one line.
// The SDK's own logs start with "Orbitrace:" and are skipped.
function recordConsole({ format, addBreadcrumb, restore }) {
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
					const message = format(args);

					if (!message.startsWith("Orbitrace:")) {
						addBreadcrumb({ category: "console", level, message });
					}
				} catch {
					// Unformattable arguments only lose their breadcrumb.
				} finally {
					recording = false;
				}
			}

			return original.apply(this, args);
		};
		restore.push(() => {
			console[method] = original;
		});
	}
}

// Delivers events: repeats inside the dedupe window are counted and sent once, at most MAX_IN_FLIGHT
// requests are open, and a 429 pauses sending for the server's Retry-After period.
class Sender {
	#endpoint;
	#headers;
	#getFetch;
	#requestOptions;
	#pending = new Map();
	#inFlight = new Set();
	#pausedUntil = 0;

	// `getFetch` returns the fetch to use at send time, so a wrapped global fetch is never recorded.
	// `requestOptions(body)` adds fetch options for one request, such as keepalive in browsers.
	constructor({ endpoint, headers, getFetch = () => globalThis.fetch, requestOptions = () => ({}) }) {
		this.#endpoint = endpoint;
		this.#headers = headers;
		this.#getFetch = getFetch;
		this.#requestOptions = requestOptions;
	}

	// Queues the event and returns at once; it is sent in the background. flush() waits for delivery.
	capture(event, payload) {
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

	// Sends counts still held by the dedupe window and waits for in-flight requests.
	async flush() {
		await Promise.all([...this.#pending.keys()].map((key) => this.#flushPending(key)));
		await Promise.all(this.#inFlight);
	}

	async #flushPending(key) {
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

	#canSend() {
		return Date.now() >= this.#pausedUntil && this.#inFlight.size < MAX_IN_FLIGHT;
	}

	#send(event, payload, count) {
		const request = this.#post(event, payload, count).finally(() => this.#inFlight.delete(request));
		this.#inFlight.add(request);

		return request;
	}

	async #post(event, payload, count) {
		try {
			const body = JSON.stringify({ event, ...(count > 1 && { count }), payload });
			const response = await this.#getFetch()(this.#endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json", ...this.#headers },
				body,
				signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
				...this.#requestOptions(body),
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

module.exports = {
	MAX_BREADCRUMB_MESSAGE_LENGTH,
	Sender,
	cleanUrl,
	filterSensitive,
	pushBreadcrumb,
	recordConsole,
	recordFetch,
	truncate,
};
