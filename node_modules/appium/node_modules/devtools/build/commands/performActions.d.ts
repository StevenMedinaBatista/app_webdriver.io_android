import type DevToolsDriver from '../devtoolsdriver';
interface Action {
    duration?: number;
    type: string;
    value?: string;
    x?: number;
    y?: number;
    button?: number;
    origin?: any;
}
interface ActionsParameter {
    type?: string;
    actions: Action[];
    parameters?: {
        pointerType?: string;
    };
}
export default function performActions(this: DevToolsDriver, { actions }: {
    actions: ActionsParameter[];
}): Promise<void>;
export {};
//# sourceMappingURL=performActions.d.ts.map