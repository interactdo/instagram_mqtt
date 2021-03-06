"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notUndefined = exports.debugChannel = exports.isJson = exports.tryUnzipSync = exports.tryUnzipAsync = exports.unzipAsync = exports.compressDeflate = exports.createUserAgent = void 0;
const zlib_1 = require("zlib");
const Bluebird = require("bluebird");
const debug_1 = require("debug");
// TODO: map
function createUserAgent(ig) {
    const [androidVersion, , resolution, manufacturer, deviceName] = ig.state.deviceString.split('; ');
    const [width, height] = resolution.split('x');
    const params = {
        FBAN: 'MQTT',
        FBAV: ig.state.appVersion,
        FBBV: ig.state.appVersionCode,
        FBDM: `{density=4.0,width=${width},height=${height}`,
        FBLC: ig.state.language,
        FBCR: 'Android',
        FBMF: manufacturer.trim(),
        FBBD: 'Android',
        FBPN: 'com.instagram.android',
        FBDV: deviceName.trim(),
        FBSV: androidVersion.split('/')[1],
        FBLR: '0',
        FBBK: '1',
        FBCA: 'x86:armeabi-v7a',
    };
    return `[${Object.entries(params)
        .map(p => p.join('/'))
        .join(';')}]`;
}
exports.createUserAgent = createUserAgent;
async function compressDeflate(data) {
    return Bluebird.fromCallback(cb => zlib_1.deflate(data, { level: 9 }, cb));
}
exports.compressDeflate = compressDeflate;
async function unzipAsync(data) {
    return Bluebird.fromCallback(cb => zlib_1.unzip(data, cb));
}
exports.unzipAsync = unzipAsync;
async function tryUnzipAsync(data) {
    try {
        if (data.readInt8(0) !== 0x78)
            return data;
        return unzipAsync(data);
    }
    catch (e) {
        return data;
    }
}
exports.tryUnzipAsync = tryUnzipAsync;
function tryUnzipSync(data) {
    try {
        if (data.readInt8(0) !== 0x78)
            return data;
        return zlib_1.unzipSync(data);
    }
    catch (e) {
        return data;
    }
}
exports.tryUnzipSync = tryUnzipSync;
function isJson(buffer) {
    return String.fromCharCode(buffer[0]).match(/[{[]/);
}
exports.isJson = isJson;
/**
 * Returns a debug function with a path starting with ig:mqtt
 * @param {string} path
 * @returns {(msg: string, ...additionalData: any) => void}
 */
exports.debugChannel = (...path) => debug_1.default(['ig', 'mqtt', ...path].join(':'));
function notUndefined(a) {
    return typeof a !== 'undefined';
}
exports.notUndefined = notUndefined;
//# sourceMappingURL=shared.js.map