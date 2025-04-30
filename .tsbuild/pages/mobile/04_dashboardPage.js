"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = __importDefault(require("./page"));
const commonsPage_1 = __importDefault(require("./commonsPage"));
class DashboardPage extends page_1.default {
    get btn_ID() { return $('//android.widget.TextView[@text="ID"]'); }
    get txt_noCuenta() { return $('//android.widget.TextView[@text="No. de cuenta"]'); }
    get txt_verMas() { return $('//android.widget.TextView[@text="Ver más"]'); }
    ;
    get txt_miPortafolio() { return $('//android.widget.TextView[@text="Mi portafolio"]'); }
    get img_invertirEnMi() { return $('//android.widget.ScrollView/android.view.View[3]'); }
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
    getOption(option) { return $(`//android.widget.TextView[@text="${option}"]`); }
    async validate() {
        console.log("Validate Dashboard");
        await expect(this.btn_ID).toBePresent();
        await expect(this.txt_noCuenta).toBePresent();
        await expect(this.txt_verMas).toBePresent();
        await expect(this.txt_miPortafolio).toBePresent();
        await expect(this.img_invertirEnMi).toBePresent();
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
    async tapProfileIcon() {
        await this.btn_ID.waitForDisplayed({ timeout: 5000 });
        await this.btn_ID.click();
    }
    async selectOption(option) {
        const el = await this.getOption(option);
        await el.waitForDisplayed({ timeout: 5000 });
        await el.click();
    }
}
exports.default = new DashboardPage();
