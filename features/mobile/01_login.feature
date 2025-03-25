@regression @login
Feature: Login

  @SuccessfulLogin @happypath
Scenario: Iniciar sesión con credenciales válidas en la aplicacion IPSA
  Given I validate the text Consulta tus inversiones en todo momento
  When I press the jump button
  And I navigate to the login screen
  And I login with my credentials Usuario "001-0779976-9" and Contraseña "Abcd@1234"
  Then I should see the dashboard

  