# Inventory, lps-desktop, 2026-11

What this machine has installed against what the fortnight used. Produced with `§Inventory` of
`skills/session-retrospective/references/langfuse-report.md`. Names and counts only. **Nothing has
been disabled**: the lists below wait for the owner.

## Method

- **Window**: 2026-11-08 to 2026-11-22 (the baseline window of the EPIC).
- **Installed**: `claude plugin list`; `SKILL.md` files counted under each plugin's install path in
  `installed_plugins.json`, under `~/.claude/plugins/synced/*/*/` and under `~/.claude/skills/`;
  MCP servers from `~/.claude.json` (`mcpServers`). `~/.claude/settings.json` holds no `mcpServers`.
- **Used**: the `skill:` and `subagent-skill:` tags of the window and the tool names called, as
  supplied to this run from the Langfuse queries. This run had no Langfuse access, so that list is
  the evidence; the tool list was the *top* of the calls, so the absence of a server there is weak
  evidence and such a server is placed **undecided**, not **unused**.
- **Sorting**: used = a tag or a tool call names it; unused = none does and no skill or agent of this
  repository depends on it; undecided = it may run without a tag (hook, slash command, scheduled
  run, role not worked this fortnight).

## Plugins

30 plugins are active: 22 from the CLI (user scope, all enabled) and 8 synced from claude.ai.
Eight more synced copies are not loaded, because the CLI plugin of the same name wins.

| Plugin | Source | Skills | Used | Evidence |
|---|---|---|---|---|
| meaningfy-core | skillery 3.21.0 | 12 | yes | 9 skills tagged |
| meaningfy-building | skillery | 12 | yes | 10 tagged |
| meaningfy-architecture | skillery | 5 | yes | 3 tagged |
| meaningfy-legal | skillery | 1 | yes | `contract-practice` |
| meaningfy-devops | skillery | 4 | yes | `service-reliability` |
| superpowers 7.0.2 | official | 15 | yes | 4 tagged |
| ponytail 4.7.0 | ponytail | 10 | yes | 2 tagged |
| atlassian | official | 12 | yes | Atlassian tool calls, no skill tag |
| langfuse-observability | synced | 0 | yes | the hook that wrote the traces |
| design | synced | 7 | yes | Figma tool call, no skill tag |
| meaningfy-consulting, -sales, vault-assistant | skillery | 3, 7, 9 | no | role not worked (undecided) |
| meaningfy-navigator 3.21.0 | skillery | 0 | no tag possible | status line and hooks (undecided) |
| obsidian 1.0.1 | obsidian-skills | 6 | no | vault work (undecided) |
| feature-dev, code-review, commit-commands | official | 0 | no tag | slash commands (undecided) |
| security-guidance | official | 0 | no tag | hook only (undecided) |
| skill-creator | official | 1 | no | skill authoring, may recur (undecided) |
| legal (synced) | claude.ai | 9 | no | legal role (undecided) |
| mongodb | official | 14 | no | no skill, no tool call |
| context7 | official | 0 | no | MCP only; needs authorisation, no call |
| claude-md-management, frontend-design | official | 1, 1 | no | none |
| data, product-management, cowork-plugin-management, miro, pdf-viewer | synced | 10, 8, 2, 3, 1 | no | none |

Skills in active plugins: 113 from the CLI plugins, 40 from the loaded synced ones (11 in the four
the CLI lists, 29 in four it does not list), and 58 more in the shadowed synced copies, which cost
nothing while shadowed.

## MCP servers

| Server | Scope | Called in window |
|---|---|---|
| gitnexus, serena, langfuse | user | yes |
| ast-grep | user | not in the top calls (undecided: repository rules name it) |
| memory, n8n-mcp, overleaf | user | not in the top calls (undecided) |
| neo4j-remote-* (7 servers: default, budget, LUXSE, db-mrv, itsecops, cargo, cscdemo) | user | not in the top calls (undecided: per client) |
| pycharm | user | no; fails to connect (ECONNREFUSED) |
| atlassian, figma | plugin | yes |
| context7, mongodb | plugin | no |

15 servers sit in the user config. `odoo`, `novamira-meaningfy-lu` and the claude.ai Google Sheets
connector were called but are not in the user config (project scope or a connector; not checked).
claude.ai connectors: not inventoried locally.

## User-level skills

`~/.claude/skills/` holds 35 skill folders (45 `SKILL.md` files counting nested ones), 3 broken
symlinks (`odoo-mcp-cli`, `odoo-mcp-tools`, `odoo-module-deps`: the pipx environment they point to
is gone) and the claude.ai `synced/` folder. Loaded in the window: `cosmic-python` (a user-level
copy) and `openspec-archive-change`. Four of the 35 duplicate bundle skills
(`architecture`, `cosmic-python`, `executive-communication`, `semantic-consulting-coach`).

## Lists

Counts are skills, over 188 distinct ones (113 + 40 + 35).

- **Used (32)**: core 9, building 10, architecture 3, legal 1, devops 1, superpowers 4, ponytail 2,
  user-level 2. External tags with no local file (`opsx:*`, `openspec-update-change`,
  `plugin-authoring`, `update-config`, `claude-in-chrome`, `claude-api`, `langfuse`) are project
  commands or built in.
- **Unused (52)**: mongodb 14, claude-md-management 1, frontend-design 1, data 10,
  product-management 8, cowork-plugin-management 2, miro 3, pdf-viewer 1, and 12 user-level skills
  (the ten context-engineering skills `advanced-evaluation`, `context-*`, `evaluation`,
  `memory-systems`, `multi-agent-patterns`, `project-development`, `tool-design`, plus `officecli`
  and `pomodoro`). Servers: pycharm, context7.
- **Undecided (104)**: core 3 (`rule-steward` runs weekly), building 2 (`session-retrospective`
  works this EPIC untagged), architecture 2, consulting 3, devops 3, sales 7, vault-assistant 9,
  superpowers 11, ponytail 8, atlassian 12, obsidian 6, skill-creator 1, design 7, legal (synced) 9,
  and 21 user-level (13 `gitnexus-*` guides for a server in use, 4 `openspec-*`, 3 bundle
  duplicates, `stream-coding`). Roles that did not work this fortnight: sales, legal, devops,
  vault, consulting.

## Proposed disable list

Awaiting the owner's approval, nothing disabled. Each line is reversible.

```bash
claude plugin disable mongodb@claude-plugins-official
claude plugin disable context7@claude-plugins-official
claude plugin disable claude-md-management@claude-plugins-official
claude plugin disable frontend-design@claude-plugins-official
claude mcp remove pycharm -s user
```

Synced plugins (data, product-management, cowork-plugin-management, miro, pdf-viewer) are turned
off in the claude.ai plugin settings, not by the CLI. The ten context-engineering skills, `officecli`
and `pomodoro` are removed by deleting the folder under `~/.claude/skills/`. The three broken odoo
symlinks are removed with `rm` or the pipx environment is restored. Record on this page what was
disabled and when.

## Second machine

Repeat `§Inventory` on the other machine with the same window and write its own page,
`inventory-<host>-2026-11.md`; do not edit this one. Compare only the lists, not the counts, since
plugins and synced folders differ per machine.
