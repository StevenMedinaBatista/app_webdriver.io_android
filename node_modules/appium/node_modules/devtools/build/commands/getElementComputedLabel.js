"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getElementComputedLabel({ elementId }) {
    const page = this.getPageHandle(true);
    const elementHandle = await this.elementStore.get(elementId);
    const snapshot = await page.accessibility.snapshot({
        root: elementHandle
    });
    if (!snapshot) {
        return '';
    }
    return snapshot.name;
}
exports.default = getElementComputedLabel;
