"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = __importDefault(require("./page"));
const commonsPage_1 = __importDefault(require("./commonsPage"));
class splashPage extends page_1.default {
    get txt_consulta_tus_inversiones_En_TodoMomento() { return $('//android.widget.TextView[@text="¡Consulta tus inversiones en todo momento!"]'); }
    get txt_da_seguimiento_a_tu_portafolio() { return $('//android.widget.TextView[@text="Da seguimiento a tu portafolio de inversión desde donde te encuentres."]'); }
    get txt_BienvenidoAlMundoDigital() { return $('//android.widget.TextView[@text="¡Bienvenido al mundo digital del mercado de valores!"]'); }
    get btn_Saltar() { return $('//android.widget.TextView[@text="Saltar"]'); }
    get btn_Continuar() { return $('//android.widget.TextView[@text="Continuar"]'); }
    get btn_Registrate() { return $('//android.widget.TextView[@text="Regístrate"]'); }
    get btn_HazteInversionista() { return $('//android.widget.TextView[@text="Hazte inversionista"]'); }
    get btn_Contactanos() { return $('//android.widget.TextView[@text="Contáctanos"]'); }
    get txt_thirdSplash() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View[1]/android.widget.TextView[1]'); }
    get btn_IniciarSesion() { return $('//android.widget.TextView[@text="Iniciar sesión"]'); }
    get lbl_Usuario() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]'); }
    get lbl_Contrasena() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]'); }
    get btn_Acceso_clientes() { return $('//android.widget.TextView[@text="Continuar"]'); }
    async validate() {
        console.log("Validate Login");
        const iniciarSesion_button = "Iniciar sesión";
        await commonsPage_1.default.validateXpath(iniciarSesion_button) == true;
        const hazteCliente_button = "Hazte cliente";
        await commonsPage_1.default.validateXpath(hazteCliente_button) == true;
        const pulsaAqui_link = "¿Problemas para iniciar sesión? Pulsa aquí.";
        await commonsPage_1.default.validateXpath(pulsaAqui_link) == true;
    }
    async login() {
        await this.waitForTimeout(2000);
        await expect(this.txt_consulta_tus_inversiones_En_TodoMomento).toBeExisting();
        await expect(this.txt_da_seguimiento_a_tu_portafolio).toBeExisting();
        await expect(this.btn_Saltar).toBePresent();
        console.log("Preciono el boton Saltar");
    }
    async tabAccesoClientes() {
        await driver.pause(500);
        await this.btn_Acceso_clientes.click();
        console.log("Preciono el boton Acceso Cliente");
    }
    async pressButton(button) {
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
    async verifyPositionIndicator(indicator) {
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
        await expect(this.lbl_Contrasena).toBeDisplayed();
        await expect(this.lbl_Usuario).toBeDisplayed();
    }
    async verifySplashEndScreen(buttons) {
        const buttonSelectors = {
            "Regístrate": this.btn_Registrate,
            "Hazte inversionista": this.btn_HazteInversionista,
            "Iniciar sesión": this.btn_IniciarSesion
        };
        for (const button of buttons) {
            const element = buttonSelectors;
        }
    }
    async waitForTimeout(ms) {
        await driver.pause(ms);
    }
    async verifyAllSplashScreens() {
        await this.swipeScreen();
    }
    async swipeScreen() {
        for (let i = 0; i < 2; i++) {
            const startX = 900;
            const startY = 1200;
            const endX = 200;
            const endY = 1200;
            await browser.touchAction([
                { action: 'press', x: startX, y: startY },
                { action: 'moveTo', x: endX, y: endY },
                'release'
            ]);
            await driver.pause(500);
        }
    }
}
exports.default = new splashPage();
