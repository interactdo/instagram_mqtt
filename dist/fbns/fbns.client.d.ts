import { IgApiClient } from 'instagram-private-api';
import { FbnsDeviceAuth } from './fbns.device-auth';
import { Subject } from 'rxjs';
import { FbnsMessageData, FbnsNotificationUnknown } from './fbns.types';
export declare class FbnsClient {
    private readonly ig;
    get auth(): FbnsDeviceAuth;
    set auth(value: FbnsDeviceAuth);
    private fbnsDebug;
    private client;
    private conn;
    private _auth;
    private safeDisconnect;
    push$: Subject<FbnsNotificationUnknown>;
    error$: Subject<Error>;
    warning$: Subject<Error>;
    auth$: Subject<FbnsDeviceAuth>;
    message$: Subject<FbnsMessageData>;
    logging$: Subject<{
        beacon_id: number;
    }>;
    pp$: Subject<string>;
    disconnect$: Subject<void>;
    constructor(ig: IgApiClient);
    buildConnection(): void;
    connect({ enableTrace, autoReconnect, }?: {
        enableTrace?: boolean;
        autoReconnect?: boolean;
    }): Promise<any>;
    disconnect(): Promise<void>;
    private handleMessage;
    sendPushRegister(token: string): Promise<any>;
    private static createNotificationFromJson;
}
