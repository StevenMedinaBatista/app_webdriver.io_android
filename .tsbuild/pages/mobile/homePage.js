"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = __importDefault(require("./page"));
const commonsPage_1 = __importDefault(require("./commonsPage"));
class HomePage extends page_1.default {
    get x_icon() { return $('(//android.widget.ImageView[@content-desc="forward"])[1]'); }
    get contrasenaInput() { return $('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText/android.view.View'); }
    get menuBtn() { return $('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.widget.Button'); }
    get back_icon() { return $('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]'); }
    get permisoMovil_alert() { return $('//android.widget.TextView[@text="YAVÁ requiere colectar, almacenar, enviar y procesar:"]'); }
    async validate() {
        console.log("Validate Home");
        await driver.pause(300);
        if (await (await this.permisoMovil_alert).isDisplayed()) {
            await driver.pause(200);
            const permitir_button = "ACEPTAR";
            await commonsPage_1.default.tapbytext(permitir_button);
        }
        const acceder_button = "Acceder";
        await commonsPage_1.default.validateXpath(acceder_button) == true;
        const hazteCliente_button = "Hazte cliente";
        await commonsPage_1.default.validateXpath(hazteCliente_button) == true;
    }
    async tapToAccess() {
        console.log("Tap To access");
        const acceder_button = "Acceder";
        await commonsPage_1.default.tapbytext(acceder_button);
    }
    async tapBecomeACustomer() {
        console.log("Tap Become a customer");
        const hazteCliente_button = "Hazte cliente";
        await commonsPage_1.default.tapbytext(hazteCliente_button);
    }
    async closeSesion() {
        await driver.pause(5000);
        console.log("Close Sesion");
        if (await (await this.contrasenaInput).isDisplayed()) {
            await driver.pause(200);
            await this.menuBtn.click();
            await driver.pause(200);
            const cerrarSesionBtn = "Cerrar sesión";
            await commonsPage_1.default.validateXpath(cerrarSesionBtn) == true;
            await commonsPage_1.default.tapbytext(cerrarSesionBtn);
            await driver.pause(200);
            const continuarBtn = "Desvincular";
            await commonsPage_1.default.validateXpath(continuarBtn) == true;
            await commonsPage_1.default.tapbytext(continuarBtn);
            await expect(this.back_icon).toBePresent();
            await this.back_icon.click();
        }
    }
}
exports.default = new HomePage();
