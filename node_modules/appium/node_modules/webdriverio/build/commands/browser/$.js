"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const getElementObject_1 = require("../../utils/getElementObject");
const constants_1 = require("../../constants");
async function $(selector) {
    if (typeof selector === 'object' && typeof selector[constants_1.ELEMENT_KEY] === 'string') {
        return getElementObject_1.getElement.call(this, undefined, selector);
    }
    const res = await utils_1.findElement.call(this, selector);
    return getElementObject_1.getElement.call(this, selector, res);
}
exports.default = $;
