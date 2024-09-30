/// <reference types="webdriver" />
/// <reference types="node" />
import type DevToolsDriver from '../devtoolsdriver';
export default function newSession(this: DevToolsDriver, { capabilities }: {
    capabilities: WebDriver.Capabilities;
}): Promise<{
    sessionId: string;
    capabilities: {
        browserName: string;
        browserVersion: string;
        platformName: NodeJS.Platform;
        platformVersion: string;
    };
}>;
//# sourceMappingURL=newSession.d.ts.map