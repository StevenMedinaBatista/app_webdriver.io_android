"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const constants_1 = require("../../constants");
async function getPuppeteer() {
    var _a, _b, _c;
    if (this.puppeteer) {
        return this.puppeteer;
    }
    const chromiumOptions = this.capabilities['goog:chromeOptions'] || this.capabilities['ms:edgeOptions'];
    if (chromiumOptions && chromiumOptions.debuggerAddress) {
        this.puppeteer = await puppeteer_core_1.default.connect({
            browserURL: `http://${chromiumOptions.debuggerAddress}`,
            defaultViewport: null
        });
        return this.puppeteer;
    }
    if (((_a = this.capabilities.browserName) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'firefox') {
        if (!this.capabilities.browserVersion) {
            throw new Error('Can\'t find "browserVersion" in capabilities');
        }
        const majorVersion = parseInt(this.capabilities.browserVersion.split('.').shift() || '', 10);
        if (majorVersion >= 79) {
            const ffOptions = this.capabilities['moz:firefoxOptions'];
            const ffArgs = (_b = this.requestedCapabilities['moz:firefoxOptions']) === null || _b === void 0 ? void 0 : _b.args;
            const rdPort = ffOptions && ffOptions.debuggerAddress
                ? ffOptions.debuggerAddress
                : (_c = ffArgs === null || ffArgs === void 0 ? void 0 : ffArgs[ffArgs.findIndex((arg) => arg === constants_1.FF_REMOTE_DEBUG_ARG) + 1]) !== null && _c !== void 0 ? _c : null;
            if (!rdPort) {
                throw new Error('Could\'t find remote debug port in Firefox options');
            }
            this.puppeteer = await puppeteer_core_1.default.connect({
                browserURL: `http://localhost:${rdPort}`,
                defaultViewport: null
            });
            return this.puppeteer;
        }
    }
    throw new Error('Using DevTools capabilities is not supported for this session. ' +
        'This feature is only supported for local testing on Chrome, Firefox and Chromium Edge.');
}
exports.default = getPuppeteer;
