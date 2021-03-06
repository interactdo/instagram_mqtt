"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttotConnectFlow = exports.MQTToTClient = void 0;
const mqttot_connect_request_packet_1 = require("./mqttot.connect-request-packet");
const shared_1 = require("../shared");
const URL = require("url");
const mqtts_1 = require("mqtts");
const errors_1 = require("../errors");
class MQTToTClient extends mqtts_1.MqttClient {
    constructor(options) {
        super({ url: options.url, enableTrace: options.enableTrace, autoReconnect: options.autoReconnect });
        this.mqttotDebug = (msg, ...args) => shared_1.debugChannel('mqttot')(`${URL.parse(options.url).host}: ${msg}`, ...args);
        this.connectPayloadProvider = options.payloadProvider;
        this.mqttotDebug(`Creating client`);
        this.registerListeners();
        this.state.connectOptions = { keepAlive: 60 };
        this.requirePayload = options.requirePayload;
    }
    registerListeners() {
        const printErrorOrWarning = (type) => (e) => {
            if (typeof e === 'string') {
                this.mqttotDebug(`${type}: ${e}`);
            }
            else {
                this.mqttotDebug(`${type}: ${e.message}\n\tStack: ${e.stack}`);
            }
        };
        this.$warning.subscribe(printErrorOrWarning('Error'));
        this.$error.subscribe(printErrorOrWarning('Warning'));
        this.$disconnect.subscribe(e => this.mqttotDebug(`Disconnected. ${e}`));
    }
    async connect(options) {
        this.connectPayload = await this.connectPayloadProvider();
        return super.connect(options);
    }
    getConnectFlow() {
        return mqttotConnectFlow(this.connectPayload, this.requirePayload);
    }
    /**
     * Compresses the payload
     * @param {MqttMessage} message
     * @returns {Promise<void>}
     */
    async mqttotPublish(message) {
        this.mqttotDebug(`Publishing ${message.payload.byteLength}bytes to topic ${message.topic}`);
        this.publish({
            topic: message.topic,
            payload: await shared_1.compressDeflate(message.payload),
            qosLevel: message.qosLevel,
        });
    }
}
exports.MQTToTClient = MQTToTClient;
function mqttotConnectFlow(payload, requirePayload) {
    return (success, error) => ({
        start: () => new mqttot_connect_request_packet_1.MQTToTConnectRequestPacket(payload),
        accept: mqtts_1.isConnAck,
        next: (packet) => {
            var _a;
            if (packet.isSuccess) {
                if (((_a = packet.payload) === null || _a === void 0 ? void 0 : _a.length) || !requirePayload)
                    success(packet);
                else
                    error(new errors_1.EmptyPacketError(`CONNACK: no payload (payloadExpected): ${packet.payload}`));
            }
            else
                error(new errors_1.ConnectionFailedError(`CONNACK returnCode: ${packet.returnCode} errorName: ${packet.errorName}`));
        },
    });
}
exports.mqttotConnectFlow = mqttotConnectFlow;
//# sourceMappingURL=mqttot.client.js.map