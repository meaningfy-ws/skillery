---
name: vault-promote
description: "Promote a staged note out of `00 Inbox/proposed/` in a Meaningfy Obsidian vault into a project's `artefacts/` or `03 Resources/`: after checking it carries `kind` and every property and section its kind requires, and moving it so every wikilink follows. Refuses and names the missing field when a check fails; never sets the share switch. Invoke explicitly: \"promote <note>\", \"accept this proposed note\", \"move this from proposed into <project>\". Reorganising many notes is vault-tidy."
license: Apache 2.0
argument-hint: "<note> [destination]"
disable-model-invocation: true
metadata:
  purpose: knowledge
  area: personal
  subject: obsidian
  posture: precise
  stage: any
  maturity: stable
---

# Vault Promote

## Overview

Staging (`00 Inbox/proposed/`) holds claims an agent made without being asked. Promotion is the
owner accepting one: the note is checked at the boundary, once, and moved to where lasting notes live.
Moving it into a company project or `03 Resources/` makes it *eligible* for the company memory; only the
owner makes it *shared*, by setting `memory: common` later.

## Procedure

1. **Find the note** in `00 Inbox/proposed/`. Several or no matches: list and ask.
2. **Check it** against [`vault-conventions`](../vault-conventions/SKILL.md) (`references/kinds.md`):
   - `kind` is present;
   - every property that kind requires is present and non-empty (a property allowed to be empty, such
     as `project` on a meeting with no project, counts as present);
   - every required section that kind lists is present as a `##` heading with that exact text.

   Any failure: **move nothing**. Name each missing field or section ("missing: `kind`", "missing for
   `assessment`: `verdict`" or "missing section for `work-shape`: Risks"), and offer to add it with the value the owner gives. An unlisted kind is
   not a failure; say it is unlisted and suggest a `skill-change` note.
3. **Choose the destination** with the owner: a project's `artefacts/` (the project resolved by Project
   homes in `vault-conventions`, either home), or `03 Resources/` (other folders per the kind's usual
   folder in `kinds.md`). When the owner's request already names
   the destination (and any new name) and it resolves to exactly one folder, that request is the yes;
   otherwise show the full target path and wait for a yes. A new name is part of the same yes.
4. **Move** by the procedure in `vault-conventions` (Moving and deleting): the Obsidian CLI when it
   answers, else a file move after the unique-name check. Never write then delete: rewriting links by
   hand turns name links into path links.
5. **Report** the new location and the wikilinks affected. Remind the owner that sharing is
   theirs: "to share it with the company, set `memory: common` on it".

## Guards

- Never set `memory`, never remove `private: true`, never add a property the owner did not supply.
- Never promote more than the note asked for; neighbouring notes in staging stay.

## Boundary & Related Skills

**Owns:** the promotion check at the staging boundary and the promotion move.

**Delegates:** kinds, required properties and sections, and the move procedure →
[`vault-conventions`](../vault-conventions/SKILL.md); reorganising many notes →
[`vault-tidy`](../vault-tidy/SKILL.md).

**Related:** `vault-conventions`, `vault-tidy`, `vault-capture`, `vault-planning`.
