"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let SCREEN_SIZE;
const SWIPE_DIRECTION = {
    down: {
        start: { x: 50, y: 15 },
        end: { x: 50, y: 85 },
    },
    left: {
        start: { x: 95, y: 50 },
        end: { x: 5, y: 50 },
    },
    right: {
        start: { x: 5, y: 50 },
        end: { x: 95, y: 50 },
    },
    up: {
        start: { x: 50, y: 85 },
        end: { x: 50, y: 15 },
    },
};
class Gestures {
    static checkIfDisplayedWithSwipeUp(element, maxScrolls, amount = 0) {
        if (!element.isDisplayed() && amount <= maxScrolls) {
            this.swipeUp(0.85);
            this.checkIfDisplayedWithSwipeUp(element, maxScrolls, amount + 1);
        }
        else if (amount > maxScrolls) {
            throw new Error(`The element '${element}' could not be found or is not visible.`);
        }
    }
    static swipeDown(percentage = 1) {
        this.swipeOnPercentage(this.calculateXY(SWIPE_DIRECTION.down.start, percentage), this.calculateXY(SWIPE_DIRECTION.down.end, percentage));
    }
    static swipeUp(percentage = 1) {
        this.swipeOnPercentage(this.calculateXY(SWIPE_DIRECTION.up.start, percentage), this.calculateXY(SWIPE_DIRECTION.up.end, percentage));
    }
    static swipeLeft(percentage = 1) {
        this.swipeOnPercentage(this.calculateXY(SWIPE_DIRECTION.left.start, percentage), this.calculateXY(SWIPE_DIRECTION.left.end, percentage));
    }
    static swipeRight(percentage = 1) {
        this.swipeOnPercentage(this.calculateXY(SWIPE_DIRECTION.right.start, percentage), this.calculateXY(SWIPE_DIRECTION.right.end, percentage));
    }
    static swipeOnPercentage(from, to) {
        SCREEN_SIZE = SCREEN_SIZE || driver.getWindowRect();
        const pressOptions = this.getDeviceScreenCoordinates(SCREEN_SIZE, from);
        const moveToScreenCoordinates = this.getDeviceScreenCoordinates(SCREEN_SIZE, to);
        this.swipe(pressOptions, moveToScreenCoordinates);
    }
    static swipe(from, to) {
        driver.touchPerform([
            {
                action: 'press',
                options: from,
            },
            {
                action: 'wait',
                options: { ms: 1000 },
            },
            {
                action: 'moveTo',
                options: to,
            },
            {
                action: 'release',
            },
        ]);
        driver.pause(1000);
    }
    static getDeviceScreenCoordinates(screenSize, coordinates) {
        return {
            x: Math.round(screenSize.width * (coordinates.x / 100)),
            y: Math.round(screenSize.height * (coordinates.y / 100)),
        };
    }
    static calculateXY({ x, y }, percentage) {
        return {
            x: x * percentage,
            y: y * percentage,
        };
    }
}
exports.default = Gestures;
