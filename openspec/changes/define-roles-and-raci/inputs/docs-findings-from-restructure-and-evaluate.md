# Docs findings from `restructure-and-evaluate-catalogue`

Hand-off from the docs and structure re-check (design D-10, task 2.5) of the change
`restructure-and-evaluate-catalogue`. That change did not edit this file, because this change's
`tasks.md` lists it. Full evidence:
`../../restructure-and-evaluate-catalogue/inputs/evidence/docs.md`.

## 2026-10-27

| File | Finding | Owner of the fact | Suggested action |
|---|---|---|---|
| `docs/roles-and-raci.md` *Open question* | Says "a dedicated Claude Code agent". Catalogue agents ship to both CLIs. | `spec/agent-template.md` | Say "a dedicated agent". |
| `docs/roles-and-raci.md` *References* | Four rows link to the `proposal.md` of in-flight changes, which move when those changes are archived. | the synced specs | Retarget the links to the specs once the changes are archived. |
| `docs/roles-and-raci.md` | The deferred `work-shaper` agent is stated twice, in *Open question* and again in the first *Known gaps* row. | this doc (one section) | Keep one, and let the other link to it. |
