## MODIFIED Requirements

### Requirement: Dual-CLI parity and deferred scope

The skill SHALL ship to both Claude Code and opencode from its single source in `skills/` (installed
from there on both CLIs, with no committed per-CLI copy), and its body SHALL stay CLI-agnostic. This
skill SHALL NOT introduce a model2owl configuration/transformation skill, an ontology/semantic-modelling
skill, or a greenfield LinkML workflow. Custom generator tooling IS in scope for the skill to
*document and cite* — as tested, projectable repo tooling at `tools/linkml_neo4j/` (see the generators
requirement above) — but SHALL NOT be vendored as a skill asset; the prior blanket deferral of "new
tooling or CLI" applied to the skill's original, documentation-only scope and does not extend to
referencing this narrower, tested-and-projected class of repo tooling.

#### Scenario: The catalogue is validated

- **WHEN** `make validate` runs over the change
- **THEN** `linkml-engineering` resolves under `meaningfy-architecture` in `bundles.yaml`, the bundle
  renderings are in sync, the version-sync gate passes, and no deferred artefact (model2owl skill,
  ontology skill, new tooling) is present

#### Scenario: A new custom generator is proposed

- **WHEN** a change proposes adding a custom generator as tested repo tooling with a
  `project-setup` projection path
- **THEN** it is in scope for `linkml-engineering` to document and cite, distinguishing it from the
  general "new tooling or CLI" deferral, provided the generator's code itself lives outside the
  skill directory
