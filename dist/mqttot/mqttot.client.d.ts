/// <reference types="node" />
import { ConnectRequestOptions, ConnectResponsePacket, MqttClient, MqttMessage, PacketFlowFunc } from 'mqtts';
export declare class MQTToTClient extends MqttClient {
    protected connectPayloadProvider: () => Promise<Buffer>;
    protected connectPayload: Buffer;
    protected requirePayload: boolean;
    protected mqttotDebug: (msg: string) => void;
    constructor(options: {
        url: string;
        payloadProvider: () => Promise<Buffer>;
        enableTrace?: boolean;
        autoReconnect: boolean;
        requirePayload: boolean;
    });
    protected registerListeners(): void;
    connect(options?: ConnectRequestOptions): Promise<any>;
    protected getConnectFlow(): PacketFlowFunc<any>;
    /**
     * Compresses the payload
     * @param {MqttMessage} message
     * @returns {Promise<void>}
     */
    mqttotPublish(message: MqttMessage): Promise<void>;
}
export declare function mqttotConnectFlow(payload: Buffer, requirePayload: boolean): PacketFlowFunc<ConnectResponsePacket>;
