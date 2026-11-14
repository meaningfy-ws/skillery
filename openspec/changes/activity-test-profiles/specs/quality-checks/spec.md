<!-- The `quality-checks` capability is created by EPIC B (harden-checks-and-tests); C is archived
     after B (design D-16). CONDITIONAL (design D-14): each requirement holds only for a tool its
     stage adopted. -->

## ADDED Requirements

### Requirement: Vale's styles are pinned, never copied
`quality/vale/` SHALL hold Vale's configuration and a manifest of its external styles, each entry
with its id, repository, tag, archive address, licence, the reason it was picked and the mode
`report-only`, approved by the developer; the styles SHALL be fetched at their tag and no style
file SHALL be committed. Only rules the developer marked worth fixing, from their findings, SHALL
be enabled, and no Meaningfy-own rule or word list SHALL be added (activity-test-profiles DEC-4,
No-gos; harden-checks-and-tests DEC-6; design D-8, D-9).

#### Scenario: A style file committed
- **WHEN** a file other than the configuration and the manifest is tracked under `quality/vale/`
- **THEN** `make validate` fails, naming the file

#### Scenario: A style without a licence
- **WHEN** a manifest entry has no licence
- **THEN** `make validate` fails, naming the entry and the field

### Requirement: Docs and stacks configurations
`quality/` SHALL hold, for each one its stage adopted, an ls-lint configuration for docs trees, an
ls-lint configuration for stacks repositories and a checkmake configuration for stacks Makefiles,
as files separate from the configurations for scaffolded projects and listed in `quality/README.md`,
each with a fixture pair under `tests/fixtures/quality/` and a tool test that shows it flagging the
bad case once per enabled rule and passing the good one (activity-test-profiles DEC-4, DEC-7;
design D-9, D-18).

#### Scenario: A configuration without a fixture
- **WHEN** `quality/ls-lint/docs.yml` exists and no fixture pair exists for it
- **THEN** `make validate` fails, naming the configuration

#### Scenario: The fixture replays the recorded failure
- **WHEN** the docs configuration's tool test runs locally with ls-lint installed
- **THEN** its bad case is the failure the stage's survey cites, reduced, and the configuration flags it
