"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const waitforTimeout = 70000;
exports.config = {
    runner: 'local',
    port: 443,
    specs: [
        './features/mobile/*.feature'
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
            "appium:app": 'bs://4e6dc05108e4d7f2c75aba6875e8fc0341f50661',
            "appium:deviceName": 'Samsung Galaxy S21',
            "appium:platformVersion": '12.0',
            "appium:automationName": 'UiAutomator2',
            "platformName": "Android",
            "bstack:options": {
                "osVersion": "11.0",
                "deviceName": "Samsung Galaxy S21",
                "realMobile": true,
                "appiumVersion": "1.21.0",
                "local": true
            },
        }],
    logLevel: 'error',
    bail: 0,
    waitforTimeout: waitforTimeout,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    user: 'lucianodegani_p2akEM',
    key: 'kLsoierqdEryUoyYfvTn',
    services: [
        ['browserstack', {
                browserstackLocal: true,
            }]
    ],
    framework: 'cucumber',
    reporters: [
        'spec',
        ['allure', {
                outputDir: './allure-results/',
                disableWebdriverStepsReporting: false,
                disableWebdriverScreenshotsReporting: false,
            }],
        ['junit', {
                outputDir: 'junit-report',
                outputFileFormat: (options) => {
                    return `results-${options.cid}.${options.capabilities.platformName}.xml`;
                },
            }]
    ],
    cucumberOpts: {
        require: ['./stepDefinitions/mobile/*.ts'],
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        format: ['pretty'],
        snippets: true,
        source: true,
        profile: [],
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false
    },
    afterStep: async function () {
        await browser.takeScreenshot();
    },
    afterScenario: async function () {
        await browser.closeApp();
        await browser.reset();
    },
};
