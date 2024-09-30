"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
async function elementSendKeys({ elementId, text }) {
    var _a, _b;
    const elementHandle = await this.elementStore.get(elementId);
    if (!elementHandle) {
        throw utils_1.getStaleElementError(elementId);
    }
    await elementHandle.focus();
    const page = this.getPageHandle();
    const propertyHandles = {
        tagName: await elementHandle.getProperty('tagName'),
        type: await elementHandle.getProperty('type')
    };
    const tagName = await ((_a = propertyHandles.tagName) === null || _a === void 0 ? void 0 : _a.jsonValue());
    const type = await ((_b = propertyHandles.type) === null || _b === void 0 ? void 0 : _b.jsonValue());
    if (tagName === 'INPUT' && type === 'file') {
        const paths = (text || '').split('\n').map(p => path_1.default.resolve(p));
        await elementHandle.uploadFile(...paths);
    }
    else {
        await page.keyboard.type(text);
    }
    return null;
}
exports.default = elementSendKeys;
