/**
 * Author: Steven Medina Batista.
 */

import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import HomePage from "../../pages/mobile/00_HomePage";



Given(/^The mobile app starts and is on the home screen$/,{ timeout: 30000 }, async () => {
    await HomePage.validate();
});

When('I go to the {string} item', async (option: string) => {
    await HomePage.tapMenuOption(option);
});