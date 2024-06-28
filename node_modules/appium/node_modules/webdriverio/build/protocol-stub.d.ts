/// <reference types="webdriver" />
export default class ProtocolStub {
    static newSession(options?: WebDriver.Options): Promise<Record<string, any>>;
    static reloadSession(): void;
    static attachToSession(options?: WebDriver.AttachSessionOptions, modifier?: (...args: any[]) => any): Record<string, any>;
}
//# sourceMappingURL=protocol-stub.d.ts.map