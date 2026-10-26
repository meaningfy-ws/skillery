# Docs findings from `restructure-and-evaluate-catalogue`

Hand-off from the docs and structure re-check (design D-10, task 2.5) of the change
`restructure-and-evaluate-catalogue`. That change did not edit these files, because this change's
`tasks.md` lists them. Full evidence:
`../../restructure-and-evaluate-catalogue/inputs/evidence/docs.md`.

## 2026-10-27

| File | Finding | Owner of the fact | Suggested action |
|---|---|---|---|
| `docs/ai-coding/build-lifecycle.md` §6, §9 | The model-tier table and the roster ("Opus", "Sonnet") restate each agent's `model:` frontmatter. | `agents/*.md` | Name the agents and link to them; keep tiering as a principle, without the values. |
| `docs/ai-coding/build-lifecycle.md` §7 | The ownership table claims to narrate `tests/ownership.yaml`, but has about twice its rows. That leaves two lists to keep in step. | `tests/ownership.yaml` | Either the yaml grows to match, or the table only links to it. |
| `docs/ai-coding/build-lifecycle.md`, `opsx-runbook.md` | The audience lines say "with Claude Code", and the runbook says "Run `/context`". The docs serve both CLIs. | `docs/environment/dual-cli/` | Use neutral wording. |
| `docs/ai-coding/build-lifecycle.md`, `opsx-runbook.md` | `#verb-roster` depends on the kramdown id `{#verb-roster}` in `spine/workflows.md`. GitHub does not render that id, so the link opens at the top of the file. | `spine/workflows.md` | Link the GitHub slug, or fix the heading in spine. |
| `docs/ai-coding/opsx-runbook.md` | Stale: "(v2)" in the title, and the closing note about "an earlier five-agent framing". | — | Remove them. |
