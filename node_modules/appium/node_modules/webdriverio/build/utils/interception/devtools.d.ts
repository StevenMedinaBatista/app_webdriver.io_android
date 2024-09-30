/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="node" />
/// <reference types="webdriverio" />
/// <reference types="@wdio/cucumber-framework" />
import Interception from '.';
declare type RequestOptions = {
    requestId: string;
    responseCode?: number;
    responseHeaders?: Record<string, string>[];
    body?: string | WebdriverIO.JsonCompatible;
    errorReason?: string;
};
declare type ClientResponse = {
    body: string;
    base64Encoded?: boolean;
};
declare type Client = {
    send: (requestName: string, requestOptions: RequestOptions) => Promise<ClientResponse>;
};
declare type Event = {
    requestId: string;
    request: WebdriverIO.Matches & {
        mockedResponse: string | Buffer;
    };
    responseStatusCode?: number;
    responseHeaders: Record<string, string>[];
};
export default class DevtoolsInterception extends Interception {
    static handleRequestInterception(client: Client, mocks: Set<Interception>): (event: Event) => Promise<void | ClientResponse>;
    get calls(): import("webdriverio").Matches[];
    clear(): void;
    restore(): void;
    respond(overwrite: WebdriverIO.MockOverwrite, params?: WebdriverIO.MockResponseParams): void;
    respondOnce(overwrite: WebdriverIO.MockOverwrite, params?: WebdriverIO.MockResponseParams): void;
    abort(errorReason: string, sticky?: boolean): void;
    abortOnce(errorReason: string): void;
}
export {};
//# sourceMappingURL=devtools.d.ts.map