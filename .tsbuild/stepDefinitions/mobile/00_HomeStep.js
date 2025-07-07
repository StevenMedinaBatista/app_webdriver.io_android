"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const _00_HomePage_1 = __importDefault(require("../../pages/mobile/00_HomePage"));
(0, cucumber_1.Given)(/^The mobile app starts and is on the home screen$/, { timeout: 30000 }, async () => {
    await _00_HomePage_1.default.validate();
});
(0, cucumber_1.When)('I go to the {string} item', async (option) => {
    await _00_HomePage_1.default.tapMenuOption(option);
});
