/// <reference types="webdriverio/webdriverio-core" />
declare type ClickOptions = {
    button?: number | string;
    x?: number;
    y?: number;
};
export default function click(this: WebdriverIO.Element, options?: ClickOptions): Promise<void>;
export {};
//# sourceMappingURL=click.d.ts.map