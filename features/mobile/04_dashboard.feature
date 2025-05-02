@regression @Dashboard
Feature: Dashboard - Android

    Background: Yo como usuario necesito ver un menu de perfil para poder acceder a las secciones de: Mi perfil, Documentos importantes, Desvincular dispositivo y Salir del app iOS.
        Given I have logged in the app with my credentials Usuario "22301761403" and Contraseña "Algoritmo@2230"
        Then I should see the dashboard


    @DashboardOne
    Scenario: View profile menu options
        When the user taps the profile icon on the Dashboard
        And I validate that we are on the My Profile screen


    @DashboardTwo
    Scenario Outline: View profile menu options "<option>"
        When the user taps the profile icon on the Dashboard
        And I validate that we are on the My Profile screen
        Then the profile menu displays the "<option>" item

        Examples:
        | option                  |
        | Documentos importantes  |
        | Desvincular dispositivo |
        | Configuraciones         |

    
    @DashboardDocumentos
    Scenario: Access Important Documents
        When the user taps the profile icon on the Dashboard
        And selects the "Documentos importantes" option
        Then the documentos importantes screen is displayed
        

    @DashboardDesvincular
    Scenario: Unlink device
        When the user taps the profile icon on the Dashboard
        And selects the "Desvincular dispositivo" option
        Then a confirmation message is shown to Desvincular dispositivo


    @DashboardConfiguraciones
    Scenario: Logout from the profile menu
        When the user taps the profile icon on the Dashboard
        And selects the "Configuraciones" option
        Then the user is redirected to the Configuraciones screen