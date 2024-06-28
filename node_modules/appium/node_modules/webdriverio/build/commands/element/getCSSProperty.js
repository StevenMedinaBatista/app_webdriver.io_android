"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const css_shorthand_properties_1 = __importDefault(require("css-shorthand-properties"));
const utils_1 = require("../../utils");
async function getCSSProperty(cssProperty) {
    if (!css_shorthand_properties_1.default.isShorthand(cssProperty)) {
        const cssValue = await this.getElementCSSValue(this.elementId, cssProperty);
        return utils_1.parseCSS(cssValue, cssProperty);
    }
    const properties = css_shorthand_properties_1.default.expand(cssProperty);
    let cssValues = await Promise.all(properties.map((prop) => this.getElementCSSValue(this.elementId, prop)));
    while ((cssValues.length % 2) === 0) {
        const mergedValues = [
            cssValues.slice(0, cssValues.length / 2).join(' '),
            cssValues.slice(cssValues.length / 2).join(' ')
        ];
        const hasEqualProperties = mergedValues.every((v) => v === mergedValues[0]);
        if (!hasEqualProperties) {
            break;
        }
        cssValues = cssValues.slice(0, cssValues.length / 2);
    }
    return utils_1.parseCSS(cssValues.join(' '), cssProperty);
}
exports.default = getCSSProperty;
