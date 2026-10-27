# A — Token usage of the add-devops-bundle session (2026-10-27)

Source: the Claude Code transcript of the session that shaped and implemented `add-devops-bundle`
(main thread plus 17 subagent transcripts), summed per assistant message. "Context" is the input
of one call (fresh + cache read + cache write). Read on 2026-10-27; an example, not a benchmark.

## Observed

| Agent (description) | Turns | First-call context | Peak context | Cache read (M tok) | Output (k tok) |
|---|---:|---:|---:|---:|---:|
| **main thread** | 296 | 64k | 426k | 74.5 | 268 |
| Crawl Confluence MSC space | 51 | 50k | 321k | 9.2 | 58 |
| Exhaustive read: infrastructure-stacks | 46 | 50k | 302k | 8.4 | 42 |
| Privacy review of devops change | 36 | 50k | 254k | 5.1 | 21 |
| Author infrastructure-operations skill | 34 | 51k | 171k | 4.3 | 37 |
| Exhaustive read: cloud-infrastructure | 25 | 50k | 229k | 3.6 | 37 |
| Author stack-operations skill | 26 | 51k | 171k | 3.2 | 30 |
| Author infrastructure-security skill | 26 | 51k | 145k | 2.8 | 29 |
| IT-2/IT-3 ops-watch hand-runs | 27 | 50k | 112k | 2.4 | 25 |
| IT-1 devops-engineer hand-run | 26 | 50k | 114k | 2.4 | 20 |
| IT-4 infra-reviewer hand-run | 25 | 49k | 122k | 2.3 | 21 |
| Author service-reliability skill | 21 | 51k | 146k | 2.2 | 30 |
| Analyse cloud-infrastructure repo | 22 | 49k | 126k | 1.9 | 17 |
| Analyse infrastructure-stacks repo | 15 | 49k | 127k | 1.4 | 16 |
| infra-reviewer on PR 175 | 14 | 50k | 99k | 1.1 | 17 |
| Clarity-gate the devops PLAN | 10 | 50k | 129k | 0.8 | 11 |
| Study Confluence DevOps pages | 8 | 49k | 60k | 0.4 | 2 |
| Research small-company DevOps practice | 5 | 49k | 84k | 0.2 | 19 |

All 17 subagents: 51.5M cache-read tokens in total; the main thread alone: 74.5M.

## What it shows

1. **No subagent inherited the main context.** Every one started at ~49–51k tokens while the main
   thread was at up to 426k: they were fresh agents, not forks.
2. **A fixed setup cost of ~50k tokens per spawn**, before any work: system prompt, the project
   binding, tool schemas, the listing of every installed skill. The machine had dozens of unrelated
   plugins installed (sales, small-business, legal, design, data …); each one lengthens that listing.
   17 spawns ≈ 0.85M tokens of setup alone.
3. **All 17 were `general-purpose`, on Opus, launched with defaults** — no catalogue agent, no tool
   restriction, no cheaper model, even for crawling and reading.
4. **The cost is driven by context growth, not by setup.** The dearest agents are the open-ended
   reads ("crawl", "exhaustive read"): ~50 turns each, peaking at 300k+, because every turn re-sends
   all that was read before.
5. **The four authoring ("implementation") agents** cost 12.4M cache-read tokens together, 21–34
   turns each — in line with test-and-fix loops, not anomalous.
6. **The coordinator is the larger bill.** The main thread's 74.5M exceeds all subagents together;
   every large report that comes back keeps being re-sent on each later main-thread turn.
