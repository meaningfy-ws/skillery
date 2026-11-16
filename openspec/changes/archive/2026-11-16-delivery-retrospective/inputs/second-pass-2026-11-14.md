# Second pass — what drives the cost, and what to change

**Status:** secondary input. Made on 2026-11-14 by a reader working from the digest tables and from
selected transcripts. It corrects two findings of the first pass and adds the reading the first pass
still owed. Savings are arithmetic on measured counts; none is tested, except where a run is named.

## Corrections to the first pass

- **F-5 (worker start).** The growth after `b27cef1` is not connector tool schemas. It is one large
  built-in tool definition the workers never use (about 14,000 tokens), a list of several hundred
  connector tool names (about 7,500 tokens) and a longer `AGENTS.md`. A test run with a restored
  tool list measured about 11,500 tokens saved per worker start, not 26,000 to 38,000 (PR #234).
  The list must contain the tool-search tool, or the worker gets heavier.
- **F-11 (waiting on GitHub).** Most of the hours on `gh pr merge` are twelve commands that waited
  up to 7.5 hours, most likely on a permission prompt while the owner was away. Real waiting on CI
  is about ten hours. The lead makes about seven calls per PR to watch and merge.
- **F-10 (polling).** Mostly solved since the hook of 9 November: 995 of the 1,118 polling commands
  are before 10 November.

## What a session starts with

A main session's first call is about 69,000 tokens. About half is under the owner's control.

| Part | Share | Owner controls it |
|---|---|---|
| Built-in tool definitions (16 tools; one of them is half of this) | 40% | Not established |
| Skills listing (208 skills, 41 of them Meaningfy's) | 16% | Yes |
| Repository instructions | 9% | Yes |
| Names of deferred connector tools (328) | 7% | Yes |
| Base system prompt | 7% | No |
| Connector instructions | 6% | Yes |
| Agent types listing | 5% | Yes |
| Session-start hooks | 4% | Yes |
| Memory index, user instructions, environment | 6% | Partly |

An implementer's first call is about 80,000 tokens. **35% of it is the five skills the agent
preloads**, whether the task needs them or not; two of them make up most of that.

## What drives the cost

1. **The lead re-reads a large context on every call.** 80% of the lead's input tokens are in calls
   above 200,000 tokens of context, and 38% above 400,000. The lead makes about one tool call per
   model call, and 38% of its commands are file reads.
2. **The stage boundary is not a reset.** The skill says to compact between stages. In an unattended
   run the lead cannot compact itself, so one overnight delivery ran four stages in one context that
   peaked near one million tokens.
3. **One session carries several EPICs.** Seven sessions shaped or delivered two or three EPICs; the
   two most expensive shaping sessions carried three and six.
4. **Gate rounds have no limit above SMALL.** 117 scorer subagents ran; 19 of 47 PLANs had three or
   more rounds, one reached eleven. About 49 rounds are beyond a second run. No skill asks for a
   subagent scorer; the sessions chose it.
5. **Review leads to fix rounds without a floor.** In the most expensive delivery session every
   lens finding became a fix, a verifier then found partial fixes, and the fixers used more tokens
   than the builders. In a by-the-book run, review was 43% of subagent tokens and 55 to 65% of each
   stage's time came after the last build task.
6. **Gates run more often than the skill says.** A third of implementers ran a full `make` target
   twice or more where the skill says once. Skillery ran `make validate` 3.5 times per PR against
   two per stage. One repository's instructions ask the lead to re-run a gate per task, against the
   skill.
7. **Reviewers re-run tests** although their brief says not to: 166 times since 10 November.

## Habits against the instructions

- **Reading with shell tools has not fallen:** 18,334 `sed`, `cat`, `grep`, `head` and `tail`
  commands against 3,706 Read calls. Subagents do receive the instructions, and a brief that
  repeats the rule changes nothing.
- **The instructions ask for tools that are not there.** The sessions have no Grep or Glob tool.
  Serena exposes two tools, not the symbol tools the instructions name; it was called nine times in
  two weeks. "Serena and ast-grep are mandatory" is followed close to never.
- **"Impact before every edit" is followed for about 7% of edits**, and the change check before a
  commit for about 5%.
- **The heredoc rule works:** Python heredocs fell from about 700 a day to about 150 while Edit
  calls by subagents rose.

## Changes to skills and agents, most saving first

| # | Where | Change |
|---|---|---|
| 1 | `guardrails` Session hygiene; `epic-delivery` Between stages | Make the stage boundary a reset the agent can perform: write a hand-over note, end the session, start the next stage fresh. |
| 2 | `guardrails`; `epic-delivery` lead's duties | The lead batches its reads or delegates them; it does not read one file per call. |
| 3 | `agents/implementer.md`, `agents/code-reviewer.md` | A tool list again (PR #234). |
| 4 | `agents/implementer.md` `skills:` | Preload fewer skills; load the rest on demand; the Python skill only in a Python repository. |
| 5 | `epic-planning` step 8 | The two-run gate limit for every appetite; a re-score reads only the listed gaps. |
| 6 | `epic-delivery` step 4 | A severity floor for accepted findings, and one fix pass per stage checked by the stage gate. |
| 7 | `epic-delivery` review sets | A MEDIUM stage takes the small review set unless a risk is recorded. |
| 8 | `epic-delivery` team and briefs | Name the tools that exist, not the ones that do not. |
| 9 | `meaningfy-git-workflow` or `epic-delivery` step 6 | One background watch-and-merge command per PR. |
| 10 | `epic-delivery` Sessions | One session delivers one EPIC, and the lead does not build. |
| 11 | `epic-delivery` stage loop | One fixed result line per review, tester and checker run. |
| 12 | all skills and agents | Shorter descriptions: they are in every call of every agent. |

## Changes to repository instructions

| # | Where | Change |
|---|---|---|
| 1 | All repositories, so the `project-setup` template | Remove "impact before every edit" and "change check before every commit", or cut them to one check per task by the lead. |
| 2 | All, template | One short habits block: no polling, Edit not heredoc, Read with a range, batch reads. Only two repositories have it. |
| 3 | All, template | A size budget for `AGENTS.md`: they are 11,600 to 21,500 characters and go into every call. |
| 4 | All | Rewrite the "navigating code" text for the tools that exist. |
| 5 | rdf-persistence | Drop the lead's gate re-run per task; name one task gate for builders; keep the container tests out of a task; re-index once per stage, not per commit. |
| 6 | rdf-fingerprinter | Drop the lead's full check after each task. |
| 7 | skillery | State that `make validate` runs twice per stage. |
| 8 | legal-agreements, skillery | Say that builders here need no Python skills, until the preload is fixed. |

## What the owner's way of running sessions costs

- Installed plugins and connectors add about 14,000 tokens to every call of every agent: 167 skills
  that are not Meaningfy's, and 328 to 475 connector tool names with their instructions.
- Eight sessions passed 600,000 tokens of context.
- A prompt left pending while away: 37 lead commands over ten minutes add up to about 30 hours.
- Returning after more than an hour rewrites the context (66 times). The token cost is small. A
  gap under an hour costs nothing.
- "Score it again until it passes" prompts drove the five-round gates.

## Not determined

- Whether the large built-in tool definition can be removed from a main session.
- What any review, tester or checker round found. Without it, the value of fewer rounds is unproven.
- Subagent classes come from a pattern on the description.
