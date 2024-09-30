import Page from './page';
import commonsPage from './commonsPage';

class HomePage extends Page {

    get x_icon() { return $('(//android.widget.ImageView[@content-desc="forward"])[1]') }
 //get hazteCliente_button() { return $('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.TextView') }
    get contrasenaInput() { return $('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText/android.view.View') }
    get menuBtn() { return $('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.widget.Button') }
    get back_icon() { return $('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]') }
    //get yaTengoToken_btn() { return $('//android.widget.EditText/android.view.View/android.view.View') }
    get permisoMovil_alert() { return $('//android.widget.TextView[@text="YAVÁ requiere colectar, almacenar, enviar y procesar:"]') }




    async validate(): Promise<void> {
        console.log("Validate Home");
       // await expect(this.IPSAApp_label).toBePresent();
        await driver.pause(300);
        if (await (await this.permisoMovil_alert).isDisplayed()) {
            await driver.pause(200);
            const permitir_button:string = "ACEPTAR"
            await commonsPage.tapbytext(permitir_button);
        }
        const acceder_button:string = "Acceder"
        await commonsPage.validateXpath(acceder_button) == true;
        const hazteCliente_button:string = "Hazte cliente"
        await commonsPage.validateXpath(hazteCliente_button) == true;
    }

    async tapToAccess(): Promise<void> {
        console.log("Tap To access");
        const acceder_button:string = "Acceder"
        await commonsPage.tapbytext(acceder_button);
    }

    async tapBecomeACustomer(): Promise<void> {
        console.log("Tap Become a customer");
        const hazteCliente_button:string = "Hazte cliente"
        await commonsPage.tapbytext(hazteCliente_button);
    }
    async closeSesion(): Promise<void> {
        await driver.pause(5000);
        console.log("Close Sesion");
        if (await (await this.contrasenaInput).isDisplayed()) {
            await driver.pause(200);
            await this.menuBtn.click();
            await driver.pause(200);
            const cerrarSesionBtn: string = "Cerrar sesión"
            await commonsPage.validateXpath(cerrarSesionBtn) == true;
            await commonsPage.tapbytext(cerrarSesionBtn);
            await driver.pause(200);
            const continuarBtn: string = "Desvincular"
            await commonsPage.validateXpath(continuarBtn) == true;
            await commonsPage.tapbytext(continuarBtn);
            await expect(this.back_icon).toBePresent();
            await this.back_icon.click();
        }
    }




    
}

export default new HomePage();

