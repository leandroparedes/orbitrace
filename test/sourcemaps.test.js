const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { upload, parseArgs } = require("../bin/orbitrace-sourcemaps");

// A stand-in for the Orbitrace API and the storage it signs uploads for.
async function api(t) {
	const calls = [];
	const stored = {};
	const server = http.createServer((req, res) => {
		let body = "";
		req.on("data", (chunk) => (body += chunk));
		req.on("end", () => {
			const base = `http://127.0.0.1:${server.address().port}`;
			calls.push({ method: req.method, url: req.url, headers: req.headers, body });
			res.setHeader("content-type", "application/json");

			if (req.url === "/sourcemaps/releases") {
				const { release, files } = JSON.parse(body);
				res.end(
					JSON.stringify({
						release,
						uploads: files.map(({ name }) => ({
							name,
							url: `${base}/storage/${release}/${name}`,
							headers: { "Content-Type": "application/json", "x-goog-content-length-range": "1,52428800" },
						})),
					}),
				);
			} else if (req.url.startsWith("/storage/")) {
				stored[req.url.slice("/storage/".length)] = body;
				res.end("{}");
			} else if (req.url === "/sourcemaps/releases/complete") {
				const { release, files } = JSON.parse(body);
				res.end(JSON.stringify({ release, files: files.length, bytes: 42, deletedReleases: ["0.9.0"] }));
			} else {
				res.statusCode = 404;
				res.end(JSON.stringify({ error: "not found" }));
			}
		});
	});
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	t.after(() => new Promise((resolve) => server.close(resolve)));
	return { calls, stored, endpoint: `http://127.0.0.1:${server.address().port}/log` };
}

async function build(t) {
	const dir = await fs.mkdtemp(path.join(os.tmpdir(), "orbitrace-maps-"));
	t.after(() => fs.rm(dir, { recursive: true, force: true }));
	await fs.mkdir(path.join(dir, "assets"));
	await fs.writeFile(path.join(dir, "assets", "index-39fc6623.js"), "minified");
	await fs.writeFile(path.join(dir, "assets", "index-39fc6623.js.map"), '{"version":3,"mappings":"AAAA"}');
	await fs.writeFile(path.join(dir, "assets", "vendor-f00dbabe.js.map"), '{"version":3,"mappings":""}');
	return dir;
}

const credentials = { apiKey: "secret", orgId: "o", projectId: "p" };

test("upload declares every map, puts each to its signed URL, completes the release and can delete the maps", async (t) => {
	const server = await api(t);
	const dir = await build(t);
	const lines = [];

	const result = await upload({ ...credentials, endpoint: server.endpoint, release: "1.22.9", dir, remove: true, log: (line) => lines.push(line) });
	assert.deepEqual(result, { release: "1.22.9", files: 2, bytes: 42, deletedReleases: ["0.9.0"] });

	const [declare, putA, putB, complete] = server.calls;
	assert.equal(declare.url, "/sourcemaps/releases", "the routes live next to the events endpoint");
	assert.equal(declare.headers["x-orbitrace-api-key"], "secret");
	assert.deepEqual(JSON.parse(declare.body), {
		release: "1.22.9",
		files: [
			{ name: "index-39fc6623.js.map", size: 31 },
			{ name: "vendor-f00dbabe.js.map", size: 27 },
		],
	});
	assert.deepEqual(
		[putA.method, putA.headers["content-type"], putA.headers["x-goog-content-length-range"]],
		["PUT", "application/json", "1,52428800"],
		"the PUT carries exactly the headers the URL was signed with",
	);
	assert.equal(putA.headers["x-orbitrace-api-key"], undefined, "the API key never goes to the storage URL");
	assert.equal(server.stored["1.22.9/index-39fc6623.js.map"], '{"version":3,"mappings":"AAAA"}');
	assert.equal(putB.url, "/storage/1.22.9/vendor-f00dbabe.js.map");
	assert.deepEqual(JSON.parse(complete.body), { release: "1.22.9", files: ["index-39fc6623.js.map", "vendor-f00dbabe.js.map"] });

	assert.deepEqual(
		(await fs.readdir(path.join(dir, "assets"))).sort(),
		["index-39fc6623.js"],
		"--delete removes the maps and keeps the bundle",
	);
	assert.match(lines.at(-1), /Dropped older releases: 0\.9\.0/);
});

test("upload refuses incomplete settings and directories without maps, and reports API errors", async (t) => {
	const server = await api(t);
	const dir = await build(t);
	await assert.rejects(upload({ ...credentials, endpoint: server.endpoint, release: "", dir }), /Missing release/);
	await assert.rejects(upload({ ...credentials, apiKey: "", endpoint: server.endpoint, release: "1.0.0", dir }), /Missing apiKey/);
	const empty = await fs.mkdtemp(path.join(os.tmpdir(), "orbitrace-empty-"));
	t.after(() => fs.rm(empty, { recursive: true, force: true }));
	await assert.rejects(upload({ ...credentials, endpoint: server.endpoint, release: "1.0.0", dir: empty }), /No \.map files/);
	await assert.rejects(
		upload({ ...credentials, endpoint: `${server.endpoint}/nope`, release: "1.0.0", dir, log() {} }),
		/answered 404: not found/,
	);
	assert.ok((await fs.stat(path.join(dir, "assets", "index-39fc6623.js.map"))).isFile(), "maps stay when nothing was completed");
});

test("arguments accept --name value, --name=value and bare flags", () => {
	assert.deepEqual(parseArgs(["upload", "--release", "1.2.3", "--dir=dist", "--delete", "--org", "o"]), {
		_: ["upload"],
		release: "1.2.3",
		dir: "dist",
		delete: true,
		org: "o",
	});
	assert.deepEqual(parseArgs(["upload", "--delete", "www"]), { _: ["upload", "www"], delete: true }, "--delete never takes a value");
});
