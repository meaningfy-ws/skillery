# Size of `skills/` after stage 5 (task 5.2, DEC-9)

Measured on `feature/lean-skills-stage-5` (stages 2 to 5 merged), 2026-11-16, with the measure of
[`inputs/findings-size-2026-11-14.md`](../inputs/findings-size-2026-11-14.md): every `SKILL.md`
plus every Markdown file under a `references/` folder, fenced code included, in bytes.

| | `SKILL.md` | `references/*.md` | Total | MiB |
|---|---:|---:|---:|---:|
| `develop` `d64b28b` (the EPIC's baseline) | | | 1,366,227 | 1.30 |
| After stage 5 (52 skills) | 391,286 | 542,161 | 933,447 | 0.89 |

The target of DEC-9 is at most 1 MB (1,048,576 bytes): met, with 115 KB to spare. The same script
over the baseline commit gives 1.30 MiB where the findings note gave 1.45 MB; the note also counted
reference files that are not Markdown (two `.adoc` templates, since moved to `assets/`) and used
decimal megabytes.

`skill-budget.yaml` has no `pending` key any more. Five skills keep a recorded `over_budget`
reason: `epic-delivery`, `infrastructure-operations`, `sales-pipeline-custody`,
`semantic-consulting-coach`, `test-strategy` (design D-22, D-23, D-24).
