import type DevToolsDriver from '../devtoolsdriver';
export default function executeScript(this: DevToolsDriver, { script, args }: {
    script: string;
    args: any[];
}): Promise<any>;
//# sourceMappingURL=executeScript.d.ts.map