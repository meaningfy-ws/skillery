Feature: Greeting a visitor
  As a service operator
  I want every visitor to receive a personalised greeting
  So that the service feels welcoming from the very first interaction

  Scenario: Greet a named visitor
    Given a visitor named "Ada"
    When the visitor is greeted
    Then the greeting reads "Hello, Ada!"

  Scenario Outline: Greet visitors with different names
    Given a visitor named "<name>"
    When the visitor is greeted
    Then the greeting reads "<greeting>"

    Examples:
      | name  | greeting       |
      | Ada   | Hello, Ada!    |
      | Linus | Hello, Linus!  |
      | Grace | Hello, Grace!  |
