/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
/// <reference types="@wdio/cucumber-framework" />
export declare const elementErrorHandler: (fn: Function) => (commandName: string, commandFn: Function) => (this: WebdriverIO.Element, ...args: any[]) => any;
export declare const multiremoteHandler: (wrapCommand: Function) => (commandName: keyof WebdriverIO.BrowserObject) => any;
//# sourceMappingURL=middlewares.d.ts.map