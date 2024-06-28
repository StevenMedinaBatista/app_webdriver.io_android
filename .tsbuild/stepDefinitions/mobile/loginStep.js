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
(0, cucumber_1.When)('I tap on the Acceso Clientes button', async () => {
    await loginPage_1.default.tabAccesoClientes();
});
(0, cucumber_1.When)('I tap on the Iniciar sesion button', async () => {
    await loginPage_1.default.tabIniciarSesion();
});
(0, cucumber_1.When)(/^I login with my credentials Usuario "(\d{11})" and Contraseña "([^"]+)"$/, async (username, password) => {
    await loginPage_1.default.inputCredentials(username, password);
});
(0, cucumber_1.Then)('I should see the dashboard', async () => {
});
