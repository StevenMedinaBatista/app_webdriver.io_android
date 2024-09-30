"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    runner: 'local',
    port: 4724,
    specs: [
        './features/web/*.feature'
    ],
    exclude: [],
    maxInstances: 10,
    capabilities: [{
            maxInstances: 5,
            browserName: 'chrome',
            acceptInsecureCerts: true
        }],
    logLevel: 'debug',
    bail: 0,
    baseUrl: 'https://www.google.com.ar',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['chromedriver'],
    framework: 'cucumber',
    reporters: [
        'spec',
        ['allure', {
                outputDir: './allure-results/',
            }],
        ['junit', {
                outputDir: 'junit-report',
                outputFileFormat: function (options) {
                    return `results-${options.cid}.${options.capabilities.browserName}.xml`;
                }
            }]
    ],
    cucumberOpts: {
        require: ['./stepDefinitions/web/*.ts'],
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
};
