# code-principles-governance Specification

## Purpose
Keep the code-principles standard **single-sourced and enforced**: one catalogue
(`cosmic-python:references/principles-and-anti-patterns.md`) owns the principles, best-practices, and
anti-patterns; every skill, agent, and binding cites entries by id rather than restating them; and the
validator fails the build when single-source-of-authority is broken. Also fixes recurring code defects
(free strings / raw dicts in any layer), positions BDD scenario authoring in the design phase, mandates
component-first organisation with enforced import guardrails for larger projects, and decouples config
consumption from its source.

## Requirements
### Requirement: A single catalogue owns the code principles, best-practices, and anti-patterns

`cosmic-python` SHALL own one catalogue file (`skills/cosmic-python/references/principles-and-anti-patterns.md`)
that is the **single source of authority** for code principles, best-practices, and anti-patterns. Every
other skill, agent, or binding SHALL reference catalogue entries **by their stable id** and SHALL NOT
restate the rule text. The catalogue SHALL name the four seed principles explicitly, including
`design-for-reuse-and-compactness`.

#### Scenario: A citer references a rule by id

- **WHEN** `meaningfy-code-review` (or an agent wrapper) needs an architecture or code-quality rule
- **THEN** it cites the catalogue entry id (e.g. `AP-DICT-AS-MODEL`) and does not copy the rule text

#### Scenario: A restated rule is rejected

- **WHEN** the same principle text appears both in the catalogue and verbatim in a citing skill
- **THEN** it is a single-source-of-authority breach and the duplicate is replaced by an id citation

#### Scenario: The compactness principle is present

- **WHEN** the catalogue is reviewed against the seed principles
- **THEN** `design-for-reuse-and-compactness` exists as a named entry, not merely implied by a reuse rule

### Requirement: Free strings and raw dicts are rejected in every layer

The catalogue and `meaningfy-code-review` SHALL apply the no-free-strings and prefer-models-over-dicts
rules to **all layers**, including `adapters` and `entrypoints` — not only `models` and `services`.

#### Scenario: A literal structural key in an adapter is flagged

- **WHEN** review encounters a literal dict such as `{"head": {"vars": []}, "results": {"bindings": []}}` in an adapter
- **THEN** it is flagged against `AP-DICT-AS-MODEL` and `AP-DUP-CONST` with a file:line and a fix

#### Scenario: A constant duplicated across sibling files is flagged

- **WHEN** the same structural constants are defined in more than one sibling module
- **THEN** review reports `AP-DUP-CONST` and the fix is to lift them to one shared module and import

### Requirement: New code is surveyed for reuse before it is written

The implement phase SHALL include a survey-&-reuse step: before writing a new file/class, read the
sibling files and search for existing constants, enums, models, and helpers, then decide
reuse / extend / refactor-to-fit. This SHALL be enforced on a surface the harness honours
(the `implementer` agent wrapper) and recorded in `spine/workflows.md`.

#### Scenario: Implementer surveys before creating a file

- **WHEN** the `implementer` agent begins a task that adds a new module
- **THEN** it first reads sibling modules and greps for reusable symbols, and reuses or extends them
  rather than redefining equivalents

### Requirement: BDD scenarios are authored in the design phase

`bdd-gherkin` scenario authoring SHALL be a **design-phase** activity producing `.feature` files as a
PLAN artifact that `clarity-gate` can score for coverage; `epic-planning` elicitation SHALL include a
test-scenario / assertion / edge-case interview. Step definitions and production code SHALL remain in
the implement phase.

#### Scenario: Feature scenarios exist before implementation

- **WHEN** an EPIC's PLAN is gated by `clarity-gate`
- **THEN** the authored `.feature` scenarios (with edge cases) are present as a design artifact and
  their coverage is scored, while step definitions are deferred to the implement phase

### Requirement: The validator enforces single-source-of-authority

`tools/repo_lint/lint.py` SHALL fail the build when the single-source-of-authority property is broken:
every `skills/*/SKILL.md` SHALL have a `## Boundary & Related Skills` section; `Related`/`Delegates`
links SHALL be reciprocal; every skill named in an `agents/*.md` list SHALL exist and the agent's skills
SHALL cover the delegations its primary skill declares; ownership claims SHALL be blocking.

#### Scenario: A skill without a Boundary section fails CI

- **WHEN** the validator runs over a `skills/*/SKILL.md` that has no `## Boundary & Related Skills` section
- **THEN** the build fails with that file named

#### Scenario: A non-reciprocal Related link fails CI

- **WHEN** skill A lists skill B under Related/Delegates but B does not list A
- **THEN** the validator reports the asymmetry and fails the build

#### Scenario: An agent skills list out of step with its skill's delegations fails CI

- **WHEN** an `agents/*.md` primary skill delegates to a skill the agent does not load
- **THEN** the validator reports the misalignment and fails the build

### Requirement: Larger projects are organised component-first with enforced, groomed guardrails

A larger project SHALL be organised **component-first** (`<root>/<component>/{models,adapters,services,
entrypoints}` plus one inward-looking `core`/`commons` component), never layer-first with components nested
inside layers, and never two layouts in parallel. Component and tier boundaries SHALL be enforced by
import-linter and the contracts SHALL be groomed when components are added/renamed/refactored.

#### Scenario: A component-first layout with core

- **WHEN** a project grows beyond a single small service
- **THEN** each component owns its layers, a `core`/`commons` component is imported by others and imports
  none of them, and `.importlinter` contracts enforce per-component layers + tier hierarchy + commons isolation

### Requirement: Application configuration is consumed decoupled from its source

When a project has settings, code SHALL consume them through typed config classes resolved by an injected
resolver (keyed by field name), never via scattered direct environment reads; projects with no settings skip
this entirely. The principle is mandatory; the `env_property`/`ConfigResolverABC` implementation is a reference.

#### Scenario: Config consumed without knowing the source

- **WHEN** code reads a configuration value
- **THEN** it reads a typed field off a config class (resolver-injected), and the resolver can be swapped
  (e.g. a default resolver in tests) without changing the consumer

