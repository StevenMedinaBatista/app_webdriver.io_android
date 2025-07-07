"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const _01_LoginPage_1 = __importDefault(require("../../pages/mobile/01_LoginPage"));
{
    (0, cucumber_1.When)(/^I login with my credentials Email "([^"]+)" and Password "([^"]+)"$/, async (email, password) => {
        await _01_LoginPage_1.default.inputCredentials(email, password);
    });
}
{
    (0, cucumber_1.Then)('I can see the login screen', async () => {
        await _01_LoginPage_1.default.validate();
    });
    (0, cucumber_1.Then)('I see the success alert', async () => {
        await _01_LoginPage_1.default.ValidateSuccessAlert();
    });
}
