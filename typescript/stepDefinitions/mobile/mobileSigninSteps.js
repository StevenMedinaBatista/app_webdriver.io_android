"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("cucumber");
const initial_1 = require("../../pages/mobile/initial");
const initial_page = new initial_1.Initial();
cucumber_1.Given(/^the initial screen is displayed$/, () => {
    expect(initial_page.initialScreen()).toBeDisplayed;
});
