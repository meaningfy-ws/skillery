# Setup — Claude Code

Install the skillery catalogue on Claude Code, one step at a time. Follow every step in order —
you do **not** need the opencode page. Each step is one command or one link; run it, then move on.
The source→CLI contract behind these steps is in [`mapping.md`](mapping.md).

## Step 1 — Check your prerequisites

- [Claude Code](https://docs.claude.com/claude-code) (CLI, desktop, or IDE) installed.
- Node ≥ 18, for OpenSpec (Step 4c):
  ```bash
  node -v
  ```
- **Windows only:** each bundle is a folder of symlinks, so git must check symlinks out as links.
  Enable Developer Mode, then:
  ```bash
  git config --global core.symlinks true
  ```
  If you added the skillery marketplace before enabling `core.symlinks`, remove and re-add it
  (`/plugin marketplace remove meaningfy-skillery`, then Step 2) — an update keeps the links as text
  files.

## Step 2 — Add the skillery marketplace

```bash
/plugin marketplace add meaningfy-ws/skillery#dist
```

## Step 3 — Install the bundle(s) for your role

Pick your role(s) from the table, then run the matching install command(s). Everyone installs
`meaningfy-core`; add the rest only if that role is yours.

| Bundle | Install if you… |
|---|---|
| `meaningfy-core` | …do anything (cross-cutting basics) — **always install this one** |
| `meaningfy-building` | …build software with the spine |
| `meaningfy-architecture` | …design systems or model a domain |
| `meaningfy-consulting` | …do advisory work |
| `meaningfy-sales` | …write proposals and offers, or estimate work (requires `meaningfy-consulting`; `/plugin install meaningfy-sales@meaningfy-skillery`). `proposal-writing` and `estimation` moved here from `meaningfy-consulting` |
| `vault-assistant` | …keep a personal Obsidian vault (workflow bundle; see [`../vault-assistant.md`](../vault-assistant.md) for its prerequisites) |

```bash
/plugin install meaningfy-core@meaningfy-skillery
/plugin install meaningfy-building@meaningfy-skillery   # repeat with the other bundles you need
```

## Step 4 — Install the mandatory external dependencies

These are referenced by skillery's skills but are separate installs. Pinned versions and the
full optional-dependency list live in
[`setup.md`](../setup.md#2-external-dependencies) — this step only covers
what's mandatory.

**4a. superpowers** — TDD, systematic debugging, verification-before-completion, brainstorming.
```bash
/plugin install superpowers@claude-plugins-official
```

**4b. ponytail** — YAGNI / minimal-code discipline. Upstream: https://github.com/DietrichGebert/ponytail
```bash
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

**4c. OpenSpec** — the spine engine (`/opsx:*` commands). Upstream: https://github.com/Fission-AI/OpenSpec.
Pinned version: [`../../../spine/openspec-version.txt`](../../../spine/openspec-version.txt).
```bash
npm i -g @fission-ai/openspec
```

**4d. stream-coding** — the documentation-first build method. Upstream:
https://github.com/frmoretto/stream-coding (a single `SKILL.md`, not a plugin package):
```bash
git clone https://github.com/frmoretto/stream-coding /tmp/stream-coding
mkdir -p ~/.claude/skills/stream-coding
cp /tmp/stream-coding/SKILL.md ~/.claude/skills/stream-coding/SKILL.md   # adjust the source path if the repo's layout differs
```

## Step 5 — Confirm the root binding

Nothing to install — both files already ship in the repo you're working in. Just confirm:
- `CLAUDE.md` exists and points to `AGENTS.md` (the canonical, CLI-agnostic operating manual).
- `AGENTS.md` exists alongside it.

## Step 6 — Register the spine commands

Run this once per repo that uses the spine:
```bash
openspec update --tools claude    # registers /opsx:propose, /opsx:apply, …
```

## Step 7 — Project the `meaningfy` schema into a repo

Step 6 only registers the `/opsx:*` *commands* — skillery's forked `meaningfy` OpenSpec schema is a
**separate action**: in the target repo, ask Claude Code to run the **`project-setup`** skill (e.g.
*"project the spine / set up openspec here"*); it is a conversational skill invocation, not a shell
command. What gets projected and how to refresh the pinned copy:
[`../../../skills/project-setup/references/spine-projection.md`](../../../skills/project-setup/references/spine-projection.md).

## Step 8 — Optional: hooks, MCP servers, extra plugins

- **Hooks** — written for you by `project-setup` when you scaffold a repo. Reference:
  [`../../../hooks/README.md`](../../../hooks/README.md).
- **MCP servers** (GitNexus, Atlassian, Google Workspace, Odoo, Neo4j, MongoDB, context7, …) —
  install one by one, per-tool packages/links and config templates in
  [`mcp-setup.md`](mcp-setup.md).
- **Optional plugins** (`commit-commands`, `code-review`) — see the table in
  [`setup.md`](../setup.md#2-external-dependencies).

## Step 9 — Verify

Run:
```bash
/plugin
```
Confirm `meaningfy-core` (and any other bundle you installed in Step 3) shows as **enabled**, and
that each bundle loads exactly its own skills and agents (skills / agents): `meaningfy-core` 6 / 0,
`meaningfy-consulting` 3 / 0, `meaningfy-sales` 2 / 1, `meaningfy-architecture` 4 / 2, `meaningfy-building` 9 / 3,
`vault-assistant` 9 / 0 (`claude plugin details <bundle>` lists them). Then
confirm the spine registered by running `/opsx:propose` — it should prompt you for a change
description rather than say the command is unknown.

**Testing a branch** (maintainers): a feature branch carries no `bundles/` (it is generated), so it
cannot be installed as it is. `#dist` moves only at releases. To test unreleased work, push a throwaway branch with the
generated tree added (`make bundles && git add -f bundles`) and install that
(`/plugin marketplace add meaningfy-ws/skillery#<branch>`); never install from a local path — a
local-path marketplace does not load the bundles' agents.

There are no recorded Claude-side capability gaps; if you're curious what differs on opencode, see
[`compatibility.md`](compatibility.md).
