@login
Feature: Login

  @SuccessfulLogin @happypath @loginOne
Scenario: Iniciar sesión con credenciales válidas en la aplicacion IPSA
  Given I validate the text Consulta tus inversiones en todo momento
  When I press the jump button
  And I tap on the Acceso Clientes button
  And I tap on the Iniciar sesion button
  And I login with my credentials Usuario "40220596098" and Contraseña "Pass@1234"
  Then I should see the dashboard

    # Examples: 
    #   | username  | password |
    #   | 40220596098 | Pass@1234 |




# @run @regression @mobile @login
# Feature: Login

#   @SuccessfulLogin @happypath @loginOne
#   Scenario Outline: I can log into the IPSA app
#     Given I am on the login of the app through the Acceder button
#     When I login with my credentials Usuario "<username>" and Contraseña "<password>"
#     And I tap on the Iniciar sesión button
#     And Enter the token "<token>"
#     Then I should see the dashboard

#     Examples: 
#       | username  | password | token  |
#       | yasalanis |   321321 | 321321 |

  # @FailureLogin @loginOne
  # Scenario Outline: I can not log into the IPSA app when my user/password is incorrect
  #   Given I am on the login of the app through the Acceder button
  #   When I login with incorrect credentials "<username>" "<password>"
  #   And I tap on the Iniciar sesión button
  #   Then I should see an invalid credentials alert

  #   Examples: 
  #     | username  | password |
  #     | yasalanis |   321222 |
