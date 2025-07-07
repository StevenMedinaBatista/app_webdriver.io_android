@regression @login

Feature: Login

# 1st Scenario
  @SuccessfulLogin @happypath
  Scenario: Log in with valid credentials to the Webdriverio application.
      Given The mobile app starts and is on the home screen
      And I go to the "Login" item
      Then I can see the login screen
      And I login with my credentials Email "hola@gmail.com" and Password "43214321"
      Then I see the success alert

