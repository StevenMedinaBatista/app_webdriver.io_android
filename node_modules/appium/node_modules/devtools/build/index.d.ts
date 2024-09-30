/// <reference types="webdriver" />
/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
import { SUPPORTED_BROWSER } from './constants';
export declare const sessionMap: Map<any, any>;
export default class DevTools {
    static newSession(options?: WebDriver.Options, modifier?: Function, userPrototype?: {}, customCommandWrapper?: Function): Promise<any>;
    static reloadSession(instance: WebdriverIO.BrowserObject): Promise<string>;
    static attachToSession(): void;
}
export { SUPPORTED_BROWSER };
//# sourceMappingURL=index.d.ts.map