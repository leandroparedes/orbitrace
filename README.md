# @orbitai/orbitrace

Error tracking and monitoring for Node.js and browser applications.

## Installation

```bash
npm install @orbitai/orbitrace
```

## Backend Setup

```javascript
// orbitrace.js
const Orbitrace = require("@orbitai/orbitrace");

function initOrbitrace({ service }) {
    console.log("Initializing Orbitrace for service:", service);

    Orbitrace.init({
        apiKey: process.env.ORBITRACE_API_KEY,
        orgId: process.env.ORBITRACE_ORG_ID,
        projectId: process.env.ORBITRACE_PROJECT_ID,
        endpoint: process.env.ORBITRACE_ENDPOINT,
        environment: process.env.NODE_ENV,
        service,
        version: process.env.APP_VERSION,
    });

    return Orbitrace;
}

module.exports = {
    initOrbitrace,
};

// Usage
const { initOrbitrace } = require("./orbitrace");
const Orbitrace = initOrbitrace({ service: "api" });

// Capture exceptions
try {
    throw new Error("Something went wrong");
} catch (error) {
    Orbitrace.captureException(error, {
        service: "api",
        endpoint: "/users",
    });
}

// Capture messages
Orbitrace.captureMessage("User registered", {
    userId: "123",
    email: "user@example.com"
});
```

## Frontend Setup (Vue 3 + Pinia)

### 1. Initialize Orbitrace

```javascript
// orbitrace.js
import { provide, inject } from "vue";
import Orbitrace from "@orbitai/orbitrace";

export const ORBITRACE_KEY = Symbol("orbitrace");

export function createOrbitrace({ service }) {
    Orbitrace.init({
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
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { createOrbitrace, ORBITRACE_KEY } from './orbitrace';

const app = createApp(App);
const pinia = createPinia();

// Initialize Orbitrace
const orbitrace = createOrbitrace({ service: 'webapp' });

// Make Orbitrace available everywhere
app.provide(ORBITRACE_KEY, orbitrace);

// Add Orbitrace to Pinia
pinia.use(({ store }) => {
    store.orbitrace = orbitrace;
});

app.use(pinia);
app.mount('#app');
```

### 3. Usage in Vue Components

```vue
<script setup>
import { useOrbitrace } from '@/orbitrace';

const orbitrace = useOrbitrace();

function handleUserAction() {
    try {
        // Your code here
    } catch (error) {
        orbitrace.captureException(error, {
            component: 'UserProfile',
            action: 'updateProfile'
        });
    }
}

// Log custom events
function trackEvent() {
    orbitrace.captureMessage('User completed onboarding', {
        userId: 'user123',
        completedSteps: ['profile', 'preferences']
    });
}
</script>
```

### 4. Usage in Pinia Stores

```javascript
// stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null
    }),
    actions: {
        async fetchUser() {
            try {
                // Fetch user logic
            } catch (error) {
                this.orbitrace.captureException(error, {
                    store: 'userStore',
                    action: 'fetchUser'
                });
                throw error;
            }
        }
    }
});
```

### Environment Variables

For Vite:
```env
VITE_ORBITRACE_API_KEY=your-api-key
VITE_ORBITRACE_ORG_ID=your-org-id
VITE_ORBITRACE_PROJECT_ID=your-project-id
VITE_ORBITRACE_ENDPOINT=your-endpoint
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

For Node.js:
```env
ORBITRACE_API_KEY=your-api-key
ORBITRACE_ORG_ID=your-org-id
ORBITRACE_PROJECT_ID=your-project-id
ORBITRACE_ENDPOINT=your-endpoint
NODE_ENV=production
APP_VERSION=1.0.0
```