@regression @login
Feature: Login

# 1st Scenario
  @SuccessfulLogin @happypath
Scenario: Iniciar sesión con credenciales válidas en la aplicacion IPSA
  Given I validate the text Consulta tus inversiones en todo momento
  When I press the jump button
  And I navigate to the login screen
  And I login with my credentials Usuario "22301761403" and Contraseña "Algoritmo@2230"
  Then I should see the dashboard

# 2nd Scenario
  @LoginIncorrecto @sadpath
Scenario: Iniciar sesión con credenciales invalidas en la aplicacion IPSA
  Given I validate the text Consulta tus inversiones en todo momento
  When I press the jump button
  And I navigate to the login screen
  And I input my invalid credentials Usuario "40211111111" and Contraseña "122123"
  Then I should see the message "El usuario o la contraseña no son correctos"

# 3rd Scenario
  @loginDesvinculado @happypath
Scenario: Iniciar sesión y Cerrar Session
  Given I validate the text Consulta tus inversiones en todo momento
  When I press the jump button
  And I navigate to the login screen
  And I login with my credentials Usuario "22301761403" and Contraseña "Algoritmo@2230"
  Then I should see the dashboard
  When the user taps the profile icon on the Dashboard
  And selects the "Salir" option
  Then the user is redirected to the Salir PopUp and exit
  
