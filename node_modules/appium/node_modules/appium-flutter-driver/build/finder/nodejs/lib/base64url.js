"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
exports.encode = (input) => Buffer.from(input)
    .toString(`base64`)
    .replace(/=/g, ``)
    .replace(/\+/g, `-`)
    .replace(/\//g, `_`);
exports.decode = (input) => {
    let base64String = ``;
    if (typeof input === `string`) {
        base64String = input;
    }
    else if (typeof input === `object` && input.ELEMENT) {
        base64String = input.ELEMENT;
    }
    else {
        throw new Error(`input is invalid ${JSON.stringify(input)}`);
    }
    return Buffer.from(base64String, `base64`).toString();
};
//# sourceMappingURL=base64url.js.map