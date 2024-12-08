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
		apiKey: "<YOUR API KEY>",
		orgId: "<ORBITAI ORG ID>",
		projectId: "<ORBITAI PROJECT ID>",
		endpoint: "<ORBITRACE ENDPOINT>"
		environment: "YOUR ENVIRONMENT",
		service: "<YOUR SERVICE",
		version: "<YOUR SERVICE VERSION>",
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
