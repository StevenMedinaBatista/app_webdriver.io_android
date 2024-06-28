import type DevToolsDriver from '../devtoolsdriver';
export default function getElementAttribute(this: DevToolsDriver, { elementId, name }: {
    elementId: string;
    name: string;
}): Promise<string | null>;
//# sourceMappingURL=getElementAttribute.d.ts.map