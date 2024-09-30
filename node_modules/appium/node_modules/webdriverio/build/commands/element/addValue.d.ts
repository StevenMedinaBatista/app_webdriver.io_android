/// <reference types="webdriverio/webdriverio-core" />
export declare type AddValueOptions = {
    translateToUnicode?: boolean;
};
export default function addValue(this: WebdriverIO.Element, value: string | number | boolean | object | Array<any>, { translateToUnicode }?: AddValueOptions): Promise<void>;
//# sourceMappingURL=addValue.d.ts.map