import type DevToolsDriver from '../devtoolsdriver';
export default function getWindowRect(this: DevToolsDriver): Promise<{
    width: number;
    height: number;
    x: number;
    y: number;
}>;
//# sourceMappingURL=getWindowRect.d.ts.map