/**
 * Author: Steven Medina Batista.
 */

import { Before, Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import LoginPage from "../../pages/mobile/loginPage";
import SplashPage from "../../pages/mobile/splashPage";
import HamburgerMenu from "../../pages/mobile/03_hamburgerMenuPage"

Before(async () => {
    await driver.reset();
});

When('user clicks the close icon in the Login', async () => {
    await HamburgerMenu.tabIconClose();
})
  
Then('it will show the pre-login screen', async () => {
    await HamburgerMenu.preLoginScreen();
})

When('user clicks on the hamburger menu icon', async () => {
    await HamburgerMenu.tabHamburgerMenu();
})

Then('the hamburger menu displays correctly', async () => {
    await HamburgerMenu.hamburgerMenuValidation();
})

When('the user sees the "User Protection" option', async () => {
    await HamburgerMenu.userProtectionSection();
})

When('the user sees the "Services" option', async () => {
    await HamburgerMenu.servicesSection();
})

When('the user sees the "Seguridad" option', async () => {
    await HamburgerMenu.securitySection();
})

When('the user selects the "Terms and Conditions" option', async () => {
    await HamburgerMenu.tabAnValidationTermsAndConditions();
})

Then('the user is redirected to the "Terms and Conditions" screen', async () => {
    await HamburgerMenu.validattionTermsAndConditionsResponsibilitiesAndPoliciesPrivacy();
})

When('the user selects the "Responsibilities" option', async () => {
    await HamburgerMenu.tabAnValidationResponsibilities();
})

Then('the user is redirected to the "Responsibilities" screen', async () => {
    await HamburgerMenu.validattionTermsAndConditionsResponsibilitiesAndPoliciesPrivacy();
})

When('the user selects the "Policies and Privacy" option', async () => {
    await HamburgerMenu.tabAnValidationPoliciesAndPrivacy();
})

Then('the user is redirected to the "Policies and Privacy" screen', async () => {
    await HamburgerMenu.validattionTermsAndConditionsResponsibilitiesAndPoliciesPrivacy();
})

When('the user selects the "Services Tariff Chart" option', async () => {
    await HamburgerMenu.tabAnValidationServicesTariffChart();
})

Then('the user is redirected to the "Services Tariff Chart" screen', async () => {
    await driver.pause(2000);
})

When('the user selects the "Suggestions and Complaints Form" option', async () => {
    await HamburgerMenu.tabAnValidationSugerenciasYReclamaciones();
})

Then('the user is redirected to the "Suggestions and Complaints Form" screen', async () => {
    await HamburgerMenu.validattiontitleEnInversionesPopularTeLeemos();
})

When('the user selects the "Desvincular usuario" option', async () => {
    await HamburgerMenu.tabAnValidationDesvincularUsuario();
})

Then('a pop-up is displayed with the options "Desvincular" and "Cancelar"', async () => {
    await HamburgerMenu.validattionDesvincularAndCancelar();
})

When('the user clicks on the "Desvincular" button', async () => {
    await HamburgerMenu.clickDesvincularButton();
})

Then('any registered user is Desvinculado and the application is closed', async () => {
    await driver.closeApp();
})

When('the user reopens the application', async () => {
    await driver.launchApp();
});

When('the user clicks on the "Cancelar" button', async () => {
    await HamburgerMenu.clickCancelarButton();
})

When('the user remains in the hamburger menu', async () => {
    await HamburgerMenu.clickCancelarButton();
})

Then('the pop-up is closed', async () => {
    await driver.pause(1000)
})
