<!-- The `quality-checks` capability is created by EPIC B (harden-checks-and-tests); C is archived
     after B (design D-16). CONDITIONAL (design D-14): each requirement holds only for a tool its
     stage adopted. -->

## ADDED Requirements

### Requirement: Vale's styles are pinned, never copied
`quality/vale/` SHALL hold Vale's configuration and a manifest of its external styles, each entry
with its id, repository, tag, licence, the reason it was picked and the mode `report-only`,
approved by the developer; the packages the configuration names and the manifest's ids SHALL be
the same set; the styles SHALL be fetched at their tag and no style
file SHALL be committed. Only rules the developer marked worth fixing, from their findings, SHALL
be enabled, and no Meaningfy-own rule or word list SHALL be added. Vale's tool test SHALL run
locally where Vale is installed and SHALL skip in CI, as the other tool tests of `quality/` do
(activity-test-profiles DEC-4, No-gos; harden-checks-and-tests DEC-6, DEC-12; design D-8, D-9).

#### Scenario: A style file in the folder
- **WHEN** a file other than the configuration and the manifest lies under `quality/vale/`
- **THEN** `make validate` fails, naming the file

#### Scenario: A style without a licence
- **WHEN** a manifest entry has no licence
- **THEN** `make validate` fails, naming the entry and the field

### Requirement: A docs naming configuration
Where the documentation stage adopted it, `quality/ls-lint/docs.yml` SHALL hold the ls-lint
configuration for docs trees, separate from the configuration for scaffolded projects and listed in
`quality/README.md`, with a fixture pair under `tests/fixtures/quality/` and a tool test that shows
it flagging the bad case once per enabled rule and passing the good one (activity-test-profiles
DEC-4, DEC-7; design D-9, D-18).

#### Scenario: The docs configuration without a fixture
- **WHEN** `quality/ls-lint/docs.yml` exists and no fixture pair exists for it
- **THEN** `make validate` fails, naming the configuration

#### Scenario: The docs fixture is flagged
- **WHEN** the docs configuration's tool test runs locally with ls-lint installed
- **THEN** the bad fixture, which the stage's catch file ties to the failure the survey cites, is flagged once per enabled rule by that rule's name, and the good fixture is not flagged

### Requirement: A stacks naming configuration
Where the DevOps stage adopted it, `quality/ls-lint/stacks.yml` SHALL hold the ls-lint
configuration for stacks repositories, listed in `quality/README.md`, with a fixture pair and a
tool test of the same kind (activity-test-profiles DEC-4, DEC-7; design D-9, D-18).

#### Scenario: The stacks naming configuration without a fixture
- **WHEN** `quality/ls-lint/stacks.yml` exists and no fixture pair exists for it
- **THEN** `make validate` fails, naming the configuration

### Requirement: A stacks Makefile configuration
Where the DevOps stage adopted it, `quality/checkmake/stacks.ini` SHALL hold the checkmake
configuration for stacks Makefiles, listed in `quality/README.md`, with a fixture pair and a tool
test of the same kind (activity-test-profiles DEC-4, DEC-7; design D-9, D-18).

#### Scenario: The stacks Makefile configuration without a fixture
- **WHEN** `quality/checkmake/stacks.ini` exists and no fixture pair exists for it
- **THEN** `make validate` fails, naming the configuration
