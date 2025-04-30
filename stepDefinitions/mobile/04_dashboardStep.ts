/**
 * Author: Steven Medina Batista.
 */

import { Before, Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import LoginPage from "../../pages/mobile/loginPage";
import SplashPage from "../../pages/mobile/splashPage";
import HamburgerMenu from "../../pages/mobile/03_hamburgerMenuPage"
import DashboardPage from "../../pages/mobile/04_dashboardPage"



Then('the profile menu displays the {string} item', async (option: string) => {
    await DashboardPage.validateMenuOptions([option]);
  });

When('I validate that we are on the My Profile screen', async () => {
    await DashboardPage.validateMiPerfil();
});

When('the user taps the profile icon on the Dashboard', async () => {
    await DashboardPage.tapProfileIcon();
});