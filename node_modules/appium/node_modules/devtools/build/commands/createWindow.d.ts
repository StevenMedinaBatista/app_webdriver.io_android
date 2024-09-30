import type DevToolsDriver from '../devtoolsdriver';
export default function createWindow(this: DevToolsDriver, { type }: {
    type: 'window' | 'tab';
}): Promise<{
    handle: string;
    type: "tab" | "window";
}>;
//# sourceMappingURL=createWindow.d.ts.map