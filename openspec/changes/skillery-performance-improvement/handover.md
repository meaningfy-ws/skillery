# Hand-over: skillery-performance-improvement, after stage 1

<!-- Five headings, nothing else. Point, never copy: decisions stay in design.md.
     Saved as openspec/changes/<change-id>/handover.md, the last commit of the stage's PR. -->

## Done
Stage 1 (measure and clean), PR #328 (merged by the watch-and-merge command after this note).
Tasks 1.1, 1.2, 1.3, 1.5, 1.6 done; 1.4 half done (D-23). Baseline page:
`docs/practice/ai-coding/usage-reports/2026-11-22.md`; procedure:
`skills/session-retrospective/references/langfuse-report.md`.

## Decided since the PLAN
D-19 to D-25 (design.md, Delivery decisions).

## Open
- The owner's approval of the inventory's disable list (D-22); nothing is disabled.
- The second machine's inventory and its `CC_LANGFUSE_TRACE_TAGS` tag (D-20).
- The rule approval card shown at the end of the planning session (three rows) is unanswered.
- Under-the-floor findings D-25 are candidates for the docs stage.
- The governance change on dual-CLI parity (DEC-10) is outside this EPIC.

## Next
Stage 2 (end sessions), task 2.1. **First, in this fresh session, finish task 1.4 (D-23):** run
`/context` here, then spawn one `implementer` and one `code-reviewer` with a one-line brief that
asks each to report its `/context` composition, and record the three compositions and the share
each piece takes in `usage-reports/2026-11-22.md` §Floors; stage 4 depends on it. Then read:
tasks.md §2, design.md D-1, D-5, D-6, D-8, D-17, D-19; specs/subagent-dispatch, specs/epic-shape,
specs/epic-delivery, specs/session-navigation (the deltas); `mods/navigator/lib/hygiene.ts`,
`state.ts`, `io.ts`, `lean.ts` and `skills/guardrails/assets/session-thresholds.json`.

## Prompt
Act as the team lead. Deliver stage 2 of openspec/changes/skillery-performance-improvement from
handover.md; start with the owed half of task 1.4 as the note says.
