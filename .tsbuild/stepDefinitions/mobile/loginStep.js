"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const loginPage_1 = __importDefault(require("../../pages/mobile/loginPage"));
const _04_dashboardPage_1 = __importDefault(require("../../pages/mobile/04_dashboardPage"));
(0, cucumber_1.Given)('I validate the text Consulta tus inversiones en todo momento', async () => {
    console.log("Primera pantalla de la app");
    await loginPage_1.default.login();
});
(0, cucumber_1.Given)(/^I have logged in the app with my credentials Usuario "([\d\-]+)" and Contraseña "([^"]+)"$/, { timeout: 2 * 60000 }, async (username, password) => {
    await loginPage_1.default.login();
    await loginPage_1.default.tabSaltar();
    await loginPage_1.default.tabAccesoClientes();
    await loginPage_1.default.tabIniciarSesion();
    await loginPage_1.default.inputCredentials(username.replace(/-/g, ''), password);
    await loginPage_1.default.tabIniciarSesion();
    await _04_dashboardPage_1.default.validate();
    await (0, cucumber_1.setDefaultTimeout)(120000);
});
(0, cucumber_1.When)('I press the jump button', async () => {
    console.log("Precionando boton de Saltar");
    await loginPage_1.default.tabSaltar();
});
(0, cucumber_1.When)('I navigate to the login screen', async () => {
    await loginPage_1.default.tabAccesoClientes();
    await loginPage_1.default.tabIniciarSesion();
});
(0, cucumber_1.When)(/^I login with my credentials Usuario "([\d\-]+)" and Contraseña "([^"]+)"$/, async (username, password) => {
    await loginPage_1.default.inputCredentials(username.replace(/-/g, ''), password);
    await loginPage_1.default.tabIniciarSesion();
});
(0, cucumber_1.When)(/^I input my invalid credentials Usuario "(\d+)" and Contraseña "([^"]+)"$/, async (username, password) => {
    await loginPage_1.default.inputIncorrectCredentials(username, password);
});
(0, cucumber_1.Then)('I should see the dashboard', async () => {
    await (await _04_dashboardPage_1.default.txt_noCuenta).waitForDisplayed({ timeout: 10000 });
    await expect(await _04_dashboardPage_1.default.txt_noCuenta).toBeDisplayed();
    await _04_dashboardPage_1.default.validate;
});
(0, cucumber_1.Then)(/^I should see the message "([^"]+)"$/, async (expectedMessage) => {
    await loginPage_1.default.validarCredencialesIncorrectas(expectedMessage);
});
