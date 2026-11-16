# Agent scenarios run by hand (DEC-14, check 1)

## Claude Code, 2026-11-15, this checkout's agents

Setup: Claude Code 2.1.325, headless (`claude -p`), the `meaningfy-building` bundle loaded with
`--plugin-dir` from a dereferenced copy (`cp -rL bundles/meaningfy-building`; the symlinked agent
files of `bundles/` load no agents that way, D-33), a scratch Python repository (`pyproject.toml`,
`calc/__init__.py`, one test). The implementer was briefed "add `sub(a, b)`, test-first"; the
reviewer "review HEAD~1..HEAD through lens L1, appetite TINY", with no result-line format in the
brief.

| Scenario (feature) | First run | After the D-34 fix |
|---|---|---|
| The lead checks impact once per task, before the brief (`implementer.feature`) | pass: no gitnexus call by the implementer; the lead ran impact before each stage-3 brief (LOW) | — |
| The report carries no impact summary (`implementer.feature`) | pass: "Impact summary: none; impact is the lead's, per task" | pass |
| It loads cosmic-python in a Python repository (`implementer.feature`) | **fail**: no Skill call at all | pass: a Skill call before the edit; the report weighs cosmic-python layering ("flat module, not applicable"). The harness does not name the skill loaded |
| The review ends with the result line (`code-reviewer.feature`) | **fail**: ended "Result: L1 PASS. 0 Critical…" | pass: `result: stage=- role=reviewer lens=L1 findings=1 accepted=-` |

Side observation: with pytest refused by the headless permissions, the implementer stopped after
the test and wrote no production code, rather than skip the red step (TDD held).

## Scenarios of stage 1 and of D-23, D-24, D-32

The team-lead, epic-planner and epic-delivery scenarios were exercised by the stage-2 and stage-3
sessions themselves (one EPIC per session, the note before the merge, watch-and-merge, the floor
and one fix pass, the result lines, the checker before the note): see PRs #251 and #258 and the
cold-start record. D-23, D-24 and D-32 now have spec scenarios (`specs/epic-delivery`,
`specs/catalogue-governance`); D-32 has no agent scenario because no agent runs it (it binds a
session without a lead, through `AGENTS.md`).

## opencode

Not run. Reason: opencode renders the agents at install time; a hand run needs an install of this
checkout into a scratch opencode configuration. Waived by the owner at the acceptance demo
(2026-11-16, `acceptance.md`).
