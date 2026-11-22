Feature: Accept the proposed match for a decision
  A curator confirms that the entity mention belongs to the proposed cluster.

  Scenario: Curator accepts the proposed match
    Given a signed-in curator with two pending decisions
    And the curator has selected the decision for "Alice Johnson"
    And the comparison panel shows the proposed match
    When the curator accepts the proposed match and confirms
    Then the app sends the accept request for that decision
    And the app confirms "Decision accepted"
    And "Alice Johnson" is no longer in the pending decisions
    And "Bob Smith" is still in the pending decisions
    And the header counts one more accepted match
