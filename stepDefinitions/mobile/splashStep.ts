/**
 * Author: Steven Medina Batista.
 */

import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import HomePage from "../../pages/mobile/homePage";
import LoginPage from "../../pages/mobile/loginPage";
import SplashPage from "../../pages/mobile/splashPage";

Given('the mobile application is started for the first time', async () => {
    console.log("Primera pantalla de la app")
    await SplashPage.login();
});
  
When('user press the {string} button', async (button: string) => {
    await SplashPage.pressButton(button);
});
  
Then('the user is sent to third splash', async () => {
    await SplashPage.verifyThirdSplashScreen();
});
  
Then('the position indicator {string} must change to the last location', async (indicator: string) => {
    await SplashPage.verifyPositionIndicator(indicator);
});

Then('the important information screens are skipped and the user sent to splash_end screen with the {string}, {string} and {string} buttons is displayed', async (btn1: string, btn2: string, btn3: string) => {
    await SplashPage.verifySplashEndScreen([btn1, btn2, btn3]);
});

When('the 10 seconds of the display are over', async () => {
    await SplashPage.waitForTimeout(1000);
});

Then('the screen change to the next and repeat the cycle until reaching the last splash screen', async () => {
    await SplashPage.verifyAllSplashScreens();
});

Then('the position indicator {string} must change to the exact location of the user in relation to the screen that is positioned', async (indicator: string) => {
    await SplashPage.verifyPositionIndicator(indicator);
});

When('user swipe the creen to left or right', async () => {
    await SplashPage.swipeScreen();
});

Then('the screen change to the next', async () => {
    await SplashPage.verifyScreenChange();
});