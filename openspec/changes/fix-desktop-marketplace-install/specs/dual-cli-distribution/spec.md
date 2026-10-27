## MODIFIED Requirements

### Requirement: Skills and agents are installed from their single source
Skills SHALL be installed on both CLIs from `skills/` and agents from `agents/`; the repository SHALL NOT contain a hand-maintained per-CLI copy of any skill or agent file. Claude Code bundles SHALL reach their skills and agents through generated relative symlinks under `bundles/<bundle>/` into `skills/` and `agents/`, and each bundle SHALL carry a generated `bundles/<bundle>/.claude-plugin/plugin.json` (name, version, description, author) — claude.ai's marketplace sync, used by Claude Desktop, needs it (fix-desktop-marketplace-install DEC-6, variant C). `make bundles` writes them, the repository commits them on every branch, and nobody edits them by hand; `make validate` SHALL fail when a link is missing, is a copy, or points elsewhere, or when a `plugin.json` differs from its rendering. The opencode installer SHALL copy skills from `skills/` and render agents at install time from the agent bodies in `agents/` and the parsed frontmatter in the generated `tools/opencode-catalogue.json`.

#### Scenario: No hand-maintained copy exists
- **WHEN** the `develop` branch is inspected
- **THEN** no `.opencode/` tree is tracked, every skill or agent entry under `bundles/` is a relative symlink to its `skills/` or `agents/` source, and `tools/opencode-catalogue.json` holds no skill or agent body

#### Scenario: Symlinks live only under bundles/
- **WHEN** any branch is inspected
- **THEN** every tracked symlink is under `bundles/`

#### Scenario: Every bundle carries its plugin manifest
- **WHEN** `make bundles` has run
- **THEN** each bundle in `bundles.yaml` has `bundles/<bundle>/.claude-plugin/plugin.json` whose `name` and `description` match the bundle and whose `version` equals `VERSION`

#### Scenario: A bundle change needs regeneration
- **WHEN** a contributor changes a bundle's description or membership in `bundles.yaml` without running `make bundles`
- **THEN** `make validate` fails naming the stale `plugin.json` or link, and passes after `make bundles`
