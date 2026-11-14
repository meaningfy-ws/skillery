# Seed — delivery retrospective

**Status:** secondary input, never groomed. Captured 2026-11-14 from the owner's words in one
session. No EPIC is shaped yet.

## What the owner asked

1. Analyse the Claude Code sessions of the last two weeks, in every repository worked on: which
   plans and commands ran and how long each took.
2. Do it epic by epic, for shaping and for implementation: the phases and the work actually done,
   not what the plan said.
3. Say why it took so long and where the inefficiency comes from: the skills, or the repository's
   specs and instructions.
4. Say what would reach the same result with less time and fewer tokens.
5. Keep the script that produces the data, so the same review can be run again later
   ("self-reflection" sessions).
6. Find what must be added to the Langfuse traces so such a review is more precise.

## Decisions the owner made in the session

| # | Question | Answer |
|---|----------|--------|
| 1 | Put repository and branch on every Langfuse observation, or keep them on the turn? | Keep them on the turn; join by trace id. |
| 2 | Cost in Langfuse needs a price per model. | Yes, add them. |
| 3 | Report the plugin's duplicate-turn defect upstream? | No. Make the script aware of the glitches. |
| 4 | Phase, stage and review outcome need the skills to declare them. | Yes, shape a new EPIC. It also carries proper setup instructions and traces every important parameter. |
| 5 | Commit the Langfuse setup doc change? | Yes (PR #232). |
| 6 | `epic-planning` limits the clarity gate to two runs for TINY and SMALL EPICs only; larger ones have no limit. | At most two gate runs hold on any re-gate. The new EPIC extends the limit to all sizes; the skill is not edited before that. Meanwhile the four test EPICs were revised on 2026-11-14 without a new gate run ([`cross-check-test-epics.md`](cross-check-test-epics.md), decision 7). |
| 7 | Restoring a tool list for the two workers reverses lean-delivery DEC-11 and names three products in agent files. | Accepted (PR #234, merged 2026-11-14). |
| 8 | The instructions call Serena and ast-grep mandatory, but they are almost never used and the named Serena tools do not exist. | Fix it by context and activity: the owner wants a recommended set of tools for each activity. |
| 9 | One EPIC in skillery for skills, agents and the project template, and one issue in each other repository for its own instructions? | Agreed. |
| 10 | Model prices in Langfuse (revisits row 2). | Not needed: the owner pays by subscription, not per token. Cost stays a relative measure from the transcripts. |
| 11 | The adversarial tester is conditional at MEDIUM only (`harden-checks-and-tests` D-28). Apply the same condition at every size? | Yes, at every size, in the new EPIC: it changes the living `epic-delivery` spec. |
| 12 | The reader of `generic-task-test-profiles`: a thin agent, or the tool list in the brief only? | A thin agent (its DEC-13). |
| 13 | The result line of `harden-checks-and-tests` D-29, the changed scenarios, and deletion at once in the test sort of `test-suite-care` D-35. | Accepted as written. |
| 14 | One EPIC or several for the three kinds of change (delivery process; tools per activity and the instruction template; the retrospective itself)? | Two EPICs: process and tools together, the retrospective tooling apart. |
| 15 | Which goes first? | Process and tools first. |
| 16 | How does a stage boundary become a real reset, since an unattended lead cannot compact? | The lead writes a hand-over note and stops; the next stage starts in a fresh session. A stage lead per stage was offered and not chosen. |
| 17 | Where do the two scripts live for good? | A new skill with the scripts in its `scripts/` folder. |

## What the owner wants next

Compare these findings with the open test-improvement EPICs, then discuss both together before
anything is shaped. Done on 2026-11-14; see the cross-check and the second pass.

Next: shape the two EPICs, each in its own fresh session. This folder becomes the retrospective
tooling EPIC; the process and tools EPIC gets its own change folder and cites these inputs. The
elicitation still owes, for each: the appetite, the test-scenario interview and the risk question.

Update of 2026-11-15: the process and tools EPIC is shaped as
[`delivery-process-and-tools`](../../delivery-process-and-tools/proposal.md), and it now carries
the result line (its DEC-18). The retrospective tooling EPIC, still to shape here, keeps the skill
for the two scripts and the phase and stage in the traces. It is delivered after that EPIC and
before `test-suite-care` uses the scripts for costs
([`reassessment-2026-11-15.md`](../../delivery-process-and-tools/inputs/reassessment-2026-11-15.md)).

## Inputs in this folder

- [`findings-2026-11-14.md`](findings-2026-11-14.md) — the measurements, the findings and the
  recommendations, written before the test EPICs were read.
- [`second-pass-2026-11-14.md`](second-pass-2026-11-14.md) — what drives the cost, with corrections
  to the first pass and the ranked changes to skills and to repository instructions.
- [`cross-check-test-epics.md`](cross-check-test-epics.md) — the findings against the test EPICs,
  and the owner's decisions on them.
- [`scripts/`](scripts/) — the two scripts that produced the numbers.
