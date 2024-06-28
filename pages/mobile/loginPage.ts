import Page from './page';
import commonsPage from './commonsPage';

class LoginPage extends Page {  

    get txt_consulta_tus_inversiones_En_TodoMomento() { return $('//android.widget.TextView[@text="¡Consulta tus inversiones en todo momento!"]') }
    //get txt_accede_de_forma_rapida_y_segura() { return $('//android.widget.TextView[@text="Accede de forma rápida y segura"]') }
    get txt_da_seguimiento_a_tu_portafolio() { return $('//android.widget.TextView[@text="Da seguimiento a tu portafolio de inversión desde donde te encuentres."]') }
    
    get btn_Saltar() { return $('//android.widget.TextView[@text="Saltar"]') }
    get btn_Acceso_clientes() { return $('//android.widget.TextView[@text="Acceso clientes"]') }
    get btn_Iniciar_sesion() { return $('//android.widget.TextView[@text="Iniciar sesión"]') }
    get lbl_Usuario() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]') }
    get lbl_Contrasena() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]') }
    get btn_ini() { return $('//android.widget.TextView[@text="Iniciar sesión"]') }
    
    


    async validate(): Promise<void> {
        console.log("Validate Login");
        //await expect(this.usuario_input).toBePresent();
        //await expect(this.contrasena_input).toBePresent();
        //await expect(this.recordarMiUsuario_check).toBePresent();
        const iniciarSesion_button: string = "Iniciar sesión"
        await commonsPage.validateXpath(iniciarSesion_button) == true;
        const hazteCliente_button: string = "Hazte cliente"
        await commonsPage.validateXpath(hazteCliente_button) == true;
        const pulsaAqui_link: string = "¿Problemas para iniciar sesión? Pulsa aquí."
        await commonsPage.validateXpath(pulsaAqui_link) == true;
        //await expect(this.tokenDigital_button).toBePresent();
    }

    // async tapfollowingBtn(): Promise<void> {
    //     await driver.pause(3000);
    //     await this.siguienteBtn.click();
    // }
    // async validateMessInvalidData(): Promise<void> {
    //     await driver.pause(3000);
    //     await expect(this.validateMessInvalidData_lbl).toBePresent();
    //     await driver.pause(3000);
    // }
    

    async login(): Promise<void> {
        await driver.pause(1000);
        await expect(this.txt_consulta_tus_inversiones_En_TodoMomento).toBePresent();
        await expect(this.txt_da_seguimiento_a_tu_portafolio).toBePresent();
        await expect(this.btn_Saltar).toBePresent()
        console.log("Preciono el boton Saltar")
    }

    async tabSaltar(): Promise<void> {
        await driver.pause(500);
        await this.btn_Saltar.click();
        console.log("Preciono el boton Saltar")
    }

    async tabAccesoClientes(): Promise<void> {
        await driver.pause(500);
        await this.btn_Acceso_clientes.click();
        console.log("Preciono el boton Acceso Cliente")
    }

    async tabIniciarSesion(): Promise<void> {
        await driver.pause(500);
        await this.btn_Iniciar_sesion.click();
        console.log("Preciono el boton Iniciar sesion")
    }

    async inputCredentials( username: string, password: string){
        console.log("Input credentials: " + username + " " + password);
        await driver.pause(1000);


        //await this.lbl_Usuario.click()
        await this.lbl_Usuario.addValue(username);
        await this.lbl_Contrasena.addValue(password);
        await this.btn_Iniciar_sesion.click();
        await browser.pause(4000)
    }

    async loginDashboard(){
        console.log("I see the dashboard");
        await driver.pause(2000)
    }
    
}

export default new LoginPage();

//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]/android.view.View
//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]