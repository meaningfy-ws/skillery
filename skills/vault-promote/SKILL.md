---
name: vault-promote
description: Promote a staged note out of `00 Inbox/proposed/` in a Meaningfy Obsidian vault into a project folder or `03 Resources/`: after checking it carries `kind` and every property its kind requires, and moving it with the Obsidian CLI so every wikilink follows. Refuses and names the missing field when a check fails; never sets the share switch. Invoke explicitly: "promote <note>", "accept this proposed note", "move this from proposed into <project>". Reorganising many notes is vault-tidy.
license: Apache 2.0
argument-hint: "<note> [destination]"
disable-model-invocation: true
metadata:
  category: vault
---

# Vault Promote

## Overview

Staging (`00 Inbox/proposed/`) holds claims an agent made without being asked. Promotion is the
owner accepting one: the note is checked at the boundary, once, and moved to where lasting notes live.
Moving it into `01 Projects/` or `03 Resources/` makes it *eligible* for the company memory; only the
owner makes it *shared*, by setting `memory: common` later.

## Procedure

1. **Find the note** in `00 Inbox/proposed/`. Several or no matches: list and ask.
2. **Check it** against [`vault-conventions`](../vault-conventions/SKILL.md) (`references/kinds.md`):
   - `kind` is present;
   - every property that kind requires is present and non-empty (a property allowed to be empty, such
     as `project` on a meeting with no project, counts as present).

   Any failure: **move nothing**. Name each missing field ("missing: `kind`" or "missing for
   `assessment`: `verdict`"), and offer to add it with the value the owner gives. An unlisted kind is
   not a failure; say it is unlisted and suggest a `skill-change` note.
3. **Choose the destination** with the owner: a project folder in `01 Projects/`, or `03 Resources/`
   (other folders per the kind's usual folder in `kinds.md`). When the owner's request already names
   the destination (and any new name) and it resolves to exactly one folder, that request is the yes;
   otherwise show the full target path and wait for a yes. A new name is part of the same yes.
4. **Move with the Obsidian CLI** (the `obsidian-cli` skill of the external `obsidian@obsidian-skills`
   plugin): its `move` and `rename` update every wikilink to the note. First check the CLI answers; if
   it does not, stop and say Obsidian must be running. **Never move with file tools** (`mv`, write then
   delete): links break silently, and rewriting them by hand turns name links into path links.
5. **Report** the new location and the wikilinks the CLI updated. Remind the owner that sharing is
   theirs: "to share it with the company, set `memory: common` on it".

## Guards

- Never set `memory`, never remove `private: true`, never add a property the owner did not supply.
- Never promote more than the note asked for; neighbouring notes in staging stay.

## Boundary & Related Skills

**Owns:** the promotion check at the staging boundary and the promotion move.

**Delegates:** kinds and required properties → [`vault-conventions`](../vault-conventions/SKILL.md);
the move itself → the external `obsidian-cli` skill; reorganising many notes →
[`vault-tidy`](../vault-tidy/SKILL.md).

**Related:** `vault-conventions`, `vault-tidy`, `vault-capture`, `vault-planning`.
