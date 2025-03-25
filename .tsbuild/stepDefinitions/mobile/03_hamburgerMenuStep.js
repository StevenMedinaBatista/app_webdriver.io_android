"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const _03_hamburgerMenuPage_1 = __importDefault(require("../../pages/mobile/03_hamburgerMenuPage"));
(0, cucumber_1.Before)(async () => {
    await driver.closeApp();
    await driver.launchApp();
});
(0, cucumber_1.When)('user clicks the close icon in the Login', async () => {
    await _03_hamburgerMenuPage_1.default.tabIconClose();
});
(0, cucumber_1.Then)('it will show the pre-login screen', async () => {
    await _03_hamburgerMenuPage_1.default.preLoginScreen();
});
(0, cucumber_1.When)('user clicks on the hamburger menu icon', async () => {
    await _03_hamburgerMenuPage_1.default.tabHamburgerMenu();
});
(0, cucumber_1.Then)('the hamburger menu displays correctly', async () => {
    await _03_hamburgerMenuPage_1.default.hamburgerMenuValidation();
});
(0, cucumber_1.When)('the user sees the "User Protection" option', async () => {
    await _03_hamburgerMenuPage_1.default.userProtectionSection();
});
(0, cucumber_1.When)('the user sees the "Services" option', async () => {
    await _03_hamburgerMenuPage_1.default.servicesSection();
});
(0, cucumber_1.When)('the user sees the "Seguridad" option', async () => {
    await _03_hamburgerMenuPage_1.default.securitySection();
});
(0, cucumber_1.When)('the user selects the "Terms and Conditions" option', async () => {
    await _03_hamburgerMenuPage_1.default.tabAnValidationTermsAndConditions();
});
(0, cucumber_1.Then)('the user is redirected to the "Terms and Conditions" screen', async () => {
    await _03_hamburgerMenuPage_1.default.validattionTermsAndConditions();
});
(0, cucumber_1.When)('the user selects the "Responsibilities" option', async () => {
    await _03_hamburgerMenuPage_1.default.tabAnValidationResponsibilities();
});
(0, cucumber_1.Then)('the user is redirected to the "Responsibilities" screen', async () => {
    await _03_hamburgerMenuPage_1.default.validattionResponsibilities();
});
(0, cucumber_1.When)('the user selects the "Policies and Privacy" option', async () => {
    await _03_hamburgerMenuPage_1.default.tabAnValidationPoliciesAndPrivacy();
});
(0, cucumber_1.Then)('the user is redirected to the "Policies and Privacy" screen', async () => {
    await _03_hamburgerMenuPage_1.default.tabAnValidationPoliciesAndPrivacy();
});
(0, cucumber_1.When)('the user selects the "Services Tariff Chart" option', async () => {
    await _03_hamburgerMenuPage_1.default.tabAnValidationServicesTariffChart();
});
(0, cucumber_1.Then)('the user is redirected to the "Services Tariff Chart" screen', async () => {
    await driver.pause(2000);
});
(0, cucumber_1.When)('the user selects the "Suggestions and Complaints Form" option', async () => {
    await _03_hamburgerMenuPage_1.default.tabAnValidationSugerenciasYReclamaciones();
});
(0, cucumber_1.Then)('the user is redirected to the "Suggestions and Complaints Form" screen', async () => {
    await _03_hamburgerMenuPage_1.default.validattiontitleEnInversionesPopularTeLeemos();
});
(0, cucumber_1.When)('the user selects the "Desvincular usuario" option', async () => {
    await _03_hamburgerMenuPage_1.default.tabAnValidationDesvincularUsuario();
});
(0, cucumber_1.Then)('a pop-up is displayed with the options "Desvincular" and "Cancelar"', async () => {
    await _03_hamburgerMenuPage_1.default.validattionDesvincularAndCancelar();
});
(0, cucumber_1.When)('the user clicks on the "Desvincular" button', async () => {
    await _03_hamburgerMenuPage_1.default.clickDesvincularButton();
});
(0, cucumber_1.Then)('any registered user is Desvinculado and the application is closed', async () => {
    await driver.closeApp();
});
(0, cucumber_1.When)('the user reopens the application', async () => {
    await driver.launchApp();
});
(0, cucumber_1.When)('the user clicks on the "Cancelar" button', async () => {
    await _03_hamburgerMenuPage_1.default.clickCancelarButton();
});
(0, cucumber_1.When)('the user remains in the hamburger menu', async () => {
    await _03_hamburgerMenuPage_1.default.clickCancelarButton();
});
(0, cucumber_1.Then)('the pop-up is closed', async () => {
    await driver.pause(1000);
});
