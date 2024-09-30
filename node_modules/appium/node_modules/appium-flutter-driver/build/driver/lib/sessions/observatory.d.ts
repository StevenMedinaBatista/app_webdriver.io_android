/// <reference types="node" />
import { URL } from 'url';
import { FlutterDriver } from '../driver';
import { IsolateSocket } from './isolate_socket';
export declare const connectSocket: (dartObservatoryURL: string, RETRY_BACKOFF?: any, MAX_RETRY_COUNT?: any) => Promise<IsolateSocket | null>;
export declare const executeElementCommand: (this: FlutterDriver, command: string, elementBase64?: string | undefined, extraArgs?: {}) => Promise<any>;
export declare const processLogToGetobservatory: (adbLogs: Array<{
    message: string;
}>) => URL;
//# sourceMappingURL=observatory.d.ts.map