/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
/// <reference types="@wdio/cucumber-framework" />
export default class Interception {
    url: string;
    filterOptions: WebdriverIO.MockFilterOptions;
    browser: WebdriverIO.BrowserObject;
    respondOverwrites: {
        overwrite?: WebdriverIO.MockOverwrite;
        params?: WebdriverIO.MockResponseParams;
        sticky?: boolean;
        errorReason?: string;
    }[];
    matches: WebdriverIO.Matches[];
    constructor(url: string, filterOptions: import("webdriverio").MockFilterOptions | undefined, browser: WebdriverIO.BrowserObject);
    get calls(): WebdriverIO.Matches[] | Promise<WebdriverIO.Matches[]>;
    waitForResponse({ timeout, interval, timeoutMsg, }?: WebdriverIO.WaitForOptions): Promise<boolean>;
}
//# sourceMappingURL=index.d.ts.map