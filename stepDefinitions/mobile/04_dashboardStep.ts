/**
 * Author: Steven Medina Batista.
 */

import { Before, Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import LoginPage from "../../pages/mobile/loginPage";
import SplashPage from "../../pages/mobile/splashPage";
import HamburgerMenu from "../../pages/mobile/03_hamburgerMenuPage"
import DashboardPage from "../../pages/mobile/04_dashboardPage"



Given ('I am on the brokerage accounts section', async () => {
    await DashboardPage.validateCarrousel();
});


Then('the profile menu displays the {string} item', async (option: string) => {
    await DashboardPage.validateMenuOptions([option]);
});

Then('the documentos importantes screen is displayed', async () => {
    await DashboardPage.validateImportantDocumentsScreen();
});

Then('a confirmation message is shown to Desvincular dispositivo', async () => {
    await DashboardPage.validateUnlinkDeviceScreen();
});

Then('the user is redirected to the Configuraciones screen', async () => {
    await DashboardPage.validateSettingsScreen();
});

Then('the user is redirected to the Salir PopUp', async () => {
    await DashboardPage.validatePoUpSalir();
});

Then('the brokerage accounts are validated depending on the number of accounts', async () => {
    await DashboardPage.validateDynamicBrokerageAccounts();
});

Then('the brokerage account detail screen is displayed', async () => {
    await DashboardPage.validateInformacionDeCuentas();
});

Then('the investment summary is displayed', async () => {
    await DashboardPage.validateVerMas();
});


When('I validate that we are on the My Profile screen', async () => {
    await DashboardPage.validateMiPerfil();
});

When('the user taps the profile icon on the Dashboard', async () => {
    await DashboardPage.tapProfileIcon();
});

When('selects the {string} option', async (option: string) => {
    await DashboardPage.selectProfileOption(option);
});

When('I tap anywhere on the brokerage account card', async () => {
    // await DashboardPage.tapCarruselAccountCard();
});

When('I tap the {string} button on a brokerage account with investments', async (buttonText: string) => {
    if (buttonText === 'Ver más') {
        await DashboardPage.tapVerMas();
    }
    // Cuando tenga "Ver menos" lo manejo por aqui mismo
});

