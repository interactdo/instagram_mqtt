"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FbnsClient = void 0;
const constants_1 = require("../constants");
const fbns_device_auth_1 = require("./fbns.device-auth");
const shared_1 = require("../shared");
const mqttot_1 = require("../mqttot");
const chance_1 = require("chance");
const querystring = require("querystring");
const URL = require("url");
const rxjs_1 = require("rxjs");
const mqtts_1 = require("mqtts");
const operators_1 = require("rxjs/operators");
const errors_1 = require("../errors");
class FbnsClient {
    constructor(ig) {
        this.ig = ig;
        this.fbnsDebug = shared_1.debugChannel('fbns');
        this.safeDisconnect = false;
        // general push
        this.push$ = new rxjs_1.Subject();
        this.error$ = new rxjs_1.Subject();
        this.warning$ = new rxjs_1.Subject();
        this.auth$ = new rxjs_1.Subject();
        // message without fbpushnotif
        this.message$ = new rxjs_1.Subject();
        this.logging$ = new rxjs_1.Subject();
        this.pp$ = new rxjs_1.Subject();
        this.disconnect$ = new rxjs_1.Subject();
        this._auth = new fbns_device_auth_1.FbnsDeviceAuth(this.ig);
    }
    get auth() {
        return this._auth;
    }
    set auth(value) {
        this._auth = value;
    }
    buildConnection() {
        this.fbnsDebug('Constructing connection');
        this.conn = new mqttot_1.MQTToTConnection({
            clientIdentifier: this._auth.clientId,
            clientInfo: {
                userId: BigInt(this._auth.userId),
                userAgent: shared_1.createUserAgent(this.ig),
                clientCapabilities: 183,
                endpointCapabilities: 128,
                publishFormat: 1,
                noAutomaticForeground: true,
                makeUserAvailableInForeground: false,
                deviceId: this._auth.deviceId,
                isInitiallyForeground: false,
                networkType: 1,
                networkSubtype: 0,
                clientMqttSessionId: BigInt(Date.now()) & BigInt(0xffffffff),
                subscribeTopics: [76, 80, 231],
                clientType: 'device_auth',
                appId: BigInt(567310203415052),
                deviceSecret: this._auth.deviceSecret,
                anotherUnknown: BigInt(-1),
                clientStack: 3,
            },
            password: this._auth.password,
        });
    }
    async connect({ enableTrace, autoReconnect, } = {}) {
        this.fbnsDebug('Connecting to FBNS...');
        this.auth.update();
        this.client = new mqttot_1.MQTToTClient({
            url: constants_1.FBNS.HOST_NAME_V6,
            payloadProvider: () => {
                this.buildConnection();
                return shared_1.compressDeflate(this.conn.toThrift());
            },
            enableTrace,
            autoReconnect: autoReconnect !== null && autoReconnect !== void 0 ? autoReconnect : true,
            requirePayload: true,
        });
        this.client.$warning.subscribe(this.warning$);
        this.client.$error.subscribe(this.error$);
        this.client.$disconnect.subscribe(() => {
            if (this.safeDisconnect)
                this.disconnect$.next();
            else {
                this.error$.next(new errors_1.ClientDisconnectedError('MQTToTClient got disconnected.'));
                this.disconnect$.next();
            }
        });
        this.client
            .listen({ topic: constants_1.FbnsTopics.FBNS_MESSAGE.id })
            .subscribe(msg => this.handleMessage(msg));
        this.client
            .listen({ topic: constants_1.FbnsTopics.FBNS_EXP_LOGGING.id })
            .subscribe(async (msg) => this.logging$.next(JSON.parse((await shared_1.tryUnzipAsync(msg.payload)).toString('utf8'))));
        this.client
            .listen({ topic: constants_1.FbnsTopics.PP.id })
            .subscribe(msg => this.pp$.next(msg.payload.toString('utf8')));
        this.client.$connect.subscribe(async (res) => {
            var _a;
            this.fbnsDebug('Connected to MQTT');
            if (!((_a = res.payload) === null || _a === void 0 ? void 0 : _a.length)) {
                this.fbnsDebug(`Received empty connect packet. Reason: ${res.errorName}; Try resetting your fbns state!`);
                this.error$.next(new errors_1.EmptyPacketError('Received empty connect packet. Try resetting your fbns state!'));
                await this.client.disconnect();
                return;
            }
            const payload = res.payload.toString('utf8');
            this.fbnsDebug(`Received auth: ${payload}`);
            this._auth.read(payload);
            this.auth$.next(this.auth);
            mqtts_1.MqttPacket.generateIdentifier();
            await this.client.mqttotPublish({
                topic: constants_1.FbnsTopics.FBNS_REG_REQ.id,
                payload: Buffer.from(JSON.stringify({
                    pkg_name: constants_1.INSTAGRAM_PACKAGE_NAME,
                    appid: this.ig.state.fbAnalyticsApplicationId,
                }), 'utf8'),
                qosLevel: 1,
            });
            // this.buildConnection(); ?
        });
        await this.client
            .connect({
            keepAlive: 60,
            protocolLevel: 3,
            clean: true,
            connectDelay: 60 * 1000,
        })
            .catch(e => {
            this.fbnsDebug(`Connection failed: ${e}`);
            throw e;
        });
        await this.client.subscribe({ topic: constants_1.FbnsTopics.FBNS_MESSAGE.id });
        return await this.client
            .listen({ topic: constants_1.FbnsTopics.FBNS_REG_RESP.id })
            .pipe(operators_1.first())
            .toPromise()
            .then(async (msg) => {
            const data = await shared_1.tryUnzipAsync(msg.payload);
            const payload = data.toString('utf8');
            this.fbnsDebug(`Received register response: ${payload}`);
            const { token, error } = JSON.parse(payload);
            if (error) {
                this.error$.next(error);
                throw error;
            }
            try {
                await this.sendPushRegister(token);
            }
            catch (e) {
                this.error$.next(e);
                throw e;
            }
        });
    }
    disconnect() {
        this.safeDisconnect = true;
        return this.client.disconnect();
    }
    async handleMessage(msg) {
        const payload = JSON.parse((await shared_1.tryUnzipAsync(msg.payload)).toString('utf8'));
        if (shared_1.notUndefined(payload.fbpushnotif)) {
            const notification = FbnsClient.createNotificationFromJson(payload.fbpushnotif);
            this.push$.next(notification);
        }
        else {
            this.fbnsDebug(`Received a message without 'fbpushnotif': ${JSON.stringify(payload)}`);
            this.message$.next(JSON.parse((await shared_1.tryUnzipAsync(msg.payload)).toString('utf8')));
        }
    }
    async sendPushRegister(token) {
        const { body } = await this.ig.request.send({
            url: `/api/v1/push/register/`,
            method: 'POST',
            form: {
                device_type: 'android_mqtt',
                is_main_push_channel: true,
                device_sub_type: 2,
                device_token: token,
                _csrftoken: this.ig.state.cookieCsrfToken,
                guid: this.ig.state.uuid,
                uuid: this.ig.state.uuid,
                users: this.ig.state.cookieUserId,
                family_device_id: new chance_1.Chance().guid({ version: 4 }),
            },
        });
        return body;
    }
    static createNotificationFromJson(json) {
        const data = JSON.parse(json);
        const notification = Object.defineProperty({}, 'description', {
            enumerable: false,
            value: data,
        });
        if (shared_1.notUndefined(data.t)) {
            notification.title = data.t;
        }
        if (shared_1.notUndefined(data.m)) {
            notification.message = data.m;
        }
        if (shared_1.notUndefined(data.tt)) {
            notification.tickerText = data.tt;
        }
        if (shared_1.notUndefined(data.ig)) {
            notification.igAction = data.ig;
            const url = URL.parse(data.ig);
            if (url.pathname) {
                notification.actionPath = url.pathname;
            }
            if (url.query) {
                notification.actionParams = querystring.decode(url.query);
            }
        }
        if (shared_1.notUndefined(data.collapse_key)) {
            notification.collapseKey = data.collapse_key;
        }
        if (shared_1.notUndefined(data.i)) {
            notification.optionalImage = data.i;
        }
        if (shared_1.notUndefined(data.a)) {
            notification.optionalAvatarUrl = data.a;
        }
        if (shared_1.notUndefined(data.sound)) {
            notification.sound = data.sound;
        }
        if (shared_1.notUndefined(data.pi)) {
            notification.pushId = data.pi;
        }
        if (shared_1.notUndefined(data.c)) {
            notification.pushCategory = data.c;
        }
        if (shared_1.notUndefined(data.u)) {
            notification.intendedRecipientUserId = data.u;
        }
        if (shared_1.notUndefined(data.s) && data.s !== 'None') {
            notification.sourceUserId = data.s;
        }
        if (shared_1.notUndefined(data.igo)) {
            notification.igActionOverride = data.igo;
        }
        if (shared_1.notUndefined(data.bc)) {
            const badgeCount = {};
            const parsed = JSON.parse(data.bc);
            if (shared_1.notUndefined(parsed.di)) {
                badgeCount.direct = parsed.di;
            }
            if (shared_1.notUndefined(parsed.ds)) {
                badgeCount.ds = parsed.ds;
            }
            if (shared_1.notUndefined(parsed.ac)) {
                badgeCount.activities = parsed.ac;
            }
            notification.badgeCount = badgeCount;
        }
        if (shared_1.notUndefined(data.ia)) {
            notification.inAppActors = data.ia;
        }
        return notification;
    }
}
exports.FbnsClient = FbnsClient;
//# sourceMappingURL=fbns.client.js.map