"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = __importDefault(require("./page"));
class HomePage extends page_1.default {
    get txt_Webdriver() { return $('//android.widget.TextView[@text="WEBDRIVER"]'); }
    get txt_DemoAppForTheAppiumBoilerplate() { return $('//android.widget.TextView[@text="Demo app for the appium-boilerplate"]'); }
    get txt_Support() { return $('//android.widget.TextView[@text="Support"]'); }
    get btn_Home() { return $('//android.widget.TextView[@text="Home"]'); }
    get btn_Webview() { return $('//android.widget.TextView[@text="Webview"]'); }
    get btn_Login() { return $('//android.widget.TextView[@text="Login"]'); }
    get btn_Forms() { return $('//android.widget.TextView[@text="Forms"]'); }
    get btn_Swipe() { return $('//android.widget.TextView[@text="Swipe"]'); }
    get btn_Drag() { return $('//android.widget.TextView[@text="Drag"]'); }
    getOption(option) { return $(`//android.widget.TextView[@text="${option}"]`); }
    async validate() {
        await expect(this.txt_Webdriver).toBePresent();
        await expect(this.txt_DemoAppForTheAppiumBoilerplate).toBePresent();
        await expect(this.txt_Support).toBePresent();
        await expect(this.btn_Home).toBePresent();
        await expect(this.btn_Webview).toBePresent();
        await expect(this.btn_Login).toBePresent();
        await expect(this.btn_Forms).toBePresent();
        await expect(this.btn_Swipe).toBePresent();
        await expect(this.btn_Drag).toBePresent();
    }
    async tapMenuOption(option) {
        console.log(`Visit ${option} item...`);
        const el = await this.getOption(option);
        await el.waitForDisplayed({ timeout: 5000 });
        await el.click();
    }
}
exports.default = new HomePage();
