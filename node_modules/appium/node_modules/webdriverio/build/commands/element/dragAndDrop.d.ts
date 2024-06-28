/// <reference types="webdriverio/webdriverio-core" />
declare type DragAndDropOptions = {
    duration?: number;
};
declare type ElementCoordinates = {
    x?: number;
    y?: number;
};
export default function dragAndDrop(this: WebdriverIO.Element, target: WebdriverIO.Element | ElementCoordinates, { duration }?: DragAndDropOptions): Promise<void>;
export {};
//# sourceMappingURL=dragAndDrop.d.ts.map