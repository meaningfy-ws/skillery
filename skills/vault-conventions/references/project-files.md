# Standing files

The files whose shape every `vault-*` skill relies on. Their frontmatter follows
[`kinds.md`](kinds.md); the bodies below are the fixed sections. Add prose inside a section freely;
never rename or drop a section.

## A project's five files (`01 Projects/YYYY-MM-DD Name/`)

### `index.md`, the charter

Frontmatter: `kind: project`, `status`, `created`, `jira_key`, `drive_team_folder`,
`drive_admin_folder`, and optionally `people` (wikilinks).

```markdown
# <Name>
## What is this?        one sentence
## Why does it matter?
## What does done look like?   something a third person could check
## Which objective does it advance?   a wikilink or quote from Objectives YYYY.md
## What would make me stop?
## Current status       one line, kept current
```

### `sessions.md`, append-only

The file the next session reads first. One entry per working session, newest last, never edited
afterwards (a correction is a new entry). Split by year into `sessions YYYY.md` when it passes about
50 KB.

```markdown
## YYYY-MM-DD: <what the session was about>
- Done: …
- Decided: … (also in decisions.md)
- Open: … (undecided points, with who or what they wait on)
- Next: …
```

### `decisions.md`

One table, newest last. A decision is a row only when it was actually taken; an option that was
rejected in the same breath gets its own row ("Rejected: Y").

```markdown
| Date | Decision | Rationale | Made by |
|---|---|---|---|
```

### `tasks.md`

```markdown
## Urgent
## In progress
## Waiting        each item names who or what it waits on
## Done           ticked items move here with their date
```

### `resources.md`

Indexes the project's files, which live in `vault-files/<project folder>/`.

```markdown
## Provided       brought in by the owner or others
| File | What it is | Added | Link |
## Generated      produced in the project
| File | What it is | Added | Link |
```

`Link` is the file's web URL, or `ASK OWNER` until the owner supplies it.

## `05 To Do/To-Do.md`, the master list

```markdown
## Urgent
## In progress
## Waiting
## Waiting on replies     one item per question the owner asked in sent mail
## Meeting prep
```

Each item is one line ending in a link: `- [ ] <what> *(YYYY-MM-DD)* [link](<url or [[note]]>)`. The
story behind an item goes to its project's `sessions.md` (through `vault-capture`), not here.

## `05 To Do/Objectives YYYY.md`, the plans

```markdown
## Year                objectives for the year
## Q1 … Q4             per quarter: objectives, each with measurable key results,
                       each citing the yearly objective it serves
## <Month YYYY>        one section per month: objectives citing their key result
## Week YYYY-Www       one section per week: outcomes citing what they advance,
                       or marked "unplanned"
## Change log          append-only: - YYYY-MM-DD <what changed>: <why>
```

A new month or week section goes above the previous one; past sections stay. A past objective is never
deleted: it is marked `done`, `dropped` or `carried over` in place, and the change log records when and
why. How many objectives and key results to set is `vault-planning`'s method.

## `04 Daily/reviews/<period>.md`, the review record

```markdown
## Wins
## Misses         what slipped, and why in one line each
## Carried over
## Next focus     what the next period should protect
```
