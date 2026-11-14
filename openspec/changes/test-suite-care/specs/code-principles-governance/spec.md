<!-- Delta of the PLAN (design.md D-8). -->

## ADDED Requirements

### Requirement: The testing checklist carries the rules that keep a suite small and quick
The testing checklist of `cosmic-python` SHALL carry, as numbered rules, that every test asserts
something, that no two parametrised cases fall in one equivalence class beyond the required ones,
that a behaviour proven at a lower tier is not proven again at a higher one unless the higher test
runs something real, that a test over the project's threshold carries the `slow` marker, and that
a file of adversarial tests is named by feature. Its rules on shared data and on quarantine SHALL
say that costly set-up is shared only where tests do not change it, and that a skip or expected
failure carries an issue link. The checklist SHALL give the source of each added rule once.
`test-suite-care` SHALL cite these rules by number and SHALL NOT restate them (test-suite-care
DEC-10; design D-8).

#### Scenario: An audit finds a broken rule
- **WHEN** an audit finds a skipped test with no issue link
- **THEN** the report lists it under "Broken rules" with the rule's number, not the rule's text
