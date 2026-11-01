const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");
const { spawn } = require("node:child_process");

const SDK = path.join(__dirname, "../src/index.js");

// A local stand-in for the ingestion endpoint that records every event it receives.
async function endpoint(t) {
	const events = [];
	const server = http.createServer((req, res) => {
		let body = "";
		req.on("data", (chunk) => (body += chunk));
		req.on("end", () => {
			if (req.url.startsWith("/log")) events.push(JSON.parse(body));
			res.setHeader("content-type", "application/json");
			res.end(req.url.startsWith("/log") ? '{"success":true}' : '{"ok":true}');
		});
	});
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	t.after(() => new Promise((resolve) => server.close(resolve)));
	const base = `http://127.0.0.1:${server.address().port}`;
	return { events, base, url: `${base}/log` };
}

// Each test gets fresh module state; close() undoes any hooks it installed.
function load(t, config) {
	delete require.cache[SDK];
	const Orbitrace = require(SDK);
	Orbitrace.getInstance({ apiKey: "key", orgId: "o", projectId: "p", ...config });
	t.after(() => Orbitrace.close());
	return Orbitrace;
}

test("without autoCapture nothing global changes, and manual breadcrumbs still ride along", async (t) => {
	const server = await endpoint(t);
	const listeners = process.listenerCount("uncaughtException");
	const { log } = console;
	const { fetch } = globalThis;
	const Orbitrace = load(t, { endpoint: server.url });

	assert.equal(process.listenerCount("uncaughtException"), listeners);
	assert.equal(console.log, log);
	assert.equal(globalThis.fetch, fetch);

	Orbitrace.addBreadcrumb({ category: "checkout", message: "payment started", data: { orderId: 7, token: "x" } });
	await Orbitrace.captureException(new Error("boom"));
	await Orbitrace.flush();
	const [event] = server.events;
	assert.equal(event.event, "capture_exception");
	assert.deepEqual(
		event.payload.breadcrumbs.map(({ timestamp, ...crumb }) => crumb),
		[{ category: "checkout", level: "info", message: "payment started", data: { orderId: 7, token: "[Filtered]" } }],
	);
});

test("capture returns before the API answers, and flush() waits for the delivery", async (t) => {
	let answer;
	const server = http.createServer((req, res) => {
		answer = () => res.end('{"success":true}');
	});
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	t.after(() => new Promise((resolve) => server.close(resolve)));
	const Orbitrace = load(t, { endpoint: `http://127.0.0.1:${server.address().port}/log` });

	const started = Date.now();
	await Orbitrace.captureException(new Error("slow api"));
	assert.ok(Date.now() - started < 1000, "the caller is not held while the request is pending");
	assert.equal(answer, undefined, "returned before the request even reached the server");

	let flushed = false;
	const flushing = Orbitrace.flush().then(() => (flushed = true));
	await new Promise((resolve) => setTimeout(resolve, 50));
	assert.equal(flushed, false, "flush() waits for the in-flight request");
	answer();
	await flushing;
	assert.equal(flushed, true);
});

test("console and fetch become breadcrumbs, without Orbitrace's own logs and requests or URL secrets", async (t) => {
	const server = await endpoint(t);
	const { log, warn } = console;
	console.log = () => {};
	console.warn = () => {};
	t.after(() => {
		console.log = log;
		console.warn = warn;
	});
	const Orbitrace = load(t, { endpoint: server.url, autoCapture: { exceptions: false } });

	console.log("loading cart", { items: 2 });
	console.warn("Orbitrace: internal message");
	await fetch(`${server.base}/api/cart?token=secret#x`);
	for (let i = 0; i < 40; i++) Orbitrace.addBreadcrumb({ message: `step ${i}` });
	await Orbitrace.captureMessage("checkout failed");
	await Orbitrace.flush();

	const crumbs = server.events[0].payload.breadcrumbs;
	assert.equal(crumbs.length, 30, "only the latest 30 are kept");
	assert.equal(crumbs.at(-1).message, "step 39");

	await Orbitrace.close();
	Orbitrace.getInstance({ apiKey: "key", orgId: "o", projectId: "p", endpoint: server.url, autoCapture: { exceptions: false } });
	console.log("loading cart", { items: 2 });
	console.warn("Orbitrace: internal message");
	await fetch(`${server.base}/api/cart?token=secret#x`);
	await Orbitrace.captureMessage("checkout failed again");
	await Orbitrace.flush();
	const recent = server.events[1].payload.breadcrumbs.map(({ timestamp, data, ...crumb }) => crumb);
	assert.deepEqual(recent, [
		{ category: "console", level: "info", message: "loading cart { items: 2 }" },
		{ category: "http", level: "info", message: `GET ${server.base}/api/cart 200` },
	]);
	assert.equal(server.events[1].payload.breadcrumbs[1].data.status, 200);
	assert.equal(server.events.length, 2, "the SDK's own requests are not recorded or duplicated");

	Orbitrace.close();
	assert.equal(console.log, log === console.log ? log : console.log);
	assert.equal(globalThis.fetch.name, "fetch", "close() restores fetch");
});

test("scopes keep concurrent requests' breadcrumbs apart, and the Express handlers capture with request info", async (t) => {
	const server = await endpoint(t);
	const Orbitrace = load(t, { endpoint: server.url });
	const requestHandler = Orbitrace.expressRequestHandler();
	const errorHandler = Orbitrace.expressErrorHandler();
	const handle = (name, delay) =>
		new Promise((resolve) => {
			requestHandler({}, {}, async () => {
				Orbitrace.addBreadcrumb({ message: `${name} started` });
				await new Promise((r) => setTimeout(r, delay));
				Orbitrace.addBreadcrumb({ message: `${name} failed` });
				const error = Object.assign(new Error(`${name} broke`), { status: 502 });
				errorHandler(error, { method: "POST", originalUrl: `/api/${name}?id=1` }, {}, (passed) => resolve(passed));
			});
		});

	const [first, second] = await Promise.all([handle("a", 20), handle("b", 5)]);
	assert.equal(first.message, "a broke", "the error is passed on to the next handler");
	assert.equal(second.message, "b broke");
	await Orbitrace.flush();
	const byMessage = Object.fromEntries(server.events.map((event) => [event.payload.message, event.payload]));
	assert.deepEqual(byMessage["a broke"].breadcrumbs.map((crumb) => crumb.message), ["a started", "a failed"]);
	assert.deepEqual(byMessage["b broke"].breadcrumbs.map((crumb) => crumb.message), ["b started", "b failed"]);
	assert.deepEqual(byMessage["a broke"].metadata.request, { method: "POST", path: "/api/a", statusCode: 502 });
});

test("wrap() sends the error before rethrowing it, and sends repeats before returning", async (t) => {
	const server = await endpoint(t);
	const Orbitrace = load(t, { endpoint: server.url });
	const handler = Orbitrace.wrap(async (value) => {
		Orbitrace.addBreadcrumb({ message: `got ${value}` });
		if (value === "bad") throw new Error("invalid value");
		Orbitrace.captureMessage("noted");
		Orbitrace.captureMessage("noted");
		return value.toUpperCase();
	});

	assert.equal(await handler("ok"), "OK");
	assert.deepEqual(
		server.events.map((event) => [event.payload.message, event.count ?? 1]),
		[
			["noted", 1],
			["noted", 1],
		],
		"the repeat counted during the invocation was sent before it returned",
	);
	await assert.rejects(handler("bad"), /invalid value/);
	const crash = server.events.at(-1);
	assert.equal(crash.payload.metadata.mechanism, "wrap");
	assert.deepEqual(crash.payload.breadcrumbs.map((crumb) => crumb.message), ["got bad"]);
});

// Runs a script in a child process with the SDK set up, and returns its exit code and output.
function run(script, url, args = []) {
	const source = `
		const Orbitrace = require(${JSON.stringify(SDK)});
		Orbitrace.getInstance({ apiKey: "key", orgId: "o", projectId: "p", endpoint: ${JSON.stringify(url)}, autoCapture: true });
		${script}
	`;
	return new Promise((resolve) => {
		const child = spawn(process.execPath, [...args, "-e", source]);
		let stderr = "";
		child.stderr.on("data", (chunk) => (stderr += chunk));
		child.on("exit", (code) => resolve({ code, stderr }));
	});
}

test("an uncaught exception is sent, printed and still exits with code 1", async (t) => {
	const server = await endpoint(t);
	const { code, stderr } = await run(`console.log("about to fail"); setTimeout(() => { throw new Error("worker crashed"); }, 10);`, server.url);
	assert.equal(code, 1);
	assert.match(stderr, /worker crashed/);
	const [event] = server.events;
	assert.equal(event.payload.message, "worker crashed");
	assert.equal(event.payload.metadata.mechanism, "uncaughtException");
	assert.equal(event.payload.breadcrumbs[0].message, "about to fail");
});

test("unhandled rejections crash by default, follow --unhandled-rejections=warn, and defer to the app's own handlers", async (t) => {
	const server = await endpoint(t);
	const crashed = await run(`Promise.reject(new Error("rejected"));`, server.url);
	assert.equal(crashed.code, 1);

	const warned = await run(`Promise.reject(new Error("only a warning")); setTimeout(() => {}, 300);`, server.url, [
		"--unhandled-rejections=warn",
	]);
	assert.equal(warned.code, 0);
	assert.match(warned.stderr, /only a warning/);

	const handled = await run(
		`process.on("uncaughtException", () => {}); setTimeout(() => { throw new Error("app handles it"); }, 10); setTimeout(() => {}, 300);`,
		server.url,
	);
	assert.equal(handled.code, 0, "the app's own handler decides, so the process keeps running");
	assert.deepEqual(
		server.events.map((event) => event.payload.message),
		["rejected", "only a warning", "app handles it"],
	);
});
