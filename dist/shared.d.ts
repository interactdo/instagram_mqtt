/// <reference types="node" />
import { IgApiClient } from 'instagram-private-api';
export declare function createUserAgent(ig: IgApiClient): string;
export declare function compressDeflate(data: string | Buffer): Promise<Buffer>;
export declare function unzipAsync(data: string | Buffer): Promise<Buffer>;
export declare function tryUnzipAsync(data: Buffer): Promise<Buffer>;
export declare function tryUnzipSync(data: Buffer): Buffer;
export declare function isJson(buffer: Buffer): RegExpMatchArray | null;
/**
 * Returns a debug function with a path starting with ig:mqtt
 * @param {string} path
 * @returns {(msg: string, ...additionalData: any) => void}
 */
export declare const debugChannel: (...path: string[]) => (msg: string, ...additionalData: any) => void;
export declare function notUndefined<T>(a: T | undefined): a is T;
export declare type BigInteger = string | number | bigint;
