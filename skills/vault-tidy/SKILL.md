---
name: vault-tidy
description: Tidy a Meaningfy Obsidian vault on the owner's request: survey it, present a written plan of every move, merge and rename (and every wikilink each affects), and apply the plan only after an explicit yes, moving with the Obsidian CLI so links follow. Invoke explicitly: "tidy my vault", "clean up the inbox", "reorganise these notes", "merge these duplicate notes". Never runs on an agent's own initiative. Promoting one staged note is vault-promote.
license: Apache 2.0
argument-hint: "[scope, e.g. 00 Inbox or a project]"
disable-model-invocation: true
metadata:
  category: vault
---

# Vault Tidy

## Overview

No agent reorganises a vault on its own: moves break links, merges lose history, and a move can take a
note out of the company memory. Tidying is therefore a skill the owner invokes, in two steps that never
blur: **a plan**, then, after a yes, **the change**.

## 1. Survey and plan (writes nothing)

Survey the scope the owner names (the whole vault if none), against
[`vault-conventions`](../vault-conventions/SKILL.md). Look for: notes in the wrong folder for their
kind, notes without `kind`, staging items older than two weeks, duplicate or near-duplicate notes,
names that break the conventions, and links that resolve to nothing.

Present the plan as one numbered table, and nothing else happens yet:

| # | Action | From | To / result | Links affected | Memory effect |
|---|---|---|---|---|---|
| 1 | move | `00 Inbox/x.md` | `03 Resources/x.md` | 2 notes | becomes eligible |
| 2 | merge | `a.md` + `b.md` | `a.md` keeps both bodies | 3 notes | none |
| 3 | rename | `Old.md` | `New.md` | 5 notes | leaves memory until re-ingested |
| 4 | set property | `note.md` | `kind: reference`, `source_url: <owner's value>` | none | none |

A **set property** row adds a missing `kind` or required property, with a value the owner supplies or
confirms in the plan; it never touches `memory` or `private`.

- **Memory effect** is mandatory for every row touching `01 Projects/` or `03 Resources/`: a move out, or
  a rename, of a shared note (`memory: common`) takes it out of the company memory at the next run.
- A **merge** keeps all content of every merged note in the surviving one, under a heading per source;
  nothing is summarised away.
- Findings that need the owner's judgement (are two projects the same? is this note still wanted?) go
  under the table as questions, not as actions.
- Deletions are never planned; a note the owner wants gone is moved to `06 Archive/`.

## 2. Wait for the yes

Apply only after an explicit yes to this plan in this session: "yes", "go", "apply 1 and 3". Silence,
"looks reasonable", or a question is not a yes. A partial yes applies only the rows named. A no, or any
change request, means **nothing moves**; revise and present the plan again.

## 3. Apply

- Moves and renames go through the Obsidian CLI (the `obsidian-cli` skill of the external
  `obsidian@obsidian-skills` plugin), which updates every wikilink. Check the CLI answers before the
  first row; if it does not, stop before changing anything. **Never** use file tools for a move.
- Merges: write the surviving note, then move the absorbed note to `06 Archive/` with the CLI, so links
  to it still resolve.
- If a row fails, **stop there**: report the rows applied, the failing row and its reason, and the rows
  not applied. Never finish a failed row with file tools.
- After the last row, report what was done row by row.

## Red flags: stop and return to the plan

- "The owner seemed to agree." Only an explicit yes counts.
- "It's only one small move, no need to list it." Every change is a row.
- "The CLI isn't running, `mv` is equivalent." It is not: links break.
- "These two notes say the same thing, I'll keep the better one." Merges keep everything.

## Boundary & Related Skills

**Owns:** the tidy survey, the plan format, the yes rule, and applying an approved plan.

**Delegates:** what "tidy" means (folders, kinds, names) → [`vault-conventions`](../vault-conventions/SKILL.md);
moves and renames → the external `obsidian-cli` skill; a single staged note →
[`vault-promote`](../vault-promote/SKILL.md); closing a project → [`vault-project`](../vault-project/SKILL.md).

**Related:** `vault-conventions`, `vault-promote`, `vault-project`.
