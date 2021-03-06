/// <reference types="node" />
import { MqttPacket, PacketStream } from 'mqtts';
export declare class MQTToTConnectRequestPacket extends MqttPacket {
    get protocolName(): string;
    set protocolName(value: string);
    get keepAlive(): number;
    set keepAlive(value: number);
    get flags(): number;
    set flags(value: number);
    private protocolLevel;
    private _protocolName;
    private _flags;
    private _keepAlive;
    payload: Buffer;
    constructor(payload?: Buffer);
    read(): void;
    write(stream: PacketStream): void;
}
