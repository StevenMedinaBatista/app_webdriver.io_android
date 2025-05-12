import Page from './page';
import commonsPage from './commonsPage';
import type { Element, ChainablePromiseElement } from 'webdriverio';


export type InvestmentPurpose =
  | 'Comprar bienes'
  | 'Diversificar patrimonio'
  | 'Pago de estudios'
  | 'Proyecto de vida'
  | 'Viajar';


class DashboardPage extends Page {

    //* Pantalla Dashboard

    get btn_ID() { return $('//android.widget.TextView[@text="ID"]') }
    get carruselDeCuentas() { return $('//android.widget.ScrollView/android.view.View[1]') }
    get txt_noCuenta() { return $('//android.widget.TextView[@text="No. de cuenta"]') }
    get txt_verMas() { return $('//android.widget.TextView[@text="Ver más"]') };
    get txt_verMenos() { return $('//android.widget.TextView[@text="Ver menos"]') };
    get txt_miPortafolio() { return $('//android.widget.TextView[@text="Mi portafolio"]') }
    get card_miPortafolio() { return $('//android.widget.ScrollView/android.view.View[2]') }
    get img_invertirEnMi() { return $('//android.widget.ScrollView/android.view.View[3]') }
    get txt_inicio() { return $('//android.widget.TextView[@text="Inicio"]') };
    get txt_invertir() { return $('//android.widget.TextView[@text="Invertir"]') };
    get txt_servicios() { return $('//android.widget.TextView[@text="Servicios"]') };
    get txt_especialista() { return $('//android.widget.TextView[@text="Especialista"]') };



    //* Pantalla PopUp Ver Mas

    get txt_totalDeInversiones() { return $('//android.widget.TextView[@text="Total de inversiones:"]') };
    get txt_valoresDop() { return $('//android.widget.TextView[@text="Valores DOP"]') };
    get txt_Producto() { return $('//android.widget.TextView[@text="  Producto"]') };


    //* Pantalla Mi Perfil

    get btn_miPerfil() { return $('//android.widget.TextView[@text="Mi perfil"]') };

    get btn_documentosImportantes() { return $('//android.widget.TextView[@text="Documentos importantes"]') };
    get txt_encuentraLosDocumentosImportantes() { return $('//android.widget.TextView[@text="Encuentra los documentos relacionados a la apertura de tu perfil"]') };

    get btn_desvincularDispositivo() { return $('//android.widget.TextView[@text="Desvincular dispositivo"]') };
    get txt_usaloCuandoPierdas() { return $('//android.widget.TextView[@text="Úsalo cuando pierdas o cambies tus dispositivos"]') };

    get btn_configuraciones() { return $('//android.widget.TextView[@text="Configuraciones"]') };
    get btn_configuraLaContrasena() { return $('//android.widget.TextView[@text="Configura la contraseña y el inicio de sesión rápida"]') };

    get btn_salir() { return $('//android.widget.TextView[@text="Salir"]') };


    //* Pantalla Documentos importantes

    // se repite el text documentos importantes
    get txt_documentosFirmadosEnNuestraAplicacion() { return $('//android.widget.TextView[@text="Documentos firmados en nuestra aplicación:"]') };
    get btn_terminosYcondiciones() { return $('//android.widget.TextView[@text="Términos y condiciones"]') };


    //* Pantalla Desvincular Usuario

    // Se repite el texto Desvincular Dispositivos
    get txt_dispositivoVinculadoAestaCuenta() { return $('//android.widget.TextView[@text="Dispositivo vinculado a esta cuenta con sesión abierta:"]') };
    get icon_basura() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View') };

    
    //* Pantalla Configuraciones
    
    // Se repite el texto Configuraciones
    get txt_cambiarMiContrasena() { return $('//android.widget.TextView[@text="Cambiar mi contraseña"]') };
    get icon_dropdown() { return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View/android.view.View[2]/android.view.View') };


    //* Pantalla Salir
    get txt_seguroQueDeseaSalir() { return $('//android.widget.TextView[@text="¿Seguro que deseas salir?"]') };
    get txt_estasDejandoLaAplicacion() { return $('//android.widget.TextView[@text="Estás dejando la aplicación."]') };
    get btn_cerrarSesion() { return $('//android.widget.TextView[@text="Cerrar sesión"]') };
    get btn_cancelar() { return $('//android.widget.TextView[@text="Cancelar"]') };
    

    //* Pantalla Informacion de Cuentas
    get txt_numeroDeCuentaCarretaje() { return $('//android.widget.TextView[@text="Número de cuenta de corretaje"]') };
    get txt_tipoDeCuenta() { return $('//android.widget.TextView[@text="Tipo de cuenta"]') };
    get txt_fechaDeApertura() { return $('//android.widget.TextView[@text="Fecha de apertura"]') };
    get txt_codigoDelCliente() { return $('//android.widget.TextView[@text="Código del cliente"]') };
    get txt_cuentasAsociadas() { return $('//android.widget.TextView[@text="Cuenta(s) asociada(s)"]') };
    get txt_entidad() { return $('//android.widget.TextView[@text="Entidad"]') };
    get txt_numeracion() { return $('//android.widget.TextView[@text="Numeración"]') };


    //* Pantalla Informacion de Cuentas
    get txt_invertirEnMi() { return $('//android.widget.TextView[@text="Quiero invertir en mi…"]') };
    get txt_lasInversionesSonClaves() { return $('//android.widget.TextView[@text="Las inversiones son claves al momento de aumentar tus ahorros. Dependiendo de tus aspiraciones, edad, ingresos y perspectivas del futuro, estas inversiones pueden ser:"]') };
    get btn_comprarBienes() { return $('//android.widget.ScrollView/android.view.View[1]') };
    get txt_diversificarPatrimonio() { return $('//android.widget.TextView[@text="Diversificar patrimonio"]') };
    get txt_pagoDeEstudios() { return $('//android.widget.TextView[@text="Pago de estudios"]') };
    get txt_proyectoDeVida() { return $('//android.widget.TextView[@text="Proyecto de vida"]') };
    get txt_viajar() { return $('//android.widget.TextView[@text="Viajar"]') };
    get back_arrow() { return $('//android.widget.Button') };

    


    getOption(option: string) {return $(`//android.widget.TextView[@text="${option}"]`); }



    async validate(): Promise<void> {
        console.log("Validate Dashboard");
        await expect(this.btn_ID).toBePresent();
        await expect(this.txt_noCuenta).toBePresent();
        await expect(this.txt_verMas).toBePresent();
        await expect(this.txt_miPortafolio).toBePresent();
        await expect(this.img_invertirEnMi).toBePresent();
    }

    async validateCarrousel(): Promise<void> {
        console.log("Validate card Carrousel...");
        await expect(this.carruselDeCuentas).toBePresent();
        await expect(this.txt_noCuenta).toBePresent();
        await expect(this.txt_verMas).toBePresent();
    }

    async validateMiPortafolio(): Promise<void> {
        console.log("Validate Mi Portafolio");
        await expect(this.txt_miPortafolio).toBePresent();
        await expect(this.card_miPortafolio).toBePresent();
    }

    async validateVerMas(): Promise<void> {
        console.log("Validate card Ver Mas");
        await expect(this.txt_totalDeInversiones).toBePresent();
        await expect(this.txt_valoresDop).toBePresent();
        await expect(this.txt_Producto).toBePresent();
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

    async validateImportantDocumentsScreen(): Promise<void> {
        console.log("Validate Documentos Importantes...");
        await expect(this.btn_documentosImportantes).toBePresent();
        await expect(this.txt_documentosFirmadosEnNuestraAplicacion).toBePresent();
        await expect(this.btn_terminosYcondiciones).toBePresent();
    }

    async validateUnlinkDeviceScreen(): Promise<void> {
        console.log("Validate Desvincular Dispositivos...");
        await expect(this.btn_desvincularDispositivo).toBePresent();
        await expect(this.txt_dispositivoVinculadoAestaCuenta).toBePresent();
        await expect(this.icon_basura).toBePresent();
    }

    async validateSettingsScreen(): Promise<void> {
        console.log("Validate Configuraciones...");
        await expect(this.btn_configuraciones).toBePresent();
        await expect(this.txt_cambiarMiContrasena).toBePresent();
        await expect(this.icon_dropdown).toBePresent();
    }

    async validatePoUpSalir(): Promise<void> {
        console.log("Validate PopUp Salir.");
        await expect(this.txt_seguroQueDeseaSalir).toBePresent();
        await expect(this.txt_estasDejandoLaAplicacion).toBePresent();
        await expect(this.btn_cerrarSesion).toBePresent();
        await expect(this.btn_cancelar).toBePresent();
    }

    async validateInformacionDeCuentas(): Promise<void> {
        console.log("Validate Informacion De Cuentas...");
        await expect(this.txt_numeroDeCuentaCarretaje).toBePresent();
        await expect(this.txt_tipoDeCuenta).toBePresent();
        await expect(this.txt_fechaDeApertura).toBePresent();
        await expect(this.txt_codigoDelCliente).toBePresent();
        await expect(this.txt_cuentasAsociadas).toBePresent();
        await expect(this.txt_entidad).toBePresent();
        await expect(this.txt_numeracion).toBePresent();
    }

    async validateBannerInvertirEnMi(): Promise<void> {
        await expect(this.img_invertirEnMi).toBePresent();
    }

    async validateBannerScreenAndInvestments(): Promise<void> {
        await expect(this.txt_invertirEnMi).toBePresent();
        await expect(this.txt_lasInversionesSonClaves).toBePresent();
        await expect(this.btn_comprarBienes).toBePresent();
        await expect(this.txt_diversificarPatrimonio).toBePresent();
        await expect(this.txt_pagoDeEstudios).toBePresent();
        await expect(this.txt_proyectoDeVida).toBePresent();
        await expect(this.txt_viajar).toBePresent();
    }

    async validatePurposeDetailScreen(purpose: string): Promise<void> {
        const selector = `//*[@text="${purpose}"]`;
        const titleElement = await $(selector);
        await expect(titleElement).toBeDisplayed();
    }

    async validateDynamicBrokerageAccounts(): Promise<void> {
        const section = await $('//android.widget.TextView[@text="No. de cuenta"]');
        await section.waitForDisplayed({ timeout: 5000 });
    
        const cards = await $$('//android.widget.ScrollView/android.view.View[1]');
    
        if (cards.length === 0) {
            const emptyMsg = await $('//android.widget.TextView[contains(@text,"No posee productos disponibles")]');
            await emptyMsg.waitForDisplayed({ timeout: 5000 });
            console.log('Usuario con cuenta sin productos');
        } else if (cards.length === 1) {
            await cards[0].waitForDisplayed({ timeout: 5000 });
            console.log('Usuario con una cuenta de corretaje');
        } else {
            // Validar la primera tarjeta
            await cards[0].waitForDisplayed({ timeout: 5000 });
            console.log(`Usuario con múltiples cuentas (${cards.length})`);
    
            // Realizar desplazamientos para mostrar más tarjetas
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
    
                await driver.pause(800); // Pausa ligera para que la animación termine
            }
        }
    }
    


    // Taps

    async tapProfileIcon(): Promise<void> {
        await this.btn_ID.waitForDisplayed({ timeout: 5000 });
        await this.btn_ID.click();
    }

    async tapCarruselAccountCard(): Promise<void> {
        await expect(this.carruselDeCuentas).toBePresent();
        await this.carruselDeCuentas.click();
    }

    async tapVerMas(): Promise<void> {
        await expect(this.txt_verMas).toBePresent();
        await this.txt_verMas.click();
    }

    async tapVerMenos(): Promise<void> {
        await expect(this.txt_verMenos).toBePresent();
        await this.txt_verMenos.click();
    }

    async clickInvestmentPurpose(purpose: string): Promise<void> {
        const purposes: Record<InvestmentPurpose, ChainablePromiseElement<WebdriverIO.Element>> = {
          'Comprar bienes': this.btn_comprarBienes,
          'Diversificar patrimonio': this.txt_diversificarPatrimonio,
          'Pago de estudios': this.txt_pagoDeEstudios,
          'Proyecto de vida': this.txt_proyectoDeVida,
          'Viajar': this.txt_viajar,
        };
      
        if (purpose in purposes) {
          await purposes[purpose as InvestmentPurpose].click();
        } else {
          throw new Error(`Propósito de inversión inválido: "${purpose}"`);
        }
    }
      
    

    async selectOption(option: string): Promise<void> {
        const el = await this.getOption(option);
        await el.waitForDisplayed({ timeout: 5000 });
        await el.click();
    }

    async selectProfileOption(option: string): Promise<void> {
        const el = await this.getOption(option);
        await el.waitForDisplayed({ timeout: 5000 });
        await el.click();
    }

    async clickBannerQuieroInvertirEnMi(): Promise<void> {
        (await this.img_invertirEnMi).click();
    }

    async returnToInvestmentPurposeList(): Promise<void> {
        await this.back_arrow.click();
        // await expect(this.txt_invertirEnMi).toBePresent();
    }

}

export default new DashboardPage();