"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = __importDefault(require("./page"));
const commonsPage_1 = __importDefault(require("./commonsPage"));
class LoginPage extends page_1.default {
    get txt_consulta_tus_inversiones_En_TodoMomento() { return $('//android.widget.TextView[@text="¡Consulta tus inversiones en todo momento!"]'); }
    get txt_da_seguimiento_a_tu_portafolio() { return $('//android.widget.TextView[@text="Da seguimiento a tu portafolio de inversión desde donde te encuentres."]'); }
    get btn_Saltar() { return $('//android.widget.TextView[@text="Saltar"]'); }
    get btn_Acceso_clientes() { return $('//android.widget.TextView[@text="Continuar"]'); }
    get btn_Iniciar_sesion() { return $('//android.widget.TextView[@text="Iniciar sesión"]'); }
    get lbl_Usuario() { return $('//android.widget.TextView[@text="Usuario"]'); }
    get lbl_Contrasena() { return $('//android.widget.TextView[@text="Contraseña"]'); }
    get btn_ini() { return $('//android.widget.TextView[@text="Iniciar sesión"]'); }
    get btn_Continuar() { return $('//android.widget.TextView[@text="Continuar"]'); }
    get input_Usuario() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]'); }
    get input_Contrasena() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]'); }
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
        await driver.pause(1000);
        await expect(this.txt_consulta_tus_inversiones_En_TodoMomento).toBePresent();
        await expect(this.txt_da_seguimiento_a_tu_portafolio).toBePresent();
        await expect(this.btn_Saltar).toBePresent();
        console.log("Preciono el boton Saltar");
    }
    async tabSaltar() {
        await driver.pause(500);
        await this.btn_Saltar.click();
        console.log("Preciono el boton Saltar");
    }
    async tabAccesoClientes() {
        await driver.pause(500);
        await this.btn_Continuar.click();
        console.log("Preciono el boton Acceso Cliente");
    }
    async tabContinuar() {
        await driver.pause(500);
        await this.btn_Continuar.click();
        console.log("Preciono el boton Acceso Cliente");
    }
    async tabIniciarSesion() {
        await driver.pause(500);
        await this.btn_Iniciar_sesion.click();
        console.log("Preciono el boton Iniciar sesion");
    }
    async inputCredentials(username, password) {
        console.log("Input credentials: " + username + " " + password);
        try {
            await expect(this.btn_ini).toBeDisplayed();
            await this.lbl_Usuario.click();
            await driver.pause(300);
            await this.input_Usuario.addValue(username);
            await driver.pause(300);
            await this.lbl_Contrasena.click();
            await driver.pause(300);
            await this.input_Contrasena.addValue(password);
            await driver.hideKeyboard();
            await this.btn_ini.click();
            await driver.pause(5000);
            const errorMessage = await $('//android.widget.TextView[@text="El usuario o la contraseña no son correctos"]');
            if (await errorMessage.isDisplayed()) {
                await browser.saveScreenshot('./error-screenshots/login-error.png');
                throw new Error("Login failed: El usuario o la contraseña no son correctos");
            }
            console.log("Login successful");
        }
        catch (error) {
            console.error("Error during login: ", error.message);
            throw error;
        }
    }
    async loginDashboard() {
        console.log("I see the dashboard");
        await driver.pause(4000);
        await browser.pause(500);
    }
}
exports.default = new LoginPage();
