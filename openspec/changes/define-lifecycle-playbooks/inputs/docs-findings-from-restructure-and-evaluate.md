# Docs findings from `restructure-and-evaluate-catalogue`

Hand-off from the docs and structure re-check (design D-10, task 2.5) of the change
`restructure-and-evaluate-catalogue`. That change did not edit these files, because this change
owns the playbooks. Full evidence:
`../../restructure-and-evaluate-catalogue/inputs/evidence/docs.md`.

## 2026-10-27

| File | Finding | Owner of the fact | Suggested action |
|---|---|---|---|
| `docs/ai-coding/playbooks/work-shaper.md`, `solution-builder.md` | Four links point to `build-lifecycle.md#epic-tier-one-epic-at-a-time--the-sdlc-loop`. The heading's anchor is now `#epic-tier-one-epic-at-a-time-the-sdlc-loop` (one hyphen), so they land at the top of the page. | `docs/ai-coding/build-lifecycle.md` | Retarget them. |
| `docs/ai-consulting/playbooks/technical-consultant.md` | "Your done" restates the five parts of the Decision Package. | `decision-package` skill | Link to it instead (the same finding is handed to `define-ai-domains` for the runbooks). |
