<!-- CONDITIONAL (design D-16): this delta holds only if stage 1's decision table says `fill` for
     Vale or for the docs ls-lint. A check that ends `accept` has its requirement, or its part of
     it, deleted in stage 1's PR. -->

## ADDED Requirements

### Requirement: Documentation checks run in the verify phase
Where the documentation stage adopted them from a recorded failure, `technical-writing` SHALL name
Vale and the docs ls-lint configuration as checks of the `verify` phase, run inside the project's
docs gate, and SHALL state for each when it runs, whether it blocks and what it costs. Vale's
findings SHALL be reported in the PR description and SHALL NOT block; a docs file or folder name
that breaks the ls-lint configuration SHALL fail the gate. The workflow's phases and gates SHALL
stay as they are (activity-test-profiles DEC-4, DEC-8; design D-6).

#### Scenario: Vale finds a problem in a how-to page
- **WHEN** the docs stage runs `verify` on a project that fetched `quality/` and Vale reports a finding
- **THEN** the finding is listed in the PR description, and the docs gate is not failed by it

#### Scenario: A badly named docs file
- **WHEN** a page is added as `docs/How To Install.md` in a project whose docs gate runs the docs ls-lint configuration
- **THEN** the docs gate fails, naming the file and the rule

#### Scenario: A project without the checks
- **WHEN** a project has not fetched `quality/`
- **THEN** the `verify` phase runs as before, and no gate is missing
