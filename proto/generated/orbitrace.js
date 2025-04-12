/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.orbitrace = (function() {

    /**
     * Namespace orbitrace.
     * @exports orbitrace
     * @namespace
     */
    var orbitrace = {};

    orbitrace.OrbitraceConfig = (function() {

        /**
         * Properties of an OrbitraceConfig.
         * @memberof orbitrace
         * @interface IOrbitraceConfig
         * @property {string|null} [apiKey] OrbitraceConfig apiKey
         * @property {string|null} [orgId] OrbitraceConfig orgId
         * @property {string|null} [projectId] OrbitraceConfig projectId
         * @property {string|null} [endpoint] OrbitraceConfig endpoint
         * @property {string|null} [environment] OrbitraceConfig environment
         * @property {string|null} [version] OrbitraceConfig version
         * @property {string|null} [service] OrbitraceConfig service
         * @property {boolean|null} [disabled] OrbitraceConfig disabled
         */

        /**
         * Constructs a new OrbitraceConfig.
         * @memberof orbitrace
         * @classdesc Represents an OrbitraceConfig.
         * @implements IOrbitraceConfig
         * @constructor
         * @param {orbitrace.IOrbitraceConfig=} [properties] Properties to set
         */
        function OrbitraceConfig(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OrbitraceConfig apiKey.
         * @member {string} apiKey
         * @memberof orbitrace.OrbitraceConfig
         * @instance
         */
        OrbitraceConfig.prototype.apiKey = "";

        /**
         * OrbitraceConfig orgId.
         * @member {string} orgId
         * @memberof orbitrace.OrbitraceConfig
         * @instance
         */
        OrbitraceConfig.prototype.orgId = "";

        /**
         * OrbitraceConfig projectId.
         * @member {string} projectId
         * @memberof orbitrace.OrbitraceConfig
         * @instance
         */
        OrbitraceConfig.prototype.projectId = "";

        /**
         * OrbitraceConfig endpoint.
         * @member {string} endpoint
         * @memberof orbitrace.OrbitraceConfig
         * @instance
         */
        OrbitraceConfig.prototype.endpoint = "";

        /**
         * OrbitraceConfig environment.
         * @member {string} environment
         * @memberof orbitrace.OrbitraceConfig
         * @instance
         */
        OrbitraceConfig.prototype.environment = "";

        /**
         * OrbitraceConfig version.
         * @member {string} version
         * @memberof orbitrace.OrbitraceConfig
         * @instance
         */
        OrbitraceConfig.prototype.version = "";

        /**
         * OrbitraceConfig service.
         * @member {string} service
         * @memberof orbitrace.OrbitraceConfig
         * @instance
         */
        OrbitraceConfig.prototype.service = "";

        /**
         * OrbitraceConfig disabled.
         * @member {boolean} disabled
         * @memberof orbitrace.OrbitraceConfig
         * @instance
         */
        OrbitraceConfig.prototype.disabled = false;

        /**
         * Creates a new OrbitraceConfig instance using the specified properties.
         * @function create
         * @memberof orbitrace.OrbitraceConfig
         * @static
         * @param {orbitrace.IOrbitraceConfig=} [properties] Properties to set
         * @returns {orbitrace.OrbitraceConfig} OrbitraceConfig instance
         */
        OrbitraceConfig.create = function create(properties) {
            return new OrbitraceConfig(properties);
        };

        /**
         * Encodes the specified OrbitraceConfig message. Does not implicitly {@link orbitrace.OrbitraceConfig.verify|verify} messages.
         * @function encode
         * @memberof orbitrace.OrbitraceConfig
         * @static
         * @param {orbitrace.IOrbitraceConfig} message OrbitraceConfig message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OrbitraceConfig.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.apiKey != null && Object.hasOwnProperty.call(message, "apiKey"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.apiKey);
            if (message.orgId != null && Object.hasOwnProperty.call(message, "orgId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.orgId);
            if (message.projectId != null && Object.hasOwnProperty.call(message, "projectId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.projectId);
            if (message.endpoint != null && Object.hasOwnProperty.call(message, "endpoint"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.endpoint);
            if (message.environment != null && Object.hasOwnProperty.call(message, "environment"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.environment);
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.version);
            if (message.service != null && Object.hasOwnProperty.call(message, "service"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.service);
            if (message.disabled != null && Object.hasOwnProperty.call(message, "disabled"))
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.disabled);
            return writer;
        };

        /**
         * Encodes the specified OrbitraceConfig message, length delimited. Does not implicitly {@link orbitrace.OrbitraceConfig.verify|verify} messages.
         * @function encodeDelimited
         * @memberof orbitrace.OrbitraceConfig
         * @static
         * @param {orbitrace.IOrbitraceConfig} message OrbitraceConfig message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OrbitraceConfig.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OrbitraceConfig message from the specified reader or buffer.
         * @function decode
         * @memberof orbitrace.OrbitraceConfig
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {orbitrace.OrbitraceConfig} OrbitraceConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OrbitraceConfig.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.orbitrace.OrbitraceConfig();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.apiKey = reader.string();
                        break;
                    }
                case 2: {
                        message.orgId = reader.string();
                        break;
                    }
                case 3: {
                        message.projectId = reader.string();
                        break;
                    }
                case 4: {
                        message.endpoint = reader.string();
                        break;
                    }
                case 5: {
                        message.environment = reader.string();
                        break;
                    }
                case 6: {
                        message.version = reader.string();
                        break;
                    }
                case 7: {
                        message.service = reader.string();
                        break;
                    }
                case 8: {
                        message.disabled = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an OrbitraceConfig message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof orbitrace.OrbitraceConfig
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {orbitrace.OrbitraceConfig} OrbitraceConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OrbitraceConfig.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OrbitraceConfig message.
         * @function verify
         * @memberof orbitrace.OrbitraceConfig
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OrbitraceConfig.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.apiKey != null && message.hasOwnProperty("apiKey"))
                if (!$util.isString(message.apiKey))
                    return "apiKey: string expected";
            if (message.orgId != null && message.hasOwnProperty("orgId"))
                if (!$util.isString(message.orgId))
                    return "orgId: string expected";
            if (message.projectId != null && message.hasOwnProperty("projectId"))
                if (!$util.isString(message.projectId))
                    return "projectId: string expected";
            if (message.endpoint != null && message.hasOwnProperty("endpoint"))
                if (!$util.isString(message.endpoint))
                    return "endpoint: string expected";
            if (message.environment != null && message.hasOwnProperty("environment"))
                if (!$util.isString(message.environment))
                    return "environment: string expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isString(message.version))
                    return "version: string expected";
            if (message.service != null && message.hasOwnProperty("service"))
                if (!$util.isString(message.service))
                    return "service: string expected";
            if (message.disabled != null && message.hasOwnProperty("disabled"))
                if (typeof message.disabled !== "boolean")
                    return "disabled: boolean expected";
            return null;
        };

        /**
         * Creates an OrbitraceConfig message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof orbitrace.OrbitraceConfig
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {orbitrace.OrbitraceConfig} OrbitraceConfig
         */
        OrbitraceConfig.fromObject = function fromObject(object) {
            if (object instanceof $root.orbitrace.OrbitraceConfig)
                return object;
            var message = new $root.orbitrace.OrbitraceConfig();
            if (object.apiKey != null)
                message.apiKey = String(object.apiKey);
            if (object.orgId != null)
                message.orgId = String(object.orgId);
            if (object.projectId != null)
                message.projectId = String(object.projectId);
            if (object.endpoint != null)
                message.endpoint = String(object.endpoint);
            if (object.environment != null)
                message.environment = String(object.environment);
            if (object.version != null)
                message.version = String(object.version);
            if (object.service != null)
                message.service = String(object.service);
            if (object.disabled != null)
                message.disabled = Boolean(object.disabled);
            return message;
        };

        /**
         * Creates a plain object from an OrbitraceConfig message. Also converts values to other types if specified.
         * @function toObject
         * @memberof orbitrace.OrbitraceConfig
         * @static
         * @param {orbitrace.OrbitraceConfig} message OrbitraceConfig
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OrbitraceConfig.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.apiKey = "";
                object.orgId = "";
                object.projectId = "";
                object.endpoint = "";
                object.environment = "";
                object.version = "";
                object.service = "";
                object.disabled = false;
            }
            if (message.apiKey != null && message.hasOwnProperty("apiKey"))
                object.apiKey = message.apiKey;
            if (message.orgId != null && message.hasOwnProperty("orgId"))
                object.orgId = message.orgId;
            if (message.projectId != null && message.hasOwnProperty("projectId"))
                object.projectId = message.projectId;
            if (message.endpoint != null && message.hasOwnProperty("endpoint"))
                object.endpoint = message.endpoint;
            if (message.environment != null && message.hasOwnProperty("environment"))
                object.environment = message.environment;
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.service != null && message.hasOwnProperty("service"))
                object.service = message.service;
            if (message.disabled != null && message.hasOwnProperty("disabled"))
                object.disabled = message.disabled;
            return object;
        };

        /**
         * Converts this OrbitraceConfig to JSON.
         * @function toJSON
         * @memberof orbitrace.OrbitraceConfig
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OrbitraceConfig.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for OrbitraceConfig
         * @function getTypeUrl
         * @memberof orbitrace.OrbitraceConfig
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        OrbitraceConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/orbitrace.OrbitraceConfig";
        };

        return OrbitraceConfig;
    })();

    orbitrace.Metadata = (function() {

        /**
         * Properties of a Metadata.
         * @memberof orbitrace
         * @interface IMetadata
         * @property {Object.<string,string>|null} [fields] Metadata fields
         * @property {string|null} [env] Metadata env
         * @property {string|null} [version] Metadata version
         * @property {string|null} [service] Metadata service
         */

        /**
         * Constructs a new Metadata.
         * @memberof orbitrace
         * @classdesc Represents a Metadata.
         * @implements IMetadata
         * @constructor
         * @param {orbitrace.IMetadata=} [properties] Properties to set
         */
        function Metadata(properties) {
            this.fields = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Metadata fields.
         * @member {Object.<string,string>} fields
         * @memberof orbitrace.Metadata
         * @instance
         */
        Metadata.prototype.fields = $util.emptyObject;

        /**
         * Metadata env.
         * @member {string} env
         * @memberof orbitrace.Metadata
         * @instance
         */
        Metadata.prototype.env = "";

        /**
         * Metadata version.
         * @member {string} version
         * @memberof orbitrace.Metadata
         * @instance
         */
        Metadata.prototype.version = "";

        /**
         * Metadata service.
         * @member {string} service
         * @memberof orbitrace.Metadata
         * @instance
         */
        Metadata.prototype.service = "";

        /**
         * Creates a new Metadata instance using the specified properties.
         * @function create
         * @memberof orbitrace.Metadata
         * @static
         * @param {orbitrace.IMetadata=} [properties] Properties to set
         * @returns {orbitrace.Metadata} Metadata instance
         */
        Metadata.create = function create(properties) {
            return new Metadata(properties);
        };

        /**
         * Encodes the specified Metadata message. Does not implicitly {@link orbitrace.Metadata.verify|verify} messages.
         * @function encode
         * @memberof orbitrace.Metadata
         * @static
         * @param {orbitrace.IMetadata} message Metadata message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Metadata.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.fields != null && Object.hasOwnProperty.call(message, "fields"))
                for (var keys = Object.keys(message.fields), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.fields[keys[i]]).ldelim();
            if (message.env != null && Object.hasOwnProperty.call(message, "env"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.env);
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.version);
            if (message.service != null && Object.hasOwnProperty.call(message, "service"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.service);
            return writer;
        };

        /**
         * Encodes the specified Metadata message, length delimited. Does not implicitly {@link orbitrace.Metadata.verify|verify} messages.
         * @function encodeDelimited
         * @memberof orbitrace.Metadata
         * @static
         * @param {orbitrace.IMetadata} message Metadata message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Metadata.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Metadata message from the specified reader or buffer.
         * @function decode
         * @memberof orbitrace.Metadata
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {orbitrace.Metadata} Metadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Metadata.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.orbitrace.Metadata(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (message.fields === $util.emptyObject)
                            message.fields = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = "";
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = reader.string();
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.fields[key] = value;
                        break;
                    }
                case 2: {
                        message.env = reader.string();
                        break;
                    }
                case 3: {
                        message.version = reader.string();
                        break;
                    }
                case 4: {
                        message.service = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Metadata message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof orbitrace.Metadata
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {orbitrace.Metadata} Metadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Metadata.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Metadata message.
         * @function verify
         * @memberof orbitrace.Metadata
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Metadata.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.fields != null && message.hasOwnProperty("fields")) {
                if (!$util.isObject(message.fields))
                    return "fields: object expected";
                var key = Object.keys(message.fields);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isString(message.fields[key[i]]))
                        return "fields: string{k:string} expected";
            }
            if (message.env != null && message.hasOwnProperty("env"))
                if (!$util.isString(message.env))
                    return "env: string expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isString(message.version))
                    return "version: string expected";
            if (message.service != null && message.hasOwnProperty("service"))
                if (!$util.isString(message.service))
                    return "service: string expected";
            return null;
        };

        /**
         * Creates a Metadata message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof orbitrace.Metadata
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {orbitrace.Metadata} Metadata
         */
        Metadata.fromObject = function fromObject(object) {
            if (object instanceof $root.orbitrace.Metadata)
                return object;
            var message = new $root.orbitrace.Metadata();
            if (object.fields) {
                if (typeof object.fields !== "object")
                    throw TypeError(".orbitrace.Metadata.fields: object expected");
                message.fields = {};
                for (var keys = Object.keys(object.fields), i = 0; i < keys.length; ++i)
                    message.fields[keys[i]] = String(object.fields[keys[i]]);
            }
            if (object.env != null)
                message.env = String(object.env);
            if (object.version != null)
                message.version = String(object.version);
            if (object.service != null)
                message.service = String(object.service);
            return message;
        };

        /**
         * Creates a plain object from a Metadata message. Also converts values to other types if specified.
         * @function toObject
         * @memberof orbitrace.Metadata
         * @static
         * @param {orbitrace.Metadata} message Metadata
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Metadata.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults)
                object.fields = {};
            if (options.defaults) {
                object.env = "";
                object.version = "";
                object.service = "";
            }
            var keys2;
            if (message.fields && (keys2 = Object.keys(message.fields)).length) {
                object.fields = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.fields[keys2[j]] = message.fields[keys2[j]];
            }
            if (message.env != null && message.hasOwnProperty("env"))
                object.env = message.env;
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.service != null && message.hasOwnProperty("service"))
                object.service = message.service;
            return object;
        };

        /**
         * Converts this Metadata to JSON.
         * @function toJSON
         * @memberof orbitrace.Metadata
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Metadata.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Metadata
         * @function getTypeUrl
         * @memberof orbitrace.Metadata
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Metadata.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/orbitrace.Metadata";
        };

        return Metadata;
    })();

    orbitrace.ExceptionPayload = (function() {

        /**
         * Properties of an ExceptionPayload.
         * @memberof orbitrace
         * @interface IExceptionPayload
         * @property {string|null} [message] ExceptionPayload message
         * @property {string|null} [stack] ExceptionPayload stack
         * @property {orbitrace.IMetadata|null} [metadata] ExceptionPayload metadata
         */

        /**
         * Constructs a new ExceptionPayload.
         * @memberof orbitrace
         * @classdesc Represents an ExceptionPayload.
         * @implements IExceptionPayload
         * @constructor
         * @param {orbitrace.IExceptionPayload=} [properties] Properties to set
         */
        function ExceptionPayload(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExceptionPayload message.
         * @member {string} message
         * @memberof orbitrace.ExceptionPayload
         * @instance
         */
        ExceptionPayload.prototype.message = "";

        /**
         * ExceptionPayload stack.
         * @member {string} stack
         * @memberof orbitrace.ExceptionPayload
         * @instance
         */
        ExceptionPayload.prototype.stack = "";

        /**
         * ExceptionPayload metadata.
         * @member {orbitrace.IMetadata|null|undefined} metadata
         * @memberof orbitrace.ExceptionPayload
         * @instance
         */
        ExceptionPayload.prototype.metadata = null;

        /**
         * Creates a new ExceptionPayload instance using the specified properties.
         * @function create
         * @memberof orbitrace.ExceptionPayload
         * @static
         * @param {orbitrace.IExceptionPayload=} [properties] Properties to set
         * @returns {orbitrace.ExceptionPayload} ExceptionPayload instance
         */
        ExceptionPayload.create = function create(properties) {
            return new ExceptionPayload(properties);
        };

        /**
         * Encodes the specified ExceptionPayload message. Does not implicitly {@link orbitrace.ExceptionPayload.verify|verify} messages.
         * @function encode
         * @memberof orbitrace.ExceptionPayload
         * @static
         * @param {orbitrace.IExceptionPayload} message ExceptionPayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExceptionPayload.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.message);
            if (message.stack != null && Object.hasOwnProperty.call(message, "stack"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.stack);
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                $root.orbitrace.Metadata.encode(message.metadata, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ExceptionPayload message, length delimited. Does not implicitly {@link orbitrace.ExceptionPayload.verify|verify} messages.
         * @function encodeDelimited
         * @memberof orbitrace.ExceptionPayload
         * @static
         * @param {orbitrace.IExceptionPayload} message ExceptionPayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExceptionPayload.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExceptionPayload message from the specified reader or buffer.
         * @function decode
         * @memberof orbitrace.ExceptionPayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {orbitrace.ExceptionPayload} ExceptionPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExceptionPayload.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.orbitrace.ExceptionPayload();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.message = reader.string();
                        break;
                    }
                case 2: {
                        message.stack = reader.string();
                        break;
                    }
                case 3: {
                        message.metadata = $root.orbitrace.Metadata.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExceptionPayload message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof orbitrace.ExceptionPayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {orbitrace.ExceptionPayload} ExceptionPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExceptionPayload.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExceptionPayload message.
         * @function verify
         * @memberof orbitrace.ExceptionPayload
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExceptionPayload.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.stack != null && message.hasOwnProperty("stack"))
                if (!$util.isString(message.stack))
                    return "stack: string expected";
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
                var error = $root.orbitrace.Metadata.verify(message.metadata);
                if (error)
                    return "metadata." + error;
            }
            return null;
        };

        /**
         * Creates an ExceptionPayload message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof orbitrace.ExceptionPayload
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {orbitrace.ExceptionPayload} ExceptionPayload
         */
        ExceptionPayload.fromObject = function fromObject(object) {
            if (object instanceof $root.orbitrace.ExceptionPayload)
                return object;
            var message = new $root.orbitrace.ExceptionPayload();
            if (object.message != null)
                message.message = String(object.message);
            if (object.stack != null)
                message.stack = String(object.stack);
            if (object.metadata != null) {
                if (typeof object.metadata !== "object")
                    throw TypeError(".orbitrace.ExceptionPayload.metadata: object expected");
                message.metadata = $root.orbitrace.Metadata.fromObject(object.metadata);
            }
            return message;
        };

        /**
         * Creates a plain object from an ExceptionPayload message. Also converts values to other types if specified.
         * @function toObject
         * @memberof orbitrace.ExceptionPayload
         * @static
         * @param {orbitrace.ExceptionPayload} message ExceptionPayload
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExceptionPayload.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.message = "";
                object.stack = "";
                object.metadata = null;
            }
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.stack != null && message.hasOwnProperty("stack"))
                object.stack = message.stack;
            if (message.metadata != null && message.hasOwnProperty("metadata"))
                object.metadata = $root.orbitrace.Metadata.toObject(message.metadata, options);
            return object;
        };

        /**
         * Converts this ExceptionPayload to JSON.
         * @function toJSON
         * @memberof orbitrace.ExceptionPayload
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExceptionPayload.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ExceptionPayload
         * @function getTypeUrl
         * @memberof orbitrace.ExceptionPayload
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ExceptionPayload.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/orbitrace.ExceptionPayload";
        };

        return ExceptionPayload;
    })();

    orbitrace.MessagePayload = (function() {

        /**
         * Properties of a MessagePayload.
         * @memberof orbitrace
         * @interface IMessagePayload
         * @property {string|null} [message] MessagePayload message
         * @property {orbitrace.IMetadata|null} [metadata] MessagePayload metadata
         */

        /**
         * Constructs a new MessagePayload.
         * @memberof orbitrace
         * @classdesc Represents a MessagePayload.
         * @implements IMessagePayload
         * @constructor
         * @param {orbitrace.IMessagePayload=} [properties] Properties to set
         */
        function MessagePayload(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MessagePayload message.
         * @member {string} message
         * @memberof orbitrace.MessagePayload
         * @instance
         */
        MessagePayload.prototype.message = "";

        /**
         * MessagePayload metadata.
         * @member {orbitrace.IMetadata|null|undefined} metadata
         * @memberof orbitrace.MessagePayload
         * @instance
         */
        MessagePayload.prototype.metadata = null;

        /**
         * Creates a new MessagePayload instance using the specified properties.
         * @function create
         * @memberof orbitrace.MessagePayload
         * @static
         * @param {orbitrace.IMessagePayload=} [properties] Properties to set
         * @returns {orbitrace.MessagePayload} MessagePayload instance
         */
        MessagePayload.create = function create(properties) {
            return new MessagePayload(properties);
        };

        /**
         * Encodes the specified MessagePayload message. Does not implicitly {@link orbitrace.MessagePayload.verify|verify} messages.
         * @function encode
         * @memberof orbitrace.MessagePayload
         * @static
         * @param {orbitrace.IMessagePayload} message MessagePayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MessagePayload.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.message);
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                $root.orbitrace.Metadata.encode(message.metadata, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified MessagePayload message, length delimited. Does not implicitly {@link orbitrace.MessagePayload.verify|verify} messages.
         * @function encodeDelimited
         * @memberof orbitrace.MessagePayload
         * @static
         * @param {orbitrace.IMessagePayload} message MessagePayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MessagePayload.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MessagePayload message from the specified reader or buffer.
         * @function decode
         * @memberof orbitrace.MessagePayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {orbitrace.MessagePayload} MessagePayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MessagePayload.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.orbitrace.MessagePayload();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.message = reader.string();
                        break;
                    }
                case 2: {
                        message.metadata = $root.orbitrace.Metadata.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MessagePayload message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof orbitrace.MessagePayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {orbitrace.MessagePayload} MessagePayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MessagePayload.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MessagePayload message.
         * @function verify
         * @memberof orbitrace.MessagePayload
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MessagePayload.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
                var error = $root.orbitrace.Metadata.verify(message.metadata);
                if (error)
                    return "metadata." + error;
            }
            return null;
        };

        /**
         * Creates a MessagePayload message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof orbitrace.MessagePayload
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {orbitrace.MessagePayload} MessagePayload
         */
        MessagePayload.fromObject = function fromObject(object) {
            if (object instanceof $root.orbitrace.MessagePayload)
                return object;
            var message = new $root.orbitrace.MessagePayload();
            if (object.message != null)
                message.message = String(object.message);
            if (object.metadata != null) {
                if (typeof object.metadata !== "object")
                    throw TypeError(".orbitrace.MessagePayload.metadata: object expected");
                message.metadata = $root.orbitrace.Metadata.fromObject(object.metadata);
            }
            return message;
        };

        /**
         * Creates a plain object from a MessagePayload message. Also converts values to other types if specified.
         * @function toObject
         * @memberof orbitrace.MessagePayload
         * @static
         * @param {orbitrace.MessagePayload} message MessagePayload
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MessagePayload.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.message = "";
                object.metadata = null;
            }
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.metadata != null && message.hasOwnProperty("metadata"))
                object.metadata = $root.orbitrace.Metadata.toObject(message.metadata, options);
            return object;
        };

        /**
         * Converts this MessagePayload to JSON.
         * @function toJSON
         * @memberof orbitrace.MessagePayload
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MessagePayload.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MessagePayload
         * @function getTypeUrl
         * @memberof orbitrace.MessagePayload
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MessagePayload.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/orbitrace.MessagePayload";
        };

        return MessagePayload;
    })();

    orbitrace.ApiRequest = (function() {

        /**
         * Properties of an ApiRequest.
         * @memberof orbitrace
         * @interface IApiRequest
         * @property {string|null} [event] ApiRequest event
         * @property {orbitrace.IExceptionPayload|null} [exceptionPayload] ApiRequest exceptionPayload
         * @property {orbitrace.IMessagePayload|null} [messagePayload] ApiRequest messagePayload
         */

        /**
         * Constructs a new ApiRequest.
         * @memberof orbitrace
         * @classdesc Represents an ApiRequest.
         * @implements IApiRequest
         * @constructor
         * @param {orbitrace.IApiRequest=} [properties] Properties to set
         */
        function ApiRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ApiRequest event.
         * @member {string} event
         * @memberof orbitrace.ApiRequest
         * @instance
         */
        ApiRequest.prototype.event = "";

        /**
         * ApiRequest exceptionPayload.
         * @member {orbitrace.IExceptionPayload|null|undefined} exceptionPayload
         * @memberof orbitrace.ApiRequest
         * @instance
         */
        ApiRequest.prototype.exceptionPayload = null;

        /**
         * ApiRequest messagePayload.
         * @member {orbitrace.IMessagePayload|null|undefined} messagePayload
         * @memberof orbitrace.ApiRequest
         * @instance
         */
        ApiRequest.prototype.messagePayload = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * ApiRequest payload.
         * @member {"exceptionPayload"|"messagePayload"|undefined} payload
         * @memberof orbitrace.ApiRequest
         * @instance
         */
        Object.defineProperty(ApiRequest.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["exceptionPayload", "messagePayload"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ApiRequest instance using the specified properties.
         * @function create
         * @memberof orbitrace.ApiRequest
         * @static
         * @param {orbitrace.IApiRequest=} [properties] Properties to set
         * @returns {orbitrace.ApiRequest} ApiRequest instance
         */
        ApiRequest.create = function create(properties) {
            return new ApiRequest(properties);
        };

        /**
         * Encodes the specified ApiRequest message. Does not implicitly {@link orbitrace.ApiRequest.verify|verify} messages.
         * @function encode
         * @memberof orbitrace.ApiRequest
         * @static
         * @param {orbitrace.IApiRequest} message ApiRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ApiRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.event != null && Object.hasOwnProperty.call(message, "event"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.event);
            if (message.exceptionPayload != null && Object.hasOwnProperty.call(message, "exceptionPayload"))
                $root.orbitrace.ExceptionPayload.encode(message.exceptionPayload, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.messagePayload != null && Object.hasOwnProperty.call(message, "messagePayload"))
                $root.orbitrace.MessagePayload.encode(message.messagePayload, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ApiRequest message, length delimited. Does not implicitly {@link orbitrace.ApiRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof orbitrace.ApiRequest
         * @static
         * @param {orbitrace.IApiRequest} message ApiRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ApiRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ApiRequest message from the specified reader or buffer.
         * @function decode
         * @memberof orbitrace.ApiRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {orbitrace.ApiRequest} ApiRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ApiRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.orbitrace.ApiRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.event = reader.string();
                        break;
                    }
                case 2: {
                        message.exceptionPayload = $root.orbitrace.ExceptionPayload.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.messagePayload = $root.orbitrace.MessagePayload.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ApiRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof orbitrace.ApiRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {orbitrace.ApiRequest} ApiRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ApiRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ApiRequest message.
         * @function verify
         * @memberof orbitrace.ApiRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ApiRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.event != null && message.hasOwnProperty("event"))
                if (!$util.isString(message.event))
                    return "event: string expected";
            if (message.exceptionPayload != null && message.hasOwnProperty("exceptionPayload")) {
                properties.payload = 1;
                {
                    var error = $root.orbitrace.ExceptionPayload.verify(message.exceptionPayload);
                    if (error)
                        return "exceptionPayload." + error;
                }
            }
            if (message.messagePayload != null && message.hasOwnProperty("messagePayload")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.orbitrace.MessagePayload.verify(message.messagePayload);
                    if (error)
                        return "messagePayload." + error;
                }
            }
            return null;
        };

        /**
         * Creates an ApiRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof orbitrace.ApiRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {orbitrace.ApiRequest} ApiRequest
         */
        ApiRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.orbitrace.ApiRequest)
                return object;
            var message = new $root.orbitrace.ApiRequest();
            if (object.event != null)
                message.event = String(object.event);
            if (object.exceptionPayload != null) {
                if (typeof object.exceptionPayload !== "object")
                    throw TypeError(".orbitrace.ApiRequest.exceptionPayload: object expected");
                message.exceptionPayload = $root.orbitrace.ExceptionPayload.fromObject(object.exceptionPayload);
            }
            if (object.messagePayload != null) {
                if (typeof object.messagePayload !== "object")
                    throw TypeError(".orbitrace.ApiRequest.messagePayload: object expected");
                message.messagePayload = $root.orbitrace.MessagePayload.fromObject(object.messagePayload);
            }
            return message;
        };

        /**
         * Creates a plain object from an ApiRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof orbitrace.ApiRequest
         * @static
         * @param {orbitrace.ApiRequest} message ApiRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ApiRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.event = "";
            if (message.event != null && message.hasOwnProperty("event"))
                object.event = message.event;
            if (message.exceptionPayload != null && message.hasOwnProperty("exceptionPayload")) {
                object.exceptionPayload = $root.orbitrace.ExceptionPayload.toObject(message.exceptionPayload, options);
                if (options.oneofs)
                    object.payload = "exceptionPayload";
            }
            if (message.messagePayload != null && message.hasOwnProperty("messagePayload")) {
                object.messagePayload = $root.orbitrace.MessagePayload.toObject(message.messagePayload, options);
                if (options.oneofs)
                    object.payload = "messagePayload";
            }
            return object;
        };

        /**
         * Converts this ApiRequest to JSON.
         * @function toJSON
         * @memberof orbitrace.ApiRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ApiRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ApiRequest
         * @function getTypeUrl
         * @memberof orbitrace.ApiRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ApiRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/orbitrace.ApiRequest";
        };

        return ApiRequest;
    })();

    orbitrace.ApiResponse = (function() {

        /**
         * Properties of an ApiResponse.
         * @memberof orbitrace
         * @interface IApiResponse
         * @property {boolean|null} [success] ApiResponse success
         * @property {string|null} [message] ApiResponse message
         * @property {Object.<string,string>|null} [data] ApiResponse data
         */

        /**
         * Constructs a new ApiResponse.
         * @memberof orbitrace
         * @classdesc Represents an ApiResponse.
         * @implements IApiResponse
         * @constructor
         * @param {orbitrace.IApiResponse=} [properties] Properties to set
         */
        function ApiResponse(properties) {
            this.data = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ApiResponse success.
         * @member {boolean} success
         * @memberof orbitrace.ApiResponse
         * @instance
         */
        ApiResponse.prototype.success = false;

        /**
         * ApiResponse message.
         * @member {string} message
         * @memberof orbitrace.ApiResponse
         * @instance
         */
        ApiResponse.prototype.message = "";

        /**
         * ApiResponse data.
         * @member {Object.<string,string>} data
         * @memberof orbitrace.ApiResponse
         * @instance
         */
        ApiResponse.prototype.data = $util.emptyObject;

        /**
         * Creates a new ApiResponse instance using the specified properties.
         * @function create
         * @memberof orbitrace.ApiResponse
         * @static
         * @param {orbitrace.IApiResponse=} [properties] Properties to set
         * @returns {orbitrace.ApiResponse} ApiResponse instance
         */
        ApiResponse.create = function create(properties) {
            return new ApiResponse(properties);
        };

        /**
         * Encodes the specified ApiResponse message. Does not implicitly {@link orbitrace.ApiResponse.verify|verify} messages.
         * @function encode
         * @memberof orbitrace.ApiResponse
         * @static
         * @param {orbitrace.IApiResponse} message ApiResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ApiResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                for (var keys = Object.keys(message.data), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.data[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ApiResponse message, length delimited. Does not implicitly {@link orbitrace.ApiResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof orbitrace.ApiResponse
         * @static
         * @param {orbitrace.IApiResponse} message ApiResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ApiResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ApiResponse message from the specified reader or buffer.
         * @function decode
         * @memberof orbitrace.ApiResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {orbitrace.ApiResponse} ApiResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ApiResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.orbitrace.ApiResponse(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.success = reader.bool();
                        break;
                    }
                case 2: {
                        message.message = reader.string();
                        break;
                    }
                case 3: {
                        if (message.data === $util.emptyObject)
                            message.data = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = "";
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = reader.string();
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.data[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ApiResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof orbitrace.ApiResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {orbitrace.ApiResponse} ApiResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ApiResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ApiResponse message.
         * @function verify
         * @memberof orbitrace.ApiResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ApiResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                if (!$util.isObject(message.data))
                    return "data: object expected";
                var key = Object.keys(message.data);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isString(message.data[key[i]]))
                        return "data: string{k:string} expected";
            }
            return null;
        };

        /**
         * Creates an ApiResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof orbitrace.ApiResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {orbitrace.ApiResponse} ApiResponse
         */
        ApiResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.orbitrace.ApiResponse)
                return object;
            var message = new $root.orbitrace.ApiResponse();
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.message != null)
                message.message = String(object.message);
            if (object.data) {
                if (typeof object.data !== "object")
                    throw TypeError(".orbitrace.ApiResponse.data: object expected");
                message.data = {};
                for (var keys = Object.keys(object.data), i = 0; i < keys.length; ++i)
                    message.data[keys[i]] = String(object.data[keys[i]]);
            }
            return message;
        };

        /**
         * Creates a plain object from an ApiResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof orbitrace.ApiResponse
         * @static
         * @param {orbitrace.ApiResponse} message ApiResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ApiResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults)
                object.data = {};
            if (options.defaults) {
                object.success = false;
                object.message = "";
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            var keys2;
            if (message.data && (keys2 = Object.keys(message.data)).length) {
                object.data = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.data[keys2[j]] = message.data[keys2[j]];
            }
            return object;
        };

        /**
         * Converts this ApiResponse to JSON.
         * @function toJSON
         * @memberof orbitrace.ApiResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ApiResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ApiResponse
         * @function getTypeUrl
         * @memberof orbitrace.ApiResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ApiResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/orbitrace.ApiResponse";
        };

        return ApiResponse;
    })();

    orbitrace.OrbitraceService = (function() {

        /**
         * Constructs a new OrbitraceService service.
         * @memberof orbitrace
         * @classdesc Represents an OrbitraceService
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function OrbitraceService(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (OrbitraceService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = OrbitraceService;

        /**
         * Creates new OrbitraceService service using the specified rpc implementation.
         * @function create
         * @memberof orbitrace.OrbitraceService
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {OrbitraceService} RPC service. Useful where requests and/or responses are streamed.
         */
        OrbitraceService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link orbitrace.OrbitraceService#captureException}.
         * @memberof orbitrace.OrbitraceService
         * @typedef CaptureExceptionCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {orbitrace.ApiResponse} [response] ApiResponse
         */

        /**
         * Calls CaptureException.
         * @function captureException
         * @memberof orbitrace.OrbitraceService
         * @instance
         * @param {orbitrace.IExceptionPayload} request ExceptionPayload message or plain object
         * @param {orbitrace.OrbitraceService.CaptureExceptionCallback} callback Node-style callback called with the error, if any, and ApiResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(OrbitraceService.prototype.captureException = function captureException(request, callback) {
            return this.rpcCall(captureException, $root.orbitrace.ExceptionPayload, $root.orbitrace.ApiResponse, request, callback);
        }, "name", { value: "CaptureException" });

        /**
         * Calls CaptureException.
         * @function captureException
         * @memberof orbitrace.OrbitraceService
         * @instance
         * @param {orbitrace.IExceptionPayload} request ExceptionPayload message or plain object
         * @returns {Promise<orbitrace.ApiResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link orbitrace.OrbitraceService#captureMessage}.
         * @memberof orbitrace.OrbitraceService
         * @typedef CaptureMessageCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {orbitrace.ApiResponse} [response] ApiResponse
         */

        /**
         * Calls CaptureMessage.
         * @function captureMessage
         * @memberof orbitrace.OrbitraceService
         * @instance
         * @param {orbitrace.IMessagePayload} request MessagePayload message or plain object
         * @param {orbitrace.OrbitraceService.CaptureMessageCallback} callback Node-style callback called with the error, if any, and ApiResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(OrbitraceService.prototype.captureMessage = function captureMessage(request, callback) {
            return this.rpcCall(captureMessage, $root.orbitrace.MessagePayload, $root.orbitrace.ApiResponse, request, callback);
        }, "name", { value: "CaptureMessage" });

        /**
         * Calls CaptureMessage.
         * @function captureMessage
         * @memberof orbitrace.OrbitraceService
         * @instance
         * @param {orbitrace.IMessagePayload} request MessagePayload message or plain object
         * @returns {Promise<orbitrace.ApiResponse>} Promise
         * @variation 2
         */

        return OrbitraceService;
    })();

    return orbitrace;
})();

module.exports = $root;
