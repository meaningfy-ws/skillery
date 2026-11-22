# Seed: Langfuse analysis of two weeks of coding sessions

**Secondary input, never groomed.** Captured 2026-11-22 by the agent from the Langfuse project
that records every Claude Code turn on the owner's machine (trace name `Claude Code Turn`).
Window: 2026-11-08T00:00Z to 2026-11-23T00:00Z (the last day partial). All projects, not only
skillery: rdf-persistence, mapping-workbench-v2, skillery and others, all run with the skillery
bundles installed.

Owner's request (verbatim): "can you access langfuse? I nwwd to analyse the last 2 weeks of coding,
and identify why there are so manu tokesna dn tome consumed?" then "can you go a little deeper with
your analisys and then save it in a new epic titch inputs, on skillery eprformance improvement?"

## 1. Totals

| Measure | Value |
|---|---|
| Sessions / user turns (traces) | 215 / 1,487 |
| Model calls | 42,444 (17,206 main thread, 25,238 subagent) |
| Subagent spawns (`Agent` tool) | 1,159 |
| Tokens, all kinds | 6.90 B |
| of which cache reads | 6.66 B (96.5 %) |
| cache writes, 5-minute TTL | 132.6 M (all of them in subagents) |
| cache writes, 1-hour TTL | 78.1 M (all of them on the main thread) |
| output | 33.0 M (0.5 %) |
| uncached input | 0.09 M |
| Cost shown by Langfuse | $0: no model prices are configured in the project |

Calls per unit of work: 11.6 model calls per user turn on the main thread; 22 calls per subagent.

## 2. The mechanism: tokens = calls x context

Nearly every token is the existing context read again from cache on the next call. Total tokens
are therefore the number of calls times the context each call carries. Both factors are high.

### 2.1 Context per call

| Model | Calls | Median context | p90 | Max | Avg output |
|---|---|---|---|---|---|
| Fable 5.2 | 2,887 | 247 k | 537 k | 932 k | 1,272 |
| Opus 5.5 | 23,965 | 144 k | 332 k | 980 k | 744 |
| Sonnet 5.5 | 15,519 | 107 k | 179 k | 366 k | 736 |
| Haiku 5.5 | 36 | 57 k | 78 k | 137 k | 1,315 |

Main-thread context histogram (17.2 k calls): under 90 k: 5 %; 90-165 k: 34 %; 165-252 k: 23 %;
252-344 k: 19 %; 344-446 k: 10 %; over 446 k: 9 %.

### 2.2 The floor: what a call costs before any work

The smallest context seen in a session or a subagent is its starting load (system prompt, tool
definitions, skill listing, CLAUDE.md/AGENTS.md, memory, SessionStart hook output).

- **Main thread: 62-88 k tokens** (40 busiest sessions; most 67-78 k). A session never runs
  below this; 95 % of main-thread calls run above 90 k.
- **Subagents: three floors.** About 81 k (the `implementer` and similar wrappers, which carry
  the full tool set and skill listing), about 55 k, and about 32 k (lighter agent types). The
  floor depends on the agent type, not the task.
- Local estimate of the pieces we control (chars / 4): AGENTS.md + CLAUDE.md 3.0 k; global
  CLAUDE.md 0.7 k; MEMORY.md 0.2 k; `using-superpowers` hook 0.8 k; `ponytail` hook 1.3 k; the
  skill listing about 230 skills from 20+ plugins; 15 local MCP servers plus about 10 claude.ai
  connectors whose deferred tool names are listed every session (neo4j x7, n8n, Airtable, Miro,
  Gmail, Slack, Atlassian x2, ...). **Not measured precisely**: the first task of the PLAN is to
  measure the floor's composition (Claude Code `/context`).

Implication: 1,124 subagent spawns x about 80 k floor is about 90 M tokens of cache writes at
start alone, two thirds of all 5-minute cache writes.

### 2.3 Number of calls: tool round trips

Tool calls over the window: Bash 32,631; Edit 12,024; Read 4,351; Write 1,557; Agent 1,159;
SubagentHandback 978; Skill 582; gitnexus `impact` 456; ToolSearch 427; Atlassian read 221;
Monitor 215; AskUserQuestion 182; SendMessage 163; WebFetch 100; Grep 45; Glob 19.

Each tool call is one more model call that re-reads the whole context. Bash is 60 % of all tool
calls. A sample of 50 Bash calls from one rdf-persistence delivery session (2026-11-21):

- about 40 % read files or search text (`sed -n`, `grep`, `cat`, `head`, `wc`, `ls`), work that
  Read/Grep or Serena do with less output, and often several lookups in a row for line numbers;
- about 25 % `gh` (PR checks, CI watch, issues, merges), several of them re-reading a background
  task's output file;
- about 15 % git; about 15 % test and `make` gates; the rest scripts.

### 2.4 Who spends it: main thread versus subagents

| | Tokens | Cache reads | Cache writes | Output |
|---|---|---|---|---|
| Main thread | 4.05 B (59 %) | 3.96 B | 78 M (1 h) | 13.0 M |
| Subagents | 2.85 B (41 %) | 2.70 B | 133 M (5 min) | 19.9 M |

Price-weighted (units of input price, model mix ignored: cache read 0.1, 5-min write 1.25,
1-h write 2, output 5): cache reads 58 %, cache writes 28 %, output 14 %; main thread 54 %,
subagents 46 %. The 1-hour cache writes on the main thread come from long pauses (see 2.6) and
resumed sessions: each pause over the TTL rewrites the whole context at double price.

### 2.5 What the subagents are for

1,124 named spawns, classified by their description:

| Purpose | Spawns | Share | Wall time |
|---|---|---|---|
| build (tasks, implement, write) | 314 | 28 % | 74 h |
| review (lenses, audits) | 263 | 23 % | 12 h |
| check / gate / attack / verify | 173 | 15 % | 15 h |
| fix (findings, hardening) | 158 | 14 % | 28 h |
| cold reader / second reader | 33 | 3 % | 2 h |
| recon / explore | 31 | 3 % | 2 h |
| other | 152 | 14 % | 16 h |

**About 55 % of spawns verify or repair work (review, check, fix, cold reader); 28 % build it.**
The sample of the 100 latest subagents by type: implementer 69, code-reviewer 20,
general-purpose 10, web-fetch 1. Long fixers are costly: one "Fix stage 4 review findings"
implementer made 150 calls in 36 minutes, its context growing from 84 k to 366 k.

Skills tagged on the most expensive turns: `epic-delivery` with `rulebook` and `technical-writing`
subagents (522 M tokens over 2 sessions); `technical-writing` subagents (366 M, 10 sessions);
`cosmic-python` subagents (267 M, 15 sessions); `rule-learner` (242 M, 26 sessions);
`epic-delivery` (233 M, 15 sessions); `clarity-gate` subagents (188 M, 11 sessions).

### 2.6 Time

Spans overlap (parallel subagents, background tasks), so hours are indicative.

| Where | Hours | Median | p95 |
|---|---|---|---|
| Bash | 148 | 1.3 s | 65 s (test and `make` gates, CI watches) |
| Waiting for the owner (AskUserQuestion, 182 asks) | 113 | 2.5 min | 3.5 h |
| Model generation, main thread | 100 | 4.9 s | |
| Model generation, subagents | 77 | 3.9 s | |
| Edit | 18 | 2.5 s | 19 s |

### 2.7 Sessions and days

Top sessions: 446 M, 396 M, 320 M, 249 M, 242 M tokens; the busiest made 5,391 observations and
411 main-thread calls, its context reaching 932 k. Busiest days: 2026-11-14 (1.57 B, 117 turns)
and 2026-11-15 (784 M); together a third of the window.

## 3. Findings in one list

1. **F-1 Long sessions.** Main-thread median context is 199 k; sessions run to 500-980 k. The
   guardrails' session-hygiene rule (fresh session at a task boundary, compact at a phase boundary)
   is not followed, or not triggered.
2. **F-2 Heavy floor.** Every main session starts at about 70 k and the heaviest subagents at about
   81 k, before any work. The floor is paid on every call and again on every spawn.
3. **F-3 Verification fan-out.** About 55 % of subagent spawns verify or repair. The method's
   review lenses, cold readers, gate runs, attacks and fix passes each start a fresh 80 k context.
   Our own rules push this way (R-0004 "run as subagents in parallel", P-0006 "lead subagents for
   the spec deltas, the attack and the gate runs").
4. **F-4 Small Bash round trips.** 32.6 k Bash calls; in the sample about 40 % read or search files,
   often several small lookups in a row. Each costs a full context re-read.
5. **F-5 Cache expiry.** 133 M 5-minute cache writes in subagents (mostly their start) and 78 M
   1-hour writes on the main thread after long waits for the owner (p95 3.5 h).
6. **F-6 Model choice.** Fable carries the largest contexts (median 247 k) on long sessions; Opus
   runs most subagents where Sonnet would do.
7. **F-7 No cost visibility.** Langfuse has no model prices, so cost reads $0 and no one sees it.

## 4. Caveats

- Floors are the minimum context seen, a proxy for the starting load, not a measurement of it.
- The subagent purpose split classifies descriptions by keyword; about 14 % are unclassified.
- The Bash split is a sample of 50 calls from one session.
- The analysis covers all projects; skillery shapes them through the installed bundles.
