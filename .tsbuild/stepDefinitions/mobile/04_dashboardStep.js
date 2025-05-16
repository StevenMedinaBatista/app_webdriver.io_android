"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const _04_dashboardPage_1 = __importDefault(require("../../pages/mobile/04_dashboardPage"));
(0, cucumber_1.Given)('I am on the brokerage accounts section', async () => {
    await _04_dashboardPage_1.default.validateCarrousel();
});
(0, cucumber_1.Given)('I have opened the investment summary', async () => {
    await _04_dashboardPage_1.default.validateCarrousel();
});
(0, cucumber_1.Given)('the user is viewing the list of investment purposes', async () => {
    await _04_dashboardPage_1.default.clickBannerQuieroInvertirEnMi();
    await _04_dashboardPage_1.default.validateBannerScreenAndInvestments();
});
(0, cucumber_1.Then)('the profile menu displays the {string} item', async (option) => {
    await _04_dashboardPage_1.default.validateMenuOptions([option]);
});
(0, cucumber_1.Then)('the documentos importantes screen is displayed', async () => {
    await _04_dashboardPage_1.default.validateImportantDocumentsScreen();
});
(0, cucumber_1.Then)('a confirmation message is shown to Desvincular dispositivo', async () => {
    await _04_dashboardPage_1.default.validateUnlinkDeviceScreen();
});
(0, cucumber_1.Then)('the user is redirected to the Configuraciones screen', async () => {
    await _04_dashboardPage_1.default.validateSettingsScreen();
});
(0, cucumber_1.Then)('the user is redirected to the Salir PopUp', async () => {
    await _04_dashboardPage_1.default.validatePoUpSalir();
});
(0, cucumber_1.Then)('the user is redirected to the Salir PopUp and exit', async () => {
    await _04_dashboardPage_1.default.validatePoUpSalir();
    await _04_dashboardPage_1.default.tapCerrarSession();
});
(0, cucumber_1.Then)('the brokerage accounts are validated depending on the number of accounts', async () => {
    await _04_dashboardPage_1.default.validateDynamicBrokerageAccounts();
});
(0, cucumber_1.Then)('the brokerage account detail screen is displayed', async () => {
    await _04_dashboardPage_1.default.validateInformacionDeCuentas();
});
(0, cucumber_1.Then)('the investment summary is displayed', async () => {
    await _04_dashboardPage_1.default.validateVerMas();
});
(0, cucumber_1.Then)('the investment summary is hidden', async () => {
    await _04_dashboardPage_1.default.validateCarrousel();
});
(0, cucumber_1.Then)('the Quiero invertir en mi banner is displayed at the bottom of the Dashboard', async () => {
    await _04_dashboardPage_1.default.validateBannerInvertirEnMi();
});
(0, cucumber_1.Then)('the Quiero invertir en mi screen and the list of investments are displayed', async () => {
    await _04_dashboardPage_1.default.validateBannerScreenAndInvestments();
});
(0, cucumber_1.When)('I validate that we are on the My Profile screen', async () => {
    await _04_dashboardPage_1.default.validateMiPerfil();
});
(0, cucumber_1.When)('the user taps the profile icon on the Dashboard', async () => {
    await _04_dashboardPage_1.default.tapProfileIcon();
});
(0, cucumber_1.When)('selects the {string} option', async (option) => {
    await _04_dashboardPage_1.default.selectProfileOption(option);
    await driver.takeScreenshot();
});
(0, cucumber_1.When)('I tap anywhere on the brokerage account card', async () => {
    await _04_dashboardPage_1.default.tapCarruselAccountCard();
});
(0, cucumber_1.When)('I tap the {string} button on a brokerage account with investments', async (buttonText) => {
    if (buttonText === 'Ver más') {
        await _04_dashboardPage_1.default.tapVerMas();
    }
    else if (buttonText === 'Ver menos') {
        await _04_dashboardPage_1.default.tapVerMenos();
    }
});
(0, cucumber_1.When)('you click the Quiero invertir en mi banner', async () => {
    await _04_dashboardPage_1.default.clickBannerQuieroInvertirEnMi();
});
(0, cucumber_1.When)(/^the user taps on the "([^"]+)" purpose$/, async (purpose) => {
    await _04_dashboardPage_1.default.clickInvestmentPurpose(purpose);
});
(0, cucumber_1.Then)('the {string} detail screen is displayed', async (purpose) => {
    await _04_dashboardPage_1.default.validatePurposeDetailScreen(purpose);
});
(0, cucumber_1.Then)('the user can return to the list of investment purposes', async () => {
    await _04_dashboardPage_1.default.returnToInvestmentPurposeList();
});
