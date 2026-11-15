# Reading: working-effectively-with-legacy-code
Fork `meaningfy-ws/agent-rules-books` at `893a88a6fce3a80c565bf39ac65021b43a8b2990`, read in full on 2026-11-15 by reader A.

| File | Bytes | What it adds |
|---|---|---|
| `SKILL.md` | 803 | Frontmatter and a short entry that sends the agent to the mini set, with the full text as the deeper reference. |
| `working-effectively-with-legacy-code.md` | 13,817 | The full rule set: code without trusted tests counts as legacy, the change loop (change point, test point, seam, dependency break, change, refactor), characterisation tests, seam kinds, dependency types and the book's dependency-breaking techniques, sprout and wrap moves, risky-area recipes and forbidden patterns. |
| `working-effectively-with-legacy-code.mini.md` | 5,707 | The working version: fifteen decision rules, eight triggers and a nine-question final check, including the duty to clean up temporary seams. |
| `working-effectively-with-legacy-code.nano.md` | 1,792 | A compact reminder: gain control first, characterise, narrowest seam, one kind of change at a time. |

Total read: 22,119 bytes.

## Goals it serves
Changing code that is risky to touch because its behaviour is unclear or its tests are weak:
capturing what it does today, finding a place to test it, breaking the one dependency that blocks a
test, then making the requested change. It fits bug fixes and features in inherited or untested
code, and reviews of such changes. Do not use it for green-field code that is written test-first
under `cosmic-python`, or as permission for a rewrite; for ordinary cleanup of tested code,
`refactoring` is the closer fit.

## Conflicts with Meaningfy rules
| # | Their advice (file, heading, line) | The Meaningfy rule it meets (owner skill) | Named in DEC-7, DEC-19 or DEC-20? |
|---|---|---|---|

No real conflict found. Checked and not counted: subclass-and-override, link and preprocessing seams
and sensing variables (`working-effectively-with-legacy-code.md`, "Dependency-Breaking Technique
Index", lines 210-224, and "Characterization Tests", line 87) are allowed only as temporary moves with
a cleanup duty (`.mini.md`, "Trigger rules", line 36), which does not contradict the fake-over-mock
rule of `cosmic-python` `references/testing-checklist.md`, items 4 and 5. Characterisation before
change agrees with tests first. "Primitivize Parameter" (line 219) is limited to test harness cost
and does not override `cosmic-python:PR-MODELS-OVER-DICTS`. The full text calls itself a binding
policy (line 16); DEC-7 answers that.

## Trigger overlap
`cosmic-python` (testing strategy, refactoring paths for architecture drift);
`superpowers:systematic-debugging` (a bug in unclear code); `superpowers:test-driven-development`;
`test-strategy` (which check answers which question); `meaningfy-code-review` (its review list of
legacy-change risks); the `implementer` agent.

## Fallback sentence (draft)
If `working-effectively-with-legacy-code` is not installed, offer `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/agent-rules-books#893a88a6fce3a80c565bf39ac65021b43a8b2990 --skill working-effectively-with-legacy-code --agent claude-code --global --yes` (the opencode command is in `assets/install.md`); if the person declines, carry on with `cosmic-python` and `superpowers:test-driven-development` and say once that the legacy-code guidance was not used.
