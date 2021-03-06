/// <reference types="node" />
import { IgApiClient } from 'instagram-private-api';
import { EventEmitter } from 'events';
import { IrisParserData, ParsedMessage } from './parsers';
import { Commands, DirectCommands } from './commands';
import { Topic } from '../topic';
import { AppPresenceEventWrapper, MessageSyncMessageWrapper, RealtimeSubDirectDataWrapper } from './messages';
import { MQTToTConnectionClientInfo } from '../mqttot';
import { MqttMessageOutgoing } from 'mqtts';
/**
 * TODO: update this to use rxjs
 * expected version: ^0.3
 */
export declare interface RealtimeClient {
    on(event: 'error', cb: (e: Error) => void): this;
    on(event: 'warning', cb: (e: any | Error) => void): this;
    on(event: 'receive', cb: (topic: Topic, messages?: ParsedMessage<any>[]) => void): this;
    on(event: 'close', cb: () => void): this;
    on(event: 'realtimeSub', cb: (message: ParsedMessage<any>) => void): this;
    on(event: 'direct', cb: (directData: RealtimeSubDirectDataWrapper) => void): this;
    on(event: 'iris', cb: (irisData: Partial<IrisParserData> & any) => void): this;
    on(event: 'message', cb: (message: MessageSyncMessageWrapper) => void): this;
    on(event: 'appPresence', cb: (data: AppPresenceEventWrapper) => void): this;
    on(event: 'clientConfigUpdate', cb: (data: {
        client_config_update_event: {
            publish_id: string;
            client_config_name: string;
            backing: 'QE' | string;
            client_subscription_id: '17849856529644700' | string;
        };
    }) => void): this;
    on(event: string, cb: (...args: any[]) => void): this;
}
export interface RealtimeClientInitOptions {
    graphQlSubs?: string[];
    skywalkerSubs?: string[];
    irisData?: {
        seq_id: number;
        snapshot_at_ms: number;
    };
    connectOverrides?: MQTToTConnectionClientInfo;
    enableTrace?: boolean;
    autoReconnect?: boolean;
}
export declare class RealtimeClient extends EventEmitter {
    private realtimeDebug;
    private client;
    private connection;
    private readonly ig;
    private initOptions;
    private safeDisconnect;
    commands: Commands;
    direct: DirectCommands;
    /**
     *
     * @param {IgApiClient} ig
     * @param {RealtimeClientInitOptions | string[]} initOptions string array is deprecated
     */
    constructor(ig: IgApiClient, initOptions?: RealtimeClientInitOptions | string[]);
    private setInitOptions;
    private constructConnection;
    connect(initOptions?: RealtimeClientInitOptions | string[]): Promise<unknown>;
    private emitError;
    private emitWarning;
    disconnect(): Promise<void>;
    subscribe: (subs: string | string[]) => Promise<MqttMessageOutgoing>;
    graphQlSubscribe(sub: string | string[]): Promise<MqttMessageOutgoing>;
    skywalkerSubscribe(sub: string | string[]): Promise<MqttMessageOutgoing>;
    irisSubscribe({ seq_id, snapshot_at_ms }: {
        seq_id: number;
        snapshot_at_ms: number;
    }): Promise<MqttMessageOutgoing>;
    private handleRealtimeSub;
    protected emitDirectEvent(parsed: any): void;
    private handleMessageSync;
}
