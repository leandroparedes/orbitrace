#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define supported languages and their generation commands
const languages = {
  javascript: {
    name: 'JavaScript',
    generate: () => {
      // We already have a separate script for JavaScript
      execSync('node proto/generate-js.js', { stdio: 'inherit' });
    }
  },
  python: {
    name: 'Python',
    generate: () => {
      const outputDir = path.join(__dirname, 'generated', 'python');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Using protoc for Python - requires protoc to be installed
      try {
        execSync(`protoc --proto_path=${path.join(__dirname, 'proto')} --python_out=${outputDir} ${path.join(__dirname, 'proto', 'orbitrace.proto')}`,
          { stdio: 'inherit' });
        console.log('Successfully generated Python code');

        // Create Python package structure
        createPythonPackage(outputDir);
      } catch (error) {
        console.error('Error generating Python code. Make sure protoc is installed:', error.message);
      }
    }
  },
  java: {
    name: 'Java',
    generate: () => {
      const outputDir = path.join(__dirname, 'generated', 'java');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Using protoc for Java - requires protoc to be installed
      try {
        execSync(`protoc --proto_path=${path.join(__dirname, 'proto')} --java_out=${outputDir} ${path.join(__dirname, 'proto', 'orbitrace.proto')}`,
          { stdio: 'inherit' });
        console.log('Successfully generated Java code');

        // Create Java package structure
        createJavaPackage(outputDir);
      } catch (error) {
        console.error('Error generating Java code. Make sure protoc is installed:', error.message);
      }
    }
  }
};

// Create Python package structure with implementation
function createPythonPackage(outputDir) {
  // Create __init__.py to make it a proper package
  fs.writeFileSync(path.join(outputDir, '__init__.py'), '');

  // Create a client implementation that uses the generated protobuf code
  const clientCode = `import requests
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
`;

  fs.writeFileSync(path.join(outputDir, 'client.py'), clientCode);

  // Create setup.py for package installation
  const setupCode = `from setuptools import setup, find_packages

setup(
    name="orbitrace",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "requests",
        "protobuf",
    ],
    description="Orbitrace client for Python",
    author="Orbitrace Team",
    author_email="info@orbitrace.ai",
    url="https://orbitrace.ai",
)`;

  fs.writeFileSync(path.join(outputDir, '..', 'setup.py'), setupCode);
}

// Create Java package structure with implementation
function createJavaPackage(outputDir) {
  // Create a client implementation that uses the generated protobuf code
  const clientCode = `package ai.orbitrace;

import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import ai.orbitrace.OrbitraceProto.OrbitraceConfig;
import ai.orbitrace.OrbitraceProto.ExceptionPayload;
import ai.orbitrace.OrbitraceProto.MessagePayload;
import ai.orbitrace.OrbitraceProto.Metadata;

public class Orbitrace {
    private static OrbitraceConfig config = null;
    private static final HttpClient httpClient = HttpClient.newHttpClient();

    public static void getInstance(Map<String, Object> configMap) {
        validateConfig(configMap);

        OrbitraceConfig.Builder configBuilder = OrbitraceConfig.newBuilder();
        configBuilder.setApiKey((String) configMap.get("apiKey"));
        configBuilder.setOrgId((String) configMap.get("orgId"));
        configBuilder.setProjectId((String) configMap.get("projectId"));
        configBuilder.setEndpoint((String) configMap.get("endpoint"));

        configBuilder.setEnvironment(
            configMap.containsKey("environment") ? (String) configMap.get("environment") : "production"
        );
        configBuilder.setVersion(
            configMap.containsKey("version") ? (String) configMap.get("version") : "1.0.0"
        );
        configBuilder.setService(
            configMap.containsKey("service") ? (String) configMap.get("service") : "not-specified"
        );
        configBuilder.setDisabled(
            configMap.containsKey("disabled") ? (Boolean) configMap.get("disabled") : false
        );

        config = configBuilder.build();
    }

    private static void validateConfig(Map<String, Object> config) {
        List<String> requiredFields = Arrays.asList("apiKey", "orgId", "projectId", "endpoint");
        List<String> missingFields = requiredFields.stream()
            .filter(field -> !config.containsKey(field))
            .collect(Collectors.toList());

        if (!missingFields.isEmpty()) {
            throw new IllegalArgumentException(
                "Missing required configuration fields: " + String.join(", ", missingFields)
            );
        }
    }

    private static void checkInitialized() {
        if (config == null) {
            throw new IllegalStateException(
                "Orbitrace must be initialized with Orbitrace.getInstance() before use"
            );
        }
    }

    public static Map<String, Object> captureException(Throwable error, Map<String, String> metadata) {
        checkInitialized();

        if (config.getDisabled()) {
            System.out.println("Orbitrace: Logging is disabled");
            return new HashMap<>();
        }

        try {
            Map<String, String> metaFields = metadata != null ? metadata : new HashMap<>();

            Metadata metadataProto = Metadata.newBuilder()
                .putAllFields(metaFields)
                .setEnv(config.getEnvironment())
                .setVersion(config.getVersion())
                .setService(config.getService())
                .build();

            ExceptionPayload payload = ExceptionPayload.newBuilder()
                .setMessage(error.getMessage())
                .setStack(getStackTraceAsString(error))
                .setMetadata(metadataProto)
                .build();

            return sendToApi("capture_exception", payload);
        } catch (Exception err) {
            System.err.println("Orbitrace: Error capturing exception " + err.getMessage());
            return new HashMap<>();
        }
    }

    public static Map<String, Object> captureException(Throwable error) {
        return captureException(error, null);
    }

    public static Map<String, Object> captureMessage(String message, Map<String, String> metadata) {
        checkInitialized();

        if (config.getDisabled()) {
            System.out.println("Orbitrace: Logging is disabled");
            return new HashMap<>();
        }

        try {
            Map<String, String> metaFields = metadata != null ? metadata : new HashMap<>();

            Metadata metadataProto = Metadata.newBuilder()
                .putAllFields(metaFields)
                .setEnv(config.getEnvironment())
                .setVersion(config.getVersion())
                .setService(config.getService())
                .build();

            MessagePayload payload = MessagePayload.newBuilder()
                .setMessage(message)
                .setMetadata(metadataProto)
                .build();

            return sendToApi("capture_message", payload);
        } catch (Exception err) {
            System.err.println("Orbitrace: Error capturing message " + err.getMessage());
            return new HashMap<>();
        }
    }

    public static Map<String, Object> captureMessage(String message) {
        return captureMessage(message, null);
    }

    private static Map<String, Object> sendToApi(String event, Object payload) throws IOException, InterruptedException {
        String jsonPayload = buildJsonPayload(event, payload);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(config.getEndpoint()))
            .header("Content-Type", "application/json")
            .header("x-orbitrace-api-key", config.getApiKey())
            .header("x-orbitrace-org-id", config.getOrgId())
            .header("x-orbitrace-project-id", config.getProjectId())
            .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IOException("HTTP error! status: " + response.statusCode());
        }

        // Parse JSON response to Map (simplified - in real implementation you'd use Jackson or Gson)
        return new HashMap<>(); // Simplified - should parse response JSON
    }

    private static String buildJsonPayload(String event, Object payload) {
        // Simplified - in real implementation you'd use Jackson or Gson
        // This is a very basic implementation for demonstration
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\\\"event\\\":\\\"").append(event).append("\\\",");
        json.append("\\\"payload\\\":{");

        if (payload instanceof ExceptionPayload) {
            ExceptionPayload p = (ExceptionPayload) payload;
            json.append("\\\"message\\\":\\\"").append(p.getMessage()).append("\\\",");
            json.append("\\\"stack\\\":\\\"").append(p.getStack().replace("\\n", "\\\\n")).append("\\\",");
            appendMetadata(json, p.getMetadata());
        } else if (payload instanceof MessagePayload) {
            MessagePayload p = (MessagePayload) payload;
            json.append("\\\"message\\\":\\\"").append(p.getMessage()).append("\\\",");
            appendMetadata(json, p.getMetadata());
        }

        json.append("}");
        json.append("}");
        return json.toString();
    }

    private static void appendMetadata(StringBuilder json, Metadata metadata) {
        json.append("\\\"metadata\\\":{");

        // Add fields from metadata
        boolean first = true;
        for (Map.Entry<String, String> entry : metadata.getFieldsMap().entrySet()) {
            if (!first) json.append(",");
            json.append("\\\"").append(entry.getKey()).append("\\\":\\\"").append(entry.getValue()).append("\\\"");
            first = false;
        }

        if (!first) json.append(",");
        json.append("\\\"env\\\":\\\"").append(metadata.getEnv()).append("\\\",");
        json.append("\\\"version\\\":\\\"").append(metadata.getVersion()).append("\\\",");
        json.append("\\\"service\\\":\\\"").append(metadata.getService()).append("\\\"");

        json.append("}");
    }

    private static String getStackTraceAsString(Throwable throwable) {
        StringBuilder sb = new StringBuilder();
        for (StackTraceElement element : throwable.getStackTrace()) {
            sb.append(element.toString());
            sb.append("\\n");
        }
        return sb.toString();
    }
}`;

  // Create directories for Java package structure
  const packageDir = path.join(outputDir, 'src', 'main', 'java', 'ai', 'orbitrace');
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, { recursive: true });
  }

  fs.writeFileSync(path.join(packageDir, 'Orbitrace.java'), clientCode);

  // Create pom.xml for Maven projects
  const pomXml = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>ai.orbitrace</groupId>
    <artifactId>orbitrace-java</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.google.protobuf</groupId>
            <artifactId>protobuf-java</artifactId>
            <version>3.19.4</version>
        </dependency>
    </dependencies>
</project>`;

  fs.writeFileSync(path.join(outputDir, 'pom.xml'), pomXml);
}

// Main function to generate code for all specified languages
function generateMultiLanguageSdks() {
  console.log('Generating SDKs for multiple languages...');

  // Generate for each language
  Object.keys(languages).forEach(lang => {
    console.log(`Generating ${languages[lang].name} SDK...`);
    languages[lang].generate();
  });

  console.log('SDK generation complete!');
}

// Create README with instructions
function createReadme() {
  const readme = `# Orbitrace Multi-language SDK

This project provides Protocol Buffer-based SDK implementations for Orbitrace in multiple languages.

## Available Language SDKs

- JavaScript/TypeScript: \`/generated/orbitrace.js\` and \`/generated/orbitrace.d.ts\`
- Python: \`/generated/python/\`
- Java: \`/generated/java/\`

## Requirements for code generation

- Protocol Buffers compiler (protoc) - Install from https://github.com/protocolbuffers/protobuf/releases
- For JavaScript: Node.js (already installed)
- For Python: Python 3.6+ with pip
- For Java: JDK 11+ and Maven

## Generating the SDKs

Run the following command to generate SDKs for all supported languages:

\`\`\`
node generate-sdks.js
\`\`\`

## Using the SDKs

### JavaScript

\`\`\`javascript
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
\`\`\`

### Python

\`\`\`python
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
\`\`\`

### Java

\`\`\`java
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
\`\`\`
`;

  fs.writeFileSync(path.join(__dirname, 'README-multi-sdk.md'), readme);
  console.log('Created README-multi-sdk.md with usage instructions');
}

// Run the generation process
generateMultiLanguageSdks();
createReadme();