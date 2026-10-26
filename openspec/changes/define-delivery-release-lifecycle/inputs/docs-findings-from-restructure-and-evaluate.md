# Docs findings from `restructure-and-evaluate-catalogue`

Hand-off from the docs and structure re-check (design D-10, task 2.5) of the change
`restructure-and-evaluate-catalogue`. That change did not edit this file, because this change's
`tasks.md` lists it. Full evidence:
`../../restructure-and-evaluate-catalogue/inputs/evidence/docs.md`.

## 2026-10-27

| File | Finding | Owner of the fact | Suggested action |
|---|---|---|---|
| `docs/ai-coding/dod-quality-gates.md` | "the two-tier method" in the audience line is a stale term. | — | Remove it. |
| `docs/ai-coding/dod-quality-gates.md` | The coverage gate's owner is given as "CI pipeline", but `engineering-standards/testing-standard.md` says `project-setup` owns it. "≥ 80%" is stated twice here, and again in `testing-standard.md` and `coding-prompt.md`. | `project-setup` | Name `project-setup` as the owner and link to it for the threshold. |
| `docs/ai-coding/dod-quality-gates.md` | The *Architecture check* row restates the layer direction (`entrypoints → services → models`, `adapters → models`). | `cosmic-python` (`tests/ownership.yaml` tag `layer-architecture`) | Link to it instead. |
