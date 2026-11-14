<!-- CONDITIONAL (design D-14): each requirement holds only if stage 3's decision table says
     `fill` for its check. A check that ends `accept` has its requirement deleted in stage 3's PR;
     a scenario that no longer fits the recorded failure is rewritten and signed off there. -->

## ADDED Requirements

### Requirement: A naming check for stacks repositories
`stack-operations` SHALL state the naming rule of a stacks repository and name the stacks ls-lint
configuration as its check, with when it runs, whether it blocks and what it costs. The skill SHALL
recommend it as a pull-request check and SHALL NOT state that the stacks repositories run it:
adopting it there is that repository's own change (activity-test-profiles DEC-4, DEC-8; design
D-12).

#### Scenario: A stack folder that breaks the naming rule
- **WHEN** the stacks ls-lint configuration is run on a repository where one stack folder is named `Reverse_Proxy` and the others are in kebab-case
- **THEN** the run names the folder and the rule, and changes nothing

#### Scenario: Reading the stack standard before adoption
- **WHEN** a devops engineer reads `stack-standard.md` before the stacks repositories adopt the check
- **THEN** the check is listed under *Recommended checks*, with a pointer to the adoption issue

### Requirement: A Makefile check for infrastructure repositories
`infrastructure-operations` SHALL state the Makefile rule and name the checkmake configuration as
its check, with when it runs, whether it blocks and what it costs, as a recommended pull-request
check outside the required checks (activity-test-profiles DEC-4, DEC-8; design D-12).

#### Scenario: A Makefile target without a phony declaration
- **WHEN** checkmake runs with the stacks configuration on a Makefile whose `deploy` target is not declared phony
- **THEN** the run reports the target and the rule

#### Scenario: Reading the repository checks before adoption
- **WHEN** a devops engineer reads `repo-checks.md` before the infrastructure repositories adopt the check
- **THEN** the check is listed under *Recommended checks*, with a pointer to the adoption issue, and not among the required checks
