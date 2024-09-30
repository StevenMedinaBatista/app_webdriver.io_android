import Page from './page';

class CommonsPage extends Page {

    /**
     * General Methods to validate existing xpath
     */

    async validateXpath(text: string) {
        //await driver.pause(3000);
        const elem = await $('//*[contains(@text,"' + text + '")]');
        if (expect(elem).toBePresent()) {
            return true;
        }
        else {
            return false;
        }
    }

    get btnBackBtn() { return $('//android.widget.Button[@content-desc="WelcomeScreen, back"]/android.view.ViewGroup') }

    async validate(): Promise<void> {
        await this.btnBackBtn;
    }

    /** 
     * Method to go back in the app
    */
    async goBack() {
        await driver.back();
    }

    /** 
     * Method to get available amount - format integer
    */

    async getAmountLabel(value: string) {
        let valueTempI: string = value.substring(value.indexOf("$") + 1, value.length);
        let valueTempA: string = valueTempI.substring(0, valueTempI.indexOf(","));
        let valueTempB: string = valueTempI.substring(valueTempI.indexOf(",") + 1, valueTempI.length);
        let amountTempEnd: string = valueTempA + valueTempB;

        let newAmount: number = parseInt(amountTempEnd);
        return newAmount;
    }

    /**
     * General Methods for finding elements by specifics texts - Web
    **/

    async findlabelbytext(text: string) {
        const elem = await $('//*[@text="' + text + '"]');
        elem.touchScroll(100, 100)
        return elem;
    }

    async findbuttonbytext(text: string) {
        const elem = await $('//*[@text="' + text + '"]');
        elem.touchScroll(100, 100)
        return elem;
    }

    async findinputbytext(text: string) {
        const elem = await $('//*[@text="' + text + '"]');
        elem.touchScroll(100, 100)
        return elem;
    }

    async tapbytext(text: string) {
        try {
            //await (await this.x_icon).click();
            //const elem = await $('//*[@text="' + text + '"]');
            const elem = await $('//*[@text="' + text + '"]');
            await(await elem).click();
        } catch (error) {
            // Sometimes the element it self is not clickable and we need to find superior parent
            // like a label inside a clickable DIV - BOX
            console.error(error);
            const elem = await $('//*[@text="' + text + '"]/..');
            await(await elem).click();
        }
    }
     /**
    * General Methods for tap elements by any text contains
    **/
    async tapContainsText(text: string) {
        try {
            const elem = await $('//*[contains(@name,"' + text + '")]');
            await elem.click();
        } catch (error) {
            // Sometimes the element it self is not clickable and we need to find superior parent
            // like a label inside a clickable DIV - BOX
            console.error(error);
            const elem = await $('//*[contains(@name,"' + text + '"]/..');
            await elem.click();
        }
    }

    async tapbuttonbytext(text: string) {
        try {
            const elem = await $('//*[@text="' + text + '"]');
            await elem.click();
        } catch (error) {
            // Sometimes the element it self is not clickable and we need to find superior parent
            // like a label inside a clickable DIV - BOX
            console.error(error);
            const elem = await $('//*[@text="' + text + '"]/..');
            await elem.click();
        }
    }

    async delay(ms: number) {
        const seconds = ms * 1000;
        return new Promise(resolve => setTimeout(resolve, seconds));
    }

    async usenumpad(element: WebdriverIO.Element, number: string) {
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

export default new CommonsPage();
