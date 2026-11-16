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

## Step 2 — Add the skillery marketplace

```bash
/plugin marketplace add meaningfy-ws/skillery#releases
```

Keep the `#releases`: it is the only branch that holds released bundles. Without it the marketplace
tracks `develop`, which has no bundles and unreleased work. To pin one release, use `#vX.Y.Z`
(releases after 3.3.0). See [`releasing.md`](../../development/releasing.md).

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
Pinned version: [`openspec/openspec-version.txt`](../../../openspec/openspec-version.txt).
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

## External skills of your bundles (per role)

These skills come from Meaningfy's forks of public skill sources. Install only the rows of the bundles you installed in Step 3 and the bundles they require (for example `meaningfy-building` brings `meaningfy-architecture`). Until the `skill-orchestration` skill ships, these skills inform reasoning only, and the Meaningfy skill of the same area wins on any conflict: `cosmic-python` for the book sets, `sales-conversations` and `sales-qualification` for the wondel sales skills. Each command pins the commit Meaningfy read and turns the installer's telemetry off with `DO_NOT_TRACK=1`; that is POSIX-shell syntax, so in PowerShell set the variable first. If you use both Claude Code and opencode, run only the claude-code command, because both CLIs read the folder it installs to.

<!-- GENERATED:dependencies:external-skills-claude -->
| Bundle | Skills | Install |
|---|---|---|
| meaningfy-building | refactoring, working-effectively-with-legacy-code, a-philosophy-of-software-design, clean-architecture | `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/agent-rules-books#893a88a6fce3a80c565bf39ac65021b43a8b2990 --skill refactoring working-effectively-with-legacy-code a-philosophy-of-software-design clean-architecture --agent claude-code --global --yes` |
| meaningfy-architecture | domain-driven-design, designing-data-intensive-applications, patterns-of-enterprise-application-architecture, release-it | `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/agent-rules-books#893a88a6fce3a80c565bf39ac65021b43a8b2990 --skill domain-driven-design designing-data-intensive-applications patterns-of-enterprise-application-architecture release-it --agent claude-code --global --yes` |
| meaningfy-sales | negotiation, hundred-million-offers, mom-test, obviously-awesome, jobs-to-be-done, influence-psychology, predictable-revenue, monetizing-innovation, storybrand-messaging, one-page-marketing, made-to-stick, crossing-the-chasm, scorecard-marketing | `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/wondel-ai-skills#c5265583b1a9740f06831e1d3e89b35bba3eb430 --skill negotiation hundred-million-offers mom-test obviously-awesome jobs-to-be-done influence-psychology predictable-revenue monetizing-innovation storybrand-messaging one-page-marketing made-to-stick crossing-the-chasm scorecard-marketing --agent claude-code --global --yes` |
| meaningfy-consulting | good-strategy-bad-strategy, high-output-management | `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/wondel-ai-skills#c5265583b1a9740f06831e1d3e89b35bba3eb430 --skill good-strategy-bad-strategy high-output-management --agent claude-code --global --yes` |
| meaningfy-core | technical-documentation | `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/wondel-ai-skills#c5265583b1a9740f06831e1d3e89b35bba3eb430 --skill technical-documentation --agent claude-code --global --yes` |
<!-- /GENERATED -->

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
  [`../../../hooks/README.md`](../../development/hooks.md).
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

**Testing a branch** (maintainers): every branch carries the committed `bundles/` tree, so
`#releases` moves only at releases ([`releasing.md`](../../development/releasing.md)). To test unreleased work, push a throwaway branch (after
`make bundles`) and install that
(`/plugin marketplace add meaningfy-ws/skillery#<branch>`); never install from a local path — a
local-path marketplace does not load the bundles' agents.

There are no recorded Claude-side capability gaps; if you're curious what differs on opencode, see
[`compatibility.md`](compatibility.md).
