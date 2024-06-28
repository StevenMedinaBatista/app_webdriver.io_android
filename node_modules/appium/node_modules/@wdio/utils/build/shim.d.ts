declare let hasWdioSyncSupport: boolean;
declare let runSync: (this: unknown, fn: Function, repeatTest: any, args: unknown[]) => (resolve: Function, reject: Function) => unknown;
interface Retries {
    limit: number;
    attempts: number;
}
declare let executeHooksWithArgs: <T>(hookName: string, hooks?: Function | Function[], args?: any[]) => Promise<(Error | T)[]>;
declare let runFnInFiberContext: (fn: Function) => (this: any, ...args: any[]) => Promise<any>;
declare let wrapCommand: <T>(commandName: string, fn: Function) => (...args: any) => Promise<T>;
declare function executeSyncFn(this: any, fn: Function, retries: Retries, args?: any[]): Promise<unknown>;
declare function executeAsync(this: any, fn: Function, retries: Retries, args?: any[]): Promise<unknown>;
declare let executeSync: typeof executeSyncFn;
export { executeHooksWithArgs, runFnInFiberContext, wrapCommand, hasWdioSyncSupport, executeSync, executeAsync, runSync };
//# sourceMappingURL=shim.d.ts.map