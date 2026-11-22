# Docs owed: skillery-performance-improvement

Inventory of the docs stage (`technical-writing`, *inventory* phase), run by the lead on
2026-11-22 after stage 5 merged (PR #332). The EPIC changed user-facing behaviour (hooks, agent
definitions, the review set, the templates), so each stage shipped its documentation inside the
stage PR; this inventory checks that nothing is still owed.

## Search

Pages naming the replaced behaviour were searched for in `docs/`, `README.md` and every
`skills/*/SKILL.md`: `five lenses` (the old default review set), `term-missing` (the old coverage
flag), `no_polling` (the hook the templates do not ship, D-49), `stream-coding` (dropped from
`epic-planner`).

| Term | Hits | Reading |
|---|---|---|
| `five lenses` | `meaningfy-code-review/SKILL.md` (3) | Current: the five single runs are the opt-in deep review, the grouped runs the default |
| `term-missing`, `no_polling` | none | — |
| `stream-coding` | `docs/practice/ai-coding/build-lifecycle.md`, `docs/practice/engineering-standards/references/stream-coding-notes.md` | Current: the external skill, named as external and on demand (DEC-16) |

Shipped by the stages: the CHANGELOG `Unreleased` entries (one per stage, written for the
installer), `docs/development/mods.md` (the `quiet-tools` row), `docs/environment/dual-cli/compatibility.md`
(the `quiet-tools` row), `docs/skill-inventory.md` (regenerated), the fourteen pages aligned in
stage 3 (D-36), `docs/practice/ai-coding/usage-reports/README.md` and the report pages.

## Owed

**No docs owed.** No page is missing, false or stale for the EPIC's changes.

## Follow-ups under the floor (not docs, recorded for the next shaping session)

From `design.md`: D-25, D-30, D-31, D-32, D-37, D-38, D-45, D-46 (accepted findings under the
floor, by stage); D-52 (a shared tokeniser for the three Bash mods; skillery's own `AGENTS.md` gate
table; task 5.6, the scaffold validate probe); the four unused matrix roles that `make lint`
prints as `?` (`attack`, `gate-run-1`, `gate-run-2`, `spec-delta`: roles of the shaping session,
played by the planner, not by an agent file).
