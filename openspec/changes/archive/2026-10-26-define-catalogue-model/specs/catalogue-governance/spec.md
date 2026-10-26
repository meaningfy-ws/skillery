## ADDED Requirements

### Requirement: Bundles declare the bundles they require

A bundle in `bundles.yaml` SHALL list, under `requires:`, every other bundle that one of its skills
depends on; `meaningfy-core` is implicit and SHALL NOT be listed. `meaningfy-core` SHALL require no
bundle, and the requirement graph SHALL be acyclic. Every "depends on" edge between skills (a skill
named on another skill's `**Delegates:**` line) that crosses bundles SHALL point into `meaningfy-core`
or into a required bundle. A hand-off that would break one of these rules SHALL be reworded as
"related" or the skill moved; a requirement SHALL NOT be added to hide a cycle.

#### Scenario: An undeclared cross-bundle dependency

- **WHEN** a skill in `meaningfy-consulting` names a `meaningfy-building` skill on its `**Delegates:**`
  line and `meaningfy-consulting` does not require `meaningfy-building`
- **THEN** validation fails, naming the edge and the missing requirement

#### Scenario: A cycle between bundles

- **WHEN** `meaningfy-building` requires `meaningfy-architecture` and `meaningfy-architecture`
  requires `meaningfy-building`
- **THEN** validation fails and names the cycle

#### Scenario: Core depends outward

- **WHEN** a `meaningfy-core` skill names a skill of another bundle on its `**Delegates:**` line
- **THEN** validation fails, because `meaningfy-core` requires nothing

## MODIFIED Requirements

### Requirement: A skill fix names its posture

The development method SHALL require that a change to a skill names the skill's posture before the
edit: R (reusable core: no domain content enters `SKILL.md`), C (core with profiles: a fix adds a
switch or a profile, never a silent default) or P (precise house standard: a fix adds a guardrail with
an enforcement home). The posture SHALL be recorded on every skill and agent as `metadata.posture`
(`reusable`, `profiled` or `precise`), so a contributor reads it instead of deciding it again.

#### Scenario: A reusable skill receives a domain fact

- **WHEN** a fix to an R skill would add a fact about one client domain to its `SKILL.md`
- **THEN** the fact goes in a reference file or a profile instead

#### Scenario: A contributor fixes a skill

- **WHEN** a contributor prepares a fix to `executive-communication`
- **THEN** its frontmatter states `posture: profiled`, so the fix adds a switch or a profile and no
  silent default
