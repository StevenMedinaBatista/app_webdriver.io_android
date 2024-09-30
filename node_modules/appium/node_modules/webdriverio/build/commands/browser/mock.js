"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const devtools_1 = __importDefault(require("../../utils/interception/devtools"));
const webdriver_1 = __importDefault(require("../../utils/interception/webdriver"));
const utils_1 = require("../../utils");
const SESSION_MOCKS = {};
async function mock(url, filterOptions) {
    const NetworkInterception = this.isSauce ? webdriver_1.default : devtools_1.default;
    if (!this.isSauce) {
        await this.getPuppeteer();
    }
    const browser = utils_1.getBrowserObject(this);
    const handle = await browser.getWindowHandle();
    if (!SESSION_MOCKS[handle]) {
        SESSION_MOCKS[handle] = new Set();
    }
    if (SESSION_MOCKS[handle].size === 0 && !this.isSauce) {
        const pages = await this.puppeteer.pages();
        let page;
        for (let i = 0; i < pages.length && !page; i++) {
            const isHidden = await pages[i].evaluate(() => document.hidden);
            if (!isHidden) {
                page = pages[i];
            }
        }
        if (!page) {
            page = pages[0];
        }
        const client = await page.target().createCDPSession();
        await client.send('Fetch.enable', {
            patterns: [{ requestStage: 'Request' }, { requestStage: 'Response' }]
        });
        client.on('Fetch.requestPaused', NetworkInterception
            .handleRequestInterception(client, SESSION_MOCKS[handle]));
    }
    const networkInterception = new NetworkInterception(url, filterOptions, browser);
    SESSION_MOCKS[handle].add(networkInterception);
    if (this.isSauce) {
        await networkInterception.init();
    }
    return networkInterception;
}
exports.default = mock;
