# Docs findings from `fix-accumulated-skill-defects`

Hand-off from the documentation crystallisation pass (design G, task 7.7) of the change
`fix-accumulated-skill-defects`. This change claims nothing below and did not edit these files;
they are claimed here. Full audit: `../../fix-accumulated-skill-defects/inputs/docs-redundancy-map.md`.

## 2026-10-26

| File | Finding | Owner of the fact | Suggested action |
|---|---|---|---|
| `AGENTS.md` | The "Skills and agents development method" section says it "does not restate" the method, then restates the change path (EPIC vs direct PR, verbatim from `docs/development-method.md` §3) and condensed rules from §2, §7 and §9. | `docs/development-method.md` | Keep one-line mandates, each linking to its section; drop the restated wording. |
| `AGENTS.md`, `README.md`, `docs/environment/setup.md` | "AGENTS.md is canonical; CLAUDE.md is a thin pointer; no symlink" is stated in AGENTS.md ("Dual-CLI distribution"), README "What this is", setup.md §3 blockquote and §4. | `openspec/specs/dual-cli-distribution` (+ `AGENTS.md`) | State it once, link from the others. `README.md` is also claimed by define-blc-engagement-model, define-lifecycle-playbooks, define-meaningfy-lifecycle and define-roles-and-raci. |
| `docs/environment/setup.md` §4 | Says `project-setup` projects "AGENTS.md canonical + the thin CLAUDE.md pointer, no symlink"; the `project-setup` skill says "CLAUDE.md is canonical; AGENTS.md is an optional symlink". A contradiction, not just a copy. | `project-setup` skill | Reconcile, then let setup.md link to the skill. |
| `docs/environment/setup.md` §3 | Owner of the user-level vs project-level split. `docs/engineering-standards/coding-prompt.md` (DEC-12) now links to `#3-user-level-vs-project-level`. | `setup.md` §3 | Keep the heading (or update that link if it changes). |
