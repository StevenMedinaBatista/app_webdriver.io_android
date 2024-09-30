/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
/// <reference types="webdriver" />
/// <reference types="@wdio/cucumber-framework" />
import type { ElementReference, Selector, ParsedCSSValue, Options } from '../types';
export declare const getPrototype: (scope: 'browser' | 'element') => Record<string, PropertyDescriptor>;
export declare const getElementFromResponse: (res: ElementReference) => any;
export declare function getBrowserObject(elem: WebdriverIO.Element | WebdriverIO.BrowserObject): WebdriverIO.BrowserObject;
export declare function transformToCharString(value: any, translateToUnicode?: boolean): string[];
export declare function parseCSS(cssPropertyValue: string, cssProperty?: string): ParsedCSSValue;
export declare function checkUnicode(value: string, isDevTools?: boolean): string[];
export declare function findElement(this: WebdriverIO.Element, selector: Selector): Promise<Error | Record<"element-6066-11e4-a52e-4f735466cecf", string>>;
export declare function findElements(this: WebdriverIO.Element, selector: Selector): Promise<Record<"element-6066-11e4-a52e-4f735466cecf", string>[]>;
export declare function verifyArgsAndStripIfElement(args: any): any;
export declare function getElementRect(scope: WebdriverIO.Element): Promise<WebDriver.RectReturn>;
export declare function getAbsoluteFilepath(filepath: string): string;
export declare function assertDirectoryExists(filepath: string): void;
export declare function validateUrl(url: string, origError?: Error): string;
export declare function getScrollPosition(scope: WebdriverIO.Element): Promise<{
    scrollX: number;
    scrollY: number;
}>;
export declare function hasElementId(element: WebdriverIO.Element): Promise<boolean>;
export declare function addLocatorStrategyHandler(scope: WebdriverIO.BrowserObject): (name: string, script: () => ElementReference | ElementReference[]) => void;
export declare const enhanceElementsArray: (elements: WebdriverIO.ElementArray, parent: WebdriverIO.BrowserObject | WebdriverIO.Element, selector: string, foundWith?: string, props?: any[]) => import("webdriverio").ElementArray;
export declare const isStub: (automationProtocol?: string | undefined) => boolean;
export declare const getAutomationProtocol: (config: Options) => Promise<"webdriver" | "devtools" | "./protocol-stub">;
export declare const updateCapabilities: (params: Options, automationProtocol?: string | undefined) => Promise<void>;
export declare const containsHeaderObject: (base: Record<string, string>, match: Record<string, string>) => boolean;
//# sourceMappingURL=index.d.ts.map