/// <reference types="webdriver" />
export declare function isW3C(capabilities?: WebDriver.DesiredCapabilities): boolean;
export declare function capabilitiesEnvironmentDetector(capabilities: WebDriver.Capabilities, automationProtocol: string): {
    isChrome: boolean;
    isMobile: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    isSauce: boolean;
};
export declare function sessionEnvironmentDetector({ capabilities, requestedCapabilities }: {
    capabilities?: WebDriver.DesiredCapabilities;
    requestedCapabilities?: WebDriver.DesiredCapabilities | WebDriver.W3CCapabilities;
}): {
    isW3C: boolean;
    isChrome: boolean;
    isMobile: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    isSauce: boolean;
    isSeleniumStandalone: boolean;
};
export declare function devtoolsEnvironmentDetector({ browserName }: WebDriver.Capabilities): {
    isDevTools: boolean;
    isW3C: boolean;
    isMobile: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    isChrome: boolean;
    isSauce: boolean;
    isSeleniumStandalone: boolean;
};
export declare function webdriverEnvironmentDetector(capabilities: WebDriver.Capabilities): {
    isChrome: boolean;
    isMobile: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    isSauce: boolean;
};
//# sourceMappingURL=envDetector.d.ts.map