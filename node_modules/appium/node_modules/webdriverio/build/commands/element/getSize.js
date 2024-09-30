"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
async function getSize(prop) {
    let rect = {};
    if (this.isW3C) {
        rect = await utils_1.getElementRect(this);
    }
    else {
        rect = await this.getElementSize(this.elementId);
    }
    if (prop && rect[prop]) {
        return rect[prop];
    }
    return {
        width: rect.width,
        height: rect.height
    };
}
exports.default = getSize;
