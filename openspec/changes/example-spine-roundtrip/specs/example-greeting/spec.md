# example-greeting

## ADDED Requirements

### Requirement: System greets a named user

The system SHALL return a greeting that includes the supplied name.

#### Scenario: Greeting a named user

- **WHEN** `greet` is called with the name "Ada"
- **THEN** the system returns "Hello, Ada!"

#### Scenario: Greeting with an empty name

- **WHEN** `greet` is called with an empty name
- **THEN** the system returns "Hello, there!"
