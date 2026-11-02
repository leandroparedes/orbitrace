#!/usr/bin/env node
// Uploads a build's source maps to Orbitrace so browser stacks of that release resolve to original files.
//
//   orbitrace-sourcemaps upload --release 1.22.9 --dir dist [--delete]
//
// Reads ORBITRACE_API_KEY, ORBITRACE_ORG_ID, ORBITRACE_PROJECT_ID and ORBITRACE_ENDPOINT from the
// environment (--org, --project and --endpoint override the last three). The API key is the project's
// secret server key, never the public key. --delete removes the maps from the directory afterwards, so a
// hosting deploy of that directory cannot publish them.
const fs = require("node:fs/promises");
const path = require("node:path");

async function findMaps(dir) {
	const found = [];

	for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			found.push(...(await findMaps(full)));
		} else if (entry.isFile() && entry.name.endsWith(".map")) {
			found.push(full);
		}
	}

	return found;
}

const FLAGS = new Set(["delete"]);

function parseArgs(argv) {
	const options = { _: [] };

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.startsWith("--")) {
			const [name, inline] = arg.slice(2).split("=");
			const next = argv[i + 1];

			if (FLAGS.has(name)) {
				options[name] = true;
			} else if (inline !== undefined) {
				options[name] = inline;
			} else if (next !== undefined && !next.startsWith("--")) {
				options[name] = next;
				i++;
			} else {
				options[name] = true;
			}
		} else {
			options._.push(arg);
		}
	}

	return options;
}

async function request(url, { apiKey, orgId, projectId }, body) {
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-orbitrace-api-key": apiKey,
			"x-orbitrace-org-id": orgId,
			"x-orbitrace-project-id": projectId,
		},
		body: JSON.stringify(body),
	});
	const text = await response.text();
	let json;

	try {
		json = JSON.parse(text);
	} catch {
		json = { error: text };
	}

	if (!response.ok) {
		throw new Error(`${url} answered ${response.status}: ${json.error || json.message || text}`);
	}

	return json;
}

async function upload({ release, dir, apiKey, orgId, projectId, endpoint, remove = false, log = console.log }) {
	for (const [name, value] of Object.entries({ release, dir, apiKey, orgId, projectId, endpoint })) {
		if (!value) {
			throw new Error(`Missing ${name}`);
		}
	}

	// The configured endpoint is the events URL (".../log"); the source map routes live next to it.
	const base = String(endpoint).replace(/\/log\/?$/, "");
	const credentials = { apiKey, orgId, projectId };
	const paths = await findMaps(dir);

	if (paths.length === 0) {
		throw new Error(`No .map files found under ${dir}. Build with source maps enabled (Vite: build.sourcemap = "hidden").`);
	}

	const files = await Promise.all(
		paths.map(async (file) => ({ path: file, name: path.basename(file), size: (await fs.stat(file)).size })),
	);
	const names = new Set();

	for (const file of files) {
		if (names.has(file.name)) {
			throw new Error(`Two source maps are named ${file.name}; names must be unique within a release`);
		}

		names.add(file.name);
	}

	const declared = await request(`${base}/sourcemaps/releases`, credentials, {
		release,
		files: files.map(({ name, size }) => ({ name, size })),
	});
	const uploads = new Map(declared.uploads.map((item) => [item.name, item]));

	for (const file of files) {
		const target = uploads.get(file.name);

		if (!target) {
			throw new Error(`The API returned no upload URL for ${file.name}`);
		}

		// The signed URL only accepts the headers it was signed with.
		const response = await fetch(target.url, {
			method: "PUT",
			headers: target.headers,
			body: await fs.readFile(file.path),
		});

		if (!response.ok) {
			throw new Error(`Uploading ${file.name} failed with status ${response.status}`);
		}

		log(`Uploaded ${file.name} (${file.size} bytes)`);
	}

	const completed = await request(`${base}/sourcemaps/releases/complete`, credentials, {
		release,
		files: files.map(({ name }) => name),
	});

	if (remove) {
		await Promise.all(files.map((file) => fs.unlink(file.path)));
		log(`Removed ${files.length} source map${files.length === 1 ? "" : "s"} from ${dir}`);
	}

	log(`Release ${release}: ${completed.files} source maps, ${completed.bytes} bytes`);

	if (completed.deletedReleases?.length > 0) {
		log(`Dropped older releases: ${completed.deletedReleases.join(", ")}`);
	}

	return completed;
}

async function main(argv) {
	const options = parseArgs(argv);
	const command = options._[0];

	if (command !== "upload") {
		console.error("Usage: orbitrace-sourcemaps upload --release <version> --dir <directory> [--delete]");
		process.exitCode = 1;
		return;
	}

	try {
		await upload({
			release: options.release,
			dir: options.dir,
			apiKey: process.env.ORBITRACE_API_KEY,
			orgId: options.org || process.env.ORBITRACE_ORG_ID,
			projectId: options.project || process.env.ORBITRACE_PROJECT_ID,
			endpoint: options.endpoint || process.env.ORBITRACE_ENDPOINT,
			remove: options.delete === true,
		});
	} catch (error) {
		console.error(`orbitrace-sourcemaps: ${error.message}`);
		process.exitCode = 1;
	}
}

if (require.main === module) {
	main(process.argv.slice(2));
}

module.exports = { upload, parseArgs };
