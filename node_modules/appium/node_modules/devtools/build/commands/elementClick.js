"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getElementTagName_1 = __importDefault(require("./getElementTagName"));
const selectOption_1 = __importDefault(require("../scripts/selectOption"));
const utils_1 = require("../utils");
async function elementClick({ elementId }) {
    const page = this.getPageHandle();
    const elementHandle = await this.elementStore.get(elementId);
    if (!elementHandle) {
        throw utils_1.getStaleElementError(elementId);
    }
    const tagName = await getElementTagName_1.default.call(this, { elementId });
    if (tagName === 'option') {
        return page.$eval('html', selectOption_1.default, elementHandle);
    }
    return new Promise((resolve, reject) => {
        const dialogHandler = () => resolve(null);
        page.once('dialog', dialogHandler);
        return elementHandle.click().then(() => {
            page.removeListener('dialog', dialogHandler);
            resolve(null);
        }).catch(reject);
    });
}
exports.default = elementClick;
