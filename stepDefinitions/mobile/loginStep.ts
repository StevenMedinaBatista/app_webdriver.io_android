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
  await LoginPage.tabContinuar();
  await LoginPage.tabIniciarSesion();
});

When(/^I login with my credentials Usuario "(\d{11})" and Contraseña "([^"]+)"$/, async (username: number, password: string) => {
  await LoginPage.inputCredentials(username, password);
});

Then('I should see the dashboard', async() => {
  await LoginPage.loginDashboard();

});


/**
 * NUEVO CODIGO A PARTIR DE LOS GHERKINS
 */


