## ADDED Requirements

### Requirement: A Claude-only artifact type is a recorded gap
Mods SHALL ship to Claude Code only (CLI and desktop app); the opencode installer SHALL NOT offer a
bundle that holds only mods, and `docs/environment/dual-cli/compatibility.md` SHALL record the
navigator mod as a deliberate Claude-only gap (DEC-4). Reusing the status line on opencode is
allowed, not required.

#### Scenario: The opencode catalogue
- **WHEN** `make bundles` renders `tools/opencode-catalogue.json`
- **THEN** `meaningfy-navigator` is not in it, and the compatibility page names the gap

#### Scenario: The Claude bundle
- **WHEN** `make bundles` renders `bundles/meaningfy-navigator/`
- **THEN** it holds a byte-checked copy of `mods/navigator` (DD-31), the data links the mod reads, and a `plugin.json` naming the mod's hooks file, types file and settings

## MODIFIED Requirements

### Requirement: Hook intent inventory and per-CLI adoption
The repository SHALL contain a committed `docs/development/` inventory as the single source of hook intent, with both a machine-readable form and a human-readable table visible in the repo structure. Each entry SHALL record intent, trigger, mechanism, phase, per-CLI binding, and provenance, and a single intent MAY carry several bindings. Provenance SHALL be either a source skill or an imperative rule in a binding (a MUST/NEVER rule in `CLAUDE.md`/`AGENTS.md`) — imperative binding rules are inventory provenance, not only skills. Each binding SHALL be classified on two axes — **mechanism**: `git` (CLI-agnostic, single shared implementation), `ci` (shared PR/Actions check), `agent` (same intent rendered into each CLI's native binding), or `mod` (a rule enforced by a Claude Code mod in strict mode; Claude Code only, opencode a recorded gap, DEC-5); and **phase**: `quality` (commit/push-time) or `phase-gate` (workflow-transition-time). Every `mod` binding SHALL match one rule id in the mod's strict rules, and every such rule id SHALL have a `mod` binding. Setup SHALL be able to project the inventory into a repository — the shared git-hook config once, and the agent-hook bindings for each targeted CLI.

#### Scenario: Inventory is the single source of hook intent
- **WHEN** a hook intent exists
- **THEN** it appears once in the committed `docs/development/` inventory with its mechanism, phase, and provenance, and the human-readable table is visible in the repo structure

#### Scenario: git hooks share one implementation
- **WHEN** a hook is classified as git-mechanism
- **THEN** a single shared implementation serves both CLIs and is not duplicated per CLI

#### Scenario: agent hooks share intent, not binding
- **WHEN** a hook is classified as agent-mechanism
- **THEN** the same intent is rendered into each targeted CLI's native binding, and the two bindings are not required to be byte-identical

#### Scenario: Setup projects hooks per CLI
- **WHEN** setup projects the inventory into a repository targeting one or more CLIs
- **THEN** the shared git-hook configuration is written once and the agent-hook bindings are written for each targeted CLI

#### Scenario: A mod binding without its rule
- **WHEN** `hooks.yaml` has a `mod` binding whose id no strict rule of the mod carries, or the mod has a strict rule with no `mod` binding
- **THEN** `make validate` fails, naming the id
