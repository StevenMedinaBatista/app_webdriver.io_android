"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deleteCookies(names) {
    if (names === undefined) {
        return this.deleteAllCookies();
    }
    const namesList = Array.isArray(names) ? names : [names];
    if (namesList.every(obj => typeof obj !== 'string')) {
        return Promise.reject(new Error('Invalid input (see https://webdriver.io/docs/api/browser/deleteCookies.html for documentation.'));
    }
    return Promise.all(namesList.map(name => this.deleteCookie(name)));
}
exports.default = deleteCookies;
