import Page from './page';
import commonsPage from './commonsPage';

class HomePage extends Page {  

    // Pantalla de Inicio
    get txt_Webdriver() { return $('//android.widget.TextView[@text="WEBDRIVER"]') }
    get txt_DemoAppForTheAppiumBoilerplate() { return $('//android.widget.TextView[@text="Demo app for the appium-boilerplate"]') }
    get txt_Support() { return $('//android.widget.TextView[@text="Support"]') }

    get btn_Home() { return $('//android.widget.TextView[@text="Home"]') }
    get btn_Webview() { return $('//android.widget.TextView[@text="Webview"]') }
    get btn_Login() { return $('//android.widget.TextView[@text="Login"]') }
    get btn_Forms() { return $('//android.widget.TextView[@text="Forms"]') }
    get btn_Swipe() { return $('//android.widget.TextView[@text="Swipe"]') }
    get btn_Drag() { return $('//android.widget.TextView[@text="Drag"]') }
    
    getOption(option: string) { return $(`//android.widget.TextView[@text="${option}"]`); }


    async validate(): Promise<void> {
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

    async tapMenuOption(option: string): Promise<void> {
        console.log(`Visit ${option} item...`);
        
        const el = await this.getOption(option);
        await el.waitForDisplayed({ timeout: 5000 });
        await el.click();
    }

    

}

export default new HomePage();