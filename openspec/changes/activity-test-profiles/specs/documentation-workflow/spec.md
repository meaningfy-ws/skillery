<!-- CONDITIONAL (design D-14): each requirement holds only if stage 1's decision table says
     `fill` for its check. A check that ends `accept` has its requirement deleted in stage 1's PR;
     a scenario that no longer fits the recorded failure is rewritten and signed off there. -->

## ADDED Requirements

### Requirement: Vale runs in the verify phase and does not block
`technical-writing` SHALL name Vale as a step of the `verify` phase, run by the writer beside the
project's docs gate from the project's fetched `.quality/` folder, naming the check in one sentence
and pointing to its row of `quality/README.md`, which SHALL state the command, when it runs, that
it does not block and what it costs (design D-40). The rules enabled SHALL be those the developer
marked against Meaningfy's voice (design D-39). Its findings SHALL be reported in the PR
description. The workflow's phases and gates, and the project's docs gate command, SHALL stay as
they are (activity-test-profiles DEC-4, DEC-8; design D-12).

#### Scenario: Vale finds a problem in a how-to page
- **WHEN** the writer runs the `verify` phase on a project that fetched `.quality/` and has Vale installed, and Vale reports a finding
- **THEN** the finding is listed in the PR description, and the PR is not held back by it

#### Scenario: A project without Vale
- **WHEN** a project has not fetched `.quality/`, or has no Vale installed
- **THEN** the `verify` phase runs the snippets and the docs gate as before, and the step is skipped with a one-line note in the PR description

### Requirement: Docs names are checked in the verify phase
`technical-writing` SHALL name the docs ls-lint configuration as a step of the `verify` phase, run
by the writer from the project's fetched `.quality/` folder, naming the check in one sentence and
pointing to its row of `quality/README.md`, which SHALL state the command, when it runs, whether
it blocks and what it costs (design D-40). A docs file or folder name that breaks the configuration
SHALL be fixed before the PR; no gate SHALL be added for it (activity-test-profiles DEC-4, DEC-8;
design D-12).

#### Scenario: A badly named docs file
- **WHEN** a page is added as `docs/How To Install.md` and the writer runs the docs ls-lint step in `verify`
- **THEN** the run names the file and the rule, and the writer renames the file before opening the PR
