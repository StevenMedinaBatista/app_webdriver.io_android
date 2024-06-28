/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
/// <reference types="@wdio/cucumber-framework" />
interface FormattedTouchAction extends Omit<WebdriverIO.TouchAction, 'element'> {
    element?: string;
}
interface FormattedActions {
    action: string;
    options?: FormattedTouchAction;
}
export declare const formatArgs: (scope: WebdriverIO.BrowserObject | WebdriverIO.Element, actions: WebdriverIO.TouchActions[]) => FormattedActions[];
export declare const validateParameters: (params: FormattedActions) => void;
export declare const touchAction: (this: WebdriverIO.Element, actions: WebdriverIO.TouchActions) => void;
export {};
//# sourceMappingURL=constant.d.ts.map