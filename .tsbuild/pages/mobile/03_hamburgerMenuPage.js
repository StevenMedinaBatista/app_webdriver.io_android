"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = __importDefault(require("./page"));
const commonsPage_1 = __importDefault(require("./commonsPage"));
class LoginPage extends page_1.default {
    get txt_consulta_tus_inversiones_En_TodoMomento() { return $(''); }
    get iconClose() { return $('//android.widget.ImageView[@content-desc="icon_close"]'); }
    get iconHamburgerMenu() { return $('(//android.widget.ImageView[@content-desc="icon_close"])[1]'); }
    get btn_IniciarSesion() { return $('//android.widget.TextView[@text="Iniciar sesión"]'); }
    get btn_Registrate() { return $('//android.widget.TextView[@text="Regístrate"]'); }
    get btn_HazteInversionista() { return $('//android.widget.TextView[@text="Hazte inversionista"]'); }
    get HamburgerMenu() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[2]/android.view.View'); }
    get txt_ProteccionAlUsuario() { return $('//android.widget.TextView[@text="PROTECCIÓN AL USUARIO"]'); }
    get txt_Servicios() { return $('//android.widget.TextView[@text="SERVICIOS"]'); }
    get txt_Seguridad() { return $('//android.widget.TextView[@text="SEGURIDAD"]'); }
    get btn_TerminosYcondiciones() { return $('//android.widget.TextView[@text="Términos y condiciones"]'); }
    get page_TerminosYcondiciones() { return $('//android.webkit.WebView'); }
    get btn_Responsabilidades() { return $('//android.widget.TextView[@text="Responsabilidades"]'); }
    get btn_PoliticasDePrivacidad() { return $('//android.widget.TextView[@text="Políticas de privacidad"]'); }
    get btn_TarifarioDeServicios() { return $('//android.widget.TextView[@text="Tarifario de servicios"]'); }
    get btn_SugerenciasYReclamaciones() { return $('//android.widget.TextView[@text="Sugerencias y reclamaciones"]'); }
    get title_EnInversionesPopularTeLeemos() { return $('//android.widget.TextView[@text="¡En Inversiones Popular te leemos!"]'); }
    get txt_TienesAlgunaDuda() { return $('//android.widget.TextView[@text="¡En Inversiones Popular te leemos!"]'); }
    get page_EnInversionesPopularTeLeemos() { return $('//android.widget.TextView[@text="¿Tienes alguna duda, deseas realizar una sugerencia o reclamación sobre algunos de nuestros productos o servicios?"]'); }
    get btn_DesvincularUsuario() { return $('//android.widget.TextView[@text="Desvincular usuario"]'); }
    get btn_Desvincular() { return $('//android.widget.TextView[@text="Desvincular"]'); }
    get btn_Cancelar() { return $('//android.widget.TextView[@text="Cancelar"]'); }
    get txt_EstasSeguroQueDeseasDesvincularTuUsuario() { return $('//android.widget.TextView[@text="¿Estás seguro que deseas desvincular tu usuario?"]'); }
    async validate() {
        console.log("Validate Login");
        const iniciarSesion_button = "Iniciar sesión";
        await commonsPage_1.default.validateXpath(iniciarSesion_button) == true;
        const hazteCliente_button = "Hazte cliente";
        await commonsPage_1.default.validateXpath(hazteCliente_button) == true;
        const pulsaAqui_link = "¿Problemas para iniciar sesión? Pulsa aquí.";
        await commonsPage_1.default.validateXpath(pulsaAqui_link) == true;
    }
    async tabIconClose() {
        await expect(this.iconClose).toBeDisplayed();
        await this.iconClose.click();
    }
    async tabHamburgerMenu() {
        await expect(this.iconHamburgerMenu).toBeDisplayed();
        await this.iconHamburgerMenu.click();
    }
    async preLoginScreen() {
        await expect(this.btn_Registrate).toBeDisplayed();
        await expect(this.btn_HazteInversionista).toBeDisplayed();
        await expect(this.btn_IniciarSesion).toBeDisplayed();
    }
    async hamburgerMenuValidation() {
        await expect(this.HamburgerMenu).toBeDisplayed();
    }
    async userProtectionSection() {
        await expect(this.txt_ProteccionAlUsuario).toBeDisplayed();
    }
    async servicesSection() {
        await expect(this.txt_Servicios).toBeDisplayed();
    }
    async securitySection() {
        await expect(this.txt_Seguridad).toBeDisplayed();
    }
    async tabAnValidationTermsAndConditions() {
        await expect(this.txt_ProteccionAlUsuario).toBeDisplayed();
        await expect(this.btn_TerminosYcondiciones).toBeDisplayed();
        await this.btn_TerminosYcondiciones.click();
    }
    async tabAnValidationPoliciesAndPrivacy() {
        await expect(this.txt_ProteccionAlUsuario).toBeDisplayed();
        await expect(this.btn_PoliticasDePrivacidad).toBeDisplayed();
        await this.btn_PoliticasDePrivacidad.click();
    }
    async tabAnValidationResponsibilities() {
        await expect(this.txt_ProteccionAlUsuario).toBeDisplayed();
        await expect(this.btn_Responsabilidades).toBeDisplayed();
        await this.btn_Responsabilidades.click();
    }
    async tabAnValidationServicesTariffChart() {
        await expect(this.txt_Servicios).toBeDisplayed();
        await expect(this.btn_TarifarioDeServicios).toBeDisplayed();
        await this.btn_TarifarioDeServicios.click();
    }
    async tabAnValidationSugerenciasYReclamaciones() {
        await expect(this.txt_Seguridad).toBeDisplayed();
        await expect(this.btn_SugerenciasYReclamaciones).toBeDisplayed();
        await this.btn_SugerenciasYReclamaciones.click();
    }
    async tabAnValidationDesvincularUsuario() {
        await expect(this.txt_Seguridad).toBeDisplayed();
        await expect(this.btn_DesvincularUsuario).toBeDisplayed();
        await this.btn_DesvincularUsuario.click();
        await driver.pause(1000);
        await expect(this.txt_EstasSeguroQueDeseasDesvincularTuUsuario).toBeDisplayed();
        await expect(this.btn_Desvincular).toBeDisplayed();
        await expect(this.btn_Cancelar).toBeDisplayed();
    }
    async validattionTermsAndConditionsResponsibilitiesAndPoliciesPrivacy() {
        await expect(this.page_TerminosYcondiciones).toBeDisplayed();
    }
    async validattiontitleEnInversionesPopularTeLeemos() {
        await expect(this.title_EnInversionesPopularTeLeemos).toBeDisplayed();
        await expect(this.txt_TienesAlgunaDuda).toBeDisplayed();
        await expect(this.page_EnInversionesPopularTeLeemos).toBeDisplayed();
    }
    async validattionDesvincularAndCancelar() {
        await expect(this.txt_EstasSeguroQueDeseasDesvincularTuUsuario).toBeDisplayed();
        await expect(this.btn_Desvincular).toBeDisplayed();
        await expect(this.btn_Cancelar).toBeDisplayed();
    }
    async clickDesvincularButton() {
        await this.btn_Desvincular.click();
    }
    async clickCancelarButton() {
        await this.btn_Cancelar.click();
    }
    async validateLoginNoLinkedUsers() {
        await expect(this.txt_EstasSeguroQueDeseasDesvincularTuUsuario).toBeDisplayed();
    }
}
exports.default = new LoginPage();
