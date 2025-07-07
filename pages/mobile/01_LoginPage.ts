import Page from './page';
import commonsPage from './commonsPage';

class LoginPage extends Page {  

    // Pantalla de Inicio
    get txt_LoginSignUpForm() { return $('//android.widget.TextView[@text="Login / Sign up Form"]') }
    get option_Login() { return $('(//android.widget.TextView[@text="Login"])[1]') }
    get option_SignUp() { return $('//android.widget.TextView[@text="Sign up"]') }

    get input_Email() { return $('//android.widget.EditText[@content-desc="input-email"]') }
    get input_Password() { return $('//android.widget.EditText[@content-desc="input-password"]') }
    get input_ConfirmPassword() { return $('//android.widget.EditText[@content-desc="input-repeat-password"]') }
    get txt_WhenTheDeviceHasTouch() { return $('//android.widget.TextView[@text="When the device has Touch/FaceID (iOS) or FingerPrint enabled a biometrics button will be shown to use and test the login."]') }
    get btn_Login() { return $('//android.view.ViewGroup[@content-desc="button-LOGIN"]/android.view.ViewGroup') }

    get alert_Success() { return $('//android.widget.TextView[@text="Success"]') }
    get txt_YouAreLoggedIn() { return $('//android.widget.TextView[@text="You are logged in!"]') }
    get btn_ok() { return $('//android.widget.Button[@resource-id="android:id/button1"]') }
    

    async validate(): Promise<void> {
        await expect(this.txt_LoginSignUpForm).toBePresent();
        await expect(this.option_Login).toBePresent();
        await expect(this.option_SignUp).toBePresent();
        await expect(this.input_Email).toBePresent();
        await expect(this.input_Password).toBePresent();
        await expect(this.txt_WhenTheDeviceHasTouch).toBePresent();
        await expect(this.btn_Login).toBePresent();
    }

    async inputCredentials(email: string, password: string): Promise<void> {
        console.log(`Email: ${email}, Password: ${password}`);
    
        await expect(this.input_Email).toBePresent();
        await expect(this.input_Password).toBePresent();
        await expect(this.btn_Login).toBePresent();

        await this.input_Email.click();
        await this.input_Email.setValue(email);
        await this.input_Password.setValue(password);
        await driver.pause(300);

        await this.btn_Login.click();
    }

    async ValidateSuccessAlert(): Promise <void>{
        await expect(this.alert_Success).toBePresent();
        await expect(this.txt_YouAreLoggedIn).toBePresent();
        await expect(this.btn_ok).toBePresent();
    }
    

}

export default new LoginPage();