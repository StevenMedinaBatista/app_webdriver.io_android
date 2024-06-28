/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
/// <reference types="@wdio/cucumber-framework" />
import type { ElementReference, Selector } from '../types';
export declare const getElement: (this: WebdriverIO.BrowserObject | WebdriverIO.Element, selector?: string | Record<"element-6066-11e4-a52e-4f735466cecf", string> | ((elem: HTMLElement) => Record<"element-6066-11e4-a52e-4f735466cecf", string>) | ((elem: HTMLElement) => Record<"element-6066-11e4-a52e-4f735466cecf", string>[]) | undefined, res?: Error | Record<"element-6066-11e4-a52e-4f735466cecf", string> | undefined, isReactElement?: boolean) => WebdriverIO.Element;
export declare const getElements: (this: WebdriverIO.BrowserObject | WebdriverIO.Element, selector: Selector, elemResponse: ElementReference[], isReactElement?: boolean) => WebdriverIO.ElementArray;
//# sourceMappingURL=getElementObject.d.ts.map