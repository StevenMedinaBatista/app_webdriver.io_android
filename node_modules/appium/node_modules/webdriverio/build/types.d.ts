/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
import type cssValue from 'css-value';
import type WebDriver from 'webdriver';
export declare type ElementReferenceId = 'element-6066-11e4-a52e-4f735466cecf';
export declare type ElementReference = Record<ElementReferenceId, string>;
export interface ElementObject extends ElementReference, WebdriverIO.BrowserObject {
    elementId: string;
    ELEMENT: string;
    selector?: Selector;
    index?: number;
    parent: ElementObject | WebdriverIO.BrowserObject;
    isReactElement?: boolean;
    error?: Error;
}
export declare type WaitForOptions = {
    timeout?: number;
    interval?: number;
    timeoutMsg?: string;
    reverse?: boolean;
};
export declare type ElementFunction = ((elem: HTMLElement) => WebDriver.ElementReference) | ((elem: HTMLElement) => WebDriver.ElementReference[]);
export declare type Selector = string | WebDriver.ElementReference | ElementFunction;
interface ParsedColor extends Partial<cssValue.CSSValue> {
    rgb?: string;
    rgba?: string;
}
export interface ParsedCSSValue {
    property?: string;
    value?: string;
    parsed: ParsedColor;
}
interface NoneActionEntity {
    type: 'pause';
    duration: number;
}
interface PointerActionEntity {
    type: 'pointerMove' | 'pointerDown' | 'pointerUp' | 'pointerCancel' | 'pause';
    duration?: number;
    x?: number;
    y?: number;
    button?: number;
}
interface KeyActionEntity {
    type: 'keyUp' | 'keyDown';
    duration?: number;
    value?: string;
}
export interface Action {
    id: string;
    actions: (NoneActionEntity & PointerActionEntity & KeyActionEntity)[];
    type?: 'pointer' | 'key';
    parameters?: {
        pointerType: 'mouse' | 'pen' | 'touch';
    };
}
export interface ActionParameter {
    actions: Action[];
}
export interface MultiRemoteOptions {
    [instanceName: string]: Options;
}
export interface Options extends Omit<WebDriver.Options, 'capabilities'> {
    capabilities?: WebDriver.DesiredCapabilities | WebDriver.W3CCapabilities;
    automationProtocol?: 'webdriver' | 'devtools' | './protocol-stub';
    baseUrl?: string;
    waitforTimeout?: number;
    waitforInterval?: number;
    region?: 'us' | 'eu' | 'us-west-1' | 'us-east-1' | 'eu-central-1';
    headless?: boolean;
    runner?: string;
}
export {};
//# sourceMappingURL=types.d.ts.map