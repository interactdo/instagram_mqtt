"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeClient = void 0;
const constants_1 = require("../constants");
const events_1 = require("events");
const commands_1 = require("./commands");
const thrift_1 = require("../thrift");
const shared_1 = require("../shared");
const mqttot_1 = require("../mqttot");
const subscriptions_1 = require("./subscriptions");
const util_1 = require("util");
const operators_1 = require("rxjs/operators");
const errors_1 = require("../errors");
class RealtimeClient extends events_1.EventEmitter {
    /**
     *
     * @param {IgApiClient} ig
     * @param {RealtimeClientInitOptions | string[]} initOptions string array is deprecated
     */
    constructor(ig, initOptions) {
        super();
        this.realtimeDebug = shared_1.debugChannel('realtime');
        this.safeDisconnect = false;
        this.emitError = (e) => this.emit('error', e);
        this.emitWarning = (e) => this.emit('warning', e);
        this.subscribe = util_1.deprecate((subs) => this.graphQlSubscribe(subs), 'Use RealtimeClient.graphQlSubscribe instead');
        this.ig = ig;
        this.setInitOptions(initOptions);
    }
    setInitOptions(initOptions) {
        if (Array.isArray(initOptions))
            initOptions = { graphQlSubs: initOptions };
        this.initOptions = {
            graphQlSubs: [],
            skywalkerSubs: [],
            ...(initOptions || {}),
        };
    }
    constructConnection() {
        const userAgent = this.ig.state.appUserAgent;
        const deviceId = this.ig.state.phoneId;
        const password = `sessionid=${this.ig.state.extractCookieValue('sessionid')}`;
        this.connection = new mqttot_1.MQTToTConnection({
            clientIdentifier: deviceId.substring(0, 20),
            clientInfo: {
                userId: BigInt(Number(this.ig.state.cookieUserId)),
                userAgent,
                clientCapabilities: 183,
                endpointCapabilities: 0,
                publishFormat: 1,
                noAutomaticForeground: false,
                makeUserAvailableInForeground: true,
                deviceId,
                isInitiallyForeground: true,
                networkType: 1,
                networkSubtype: 0,
                clientMqttSessionId: BigInt(Date.now()) & BigInt(0xffffffff),
                subscribeTopics: [88, 135, 149, 150, 133, 146],
                clientType: 'cookie_auth',
                appId: BigInt(567067343352427),
                deviceSecret: '',
                clientStack: 3,
                ...(this.initOptions.connectOverrides || {}),
            },
            password,
            appSpecificInfo: {
                app_version: this.ig.state.appVersion,
                'X-IG-Capabilities': this.ig.state.capabilitiesHeader,
                everclear_subscriptions: '{' +
                    '"inapp_notification_subscribe_comment":"17899377895239777",' +
                    '"inapp_notification_subscribe_comment_mention_and_reply":"17899377895239777",' +
                    '"video_call_participant_state_delivery":"17977239895057311",' +
                    '"presence_subscribe":"17846944882223835"' +
                    '}',
                'User-Agent': userAgent,
                'Accept-Language': this.ig.state.language.replace('_', '-'),
                platform: 'android',
                ig_mqtt_route: 'django',
                pubsub_msg_type_blacklist: 'direct, typing_type',
                auth_cache_enabled: '0',
            },
        });
    }
    async connect(initOptions) {
        var _a;
        this.realtimeDebug('Connecting to realtime-broker...');
        this.setInitOptions(initOptions);
        this.realtimeDebug(`Overriding: ${Object.keys(this.initOptions.connectOverrides || {}).join(', ')}`);
        this.client = new mqttot_1.MQTToTClient({
            url: constants_1.REALTIME.HOST_NAME_V6,
            payloadProvider: () => {
                this.constructConnection();
                return shared_1.compressDeflate(this.connection.toThrift());
            },
            enableTrace: this.initOptions.enableTrace,
            autoReconnect: (_a = this.initOptions.autoReconnect) !== null && _a !== void 0 ? _a : true,
            requirePayload: false,
        });
        this.commands = new commands_1.Commands(this.client);
        this.direct = new commands_1.DirectCommands(this.client);
        const topicsArray = Object.values(constants_1.Topics);
        this.client.$message
            .pipe(operators_1.filter(m => {
            if (m.payload === null) {
                this.realtimeDebug(`Received empty packet on topic ${m.topic}`);
                this.emit('receive', m.topic, m.payload);
                return false;
            }
            return true;
        }))
            .subscribe(async (packet) => {
            const unzipped = await shared_1.tryUnzipAsync(packet.payload);
            const topic = topicsArray.find(t => t.id === packet.topic);
            // @ts-ignore -- noParse may exist
            if (topic && topic.parser && !topic.noParse) {
                const parsedMessages = topic.parser.parseMessage(topic, unzipped);
                this.emit('receive', topic, parsedMessages);
            }
            else {
                try {
                    this.emit('receive', topic, shared_1.isJson(unzipped) ? unzipped.toString() : thrift_1.thriftRead(unzipped));
                }
                catch (e) {
                    this.realtimeDebug(`Error while reading packet: ${JSON.stringify({
                        topic: packet.topic,
                        unzipped: unzipped.toString('hex'),
                    })}`);
                    this.realtimeDebug(e);
                    this.emitWarning(e);
                    this.emit('receive', topic, unzipped.toString('utf8'));
                }
            }
        });
        {
            const { MESSAGE_SYNC, REALTIME_SUB } = constants_1.Topics;
            this.client
                .listen({
                topic: REALTIME_SUB.id,
                transformer: ({ payload }) => REALTIME_SUB.parser.parseMessage(REALTIME_SUB, shared_1.tryUnzipSync(payload)),
            })
                .subscribe(data => this.handleRealtimeSub(data));
            this.client
                .listen({
                topic: MESSAGE_SYNC.id,
                transformer: ({ payload }) => MESSAGE_SYNC.parser.parseMessage(MESSAGE_SYNC, shared_1.tryUnzipSync(payload)).map(msg => msg.data),
            })
                .subscribe(data => this.handleMessageSync(data));
        }
        this.client.$error.subscribe(e => this.emitError(e));
        this.client.$warning.subscribe(w => this.emitWarning(w));
        this.client.$disconnect.subscribe(() => {
            if (this.safeDisconnect)
                this.emit('disconnect');
            else {
                this.emitError(new errors_1.ClientDisconnectedError('MQTToTClient got disconnected.'));
                this.emit('disconnect');
            }
        });
        return new Promise((resolve, reject) => {
            this.client.$connect.subscribe(async () => {
                this.realtimeDebug('Connected. Checking initial subs.');
                const { graphQlSubs, skywalkerSubs, irisData } = this.initOptions;
                await Promise.all([
                    graphQlSubs && graphQlSubs.length > 0 ? this.graphQlSubscribe(graphQlSubs) : null,
                    skywalkerSubs && skywalkerSubs.length > 0 ? this.skywalkerSubscribe(skywalkerSubs) : null,
                    irisData ? this.irisSubscribe(irisData) : null,
                ]).then(resolve);
            });
            this.client
                .connect({
                keepAlive: 20,
                protocolLevel: 3,
                clean: true,
                connectDelay: 60 * 1000,
            })
                .catch(e => {
                this.emitError(e);
                reject(e);
            });
        });
    }
    disconnect() {
        this.safeDisconnect = true;
        return this.client.disconnect();
    }
    graphQlSubscribe(sub) {
        sub = typeof sub === 'string' ? [sub] : sub;
        this.realtimeDebug(`Subscribing with GraphQL to ${sub.join(', ')}`);
        return this.commands.updateSubscriptions({
            topic: constants_1.Topics.REALTIME_SUB,
            data: {
                sub,
            },
        });
    }
    skywalkerSubscribe(sub) {
        sub = typeof sub === 'string' ? [sub] : sub;
        this.realtimeDebug(`Subscribing with Skywalker to ${sub.join(', ')}`);
        return this.commands.updateSubscriptions({
            topic: constants_1.Topics.PUBSUB,
            data: {
                sub,
            },
        });
    }
    irisSubscribe({ seq_id, snapshot_at_ms }) {
        this.realtimeDebug(`Iris Sub to: seqId: ${seq_id}, snapshot: ${snapshot_at_ms}`);
        return this.commands.updateSubscriptions({
            topic: constants_1.Topics.IRIS_SUB,
            data: {
                seq_id,
                snapshot_at_ms,
            },
        });
    }
    handleRealtimeSub({ data, topic: messageTopic }) {
        const { message } = data;
        this.emit('realtimeSub', { data, messageTopic });
        if (typeof message === 'string') {
            this.emitDirectEvent(JSON.parse(message));
        }
        else {
            const { topic, payload, json } = message;
            switch (topic) {
                case 'direct': {
                    this.emitDirectEvent(json);
                    break;
                }
                default: {
                    const entries = Object.entries(subscriptions_1.QueryIDs);
                    const query = entries.find(e => e[1] === topic);
                    if (query) {
                        this.emit(query[0], json || payload);
                    }
                }
            }
        }
    }
    emitDirectEvent(parsed) {
        parsed.data = parsed.data.map((e) => {
            if (typeof e.value === 'string') {
                e.value = JSON.parse(e.value);
            }
            return e;
        });
        parsed.data.forEach((data) => this.emit('direct', data));
    }
    handleMessageSync(syncData) {
        for (const element of syncData) {
            const data = element.data;
            delete element.data;
            data.forEach(e => {
                if (e.path && e.value) {
                    if (e.path.startsWith('/direct_v2/threads/')) {
                        const [, , , thread_id] = e.path.split('/');
                        this.emit('message', {
                            ...element,
                            message: {
                                path: e.path,
                                op: e.op,
                                thread_id,
                                ...JSON.parse(e.value),
                            },
                        });
                    }
                }
                else {
                    this.emit('iris', { ...element, ...e });
                }
            });
        }
    }
}
exports.RealtimeClient = RealtimeClient;
//# sourceMappingURL=realtime.client.js.map