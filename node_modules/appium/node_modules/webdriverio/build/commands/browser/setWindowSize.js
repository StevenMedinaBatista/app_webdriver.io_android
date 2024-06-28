"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const minWindowSize = 0;
const maxWindowSize = Number.MAX_SAFE_INTEGER;
async function setWindowSize(width, height) {
    if (typeof width !== 'number' || typeof height !== 'number') {
        throw new Error('setWindowSize expects width and height of type number');
    }
    if (width < minWindowSize || width > maxWindowSize || height < minWindowSize || height > maxWindowSize) {
        throw new Error('setWindowSize expects width and height to be a number in the 0 to 2^31 − 1 range');
    }
    const browser = utils_1.getBrowserObject(this);
    return !browser.isW3C
        ? browser._setWindowSize(width, height)
        : browser.setWindowRect(null, null, width, height);
}
exports.default = setWindowSize;
