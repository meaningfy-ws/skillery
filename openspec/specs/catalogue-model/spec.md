# catalogue-model Specification

## Purpose
How the catalogue describes itself: the facets every skill and agent declares from one vocabulary
file, the bundles each bundle requires, the generated catalogue map, and the documentation register.
## Requirements
### Requirement: Every skill and agent declares its facets

Every `skills/<name>/SKILL.md` and every `agents/<name>.md` SHALL declare six facets as string values
under frontmatter `metadata`: `purpose`, `area`, `subject`, `posture`, `stage` and `maturity`. Each
value SHALL be one of the values listed for that facet in `facets.yaml` at the repository root. A
facet SHALL hold exactly one value. Validation SHALL fail for a missing facet, a list, or a value
outside the vocabulary.

#### Scenario: A value outside the vocabulary

- **WHEN** a skill declares `metadata.stage: deploy` and `facets.yaml` lists no `deploy` under `stage`
- **THEN** validation fails, naming the skill, the facet and the allowed values

#### Scenario: An agent without facets

- **WHEN** an agent file has no `metadata.posture`
- **THEN** validation fails for that agent

### Requirement: Facet vocabularies live in one file

`facets.yaml` SHALL be the only place where facet values and their one-line explanations are defined.
The inventory generator and the validator SHALL read it, and no other file SHALL hold a list of
purposes or categories.

#### Scenario: A new value is needed

- **WHEN** a contributor needs a new `subject` value
- **THEN** they add one line to `facets.yaml`, and no change to the generator or the validator is
  needed

### Requirement: The catalogue map is generated and covers skills and agents

`docs/skill-inventory.md` SHALL be generated from `bundles.yaml`, `facets.yaml` and the skill and agent
files, and SHALL show both skills and agents: by bundle, with the bundle requirements, the depends-on
and related edges, and a table per facet that lists the skills and agents for each value. The
existing drift test SHALL fail when the file differs from what the generator produces.

#### Scenario: An agent's facet changes

- **WHEN** an agent's `metadata.stage` changes and the map is not regenerated
- **THEN** the drift test fails

#### Scenario: Looking up the reusable skills

- **WHEN** a reader opens the map's `posture` table
- **THEN** the `reusable` row lists every skill and agent declaring `posture: reusable`

### Requirement: The documentation register covers every documentation view

`docs/development/README.md` §8 SHALL hold the documentation register. Each row SHALL name a view (a
path or a glob), its kind (generated or hand-written), its source or the one topic it owns, and the
make target that renders it when it is generated. Every `docs/**/*.md` file, and `README.md`,
`AGENTS.md` and `CLAUDE.md`, SHALL match a row. Validation SHALL fail for a file that matches none.

#### Scenario: A new doc without a register row

- **WHEN** a contributor adds `docs/environment/new-guide.md` and no register row matches it
- **THEN** validation fails, naming the file

#### Scenario: A generated view

- **WHEN** a reader looks up `docs/skill-inventory.md` in the register
- **THEN** its row says it is generated, from which sources, by `make skill-inventory`

### Requirement: The purpose facet names Meaningfy's activities

The values of the `purpose` facet in `facets.yaml` SHALL be Meaningfy's activities (software
development, modelling, client delivery, advising, content, offers, proposals, CRM, devops and
personal knowledge, as approved by the owner), and a new value SHALL be added only with the owner's
approval. A bundle's skills and agents SHALL each declare the activity they serve.

#### Scenario: A skill tagged with a retired purpose

- **WHEN** a skill declares `metadata.purpose: quality` after the vocabulary change
- **THEN** validation fails, naming the skill and listing the activity values

