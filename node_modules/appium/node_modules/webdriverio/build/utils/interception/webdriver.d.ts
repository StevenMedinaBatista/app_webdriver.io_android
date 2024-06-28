/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
/// <reference types="@wdio/cucumber-framework" />
import Interception from '.';
export default class WebDriverInterception extends Interception {
    mockId?: string;
    init(): Promise<void>;
    get calls(): Promise<import("webdriverio").Matches[]>;
    clear(): Promise<void>;
    restore(): Promise<void>;
    respond(overwrite: WebdriverIO.MockOverwrite, params?: WebdriverIO.MockResponseParams): Promise<void>;
    respondOnce(overwrite: WebdriverIO.MockOverwrite, params?: WebdriverIO.MockResponseParams): Promise<void>;
    abort(errorReason: string, sticky?: boolean): Promise<void>;
    abortOnce(errorReason: string): Promise<void>;
}
//# sourceMappingURL=webdriver.d.ts.map