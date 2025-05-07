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
        | Salir                   |

    
    @DashboardDocumentos
    Scenario: Access Important Documents
        When the user taps the profile icon on the Dashboard
        And selects the "Documentos importantes" option
        Then the documentos importantes screen is displayed
        

    @DashboardDesvincular
    Scenario: Press Unlink device
        When the user taps the profile icon on the Dashboard
        And selects the "Desvincular dispositivo" option
        Then a confirmation message is shown to Desvincular dispositivo


    @DashboardConfiguraciones
    Scenario: Press Configuraciones option
        When the user taps the profile icon on the Dashboard
        And selects the "Configuraciones" option
        Then the user is redirected to the Configuraciones screen


    @DashboardSalir
    Scenario: Press option Salir
        When the user taps the profile icon on the Dashboard
        And selects the "Salir" option
        Then the user is redirected to the Configuraciones screen


    @CorretajeValidacion
    Scenario: View brokerage accounts with or without carousel
    #   Then the brokerage account section is displayed
        And the brokerage accounts are validated depending on the number of accounts


    @DashboardCardInformacionDeCuentas
    Scenario: View brokerage account details by tapping the card (excluding "Ver más")
        When I tap anywhere on the brokerage account card
        Then the brokerage account detail screen is displayed

        
    @cardVerMas
    Scenario: View summarized investment information by clicking "Ver más"
        Given I am on the brokerage accounts section
        When I tap the "Ver más" button on a brokerage account with investments
        Then the investment summary is displayed
    

    
    Scenario: Hide summarized investment information by clicking "Ver menos"
        Given I have opened the investment summary
        When I tap the "Ver menos" button
        Then the investment summary is hidden