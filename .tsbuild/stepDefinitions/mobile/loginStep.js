"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const loginPage_1 = __importDefault(require("../../pages/mobile/loginPage"));
(0, cucumber_1.Given)('I validate the text Consulta tus inversiones en todo momento', async () => {
    console.log("Primera pantalla de la app");
    await loginPage_1.default.login();
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
});
(0, cucumber_1.Then)('I should see the dashboard', async () => {
    await loginPage_1.default.loginDashboard();
});
(0, cucumber_1.Given)(/^I have logged in the app with my credentials Usuario \"([^\"]*)\" and Contraseña \"([^\"]*)\" and token \"([^\"]*)\"$/, { timeout: 2 * 60000 }, async (username, password, token) => {
});
