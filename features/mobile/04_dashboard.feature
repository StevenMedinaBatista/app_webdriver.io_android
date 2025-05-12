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
        Then the user is redirected to the Salir PopUp


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
    

    @cardVerMenos
    Scenario: Hide summarized investment information by clicking "Ver menos"
        # Given I have opened the investment summary
        Given I am on the brokerage accounts section
        When I tap the "Ver más" button on a brokerage account with investments
        Then the investment summary is displayed
        When I tap the "Ver menos" button on a brokerage account with investments
        Then the investment summary is hidden


    # @portfolio
    #   Scenario: Mi portafolio 0 producto
    #     Given I am on the brokerage accounts section
    #     Then I should see the associated investment products if available

    
    @portfolio
    Scenario: Mi portafolio 1 producto
        Given I am on the brokerage accounts section
        Then I should see the associated investment products if available


    # @portfolio
    # Scenario: Mi portafolio 2 producto
    #   Given I am on the brokerage accounts section
    #   Then I should see the associated investment products if available


    @DashboardInvertirEnMi
    Scenario: Mostrar y acceder al banner Quiero invertir en mi
        Then the Quiero invertir en mi banner is displayed at the bottom of the Dashboard
        When you click the Quiero invertir en mi banner
        Then the Quiero invertir en mi screen and the list of investments are displayed


    @DashboardPropositosNavegacion
    Scenario Outline: Validar pantalla de propósito de inversión "<purpose>"
        Given the user is viewing the list of investment purposes
        When the user taps on the "<purpose>" purpose
        Then the "<purpose>" detail screen is displayed
        And the user can return to the list of investment purposes

        Examples:
        | purpose                 |
        | Comprar bienes          |
        | Diversificar patrimonio |
        | Pago de estudios        |
        | Proyecto de vida        |
        | Viajar                  |
