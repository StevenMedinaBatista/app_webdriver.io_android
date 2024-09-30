import type DevToolsDriver from '../devtoolsdriver';
export default function getElementRect(this: DevToolsDriver, { elementId }: {
    elementId: string;
}): Promise<{
    x: number;
    y: number;
    width: number;
    height: number;
}>;
//# sourceMappingURL=getElementRect.d.ts.map