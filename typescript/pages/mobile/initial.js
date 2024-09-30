"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Initial = void 0;
class Initial {
    constructor() {
        this.initial_screen = '//*[@id="android:id/content"]';
    }
    initialScreen() {
        return browser.$(this.initial_screen);
    }
}
exports.Initial = Initial;
