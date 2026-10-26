## RENAMED Requirements

- FROM: `### Requirement: Tested Neo4j-targeting custom generators, referenced not vendored`
- TO: `### Requirement: Tested Neo4j-targeting custom generators, shipped with the skill`

## MODIFIED Requirements

### Requirement: Tested Neo4j-targeting custom generators, shipped with the skill

The catalogue SHALL provide two custom LinkML generators — a Neo4j Cypher-constraint generator and
a neomodel OGM generator — as tested code shipped with the `linkml-engineering` skill under
`skills/linkml-engineering/scripts/linkml_neo4j/`, each built on LinkML's `Generator` base class per
the existing custom-generator mechanism. They SHALL live in the skill's `scripts/` (owner,
2026-10-26, rebundle-by-activity D-13) because an installed skill can reach only its own folder;
skillery's own tests cover them, and the skill documents them in
`references/generation-and-templates.md`. Both generators SHALL resolve relationship targets correctly when
the LinkML range is an abstract class, by mirroring the schema's `is_a` hierarchy as real
inheritance in generated code rather than producing a reference to an undefined class. The Cypher
generator SHALL emit only constraint and index forms verified to work on Neo4j Community Edition,
SHALL emit existence constraints for required multivalued scalar/enum properties, and SHALL support
an opt-in LinkML slot annotation that lowers to a generated index statement. Neither generator
SHALL emit application-layer validation (triggers, procedures, or any construct standing in for
something Neo4j cannot natively enforce) as a substitute for what the neomodel generator's own
Python-layer validation already covers. `project-setup` SHALL project both generators into a
consuming repository as a pinned, refreshable copy (sourced from the skill's `scripts/linkml_neo4j/`,
whose folder the caller passes when the skills are installed),
conditional on the project using LinkML with a Neo4j target, following the same projection
discipline already used for the `meaningfy` OpenSpec schema.

#### Scenario: A relationship's range is an abstract LinkML class

- **WHEN** a slot's range is an abstract class in the LinkML schema
- **THEN** the generated neomodel code defines that class as an abstract base with real Python
  inheritance to its concrete subclasses, and the relationship referencing it resolves to a real,
  registered class rather than an undefined name

#### Scenario: A required slot is multivalued

- **WHEN** a scalar or enum slot is both `required: true` and `multivalued: true`
- **THEN** the Cypher generator emits an existence constraint for that property, rather than
  skipping it because it is multivalued

#### Scenario: A slot is annotated for indexing

- **WHEN** a slot in the schema carries an opt-in index annotation
- **THEN** the Cypher generator emits a corresponding `CREATE INDEX` statement, without requiring
  a hand-maintained index file

#### Scenario: Projecting the generators into a consuming project

- **WHEN** `project-setup` scaffolds or modernises a project that uses LinkML with a Neo4j target
- **THEN** it projects a pinned copy of both generators from the skill's `scripts/linkml_neo4j/`, refreshable
  later by re-running the skill and reviewing the diff, the same discipline already used for the
  `meaningfy` OpenSpec schema

#### Scenario: Something Neo4j cannot natively enforce

- **WHEN** a LinkML construct (an enum's permissible values, a pattern, numeric bounds, or a
  relationship cardinality lower bound) has no native Neo4j constraint equivalent
- **THEN** neither generator emits a substitute enforcement mechanism for it; the neomodel
  generator's existing Python-layer validation remains the only enforcement for that construct

#### Scenario: A generator's code changes

- **WHEN** a change adds or modifies generator code
- **THEN** the code lives under `skills/linkml-engineering/scripts/linkml_neo4j/` and the change
  passes the generators' tests in skillery's `tests/`

### Requirement: Dual-CLI parity and deferred scope

The skill SHALL ship to both Claude Code and opencode from its single source in `skills/` (installed
from there on both CLIs, with no committed per-CLI copy), and its body SHALL stay CLI-agnostic. This
skill SHALL NOT introduce a model2owl configuration/transformation skill, an ontology/semantic-modelling
skill, or a greenfield LinkML workflow. Custom generator code IS in scope for the
skill — tested, projectable scripts shipped in its `scripts/linkml_neo4j/` (see the generators
requirement above); the prior blanket deferral of "new tooling or CLI" applied to the skill's
original, documentation-only scope and does not extend to this narrower, tested-and-projected class of
scripts.

#### Scenario: The catalogue is validated

- **WHEN** `make validate` runs over the change
- **THEN** `linkml-engineering` resolves under `meaningfy-architecture` in `bundles.yaml`, the bundle
  renderings are in sync, the version-sync gate passes, and no deferred artefact (model2owl skill,
  ontology skill, new tooling) is present

#### Scenario: A new custom generator is proposed

- **WHEN** a change proposes adding a custom generator as tested code with a `project-setup`
  projection path
- **THEN** it is in scope for `linkml-engineering`, distinguishing it from the general "new tooling or
  CLI" deferral, and its code lives in the skill's `scripts/`
