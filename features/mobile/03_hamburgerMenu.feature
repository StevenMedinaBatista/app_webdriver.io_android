@HamburgerMenu
Feature: Hamburger Menu - Android

    Background:
        Given the mobile application is started for the first time
        And the user is located on the last screen of the splash
        And the position indicator "3 points" is in the last position
        When user press the "Continuar" button
        Then the user is sent to the splash_end
        When user press the "Iniciar sesión" button
        Then the user is sent to the login_password_screen
        When user clicks the close icon in the Login
        Then it will show the pre-login screen
        And user clicks on the hamburger menu icon


    @HamburgerMenuSections
    Scenario: Acceso al menú hamburguesa pre-login
        Then the hamburger menu displays correctly
        And the user sees the "User Protection" option
        And the user sees the "Services" option
        And the user sees the "Seguridad" option

    
    @hamburger @terms
    Scenario: Navigate to "Terms and Conditions" from User Protection
        Then the hamburger menu displays correctly
        And the user sees the "User Protection" option
        And the user selects the "Terms and Conditions" option
        Then the user is redirected to the "Terms and Conditions" screen


    @hamburger @policies
    Scenario: Navigate to "Terms and Conditions" from User Protection
        Then the hamburger menu displays correctly
        And the user sees the "User Protection" option
        And the user selects the "Responsibilities" option
        Then the user is redirected to the "Responsibilities" screen


    @hamburger @responsibilities
    Scenario: Navigate to "Responsibilities" from User Protection
        Then the hamburger menu displays correctly
        And the user sees the "User Protection" option
        And the user selects the "Policies and Privacy" option
        Then the user is redirected to the "Policies and Privacy" screen


    @hamburger @tariffchart
    Scenario: Navigate to "Services Tariff Chart" from the hamburger menu
        Then the hamburger menu displays correctly
        And the user sees the "Services" option
        And the user selects the "Services Tariff Chart" option
        Then the user is redirected to the "Services Tariff Chart" screen


    @hamburgerMenu @suggestionsComplaints
    Scenario: View "Suggestions and Complaints Form" in the Security section
    Then the hamburger menu displays correctly
    And the user sees the "Seguridad" option
    And the user selects the "Suggestions and Complaints Form" option
    Then the user is redirected to the "Suggestions and Complaints Form" screen


  @hamburgerMenu @unlinkUser
  Scenario: Unlink user from the Security section
    When the user sees the "Seguridad" option
    And the user selects the "Desvincular usuario" option
    Then a pop-up is displayed with the options "Desvincular" and "Cancelar"


  @hamburgerMenu @unlinkUser11
  Scenario: Unlink the user
    When the user sees the "Seguridad" option
    And the user selects the "Desvincular usuario" option
    Then a pop-up is displayed with the options "Desvincular" and "Cancelar"
    When the user clicks on the "Desvincular" button
    Then any registered user is Desvinculado and the application is closed
    When the user reopens the application
    #Then the "Login-no Linked Users" screen is displayed


  @hamburgerMenu @unlinkUser1
  Scenario: Cancel unlinking the user
    When the user sees the "Seguridad" option
    And the user selects the "Desvincular usuario" option
    Then a pop-up is displayed with the options "Desvincular" and "Cancelar"
    When the user clicks on the "Cancelar" button
    Then the pop-up is closed
    Then the hamburger menu displays correctly
