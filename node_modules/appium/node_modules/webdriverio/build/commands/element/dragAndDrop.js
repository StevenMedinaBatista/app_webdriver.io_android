"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const ACTION_BUTTON = 0;
const sleep = (time = 0) => new Promise((resolve) => setTimeout(resolve, time));
async function dragAndDrop(target, { duration = 10 } = {}) {
    const moveToCoordinates = target;
    const moveToElement = target;
    if (!target ||
        (target.constructor.name !== 'Element' &&
            (typeof moveToCoordinates.x !== 'number' ||
                typeof moveToCoordinates.y !== 'number'))) {
        throw new Error('command dragAndDrop requires an WebdriverIO Element or and object with "x" and "y" variables as first parameter');
    }
    const isMovingToElement = target.constructor.name === 'Element';
    if (!this.isW3C) {
        await this.moveTo();
        await this.buttonDown(ACTION_BUTTON);
        if (isMovingToElement) {
            await moveToElement.moveTo();
        }
        else {
            await this.moveToElement(null, moveToCoordinates.x, moveToCoordinates.y);
        }
        await sleep(duration);
        return this.buttonUp(ACTION_BUTTON);
    }
    const { scrollX, scrollY } = await utils_1.getScrollPosition(this);
    const sourceRect = await utils_1.getElementRect(this);
    const sourceX = Math.floor(sourceRect.x - scrollX + (sourceRect.width / 2));
    const sourceY = Math.floor(sourceRect.y - scrollY + (sourceRect.height / 2));
    let targetX, targetY;
    if (isMovingToElement) {
        const targetRect = await utils_1.getElementRect(moveToElement);
        targetX = Math.floor(targetRect.x - scrollX + (targetRect.width / 2) - sourceX);
        targetY = Math.floor(targetRect.y - scrollY + (targetRect.height / 2) - sourceY);
    }
    else {
        targetX = moveToCoordinates.x;
        targetY = moveToCoordinates.y;
    }
    return this.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'mouse' },
            actions: [
                { type: 'pointerMove', duration: 0, x: sourceX, y: sourceY },
                { type: 'pointerDown', button: ACTION_BUTTON },
                { type: 'pause', duration: 10 },
                { type: 'pointerMove', duration, origin: 'pointer', x: targetX, y: targetY },
                { type: 'pointerUp', button: ACTION_BUTTON }
            ]
        }]).then(() => this.releaseActions());
}
exports.default = dragAndDrop;
