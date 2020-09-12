"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonParser {
    parseMessage(topic, payload) {
        return { topic, data: payload.length > 0 ? JSON.parse(payload.toString()) : {} };
    }
}
exports.JsonParser = JsonParser;
//# sourceMappingURL=json.parser.js.map