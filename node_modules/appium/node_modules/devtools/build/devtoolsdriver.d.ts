/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
/// <reference types="@wdio/cucumber-framework" />
import type { Browser } from 'puppeteer-core/lib/cjs/puppeteer/common/Browser';
import type { Dialog } from 'puppeteer-core/lib/cjs/puppeteer/common/Dialog';
import type { Page } from 'puppeteer-core/lib/cjs/puppeteer/common/Page';
import type WDIOProtocols from '@wdio/protocols';
import ElementStore from './elementstore';
export default class DevToolsDriver {
    commands: Record<string, Function>;
    elementStore: ElementStore;
    windows: Map<string, Page>;
    timeouts: Map<string, number>;
    activeDialog?: Dialog;
    browser: Browser;
    currentFrame?: Page;
    currentWindowHandle?: string;
    currentFrameUrl?: string;
    constructor(browser: Browser, pages: Page[]);
    static requireCommand(filePath: string): any;
    register(commandInfo: WDIOProtocols.CommandEndpoint): (this: WebdriverIO.BrowserObject, ...args: any[]) => Promise<any>;
    dialogHandler(dialog: Dialog): void;
    framenavigatedHandler(frame: Page): void;
    setTimeouts(implicit?: number, pageLoad?: number, script?: number): void;
    getPageHandle(isInFrame?: boolean): Page;
    checkPendingNavigations(pendingNavigationStart?: number): Promise<void>;
}
//# sourceMappingURL=devtoolsdriver.d.ts.map