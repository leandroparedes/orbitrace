const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");

const BROWSER_SDK = path.join(__dirname, "../src/browser.js");
const NODE_SDK = path.join(__dirname, "../src/index.js");

// A local stand-in for the ingestion endpoint that records every event and the headers it came with.
async function endpoint(t) {
	const requests = [];
	const server = http.createServer((req, res) => {
		let body = "";
		req.on("data", (chunk) => (body += chunk));
		req.on("end", () => {
			requests.push({ headers: req.headers, body: body ? JSON.parse(body) : null });
			res.setHeader("content-type", "application/json");
			res.end('{"success":true}');
		});
	});
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	t.after(() => new Promise((resolve) => server.close(resolve)));
	const base = `http://127.0.0.1:${server.address().port}`;
	return { requests, events: () => requests.map((request) => request.body), base, url: `${base}/log` };
}

// A minimal browser: window and document dispatch events, history changes the location.
function browser(t) {
	const window = Object.assign(new EventTarget(), {
		fetch: globalThis.fetch,
		location: { href: "https://app.example.com/home?token=abc#top" },
		innerWidth: 1280,
		innerHeight: 720,
		navigator: { language: "es-CL" },
	});
	window.history = {
		pushState(state, title, url) {
			window.location.href = new URL(url, window.location.href).href;
		},
		replaceState(state, title, url) {
			window.location.href = new URL(url, window.location.href).href;
		},
	};
	const document = Object.assign(new EventTarget(), { referrer: "https://google.com/search?q=orbitai" });
	const { fetch } = globalThis;
	globalThis.window = window;
	globalThis.document = document;
	t.after(() => {
		delete globalThis.window;
		delete globalThis.document;
		globalThis.fetch = fetch;
	});
	return { window, document };
}

function load(t, config) {
	delete require.cache[BROWSER_SDK];
	const Orbitrace = require(BROWSER_SDK);
	if (config) Orbitrace.init({ publicKey: "public", orgId: "o", projectId: "p", ...config });
	t.after(() => Orbitrace.close());
	return Orbitrace;
}

const silence = (t) => {
	const { log, error, warn, info, debug } = console;
	Object.assign(console, { log() {}, error() {}, warn() {}, info() {}, debug() {} });
	t.after(() => Object.assign(console, { log, error, warn, info, debug }));
};

test("the browser entry takes the public key and refuses the server secret; the Node entry refuses browsers", async (t) => {
	browser(t);
	const Orbitrace = load(t);
	assert.throws(() => Orbitrace.init({ apiKey: "secret", orgId: "o", projectId: "p", endpoint: "x" }), /publicKey/);
	assert.throws(() => Orbitrace.init({ orgId: "o", projectId: "p", endpoint: "x" }), /publicKey/);
	delete require.cache[NODE_SDK];
	assert.throws(() => require(NODE_SDK).getInstance({ apiKey: "k", orgId: "o", projectId: "p", endpoint: "x" }), /browser/);
});

test("unhandled errors and rejections are sent with the page, the user and what happened before", async (t) => {
	const { window, document } = browser(t);
	const server = await endpoint(t);
	silence(t);
	const Orbitrace = load(t, { endpoint: server.url, environment: "staging", version: "2.0.0" });
	Orbitrace.setUser({ id: "u1", token: "secret" });

	console.log("cart loaded", { items: 2 });
	document.dispatchEvent(Object.assign(new Event("click"), {}));
	await fetch(`${server.base}/api/cart?token=secret`);
	window.history.pushState({}, "", "/checkout?step=2");
	window.dispatchEvent(Object.assign(new Event("error"), { error: new Error("render failed"), filename: `${server.base}/assets/app-abc123.js?v=1`, lineno: 1, colno: 2 }));
	window.dispatchEvent(Object.assign(new Event("unhandledrejection"), { reason: { code: 42 } }));
	await Orbitrace.flush();

	assert.equal(server.requests.length, 3, "the cart request is the app's; two events were sent");
	const [cart, failed, rejected] = server.requests;
	assert.equal(cart.headers["x-orbitrace-api-key"], undefined);
	assert.equal(failed.headers["x-orbitrace-api-key"], "public");
	assert.equal(failed.headers["x-orbitrace-org-id"], "o");
	assert.equal(failed.body.event, "capture_exception");
	assert.equal(failed.body.payload.message, "render failed");
	assert.match(failed.body.payload.stack, /render failed/);
	const { metadata } = failed.body.payload;
	assert.equal(metadata.mechanism, "onerror");
	assert.equal(metadata.source, `${server.base}/assets/app-abc123.js:1:2`);
	assert.deepEqual({ env: metadata.env, version: metadata.version, service: metadata.service }, { env: "staging", version: "2.0.0", service: "browser" });
	assert.deepEqual(metadata.user, { id: "u1", token: "[Filtered]" });
	assert.deepEqual(metadata.page, {
		url: "https://app.example.com/checkout",
		referrer: "https://google.com/search",
		viewport: "1280x720",
		language: "es-CL",
	});
	assert.deepEqual(
		failed.body.payload.breadcrumbs.map(({ timestamp, data, ...crumb }) => crumb),
		[
			{ category: "console", level: "info", message: 'cart loaded {"items":2}' },
			{ category: "ui.click", level: "info", message: "unknown" },
			{ category: "http", level: "info", message: `GET ${server.base}/api/cart 200` },
			{ category: "navigation", level: "info", message: "https://app.example.com/home -> https://app.example.com/checkout" },
		],
	);
	assert.equal(rejected.body.payload.message, 'Unhandled rejection: {"code":42}');
	assert.equal(rejected.body.payload.metadata.mechanism, "unhandledrejection");

	Orbitrace.close();
	assert.equal(globalThis.fetch.name, "fetch", "close() restores fetch");
	window.dispatchEvent(Object.assign(new Event("error"), { error: new Error("after close") }));
	await Orbitrace.flush();
	assert.equal(server.requests.length, 3, "after close() nothing is captured automatically");
});

test("repeats are counted and sent once, autoCapture can be switched off, and the Vue plugin forwards errors", async (t) => {
	const { window } = browser(t);
	const server = await endpoint(t);
	silence(t);
	const { log } = console;
	const Orbitrace = load(t, { endpoint: server.url, autoCapture: false });
	assert.equal(console.log, log, "nothing is wrapped");

	for (let i = 0; i < 3; i++) Orbitrace.captureMessage("same thing");
	window.dispatchEvent(Object.assign(new Event("error"), { error: new Error("ignored") }));
	await Orbitrace.flush();
	assert.deepEqual(
		server.events().map((event) => [event.payload.message, event.count ?? 1]),
		[
			["same thing", 1],
			["same thing", 2],
		],
	);

	const seen = [];
	const app = { config: { errorHandler: (error, instance, info) => seen.push([error.message, info]) } };
	app.use = (plugin) => plugin.install(app);
	app.use(Orbitrace.vue);
	app.config.errorHandler(new Error("component broke"), { $options: { name: "Checkout" } }, "render");
	assert.deepEqual(seen, [["component broke", "render"]], "the app's own handler still runs");
	await Orbitrace.flush();
	const vueEvent = server.events().at(-1);
	assert.equal(vueEvent.payload.message, "component broke");
	assert.deepEqual(
		{ mechanism: vueEvent.payload.metadata.mechanism, component: vueEvent.payload.metadata.component, info: vueEvent.payload.metadata.info },
		{ mechanism: "vue", component: "Checkout", info: "render" },
	);
});
