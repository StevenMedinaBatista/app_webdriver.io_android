/**
 * Author: Steven Medina Batista.
 */

import HomePage from "../../pages/mobile/homePage";
import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";

Given(/^I am on the login of the app through the Acceder button$/, { timeout: 2 * 60000 }, async () => {
  // await HomePage.closeSesion();
  // await HomePage.exitwin();
  // await HomePage.validate();
  // await HomePage.tapToAccess();
  // await setDefaultTimeout(60000);
  //await HomePage.login();
  await console.log("Probando el Login")
});
