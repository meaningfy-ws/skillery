---
name: vault-capture
description: File what matters into one project's files in a Meaningfy Obsidian vault: at the end of a work session (from the conversation) or at any time from raw call or meeting notes the owner pastes. Writes a dated `sessions.md` entry, and only what applies to `tasks.md`, `decisions.md`, `index.md` and `resources.md`; keeps the owner's hedges, never invents substance, never calls remember. Use when the owner, working in their vault, says "capture this into the project", "file these notes in the vault", "log this session in the vault", "end of session for project X", "update the vault project files", "here are my notes from the call, file them under project X". Starting a session is vault-resume.
license: Apache 2.0
argument-hint: "<project> [notes]"
metadata:
  category: vault
---

# Vault Capture

## Overview

The end of a work session, or a quick filing at any time: the project's files absorb what happened,
so the next [`vault-resume`](../vault-resume/SKILL.md) starts from the truth. Capture is the vault's
way of remembering. It writes to the vault, never to the company memory: the ingestion pipeline carries
what the owner opted in (see [`vault-conventions`](../vault-conventions/SKILL.md)).

## Procedure

1. **Resolve one project**, as `vault-resume` does: one match continues; several or a vague name, ask;
   none, write nothing and offer `vault-project new`. Never create a project here.
2. **Pick the source.** Notes the owner pasted, or this session's conversation. For a session, also ask:
   "Anything done or decided outside this conversation that should go in?" File only what the owner
   answers.
3. **Sort each point**, then write. The session entry (Done / Decided / Open / Next) summarises the
   whole session, so every point appears there in one line; the other files receive only what the table
   gives them:

   | Point | Also goes to |
   |---|---|
   | a decision actually taken | `decisions.md`: a row with rationale and who made it; a rejected option gets its own row |
   | a point still undecided ("probably", "I think", "need to check") | nothing else: **no** `decisions.md` row; if it implies an action ("check pricing"), that action goes to `tasks.md` too |
   | an action | `tasks.md`: **Urgent** (due within days), **Waiting** (on a named person or thing), otherwise **In progress** (open, not urgent, not waiting) |
   | a person new to the project | `index.md`: `people` (a wikilink; no file for the person) |
   | a change of status | `index.md`: the current status line |
   | a new file | `resources.md`: a row, `ASK OWNER` in the Link column until the owner gives the web link |

   The session entry is one dated entry for today, extended if today's exists.

   **A meeting or call** (the source is notes of one meeting) also gets its own note: `kind: meeting`
   in the project folder, named `YYYY-MM-DD <topic>.md`, holding what was said, decided and left open,
   with `date`, `attendees` and `project`. The session entry links to it. This note, not `sessions.md`,
   is what the owner shares with the company when they want to (`memory: common`, set by them).

4. **Keep the owner's words.** A hedge stays a hedge. A rationale the notes do not give is written
   "not stated", never supplied; "Made by" holds the names the source gives, else "not stated".
   Relative dates become concrete (`next week` → `week of YYYY-MM-DD`).
5. **Report** every file changed and what went where, and list the questions the notes left open.

## Guards

- **Never invent substance:** no decision, owner, date, rationale or number that the source does not
  contain.
- Never restructure a file, rename a section, or rewrite an earlier `sessions.md` entry; corrections
  are new entries.
- Never call `remember`; the company memory learns from the vault.
- Never set `memory` or remove `private: true`.

## Boundary & Related Skills

**Owns:** filing a session or raw notes into one project's five files (and, for one meeting's notes,
its `kind: meeting` note), and the hedge-keeping rules of that filing.

**Delegates:** file shapes and memory etiquette → [`vault-conventions`](../vault-conventions/SKILL.md);
project resolution style and session start → [`vault-resume`](../vault-resume/SKILL.md); new projects →
[`vault-project`](../vault-project/SKILL.md).

**Related:** `vault-conventions`, `vault-resume`, `vault-project`, `vault-daily`, `vault-promote`.
