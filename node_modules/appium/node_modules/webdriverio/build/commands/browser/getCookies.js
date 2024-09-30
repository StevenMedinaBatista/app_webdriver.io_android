"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getCookies(names) {
    if (names === undefined) {
        return this.getAllCookies();
    }
    const namesList = Array.isArray(names) ? names : [names];
    if (namesList.every(obj => typeof obj !== 'string')) {
        throw new Error('Invalid input (see https://webdriver.io/docs/api/browser/getCookies.html for documentation.');
    }
    const allCookies = await this.getAllCookies();
    return allCookies.filter(cookie => namesList.includes(cookie.name));
}
exports.default = getCookies;
