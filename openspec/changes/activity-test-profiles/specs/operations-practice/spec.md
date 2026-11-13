<!-- CONDITIONAL (design D-16): this delta holds only if stage 3's decision table says `fill`.
     A check that ends `accept` has its part deleted in stage 3's PR. -->

## ADDED Requirements

### Requirement: Layout and Makefile checks for stacks
Where the DevOps stage adopted them from a recorded failure, `stack-operations` SHALL name the
stacks ls-lint configuration as the check of a stacks repository's layout and names, and
`infrastructure-operations` SHALL name the checkmake configuration among the checks of an
infrastructure repository, each with when it runs, whether it blocks and what it costs. The skills
SHALL recommend them as pull-request checks and SHALL NOT state that the infrastructure
repositories run them: adopting them there is that repository's own change
(activity-test-profiles DEC-4, DEC-8; design D-6).

#### Scenario: A stack folder that breaks the naming rule
- **WHEN** the stacks ls-lint configuration is run on a repository where one stack folder is named `Reverse_Proxy` and the others are in kebab-case
- **THEN** the run names the folder and the rule, and changes nothing

#### Scenario: A Makefile target without a phony declaration
- **WHEN** checkmake runs with the stacks configuration on a Makefile whose `deploy` target is not declared phony
- **THEN** the run reports the target and the rule

#### Scenario: Reading the skill before adoption
- **WHEN** a devops engineer reads `stack-standard.md` or `repo-checks.md` before the stacks repositories adopt the checks
- **THEN** each file lists its check under *Recommended checks*, with a pointer to the adoption issue, and not among the required checks
