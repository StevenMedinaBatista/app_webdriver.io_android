import Page from './page';
import commonsPage from './commonsPage';

class DashboardPage extends Page {

    //* Pantalla Dashboard

    get btn_ID() { return $('//android.widget.TextView[@text="ID"]') }
    get txt_noCuenta() { return $('//android.widget.TextView[@text="No. de cuenta"]') }
    get txt_verMas() { return $('//android.widget.TextView[@text="Ver más"]') };
    get txt_miPortafolio() { return $('//android.widget.TextView[@text="Mi portafolio"]') }
    get img_invertirEnMi() { return $('//android.widget.ScrollView/android.view.View[3]') }


    //* Pantalla Mi Perfil

    get btn_miPerfil() { return $('//android.widget.TextView[@text="Mi perfil"]') };

    get btn_documentosImportantes() { return $('//android.widget.TextView[@text="Documentos importantes"]') };
    get txt_encuentraLosDocumentosImportantes() { return $('//android.widget.TextView[@text="Encuentra los documentos relacionados a la apertura de tu perfil"]') };

    get btn_desvincularDispositivo() { return $('//android.widget.TextView[@text="Desvincular dispositivo"]') };
    get txt_usaloCuandoPierdas() { return $('//android.widget.TextView[@text="Úsalo cuando pierdas o cambies tus dispositivos"]') };

    get btn_configuraciones() { return $('//android.widget.TextView[@text="Configuraciones"]') };
    get btn_configuraLaContrasena() { return $('//android.widget.TextView[@text="Configura la contraseña y el inicio de sesión rápida"]') };

    get btn_salir() { return $('//android.widget.TextView[@text="Salir"]') };

    getOption(option: string) {return $(`//android.widget.TextView[@text="${option}"]`); }
    



    async validate(): Promise<void> {
        console.log("Validate Dashboard");
        await expect(this.btn_ID).toBePresent();
        await expect(this.txt_noCuenta).toBePresent();
        await expect(this.txt_verMas).toBePresent();
        await expect(this.txt_miPortafolio).toBePresent();
        await expect(this.img_invertirEnMi).toBePresent();
    }

    async validateMiPerfil(): Promise<void> {
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

    async validateRetiroDeEfectivoActivos(): Promise<void> {
        console.log("Validate Retiro de Efectivo Activo...");
        const retiroEfectivo_lbl: string = "Retiro de Efectivo";
        const activos_txt: string = ("Activos");
        const verDetallesBtn: string = "Ver detalles";
        const cancelarCodigoBtn: string = "Cancelar código";

        await commonsPage.validateXpath(retiroEfectivo_lbl) == true;
        await commonsPage.validateXpath(activos_txt) == true;
        await commonsPage.validateXpath(verDetallesBtn) == true;
        await commonsPage.validateXpath(cancelarCodigoBtn) == true;
    }

    async validateMenuOptions(options: string[]): Promise<void> {
        for (const option of options) {
          const el = await this.getOption(option);
          await el.waitForDisplayed({ timeout: 5000 });
        }
    }


    async validateOptionsExist(options: string[]): Promise<void> {
        for (const option of options) {
          const el = await $(`~${option}`);
          await el.waitForDisplayed({ timeout: 5000 });
        }
    }


    // Taps

    async tapProfileIcon(): Promise<void> {
        await this.btn_ID.waitForDisplayed({ timeout: 5000 });
        await this.btn_ID.click();
    }

    async selectOption(option: string): Promise<void> {
        const el = await this.getOption(option);
        await el.waitForDisplayed({ timeout: 5000 });
        await el.click();
    }

}

export default new DashboardPage();