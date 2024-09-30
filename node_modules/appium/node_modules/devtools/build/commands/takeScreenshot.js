"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function takeScreenshot() {
    const page = this.getPageHandle();
    return page.screenshot({
        encoding: 'base64',
        fullPage: true,
        type: 'png'
    });
}
exports.default = takeScreenshot;
