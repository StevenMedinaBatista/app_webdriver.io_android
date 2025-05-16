@regression @Splash
Feature: Splash Screens - Android
As a user I need four splash screens that will present important information about the APP

# 1st Scenario
@splashOne
Scenario: Skip Splash
  Given the mobile application is started for the first time
  When user press the "Saltar" button
  Then the user is sent to third splash 
  And the position indicator "3 points" must change to the last location
  When user press the "Acceso clientes" button
  Then the important information screens are skipped and the user sent to splash_end screen with the "Registrate", "Hazte inversionista" and "Iniciar sesion" buttons is displayed


# 2nd Scenario
@splashTwo
Scenario: Time is over Splash
  Given the mobile application is started for the first time
  When the 10 seconds of the display are over
  Then the screen change to the next and repeat the cycle until reaching the last splash screen
  And the position indicator "3 points" must change to the exact location of the user in relation to the screen that is positioned


# 3rd Scenario
@splashThree
Scenario: Swipe splash
  Given the mobile application is started for the first time
  When user swipe the creen to left or right
  Then the screen change to the next
  And the position indicator "3 points" must change to the exact location of the user in relation to the screen that is positioned


# 4th Scenario
@investorButton
Scenario: Hazte inversionista Button
  Given the mobile application is started for the first time
  And the user is located on the last screen of the splash
  And the position indicator "3 points" is in the last position
  When user press the "Acceso clientes" button
  Then the user is sent to the splash_end 
  When user press the "Hazte inversionista" button
  Then the user is sent to the application_form_info

# 5th Scenario
@registrateButton
Scenario: Registrate Button
  Given the mobile application is started for the first time
  And the user is located on the last screen of the splash
  And the position indicator "3 points" is in the last position
  When user press the "Acceso clientes" button
  Then the user is sent to the splash_end 
  When user press the "Registrate" button
  Then the user is sent to the Welcome_Screen

# 6th Scenario
@loginButton
Scenario: Iniciar sesion Button
  Given the mobile application is started for the first time
  And the user is located on the last screen of the splash
  And the position indicator "3 points" is in the last position
  When user press the "Acceso clientes" button
  Then the user is sent to the splash_end 
  When user press the "Iniciar sesión" button
  Then the user is sent to the login_password_screen


# ***********************************************
#*            CASOS DE PRE-LOGIN
# ***********************************************


# 7th Scenario
@PreLogin
Scenario: Validar los apartados de <option>
  Given the mobile application is started for the first time
    And the user is located on the last screen of the splash
    And the position indicator "3 points" is in the last position
    When user press the "Acceso clientes" button
    Then the user is sent to the splash_end
    When user press the "Iniciar sesión" button
    Then the user is sent to the login_password_screen
    When user clicks the close icon in the Login
    Then it will show the pre-login screen
    When the user taps on the "<option>" option
    Then the "<option>" screen is displayed

    Examples:
      | option                   |
      | Comunícate con nosotros |
      | Tasas de rendimiento    |
      | Calculadora Popular     |


@PreLoginComunicacionInterna
Scenario Outline: Validar subopción "<subopcion>" desde Comunícate con nosotros
  Given the mobile application is started for the first time
    And the user is located on the last screen of the splash
    And the position indicator "3 points" is in the last position
    When user press the "Acceso clientes" button
    Then the user is sent to the splash_end
    When user press the "Iniciar sesión" button
    Then the user is sent to the login_password_screen
    When user clicks the close icon in the Login
    Then it will show the pre-login screen
    When the user taps on the "<option>" option
    Then the "<option>" screen is displayed
    When the user taps on the "<subopcion>" option
    Then the "<pantalla>" screen is displayed

  Examples:
    | option                  | subopcion               | pantalla               |
    | Comunícate con nosotros | Enviar\ncorreo          | Enviar correo          |
    | Comunícate con nosotros | Solicitar\ncita         | Solicitar cita         |
    | Comunícate con nosotros | Seguirnos en\nInstagram | Instagram              |
