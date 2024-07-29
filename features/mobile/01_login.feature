@regression @login @Splash
# Feature: Login

#   @SuccessfulLogin @happypath
# Scenario: Iniciar sesión con credenciales válidas en la aplicacion IPSA
#   Given I validate the text Consulta tus inversiones en todo momento
#   When I press the jump button
#   And I navigate to the login screen
#   And I login with my credentials Usuario "40220596098" and Contraseña "Pass@1234"
#   Then I should see the dashboard



Feature: Splash Screens - Android
As a user I need four splash screens that will present important information about the APP
@splashOne
# 1st Scenario
Scenario: Skip Splash
  Given the mobile application is started for the first time
  When user press the "Saltar" button
  Then the user is sent to third splash 
  And the position indicator "3 points" must change to the last location
  When user press the "Continuar" button
  Then the important information screens are skipped and the user sent to splash_end screen with the "Registrate", "Hazte inversionista" and "Iniciar sesion" buttons is displayed


@splashTwo
# 2nd Scenario
Scenario: Time is over Splash
  Given the mobile application is started for the first time
  When the 10 seconds of the display are over
  Then the screen change to the next and repeat the cycle until reaching the last splash screen
  And the position indicator "3 points" must change to the exact location of the user in relation to the screen that is positioned

  @splashThree
# # 3rd Scenario
Scenario: Swipe splash
  Given the mobile application is started for the first time
  When user swipe the creen to left or right
  Then the screen change to the next
  And the position indicator "3 points" must change to the exact location of the user in relation to the screen that is positioned

# # 4th Scenario
# Scenario: Hazte inversionista Button
#   Given the mobile application is started for the first time
#   And the user is located on the last screen of the splash
#   And the position indicator "3 points" is in the last position
#   When user press the "Continuar" button
#   Then the user is sent to the splash_end 
#   When user press the "Hazte inversionista" button
#   Then the user is sent to the application_form_info

# # 5th Scenario
# Scenario: Registrate Button
#   Given the mobile application is started for the first time
#   And the user is located on the last screen of the splash
#   And the position indicator "3 points" is in the last position
#   When user press the "Continuar" button
#   Then the user is sent to the splash_end 
#   When user press the "Registrate" button
#   Then the user is sent to the Welcome_Screen

# # 6th Scenario
# Scenario: Iniciar sesion Button
#   Given the mobile application is started for the first time
#   And the user is located on the last screen of the splash
#   And the position indicator "3 points" is in the last position
#   When user press the "Continuar" button
#   Then the user is sent to the splash_end 
#   When user press the "Iniciar sesion" button
#   Then the user is sent to the login_password_screen
