# Agentic setup

**D8.** `AGENTS.md` is the one source, CLI-agnostic; opencode reads it natively. `CLAUDE.md` says
"read `AGENTS.md`", imports it with a line `@AGENTS.md` and adds only Claude Code guidance. Both are
regular, committed files: never a symlink either way (it breaks silently where links cannot be
made), never two copies synced by a hook (they drift). Edit only `AGENTS.md`. The scaffolder reports
an existing symlink for reconciliation instead of replacing it.

**Global vs repo (DEC-12).** The global instructions (`~/.claude/CLAUDE.md`,
`~/.config/opencode/AGENTS.md`) carry the company standard. The repo `AGENTS.md` routes to it, to
the skills and to the spine, and records only repo facts (packages, datastores, archetype, our
libraries); it never restates the standard.

A repository can keep rules for agents of its own, in `docs/rules/`; the folder and the pointer
line it adds to `AGENTS.md` are owned by `rulebook` (`skills/rulebook/references/rule-model.md`,
Repository store). The repository opts in by approving its first rule; do not write the pointer by
hand.

**`.claude/` (D9)** holds optional thin `agents/`, project-specific `skills/` only (never a copied
skillery), and `memory/MEMORY.md`: ≤ 200 lines of stable patterns, key paths and spine pointers, no
session notes or epic detail. If it disagrees with `openspec/specs/`, the specs win; the
orientation index of record is `openspec/config.yaml`'s `context:`. Never reintroduce
`.claude/memory/epics/`: EPIC, PLAN and tasks live in `openspec/changes/`.
