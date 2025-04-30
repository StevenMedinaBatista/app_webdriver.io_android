"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const _04_dashboardPage_1 = __importDefault(require("../../pages/mobile/04_dashboardPage"));
(0, cucumber_1.Then)('the profile menu displays the {string} item', async (option) => {
    await _04_dashboardPage_1.default.validateMenuOptions([option]);
});
(0, cucumber_1.When)('I validate that we are on the My Profile screen', async () => {
    await _04_dashboardPage_1.default.validateMiPerfil();
});
(0, cucumber_1.When)('the user taps the profile icon on the Dashboard', async () => {
    await _04_dashboardPage_1.default.tapProfileIcon();
});
