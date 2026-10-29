# Set up Langfuse for rule monitoring

This guide connects one machine to the company Langfuse server. Langfuse records every tool call
of a Claude Code session, and `rule-steward` reads those records back to see which rules are used.
Setup takes two parts: the Langfuse plugin writes the traces, and three environment variables let
`stats` read them. How the rules work is in [`rules.md`](rules.md); the server itself is specified in
[`langfuse-deployment-spec.md`](langfuse-deployment-spec.md).

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
- **A remote session must reach the server.** A cloud session behind a network allow-list cannot run
  the weekly review until the Langfuse host is allowed there; run it locally instead.
