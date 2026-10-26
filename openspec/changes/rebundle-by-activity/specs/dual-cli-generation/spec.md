## MODIFIED Requirements

### Requirement: Deterministic output and drift gate
Rendering from unchanged sources SHALL produce byte-identical output, and `make validate` SHALL fail when `marketplace.json` or `tools/opencode-catalogue.json` differs from a fresh render, or, where a `bundles/` tree exists, when it differs from a fresh render. CI SHALL generate `bundles/` and fail when the generation changes a committed file or leaves a wrong link.

#### Scenario: Re-run is a no-op
- **WHEN** `make bundles` runs twice with no source changes between runs
- **THEN** the second run produces no diff

#### Scenario: Drifted rendering fails validation
- **WHEN** `bundles.yaml` or an agent's frontmatter changes but `make bundles` is not run, or a `bundles/` entry is missing, retargeted, orphaned, or a real copy instead of a symlink
- **THEN** `make validate` fails and names each drifted artefact

#### Scenario: A fresh checkout has no bundles tree
- **WHEN** `make validate` runs where no `bundles/` tree exists
- **THEN** the link check is skipped and the committed renderings are still checked

### Requirement: Generated artefacts are not committed unless a CLI's installer requires it
Rendered artefacts SHALL NOT be committed unless the CLI or installer that consumes them reads them from the repository itself. Only two renderings SHALL be committed on `develop` — `.claude-plugin/marketplace.json` (read by Claude Code's marketplace clone) and `tools/opencode-catalogue.json` (bundle membership and parsed agent frontmatter, read by the opencode installer). The `bundles/` symlink tree SHALL be generated, ignored on `develop`, and published on the `dist` branch; opencode agent files, parity reports and gap reports SHALL be produced at install time or on demand.

#### Scenario: opencode output is absent from git
- **WHEN** the repository is inspected
- **THEN** no `.opencode/` directory, `opencode.json` version carrier, `PARITY.md` or `GAP.md` is tracked, and `.opencode/` is listed in `.gitignore`

#### Scenario: Claude renderings are committed, the bundles tree is published
- **WHEN** the `develop` branch is inspected
- **THEN** `.claude-plugin/marketplace.json` and `tools/opencode-catalogue.json` are tracked and equal a fresh render of `bundles.yaml`, `agents/` and `VERSION`, `bundles/` is untracked and listed in `.gitignore`, and the `dist` branch holds the generated `bundles/` tree
