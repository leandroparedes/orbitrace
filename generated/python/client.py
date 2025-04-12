import requests
from typing import Dict, Any, Optional
from .orbitrace_pb2 import OrbitraceConfig, ExceptionPayload, MessagePayload, Metadata

class Orbitrace:
    _config = None

    @classmethod
    def get_instance(cls, config: Dict[str, Any]) -> None:
        """Initialize the Orbitrace client with configuration"""
        cls._validate_config(config)

        cls._config = OrbitraceConfig(
            api_key=config["api_key"],
            org_id=config["org_id"],
            project_id=config["project_id"],
            endpoint=config["endpoint"],
            environment=config.get("environment", "production"),
            version=config.get("version", "1.0.0"),
            service=config.get("service", "not-specified"),
            disabled=config.get("disabled", False)
        )

    @classmethod
    def _validate_config(cls, config: Dict[str, Any]) -> None:
        """Validate that required configuration fields are present"""
        required_fields = ["api_key", "org_id", "project_id", "endpoint"]
        missing_fields = [field for field in required_fields if field not in config]

        if missing_fields:
            raise ValueError(f"Missing required configuration fields: {', '.join(missing_fields)}")

    @classmethod
    def _check_initialized(cls) -> None:
        """Check if the client has been initialized"""
        if cls._config is None:
            raise RuntimeError("Orbitrace must be initialized with Orbitrace.get_instance() before use")

    @classmethod
    def capture_exception(cls, error: Exception, metadata: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Capture and send an exception to Orbitrace"""
        cls._check_initialized()

        if cls._config.disabled:
            print("Orbitrace: Logging is disabled")
            return {}

        try:
            meta = Metadata(
                fields={} if metadata is None else metadata,
                env=cls._config.environment,
                version=cls._config.version,
                service=cls._config.service
            )

            payload = ExceptionPayload(
                message=str(error),
                stack=getattr(error, "__traceback__", None) and str(error.__traceback__),
                metadata=meta
            )

            return cls._send_to_api("capture_exception", payload)
        except Exception as err:
            print(f"Orbitrace: Error capturing exception {err}")
            return {}

    @classmethod
    def capture_message(cls, message: str, metadata: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Capture and send a message to Orbitrace"""
        cls._check_initialized()

        if cls._config.disabled:
            print("Orbitrace: Logging is disabled")
            return {}

        try:
            meta = Metadata(
                fields={} if metadata is None else metadata,
                env=cls._config.environment,
                version=cls._config.version,
                service=cls._config.service
            )

            payload = MessagePayload(
                message=message,
                metadata=meta
            )

            return cls._send_to_api("capture_message", payload)
        except Exception as err:
            print(f"Orbitrace: Error capturing message {err}")
            return {}

    @classmethod
    def _send_to_api(cls, event: str, payload) -> Dict[str, Any]:
        """Send data to the Orbitrace API"""
        try:
            response = requests.post(
                cls._config.endpoint,
                headers={
                    "Content-Type": "application/json",
                    "x-orbitrace-api-key": cls._config.api_key,
                    "x-orbitrace-org-id": cls._config.org_id,
                    "x-orbitrace-project-id": cls._config.project_id,
                },
                json={
                    "event": event,
                    "payload": {
                        "message": payload.message,
                        "stack": getattr(payload, "stack", None),
                        "metadata": {
                            **getattr(payload.metadata, "fields", {}),
                            "env": payload.metadata.env,
                            "version": payload.metadata.version,
                            "service": payload.metadata.service,
                        }
                    }
                }
            )

            response.raise_for_status()
            return response.json()
        except Exception as error:
            print(f"Orbitrace: Error sending data to API {error}")
            raise
