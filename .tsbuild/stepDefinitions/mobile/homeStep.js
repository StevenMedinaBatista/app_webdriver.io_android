"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
(0, cucumber_1.Given)(/^I am on the login of the app through the Acceder button$/, { timeout: 2 * 60000 }, async () => {
    await console.log("Probando el Login");
});
