<!-- Delta of the PLAN (design.md D-8). -->

## ADDED Requirements

### Requirement: The testing checklist carries the rules that keep a suite small and quick
The testing checklist of `cosmic-python` SHALL carry, as numbered rules, that every test asserts
something, that costly set-up is shared at the widest scope whose tests do not change it, that no
two parametrised cases fall in one equivalence class, that a behaviour proven at a lower tier is
not proven again at a higher one, that a test over the project's threshold carries the `slow`
marker, that every skip and expected failure carries an issue link, and that a file of adversarial
tests is named by feature. Each rule SHALL name its source. `test-suite-care` SHALL cite these
rules by number and SHALL NOT restate them (test-suite-care DEC-10; design D-8).

#### Scenario: An audit finds a broken rule
- **WHEN** an audit finds a skipped test with no issue link
- **THEN** the report lists it under "Broken rules" with the rule's number, not the rule's text
