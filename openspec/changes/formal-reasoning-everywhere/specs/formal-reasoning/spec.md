## MODIFIED Requirements

### Requirement: One reasoning skill owns engine choice and the reasoning loop
The catalogue SHALL have exactly one skill, `formal-reasoning` in meaningfy-core, that owns which
reasoning engine to use for which question and how to use it: the test-first, paraphrase-back loop,
the pure-subset rules, the reasoning patterns, rules from text, and competency-question testing. No other
skill SHALL restate these; the modelling skills SHALL cite it.

#### Scenario: A modelling skill needs a competency-question test
- **WHEN** conceptual-modelling or linkml-engineering mentions testing competency questions
- **THEN** it cites `formal-reasoning` in one line and does not describe the test format itself

## ADDED Requirements

### Requirement: Quick tests wherever an engine exists
In any session on a machine where clingo or SWI-Prolog is installed, the skill SHALL let a question with
an exact answer be checked by the smallest reasoning project: facts, rules with paraphrases, and a test
whose expected answer is written before the run. Where no engine is installed, the skill SHALL say in one
line which engine would answer and where its install line is, and SHALL stop without presenting prose
reasoning as checked.

#### Scenario: A quick test outside modelling work
- **WHEN** a user asks, outside any modelling work, whether two stated policies can both apply to the same case, and clingo is installed
- **THEN** the agent writes the facts, the rules with paraphrases and the test with its expected answer, runs it, and reports the engine's answer with the paraphrase table

#### Scenario: No engine installed
- **WHEN** the same question is asked on a machine with neither engine
- **THEN** the agent says in one line which engine would answer and where to find its install line, and does not answer as if the rules had been checked
