declare function darwin(): string[];
declare function linux(): string[];
declare function win32(): string[];
declare const _default: {
    darwin: typeof darwin;
    linux: typeof linux;
    win32: typeof win32;
};
export default _default;
//# sourceMappingURL=edge.d.ts.map