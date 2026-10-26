# <owner>'s vault

The page to read first. Agents read [[AGENTS]]; people start here.

## Where the rules live

| What | Where |
|---|---|
| The rules every agent follows in this vault | `AGENTS.md` at the vault root |
| Meaningfy's note conventions: folders, kinds, properties, links | the `vault-conventions` skill (plugin `vault-assistant`) |
| How to use the vault skills day to day | the `vault-assistant` guide in the skillery docs |
| Setting up or checking this vault | the `vault-setup` skill |
| Obsidian's own syntax and CLI | the `obsidian@obsidian-skills` plugin |

## Folders

Copied from `vault-conventions`. **The skill wins**: when this table and the skill differ, the skill is
right, and `vault-setup`'s check reports the difference.

| Folder | Holds |
|---|---|
| `00 Inbox/` | raw captures; `proposed/` holds claims nobody asked for (Staging) |
| `01 Projects/YYYY-MM-DD Name/` | one folder per company project (Project homes) |
| `02 Ideas/` | ideas that are not yet projects |
| `03 Resources/` | lasting notes: assessments, memos, explainers, references |
| `04 Daily/` | daily notes (`YYYY-MM-DD.md`), `reviews/` (period reviews), and `<agent>/` run notes of deployed agents |
| `05 To Do/` | the master list `To-Do.md` and the plans `Objectives YYYY.md` |
| `06 Archive/` | closed projects and retired notes, moved there only by a person or after a person's yes |
| `07 Perso/` | personal notes, and personal projects (Project homes); never shared |
| `08 How to/` | how-to notes for the owner's own routines |
| `X/Templates/` | one template per kind |

## This machine

| Fact | Value |
|---|---|
| Vault path | <fill in> |
| Binaries folder (`vault-files/`) | <fill in> |
| Sync client | <Insync / OneDrive> |
| Scheduled daily run | <time, or none> |

## Changing the rules

A rule that does not fit is proposed as a `kind: skill-change` note in `00 Inbox/proposed/`; the
skill changes through a skillery pull request, never by editing it here.
