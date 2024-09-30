/// <reference types="@wdio/protocols" />
/// <reference types="webdriver" />
import type { Logger } from '@wdio/logger';
import type { ElementHandle } from 'puppeteer-core/lib/cjs/puppeteer/common/JSHandle';
import type { Browser } from 'puppeteer-core/lib/cjs/puppeteer/common/Browser';
import type { Frame } from 'puppeteer-core/lib/cjs/puppeteer/common/FrameManager';
import type { Page } from 'puppeteer-core/lib/cjs/puppeteer/common/Page';
import type { Priorities } from './finder/firefox';
import type DevToolsDriver from './devtoolsdriver';
export declare const validate: (command: string, parameters: WDIOProtocols.CommandParameters[], variables: WDIOProtocols.CommandPathVariables[], ref: string, args: any[]) => Record<string, any>;
export declare function getPrototype(commandWrapper: Function): Record<string, {
    value: Function;
}>;
export declare function findElement(this: DevToolsDriver, context: Frame | Page | ElementHandle, using: string, value: string): Promise<WebDriver.ElementReference | Error>;
export declare function findElements(this: DevToolsDriver, context: Page | Frame | ElementHandle, using: string, value: string): Promise<WebDriver.ElementReference[]>;
export declare function sanitizeError(err: Error): Error;
export declare function transformExecuteArgs(this: DevToolsDriver, args?: any[]): Promise<ElementHandle | any>;
export declare function transformExecuteResult(this: DevToolsDriver, page: Page, result: any | any[]): Promise<any>;
export declare function getStaleElementError(elementId: string): Error;
export declare function getPages(browser: Browser, retryInterval?: number): Promise<Page[]>;
export declare function sort(installations: string[], priorities: Priorities[]): string[];
export declare function uniq(arr: string[]): string[];
export declare function findByWhich(executables: string[], priorities: Priorities[]): string[];
export declare function patchDebug(scoppedLogger: Logger): void;
//# sourceMappingURL=utils.d.ts.map