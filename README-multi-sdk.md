# Orbitrace Multi-language SDK

This project provides Protocol Buffer-based SDK implementations for Orbitrace in multiple languages.

## Available Language SDKs

- JavaScript/TypeScript: `/generated/orbitrace.js` and `/generated/orbitrace.d.ts`
- Python: `/generated/python/`
- Java: `/generated/java/`

## Requirements for code generation

- Protocol Buffers compiler (protoc) - Install from https://github.com/protocolbuffers/protobuf/releases
- For JavaScript: Node.js (already installed)
- For Python: Python 3.6+ with pip
- For Java: JDK 11+ and Maven

## Generating the SDKs

Run the following command to generate SDKs for all supported languages:

```
node generate-sdks.js
```

## Using the SDKs

### JavaScript

```javascript
const Orbitrace = require('./generated/orbitrace').orbitrace.Orbitrace;

// Configure Orbitrace
Orbitrace.getInstance({
  apiKey: 'your-api-key',
  orgId: 'your-org-id',
  projectId: 'your-project-id',
  endpoint: 'https://api.orbitrace.ai/events',
  environment: 'production',
  version: '1.0.0',
  service: 'my-service'
});

// Capture an exception
try {
  // Some code that might throw
} catch (error) {
  Orbitrace.captureException(error, { userId: '123' });
}

// Capture a message
Orbitrace.captureMessage('Hello from JavaScript!', { userId: '123' });
```

### Python

```python
from generated.python.client import Orbitrace

# Configure Orbitrace
Orbitrace.get_instance({
  "api_key": "your-api-key",
  "org_id": "your-org-id",
  "project_id": "your-project-id",
  "endpoint": "https://api.orbitrace.ai/events",
  "environment": "production",
  "version": "1.0.0",
  "service": "my-service"
})

# Capture an exception
try:
  # Some code that might throw
  1/0
except Exception as error:
  Orbitrace.capture_exception(error, {"user_id": "123"})

# Capture a message
Orbitrace.capture_message("Hello from Python!", {"user_id": "123"})
```

### Java

```java
import ai.orbitrace.Orbitrace;
import java.util.HashMap;
import java.util.Map;

public class Example {
  public static void main(String[] args) {
    // Configure Orbitrace
    Map<String, Object> config = new HashMap<>();
    config.put("apiKey", "your-api-key");
    config.put("orgId", "your-org-id");
    config.put("projectId", "your-project-id");
    config.put("endpoint", "https://api.orbitrace.ai/events");
    config.put("environment", "production");
    config.put("version", "1.0.0");
    config.put("service", "my-service");

    Orbitrace.getInstance(config);

    // Capture an exception
    try {
      // Some code that might throw
      throw new RuntimeException("Test exception");
    } catch (Exception error) {
      Map<String, String> metadata = new HashMap<>();
      metadata.put("userId", "123");
      Orbitrace.captureException(error, metadata);
    }

    // Capture a message
    Map<String, String> metadata = new HashMap<>();
    metadata.put("userId", "123");
    Orbitrace.captureMessage("Hello from Java!", metadata);
  }
}
```
