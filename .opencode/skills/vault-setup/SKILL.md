---
name: vault-setup
description: Bootstrap or complete a Meaningfy personal Obsidian vault and its tooling, the way project-setup does for a repository: create the vault layout and its `vault-files/` sibling, the templates for every kind, the vault's agent instructions (`AGENTS.md` with the owner profile and write rules) and the per-CLI permission settings; then guide, per operating system (Windows or Linux), installing Obsidian with its CLI, the external obsidian-skills plugin, sync through Google Drive (Insync) or OneDrive, the company memory's MCP server, mail and calendar connectors, the optional ingestion opt-in and a scheduled daily run; end with a check of every prerequisite. Invoke explicitly: "set up my vault", "bootstrap a vault", "vault setup", "check my vault setup".
license: Apache 2.0
argument-hint: "[owner folder]"
disable-model-invocation: true
metadata:
  category: vault
---

# Vault Setup

## Overview

The other `vault-*` skills assume a vault of a known shape, with an owner profile, permission settings
and a few tools in place. This skill makes that true, once per person, and checks it again whenever
asked. It **creates** what lives in the vault and **guides** what lives on the machine or in an
account, because installing software and authorising accounts are the person's to do.

Run it from the owner folder, `obsidian/<person>/`, **not from inside the vault**: once the permission
settings exist, a session at the vault root may not edit them. If the working folder holds the vault's
`AGENTS.md`, stop and say: "Run vault-setup from obsidian/<person>/."

## Rules

- **Never overwrite.** On an existing vault, report what is present, add only what is missing, and list
  every addition. A file that exists but differs from the template is left alone and reported.
- **Nothing private in skillery.** Host names, account names, folder IDs and personal paths come from
  the person or the company's private runbook, at run time; they are written only into the person's
  own vault and settings.
- **One step at a time** for everything the person does by hand: one action, then confirm, then next.

## Procedure

1. **Locate.** Confirm the owner folder and that `vault/` and `vault-files/` are, or will be, its
   children. Detect the operating system and the CLI in use.
2. **Interview** (one question at a time): the person's name for the folder; mail connector (Gmail or
   Outlook); calendar connector; time zone; sync client (Insync for Google Drive, or OneDrive); whether
   to opt in to the ingestion pipeline now; whether to schedule the daily note, and at what time.
3. **Create the vault files** (skip what exists):
   - the layout from [`vault-conventions`](../vault-conventions/SKILL.md), including
     `00 Inbox/proposed/`, `04 Daily/reviews/` and `X/Templates/`, and `vault-files/_shared/`;
   - one template per kind, copied from [`assets/templates/`](assets/templates/) into `X/Templates/`;
   - `05 To Do/To-Do.md` from its template;
   - `AGENTS.md` from [`assets/AGENTS.md`](assets/AGENTS.md), with the profile filled in.
4. **Write the permission settings** for the CLI in use, exactly as its reference says:
   [`references/permissions-claude-code.md`](references/permissions-claude-code.md) or
   [`references/permissions-opencode.md`](references/permissions-opencode.md). Tell the person any deny
   the CLI cannot express.
5. **Guide the machine and accounts**, each from its reference, skipping what is already in place:
   - Obsidian, its CLI and the obsidian-skills plugin →
     [`references/obsidian.md`](references/obsidian.md);
   - sync → [`references/sync.md`](references/sync.md);
   - the company memory, connectors and the ingestion opt-in →
     [`references/memory-and-connectors.md`](references/memory-and-connectors.md);
   - the scheduled daily run, if wanted → [`references/scheduler.md`](references/scheduler.md).
6. **Check.** Run the check in [`references/final-check.md`](references/final-check.md) and report each
   prerequisite as present or missing, and which skills stay unavailable until it is fixed.

## Boundary & Related Skills

**Owns:** creating and checking a vault's skeleton, its agent instructions and permission settings, the
kind templates, and the guided setup of Obsidian, sync, memory, connectors and the scheduled run.

**Delegates:** the layout, kinds and properties the templates follow →
[`vault-conventions`](../vault-conventions/SKILL.md); Obsidian's own syntax and CLI → the external
`obsidian@obsidian-skills` plugin; the ingestion pipeline itself → the company's infrastructure
repository and its private runbook; repository scaffolding → [`project-setup`](../project-setup/SKILL.md).

**Related:** `vault-conventions`, `vault-daily`, `project-setup`.
