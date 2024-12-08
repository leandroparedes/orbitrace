# @orbitai/orbitrace

Error tracking and monitoring for Node.js and browser applications.

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
	console.log("Initializing Orbitrace for service:", service);

	Orbitrace.getInstance({
		apiKey: process.env.ORBITRACE_API_KEY,
		orgId: process.env.ORBITRACE_ORG_ID,
		projectId: process.env.ORBITRACE_PROJECT_ID,
		endpoint: process.env.ORBITRACE_ENDPOINT,
		environment: process.env.APP_ENV,
		service,
		version: process.env.APP_VERSION,
	});

	return Orbitrace;
}

module.exports = {
	getOrbitraceInstance,
};
```

### 2. Usage

```javascript
const { getOrbitraceInstance } = require("/path/to/orbitrace");
const orbitrace = getOrbitraceInstance({ service: "api" });

// Capture exceptions
try {
	// Your code here
} catch (error) {
	await orbitrace.captureException(error, {
		endpoint: "/users",
	});
}

// Capture messages
await orbitrace.captureMessage("User registered", {
	userId: "123",
	email: "user@example.com",
});
```

## Frontend Setup (Vue 3 + Pinia)

### 1. Initialize Orbitrace

```javascript
// orbitrace.js
import { provide, inject } from "vue";
import Orbitrace from "@orbitai/orbitrace";

export const ORBITRACE_KEY = Symbol("orbitrace");

export function getOrbitraceInstance({ service }) {
	Orbitrace.getInstance({
		apiKey: import.meta.env.VITE_ORBITRACE_API_KEY,
		orgId: import.meta.env.VITE_ORBITRACE_ORG_ID,
		projectId: import.meta.env.VITE_ORBITRACE_PROJECT_ID,
		endpoint: import.meta.env.VITE_ORBITRACE_ENDPOINT,
		environment: import.meta.env.VITE_APP_ENV,
		service,
		version: import.meta.env.VITE_APP_VERSION,
	});

	return Orbitrace;
}

export function useOrbitrace() {
	const orbitrace = inject(ORBITRACE_KEY);
	if (!orbitrace) {
		throw new Error("Orbitrace not properly initialized");
	}
	return orbitrace;
}
```

### 2. Setup in Main App

```javascript
// main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { getOrbitraceInstance, ORBITRACE_KEY } from "/path/to/orbitrace";

const app = createApp(App);
const pinia = createPinia();

// Initialize Orbitrace
const orbitrace = getOrbitraceInstance({ service: "webapp" });

// Make Orbitrace available everywhere
app.provide(ORBITRACE_KEY, orbitrace);

// Add Orbitrace to Pinia
pinia.use(({ store }) => {
	store.orbitrace = orbitrace;
});

app.use(pinia);
app.mount("#app");
```

### 3. Usage in Vue Components

```vue
<script setup>
import { useOrbitrace } from "/path/to/orbitrace";

const orbitrace = useOrbitrace();

async function handleUserAction() {
	try {
		// Your code here
	} catch (error) {
		await orbitrace.captureException(error, {
			component: "UserProfile",
			action: "updateProfile",
		});
	}
}

// Log custom events
async function trackEvent() {
	await orbitrace.captureMessage("User completed onboarding", {
		userId: "user123",
		completedSteps: ["profile", "preferences"],
	});
}
</script>
```

### 4. Usage in Pinia Stores

```javascript
// stores/userStore.js
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
	state: () => ({
		user: null,
	}),
	actions: {
		async fetchUser() {
			try {
				// Fetch user logic
			} catch (error) {
				await this.orbitrace.captureException(error, {
					store: "userStore",
					action: "fetchUser",
				});
				throw error;
			}
		},
	},
});
```

### Environment Variables

For Vite:

```env
VITE_ORBITRACE_API_KEY=your-api-key
VITE_ORBITRACE_ORG_ID=your-org-id
VITE_ORBITRACE_PROJECT_ID=your-project-id
VITE_ORBITRACE_ENDPOINT=your-endpoint
VITE_APP_ENV=your-environment
VITE_APP_VERSION=your-version
```

For Node.js:

```env
ORBITRACE_API_KEY=your-api-key
ORBITRACE_ORG_ID=your-org-id
ORBITRACE_PROJECT_ID=your-project-id
ORBITRACE_ENDPOINT=your-endpoint
APP_ENV=your-environment
APP_VERSION=your-version
```
