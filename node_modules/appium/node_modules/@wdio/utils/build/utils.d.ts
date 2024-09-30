/// <reference types="webdriverio/webdriverio-core" />
export declare function overwriteElementCommands(propertiesObject: {
    '__elementOverrides__'?: {
        value: any;
    };
    [key: string]: any;
}): void;
export declare function commandCallStructure(commandName: string, args: any[]): string;
export declare function transformCommandLogResult(result: {
    file?: string;
}): "\"<Screenshot[base64]>\"" | {
    file?: string | undefined;
};
export declare function isValidParameter(arg: any, expectedType: string): boolean;
export declare function getArgumentType(arg: any): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "null";
export declare function safeRequire(name: string): WebdriverIO.ServicePlugin | null;
export declare function isFunctionAsync(fn: Function): boolean;
export declare function filterSpecArgs(args: any[]): any[];
export declare function isBase64(str: string): boolean;
export declare const canAccess: (file: string) => boolean;
export declare const sleep: (ms?: number) => Promise<unknown>;
//# sourceMappingURL=utils.d.ts.map