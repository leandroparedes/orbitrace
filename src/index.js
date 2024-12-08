class Orbitrace {
	#config;

	constructor(config) {
		this.validateConfig(config);

		this.#config = {
			apiKey: config.apiKey,
			orgId: config.orgId,
			projectId: config.projectId,
			endpoint: config.endpoint,
			environment: config.environment ?? "production",
			version: config.version ?? "1.0.0",
			service: config.service ?? "not-specified",
			disabled: config.disabled ?? false,
		};
	}

	static create(config) {
		return new Orbitrace(config);
	}

	validateConfig(config) {
		const requiredFields = ["apiKey", "orgId", "projectId", "endpoint"];
		const missingFields = requiredFields.filter((field) => !config[field]);

		if (missingFields.length > 0) {
			throw new Error(
				`Missing required configuration fields: ${missingFields.join(", ")}`
			);
		}
	}

	async captureException(error, metadata = {}) {
		if (this.#config.disabled) {
			console.log("Orbitrace: Logging is disabled");
			return;
		}

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

		return this.#sendToApi("capture_exception", payload);
	}

	async captureMessage(message, metadata = {}) {
		if (this.#config.disabled) {
			console.log("Orbitrace: Logging is disabled");
			return;
		}

		const payload = {
			message,
			metadata: {
				...metadata,
				env: this.#config.environment,
				version: this.#config.version,
				service: this.#config.service,
			},
		};

		return this.#sendToApi("capture_message", payload);
	}

	async #sendToApi(event, payload) {
		try {
			const response = await fetch(this.#config.endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-orbitrace-api-key": this.#config.apiKey,
					"x-orbitrace-org-id": this.#config.orgId,
					"x-orbitrace-project-id": this.#config.projectId,
				},
				body: JSON.stringify({ event, payload }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return response.json();
		} catch (error) {
			console.error("Orbitrace: Error sending data to API", error);
			throw error;
		}
	}
}

module.exports = Orbitrace;
