"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTToTConnectRequestPacket = void 0;
const mqtts_1 = require("mqtts");
const errors_1 = require("../errors");
class MQTToTConnectRequestPacket extends mqtts_1.MqttPacket {
    constructor(payload) {
        super(mqtts_1.PacketTypes.TYPE_CONNECT);
        // only 3 is allowed
        this.protocolLevel = 3;
        this._protocolName = 'MQTToT';
        this._flags = 194;
        this._keepAlive = 60;
        this.payload = payload !== null && payload !== void 0 ? payload : Buffer.from([]);
    }
    get protocolName() {
        return this._protocolName;
    }
    set protocolName(value) {
        this.assertValidStringLength(value);
        this._protocolName = value;
    }
    get keepAlive() {
        return this._keepAlive;
    }
    set keepAlive(value) {
        if (value > 0xffff) {
            throw new errors_1.IllegalArgumentError('KeepAlive was greater than 0xffff');
        }
        this._keepAlive = value;
    }
    get flags() {
        return this._flags;
    }
    set flags(value) {
        if (value > 0xff) {
            throw new errors_1.IllegalArgumentError('Flags were greater than 0xff');
        }
        this._flags = value;
    }
    read() {
        throw new mqtts_1.InvalidDirectionError('read');
    }
    write(stream) {
        const data = mqtts_1.PacketStream.empty()
            .writeString(this._protocolName)
            .writeByte(this.protocolLevel)
            .writeByte(this._flags)
            .writeWord(this._keepAlive)
            .write(this.payload);
        this.remainingPacketLength = data.length;
        super.write(stream);
        stream.write(data.data);
    }
}
exports.MQTToTConnectRequestPacket = MQTToTConnectRequestPacket;
//# sourceMappingURL=mqttot.connect-request-packet.js.map