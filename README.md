# @orbitai/orbitrace

Error tracking and monitoring for Node.js and browser applications.

## Installation

```bash
npm install @orbitai/orbitrace
```

## Usage

```javascript
// Somewhere in your code

// orbitrace.js
const Orbitrace = require("@orbitai/orbitrace");

function initOrbitrace({ service }) {
	console.log("Initializing Orbitrace for service:", service);

	Orbitrace.init({
		apiKey: process.env.ORBITRACE_API_KEY,
		orgId: process.env.ORBITRACE_ORG_ID,
		projectId: process.env.ORBITRACE_PROJECT_ID,
		endpoint: process.env.ORBITRACE_ENDPOINT,
		environment: process.env.API_ENV,
		service,
		version: process.env.API_VERSION,
	});

	return Orbitrace;
}

module.exports = {
	initOrbitrace,
};
```

```javascript
// Usage in your code

const { initOrbitrace } = ("../path/to/orbitrace.js");

const Orbitrace = initOrbitrace( { service: 'your-service' });

// Capture an exception
try {
    throw new Error('This is an error');
} catch (error) {
    Orbitrace.captureException(error);
}

// Capture a message
Orbitrace.captureMessage('This is a message');
```
