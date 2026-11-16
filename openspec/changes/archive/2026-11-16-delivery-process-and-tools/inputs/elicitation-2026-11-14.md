# Elicitation — delivery process and tools

**Status:** secondary input, never groomed. Recorded on 2026-11-14 in the shaping session. The EPIC
([`../proposal.md`](../proposal.md)) is the primary, shaped truth.

## Seeds read

This change has no seed of its own. Its seeds are the inputs of the retrospective, read in full:

- [`seed.md`](../../archive/2026-11-16-delivery-retrospective/inputs/seed.md): the owner's asks and 17 decisions.
- [`findings-2026-11-14.md`](../../archive/2026-11-16-delivery-retrospective/inputs/findings-2026-11-14.md): the
  measurements (F-1 to F-15) and recommendations (R-1 to R-11).
- [`second-pass-2026-11-14.md`](../../archive/2026-11-16-delivery-retrospective/inputs/second-pass-2026-11-14.md):
  what drives the cost, and the ranked changes to skills and to repository instructions.
- [`cross-check-test-epics.md`](../../archive/2026-11-16-delivery-retrospective/inputs/cross-check-test-epics.md): the
  findings against the test EPICs, with seven owner decisions.

Also read: `skills/epic-delivery/SKILL.md`, `skills/guardrails/SKILL.md` (rules 5 and 6),
`skills/epic-planning/SKILL.md`, the frontmatter of `agents/implementer.md`, `CLAUDE.md`,
`AGENTS.md`, and the unmerged `lean-skills` proposal. Not read: the two scripts, the
`project-setup` templates, and the designs of the four test EPICs beyond their D-28 and D-29.

## Decided before this session

Seed decisions 6, 8, 9, 11, 14, 15 and 16 and cross-check decisions 1, 3, 4 and 7 bound this EPIC.
They are not asked again.

## Round 1

| # | Question | Answer |
|---|----------|--------|
| 1 | Appetite? | LARGE. |
| 2 | Which undecided process changes are in: a severity floor with one fix pass per stage; the small review set by default at MEDIUM; one watch-and-merge command per PR; lead discipline (one session one EPIC, the lead does not build, reads batched or delegated)? | All four. |
| 3 | Which start-weight changes are in: the implementer preloads less; the impact check once per task; a size budget for `AGENTS.md`; shorter descriptions everywhere? | The first three. Shorter descriptions are not in. |
| 4 | Who starts the next stage's session after the hand-over note? Offered: the owner; a runner script; the lead launching its successor. | The owner starts it. |

## Round 2

| # | Question | Answer |
|---|----------|--------|
| 5 | How does the tool table treat Serena? Offered: name only what is present; repair Serena here; drop Serena. | None of the three. In the owner's words: "invite serena shall be used for all the tools and reasons it supports and can be useed for, encourage active usage". |
| 6 | What must the EPIC prove: rule scenarios; a cold start from the note; start weight measured; one real EPIC measured? | All four. |
| 7 | Which risks does the EPIC act on? | Parallel EPICs editing the same skills; fewer reviews missing a defect; the CLI changing under us. Not selected, so accepted: deliveries stall while waiting for the owner to start a stage. |
| 8 | Roll-out: release as usual; try in skillery first; release in two parts? | Release as usual. |

## Found during the session

Finding "the named Serena tools do not exist" (second pass, *Habits against the instructions*) is
half right. Serena exposes two tools, and one of them is a REPL that gives every Serena operation:
symbol and reference search, file overviews, symbol-level edits, rename, safe delete, diagnostics.
The instructions name tools by names that are not there, so agents do not find them. Several
operations fit in one REPL call.

## Risks

| Id | Risk | Likelihood | Impact | Answer |
|----|------|------------|--------|--------|
| RISK-1 | The floor, the single fix pass and the small MEDIUM set let a real defect through. What any review round found was never recorded, so the value of the removed work is unknown. | Medium | Medium: a defect reaches `develop` in any repository | Mitigate: a recorded risk on a stage restores the full set; rejected findings stay listed in `design.md`. |
| RISK-2 | `lean-skills` and the four test EPICs edit the same skills and collide with this one. | High | Medium: rework, or one EPIC undoing another | Mitigate: this EPIC is delivered first and says what it absorbs and what it leaves (DEC-17). |
| RISK-3 | Claude Code or opencode changes how tools, skills and agents load, and the tool table or the measured weights go stale. | Medium | Low: stale advice | Mitigate: a check compares the table with the agents' tool lists. |
| RISK-4 | With the owner starting each stage, a multi-stage EPIC waits whenever the owner is away. | High | Low to medium: longer elapsed time, no extra tokens | Accepted. Looked at again after the first measured EPIC. |

## Re-shaped on 2026-11-15

The EPIC was frozen on 14 November and is changed here on purpose, by the owner's decision in the
reassessment of all open EPICs ([`reassessment-2026-11-15.md`](reassessment-2026-11-15.md), S-6
and S-8). What changed: the result line moves here from `harden-checks-and-tests` D-29 (new
DEC-18, and the no-go against it is lifted); DEC-17 now says this EPIC owns every change to the
stage loop and gives the new order; DEC-3 states the tester's condition in full. RISK-2 (parallel
EPICs editing the same skills) is answered by that reassessment.

Later the same day the owner added one more change, recorded as DEC-19:

> i lso propoe that the epic lanning and epic shaping are executed together in the same workflow ,
> as parte of epic shaping skill ?, i mean that epic planning is odd in epic dleivery skills, if
> you know what i mean. plan to make this adjustment also in on eof tehse epics

It is placed here because this EPIC already edits `epic-planning` and the Sessions part of
`epic-delivery`. The reset allowed between the EPIC and its PLAN is the agent's addition: the two
most expensive shaping sessions measured were the ones that carried several EPICs.

## The agent's own proposals, for the owner to overrule

- The tool table lives in `guardrails` (DEC-8). The owner asked for the table, not for its home.
- No new hook in this EPIC (DEC-13).
- The level of the severity floor and the figure of the `AGENTS.md` budget are left to the PLAN.
