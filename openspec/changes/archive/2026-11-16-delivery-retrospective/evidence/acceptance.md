# Acceptance: delivery-retrospective

**Verdict: demo skipped**, by the developer, Eugeniu Costetchi, on 2026-11-16: "go ahead with
task 3.4, and skip the demo, just go ahead". MEDIUM appetite: the demo is offered and the developer
may skip it. The success measure is shown by evidence in this folder:

| Success measure (proposal, *It succeeds when*) | Evidence |
|---|---|
| The scripts' tests pass in `make validate` on synthetic transcripts | `tests/test_session_retrospective.py`, green in every stage's gates and CI |
| A session with marks is reported by phase and stage with no `guessed` row; one without is labelled and its guessed share printed | walk runs 3–5 in [`walk-3.4.md`](walk-3.4.md), read by the report |
| One 14-day run is no slower than the old scripts, with equal totals, recorded without transcript text (D-27) | [`real-run.md`](real-run.md): 262 s against 268 s, all totals equal |
| The agent scenario for the mark is walked | [`walk-3.4.md`](walk-3.4.md): failed on 3.16.0, fixed (D-29), the lead's run 5 passes S1–S4; signed off by the developer |
| The navigator warns when a stage's first worker starts without a mark | `mods/navigator/lib/mark.test.ts`; not seen live, the band does not show headless |

