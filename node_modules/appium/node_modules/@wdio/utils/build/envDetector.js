"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webdriverEnvironmentDetector = exports.devtoolsEnvironmentDetector = exports.sessionEnvironmentDetector = exports.capabilitiesEnvironmentDetector = exports.isW3C = void 0;
const MOBILE_BROWSER_NAMES = ['ipad', 'iphone', 'android'];
const MOBILE_CAPABILITIES = [
    'appium-version', 'appiumVersion', 'device-type', 'deviceType',
    'device-orientation', 'deviceOrientation', 'deviceName'
];
function isW3C(capabilities) {
    if (!capabilities) {
        return false;
    }
    const isAppium = Boolean(capabilities.automationName ||
        capabilities.deviceName ||
        capabilities.appiumVersion);
    const hasW3CCaps = Boolean(capabilities.platformName &&
        capabilities.browserVersion &&
        (capabilities.platformVersion || Object.prototype.hasOwnProperty.call(capabilities, 'setWindowRect')));
    return Boolean(hasW3CCaps || isAppium);
}
exports.isW3C = isW3C;
function isChrome(capabilities) {
    if (!capabilities) {
        return false;
    }
    return Boolean(capabilities.chrome || capabilities['goog:chromeOptions']);
}
function isMobile(capabilities) {
    if (!capabilities) {
        return false;
    }
    const browserName = (capabilities.browserName || '').toLowerCase();
    return Boolean(Object.keys(capabilities).find((cap) => MOBILE_CAPABILITIES.includes(cap)) ||
        capabilities.browserName === '' ||
        MOBILE_BROWSER_NAMES.includes(browserName));
}
function isIOS(capabilities) {
    if (!capabilities) {
        return false;
    }
    return Boolean((capabilities.platformName && capabilities.platformName.match(/iOS/i)) ||
        (capabilities.deviceName && capabilities.deviceName.match(/(iPad|iPhone)/i)));
}
function isAndroid(capabilities) {
    if (!capabilities) {
        return false;
    }
    return Boolean((capabilities.platformName && capabilities.platformName.match(/Android/i)) ||
        (capabilities.browserName && capabilities.browserName.match(/Android/i)));
}
function isSauce(capabilities) {
    if (!capabilities) {
        return false;
    }
    const caps = capabilities.alwaysMatch
        ? capabilities.alwaysMatch
        : capabilities;
    return Boolean(caps.extendedDebugging ||
        (caps['sauce:options'] &&
            caps['sauce:options'].extendedDebugging));
}
function isSeleniumStandalone(capabilities) {
    if (!capabilities) {
        return false;
    }
    return Boolean(capabilities['webdriver.remote.sessionid']);
}
function capabilitiesEnvironmentDetector(capabilities, automationProtocol) {
    return automationProtocol === 'devtools'
        ? devtoolsEnvironmentDetector(capabilities)
        : webdriverEnvironmentDetector(capabilities);
}
exports.capabilitiesEnvironmentDetector = capabilitiesEnvironmentDetector;
function sessionEnvironmentDetector({ capabilities, requestedCapabilities }) {
    return {
        isW3C: isW3C(capabilities),
        isChrome: isChrome(capabilities),
        isMobile: isMobile(capabilities),
        isIOS: isIOS(capabilities),
        isAndroid: isAndroid(capabilities),
        isSauce: isSauce(requestedCapabilities),
        isSeleniumStandalone: isSeleniumStandalone(capabilities)
    };
}
exports.sessionEnvironmentDetector = sessionEnvironmentDetector;
function devtoolsEnvironmentDetector({ browserName }) {
    return {
        isDevTools: true,
        isW3C: true,
        isMobile: false,
        isIOS: false,
        isAndroid: false,
        isChrome: browserName === 'chrome',
        isSauce: false,
        isSeleniumStandalone: false,
    };
}
exports.devtoolsEnvironmentDetector = devtoolsEnvironmentDetector;
function webdriverEnvironmentDetector(capabilities) {
    return {
        isChrome: isChrome(capabilities),
        isMobile: isMobile(capabilities),
        isIOS: isIOS(capabilities),
        isAndroid: isAndroid(capabilities),
        isSauce: isSauce(capabilities)
    };
}
exports.webdriverEnvironmentDetector = webdriverEnvironmentDetector;
