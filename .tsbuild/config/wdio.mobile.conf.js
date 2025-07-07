"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const waitforTimeout = 30000;
const commandTimeout = 3000;
exports.config = {
    runner: 'local',
    port: 4724,
    specs: [
        './features/mobile/*.feature'
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
            maxInstances: 1,
            platformName: 'Android',
            platformVersion: '16.0',
            app: 'app/android.wdio.native.app.v1.0.8.apk',
            deviceName: 'Pixel 9',
            automationName: 'UiAutomator2',
            autoGrantPermissions: true,
            autoAcceptAlerts: true,
        }],
    logLevel: 'debug',
    bail: 0,
    waitforTimeout: waitforTimeout,
    connectionRetryTimeout: 60000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'cucumber',
    reporters: ['spec',
        ['allure', {
                outputDir: './allure-results',
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false,
                useCucumberStepReporter: true,
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
