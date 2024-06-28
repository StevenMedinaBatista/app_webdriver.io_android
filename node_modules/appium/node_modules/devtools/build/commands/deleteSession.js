"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function deleteSession() {
    await this.browser.close();
    this.windows.clear();
    return null;
}
exports.default = deleteSession;
