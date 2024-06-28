import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import HomePage from "../../pages/mobile/homePage";
import LoginPage from "../../pages/mobile/loginPage";

Given('I validate the text Consulta tus inversiones en todo momento', async () => {
  console.log("Primera pantalla de la app")
  await LoginPage.login();
});

When('I press the jump button', async () => {
  console.log("Precionando boton de Saltar")
  await LoginPage.tabSaltar();
});

When('I tap on the Acceso Clientes button', async() => {
  await LoginPage.tabAccesoClientes();
});

When('I tap on the Iniciar sesion button', async() => {
  await LoginPage.tabIniciarSesion();
});

When(/^I login with my credentials Usuario "(\d{11})" and Contraseña "([^"]+)"$/, async (username: string, password: string) => {
  await LoginPage.inputCredentials(username, password);
});

Then('I should see the dashboard', async() => {
});





