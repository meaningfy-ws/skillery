## ADDED Requirements

### Requirement: Colliding triggers are proven by near-miss probes

For every pair of skills whose triggers are known to collide, `tests/trigger_probes.yaml` SHALL hold a
near-miss probe: a phrase that sounds like one skill, whose `expect` names the skill that should fire,
and whose `near_miss_of` names the skill that should not. Every `near_miss_of` SHALL name a real skill.

#### Scenario: A near-miss probe names its neighbour

- **WHEN** the probe "explain how the bundle generator works" is read
- **THEN** it expects `technical-writing` and names `explanatory-writing` in `near_miss_of`

### Requirement: A skill fix names its posture

The development method SHALL require that a change to a skill names the skill's posture before the
edit: R (reusable core: no domain content enters `SKILL.md`), C (core with profiles: a fix adds a
switch or a profile, never a silent default) or P (precise house standard: a fix adds a guardrail with
an enforcement home).

#### Scenario: A reusable skill receives a domain fact

- **WHEN** a fix to an R skill would add a fact about one client domain to its `SKILL.md`
- **THEN** the fact goes in a reference file or a profile instead

### Requirement: Repo documentation states each fact once

Repo documentation outside `skills/` SHALL state each fact in one place and link to it elsewhere.
A documentation edit SHALL NOT increase the total length of the documents it touches unless it adds a
fact that had no home.

#### Scenario: A fact restated in two documents

- **WHEN** the same setup step is written out in two documents
- **THEN** one keeps it and the other links to it
