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

## What the owner wants next

Compare these findings with the open test-improvement EPICs, then discuss both together before
anything is shaped.

## Inputs in this folder

- [`findings-2026-11-14.md`](findings-2026-11-14.md) — the measurements, the findings and the
  recommendations, written before the test EPICs were read.
- [`scripts/`](scripts/) — the two scripts that produced the numbers.
