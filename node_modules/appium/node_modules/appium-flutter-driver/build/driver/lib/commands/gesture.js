"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performTouch = exports.longTap = exports.tap = exports.tapEl = exports.click = void 0;
const scroll_1 = require("./execute/scroll");
exports.click = async function (el) {
    const retVal = await this.tapEl(el, false);
    return retVal;
};
exports.tapEl = async function (el, longPress) {
    // perform a tap on the given element
    // if longPress is true, the tap becomes a longPress action
    const commandName = longPress ? `longPress` : `tap`;
    return await this.executeElementCommand(commandName, el);
};
exports.tap = async function (gestures, longPress) {
    // parse the given gestures array to call the appropriate tap method
    // if longPress is true, the tap is a long press action
    const elementId = gestures[0].options.element;
    await this.tapEl(elementId, longPress);
};
exports.longTap = async function (gestures, ms) {
    // pass duration if the wait action given by user.
    // If wait action is missing taking 10000 ms default
    const elementId = gestures[0].options.element;
    return await scroll_1.longTap(this, elementId, { durationMilliseconds: ms, frequency: 30 });
};
exports.performTouch = async function (gestures) {
    if (gestures.length === 3) {
        if (gestures[0].action === `longPress` && gestures[1].action === `wait` &&
            gestures[2].action === `release`) {
            return await this.longTap(gestures, gestures[1].options.ms);
        }
    }
    else if (gestures.length === 2) {
        if (gestures[0].action === `press` && gestures[1].action === `release`) {
            return await this.tap(gestures, false);
        }
        else if (gestures[0].action === `longPress` &&
            gestures[1].action === `release`) {
            return await this.longTap(gestures, 10 * 1000);
        }
    }
    else if (gestures.length === 1) {
        if (gestures[0].action === `tap`) {
            return await this.tap(gestures, false);
        }
        if (gestures[0].action === `longPress`) {
            return await this.longTap(gestures, 10 * 1000);
        }
    }
};
//# sourceMappingURL=gesture.js.map