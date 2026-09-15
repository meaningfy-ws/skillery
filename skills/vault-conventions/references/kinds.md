# Kinds

The starter list. Every note carries `kind`; the properties listed are **required** for that kind
(`vault-promote` checks them). Any other property is welcome. A new kind is proposed with a
`kind: skill-change` note in `00 Inbox/proposed/` (see the Staging section of `vault-conventions`).

Dates are `YYYY-MM-DD`. People, organisations and projects are wikilinks, which may point to nothing.
`project` is the project folder's name as a wikilink (`"[[2026-09-15 Security Audit]]"`); every
charter is named `index.md`, so never link `[[index]]`, which is ambiguous.

## Project files

| kind | Note | Required properties |
|---|---|---|
| `project` | `index.md`, the charter | `status`, `created`, `jira_key`, `drive_team_folder`, `drive_admin_folder` (the last three may be empty) |
| `sessions` | `sessions.md` | `project` |
| `decisions` | `decisions.md` | `project` |
| `tasks` | `tasks.md` | `project` |
| `resources` | `resources.md` | `project` |

## Working notes

| kind | Usual folder | Body is | Required properties |
|---|---|---|---|
| `meeting` | the project folder, or `00 Inbox/` | what was said, decided and left open | `date`, `attendees`, `project` (empty when none) |
| `memo` | `03 Resources/` | a position or update written for someone | `date`, `audience` |
| `assessment` | `03 Resources/` | a verdict on something, with its grounds | `date`, `subject`, `verdict` |
| `exploration` | `02 Ideas/` or `03 Resources/` | divergent thinking; may contradict itself | `date`, `about` |
| `idea` | `02 Ideas/` | a candidate project that failed or skipped the charter questions | `status`, `created` |
| `explainer` | `03 Resources/` | teaching prose | `about`, `audience` |
| `how-to` | `08 How to/` | the owner's own routine, as steps | `about` |
| `reference` | `03 Resources/` | a saved source (a web page, a paper) | `source_url` |

`audience` takes `self`, `team` or `client`.

## Rhythm notes

| kind | Note | Required properties |
|---|---|---|
| `daily` | `04 Daily/YYYY-MM-DD.md` | `date`, `private: true` |
| `review` | `04 Daily/reviews/<period>.md` | `period` (`YYYY-Www`, `YYYY-MM`, `YYYY-Qn` or `YYYY`), `horizon` (`week`, `month`, `quarter`, `year`) |
| `objectives` | `05 To Do/Objectives YYYY.md` | `year` |
| `todo` | `05 To Do/To-Do.md` | none |

## Staging

| kind | Note | Required properties |
|---|---|---|
| `skill-change` | `00 Inbox/proposed/` | `skill`, `date` |

A staged claim carries the kind it should have once promoted (for example `assessment`).
