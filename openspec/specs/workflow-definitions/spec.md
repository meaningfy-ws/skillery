# workflow-definitions Specification

## Purpose
How the workflows navigator follows are defined: data files that name phases, owning skills, expected skills, gates and variants, shipped by the skill that owns each process and overridable per repository. Archived from the `navigator` change (2026-11-09).
## Requirements
### Requirement: Workflows are data that cite their owning skills
A workflow file SHALL list phases, the owning skill of each phase, the skills expected to run, the
gates and, where it applies, the review set per appetite, naming skills and agents only by name; it
SHALL NOT restate rule text a skill owns (DEC-1); the review set of the build-tier file is owned by
that file itself. Every skill or agent a default workflow file names SHALL exist in
the catalogue or appear in the `skills:` list of a `dependencies.yaml` entry, checked by
`make validate` (DEC-14).

#### Scenario: A default file names a skill that does not exist
- **WHEN** a default workflow file names `epic-deliverie`
- **THEN** `make validate` fails, naming the file and the unknown name

### Requirement: Default workflow files live in their host skills
The four default workflow files SHALL live in one host skill each: build-tier (with exploratory and
brownfield variants) in `epic-delivery`, architecting and modelling in `architecture`, DevOps (with
interactive intervention, incident, check-up and unattended variants) in
`infrastructure-operations`, and sales in `sales-operations` (DEC-13). Each host skill SHALL point
to its file.

#### Scenario: Looking up the DevOps workflow
- **WHEN** a contributor looks for the DevOps phases the band uses
- **THEN** `infrastructure-operations` points to its workflow file, which names `service-reliability` for incidents and unattended operations

### Requirement: Repo workflow files override
A repository SHALL be able to add or override workflows with files in its own docs. A repo file with
a default's name SHALL replace that default; a repo file that extends a default SHALL replace only
the fields it gives; a malformed repo file SHALL be reported with its path and first error, never
silently ignored, and the default SHALL stay in force.

#### Scenario: A repo override
- **WHEN** a repo has its own `build-tier` workflow file
- **THEN** navigator uses it instead of the default

#### Scenario: A malformed repo file
- **WHEN** a repo workflow file is not valid
- **THEN** the band shows a warning naming the file and the error, and the default of that name is used

### Requirement: A repo opts into strict mode in its workflow file
A repository SHALL be strict when one of its own workflow files declares mode strict; a default
workflow file SHALL NOT declare a mode (DEC-5).

#### Scenario: A default file declares a mode
- **WHEN** a default workflow file declares mode strict
- **THEN** `make validate` fails, naming the file

