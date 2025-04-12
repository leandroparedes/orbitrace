import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace orbitrace. */
export namespace orbitrace {

    /** Properties of an OrbitraceConfig. */
    interface IOrbitraceConfig {

        /** OrbitraceConfig apiKey */
        apiKey?: (string|null);

        /** OrbitraceConfig orgId */
        orgId?: (string|null);

        /** OrbitraceConfig projectId */
        projectId?: (string|null);

        /** OrbitraceConfig endpoint */
        endpoint?: (string|null);

        /** OrbitraceConfig environment */
        environment?: (string|null);

        /** OrbitraceConfig version */
        version?: (string|null);

        /** OrbitraceConfig service */
        service?: (string|null);

        /** OrbitraceConfig disabled */
        disabled?: (boolean|null);
    }

    /** Represents an OrbitraceConfig. */
    class OrbitraceConfig implements IOrbitraceConfig {

        /**
         * Constructs a new OrbitraceConfig.
         * @param [properties] Properties to set
         */
        constructor(properties?: orbitrace.IOrbitraceConfig);

        /** OrbitraceConfig apiKey. */
        public apiKey: string;

        /** OrbitraceConfig orgId. */
        public orgId: string;

        /** OrbitraceConfig projectId. */
        public projectId: string;

        /** OrbitraceConfig endpoint. */
        public endpoint: string;

        /** OrbitraceConfig environment. */
        public environment: string;

        /** OrbitraceConfig version. */
        public version: string;

        /** OrbitraceConfig service. */
        public service: string;

        /** OrbitraceConfig disabled. */
        public disabled: boolean;

        /**
         * Creates a new OrbitraceConfig instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OrbitraceConfig instance
         */
        public static create(properties?: orbitrace.IOrbitraceConfig): orbitrace.OrbitraceConfig;

        /**
         * Encodes the specified OrbitraceConfig message. Does not implicitly {@link orbitrace.OrbitraceConfig.verify|verify} messages.
         * @param message OrbitraceConfig message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: orbitrace.IOrbitraceConfig, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OrbitraceConfig message, length delimited. Does not implicitly {@link orbitrace.OrbitraceConfig.verify|verify} messages.
         * @param message OrbitraceConfig message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: orbitrace.IOrbitraceConfig, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OrbitraceConfig message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OrbitraceConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): orbitrace.OrbitraceConfig;

        /**
         * Decodes an OrbitraceConfig message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OrbitraceConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): orbitrace.OrbitraceConfig;

        /**
         * Verifies an OrbitraceConfig message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OrbitraceConfig message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OrbitraceConfig
         */
        public static fromObject(object: { [k: string]: any }): orbitrace.OrbitraceConfig;

        /**
         * Creates a plain object from an OrbitraceConfig message. Also converts values to other types if specified.
         * @param message OrbitraceConfig
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: orbitrace.OrbitraceConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OrbitraceConfig to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for OrbitraceConfig
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Metadata. */
    interface IMetadata {

        /** Metadata fields */
        fields?: ({ [k: string]: string }|null);

        /** Metadata env */
        env?: (string|null);

        /** Metadata version */
        version?: (string|null);

        /** Metadata service */
        service?: (string|null);
    }

    /** Represents a Metadata. */
    class Metadata implements IMetadata {

        /**
         * Constructs a new Metadata.
         * @param [properties] Properties to set
         */
        constructor(properties?: orbitrace.IMetadata);

        /** Metadata fields. */
        public fields: { [k: string]: string };

        /** Metadata env. */
        public env: string;

        /** Metadata version. */
        public version: string;

        /** Metadata service. */
        public service: string;

        /**
         * Creates a new Metadata instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Metadata instance
         */
        public static create(properties?: orbitrace.IMetadata): orbitrace.Metadata;

        /**
         * Encodes the specified Metadata message. Does not implicitly {@link orbitrace.Metadata.verify|verify} messages.
         * @param message Metadata message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: orbitrace.IMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Metadata message, length delimited. Does not implicitly {@link orbitrace.Metadata.verify|verify} messages.
         * @param message Metadata message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: orbitrace.IMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Metadata message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Metadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): orbitrace.Metadata;

        /**
         * Decodes a Metadata message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Metadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): orbitrace.Metadata;

        /**
         * Verifies a Metadata message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Metadata message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Metadata
         */
        public static fromObject(object: { [k: string]: any }): orbitrace.Metadata;

        /**
         * Creates a plain object from a Metadata message. Also converts values to other types if specified.
         * @param message Metadata
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: orbitrace.Metadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Metadata to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Metadata
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ExceptionPayload. */
    interface IExceptionPayload {

        /** ExceptionPayload message */
        message?: (string|null);

        /** ExceptionPayload stack */
        stack?: (string|null);

        /** ExceptionPayload metadata */
        metadata?: (orbitrace.IMetadata|null);
    }

    /** Represents an ExceptionPayload. */
    class ExceptionPayload implements IExceptionPayload {

        /**
         * Constructs a new ExceptionPayload.
         * @param [properties] Properties to set
         */
        constructor(properties?: orbitrace.IExceptionPayload);

        /** ExceptionPayload message. */
        public message: string;

        /** ExceptionPayload stack. */
        public stack: string;

        /** ExceptionPayload metadata. */
        public metadata?: (orbitrace.IMetadata|null);

        /**
         * Creates a new ExceptionPayload instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExceptionPayload instance
         */
        public static create(properties?: orbitrace.IExceptionPayload): orbitrace.ExceptionPayload;

        /**
         * Encodes the specified ExceptionPayload message. Does not implicitly {@link orbitrace.ExceptionPayload.verify|verify} messages.
         * @param message ExceptionPayload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: orbitrace.IExceptionPayload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExceptionPayload message, length delimited. Does not implicitly {@link orbitrace.ExceptionPayload.verify|verify} messages.
         * @param message ExceptionPayload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: orbitrace.IExceptionPayload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExceptionPayload message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExceptionPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): orbitrace.ExceptionPayload;

        /**
         * Decodes an ExceptionPayload message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExceptionPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): orbitrace.ExceptionPayload;

        /**
         * Verifies an ExceptionPayload message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExceptionPayload message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExceptionPayload
         */
        public static fromObject(object: { [k: string]: any }): orbitrace.ExceptionPayload;

        /**
         * Creates a plain object from an ExceptionPayload message. Also converts values to other types if specified.
         * @param message ExceptionPayload
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: orbitrace.ExceptionPayload, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExceptionPayload to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ExceptionPayload
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessagePayload. */
    interface IMessagePayload {

        /** MessagePayload message */
        message?: (string|null);

        /** MessagePayload metadata */
        metadata?: (orbitrace.IMetadata|null);
    }

    /** Represents a MessagePayload. */
    class MessagePayload implements IMessagePayload {

        /**
         * Constructs a new MessagePayload.
         * @param [properties] Properties to set
         */
        constructor(properties?: orbitrace.IMessagePayload);

        /** MessagePayload message. */
        public message: string;

        /** MessagePayload metadata. */
        public metadata?: (orbitrace.IMetadata|null);

        /**
         * Creates a new MessagePayload instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessagePayload instance
         */
        public static create(properties?: orbitrace.IMessagePayload): orbitrace.MessagePayload;

        /**
         * Encodes the specified MessagePayload message. Does not implicitly {@link orbitrace.MessagePayload.verify|verify} messages.
         * @param message MessagePayload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: orbitrace.IMessagePayload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessagePayload message, length delimited. Does not implicitly {@link orbitrace.MessagePayload.verify|verify} messages.
         * @param message MessagePayload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: orbitrace.IMessagePayload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessagePayload message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessagePayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): orbitrace.MessagePayload;

        /**
         * Decodes a MessagePayload message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessagePayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): orbitrace.MessagePayload;

        /**
         * Verifies a MessagePayload message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessagePayload message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessagePayload
         */
        public static fromObject(object: { [k: string]: any }): orbitrace.MessagePayload;

        /**
         * Creates a plain object from a MessagePayload message. Also converts values to other types if specified.
         * @param message MessagePayload
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: orbitrace.MessagePayload, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessagePayload to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessagePayload
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ApiRequest. */
    interface IApiRequest {

        /** ApiRequest event */
        event?: (string|null);

        /** ApiRequest exceptionPayload */
        exceptionPayload?: (orbitrace.IExceptionPayload|null);

        /** ApiRequest messagePayload */
        messagePayload?: (orbitrace.IMessagePayload|null);
    }

    /** Represents an ApiRequest. */
    class ApiRequest implements IApiRequest {

        /**
         * Constructs a new ApiRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: orbitrace.IApiRequest);

        /** ApiRequest event. */
        public event: string;

        /** ApiRequest exceptionPayload. */
        public exceptionPayload?: (orbitrace.IExceptionPayload|null);

        /** ApiRequest messagePayload. */
        public messagePayload?: (orbitrace.IMessagePayload|null);

        /** ApiRequest payload. */
        public payload?: ("exceptionPayload"|"messagePayload");

        /**
         * Creates a new ApiRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ApiRequest instance
         */
        public static create(properties?: orbitrace.IApiRequest): orbitrace.ApiRequest;

        /**
         * Encodes the specified ApiRequest message. Does not implicitly {@link orbitrace.ApiRequest.verify|verify} messages.
         * @param message ApiRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: orbitrace.IApiRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ApiRequest message, length delimited. Does not implicitly {@link orbitrace.ApiRequest.verify|verify} messages.
         * @param message ApiRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: orbitrace.IApiRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ApiRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ApiRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): orbitrace.ApiRequest;

        /**
         * Decodes an ApiRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ApiRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): orbitrace.ApiRequest;

        /**
         * Verifies an ApiRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ApiRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ApiRequest
         */
        public static fromObject(object: { [k: string]: any }): orbitrace.ApiRequest;

        /**
         * Creates a plain object from an ApiRequest message. Also converts values to other types if specified.
         * @param message ApiRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: orbitrace.ApiRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ApiRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ApiRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ApiResponse. */
    interface IApiResponse {

        /** ApiResponse success */
        success?: (boolean|null);

        /** ApiResponse message */
        message?: (string|null);

        /** ApiResponse data */
        data?: ({ [k: string]: string }|null);
    }

    /** Represents an ApiResponse. */
    class ApiResponse implements IApiResponse {

        /**
         * Constructs a new ApiResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: orbitrace.IApiResponse);

        /** ApiResponse success. */
        public success: boolean;

        /** ApiResponse message. */
        public message: string;

        /** ApiResponse data. */
        public data: { [k: string]: string };

        /**
         * Creates a new ApiResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ApiResponse instance
         */
        public static create(properties?: orbitrace.IApiResponse): orbitrace.ApiResponse;

        /**
         * Encodes the specified ApiResponse message. Does not implicitly {@link orbitrace.ApiResponse.verify|verify} messages.
         * @param message ApiResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: orbitrace.IApiResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ApiResponse message, length delimited. Does not implicitly {@link orbitrace.ApiResponse.verify|verify} messages.
         * @param message ApiResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: orbitrace.IApiResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ApiResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ApiResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): orbitrace.ApiResponse;

        /**
         * Decodes an ApiResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ApiResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): orbitrace.ApiResponse;

        /**
         * Verifies an ApiResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ApiResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ApiResponse
         */
        public static fromObject(object: { [k: string]: any }): orbitrace.ApiResponse;

        /**
         * Creates a plain object from an ApiResponse message. Also converts values to other types if specified.
         * @param message ApiResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: orbitrace.ApiResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ApiResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ApiResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Represents an OrbitraceService */
    class OrbitraceService extends $protobuf.rpc.Service {

        /**
         * Constructs a new OrbitraceService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new OrbitraceService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): OrbitraceService;

        /**
         * Calls CaptureException.
         * @param request ExceptionPayload message or plain object
         * @param callback Node-style callback called with the error, if any, and ApiResponse
         */
        public captureException(request: orbitrace.IExceptionPayload, callback: orbitrace.OrbitraceService.CaptureExceptionCallback): void;

        /**
         * Calls CaptureException.
         * @param request ExceptionPayload message or plain object
         * @returns Promise
         */
        public captureException(request: orbitrace.IExceptionPayload): Promise<orbitrace.ApiResponse>;

        /**
         * Calls CaptureMessage.
         * @param request MessagePayload message or plain object
         * @param callback Node-style callback called with the error, if any, and ApiResponse
         */
        public captureMessage(request: orbitrace.IMessagePayload, callback: orbitrace.OrbitraceService.CaptureMessageCallback): void;

        /**
         * Calls CaptureMessage.
         * @param request MessagePayload message or plain object
         * @returns Promise
         */
        public captureMessage(request: orbitrace.IMessagePayload): Promise<orbitrace.ApiResponse>;
    }

    namespace OrbitraceService {

        /**
         * Callback as used by {@link orbitrace.OrbitraceService#captureException}.
         * @param error Error, if any
         * @param [response] ApiResponse
         */
        type CaptureExceptionCallback = (error: (Error|null), response?: orbitrace.ApiResponse) => void;

        /**
         * Callback as used by {@link orbitrace.OrbitraceService#captureMessage}.
         * @param error Error, if any
         * @param [response] ApiResponse
         */
        type CaptureMessageCallback = (error: (Error|null), response?: orbitrace.ApiResponse) => void;
    }
}
