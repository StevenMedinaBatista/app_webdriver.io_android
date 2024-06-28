import type DevToolsDriver from '../devtoolsdriver';
export default function getElementProperty(this: DevToolsDriver, { elementId, name }: {
    elementId: string;
    name: string;
}): Promise<Record<string, unknown> | null>;
//# sourceMappingURL=getElementProperty.d.ts.map