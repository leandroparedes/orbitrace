package ai.orbitrace;

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
        json.append("\"event\":\"").append(event).append("\",");
        json.append("\"payload\":{");

        if (payload instanceof ExceptionPayload) {
            ExceptionPayload p = (ExceptionPayload) payload;
            json.append("\"message\":\"").append(p.getMessage()).append("\",");
            json.append("\"stack\":\"").append(p.getStack().replace("\n", "\\n")).append("\",");
            appendMetadata(json, p.getMetadata());
        } else if (payload instanceof MessagePayload) {
            MessagePayload p = (MessagePayload) payload;
            json.append("\"message\":\"").append(p.getMessage()).append("\",");
            appendMetadata(json, p.getMetadata());
        }

        json.append("}");
        json.append("}");
        return json.toString();
    }

    private static void appendMetadata(StringBuilder json, Metadata metadata) {
        json.append("\"metadata\":{");

        // Add fields from metadata
        boolean first = true;
        for (Map.Entry<String, String> entry : metadata.getFieldsMap().entrySet()) {
            if (!first) json.append(",");
            json.append("\"").append(entry.getKey()).append("\":\"").append(entry.getValue()).append("\"");
            first = false;
        }

        if (!first) json.append(",");
        json.append("\"env\":\"").append(metadata.getEnv()).append("\",");
        json.append("\"version\":\"").append(metadata.getVersion()).append("\",");
        json.append("\"service\":\"").append(metadata.getService()).append("\"");

        json.append("}");
    }

    private static String getStackTraceAsString(Throwable throwable) {
        StringBuilder sb = new StringBuilder();
        for (StackTraceElement element : throwable.getStackTrace()) {
            sb.append(element.toString());
            sb.append("\n");
        }
        return sb.toString();
    }
}