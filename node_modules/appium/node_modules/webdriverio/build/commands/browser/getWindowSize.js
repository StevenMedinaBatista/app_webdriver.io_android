"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
async function getWindowSize() {
    const browser = utils_1.getBrowserObject(this);
    if (!browser.isW3C) {
        return browser._getWindowSize();
    }
    const { width, height } = await browser.getWindowRect();
    return { width, height };
}
exports.default = getWindowSize;
