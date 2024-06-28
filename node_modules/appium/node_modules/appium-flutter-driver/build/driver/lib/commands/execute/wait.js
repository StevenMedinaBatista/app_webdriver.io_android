"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitFor = exports.waitForAbsent = void 0;
const waitForConstructor = (command) => async (self, elementBase64, durationMilliseconds) => {
    let args = {};
    if (typeof durationMilliseconds === `number`) {
        args = {
            timeout: durationMilliseconds * 1000,
        };
    }
    else if (typeof durationMilliseconds !== `undefined`) {
        // @todo BaseDriver's errors.InvalidArgumentError();
        throw new Error(`durationMilliseconds is not a valid options`);
    }
    await self.executeElementCommand(command, elementBase64, args);
    return elementBase64;
};
exports.waitForAbsent = waitForConstructor(`waitForAbsent`);
exports.waitFor = waitForConstructor(`waitFor`);
//# sourceMappingURL=wait.js.map