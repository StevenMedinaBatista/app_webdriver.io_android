@regression @login
Feature: Login

  @SuccessfulLogin @happypath
Scenario: Iniciar sesión con credenciales válidas en la aplicacion IPSA
  Given I validate the text Consulta tus inversiones en todo momento
  When I press the jump button
  And I navigate to the login screen
  And I login with my credentials Usuario "40220596098" and Contraseña "Abcd@1234"
  Then I should see the dashboard

  
  @LoginIncorrecto @sadpath
Scenario: Iniciar sesión con credenciales invalidas en la aplicacion IPSA
  Given I validate the text Consulta tus inversiones en todo momento
  When I press the jump button
  And I navigate to the login screen
  And I input my invalid credentials Usuario "40211111111" and Contraseña "122123"
  Then I should see the message "El usuario o la contraseña no son correctos"