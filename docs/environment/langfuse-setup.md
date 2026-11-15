# Set up Langfuse for rule monitoring

This guide connects one machine to the company Langfuse server. Langfuse records every tool call
of a Claude Code session, and `rule-steward` reads those records back to see which rules are used.
Setup takes two parts: the Langfuse plugin writes the traces, and three environment variables let
`stats` read them. How the rules work is in [`rules.md`](rules.md); the server itself is specified in
[`langfuse-deployment-spec.md`](langfuse-deployment-spec.md).

The same traces show where the work went: which repository, which branch, which subagent, how many
tokens. [What a trace carries](#what-a-trace-carries) lists each data point and where to find it.

You need the server's address and a key pair from the Langfuse project's settings (**API Keys**).

## 1. Install the plugin

The plugin's hook runs as a `uv` script and falls back to `python3`. Install `uv` first:

```bash
which uv || curl -LsSf https://astral.sh/uv/install.sh | sh
```

Then add the plugin and give it the server and keys:

```bash
claude plugin marketplace add langfuse/Claude-Observability-Plugin
claude plugin install langfuse-observability@langfuse-observability \
  --config LANGFUSE_BASE_URL=https://langfuse.example.org \
  --config LANGFUSE_PUBLIC_KEY=pk-lf-... \
  --config LANGFUSE_SECRET_KEY=sk-lf-... \
  --config LANGFUSE_USER_ID=your.name@meaningfy.ws
```

The secret key goes to the OS keychain, not to a file. To avoid keys on the command line, run
`/plugin configure langfuse-observability@langfuse-observability` inside a session instead.
The other values land in `~/.claude/settings.json`, under `pluginConfigs`, and the plugin is switched
on there under `enabledPlugins`. `/plugin configure` also lists the optional settings.

`LANGFUSE_USER_ID` puts your name on every trace, which is what the Langfuse **Users** page ("Start
tracking users") asks for. Without it, traces have no user. Use the same id on every machine.

## 2. Set the read variables

The plugin only writes. `stats` reads with these variables, set in your shell profile and never in git:

```bash
export LANGFUSE_BASE_URL=https://langfuse.example.org
export LANGFUSE_PUBLIC_KEY=pk-lf-...
export LANGFUSE_SECRET_KEY=sk-lf-...
```

## 3. Check it

Restart Claude Code, send one message, then:

```bash
claude plugin list                          # langfuse-observability ... enabled
tail -5 ~/.claude/state/langfuse_hook.log   # a new "Processed N turns" line
```

The trace appears in the Langfuse UI a few seconds later. To check the read side, run `stats` with
the `rulebook` script; a window with no `rules.py` call yet ends with a warning, not an error.

Then open the newest trace, named `Claude Code Turn`, and check three things:

- The `Conversational Turn` span shows `cwd`, `git_branch` and `project` in its metadata.
- An `LLM Call` shows a usage breakdown with `input`, `output` and the cache counts.
- Each tool call appears once. Compare the `tool_id` values in the metadata of the `Tool: ...` spans.

A one-off run is enough for this check. Start it in a repository:
`claude -p "Run the bash command: echo hello"`. The log line says `Processed 0 turns` for such a run,
because the turn is sent while it is still open; the trace is there all the same.

## What a trace carries

The plugin sends one trace per turn: your message and everything Claude does until it stops. The
trace holds a root span, `Conversational Turn`, with one `LLM Call` per model response and one
`Tool: <name>` span per tool call under it. A subagent adds a `Subagent: <description>` span with its
own `Subagent LLM Call` and tool spans. Every observation carries the session id, your user id and the
trace's tags.

| Data point | Traced | Where to find it |
|------------|--------|------------------|
| Repository, branch, working directory, worktree | yes, per trace | Metadata of `Conversational Turn`: `cwd`, `git_branch`, `project`. `project` is the last folder of `cwd`, so in a worktree it is the worktree's name and the repository is the folder above `.claude/worktrees/` in `cwd`. |
| One record per event | mostly | See *Known limits*: a long turn with background subagents can be sent twice. |
| Subagent type, description, dispatching call | yes | `Tool: Agent` has `subagent_type`, `subagent_description`, `subagent_transcript_path` and its own `tool_id`. The `Subagent: ...` span has `agent_type`, `description` and `transcript_path`. The transcript file name is the same on both, and that joins a subagent to the call that started it. |
| Token split | yes | `usageDetails` of each `LLM Call` and `Subagent LLM Call`: `input`, `output`, `cache_read_input_tokens`, `input_cache_creation_5m`, `input_cache_creation_1h`. |
| Epic id | no field | Read it from `git_branch` when the branch is named after the change, or from the file paths in the tool inputs (`openspec/changes/<id>/`). |
| Waiting on the person | no flag | A `Tool: AskUserQuestion` span lasts as long as the person took to answer. Time spent on a permission prompt is inside the tool span it belongs to and cannot be told apart. |
| Skills loaded | yes | Tags `skill:<name>` for the turn and `subagent-skill:<name>` for its subagents, on every observation. The option is `CC_LANGFUSE_SKILL_TAGS`, on by default. |
| Phase, stage or task, review outcome | no field | The lead states them in the session's text: the mark line (`epic-delivery`, `references/team-and-briefs.md`) and the result line. `session-retrospective`'s scripts read them from the transcripts; Langfuse does not. |
| Cost | not yet | See *Known limits*: the server needs a price for each model. |

### Add your own tags

The plugin reads `CC_LANGFUSE_TRACE_TAGS`, a comma-separated list such as `repo:my-repo,team:data`,
and puts those tags on every observation. That makes them usable as a filter on tool calls and model
calls, where the trace metadata is not. Up to 20 tags are kept.

The value is read from the environment Claude Code itself runs in. Set it in the `env` block of a
settings file, for example a repository's `.claude/settings.local.json`, or in the shell that starts
`claude`. A session hook cannot set it: what a `SessionStart` hook exports reaches the Bash tool, not
other hooks. So the tags are fixed when the session starts and do not follow a branch change.

## Claude Desktop

The desktop app's **Code** mode runs Claude Code on the same machine, so the plugin installed above
traces it too. **Chat** mode and cloud sessions are not traced. Two things to check:

- The desktop app does not read your shell profile. If `uv` is not on the PATH the app sees, the hook
  runs with `python3`; if neither is there, nothing is traced and the log gets no new line.
- If the plugin is also added in claude.ai, `claude plugin list` warns that the synced copy is not
  loaded because the local one has the same name. That is expected: the local install wins.

## Known limits

- **opencode is not traced.** There is no Langfuse plugin for it, so rules used only there look unused.
- **Langfuse v4 `events_only` servers** accept traces only through OpenTelemetry and serve reads only
  from `GET /api/public/v2/observations`. The plugin and `stats` both use those.
- **Long outputs are cut** at 20,000 characters by default (`CC_LANGFUSE_MAX_CHARS`). `stats` counts a
  cut `load` or `check` as truncated.
- **Cost stays empty until the server knows the model.** Langfuse prices a call from a model
  definition, and it ships none for the current Claude models. An owner of the project adds one per
  model under **Settings → Models**: the match pattern is the model name shown on an `LLM Call`, and
  the prices are per token for the five usage keys in the table above. Calls sent before that stay
  without a cost.
- **A long turn can be recorded twice.** A turn that waits on background subagents is sent in several
  steps, and the plugin sometimes starts it again from the beginning. The trace then has two
  `Conversational Turn` spans and every tool call twice, with the same `tool_id`. Count by `tool_id`,
  not by span, when you add up such a trace. No setting avoids it.
- **A very large turn can lose spans.** The plugin gives itself five seconds to send a turn and never
  holds Claude Code up; what is not sent by then is dropped.
- **A remote session must reach the server.** A cloud session behind a network allow-list cannot run
  the weekly review until the Langfuse host is allowed there; run it locally instead.
