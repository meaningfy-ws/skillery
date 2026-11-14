# Planning record: the first PLAN version, its attack and its gate runs (EPIC C)

**Secondary input, never groomed.** The first version of the PLAN was derived on 2026-11-13 and
2026-11-14 before A was delivered and before B had a PLAN. It was attacked once and gated five
times, and did not pass. It was then rewritten against A as delivered and B as planned (the current
`design.md`). The full tables are in this branch's history, in `design.md` § Attack record as it
stood before the rewrite; the decision and task numbers below are those of that first version.

| Step | Result | What it found |
|---|---|---|
| Attack, a fresh subagent | 15 findings (X-1..X-15), all folded in | The tester's brief does not read `design.md`; the trace was empty on this PLAN; "inside the docs gate" had no wiring; the Invariants section "blocks" with nothing that blocks; `accepted` reasons pointed into `openspec/`; stage 3 had no stated rule to encode; `dependencies.yaml` forgotten; the tools are not installed; `CHK-<n>` collisions; archive order |
| Gate run 1 | 8.7, fail | The owner round's unit and bound; a skipped fixture test as proof; guessed scenarios without re-sign-off; Vale's layout and pin; the baseline's sample |
| Gate run 2 | 8.7, fail | The owner round did not fit one call; the trial drafts had no rule source; the unit of a check for a tool with several rules; a write path its check missed |
| Gate run 3 | 8.9, fail | Stage overtaking stated two ways; a fill outside the agreed candidates; call 1 with an empty survey; a baseline already green |
| Gate run 4 | 8.9, fail | The form of calls 2 and 3; the owner of a fill outside the candidates; the trace's fallback; stale facts |
| Gate run 5 | 8.82, fail; all 13 checklist items pass | Ten gaps left open by the owner's decision of 2026-11-14 ("leave it as it is"): the baseline's observable; no "none of these" in the owner round; the checkmake scenario against its fallback; a qualifying PLAN without a tester; which rows a check adds; a search source without a checkout; the tie-break of overlapping rules; C's names for B's stages; "three calls" against overflow; `none` in an `accepted` row |

The rewritten PLAN (commit ebd5784) was attacked and gated again, in parallel:

| Step | Result | What it found, all folded in |
|---|---|---|
| Attack, a fresh subagent | 15 findings | The installed tester brief may be older than B's (dispatch from the working tree); a Hypothesis test would break CI collection; `make quality-tools` fails in a doc-only project; styles synced into `quality/` would fail B's lint; the trace shows less than it claimed (its limit is now stated); edits to `design.md` after the gate would make the gate stale (`## Delivery decisions`); "no Makefile" was counted as a run; C's manifest against B's manifest test; a status in backticks slips past A's test; public text outside `evidence/` |
| Gate run 6 | 8.93, fail | Tool versions against B's pins; a fixture path collision; a requirement shared by two stages; two wrong counts; fill order stated two ways; Vale's sync command; undefined row forms |

What the rewrite did with the first version's findings: most of the findings came from guessing at A and B. A's family
files, its test and B's `quality/` tree, tests, manifest form and tester brief are now facts, and
the current `design.md` cites them. The ten open gaps of run 5 are closed there (owner round: D-6;
baseline: D-15; checkmake: D-7; the trace: D-13; rows: D-10; sources: § Algorithm).
