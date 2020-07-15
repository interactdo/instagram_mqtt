import { GraphQlMessage, IrisParserData, ParsedMessage } from './parsers';
import { AppPresenceEventWrapper, MessageSyncMessageWrapper, RealtimeSubDirectDataWrapper } from './messages';
import { Topic } from '../topic';
import { MqttMessage } from 'mqtts';
import { QueryIDs } from './subscriptions';

type ReceiveEvent<T> = [Topic<T>, ParsedMessage<T>[]?];
type QuerySub = {[x in keyof typeof QueryIDs]: string | Record<string, unknown>};
export type RealtimeClientEvents = MergedRealtimeSubPayloads & {
    error: Error;
    warning: Error;
    receive: ReceiveEvent<unknown>;
    receiveRaw: MqttMessage;
    close: [];
    disconnect: [];
    realtimeSub: ParsedMessage<GraphQlMessage>;
    direct: RealtimeSubDirectDataWrapper;
    iris: Partial<IrisParserData>;
    message: MessageSyncMessageWrapper;
    clientConfigUpdate: {
        client_config_update_event: {
            publish_id: string;
            client_config_name: string;
            backing: 'QE' | string;
            client_subscription_id: '17849856529644700' | string;
        };
    };
}

export type MergedRealtimeSubPayloads = {
    [x in keyof typeof QueryIDs]: string | Record<string, unknown>;
} & KnownRealtimeSubPayloads;
export type KnownRealtimeSubPayloads = {
    appPresence: AppPresenceEventWrapper;
}