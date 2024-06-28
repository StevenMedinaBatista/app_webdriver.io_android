/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
interface BrowserSize {
    width: number;
    height: number;
}
export default function getWindowSize(this: WebdriverIO.BrowserObject): Promise<BrowserSize>;
export {};
//# sourceMappingURL=getWindowSize.d.ts.map