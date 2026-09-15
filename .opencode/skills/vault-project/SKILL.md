---
name: vault-project
description: Start or close a project folder in a Meaningfy Obsidian vault. `new <name>` runs the charter gate (five questions, a done a third person could check) and creates `01 Projects/YYYY-MM-DD Name/` with its five standing files; `close <project>` writes the final session entry, sets status done or dropped, and moves the folder to `06 Archive/` only after the owner's yes. Use when the owner, working in their vault, says "create a project in my vault", "new vault project", "start a project folder in the vault", "close/finish/archive vault project X", "this vault project is done". Not for software EPICs or repository scaffolding (epic-planning, project-setup).
license: Apache 2.0
argument-hint: "new <name> | close <project>"
metadata:
  category: vault
---

# Vault Project

## Overview

A project folder is a promise to keep five files current. This skill opens that promise only when
the owner can say what done looks like, and closes it cleanly. Everything between (resuming, filing)
belongs to [`vault-resume`](../vault-resume/SKILL.md) and [`vault-capture`](../vault-capture/SKILL.md).

The file shapes, kinds and properties come from [`vault-conventions`](../vault-conventions/SKILL.md);
the vault's write rules come from its `AGENTS.md`.

## `new <name>`

1. **Check for an existing project.** List `01 Projects/`. If a folder already covers this work, show it
   and ask whether to use it instead; create nothing until the owner answers.
2. **Confirm the name.** Show the folder name you will create, `YYYY-MM-DD <Name>` with today's date and
   the owner's casing and spacing, and wait for a yes. No name given: ask for one; never invent it.
3. **Run the charter gate.** Ask the five questions one at a time, in the owner's words:
   1. What is this, in one sentence?
   2. Why does it matter?
   3. What does done look like?
   4. Which objective does it advance? (offer the objectives in `05 To Do/Objectives YYYY.md`; when
      there is none, record the owner's words as they are)
   5. What would make you stop?
4. **Test the done.** Done passes only if a third person could check it without asking the owner
   ("ten clients onboarded through the portal", "contract signed"). "Improve X", "make progress on Y" or
   "explore Z" fail. When it fails, ask once more with an example. If it still fails, **create no folder
   and no file**: offer a `kind: idea` note in `02 Ideas/` holding the answers so far, and write it
   only after a yes.
5. **Create the project.** Only now: the folder and its five standing files, shaped as in
   `vault-conventions` (`references/project-files.md`), with `index.md` holding all five answers and
   `status: active`, and a first `sessions.md` entry "Project created". Do not create
   `vault-files/<project folder>/`; it appears when the first file arrives.
6. **Report** the folder and files created, and suggest `vault-resume <name>` for the next session.

Never leave a charter answer as "TBD": a project with an unanswered charter question is an idea.

## `close <project>`

1. **Resolve the project.** Match the name against `01 Projects/`; with several matches or none, list
   what you found and ask. Read `index.md`, the last `sessions.md` entries and `tasks.md`.
2. **Ask how it ended.** `done` (the charter's done was met) or `dropped` (it was not), and one line
   on why. Name any open tasks and ask what happens to each (done, dropped, moved to another project or
   to `05 To Do/To-Do.md`).
3. **Write the ending.** Append a final dated `sessions.md` entry (outcome, why, what happened to open
   tasks); set `status` in `index.md`; update the charter's "Current status" line.
4. **Propose the archive move.** Say: "Move `01 Projects/<folder>` to `06 Archive/<folder>`?" and that
   any of its notes the owner shared (`memory: common`) **leave the company memory at the next
   ingestion run**, while its files in `vault-files/_shared/<project folder>/` stay shared until the
   owner moves them. Move only after an explicit yes.
5. **Move with the Obsidian CLI** (the `obsidian-cli` skill of `obsidian@obsidian-skills`), so every
   wikilink follows. If the CLI does not answer, do not move with file tools: say that Obsidian must be
   running and leave the folder where it is.

A no to the move is a complete close: the status and final entry stand, the folder stays.

## Guards

- Never create a folder other than the project's own; never create a project as a side effect of
  another request.
- Never set `memory` or remove `private: true`.
- Never archive, rename or delete without the owner's yes in this session.

## Boundary & Related Skills

**Owns:** the charter gate, creating a project folder, and closing and archiving a project.

**Delegates:** file shapes, kinds and properties → [`vault-conventions`](../vault-conventions/SKILL.md);
moves → the external `obsidian-cli` skill; starting and ending work sessions →
[`vault-resume`](../vault-resume/SKILL.md) and [`vault-capture`](../vault-capture/SKILL.md).

**Related:** `vault-conventions`, `vault-resume`, `vault-capture`, `vault-tidy`, `vault-planning`,
`epic-planning` (software EPICs, not vault projects).
