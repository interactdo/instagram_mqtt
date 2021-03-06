import { IgApiClient } from 'instagram-private-api';
import { FbnsClient } from './fbns';
import { RealtimeClient, RealtimeClientInitOptions } from './realtime';
export interface StateHook<T> {
    name: string;
    onExport: (client: IgApiClientExt) => PromiseLike<T> | T;
    onImport: (data: T, client: IgApiClientExt) => PromiseLike<void> | void;
}
export declare class IgApiClientExt extends IgApiClient {
    protected sateHooks: StateHook<any>[];
    exportState(): Promise<string>;
    importState(state: string | object): Promise<void>;
    constructor();
    addStateHook(hook: StateHook<any>): void;
}
export declare type IgApiClientFbns = IgApiClientExt & {
    fbns: FbnsClient;
};
export declare type IgApiClientRealtime = IgApiClientExt & {
    realtime: RealtimeClient;
};
export declare type IgApiClientMQTT = IgApiClientFbns & IgApiClientRealtime;
export declare function withFbns(client: IgApiClient | IgApiClientExt): IgApiClientFbns;
export declare function withRealtime(client: IgApiClient | IgApiClientExt, initOptions?: RealtimeClientInitOptions): IgApiClientRealtime;
export declare function withFbnsAndRealtime(client: IgApiClient | IgApiClientExt, initOptions?: RealtimeClientInitOptions): IgApiClientMQTT;
