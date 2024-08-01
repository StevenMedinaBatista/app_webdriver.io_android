"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const splashPage_1 = __importDefault(require("../../pages/mobile/splashPage"));
(0, cucumber_1.Before)(async () => {
    await driver.reset();
});
(0, cucumber_1.Given)('the mobile application is started for the first time', async () => {
    console.log("Primera pantalla de la app");
    await splashPage_1.default.login();
});
(0, cucumber_1.When)('user press the {string} button', async (button) => {
    await splashPage_1.default.pressButton(button);
});
(0, cucumber_1.Then)('the user is sent to third splash', async () => {
    await splashPage_1.default.verifyThirdSplashScreen();
});
(0, cucumber_1.Then)('the position indicator {string} must change to the last location', async (indicator) => {
    await splashPage_1.default.verifyPositionIndicator(indicator);
});
(0, cucumber_1.Then)('the important information screens are skipped and the user sent to splash_end screen with the {string}, {string} and {string} buttons is displayed', async (btn1, btn2, btn3) => {
    await splashPage_1.default.verifySplashEndScreen([btn1, btn2, btn3]);
});
(0, cucumber_1.When)('the 10 seconds of the display are over', async () => {
    await splashPage_1.default.waitForTimeout(1000);
});
(0, cucumber_1.Then)('the screen change to the next and repeat the cycle until reaching the last splash screen', async () => {
    await splashPage_1.default.verifyAllSplashScreens();
});
(0, cucumber_1.Then)('the position indicator {string} must change to the exact location of the user in relation to the screen that is positioned', async (indicator) => {
    await splashPage_1.default.verifyPositionIndicator(indicator);
});
(0, cucumber_1.When)('user swipe the creen to left or right', async () => {
    await splashPage_1.default.swipeScreen();
});
(0, cucumber_1.Then)('the screen change to the next', async () => {
    await splashPage_1.default.verifyScreenChange();
});
(0, cucumber_1.Then)('the user is located on the last screen of the splash', async () => {
    await splashPage_1.default.login();
    await splashPage_1.default.swipeScreen();
    await splashPage_1.default.verifyThirdSplashScreen();
});
(0, cucumber_1.Then)('the position indicator {string} is in the last position', async (indicator) => {
    await splashPage_1.default.verifyPositionIndicator(indicator);
});
(0, cucumber_1.Then)('the user is sent to the splash_end', async () => {
    await splashPage_1.default.verifySplashEnd();
});
(0, cucumber_1.Then)('the user is sent to the application_form_info', async () => {
    await splashPage_1.default.verifyApplicationFormInfo();
});
