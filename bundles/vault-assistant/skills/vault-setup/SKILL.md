---
name: vault-setup
description: "Bootstrap or complete a Meaningfy personal Obsidian vault and its tooling, the way project-setup does for a repository: create the vault layout and its `vault-files/` sibling, the templates for every kind, the vault's agent instructions (`AGENTS.md` with the owner profile and write rules) and the per-CLI permission settings; then guide, per operating system (Windows or Linux), installing Obsidian with its CLI, the external obsidian-skills plugin, sync through Google Drive (Insync) or OneDrive, the company memory's MCP server, mail and calendar connectors, the optional ingestion opt-in and a scheduled daily run; end with a check of every prerequisite. Invoke explicitly: \"set up my vault\", \"bootstrap a vault\", \"vault setup\", \"check my vault setup\"."
license: Apache 2.0
argument-hint: "[owner folder]"
disable-model-invocation: true
metadata:
  purpose: knowledge
  area: personal
  subject: obsidian
  posture: precise
  stage: any
  maturity: stable
---

# Vault Setup

The other `vault-*` skills assume a vault of a known shape, with an owner profile, permission settings
and a few tools in place; this skill makes that true, once per person, and checks it again whenever
asked. It **creates** what lives in the vault and **guides** what lives on the machine or in an
account: installing software and authorising accounts are the person's to do.

## Quick Start

Ana, on Linux with Claude Code, says "set up my vault" from `obsidian/ana/`. She answers: Gmail,
Google Calendar, `Europe/Luxembourg`, Insync, no ingestion yet, daily note at 07:30 on working days.

- Created: the `vault-conventions` layout with `.trash/` and `vault-files/_shared/`, one template per
  kind in `X/Templates/`, `05 To Do/To-Do.md`, `AGENTS.md` with her profile, `README.md`, and
  Claude Code's `CLAUDE.md` and permission settings.
- Guided, one step at a time: Obsidian and its CLI, the obsidian-skills plugin for the user, Insync
  with its ignore rules, the memory server at user scope, the two connectors, a cron entry.
- Reported: every check present but 7 (Obsidian CLI) and 14 (ingestion, not chosen); nothing is
  blocked, the moving skills use a checked file move until the CLI answers.

## Workflow

1. **Locate.** Run from the owner folder, `obsidian/<person>/`, **not from inside the vault**: once
   the permission settings exist, a session at the vault root may not edit them. If the working
   folder holds the vault's `AGENTS.md`, stop and say: "Run vault-setup from obsidian/<person>/."
   Confirm that `vault/` and `vault-files/` are, or will be, its children; detect the operating
   system and the CLI in use.
2. **Interview** (one question at a time): the person's name for the folder; mail connector (Gmail or
   Outlook); calendar connector; time zone; sync client (Insync for Google Drive, or OneDrive); whether
   to opt in to the ingestion pipeline now; whether to schedule the daily note, and at what time.
3. **Create the vault files** (skip what exists):
   - the layout from `vault-conventions`, including `00 Inbox/proposed/`, `04 Daily/reviews/`,
     `X/Templates/` and the trash folder `.trash/`, and `vault-files/_shared/`;
   - one template per kind, copied from [`assets/templates/`](assets/templates/) into `X/Templates/`,
     and the folders `08 How to/Rules/` and `08 How to/Playbooks/` for the owner's rules;
   - `05 To Do/To-Do.md` from its template;
   - `AGENTS.md` from [`assets/AGENTS.md`](assets/AGENTS.md), with the profile filled in;
   - `README.md` from [`assets/README.md`](assets/README.md), the page a person reads first, with its
     blanks filled in. It never overwrites an existing `README.md`: compare and report the
     differences, and the owner decides.
4. **Write the permission settings** for the CLI in use, exactly as its reference says. Read
   [`references/permissions-claude-code.md`](references/permissions-claude-code.md) and
   [`references/permissions-opencode.md`](references/permissions-opencode.md) before writing the
   settings, only the one for the CLI in use: it gives the files to copy, what to adapt (the memory server's name, Outlook's tools), the stated gaps
   and how to verify the denies. opencode also gets `opencode.scheduled.json` when the daily run is
   scheduled. Tell the person any deny or ask the CLI cannot express. Then, per machine, add the
   rulebook script's allow rule to the person's user settings, as `rulebook` says; its path holds the
   home folder, so it never goes in the vault.
5. **Guide the machine and accounts**, skipping what is already in place:
   - Read [`references/obsidian.md`](references/obsidian.md) when installing Obsidian: it gives the
     install per operating system, the settings the skills rely on, the CLI registration and the
     obsidian-skills plugin.
   - Read [`references/sync.md`](references/sync.md) when setting up sync: it gives the Insync and
     OneDrive steps, the ignore rules and how to get a file's web link.
   - Read [`references/memory-and-connectors.md`](references/memory-and-connectors.md) when adding the
     company memory, the mail and calendar connectors or the ingestion opt-in: it gives the user-scope
     MCP setup, the connector names to record and the three folders that may be shared.
   - Read [`references/scheduler.md`](references/scheduler.md) if the owner wants the daily note
     scheduled: it gives the cron, Task Scheduler and opencode command lines that deny `mv` and `rm`.
6. **Check.** Read [`references/final-check.md`](references/final-check.md) once everything is set up,
   or when the person asks to check the vault: it holds every check, what each missing item blocks
   and the order to fix them.

## Rules

- **Never overwrite.** On an existing vault, report what is present, add only what is missing, and
  list every addition. A file that exists but differs from the template is left alone and reported.
- **Nothing private in skillery.** Host names, account names, folder IDs and personal paths come from
  the person or the company's private runbook, at run time; they are written only into the person's
  own vault and settings.
- **One step at a time** for everything the person does by hand: one action, then confirm, then next.

## Before you hand over

| Question | If not | Action |
|---|---|---|
| Was every line of the final check looked at, not assumed? | an item is reported present unseen | run that check, then report it |
| Does each missing item name the skills it blocks? | the owner cannot rank the fixes | add the blocked skills from the final check |
| Was every addition listed, and nothing overwritten? | the owner loses track of what changed | list the additions; restore any overwritten file |

## Boundary & Related Skills

**Owns:** creating and checking a vault's skeleton, its agent instructions and permission settings, the
kind templates, and the guided setup of Obsidian, sync, memory, connectors and the scheduled run.

**Delegates:** the layout, kinds and properties the templates follow →
`vault-conventions`; Obsidian's own syntax and CLI → the external
`obsidian@obsidian-skills` plugin; the ingestion pipeline itself → the company's infrastructure
repository and its private runbook; the rulebook script's per-machine allow rule → `rulebook`.

A vault is not a code repository: see also `project-setup` for scaffolding a software project.

**Related:** `vault-conventions`, `vault-daily`, `rulebook`.

Answers `VER` in `test-strategy`'s matrix (`references/generic-writing.md`).
