# opencode MCP probe (task 3.4)

Question: on opencode, does an agent rendered with no tool list (`tools: {"skill": true}`) still see
and call the project's MCP tools, and is its `task` permission denied (D-10)?

## Setup

- opencode v2.1.4, run non-interactively: `opencode run --standalone --agent implementer --format json "<prompt>"`.
- A scratch project (not the repo) holding: `opencode.json` with one local MCP server `probe`
  (a 15-line stdio server exposing one tool, `probe_ping`, which returns `pong-7731`), and
  `.opencode/agents/implementer.md` produced by `renderAgent` from the repo's `implementer`
  (`tools: {"skill":true}`, `permission: {"task":"deny"}`).
- One deviation: the rendered `model` (an Anthropic alias) was swapped for `opencode/big-pickle`,
  because no provider is authenticated on this machine. The probe tests tool exposure and
  permissions, which do not depend on the model.
- Control: the same prompt shape without `--agent`.

## Result

| Check | Evidence | Verdict |
|---|---|---|
| MCP tool listed and callable by the agent | the JSON event stream holds a completed call `tools.probe.probe_ping()` with output `pong-7731` | pass |
| the agent's tool inventory | it listed `edit glob grep question read shell skill webfetch websearch write execute` plus the MCP tool, and named no task or subagent tool | pass |
| `task` denied | the control session lists a `subagent` tool; the `implementer` session does not | pass |

Not run: the reviewer's `permission.edit: "deny"` (the installer test covers the rendered text; the
`edit` permission is an existing, previously verified mapping). The `tools` map is a no-op switch on
opencode (gap G-6), which is what makes the MCP tool visible.

Status: run by the implementer subagent, not by hand in an interactive session; the lead decides
whether that closes 3.4. Raw output was in the scratchpad (`probe/out.json`, `probe/control.json`), not committed.
