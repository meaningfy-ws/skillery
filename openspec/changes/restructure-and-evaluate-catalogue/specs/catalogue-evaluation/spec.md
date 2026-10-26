## ADDED Requirements

### Requirement: Every bundle has an outcome eval suite

Each bundle SHALL have a suite under `evals/<bundle>/`, in the `claude plugin eval` case format, with at
least one case per key skill (and, for `meaningfy-building`, at least one case per agent). Each case
SHALL carry one grader for the outcome and one grader that checks the skill or agent fired.

#### Scenario: A bundle without a suite

- **WHEN** a maintainer looks for the evals of `vault-assistant`
- **THEN** `evals/vault-assistant/` holds its cases, each with an outcome grader and a firing grader

#### Scenario: An agent case

- **WHEN** the `meaningfy-building` suite runs
- **THEN** at least one case dispatches each of `epic-planner`, `implementer` and `code-reviewer` and
  grades what the agent returns or refuses

### Requirement: A description change is proven by a trigger set

A change to a skill's description SHALL be measured with a trigger set at `evals/triggers/<skill>.json`
(about 20 queries, half that should trigger and half near-misses), run with `skill-creator`'s
trigger eval before and after on the same model, 3 runs per query, in an environment where no
installed plugin exposes the skill under another name. The change SHALL ship only if at
least 90% of the should-trigger queries fire at a rate of 0.5 or more, at most 10% of the near-misses
do, and the result is not worse than before.

#### Scenario: A rewrite that misfires

- **WHEN** a rewritten description makes 3 of 10 near-misses fire
- **THEN** the change is revised or reverted, and the near-misses stay in the set

### Requirement: Every revision has a before and after record

Each skill or agent revised by an evaluation batch SHALL have a row in that batch's evidence file with
ten columns: item, posture, change, eval, model, runs, before, after, cost (measured, or marked as an
estimate for trigger runs) and verdict (kept, reverted or handed off).

#### Scenario: A revision that did not help

- **WHEN** an item's score after the change is lower than before
- **THEN** the change is reverted and the evidence row records both scores and the verdict "reverted"

### Requirement: Model runs are approved per batch and started by a person

No evaluation SHALL run on push, pull request or release. Each batch that uses model runs SHALL state
its run count, model and cost estimate before it runs, and SHALL run only after the owner approves
that estimate. A batch SHALL NOT exceed the approved amount: suites by a cost ceiling, trigger runs
by a run count derived from a measured unit cost.

#### Scenario: A batch would cost more than approved

- **WHEN** a batch reaches its approved amount before finishing
- **THEN** it stops, records a partial result, and asks before continuing
