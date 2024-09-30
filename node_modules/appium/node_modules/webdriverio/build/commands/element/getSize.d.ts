/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriver" />
export default function getSize(this: WebdriverIO.Element, prop?: keyof WebDriver.RectReturn): Promise<number | {
    width: number | undefined;
    height: number | undefined;
} | undefined>;
//# sourceMappingURL=getSize.d.ts.map