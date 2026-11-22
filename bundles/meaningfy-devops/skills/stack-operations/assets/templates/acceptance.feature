# Use this as tests/<stack>/features/<capability>.feature: one file per capability, run before and after a change.
# Spec: <spec id>  ·  Change: <change id>
# Settings (from the environment, filled from the password manager): <SETTING_NAME>, ...
# A missing setting skips the scenario; strict mode fails it instead.
@<stack>
Feature: <capability> of <stack>
  As <who relies on it>
  I want <what the capability gives>
  So that <why it matters>

  @smoke
  Scenario Outline: The public entry point answers over TLS
    Given the instance "<instance>"
    When I request "https://<host>/<health-path>"
    Then the response status is 200
    And the certificate is valid for at least 14 days

    Examples:
      | instance   | host                |
      | <instance> | <service>.<domain>  |

  @negative
  Scenario Outline: A private port is not reachable from outside
    Given the instance "<instance>"
    When I open a TCP connection to the public address on port <port>
    Then the connection is refused or times out

    Examples:
      | instance   | port   |
      | <instance> | <port> |

  @e2e
  Scenario: A user can create and read back an item
    Given I am signed in as the test account
    When I create an item marked with this run's marker
    Then I can read the item back
    And the item is deleted when the run ends

  @manual
  Scenario: Counts match after a data move
    Given the counts recorded before the change
    When I count the same objects on the new stack
    Then every count is equal
