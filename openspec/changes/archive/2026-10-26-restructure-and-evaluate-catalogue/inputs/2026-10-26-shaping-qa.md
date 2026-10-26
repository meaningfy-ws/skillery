# Owner answers during shaping (2026-10-26)

**Status:** SECONDARY input, the Q&A record. Never groomed, never deleted. The golden-thread parent is
the baseline audit, `openspec/changes/archive/2026-10-26-skill-crafting-method/inputs/baseline-audit.md` (it moves to the
archive when that change is archived).

| # | Question | Owner's answer |
|---|---|---|
| Q1 | Scope beyond the five audit batches A–E? | **All of:** audit batches A–E; a behavioural eval suite per bundle; agents too; repo docs and structure |
| Q2 | Rigour per skill? | **Method defaults:** the agentskills.io trigger method (~20 queries, half near-misses, 3 runs) for description changes; baseline runs (≥ 5 repetitions) for body restructures; a before/after record per skill |
| Q3 | Budget ceiling for model runs? | Verbatim: "up to 5$, is it enough? shall be discussed later, and teh evals are on demand, with human control, is a system like that one for monitoring adn evaluating agents/apps shall be used?" |
| Q4 | Order relative to the catalogue model? | **After step 3** (the roadmap order) |

## The answer given to Q3 (recorded for the PLAN)

Measured cost of one seed-case run: $0.04 on `claude-sonnet-5-5`, $0.11 on the default model.

| Work | Runs | Estimate |
|---|---|---|
| Batch A: the trigger method on 21 descriptions | ~1,260 short runs | ~$40–55 |
| Batch B: baselines for 2 skills | ~60 | ~$5 |
| Batch C, plus one suite per bundle | ~80 | ~$5–10 |
| Agents | ~30 multi-turn | ~$10 |
| **Total** | | **~$60–80** |

$5 covers batches C and D plus a smoke run per bundle. Levers: Haiku for trigger tests, fewer queries
for descriptions just over the target, worst-first ordering. The budget stays open (DEC-5): each
batch states its estimate and the owner approves it before it runs.

On evaluation and monitoring platforms (Langfuse, Braintrust, LangSmith, promptfoo, Phoenix): they
evaluate and trace LLM applications. This EPIC tests skill behaviour inside Claude Code sessions,
which `claude plugin eval` and `skill-creator` cover. Monitoring the real use of Meaningfy's own
agents and apps (for example through Claude Code's OpenTelemetry export into a tool such as Langfuse)
is a separate engineering and operations decision, named out of scope here. Its integration details
are to be verified when that decision is shaped.
