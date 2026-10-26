## ADDED Requirements

### Requirement: Generated artefacts are not committed unless a CLI's installer requires it
Rendered artefacts SHALL NOT be committed unless the CLI or installer that consumes them reads them from the repository itself. Only three renderings SHALL be committed — `.claude-plugin/marketplace.json` and the `bundles/` symlink tree (read by Claude Code's marketplace clone) and `tools/opencode-catalogue.json` (bundle membership and parsed agent frontmatter, read by the opencode installer) — and opencode agent files, parity reports and gap reports SHALL be produced at install time or on demand.

#### Scenario: opencode output is absent from git
- **WHEN** the repository is inspected
- **THEN** no `.opencode/` directory, `opencode.json` version carrier, `PARITY.md` or `GAP.md` is tracked, and `.opencode/` is listed in `.gitignore`

#### Scenario: Claude renderings are committed
- **WHEN** the repository is inspected
- **THEN** `.claude-plugin/marketplace.json`, `bundles/` and `tools/opencode-catalogue.json` are tracked and equal a fresh render of `bundles.yaml`, `agents/` and `VERSION`

## MODIFIED Requirements

### Requirement: Generation traces to a single source
Every rendered artefact — the Claude `marketplace.json`, the `bundles/` symlink tree, `tools/opencode-catalogue.json`, and the opencode agent files written at install — SHALL derive solely from `skills/`, `agents/`, `bundles.yaml`, and `VERSION`, and no renderer SHALL read or depend on hand-authored content in a rendered artefact.

#### Scenario: Every emitted artifact has a source
- **WHEN** a renderer emits an artefact
- **THEN** it corresponds to exactly one first-party source or to `bundles.yaml`, and no emitted artefact lacks a source

#### Scenario: Hand-edits are overwritten
- **WHEN** a maintainer hand-edits `marketplace.json` or `tools/opencode-catalogue.json`, or adds a file under `bundles/`
- **THEN** the next `make bundles` run overwrites or removes it, and until then `make validate` fails

### Requirement: Full-parity coverage with explicit gaps
For every first-party skill and agent, the opencode installer SHALL install a native opencode equivalent, or report a `Gap(source, cli, reason)`. It SHALL NOT silently drop any source artifact.

#### Scenario: Native equivalent emitted
- **WHEN** a source artifact has a clean opencode equivalent
- **THEN** the installer writes the native construct (a copied skill directory or a rendered agent file)

#### Scenario: Gap recorded
- **WHEN** a source artifact has no clean opencode equivalent
- **THEN** the installer writes the closest construct AND prints a gap naming the artifact and reason

#### Scenario: Coverage complete
- **WHEN** the on-demand report runs
- **THEN** every source skill and agent is listed as mapped or gapped, none unaccounted for

### Requirement: Agent frontmatter mapping
The opencode agent renderer SHALL map Claude agent frontmatter to opencode via recorded mappings: model alias to opencode `provider/model-id`, Claude tool names and `disallowedTools` to opencode tool/permission settings, and invocation to the opencode invocation name. A field with no opencode analogue SHALL produce a recorded gap. The mapping tables SHALL exist in exactly one place, `tools/opencode-agent-map.json`, read by the installer library to render and by the validator to check aliases.

#### Scenario: Model alias resolved
- **WHEN** an agent declares a model alias (e.g. `opus`)
- **THEN** the opencode agent declares the corresponding pinned `provider/model-id`

#### Scenario: Unknown alias fails loudly
- **WHEN** an agent declares a model alias absent from the mapping table
- **THEN** `make bundles` and `make validate` fail and name the agent and the alias, so the agent never reaches an installer

#### Scenario: Tool restriction preserved or gapped
- **WHEN** an agent restricts tools via `tools`/`disallowedTools`
- **THEN** the opencode permissions grant/deny the equivalent, or a gap is recorded where no analogue exists

### Requirement: Bundle grouping preserved
Both CLIs SHALL reproduce every bundle in `bundles.yaml` (the four role bundles, the `vault-assistant` workflow bundle, and any bundle added later) with exactly its listed skills and agents.

#### Scenario: Bundle membership matches
- **WHEN** a skill or agent is listed under a bundle in `bundles.yaml`
- **THEN** it is in that bundle's `bundles/<bundle>/` tree and in that bundle's opencode install, and in no other bundle's

#### Scenario: The workflow bundle is rendered
- **WHEN** `make bundles` runs with the `vault-assistant` entry present
- **THEN** `marketplace.json` lists `vault-assistant` with `source: "./bundles/vault-assistant"` and `bundles/vault-assistant/skills/` links exactly its skills

### Requirement: Version written from VERSION
The bundle renderer SHALL write the root `VERSION` value into `marketplace.json` `metadata.version`, `tools/opencode-catalogue.json` `version` and `package.json` `version`.

#### Scenario: Versions derive from VERSION
- **WHEN** `make bundles` runs
- **THEN** `marketplace.json` `metadata.version`, `tools/opencode-catalogue.json` `version` and `package.json` `version` all equal `VERSION`

### Requirement: Pinned opencode version
The opencode agent renderer SHALL target a single opencode version recorded in `.opencode-version` and conform to that version's agent format.

#### Scenario: Pinned version recorded
- **WHEN** the renderer's output format is reviewed or changed
- **THEN** the targeted opencode version is the one in `.opencode-version`, not "latest available"

### Requirement: Deterministic output and drift gate
Rendering from unchanged sources SHALL produce byte-identical committed output, and `make validate` SHALL fail when `marketplace.json`, `tools/opencode-catalogue.json` or the `bundles/` tree differs from a fresh render.

#### Scenario: Re-run is a no-op
- **WHEN** `make bundles` runs twice with no source changes between runs
- **THEN** the second run produces no diff

#### Scenario: Drifted rendering fails validation
- **WHEN** `bundles.yaml` or an agent's frontmatter changes but `make bundles` is not run, or a `bundles/` entry is missing, retargeted, orphaned, or a real copy instead of a symlink
- **THEN** `make validate` fails and names each drifted artefact

### Requirement: Parity and version-sync gates
CI SHALL fail when any first-party agent cannot be rendered for opencode, and `make validate` SHALL fail when `marketplace.json`, `tools/opencode-catalogue.json` or `package.json` declares a version differing from `VERSION`. Parity and gap reports SHALL be produced on demand and SHALL NOT be committed.

#### Scenario: Unrenderable agent fails parity
- **WHEN** a first-party agent cannot be rendered for opencode (e.g. an unknown model alias)
- **THEN** the CI installer test job fails and names the agent

#### Scenario: Version mismatch fails
- **WHEN** `marketplace.json`, `tools/opencode-catalogue.json` or `package.json` declares a version differing from `VERSION`
- **THEN** `make validate` fails and names the file

#### Scenario: Reports on demand
- **WHEN** a maintainer runs `make opencode-report`
- **THEN** the parity and gap tables are printed to stdout and no file is written

### Requirement: Generator and gates are make targets
The bundle renderer SHALL run through `make bundles`, the parity/gap report through `make opencode-report`, and the render-match and version-sync checks SHALL run as part of `make validate`.

#### Scenario: Regeneration via make
- **WHEN** a maintainer runs `make bundles`
- **THEN** `marketplace.json`, `tools/opencode-catalogue.json` and the `bundles/` tree are updated to match `bundles.yaml`, `agents/` and `VERSION`
