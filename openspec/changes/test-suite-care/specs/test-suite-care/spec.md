<!-- Delta of the PLAN (design.md). The first requirement and the one on checks that are not code come from the shaping. -->

## ADDED Requirements

### Requirement: A test suite is reduced only against the features it serves, by the owner's decision
An audit of a test suite SHALL measure the cost of each test, SHALL map each test to the spec
scenario it serves or to "serves none", and SHALL report each proposed reduction with its evidence,
its saving and the scenario it touches. A test SHALL be merged or dropped only when its scenario
stays covered and the owner has approved the proposal. The audit SHALL NOT set a time target
(test-suite-care DEC-2, DEC-4, DEC-5).

#### Scenario: A redundant test
- **WHEN** the audit finds two tests that serve the same scenario and cover the same code
- **THEN** it proposes merging or dropping one, names the scenario and the saving, and changes nothing until the owner approves

#### Scenario: The only test of a scenario
- **WHEN** a slow test is the only one that serves a spec scenario
- **THEN** the audit may propose a slower lane or a cheaper set-up for it, and does not propose dropping it

#### Scenario: Nothing worth reducing
- **WHEN** the owner discusses the report and approves no proposal
- **THEN** the audit is complete, and the report records the decision

### Requirement: A check that is not code is assessed for the project and the task
An assessment of a check that is not code SHALL show whether the check catches a planted flaw,
whether it gives the same verdict when run again, and what it costs against what it has found. The
owner SHALL decide what follows; the assessment SHALL NOT retire a check (test-suite-care DEC-11).

#### Scenario: A reader that misses the planted flaw
- **WHEN** an adversarial reader is run on a draft with a planted flaw and does not report it
- **THEN** the assessment records the miss with the run's evidence, and the owner decides whether the check is changed, kept or dropped

#### Scenario: A reader that changes its mind
- **WHEN** three runs of a check on the same seeded copy report three different sets of planted flaws
- **THEN** the report says "unstable", gives the three lists and no pass mark

### Requirement: Proposals are classed by what they can lose
The audit SHALL class each proposal: class 1 changes a fixture's scope, a marker or a lane and
removes no test; class 2 merges parametrised cases; class 3 drops a test. The report SHALL list
class 1 first. A class 3 proposal SHALL require that the test and one other test are mapped to the
same scenario with high confidence. Overlap of covered lines SHALL NOT be the only evidence of a
class 2 or class 3 proposal (design D-4, D-6).

#### Scenario: Set-up dominates
- **WHEN** the measurements show a function-scoped fixture among the ten costliest and no test changes what it builds
- **THEN** the report's first proposal is to share that fixture, classed 1, with "scenarios touched: none"

#### Scenario: Covered lines only
- **WHEN** a test's covered lines are contained in another test's and the map gives the test confidence "medium"
- **THEN** the audit makes no class 3 proposal for it

### Requirement: The scenario map records a level and a confidence
The map SHALL hold one row per test function with the level it reaches (scenario, requirement,
capability or none), a confidence (high, medium or none) and the evidence. A test that cannot be
assigned SHALL be recorded as "none" and listed for the owner. The owner SHALL check a random
sample of the map before any proposal is discussed (design D-5).

#### Scenario: A test that fits no scenario
- **WHEN** a unit test's name, docstring and covered code match no scenario or requirement
- **THEN** its row is "none", it appears under "Tests that serve no scenario", and no proposal drops it

#### Scenario: A repository without specs
- **WHEN** the audited repository has no spec spine and no feature files
- **THEN** every row is "none" and the report says the proposals are limited to class 1

### Requirement: The audit is read-only and the skill is neutral to the repository
The audit's runs SHALL NOT edit a file of the audited repository; the map and the report SHALL
reach it only through a pull request. The skill's text SHALL name no repository, path or threshold
of a particular project (test-suite-care DEC-12; design D-2, D-15).

#### Scenario: A project without per-test coverage
- **WHEN** the audited project has no pytest-cov
- **THEN** the audit runs the timing run only and the report names the kinds of waste it could not look for

### Requirement: A scaffolded project has developer lanes
A project scaffolded by `project-setup` SHALL have a `slow` marker whose description states the
project's threshold, a lane that leaves slow tests out, a lane that runs the tests of the changed
files, and a profiling target. The lanes SHALL NOT remove a test from a CI run (design D-10).

#### Scenario: A change in one layer
- **WHEN** a developer changes a file under the package's services layer and runs the changed-files lane
- **THEN** the unit tests of the services layer run, and a change to a shared file falls back to the fast lane

### Requirement: A UI suite is audited from its runner's report
For a UI suite the audit SHALL take time per test and retries from the runner's own report, SHALL
map a spec to its scenario by its titles or its feature file, and SHALL report a broken UI test
rule as a finding (design D-9).

#### Scenario: Logging in through the screen
- **WHEN** every spec of a UI suite logs in through the login page
- **THEN** the report proposes setting the session through the API, classed 1
