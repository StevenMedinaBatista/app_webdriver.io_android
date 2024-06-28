"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getElementComputedRole({ elementId }) {
    const page = this.getPageHandle(true);
    const elementHandle = await this.elementStore.get(elementId);
    const snapshot = await page.accessibility.snapshot({
        root: elementHandle
    });
    if (!snapshot) {
        return 'Ignored';
    }
    return snapshot.role;
}
exports.default = getElementComputedRole;
