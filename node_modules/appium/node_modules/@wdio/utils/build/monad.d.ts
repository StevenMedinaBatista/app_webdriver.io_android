interface PropertiesObject {
    [key: string]: PropertyDescriptor;
}
export default function WebDriver(options: Record<string, any>, modifier?: Function, propertiesObject?: PropertiesObject): {
    (this: void, sessionId: string, commandWrapper?: Function | undefined): any;
    lift(name: string, func: Function, proto: Record<string, any>, origCommand?: Function | undefined): void;
};
export {};
//# sourceMappingURL=monad.d.ts.map