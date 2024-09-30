/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriver" />
export declare function initialiseLauncherService(config: Omit<WebdriverIO.Config, 'capabilities' | keyof WebdriverIO.HookFunctions>, caps: WebDriver.DesiredCapabilities): {
    ignoredWorkerServices: string[];
    launcherServices: WebdriverIO.ServiceInstance[];
};
export declare function initialiseWorkerService(config: WebdriverIO.Config, caps: WebDriver.DesiredCapabilities, ignoredWorkerServices?: string[]): WebdriverIO.ServiceInstance[];
//# sourceMappingURL=initialiseServices.d.ts.map