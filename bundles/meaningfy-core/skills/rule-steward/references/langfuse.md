# Langfuse: settings and how usage is counted

Rule usage is read from Langfuse, which records every tool call of a Claude Code session through
the Langfuse Claude Code plugin. The catalogue ships no hook of its own: the plugin is the only
capture. The Langfuse deployment itself is specified for the company's infrastructure stacks
repository, not here.

## Settings

Set on the owner's machine, never in git (a shell profile or the CLI's environment settings):

| Variable | Holds |
|---|---|
| `LANGFUSE_BASE_URL` | the Langfuse server, for example `https://langfuse.example.org` |
| `LANGFUSE_PUBLIC_KEY` | the project's public key |
| `LANGFUSE_SECRET_KEY` | the project's secret key |

`stats` calls `GET /api/public/v2/observations` with these keys (HTTP basic authentication), asking
for the `io` field group and following `meta.cursor` page by page across the window. It is the read
endpoint that also works on Langfuse v4 servers in `events_only` mode, where `/api/public/observations`
answers 404. A missing variable, an HTTP error or no answer exits 3 and
names the problem.

## How events are found

`load`, `cite`, `check` and `override` are shell commands, so the plugin records each one as an
observation whose input is the command and whose output is what it printed.

- Only tool observations count. Observations of type `GENERATION` are skipped: their input repeats
  the whole conversation, so they would count every earlier `cite` and `override` again on each turn.
- For each other observation in the window, every text field is read, including JSON held as text.
  The text that contains `rules.py <command>` is the input; the rest is the output.

## How counts are derived

| Count | From |
|---|---|
| loaded | the ids on the output lines of `load` that start with `R-NNNN ` |
| cited | the ids in the input of `cite` |
| overridden | the ids in the input of `override`, with its `--reason` text |
| violated | the ids on the output lines of `check` that start with `VIOLATION R-NNNN` |

`load` and `check` print `-- end --` last. An output without it was cut off by the trace: the event
counts, without ids, and `stats` reports it as truncated.

If a window holds observations but no `rules.py` event at all, the trace format has probably
changed. `stats` warns and raises no usage flag rather than calling every rule unused.

## The opencode gap

There is no Langfuse plugin for opencode that we know of. Sessions on opencode can `load`, `cite`
and `check`, but nothing records them, so rules used only there look unused. This is a recorded
parity gap of rule monitoring; say so in the report when the owner also works in opencode.

## Confirmed shape

Checked on 2026-10-29 against the company server (Langfuse 4.72, `events_only` mode): the response
holds `data` with `type`, `startTime`, `input` and `output`, and `meta` with `cursor` while more pages
remain. Tool calls arrive as `TOOL` observations named `Tool: Bash`, beside `SPAN` and `GENERATION`
ones. A `rules.py` event in a live trace has not been seen yet; until it has, treat a format warning
as the likely cause of empty usage.
