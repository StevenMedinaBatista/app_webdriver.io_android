/// <reference types="webdriverio/webdriverio-core" />
declare type MoveToOptions = {
    xOffset?: number;
    yOffset?: number;
};
export default function moveTo(this: WebdriverIO.Element, { xOffset, yOffset }?: MoveToOptions): Promise<void>;
export {};
//# sourceMappingURL=moveTo.d.ts.map