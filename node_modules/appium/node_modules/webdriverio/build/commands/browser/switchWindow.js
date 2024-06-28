"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function switchWindow(urlOrTitleToMatch) {
    if (typeof urlOrTitleToMatch !== 'string' && !(urlOrTitleToMatch instanceof RegExp)) {
        throw new Error('Unsupported parameter for switchWindow, required is "string" or an RegExp');
    }
    const tabs = await this.getWindowHandles();
    const matchesTarget = (target) => {
        if (typeof urlOrTitleToMatch === 'string') {
            return target.includes(urlOrTitleToMatch);
        }
        return !!target.match(urlOrTitleToMatch);
    };
    for (const tab of tabs) {
        await this.switchToWindow(tab);
        const url = await this.getUrl();
        if (matchesTarget(url)) {
            return tab;
        }
        const title = await this.getTitle();
        if (matchesTarget(title)) {
            return tab;
        }
    }
    throw new Error(`No window found with title or url matching "${urlOrTitleToMatch}"`);
}
exports.default = switchWindow;
