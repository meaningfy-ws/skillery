# external-dependency-register Specification

## Purpose
One structured record per external dependency the catalogue relies on (plugin, skill-pack, CLI tool, MCP server, service or framework), validated by lint, from which the dual-CLI compatibility tables and the MCP setup table are rendered.
## Requirements
### Requirement: External dependencies are recorded once, in a structured register

Every external plugin, skill, CLI tool, MCP server, service or framework the catalogue relies on SHALL
have one entry in the root `dependencies.yaml` with its `name`, `kind`, `source`, `pin` (or the reason
it is unpinned), `provenance`, `used_by`, and per-CLI `status` and `install`. Validation SHALL fail for
an unknown key, an unknown `kind` or `status`, or a missing `pin`.

#### Scenario: A dependency without a pin

- **WHEN** an entry has no `pin` and no `unpinned: <reason>`
- **THEN** validation fails, naming the dependency

### Requirement: The compatibility tables are rendered from the register

The dependency tables in `docs/environment/dual-cli/compatibility.md` and `mcp-setup.md` SHALL be
generated from `dependencies.yaml` between generated-section markers, and drift between the register
and the docs SHALL fail validation. The prose around the tables stays hand-written.

#### Scenario: A register edit without regeneration

- **WHEN** a contributor changes a dependency's opencode status and does not run `make skill-inventory`
- **THEN** validation fails and names the regeneration command

