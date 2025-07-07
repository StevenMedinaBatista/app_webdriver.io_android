/**
 * Author: Steven Medina Batista.
 * linkedIn: www.linkedin.com/in/steven-medina-batista
 */

import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import LoginPage from "../../pages/mobile/01_LoginPage";


//SECTION Given


//SECTION When
{
    When(/^I login with my credentials Email "([^"]+)" and Password "([^"]+)"$/, async (email: string, password: string) => {
        await LoginPage.inputCredentials(email, password);
    });

}

//SECTION Then
{
    Then('I can see the login screen', async () => {
        await LoginPage.validate();
    });

    Then('I see the success alert', async () => {
        await LoginPage.ValidateSuccessAlert();
    })
}


