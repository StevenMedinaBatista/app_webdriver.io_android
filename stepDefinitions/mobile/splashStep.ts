/**
 * Author: Steven Medina Batista.
 */

import { Before, Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import HomePage from "../../pages/mobile/homePage";
import LoginPage from "../../pages/mobile/loginPage";
import SplashPage from "../../pages/mobile/splashPage";
import DashboardPage from "../../pages/mobile/04_dashboardPage";
import splashPage from "../../pages/mobile/splashPage";


Before(async () => {
    // Para reiniciar el app, ahora en las nuevas versiones de appium se recomienda cerrar y abrir en vez de reiniciar.
    await driver.closeApp();
    await driver.launchApp();

});

Given('the mobile application is started for the first time', async () => {
    console.log("Primera pantalla de la app")
    //await browser.pause(5000);
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
    //await SplashPage.verifyScreenChange();
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

// Sugerir un cambio en el enunciado, por the user is sent to the splash_end
Then('the user is located on the last screen of the splash', async () => {
    await SplashPage.login();
    await SplashPage.swipeScreen();
    await SplashPage.verifyThirdSplashScreen();
});

Then('the position indicator {string} is in the last position', async (indicator: string) => {
    await SplashPage.verifyPositionIndicator(indicator);
});

Then('the user is sent to the splash_end', async () => {
    await SplashPage.verifySplashEnd();
});

Then('the user is sent to the application_form_info', async () => {
    await SplashPage.verifyApplicationFormInfo();
});

Then('the user is sent to the Welcome_Screen', async () => {
    await SplashPage.verifyWelcomeScreen();
});

Then('the user is sent to the login_password_screen', async () => {
    await SplashPage.verifyLoginPasswordScreen();
});



//* StepsDefinitions Pre-Login



When('the user taps on the {string} option', async (option: string) => {
    await splashPage.tapOnOption(option);
});

Then('the {string} screen is displayed', async (option: string) => {
    await splashPage.validateScreenIsDisplayed(option);
});