/// <reference types="node" />
import type DevToolsDriver from '../devtoolsdriver';
export default function takeElementScreenshot(this: DevToolsDriver, { elementId }: {
    elementId: string;
}): Promise<string | void | Buffer>;
//# sourceMappingURL=takeElementScreenshot.d.ts.map