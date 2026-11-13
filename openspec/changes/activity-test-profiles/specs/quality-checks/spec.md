<!-- The `quality-checks` capability is created by EPIC B (harden-checks-and-tests).
     CONDITIONAL (design D-16): each requirement holds only for a tool its stage adopted. -->

## ADDED Requirements

### Requirement: Vale's styles are pinned, never copied
`quality/` SHALL hold Vale's configuration, its word lists and a manifest of its external styles,
each with its source, pinned version, licence and the reason it was picked, approved by the
developer; the styles SHALL be fetched at their pin and no style rule file SHALL be committed. Only
rules the developer marked worth fixing, from their findings, SHALL be enabled, and no Meaningfy-own
rule SHALL be added (activity-test-profiles DEC-4, No-gos; harden-checks-and-tests DEC-6; design
D-9, D-11).

#### Scenario: A style file committed
- **WHEN** a file other than the manifest, the configuration and the word lists is added under `quality/vale/`
- **THEN** the local `make validate` fails, naming the file

#### Scenario: A style without a licence
- **WHEN** a manifest entry has no licence
- **THEN** the local `make validate` fails, naming the entry

### Requirement: Docs and stacks configurations
`quality/` SHALL hold, for each one its stage adopted, an ls-lint configuration for docs trees, an
ls-lint configuration for stacks repositories and a checkmake configuration for stacks Makefiles,
as files separate from the configurations for scaffolded projects, each with a fixture test that
shows it catching a bad case and passing a good one (activity-test-profiles DEC-4, DEC-7; design
D-11, D-12).

#### Scenario: A configuration without a fixture
- **WHEN** `quality/ls-lint/docs.yml` exists and no fixture test covers it
- **THEN** the local `make validate` fails, naming the configuration

#### Scenario: The fixture replays the recorded failure
- **WHEN** the docs configuration's fixture test runs
- **THEN** its bad case is the failure the stage's survey cites, reduced, and the configuration flags it
