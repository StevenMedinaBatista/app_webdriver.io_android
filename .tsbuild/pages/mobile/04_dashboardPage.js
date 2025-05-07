"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = __importDefault(require("./page"));
const commonsPage_1 = __importDefault(require("./commonsPage"));
class DashboardPage extends page_1.default {
    get btn_ID() { return $('//android.widget.TextView[@text="ID"]'); }
    get carruselDeCuentas() { return $('//android.widget.ScrollView/android.view.View[1]'); }
    get txt_noCuenta() { return $('//android.widget.TextView[@text="No. de cuenta"]'); }
    get txt_verMas() { return $('//android.widget.TextView[@text="Ver más"]'); }
    ;
    get txt_verMenos() { return $('//android.widget.TextView[@text="Ver menos"]'); }
    ;
    get txt_miPortafolio() { return $('//android.widget.TextView[@text="Mi portafolio"]'); }
    get img_invertirEnMi() { return $('//android.widget.ScrollView/android.view.View[3]'); }
    get txt_totalDeInversiones() { return $('//android.widget.TextView[@text="Total de inversiones:"]'); }
    ;
    get txt_valoresDop() { return $('//android.widget.TextView[@text="Valores DOP"]'); }
    ;
    get txt_Producto() { return $('//android.widget.TextView[@text="  Producto"]'); }
    ;
    get btn_miPerfil() { return $('//android.widget.TextView[@text="Mi perfil"]'); }
    ;
    get btn_documentosImportantes() { return $('//android.widget.TextView[@text="Documentos importantes"]'); }
    ;
    get txt_encuentraLosDocumentosImportantes() { return $('//android.widget.TextView[@text="Encuentra los documentos relacionados a la apertura de tu perfil"]'); }
    ;
    get btn_desvincularDispositivo() { return $('//android.widget.TextView[@text="Desvincular dispositivo"]'); }
    ;
    get txt_usaloCuandoPierdas() { return $('//android.widget.TextView[@text="Úsalo cuando pierdas o cambies tus dispositivos"]'); }
    ;
    get btn_configuraciones() { return $('//android.widget.TextView[@text="Configuraciones"]'); }
    ;
    get btn_configuraLaContrasena() { return $('//android.widget.TextView[@text="Configura la contraseña y el inicio de sesión rápida"]'); }
    ;
    get btn_salir() { return $('//android.widget.TextView[@text="Salir"]'); }
    ;
    get txt_documentosFirmadosEnNuestraAplicacion() { return $('//android.widget.TextView[@text="Documentos firmados en nuestra aplicación:"]'); }
    ;
    get btn_terminosYcondiciones() { return $('//android.widget.TextView[@text="Términos y condiciones"]'); }
    ;
    get txt_dispositivoVinculadoAestaCuenta() { return $('//android.widget.TextView[@text="Dispositivo vinculado a esta cuenta con sesión abierta:"]'); }
    ;
    get icon_basura() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View'); }
    ;
    get txt_cambiarMiContrasena() { return $('//android.widget.TextView[@text="Cambiar mi contraseña"]'); }
    ;
    get icon_dropdown() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View/android.view.View[2]/android.view.View'); }
    ;
    get txt_seguroQueDeseaSalir() { return $('//android.widget.TextView[@text="¿Seguro que deseas salir?"]'); }
    ;
    get txt_estasDejandoLaAplicacion() { return $('//android.widget.TextView[@text="Estás dejando la aplicación."]'); }
    ;
    get btn_cerrarSesion() { return $('//android.widget.TextView[@text="Cerrar sesión"]'); }
    ;
    get btn_cancelar() { return $('//android.widget.TextView[@text="Cancelar"]'); }
    ;
    get txt_numeroDeCuentaCarretaje() { return $('//android.widget.TextView[@text="Número de cuenta de corretaje"]'); }
    ;
    get txt_tipoDeCuenta() { return $('//android.widget.TextView[@text="Tipo de cuenta"]'); }
    ;
    get txt_fechaDeApertura() { return $('//android.widget.TextView[@text="Fecha de apertura"]'); }
    ;
    get txt_codigoDelCliente() { return $('//android.widget.TextView[@text="Código del cliente"]'); }
    ;
    get txt_cuentasAsociadas() { return $('//android.widget.TextView[@text="Cuenta(s) asociada(s)"]'); }
    ;
    get txt_entidad() { return $('//android.widget.TextView[@text="Entidad"]'); }
    ;
    get txt_numeracion() { return $('//android.widget.TextView[@text="Numeración"]'); }
    ;
    getOption(option) { return $(`//android.widget.TextView[@text="${option}"]`); }
    async validate() {
        console.log("Validate Dashboard");
        await expect(this.btn_ID).toBePresent();
        await expect(this.txt_noCuenta).toBePresent();
        await expect(this.txt_verMas).toBePresent();
        await expect(this.txt_miPortafolio).toBePresent();
        await expect(this.img_invertirEnMi).toBePresent();
    }
    async validateCarrousel() {
        console.log("Validate card Carrousel...");
        await expect(this.carruselDeCuentas).toBePresent();
        await expect(this.txt_noCuenta).toBePresent();
        await expect(this.txt_verMas).toBePresent();
    }
    async validateVerMas() {
        console.log("Validate card Ver Mas");
        await expect(this.txt_totalDeInversiones).toBePresent();
        await expect(this.txt_valoresDop).toBePresent();
        await expect(this.txt_Producto).toBePresent();
    }
    async validateMiPerfil() {
        console.log("Validate Mi Perfil...");
        await expect(this.btn_miPerfil).toBePresent();
        await expect(this.btn_documentosImportantes).toBePresent();
        await expect(this.txt_encuentraLosDocumentosImportantes).toBePresent();
        await expect(this.btn_desvincularDispositivo).toBePresent();
        await expect(this.txt_usaloCuandoPierdas).toBePresent();
        await expect(this.btn_configuraciones).toBePresent();
        await expect(this.btn_configuraLaContrasena).toBePresent();
        await expect(this.btn_salir).toBePresent();
    }
    async validateRetiroDeEfectivoActivos() {
        console.log("Validate Retiro de Efectivo Activo...");
        const retiroEfectivo_lbl = "Retiro de Efectivo";
        const activos_txt = ("Activos");
        const verDetallesBtn = "Ver detalles";
        const cancelarCodigoBtn = "Cancelar código";
        await commonsPage_1.default.validateXpath(retiroEfectivo_lbl) == true;
        await commonsPage_1.default.validateXpath(activos_txt) == true;
        await commonsPage_1.default.validateXpath(verDetallesBtn) == true;
        await commonsPage_1.default.validateXpath(cancelarCodigoBtn) == true;
    }
    async validateMenuOptions(options) {
        for (const option of options) {
            const el = await this.getOption(option);
            await el.waitForDisplayed({ timeout: 5000 });
        }
    }
    async validateOptionsExist(options) {
        for (const option of options) {
            const el = await $(`~${option}`);
            await el.waitForDisplayed({ timeout: 5000 });
        }
    }
    async validateImportantDocumentsScreen() {
        console.log("Validate Documentos Importantes...");
        await expect(this.btn_documentosImportantes).toBePresent();
        await expect(this.txt_documentosFirmadosEnNuestraAplicacion).toBePresent();
        await expect(this.btn_terminosYcondiciones).toBePresent();
    }
    async validateUnlinkDeviceScreen() {
        console.log("Validate Desvincular Dispositivos...");
        await expect(this.btn_desvincularDispositivo).toBePresent();
        await expect(this.txt_dispositivoVinculadoAestaCuenta).toBePresent();
        await expect(this.icon_basura).toBePresent();
    }
    async validateSettingsScreen() {
        console.log("Validate Configuraciones...");
        await expect(this.btn_configuraciones).toBePresent();
        await expect(this.txt_cambiarMiContrasena).toBePresent();
        await expect(this.icon_dropdown).toBePresent();
    }
    async validatePoUpSalir() {
        console.log("Validate PopUp Salir.");
        await expect(this.txt_seguroQueDeseaSalir).toBePresent();
        await expect(this.txt_estasDejandoLaAplicacion).toBePresent();
        await expect(this.btn_cerrarSesion).toBePresent();
        await expect(this.btn_cancelar).toBePresent();
    }
    async validateInformacionDeCuentas() {
        console.log("Validate Informacion De Cuentas...");
        await expect(this.txt_numeroDeCuentaCarretaje).toBePresent();
        await expect(this.txt_tipoDeCuenta).toBePresent();
        await expect(this.txt_fechaDeApertura).toBePresent();
        await expect(this.txt_codigoDelCliente).toBePresent();
        await expect(this.txt_cuentasAsociadas).toBePresent();
        await expect(this.txt_entidad).toBePresent();
        await expect(this.txt_numeracion).toBePresent();
    }
    async validateDynamicBrokerageAccounts() {
        const section = await $('//android.widget.TextView[@text="No. de cuenta"]');
        await section.waitForDisplayed({ timeout: 5000 });
        const cards = await $$('//android.widget.ScrollView/android.view.View[1]');
        if (cards.length === 0) {
            const emptyMsg = await $('//android.widget.TextView[contains(@text,"No posee productos disponibles")]');
            await emptyMsg.waitForDisplayed({ timeout: 5000 });
            console.log('Usuario con cuenta sin productos');
        }
        else if (cards.length === 1) {
            await cards[0].waitForDisplayed({ timeout: 5000 });
            console.log('Usuario con una cuenta de corretaje');
        }
        else {
            await cards[0].waitForDisplayed({ timeout: 5000 });
            console.log(`Usuario con múltiples cuentas (${cards.length})`);
            for (let i = 0; i < cards.length - 1; i++) {
                const startX = 900;
                const startY = 650;
                const endX = 200;
                const endY = 650;
                await browser.touchAction([
                    { action: 'press', x: startX, y: startY },
                    { action: 'moveTo', x: endX, y: endY },
                    'release'
                ]);
                await driver.pause(800);
            }
        }
    }
    async tapProfileIcon() {
        await this.btn_ID.waitForDisplayed({ timeout: 5000 });
        await this.btn_ID.click();
    }
    async tapCarruselAccountCard() {
        await expect(this.carruselDeCuentas).toBePresent();
        await this.carruselDeCuentas.click();
    }
    async tapVerMas() {
        await expect(this.txt_verMas).toBePresent();
        await this.txt_verMas.click();
    }
    async tapVerMenos() {
        await expect(this.txt_verMenos).toBePresent();
        await this.txt_verMenos.click();
    }
    async selectOption(option) {
        const el = await this.getOption(option);
        await el.waitForDisplayed({ timeout: 5000 });
        await el.click();
    }
    async selectProfileOption(option) {
        const el = await this.getOption(option);
        await el.waitForDisplayed({ timeout: 5000 });
        await el.click();
    }
}
exports.default = new DashboardPage();
