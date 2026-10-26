# What skillery requires of a new plugin (seed input, 2026-09-14)

Read from this repo on 2026-09-14 (skillery 2.9.0). Re-check each item before relying on it.

## A new bundle is a code change, not just a manifest entry

| Constraint | Where | Consequence |
| --- | --- | --- |
| Bundle names are pinned | `tools/repo_lint/lint.py:31` `EXPECTED_BUNDLE_NAMES` (the four role bundles) | `meaningfy-assistant` fails `make validate` until it is added there |
| "Every skill belongs to exactly one of the four bundles" | `CONTRIBUTING.md` Step 3, `AGENTS.md`, the README "What's inside" table | the docs name four bundles; all must be updated to five |
| Bundle membership | `.claude-plugin/marketplace.json` (single source) | add the plugin entry with its `skills` list (flat `./skills/<name>` paths) |
| Version | root `VERSION` flows into `marketplace.json`, `opencode.json` and the bundle manifest | a new plugin is a minor bump; the version-sync gate fails on a mismatch |

The four existing bundles are **roles** (core, consulting, architecture, building). The assistant
is not a role but a personal workflow. The EPIC should decide, as a `DEC-`, whether a fifth,
non-role bundle is acceptable or whether the skills join an existing bundle. The upstream changes
assume a separate plugin named `meaningfy-assistant`, so that people who don't keep a vault don't
get its skills.

## Per-skill obligations

- `spec/CREATING_SKILLS.md` and `CONTRIBUTING.md`:
  - `name` equals the directory;
  - the description is how the skill is discovered;
  - at most about 500 lines, with detail in `references/<domain-meaningful-name>.md`;
  - a `## Boundary & Related Skills` section (Owns / Delegates / Related; CI-blocking);
  - Apache 2.0.
- `tools/skill_inventory.py`: a `PURPOSE_OF` entry per new skill, then `make skill-inventory` to
  regenerate `docs/skill-inventory.md` (drift fails `make test`).
- `tests/trigger_probes.yaml`: at least one probe per skill (coverage is checked). The vault skills
  sit near `epic-planning` ("create a project" could mean an EPIC), so write noun-anchored
  descriptions and probes that separate them.
- `tests/ownership.yaml`: register any capability a new skill owns (for example the note
  conventions), so no other skill re-specifies it.

## Both CLIs

- Author the Claude source only; run `make generate-opencode` and commit `.opencode/`. Never
  hand-edit `.opencode/`.
- **Skill bodies must be CLI-agnostic** (`AGENTS.md`, "Dual-CLI authoring rules"). The upstream
  requirements name Claude Code specifics that a body can't contain as written:
  - the vault's `.claude/settings.json` deny list;
  - `CLAUDE.md` containing `@AGENTS.md`;
  - nested `CLAUDE.md` files as folder context.

  Phrase them neutrally ("the vault's tool-permission settings", "the vault's agent instructions"),
  or record each as a gap in `docs/dual-cli/body-agnosticism-audit.md`. How opencode denies tools
  in a vault (its `opencode.json` permissions) is an open question for the EPIC.
- **External plugin:** the vault relies on `obsidian@obsidian-skills` (MIT, from
  `github.com/kepano/obsidian-skills`) for Obsidian's own syntax. Per the governance spec, external
  skills are referenced, not vendored: add a row to `docs/dual-cli/compatibility.md` (how it loads
  on opencode is **UNVERIFIED**), and name it as a mandatory dependency of the plugin.

## Guardrail

`make validate` must pass, including the drift, parity, version-sync and body-agnosticism gates.
