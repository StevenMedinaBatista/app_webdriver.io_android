import Page from './page';
import commonsPage from './commonsPage';

class splashPage extends Page {  

    get txt_consulta_tus_inversiones_En_TodoMomento() { return $('//android.widget.TextView[@text="¡Consulta tus inversiones en todo momento!"]') }
    //get txt_accede_de_forma_rapida_y_segura() { return $('//android.widget.TextView[@text="Accede de forma rápida y segura"]') }
    get txt_da_seguimiento_a_tu_portafolio() { return $('//android.widget.TextView[@text="Da seguimiento a tu portafolio de inversión desde donde te encuentres."]') }
    get txt_BienvenidoAlMundoDigital() { return $('//android.widget.TextView[@text="¡Bienvenido al mundo digital del mercado de valores!"]') }
    get btn_Saltar() { return $('//android.widget.TextView[@text="Saltar"]') }
    get btn_Continuar() { return $('//android.widget.TextView[@text="Continuar"]') }
    get btn_Registrate() { return $('//android.widget.TextView[@text="Regístrate"]') }
    get btn_HazteInversionista() { return $('//android.widget.TextView[@text="Hazte inversionista"]') }
    get btn_Contactanos() { return $('//android.widget.TextView[@text="Contáctanos"]') }
    get txt_thirdSplash() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View[1]/android.widget.TextView[1]') }
    get btn_IniciarSesion() { return $('//android.widget.TextView[@text="Iniciar sesión"]') }
    get lbl_Usuario() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]') }
    get lbl_Contrasena() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]') }
    get btn_Acceso_clientes() { return $('//android.widget.TextView[@text="Continuar"]') }


    //* Expaths Pre-Login
    
    get btn_ComunicateConNosotros() { return $('//android.widget.TextView[@text="Comunícate \ncon nosotros"]') }
    get btn_TasasDeRendimiento() { return $('//android.widget.TextView[@text="Tasas de \nrendimiento"]') }
    get btn_CalculadoraPopular() { return $('//android.widget.TextView[@text="Calculadora \nPopular"]') }

    
    //* Expaths Pantalla Comunicate con Nosotros

    get txt_DeQueFormaDeseasContactarnos() { return $('//android.widget.TextView[@text="¿De qué forma deseas contactarnos?"]') }
    get btn_EnviarCorreo() { return $('android=new UiSelector().text("Enviar\ncorreo")') }
    get icon_EnviarCorreo() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View/android.view.View[1]') }
    get btn_SolicitarCita() { return $('//android.widget.TextView[@text="Solicitar \ncita"]') }
    get btn_SeguirnosEnInstagram() { return $('//android.widget.TextView[@text="Seguirnos en \nInstagram"]') }

    //android.widget.TextView[@text="Enviar correo"]



    //* Expaths Pantalla Tasas de Rendimientos

    get txt_TasasDeRendimiento() { return $('//android.widget.TextView[@text="Tasas de rendimiento"]') }
    

    //* Expaths Pantalla Tasas de Rendimientos

    get txt_CalculadoraMutuosPopular() { return $('//android.widget.TextView[@text="Calculadora Mutuos Popular"]') }



    async validate(): Promise<void> {
        console.log("Validate Login");
        const iniciarSesion_button: string = "Iniciar sesión"
        await commonsPage.validateXpath(iniciarSesion_button) == true;
        const hazteCliente_button: string = "Hazte cliente"
        await commonsPage.validateXpath(hazteCliente_button) == true;
        const pulsaAqui_link: string = "¿Problemas para iniciar sesión? Pulsa aquí."
        await commonsPage.validateXpath(pulsaAqui_link) == true;
    }
    
    async login(): Promise<void> {
        await this.waitForTimeout(2000);
        await expect(this.txt_consulta_tus_inversiones_En_TodoMomento).toBePresent();
        await expect(this.txt_da_seguimiento_a_tu_portafolio).toBePresent();
        await expect(this.btn_Saltar).toBePresent();
        console.log("Preciono el boton Saltar");
    }

    async tabAccesoClientes(): Promise<void> {
        await driver.pause(500);
        await this.btn_Acceso_clientes.click();
        console.log("Preciono el boton Acceso Cliente")
    }

    async pressButton(button: string) {
        switch (button) {
            case 'Saltar':
                await this.btn_Saltar.click();
                console.log("Preciono el boton Saltar");
                break;
            case 'Continuar':
                await this.btn_Continuar.click();
                console.log("Preciono el boton Continuar");
                break;
            case 'Registrate':
                await this.btn_Registrate.click();
                console.log("Preciono el boton Registrate");
                break;
            case 'Hazte inversionista':
                await this.btn_HazteInversionista.click();
                console.log("Preciono el boton Hazte inversionista");
                break;
            case 'Iniciar sesión':
                await this.btn_IniciarSesion.click();
                console.log("Preciono el boton Iniciar sesión");
                break;
            case 'Acceso clientes':
                await this.btn_Acceso_clientes.click();
                console.log("Preciono el boton Acceso clientes");
                break;
            default:
                throw new Error(`Button ${button} not found`);
        }
    }

    async verifyThirdSplashScreen() {
        await expect(this.txt_thirdSplash).toBePresent();
    }

    async verifyPositionIndicator(indicator: string) {
        await expect(this.txt_thirdSplash).toBeExisting();
    }

    async verifyScreenChange() {
        await expect(this.txt_thirdSplash).toBeExisting();
    }

    async verifySplashEnd() {
        await expect(this.btn_Registrate).toBeDisplayed();
        await expect(this.btn_HazteInversionista).toBeDisplayed();
        await expect(this.btn_IniciarSesion).toBeDisplayed();
    }

    async verifyApplicationFormInfo() {
        await expect(this.btn_Contactanos).toBeDisplayed();
    }

    async verifyWelcomeScreen() {
        await expect(this.txt_BienvenidoAlMundoDigital).toBeDisplayed();
    }

    async verifyLoginPasswordScreen() {
        await expect(this.lbl_Contrasena).toBeDisplayed()
        await expect(this.lbl_Usuario).toBeDisplayed()
    }

    async verifySplashEndScreen(buttons: string[]) {
        const buttonSelectors = {
            "Regístrate": this.btn_Registrate,
            "Hazte inversionista": this.btn_HazteInversionista,
            "Iniciar sesión": this.btn_IniciarSesion
        };

        for (const button of buttons) {
            const element = buttonSelectors;
            //expect(element).toBeExisting();
        }
    }

    async waitForTimeout(ms: number) {
        await driver.pause(ms);
    }

    async verifyAllSplashScreens() {
        // AQUI CREE UN CODIGO PARA SIMULAR EL COMPORTAMIENTO DE LOS 10 SEGUNDOS.
        await this.swipeScreen();
    }

    async swipeScreen() {
        for(let i = 0; i < 2; i++){
            const startX = 900; // Cerca del borde derecho de la pantalla (1080 * 0.9)
            const startY = 1200; // Mitad de la pantalla en el eje y (2400 / 2)
            const endX = 200; // Cerca del borde izquierdo de la pantalla (1080 * 0.2)
            const endY = 1200; // Mantenerse en la misma posición en el eje y
        
            await browser.touchAction([
                { action: 'press', x: startX, y: startY },
                { action: 'moveTo', x: endX, y: endY },
                'release'
            ]);

            await driver.pause(500);
        }
    }


    // ******************************************************
    //* PageObjests de Pre-Login
    // ******************************************************

    
    private async mapOptionToElement(option: string): Promise<WebdriverIO.Element> {
        switch (option) {
            case 'Comunícate con nosotros':
                return this.btn_ComunicateConNosotros;
            case 'Tasas de rendimiento':
                return this.btn_TasasDeRendimiento;
            case 'Calculadora Popular':
                return this.btn_CalculadoraPopular;

            //* Sub-opciones de comunicate con nosotros
            case 'Enviar\ncorreo':
                return this.btn_EnviarCorreo;
            case 'Solicitar cita':
                return this.btn_SolicitarCita;
            case 'Seguirnos en Instagram':
                return this.btn_SeguirnosEnInstagram;
            default:
                throw new Error(`No se reconoce la opción: ${option}`);
        }
    }
    

    async tapOnOption(option: string): Promise<void> {
        const element = await this.mapOptionToElement(option);
        await element.waitForDisplayed({ timeout: 10000 });
        await element.click();
    }

    async validateScreenIsDisplayed(option: string): Promise<void> {
        let element: WebdriverIO.Element;
    
        switch (option) {
            case 'Comunícate con nosotros':
                element = await this.txt_DeQueFormaDeseasContactarnos;
                break;
            case 'Tasas de rendimiento':
                element = await this.txt_TasasDeRendimiento;
                break;
            case 'Calculadora Popular':
                element = await this.txt_CalculadoraMutuosPopular;
                break;
            default:
                throw new Error(`No se reconoce la pantalla para la opción: ${option}`);
        }
    
        await element.waitForDisplayed({ timeout: 15000 });
    }
    

}

export default new splashPage();
