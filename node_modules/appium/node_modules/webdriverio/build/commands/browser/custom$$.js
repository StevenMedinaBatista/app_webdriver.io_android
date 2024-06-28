"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const getElementObject_1 = require("../../utils/getElementObject");
const constants_1 = require("../../constants");
async function custom$$(strategyName, ...strategyArguments) {
    const strategy = this.strategies.get(strategyName);
    if (!strategy) {
        throw Error('No strategy found for ' + strategyName);
    }
    let res = await this.execute(strategy, ...strategyArguments);
    if (!Array.isArray(res)) {
        res = [res];
    }
    res = res.filter(el => !!el && typeof el[constants_1.ELEMENT_KEY] === 'string');
    const elements = res.length ? await getElementObject_1.getElements.call(this, strategy.toString(), res) : [];
    return utils_1.enhanceElementsArray(elements, this, strategyName, 'custom$$', [strategyArguments]);
}
exports.default = custom$$;
