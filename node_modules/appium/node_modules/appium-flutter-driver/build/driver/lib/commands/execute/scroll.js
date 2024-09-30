"use strict";
// tslint:disable:object-literal-sort-keys
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollIntoView = exports.scrollUntilVisible = exports.longTap = exports.scroll = void 0;
const wait_1 = require("./wait");
exports.scroll = async (self, elementBase64, opts) => {
    const { dx, dy, durationMilliseconds, frequency = 60 } = opts;
    if (typeof dx !== `number` ||
        typeof dy !== `number` ||
        typeof durationMilliseconds !== `number` ||
        typeof frequency !== `number`) {
        // @todo BaseDriver's errors.InvalidArgumentError();
        throw new Error(`${opts} is not a valid options`);
    }
    if (dx === 0 || dy === 0) {
        // @todo BaseDriver's errors.InvalidArgumentError();
        throw new Error(`${opts} is not a valid options`);
    }
    return await self.executeElementCommand(`scroll`, elementBase64, {
        dx,
        dy,
        duration: durationMilliseconds * 1000,
        frequency,
    });
};
exports.longTap = async (self, elementBase64, opts) => {
    const { durationMilliseconds, frequency = 60 } = opts;
    if (typeof durationMilliseconds !== `number` ||
        typeof frequency !== `number`) {
        // @todo BaseDriver's errors.InvalidArgumentError();
        throw new Error(`${opts} is not a valid options`);
    }
    return await self.executeElementCommand(`scroll`, elementBase64, {
        dx: 0,
        dy: 0,
        duration: durationMilliseconds * 1000,
        frequency,
    });
};
exports.scrollUntilVisible = async (self, elementBase64, opts) => {
    const { item, alignment = 0.0, dxScroll = 0, dyScroll = 0 } = opts;
    if (typeof alignment !== `number` ||
        typeof dxScroll !== `number` ||
        typeof dyScroll !== `number`) {
        // @todo BaseDriver's errors.InvalidArgumentError();
        throw new Error(`${opts} is not a valid options`);
    }
    if (dxScroll === 0 || dyScroll === 0) {
        // @todo BaseDriver's errors.InvalidArgumentError();
        throw new Error(`${opts} is not a valid options`);
    }
    // Kick off an (unawaited) waitFor that will complete when the item we're
    // looking for finally scrolls onscreen. We add an initial pause to give it
    // the chance to complete if the item is already onscreen; if not, scroll
    // repeatedly until we either find the item or time out.
    let isVisible = false;
    wait_1.waitFor(self, item).then((_) => {
        isVisible = true;
    });
    while (!isVisible) {
        await exports.scroll(self, elementBase64, {
            dx: dxScroll,
            dy: dyScroll,
            durationMilliseconds: 100,
        });
    }
    return exports.scrollIntoView(self, item, { alignment });
};
exports.scrollIntoView = async (self, elementBase64, opts) => {
    const { alignment = 0.0 } = opts;
    if (typeof alignment !== `number`) {
        // @todo BaseDriver's errors.InvalidArgumentError();
        throw new Error(`${opts} is not a valid options`);
    }
    return await self.executeElementCommand(`scrollIntoView`, elementBase64, {
        alignment,
    });
};
//# sourceMappingURL=scroll.js.map