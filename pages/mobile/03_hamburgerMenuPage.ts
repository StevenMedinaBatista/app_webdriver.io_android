import Page from './page';
import commonsPage from './commonsPage';

class LoginPage extends Page {  

    get txt_consulta_tus_inversiones_En_TodoMomento() { return $('') }
    get iconClose(){ return $('//android.widget.ImageView[@content-desc="icon_close"]')}
    get iconHamburgerMenu(){ return $('(//android.widget.ImageView[@content-desc="icon_close"])[1]')}
    get btn_IniciarSesion() { return $('//android.widget.TextView[@text="Iniciar sesión"]') }
    get btn_Registrate2() { return $('//android.widget.TextView[@text="¿Aún no te has registrado? Regístrate"]') }
    get btn_Registrate() { return $('//android.widget.TextView[@text="¿Aún no te has registrado?"]') }
    get btn_HazteInversionista() { return $('//android.widget.TextView[@text="Hazte inversionista"]') }
    get HamburgerMenu() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View') }
    get txt_ProteccionAlUsuario() { return $('-android uiautomator:new UiSelector().text(\"PROTECCIÓN AL USUARIO\")') }
    get txt_Servicios() { return $('//android.widget.TextView[@text="SERVICIOS"]') }
    get txt_Seguridad() { return $('//android.widget.TextView[@text="SEGURIDAD"]') }
    get btn_TerminosYcondiciones() { return $('//android.widget.TextView[@text="Términos y condiciones"]') }
    // get page_TerminosYcondiciones() { return $('//android.webkit.WebView') }
    get btn_Responsabilidades() { return $('//android.widget.TextView[@text="Responsabilidades"]') }
    get btn_PoliticasDePrivacidad() { return $('//android.widget.TextView[@text="Políticas de privacidad"]') }
    get btn_TarifarioDeServicios() { return $('//android.widget.TextView[@text="Tarifario de servicios"]') }
    get btn_SugerenciasYReclamaciones() { return $('//android.widget.TextView[@text="Sugerencias y reclamaciones"]') }
    get title_EnInversionesPopularTeLeemos() { return $('//android.widget.TextView[@text="¡En Inversiones Popular te leemos!"]') }
    get txt_TienesAlgunaDuda() { return $('//android.widget.TextView[@text="¡En Inversiones Popular te leemos!"]') }
    get page_EnInversionesPopularTeLeemos() { return $('//android.widget.TextView[@text="¿Tienes alguna duda, deseas realizar una sugerencia o reclamación sobre algunos de nuestros productos o servicios?"]') }
    get btn_DesvincularUsuario() { return $('//android.widget.TextView[@text="Desvincular usuario"]') }
    get btn_Desvincular() { return $('//android.widget.TextView[@text="Desvincular"]') }
    get btn_Cancelar() { return $('//android.widget.TextView[@text="Cancelar"]') }
    get txt_EstasSeguroQueDeseasDesvincularTuUsuario() { return $('//android.widget.TextView[@text="¿Estás seguro que deseas desvincular tu usuario?"]') }


    
    
    
    async validate(): Promise<void> {
        console.log("Validate Login");
        const iniciarSesion_button: string = "Iniciar sesión"
        await commonsPage.validateXpath(iniciarSesion_button) == true;
        const hazteCliente_button: string = "Hazte cliente"
        await commonsPage.validateXpath(hazteCliente_button) == true;
        const pulsaAqui_link: string = "¿Problemas para iniciar sesión? Pulsa aquí."
        await commonsPage.validateXpath(pulsaAqui_link) == true;
    }

    async tabIconClose(): Promise<void> {
        await expect(this.iconClose).toBeDisplayed();
        await this.iconClose.click()
    }

    async tabHamburgerMenu(): Promise<void> {
        await expect(this.iconHamburgerMenu).toBeDisplayed();
        await this.iconHamburgerMenu.click()
    }

    async preLoginScreen(): Promise<void> {
        await expect(this.btn_Registrate).toBeDisplayed();
        await expect(this.btn_HazteInversionista).toBeDisplayed();
        await expect(this.btn_IniciarSesion).toBeDisplayed();
    }

    async hamburgerMenuValidation(): Promise<void> {
        await expect(this.HamburgerMenu).toBeDisplayed();
    }

    async userProtectionSection(): Promise<void> {
        await expect(this.txt_ProteccionAlUsuario).toBeDisplayed();
    }

    async servicesSection(): Promise<void> {
        await expect(this.txt_Servicios).toBeDisplayed();
    }

    async securitySection(): Promise<void> {
        await expect(this.txt_Seguridad).toBeDisplayed();
    }

    async tabAnValidationTermsAndConditions(): Promise<void> {
        await expect(this.txt_ProteccionAlUsuario).toBeDisplayed();
        await expect(this.btn_TerminosYcondiciones).toBeDisplayed();
        await this.btn_TerminosYcondiciones.click()
    }

    async tabAnValidationPoliciesAndPrivacy(): Promise<void> {
        await expect(this.txt_ProteccionAlUsuario).toBeDisplayed();
        await expect(this.btn_PoliticasDePrivacidad).toBeDisplayed();
        await this.btn_PoliticasDePrivacidad.click()
    }

    async tabAnValidationResponsibilities(): Promise<void> {
        await expect(this.txt_ProteccionAlUsuario).toBeDisplayed();
        await expect(this.btn_Responsabilidades).toBeDisplayed();
        await this.btn_Responsabilidades.click()
    }

    async tabAnValidationServicesTariffChart(): Promise<void> {
        await expect(this.txt_Servicios).toBeDisplayed();
        await expect(this.btn_TarifarioDeServicios).toBeDisplayed();
        await this.btn_TarifarioDeServicios.click()
    }

    async tabAnValidationSugerenciasYReclamaciones(): Promise<void> {
        await expect(this.txt_Seguridad).toBeDisplayed();
        await expect(this.btn_SugerenciasYReclamaciones).toBeDisplayed();
        await this.btn_SugerenciasYReclamaciones.click()
    }

    async tabAnValidationDesvincularUsuario(): Promise<void> {
        await expect(this.txt_Seguridad).toBeDisplayed();
        await expect(this.btn_DesvincularUsuario).toBeDisplayed();
        await this.btn_DesvincularUsuario.click()
        await driver.pause(1000);
        await expect(this.txt_EstasSeguroQueDeseasDesvincularTuUsuario).toBeDisplayed();
        await expect(this.btn_Desvincular).toBeDisplayed();
        await expect(this.btn_Cancelar).toBeDisplayed();
    }
    
    async validattionTermsAndConditions(): Promise<void> {
        await expect(this.btn_TerminosYcondiciones).toBeDisplayed();
    }

    async validattionResponsibilities(): Promise<void> {
        await expect(this.btn_Responsabilidades).toBeDisplayed();
    }

    async validattionPoliciesPrivacy(): Promise<void> {
        await expect(this.btn_PoliticasDePrivacidad).toBeDisplayed();
    }
    
    async validattiontitleEnInversionesPopularTeLeemos(): Promise<void> {
        await expect(this.title_EnInversionesPopularTeLeemos).toBeDisplayed();
        await expect(this.txt_TienesAlgunaDuda).toBeDisplayed();
        await expect(this.page_EnInversionesPopularTeLeemos).toBeDisplayed();
    }

    async validattionDesvincularAndCancelar(): Promise<void> {
        await expect(this.txt_EstasSeguroQueDeseasDesvincularTuUsuario).toBeDisplayed();
        await expect(this.btn_Desvincular).toBeDisplayed();
        await expect(this.btn_Cancelar).toBeDisplayed();
    }

    async clickDesvincularButton(): Promise<void> {
        await this.btn_Desvincular.click();
    }
    
    async clickCancelarButton(): Promise<void> {
        await this.btn_Cancelar.click();
    }
    
    async validateLoginNoLinkedUsers(): Promise<void> {
        // Verifica que la pantalla de "Login-no Vinculados" se muestre
        await expect(this.txt_EstasSeguroQueDeseasDesvincularTuUsuario).toBeDisplayed();
    }
    

}

export default new LoginPage();
