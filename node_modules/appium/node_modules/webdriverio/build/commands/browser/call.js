"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function call(fn) {
    if (typeof fn === 'function') {
        return fn();
    }
    throw new Error('Command argument for "call" needs to be a function');
}
exports.default = call;
