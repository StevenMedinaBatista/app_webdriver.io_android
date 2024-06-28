"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = __importDefault(require("./page"));
class CommonsPage extends page_1.default {
    async validateXpath(text) {
        const elem = await $('//*[contains(@text,"' + text + '")]');
        if (expect(elem).toBePresent()) {
            return true;
        }
        else {
            return false;
        }
    }
    get btnBackBtn() { return $('//android.widget.Button[@content-desc="WelcomeScreen, back"]/android.view.ViewGroup'); }
    async validate() {
        await this.btnBackBtn;
    }
    async goBack() {
        await driver.back();
    }
    async getAmountLabel(value) {
        let valueTempI = value.substring(value.indexOf("$") + 1, value.length);
        let valueTempA = valueTempI.substring(0, valueTempI.indexOf(","));
        let valueTempB = valueTempI.substring(valueTempI.indexOf(",") + 1, valueTempI.length);
        let amountTempEnd = valueTempA + valueTempB;
        let newAmount = parseInt(amountTempEnd);
        return newAmount;
    }
    async findlabelbytext(text) {
        const elem = await $('//*[@text="' + text + '"]');
        elem.touchScroll(100, 100);
        return elem;
    }
    async findbuttonbytext(text) {
        const elem = await $('//*[@text="' + text + '"]');
        elem.touchScroll(100, 100);
        return elem;
    }
    async findinputbytext(text) {
        const elem = await $('//*[@text="' + text + '"]');
        elem.touchScroll(100, 100);
        return elem;
    }
    async tapbytext(text) {
        try {
            const elem = await $('//*[@text="' + text + '"]');
            await (await elem).click();
        }
        catch (error) {
            console.error(error);
            const elem = await $('//*[@text="' + text + '"]/..');
            await (await elem).click();
        }
    }
    async tapContainsText(text) {
        try {
            const elem = await $('//*[contains(@name,"' + text + '")]');
            await elem.click();
        }
        catch (error) {
            console.error(error);
            const elem = await $('//*[contains(@name,"' + text + '"]/..');
            await elem.click();
        }
    }
    async tapbuttonbytext(text) {
        try {
            const elem = await $('//*[@text="' + text + '"]');
            await elem.click();
        }
        catch (error) {
            console.error(error);
            const elem = await $('//*[@text="' + text + '"]/..');
            await elem.click();
        }
    }
    async delay(ms) {
        const seconds = ms * 1000;
        return new Promise(resolve => setTimeout(resolve, seconds));
    }
    async usenumpad(element, number) {
        await this.delay(3);
        await element.click();
        for (const char of number) {
            console.log(char);
            await element.sendKeys([char]);
            await this.delay(5);
        }
        await driver.hideKeyboard();
        await this.delay(2);
    }
}
exports.default = new CommonsPage();
