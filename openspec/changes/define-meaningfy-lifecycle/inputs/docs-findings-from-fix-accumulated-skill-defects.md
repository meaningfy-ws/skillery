# Docs findings from `fix-accumulated-skill-defects`

Hand-off from the documentation crystallisation pass (design G, task 7.7) of the change
`fix-accumulated-skill-defects`, which did not edit these files: they are claimed here
(`docs/environment-setup.md`, now `docs/environment/setup.md`; `README.md`). Full audit:
`../../fix-accumulated-skill-defects/inputs/docs-redundancy-map.md`.

## 2026-10-26

| File | Finding | Owner of the fact | Suggested action |
|---|---|---|---|
| `docs/environment/setup.md` §4 | Says `project-setup` projects "AGENTS.md canonical + the thin CLAUDE.md pointer, no symlink"; the `project-setup` skill says "CLAUDE.md is canonical; AGENTS.md is an optional symlink". A contradiction, not just a copy. | `project-setup` skill | Reconcile, then let setup.md link to the skill. |
| `docs/environment/setup.md` §3, `README.md` | "AGENTS.md is canonical; CLAUDE.md is a thin pointer" is restated in setup.md §3-§4, README "What this is" and AGENTS.md. | `openspec/specs/dual-cli-distribution` | State it once, link from the others. |
| `docs/environment/setup.md` §3 | Owner of the user-level vs project-level split; `docs/engineering-standards/coding-prompt.md` now links to `#3-user-level-vs-project-level`. | `setup.md` §3 | Keep the heading (or update that link if it changes). |
