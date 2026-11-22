# Langfuse usage report

The procedure behind a dated page of `docs/practice/ai-coding/usage-reports/`. It reads the Langfuse
project that records every Claude Code turn, with the `queryMetrics` tool and nothing else; it never
writes to the traces. Two people who run it over the same window must get the same numbers.

Set the window once: `FROM` and `TO` are UTC timestamps, `TO` exclusive (the baseline page uses
`2026-11-08T00:00:00Z` to `2026-11-23T00:00:00Z`). Every query below takes them as
`fromTimestamp` and `toTimestamp`. Keep the project's trace name `Claude Code Turn` as the unit of
a user turn, and count calls and spans by distinct `tool_id` where the transcripts are the check
(Langfuse holds about a third fewer events).

## Pinned fields

Every query depends on these names. Check them first; a missing one marks the page **not
comparable**: head the page "not comparable", name the field, tell the owner (RISK-1), and do not
compare its numbers with an earlier page.

- View `observations`; dimensions `type`, `name`, `providedModelName`, `traceName`, `sessionId`,
  `tags`, `calledToolNames`; metrics `count`, `inputTokens`, `outputTokens`, `totalTokens`,
  `totalCost`, `latency`, `toolCallInvocations`.
- Observation names `LLM Call` (main thread), `Subagent LLM Call`, `Tool: <name>`, and the trace
  name `Claude Code Turn`.
- `totalCost` is comparable only from 2026-11-22T12:35Z, when the model prices were set; traces
  before it read 0 and are never re-priced. A page that spans that time says so.
- The usage keys that separate cache reads, 5-minute cache writes and 1-hour cache writes.
- The tags `skill:<name>`, `subagent-skill:<name>` and, from task 1.6, `skillery:<version>`.

## Queries

Each call is one `queryMetrics` with the arguments shown. The numbers of one page come from one
window.

### Q1 Totals

```json
{"view":"observations","dimensions":[],
 "metrics":[{"measure":"count","aggregation":"count"},{"measure":"totalTokens","aggregation":"sum"},
            {"measure":"inputTokens","aggregation":"sum"},{"measure":"outputTokens","aggregation":"sum"},
            {"measure":"totalCost","aggregation":"sum"}],
 "filters":[],"fromTimestamp":"FROM","toTimestamp":"TO"}
```

Run it again with the filter `name = LLM Call` (main thread) and `name = Subagent LLM Call`, and
once on the view `traces` for turns and distinct `sessionId` for sessions. Read: model calls are
the two counts added; cost is 0 until prices are set (task 1.1).

### Q2 Usage by observation type

```json
{"view":"observations","dimensions":[{"field":"type"}],
 "metrics":[{"measure":"count","aggregation":"count"},{"measure":"totalTokens","aggregation":"sum"}],
 "filters":[],"fromTimestamp":"FROM","toTimestamp":"TO",
 "orderBy":[{"field":"sum_totalTokens","direction":"desc"}],"config":{"row_limit":20}}
```

Read: `GENERATION` carries the tokens; `SPAN` and `TOOL` carry time, not tokens. A result without
`type` fails the pinned field check.

### Q3 By model, with the context per call

```json
{"view":"observations","dimensions":[{"field":"providedModelName"}],
 "metrics":[{"measure":"count","aggregation":"count"},{"measure":"inputTokens","aggregation":"p50"},
            {"measure":"inputTokens","aggregation":"p90"},{"measure":"inputTokens","aggregation":"max"},
            {"measure":"outputTokens","aggregation":"avg"},{"measure":"totalTokens","aggregation":"sum"}],
 "filters":[{"column":"type","operator":"=","value":"GENERATION","type":"string"}],
 "fromTimestamp":"FROM","toTimestamp":"TO",
 "orderBy":[{"field":"sum_totalTokens","direction":"desc"}],"config":{"row_limit":20}}
```

Read: `inputTokens` includes the cached context, so p50 is the context a call carries. Tokens are
calls times context; a high p90 on few calls and a low p50 on many need different fixes.

### Q4 Per day, with cost

```json
{"view":"observations","dimensions":[],"timeDimension":{"granularity":"day"},
 "metrics":[{"measure":"totalTokens","aggregation":"sum"},{"measure":"totalCost","aggregation":"sum"},
            {"measure":"count","aggregation":"count"}],
 "filters":[],"fromTimestamp":"FROM","toTimestamp":"TO",
 "orderBy":[{"field":"sum_totalTokens","direction":"desc"}],"config":{"row_limit":40}}
```

Read: the busiest days; traffic with cost 0 means a model id has no price (say so on the page).

### Q5 Top sessions

```json
{"view":"observations","dimensions":[{"field":"sessionId"}],
 "metrics":[{"measure":"totalTokens","aggregation":"sum"},{"measure":"count","aggregation":"count"},
            {"measure":"inputTokens","aggregation":"max"}],
 "filters":[],"fromTimestamp":"FROM","toTimestamp":"TO",
 "orderBy":[{"field":"sum_totalTokens","direction":"desc"}],"config":{"row_limit":10}}
```

Read: the five largest sessions and their maximum context. Report sizes only, never prompt text.

### Q6 Tool invocations

```json
{"view":"observations","dimensions":[{"field":"calledToolNames"}],
 "metrics":[{"measure":"toolCallInvocations","aggregation":"sum"}],
 "filters":[],"fromTimestamp":"FROM","toTimestamp":"TO",
 "orderBy":[{"field":"sum_toolCallInvocations","direction":"desc"}],"config":{"row_limit":40}}
```

Read: Bash is the largest; each call is one more model call that re-reads the context. `Agent` is
the spawn count.

### Q7 Latency per observation name

```json
{"view":"observations","dimensions":[{"field":"name"}],
 "metrics":[{"measure":"count","aggregation":"count"},{"measure":"latency","aggregation":"p50"},
            {"measure":"latency","aggregation":"p95"},{"measure":"latency","aggregation":"sum"}],
 "filters":[{"column":"name","operator":"any of","value":["LLM Call","Subagent LLM Call"],"type":"stringOptions"}],
 "fromTimestamp":"FROM","toTimestamp":"TO","orderBy":[{"field":"sum_latency","direction":"desc"}],"config":{"row_limit":50}}
```

Run it a second time with the filter `name starts with "Tool: "` (one row per tool). Read: spans
overlap (parallel subagents, background tasks), so hours are indicative; waiting for the owner is
the `Tool: AskUserQuestion` row.

### Q8 Tags to skills loaded

```json
{"view":"observations","dimensions":[{"field":"tags"}],
 "metrics":[{"measure":"totalTokens","aggregation":"sum"},{"measure":"count","aggregation":"count"}],
 "filters":[],"fromTimestamp":"FROM","toTimestamp":"TO",
 "orderBy":[{"field":"sum_totalTokens","direction":"desc"}],"config":{"row_limit":50}}
```

Read: `skill:*` and `subagent-skill:*` tags show the skills loaded on the costly turns; one skill
appears in many rows. The same rows feed §Inventory.

## Gates passed

Langfuse cannot tell whether work was good, so each page adds two counts, read at every stage.

1. **First-run CI green.** List the pull requests merged in the window and, for each, the checks of
   its first run:

   ```bash
   gh pr list --state merged --search "merged:FROM_DATE..TO_DATE" --json number --limit 200
   gh run list --event pull_request --branch <head branch> --json databaseId,conclusion,createdAt
   ```

   Take the oldest run of each PR (smallest `createdAt`). Gates passed = PRs whose oldest run is
   `success`, divided by merged PRs. Report both numbers.
2. **Critical findings.** In the stage's `rounds.tsv` (from `scripts/epic_report.py`, built from the
   `result:` lines of `epic-delivery`) sum the `findings` column of the rows with
   `accepted` not `-`, per stage. A stage with no `result:` lines is unmeasured, not zero.

"Worsen" means the first-run-green share or the Critical count is below the baseline page's value.

## Attribution

The Langfuse plugin is Langfuse's own
([Claude-Observability-Plugin](https://github.com/langfuse/Claude-Observability-Plugin)), so
skillery cannot change its hook. Until the plugin tags versions itself, each machine does this by
hand (task 1.6):

1. Find the installed version: the folder name under
   `~/.claude/plugins/cache/meaningfy-skillery/meaningfy-core/`.
2. Set `CC_LANGFUSE_TRACE_TAGS=skillery:<version>` in the `env` block of `~/.claude/settings.json`.
   The plugin reads it from the environment Claude Code runs in; a SessionStart hook cannot set it.
3. After each skillery upgrade, bump the value by hand and restart the session.

Filter any query above with
`{"column":"tags","operator":"any of","value":["skillery:3.21.0"],"type":"arrayOptions"}` (use the
version read). The page states the tag values it filtered on and lists sessions without a
`skillery:` tag as "unattributed"; before a machine sets the variable, its traces are all
unattributed and the page covers a date window that mixes versions. The plugin repository does
not accept issues from outside contributors (the request was refused on 2026-11-22), so the ask
for automatic version tags goes as a pull request when someone has the time; until then the manual
tag stands. Stage pages (2 to 5) use the tag of the stage's release and are taken within seven
days of it; the stage 6 page waits fourteen.

## Per-stage proxies

Each is defined so two people compute the same number. All use the tag of the release.

- **Stage 2 (end sessions).** Median `inputTokens` of observations named `LLM Call` (the main
  thread; `Subagent LLM Call` excluded), and the share of those observations with `inputTokens`
  above 150,000. The baseline median is 199 k.
- **Stage 3 (scale verification).** Spawns per stage and the verification share: counted from the
  stage's `result:` lines in `handover.md`, the share of lines whose role is reviewer, checker,
  cold-reader, fixer or tester, over all spawns of the stage.
- **Stage 4 (lower the floor).** The floors of task 1.4 repeated: the starting context of a fresh
  session, an `implementer` and a `code-reviewer`, from the CLI's context command.
- **Stage 5 (quiet the tools).** `Tool: Bash` observations divided by `Claude Code Turn` traces,
  and the share of Bash commands matching the noisy forms of design D-10.
- **Stage 6.** The four numbers of the EPIC's DEC-2 and gates passed, fourteen days after the stage 5
  release.

## Inventory

A procedure, not a tool: it separates what a machine has installed from what the window used. It
runs per machine and writes `usage-reports/inventory-<host>-<date>.md`; a second machine writes its
own page and never edits the first.

1. List plugins: `claude plugin list`. Record each plugin and version.
2. Count skills per plugin: `find <plugin install folder> -name SKILL.md | wc -l`, one count per
   plugin, and the sum.
3. List MCP servers from the user config (`claude mcp list`, and the user-level `mcpServers`
   entries); note which are claude.ai connectors.
4. From Q8 take the `skill:` and `subagent-skill:` tags of the window, and from Q6 the tool names
   called (MCP tools carry the server name in the tool name).
5. Sort every skill, plugin and server into three lists. **Used**: a tag or a tool call names it.
   **Unused**: none appears and nothing in the repository's skills or agents depends on it.
   **Undecided**: it may be called without a tag (a skill preloaded by an agent, a hook, an
   occasional connector) or the window is too short to tell.
6. Write the page: the counts, the three lists, and the window. Numbers and names only.
7. The owner marks the subset of **unused** to disable. Nothing is disabled before that.
8. Disable with the CLI's commands: `claude plugin disable <name>@<marketplace>` (the marketplace
   suffix is required) and `claude mcp remove <name> -s user` (the scope flag). Record on the page
   what was disabled and when.
   - Plugins synced from claude.ai are switched off in the claude.ai plugin settings.
   - User-level skills under `~/.claude/skills/` are removed by deleting their folder; a broken
     symlink there counts as unused.
