/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
/// <reference types="@wdio/cucumber-framework" />
declare type EventEmitter = (args: any) => void;
export default class MultiRemote {
    instances: Record<string, WebdriverIO.BrowserObject>;
    baseInstance?: MultiRemoteDriver;
    sessionId?: string;
    addInstance(browserName: string, client: WebdriverIO.BrowserObject): Promise<import("webdriverio").BrowserObject>;
    modifier(wrapperClient: {
        options: WebdriverIO.RemoteOptions;
        commandList: string[];
    }): any;
    static elementWrapper(instances: Record<string, WebdriverIO.BrowserObject>, result: any, propertiesObject: Record<string, PropertyDescriptor>): any;
    commandWrapper(commandName: string): (...args: any) => Promise<unknown>;
}
interface MultiRemoteClient {
    (instanceName: string): WebdriverIO.BrowserObject;
}
export declare class MultiRemoteDriver implements Partial<MultiRemoteClient> {
    instances: string[];
    isMultiremote: true;
    __propertiesObject__: Record<string, PropertyDescriptor>;
    constructor(instances: Record<string, WebdriverIO.BrowserObject>, propertiesObject: Record<string, PropertyDescriptor>);
    on(this: WebdriverIO.MultiRemoteBrowserObject, eventName: string, emitter: EventEmitter): any;
    once(this: WebdriverIO.MultiRemoteBrowserObject, eventName: string, emitter: EventEmitter): any;
    emit(this: WebdriverIO.MultiRemoteBrowserObject, eventName: string, emitter: EventEmitter): boolean;
    eventNames(this: WebdriverIO.MultiRemoteBrowserObject): any;
    getMaxListeners(this: WebdriverIO.MultiRemoteBrowserObject): number;
    listenerCount(this: WebdriverIO.MultiRemoteBrowserObject, eventName: string): number;
    listeners(this: WebdriverIO.MultiRemoteBrowserObject, eventName: string): Function[];
    removeListener(this: WebdriverIO.MultiRemoteBrowserObject, eventName: string, emitter: EventEmitter): any;
    removeAllListeners(this: WebdriverIO.MultiRemoteBrowserObject, eventName: string): any;
}
export {};
//# sourceMappingURL=multiremote.d.ts.map