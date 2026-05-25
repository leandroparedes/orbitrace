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
	await orbitrace.captureException(error, {
		endpoint: "/users",
		action: "createUser",
	});
}
```

### 3. Capture Messages

```javascript
await orbitrace.captureMessage("User registered", {
	userId: "123",
	email: "user@example.com",
});
```

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
