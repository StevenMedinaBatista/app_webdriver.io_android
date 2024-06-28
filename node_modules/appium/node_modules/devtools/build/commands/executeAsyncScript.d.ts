import type DevToolsDriver from '../devtoolsdriver';
export default function executeAsyncScript(this: DevToolsDriver, { script, args }: {
    script: string;
    args: any[];
}): Promise<any>;
//# sourceMappingURL=executeAsyncScript.d.ts.map