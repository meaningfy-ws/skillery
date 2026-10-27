# Kinds

The starter list. Every note carries `kind`; the properties listed are **required** for that kind
(`vault-promote` checks them), and so are the sections listed under **Required sections**, as `##`
headings with that exact text (`—` when the body is free). Any other property or section is welcome. A new kind is proposed with a
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

| kind | Usual folder | Body is | Required properties | Required sections |
|---|---|---|---|---|
| `meeting` | the project's `artefacts/`, or `00 Inbox/` | what was said, decided and left open | `date`, `attendees`, `project` (empty when none) | — |
| `impact-filter` | the project's `artefacts/` | why a team project is worth doing, before it is shaped | `date`, `project` | Purpose, Importance, Best result, Worst result, Success criteria |
| `work-shape` | the project's `artefacts/` | the Shape Up shaping of team work (not an OpenSpec EPIC) | `date`, `project`, `appetite` | Boundaries, Gherkin features, Elements, Risks |
| `memo` | `03 Resources/` | a position or update written for someone | `date`, `audience` | — |
| `assessment` | `03 Resources/` | a verdict on something, with its grounds | `date`, `subject`, `verdict` | — |
| `exploration` | `02 Ideas/` or `03 Resources/` | divergent thinking; may contradict itself | `date`, `about` | — |
| `idea` | `02 Ideas/` | a candidate project that failed or skipped the charter questions | `status`, `created` | — |
| `explainer` | `03 Resources/` | teaching prose | `about`, `audience` | — |
| `how-to` | `08 How to/` | the owner's own routine, as steps | `about` | — |
| `reference` | `03 Resources/` | a saved source (a web page, a paper) | `source_url` | — |

`audience` takes `self`, `team` or `client`. `appetite` takes `TINY`, `SMALL`, `MEDIUM`,
`LARGE`, `VERY LARGE` or `HUGE` — how deep and extensive the work may be, as defined in
`epic-planning`; never a duration. A `work-shape`'s sections hold: Boundaries (raw idea,
appetite, narrow problem with its use cases and outcomes), Gherkin features, Elements (success criteria;
breadboards and fat-marker sketches optional), Risks (rabbit holes, no-gos).

## Rhythm notes

| kind | Note | Required properties |
|---|---|---|
| `daily` | `04 Daily/YYYY-MM-DD.md` | `date`, `private: true` |
| `review` | `04 Daily/reviews/<period>.md` | `period` (`YYYY-Www`, `YYYY-MM`, `YYYY-Qn` or `YYYY`), `horizon` (`week`, `month`, `quarter`, `year`) |
| `objectives` | `05 To Do/Objectives YYYY.md` | `year` |
| `todo` | `05 To Do/To-Do.md` | none |

## Staging

| kind | Note | Required properties | Required sections |
|---|---|---|---|
| `skill-change` | `00 Inbox/proposed/` | `skill`, `date` | Skill or agent, Kind, Where, Catalogue version, What you asked (the prompt, verbatim), What came out, What should have come out, Anything else |

A `skill-change` note's sections are the fields of the skillery's defect issue form, so it is filed as
an issue by copying field by field; a proposed change goes under *Anything else*.

A staged claim carries the kind it should have once promoted (for example `assessment`).
