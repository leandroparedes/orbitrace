class Orbitrace {
	static #config = null;

	static getInstance(config) {
		// validate already initialized
		// should allow init with different config.service

		if (this.#config && this.#config.service === config.service) {
			console.log(
				"Orbitrace: Already initialized with the same service name. Skipping init"
			);
			return;
		}

		this.validateConfig(config);

		this.#config = {
			apiKey: config.apiKey,
			orgId: config.orgId,
			projectId: config.projectId,
			endpoint: config.endpoint,
			environment: config.environment || "production",
			version: config.version || "1.0.0",
			service: config.service || "not-specified",
			disabled: config.disabled || false,
		};
	}

	static validateConfig(config) {
		const requiredFields = ["apiKey", "orgId", "projectId", "endpoint"];
		const missingFields = requiredFields.filter((field) => !config[field]);

		if (missingFields.length > 0) {
			throw new Error(
				`Missing required configuration fields: ${missingFields.join(", ")}`
			);
		}
	}

	static checkInitialized() {
		if (!this.#config) {
			throw new Error(
				"Orbitrace must be initialized with Orbitrace.getInstance() before use"
			);
		}
	}

	static async captureException(error, metadata = {}) {
		this.checkInitialized();

		if (this.#config.disabled) {
			console.log("Orbitrace: Logging is disabled");
			return;
		}

		try {
			const payload = {
				message: error.message,
				stack: error.stack,
				metadata: {
					...metadata,
					env: this.#config.environment,
					version: this.#config.version,
					service: this.#config.service,
				},
			};

			return this.sendToApi("capture_exception", payload);
		} catch (err) {
			console.error("Orbitrace: Error capturing exception", err);
		}
	}

	static async captureMessage(message, metadata = {}) {
		this.checkInitialized();

		if (this.#config.disabled) {
			console.log("Orbitrace: Logging is disabled");
			return;
		}

		try {
			const payload = {
				message,
				metadata: {
					...metadata,
					env: this.#config.environment,
					version: this.#config.version,
					service: this.#config.service,
				},
			};

			return this.sendToApi("capture_message", payload);
		} catch (err) {
			console.error("Orbitrace: Error capturing message", err);
		}
	}

	static async sendToApi(event, payload) {
		try {
			const response = await fetch(this.#config.endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-orbitrace-api-key": this.#config.apiKey,
					"x-orbitrace-org-id": this.#config.orgId,
					"x-orbitrace-project-id": this.#config.projectId,
				},
				body: JSON.stringify({
					event,
					payload,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("Orbitrace: Error sending data to API", error);

			return {
				success: false,
				error: error.message,
			};
		}
	}
}

module.exports = Orbitrace;
