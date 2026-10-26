# Docs sync — single-source-distribution + agent-authoring-standard

Documenter pass, 2026-10-26, against the working tree (code and tests as ground truth). Most docs
were already updated by the two implementations; this pass fixes what was still stale. Not edited:
`openspec/specs/` (synced at archive), `openspec/changes/archive/`, any `inputs/`.

| File | Change and why |
|---|---|
| `README.md` | External-deps pointer now links `setup.md` §2 (the old "Installation §2" section no longer exists); repo-structure line names the bundle renderer and opencode installer in `tools/`. |
| `AGENTS.md` | "How to validate" also names the `validate-spine` CI job (`.github/workflows/validate.yml` runs three jobs). |
| `CONTRIBUTING.md` | Step 3 adds `make skill-inventory` + the `PURPOSE_OF` entry (the files its `git add` already lists); commit example made a Conventional Commit. |
| `CHANGELOG.md` (3.0.0) | opencode action notes the installer stops on an unmanaged same-name agent file (`refuseUnmanaged`, `--force`); "Changed" says agents render only with `--global`/`--project` and that rerunning install prunes what no installed bundle carries (post-review fix 3). |
| `spec/CREATING_SKILLS.md` | Skills are flat under `skills/`, not phase subfolders; "Grouping Skills" points to role bundles and `spec/agent-template.md` for agents. |
| `spec/skill-repo-governance.md` | Validation list names `bundle_gates` and `agent_conformance`. |
| `docs/environment/setup.md` | User/project table: the repo binding is `AGENTS.md` with a `CLAUDE.md` pointer; drops "generated in parity". |
| `docs/environment/dual-cli/setup-opencode.md` | `--target` gap line quoted as the code prints it, and only when the bundles have agents; rerunning install prunes stale managed skills/agents. |
| `docs/environment/dual-cli/mapping.md` | The deleted `dual-cli-generator` is replaced by `make bundles` (`tools/bundle_gen`) and the opencode installer. |
| `docs/environment/dual-cli/body-agnosticism-audit.md` | "the generator's job" → `make bundles` and the opencode installer. |
| `docs/environment/dual-cli/compatibility.md` | First-party artifacts "ship from one source", no longer "are generated". |
| `skills/project-setup/SKILL.md`, `references/agentic-setup.md`, `references/checklists.md`, `scripts/scaffold.sh` | `/plugin install meaningfy-core meaningfy-building` (invalid) → one `<bundle>@meaningfy-skillery` per line. |
| `skills/spec-stewardship/SKILL.md` | "the implementer skill" → "the implementer agent". |

`docs/development-method.md` (human WIP): checked; no line changed (commands, paths and the §9
anchors are current). `docs/skill-inventory.md`: `make skill-inventory` produced no further change.

Checks: `make validate` green (lint OK, 137 passed); `node --test tests/*.test.mjs` 25/25;
`make bundles` leaves the rendered files byte-identical.
