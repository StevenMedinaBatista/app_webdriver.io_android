import { FlutterDriver } from '../../driver';
export declare const scroll: (self: FlutterDriver, elementBase64: string, opts: {
    dx: number;
    dy: number;
    durationMilliseconds: number;
    frequency?: number;
}) => Promise<any>;
export declare const longTap: (self: FlutterDriver, elementBase64: string, opts: {
    durationMilliseconds: number;
    frequency?: number;
}) => Promise<any>;
export declare const scrollUntilVisible: (self: FlutterDriver, elementBase64: string, opts: {
    item: string;
    alignment: number;
    dxScroll: number;
    dyScroll: number;
}) => Promise<any>;
export declare const scrollIntoView: (self: FlutterDriver, elementBase64: string, opts: {
    alignment: number;
}) => Promise<any>;
//# sourceMappingURL=scroll.d.ts.map