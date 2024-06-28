"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const utils_1 = require("../../utils");
const isElementDisplayed_1 = __importDefault(require("../../scripts/isElementDisplayed"));
const noW3CEndpoint = ['microsoftedge', 'safari', 'chrome', 'safari technology preview'];
async function isDisplayed() {
    var _a;
    const browser = utils_1.getBrowserObject(this);
    if (!await utils_1.hasElementId(this)) {
        return false;
    }
    const useAtom = (browser.isDevTools ||
        (browser.isW3C &&
            !browser.isMobile &&
            noW3CEndpoint.includes((_a = browser.capabilities.browserName) === null || _a === void 0 ? void 0 : _a.toLowerCase())));
    return useAtom
        ? await browser.execute(isElementDisplayed_1.default, {
            [constants_1.ELEMENT_KEY]: this.elementId,
            ELEMENT: this.elementId
        }) :
        await this.isElementDisplayed(this.elementId);
}
exports.default = isDisplayed;
