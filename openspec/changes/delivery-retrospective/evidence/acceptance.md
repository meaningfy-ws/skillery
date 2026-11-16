# Acceptance: delivery-retrospective

**Verdict: awaiting the developer.** MEDIUM appetite: the demo is offered and the developer may
skip it. The lead recommends a skip, because the success measure is already shown by evidence in
this folder:

| Success measure (proposal, *It succeeds when*) | Evidence |
|---|---|
| The scripts' tests pass in `make validate` on synthetic transcripts | `tests/test_session_retrospective.py`, green in every stage's gates and CI |
| A session with marks is reported by phase and stage with no `guessed` row; one without is labelled and its guessed share printed | walk runs 3–5 in [`walk-3.4.md`](walk-3.4.md), read by the report |
| One 14-day run is no slower than the old scripts, with equal totals, recorded without transcript text (D-27) | [`real-run.md`](real-run.md): 262 s against 268 s, all totals equal |
| The agent scenario for the mark is walked | [`walk-3.4.md`](walk-3.4.md): failed on 3.16.0, fixed (D-29), the lead's run 5 passes S1–S4; the developer's sign-off is open |
| The navigator warns when a stage's first worker starts without a mark | `mods/navigator/lib/mark.test.ts`; not seen live, the band does not show headless |

Verdict (accepted / skipped / rejected), by ______ on ______, reason: ______.
A rejection becomes a decision in `design.md` and a fix stage.
