# Final check

Run every line; report each as **present** or **missing**, and for each missing item the skills that
stay unavailable until it is fixed. Never mark an item present without looking.

| # | Check | How | Missing blocks |
|---|---|---|---|
| 1 | Layout | every folder of the `vault-conventions` layout exists, plus `vault-files/_shared/` | all skills |
| 2 | Templates | one file per kind of `vault-conventions` `references/kinds.md` in `X/Templates/` | consistent notes |
| 3 | Owner profile | `AGENTS.md` has mail connector, calendar connector, time zone | `vault-daily` |
| 4 | Write rules | `AGENTS.md` has the hard rules and the pointer to `vault-conventions` | safe writes |
| 5a | Folder trusted (Claude Code) | an interactive `claude` at the vault root shows no trust prompt | the allow rules, and so the scheduled run |
| 5 | Permission settings | the CLI's file from `permissions-*.md` exists at the vault root; the CLI's permission list shows every deny (never test with a real send) | safe `vault-daily` |
| 6 | Obsidian | installed, version 1.12.7 or later | the moving skills |
| 7 | Obsidian CLI | with Obsidian running, `obsidian version` answers | `vault-promote`, `vault-tidy`, `vault-project close` |
| 8 | Link updating | Obsidian setting "Automatically update internal links" is on | link-safe moves |
| 9 | obsidian-skills | the plugin is installed for the user and absent from the vault | syntax and CLI guidance |
| 10 | Sync | the vault syncs; `.obsidian/workspace*.json` is ignored (Insync) | multi-machine use |
| 11 | Company memory | the MCP server is configured at user scope and connected; no MCP file in the vault | recalls in `vault-resume`, `vault-daily` |
| 12 | Connectors | mail and calendar connectors connected | `vault-daily` |
| 13 | No skills in the vault | no `SKILL.md` anywhere under `vault/` | the single-copy rule |
| 14 | Ingestion (optional) | the pipeline entry exists; only the three in-scope folders are shared | sharing with the company |
| 15 | Scheduled run (optional) | the entry exists and one manual run wrote a note | the morning note arriving by itself |

End with the list of missing items in the order the owner should fix them: 3 and 5 first, then 6 to 9,
then 11 and 12.
