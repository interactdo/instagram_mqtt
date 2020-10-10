"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IrisParser = void 0;
/*eslint @typescript-eslint/interface-name-prefix: "off" */
class IrisParser {
    parseMessage(topic, payload) {
        return JSON.parse(payload.toString('utf8')).map((x) => ({ topic, data: x }));
    }
}
exports.IrisParser = IrisParser;
//# sourceMappingURL=iris.parser.js.map