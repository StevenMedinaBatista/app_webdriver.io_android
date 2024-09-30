export interface Priorities {
    regex: RegExp;
    weight: number;
}
declare function darwin(): string[];
declare function linux(): string[];
declare function win32(): string[];
declare const _default: {
    darwin: typeof darwin;
    linux: typeof linux;
    win32: typeof win32;
};
export default _default;
//# sourceMappingURL=firefox.d.ts.map