# formal-reasoning Specification

## Purpose
Exact, explained answers about rules and facts: one skill picks the engine (clingo or SWI-Prolog) by
the shape of the question and runs a test-first, paraphrase-back loop, with competency questions as
tests whose answers are agreed beforehand.
## Requirements
### Requirement: One reasoning skill owns engine choice and the reasoning loop
The catalogue SHALL have exactly one skill, `formal-reasoning` in meaningfy-architecture, that owns which
reasoning engine to use for which question and how to use it: the test-first, paraphrase-back loop,
the pure-subset rules, the reasoning patterns, rules from text, and competency-question testing. No other
skill SHALL restate these; the modelling skills SHALL cite it.

#### Scenario: A modelling skill needs a competency-question test
- **WHEN** conceptual-modelling or linkml-engineering mentions testing competency questions
- **THEN** it cites `formal-reasoning` in one line and does not describe the test format itself

### Requirement: Engine choice follows the shape of the problem
The skill SHALL route a finite rule set with defaults, exceptions, priorities, consistency checks,
minimal fixes or allocation to clingo; closure, lineage and competency questions over a fact base to
SWI-Prolog; and conformance of data to a model to the existing SHACL/OWL toolchain. Before choosing clingo it
SHALL make the grounding size visible, and it SHALL route row-scale fact bases to SWI-Prolog.

#### Scenario: A rule set with exceptions
- **WHEN** the question is whether a rule set with priorities and exceptions has conflicts
- **THEN** the skill chooses clingo, and the conflict test's answer atoms name the conflicting rules and the situation in which they clash

#### Scenario: Closure over a large fact base
- **WHEN** the question is a transitive closure over tens of thousands of facts
- **THEN** the skill chooses SWI-Prolog with tabling, not clingo

#### Scenario: Data conformance
- **WHEN** the question is whether instance data conforms to the model
- **THEN** the skill routes to the SHACL/OWL toolchain of the modelling skills and runs no engine of its own

### Requirement: Installation is separate from use
Engines SHALL be declared in `dependencies.yaml` with install lines, and SHALL never be installed or bundled
by the skill. A `check_env` script SHALL report each engine as present (with version) or missing (with the
install hint) and SHALL exit non-zero when an engine the caller asked for is missing.

#### Scenario: SWI-Prolog is missing
- **WHEN** `check_env.py --need prolog` runs on a machine without `swipl`
- **THEN** it prints the install hint for SWI-Prolog and exits non-zero, and nothing is installed

### Requirement: Every run is test-first and paraphrased back
A reasoning run SHALL take a rules file, an optional facts file and a tests file of queries with expected
answers, and SHALL report per test pass or fail, the actual answer, the time, and for clingo the grounding
size. Every rule SHALL carry a plain-language paraphrase comment, and a run SHALL refuse a rules file that
has a rule without one. A run SHALL refuse a Prolog rules file that uses a construct outside the pure subset.

#### Scenario: All expected answers hold
- **WHEN** `run_rules.py` runs a rules file whose tests all hold
- **THEN** it prints each rule's paraphrase and one `PASS id: <answer>` line per test, and exits 0

#### Scenario: A test fails
- **WHEN** one expected answer differs from the engine's answer
- **THEN** the run reports that test as failed with expected and actual, and exits 1

#### Scenario: A rule without a paraphrase
- **WHEN** a rule in the rules file has no paraphrase comment
- **THEN** the run refuses before reasoning, names the rule's line, and exits 2

#### Scenario: Impure Prolog
- **WHEN** a Prolog rules file uses a cut, `assert` or `retract`
- **THEN** the run refuses, names the construct and its line, and exits 2

### Requirement: Competency questions are tests with answers agreed beforehand
A competency question SHALL be written as a test entry with the question in natural language, its query, the
expected answer, and who agreed the answer and when, run over fixture facts on every model change.

#### Scenario: The model changes and breaks a competency question
- **WHEN** a model change makes a competency query return a different answer from the agreed one
- **THEN** the run fails and names the competency question by its id and natural-language text

### Requirement: Rules from text keep their source
When rules are derived from natural-language text, each rule SHALL cite its source clause id, only clauses
that can be paraphrased back SHALL be formalised, and the rest SHALL be listed as flagged prose.

#### Scenario: An ambiguous clause
- **WHEN** a clause cannot be paraphrased back unambiguously
- **THEN** it is listed as flagged prose for human judgement and no rule is written for it

