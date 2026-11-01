# @orbitai/orbitrace

Error tracking and monitoring for backend Node.js applications.

Orbitrace is server-side only. Do not initialize this package in browser or frontend code, because the Orbitrace API key is a backend secret and must not be exposed in public bundles.

## Installation

```bash
npm install @orbitai/orbitrace
```

## Backend Setup

### 1. Initialize Orbitrace

```javascript
// orbitrace.js
const Orbitrace = require("@orbitai/orbitrace");

function getOrbitraceInstance({ service }) {
	Orbitrace.getInstance({
		apiKey: process.env.ORBITRACE_API_KEY,
		orgId: process.env.ORBITRACE_ORG_ID,
		projectId: process.env.ORBITRACE_PROJECT_ID,
		endpoint: process.env.ORBITRACE_ENDPOINT,
		environment: process.env.APP_ENV,
		service,
		version: process.env.APP_VERSION,
		disabled: process.env.ORBITRACE_DISABLED === "true",
	});

	return Orbitrace;
}

module.exports = {
	getOrbitraceInstance,
};
```

### 2. Capture Exceptions

```javascript
const { getOrbitraceInstance } = require("./orbitrace");
const orbitrace = getOrbitraceInstance({ service: "api" });

try {
	// Your code here
} catch (error) {
	orbitrace.captureException(error, {
		endpoint: "/users",
		action: "createUser",
	});
}
```

### 3. Capture Messages

```javascript
orbitrace.captureMessage("User registered", {
	userId: "123",
});
```

### 4. Delivery Behavior

Orbitrace never throws and never blocks your application:

- `captureException` and `captureMessage` return as soon as the event is queued. The request is sent in the background, so a request handler that captures an error does not wait for Orbitrace before answering its own client. Awaiting them is harmless but waits for nothing; use `flush()` when you need to know the events were delivered.
- Each request times out after 5 seconds. Failures are logged to the console and swallowed.
- Repeats of the same event (same message and stack) within 10 seconds are counted locally and sent as one request with an occurrence count, so an error raised in a loop costs at most two requests per 10 seconds.
- At most 10 requests are in flight at once; events beyond that are dropped.
- When the API answers `429`, events are dropped until its `Retry-After` period ends.

In short-lived processes (scripts, CI jobs, serverless functions), call `flush()` before exiting so locally counted repeats are sent:

```javascript
await orbitrace.flush();
```

### 5. Automatic Capture

Pass `autoCapture: true` to `getInstance` (SDK 1.2.1 or newer) to capture what nobody handled and record breadcrumbs automatically. It is off unless you turn it on, so upgrading never changes how an application crashes or logs.

```javascript
orbitrace.getInstance({ ...config, autoCapture: true });
// or choose parts:
orbitrace.getInstance({ ...config, autoCapture: { exceptions: true, console: true, fetch: false } });
```

- **Uncaught exceptions and unhandled rejections** are captured. The process still crashes as Node would: the SDK waits up to 2 seconds for the event to send, prints the error and exits with code 1, and respects `--unhandled-rejections`. If the application registers its own `uncaughtException` or `unhandledRejection` handlers, they decide instead.
- **Breadcrumbs** are recorded from `console` calls and `fetch` requests (URLs without credentials, query string or fragment). The SDK's own logs and requests are skipped.
- `orbitrace.close()` removes everything automatic capture installed.

### 6. Breadcrumbs

Breadcrumbs are the last 30 things that happened before an event, sent with it. Add your own at important steps:

```javascript
orbitrace.addBreadcrumb({
	category: "checkout",
	message: "Payment authorized",
	level: "info", // debug, info, warning or error
	data: { orderId: "ord_1" },
});
```

Breadcrumb data is filtered like metadata. Work that runs concurrently should have its own breadcrumbs: use the Express handlers or `wrap()` below, or `orbitrace.withScope(() => work())`.

### 7. Express

```javascript
app.use(orbitrace.expressRequestHandler()); // before the routes: breadcrumbs per request
app.post("/checkout", async (req, res, next) => {
	try {
		res.json(await checkout(req.body));
	} catch (error) {
		next(error); // Express 4 does not pass errors from async routes on by itself
	}
});
app.use(orbitrace.expressErrorHandler()); // after the routes: captures with method, path and status, then calls next(error)
```

### 8. Cloud Functions and Other Serverless Handlers

The runtime may freeze as soon as a handler returns. `wrap()` gives each call its own breadcrumbs, captures a thrown error (and rethrows it), and sends pending events before returning:

```javascript
exports.checkout = onRequest(orbitrace.wrap(async (req, res) => {
	res.json(await checkout(req.body));
}));
```

## Data Collected

Each event stores:

- The error message (truncated to 200 characters) and stack trace, or the message text.
- The `metadata` object you pass, plus `env`, `version` and `service` from your configuration.
- Breadcrumbs, when there are any: the last 30 recorded before the event.
- The IP address and user agent of the server that sent the request, with an approximate location derived from that IP.

Before sending, metadata values whose key contains `password`, `passwd`, `secret`, `token`, `authorization`, `cookie`, `apikey`, `privatekey`, `credential` or `session` (ignoring case, `-` and `_`) are replaced with `[Filtered]`, at any depth. Error messages and stack traces are sent as they are.

Filtering is a safety net, not a guarantee. Do not put personal data (emails, names, addresses) or secrets in metadata or error messages; send stable identifiers such as a user id instead.

## Environment Variables

```env
ORBITRACE_API_KEY=your-backend-api-key
ORBITRACE_ORG_ID=your-org-id
ORBITRACE_PROJECT_ID=your-project-id
ORBITRACE_ENDPOINT=your-endpoint
APP_ENV=production
APP_VERSION=1.0.0
ORBITRACE_DISABLED=false
```

## Security Model

Orbitrace authenticates ingestion requests with `ORBITRACE_API_KEY`. Keep this key only in backend environments such as servers, workers, functions, and CI jobs. Do not use `VITE_`, `NEXT_PUBLIC_`, or other public frontend environment variables for Orbitrace credentials.

If this package is initialized in a browser runtime, it throws an error before sending events.
