/**
 * Author: Steven Medina Batista.
 */

import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import HomePage from "../../pages/mobile/homePage";
import LoginPage from "../../pages/mobile/loginPage";
import SplashPage from "../../pages/mobile/splashPage";
import DashboardPage from "../../pages/mobile/04_dashboardPage";

Given('I validate the text Consulta tus inversiones en todo momento', async () => {
  console.log("Primera pantalla de la app")
  await LoginPage.login();
});

Given(/^I have logged in the app with my credentials Usuario "([\d\-]+)" and Contraseña "([^"]+)"$/,{ timeout: 2 * 60000 }, async (username: string, password: string) => {
  await LoginPage.login();
  await LoginPage.tabSaltar();
  await LoginPage.tabAccesoClientes();
  await LoginPage.tabIniciarSesion();
  await LoginPage.inputCredentials(username.replace(/-/g, ''), password);
  await LoginPage.tabIniciarSesion();
  await DashboardPage.validate();
  await setDefaultTimeout(120000);
});

When('I press the jump button', async () => {
  console.log("Precionando boton de Saltar")
  await LoginPage.tabSaltar();
});

When('I navigate to the login screen', async() => {
  await LoginPage.tabAccesoClientes();
  await LoginPage.tabIniciarSesion();
  await driver.takeScreenshot();
});

When(/^I login with my credentials Usuario "([\d\-]+)" and Contraseña "([^"]+)"$/, async (username: string, password: string) => {
  await LoginPage.inputCredentials(username.replace(/-/g, ''), password);
  await LoginPage.tabIniciarSesion();
});

When(/^I input my invalid credentials Usuario "(\d+)" and Contraseña "([^"]+)"$/, async (username: string, password: string) => {
  await LoginPage.inputIncorrectCredentials(username, password);
});

Then('I should see the dashboard', async() => {
  await (await DashboardPage.txt_noCuenta).waitForDisplayed({ timeout: 10000 });
  await expect(await DashboardPage.txt_noCuenta).toBeDisplayed();
  await DashboardPage.validate;
});

Then(/^I should see the message "([^"]+)"$/, async (expectedMessage: string) => {
  await LoginPage.validarCredencialesIncorrectas(expectedMessage);
});

Then('I should see the associated investment products if available', async () => {
  await DashboardPage.validateMiPortafolio();
});