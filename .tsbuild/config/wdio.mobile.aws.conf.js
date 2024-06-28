"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const waitforTimeout = 50000;
exports.config = {
    runner: 'local',
    port: 4723,
    specs: [
        './features/mobile/*.feature'
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
            maxInstances: 1,
            autoGrantPermissions: true,
            autoAcceptAlerts: true,
            language: "es",
            locale: "LA",
        }],
    logLevel: 'debug',
    bail: 0,
    path: '/wd/hub',
    waitforTimeout: waitforTimeout,
    connectionRetryTimeout: 60000,
    connectionRetryCount: 3,
    services: [],
    framework: 'cucumber',
    reporters: ['spec',
        ['allure', {
                outputDir: './allure-results/',
                disableWebdriverStepsReporting: false,
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
    afterStep: async function (step, scenario, result) {
        await browser.takeScreenshot();
    },
    afterScenario: async function (world, result) {
        await browser.closeApp();
        await browser.reset();
    },
};
