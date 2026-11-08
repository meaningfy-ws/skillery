## MODIFIED Requirements

### Requirement: The validator enforces single-source-of-authority

`tools/repo_lint/lint.py` SHALL fail the build when the single-source-of-authority property is broken:
every `skills/*/SKILL.md` SHALL have a `## Boundary & Related Skills` section; `Related`/`Delegates`
links SHALL be reciprocal; every skill named in an `agents/*.md` list SHALL exist and the agent's skills
SHALL cover the delegations its primary skill declares; ownership claims SHALL be blocking. `make
validate` SHALL also fail when a default workflow file names a skill or agent that is neither in the
catalogue nor in the `skills:` list of a `dependencies.yaml` entry, when such a list holds a
non-kebab name, a name listed in two entries or a name of a `skills/` directory, and when a `mod`
hook binding and the mod's strict rules disagree.

#### Scenario: A skill without a Boundary section fails CI

- **WHEN** the validator runs over a `skills/*/SKILL.md` that has no `## Boundary & Related Skills` section
- **THEN** the build fails with that file named

#### Scenario: A non-reciprocal Related link fails CI

- **WHEN** skill A lists skill B under Related/Delegates but B does not list A
- **THEN** the validator reports the asymmetry and fails the build

#### Scenario: An agent skills list out of step with its skill's delegations fails CI

- **WHEN** an `agents/*.md` primary skill delegates to a skill the agent does not load
- **THEN** the validator reports the misalignment and fails the build

#### Scenario: A workflow file names a missing skill fails CI

- **WHEN** a default workflow file names a skill that is neither in `skills/` nor in a `dependencies.yaml` `skills:` list
- **THEN** `make validate` fails, naming the file and the skill

#### Scenario: A malformed dependency skills list fails CI

- **WHEN** `superpowers` and another entry of `dependencies.yaml` both list `brainstorming` under `skills:`
- **THEN** `make validate` fails, naming the skill and both entries
