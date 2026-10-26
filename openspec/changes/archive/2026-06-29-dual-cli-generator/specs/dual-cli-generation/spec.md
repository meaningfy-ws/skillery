## ADDED Requirements

### Requirement: Generation traces to a single source
The generator SHALL derive every emitted opencode artifact solely from `skills/`, `agents/`, `.claude-plugin/marketplace.json`, and `VERSION`, and SHALL NOT read or depend on hand-authored content in the generated tree.

#### Scenario: Every emitted artifact has a source
- **WHEN** the generator emits an opencode artifact
- **THEN** it corresponds to exactly one first-party source, and no emitted artifact lacks a source

#### Scenario: Hand-edits are overwritten
- **WHEN** a maintainer hand-edits a generated file with no corresponding source
- **THEN** the next generator run removes or overwrites it

### Requirement: Full-parity coverage with explicit gaps
For every first-party skill, agent, and non-opsx command, the generator SHALL emit a native opencode equivalent, or record a `Gap(source, cli, reason)`. It SHALL NOT silently drop any source artifact.

#### Scenario: Native equivalent emitted
- **WHEN** a source artifact has a clean opencode equivalent
- **THEN** the generator emits the native construct

#### Scenario: Gap recorded
- **WHEN** a source artifact has no clean opencode equivalent
- **THEN** the generator emits the closest construct AND records a gap naming the artifact and reason

#### Scenario: Coverage complete
- **WHEN** the generator finishes
- **THEN** every source skill, agent, and non-opsx command is mapped or gap-recorded, none unaccounted for

### Requirement: Agent frontmatter mapping
The generator SHALL map Claude agent frontmatter to opencode via recorded mappings: model alias to opencode `provider/model-id`, Claude tool names and `disallowedTools` to opencode tool/permission settings, and invocation to the opencode invocation name. A field with no opencode analogue SHALL produce a recorded gap.

#### Scenario: Model alias resolved
- **WHEN** an agent declares a model alias (e.g. `opus`)
- **THEN** the opencode agent declares the corresponding pinned `provider/model-id`

#### Scenario: Unknown alias fails loudly
- **WHEN** an agent declares a model alias absent from the mapping table
- **THEN** the generator fails and names the unknown alias

#### Scenario: Tool restriction preserved or gapped
- **WHEN** an agent restricts tools via `tools`/`disallowedTools`
- **THEN** the opencode permissions grant/deny the equivalent, or a gap is recorded where no analogue exists

### Requirement: Bundle grouping preserved
The generated opencode tree SHALL reproduce the four role bundles with the same membership as `marketplace.json`.

#### Scenario: Bundle membership matches
- **WHEN** a skill or agent is a member of a bundle in `marketplace.json`
- **THEN** it is a member of the corresponding opencode bundle

### Requirement: Version written from VERSION
The generator SHALL write the root `VERSION` value into `marketplace.json` `metadata.version` and the opencode distribution version.

#### Scenario: Versions derive from VERSION
- **WHEN** the generator runs
- **THEN** the Claude and opencode distribution versions both equal `VERSION`

### Requirement: Pinned opencode version
The generator SHALL target a single opencode version recorded in `.opencode-version` and conform to that version's format.

#### Scenario: Pinned version recorded
- **WHEN** the generator runs
- **THEN** the targeted opencode version is read from `.opencode-version`, not "latest available"

### Requirement: Deterministic output and drift gate
Regenerating from unchanged sources SHALL produce byte-identical output, and `make validate` SHALL fail when the committed opencode tree is out of sync with current generator output.

#### Scenario: Re-run is a no-op
- **WHEN** the generator runs twice with no source changes between runs
- **THEN** the second run produces no diff

#### Scenario: Drifted tree fails validation
- **WHEN** a source changes but the tree is not regenerated
- **THEN** `make validate` fails and reports the drifted artifacts

### Requirement: Parity and version-sync gates
`make validate` SHALL fail when any first-party artifact is asymmetric (present on one CLI, neither equivalent nor gap on the other), or when a tree's version differs from `VERSION`. The generator SHALL emit committed parity and gap reports.

#### Scenario: Asymmetric artifact fails parity
- **WHEN** a first-party artifact exists on one CLI but has neither an equivalent nor a recorded gap on the other
- **THEN** `make validate` fails and names the artifact

#### Scenario: Version mismatch fails
- **WHEN** a committed tree declares a version differing from `VERSION`
- **THEN** `make validate` fails and names the tree

#### Scenario: Reports emitted
- **WHEN** the generator runs
- **THEN** committed parity and gap reports are written

### Requirement: Generator and gates are make targets
The generator SHALL run through a dedicated `make` target that regenerates the opencode tree, and the drift, parity, and version-sync checks SHALL run as part of `make validate`.

#### Scenario: Regeneration via make
- **WHEN** a maintainer runs the generate target
- **THEN** the committed opencode tree is updated to match current source
