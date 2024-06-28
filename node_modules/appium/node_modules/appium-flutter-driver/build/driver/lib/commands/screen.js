"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScreenshot = void 0;
exports.getScreenshot = async function () {
    const response = await this.socket.call(`_flutter.screenshot`);
    return response.screenshot;
};
//# sourceMappingURL=screen.js.map