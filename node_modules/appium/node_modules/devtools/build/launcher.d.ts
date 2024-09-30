/// <reference types="webdriver" />
import type { Browser } from 'puppeteer-core/lib/cjs/puppeteer/common/Browser';
interface DevToolsOptions {
    ignoreDefaultArgs?: string[] | boolean;
    headless?: boolean;
    defaultViewport?: {
        width: number;
        height: number;
    };
}
interface ExtendedCapabilities extends WebDriver.Capabilities {
    'wdio:devtoolsOptions'?: DevToolsOptions;
}
export default function launch(capabilities: ExtendedCapabilities): Promise<Browser>;
export {};
//# sourceMappingURL=launcher.d.ts.map