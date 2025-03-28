/**
 * Author: Steven Medina Batista.
 */

import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import HomePage from "../../pages/mobile/homePage";
import LoginPage from "../../pages/mobile/loginPage";
import SplashPage from "../../pages/mobile/splashPage";

Given('I validate the text Consulta tus inversiones en todo momento', async () => {
  console.log("Primera pantalla de la app")
  await LoginPage.login();
});

When('I press the jump button', async () => {
  console.log("Precionando boton de Saltar")
  await LoginPage.tabSaltar();
});

When('I navigate to the login screen', async() => {
  await LoginPage.tabAccesoClientes();
  await LoginPage.tabIniciarSesion();
});

When(/^I login with my credentials Usuario "([\d\-]+)" and Contraseña "([^"]+)"$/, async (username: string, password: string) => {
  await LoginPage.inputCredentials(username.replace(/-/g, ''), password);
});

When(/^I input my invalid credentials Usuario "(\d+)" and Contraseña "([^"]+)"$/, async (username: string, password: string) => {
  await LoginPage.inputIncorrectCredentials(username, password);
});

Then('I should see the dashboard', async() => {
  await LoginPage.loginDashboard();

});

Given(/^I have logged in the app with my credentials Usuario \"([^\"]*)\" and Contraseña \"([^\"]*)\" and token \"([^\"]*)\"$/,{ timeout: 2 * 60000 }, async (username: string, password: string, token: string) => {
  
});

Then(/^I should see the message "([^"]+)"$/, async (expectedMessage: string) => {
  await LoginPage.validarCredencialesIncorrectas(expectedMessage);
});
