---
name: corpus-repository
description: "Use this skill when a worker must read, add to or change an external repository of house material (templates, guidelines, reference texts), such as \"add this to the repository\", \"update our house material\" or \"draft from the library\"; it has the worker follow that repository's own instructions: read its AGENTS.md and docs first, use its own commands, stop when its checks fail, never edit what it declares immutable, and report what the instructions left unclear."
license: Apache 2.0
metadata:
  purpose: house-material
  area: cross-cutting
  subject: generic
  posture: reusable
  stage: any
  maturity: experimental
---

# Corpus Repository

A repository of house material carries its own rules: how it is laid out, which commands build and
check it, what may change and what may not. This skill holds none of those rules. It holds the
discipline of finding them in the repository and working by them.

## Quick Start

**Input:** the session runs in a brand-guidelines repository. The person asks: "Add the new
partner logo to the guidelines and fix the typo in the 2025 print guide."

1. Read `AGENTS.md`. It says: logos go under the folder it names, each with a usage note; every change
   runs the repository's check before a pull request; released guides are frozen, and a fix to one is
   a new edition.
2. Read the docs `AGENTS.md` points to: the logo usage-note format and the editions page.
3. Add the logo and its usage note where `AGENTS.md` says, in the format the docs give.
4. The 2025 print guide is marked released. Do not touch it. The editions page prescribes a new
   edition for a correction, so create the next edition with the typo fixed, as the page describes.
5. Run the repository's check. It fails: the usage note you wrote lacks a required field. Stop. The
   fix is inside your task, so add the field the check names and run the check again. It passes.
6. Report to the person, the failure included:

   ```
   Done: partner logo added with its usage note; print guide 2025.2 created with the typo fixed
   (2025.1 is released and unchanged). The check first failed on a missing usage-note field;
   fixed and re-run, it passes.
   Unclear: AGENTS.md does not say who approves a new edition. I left that open; please confirm.
   ```

## Workflow

1. **Find the repository.** Work in the repository the session runs in, or the one the person names.
   Do not search for one or guess a path.
2. **Read before acting.** Read its `AGENTS.md` and the docs it points to before writing anything,
   even for a small change.
3. **No instructions, no writing.** If there is no `AGENTS.md` or README telling how to work in it,
   say so and ask the person before writing.
4. **Use its own commands** for building, checking and publishing, as its instructions give them.
5. **Respect immutability.** Never edit what the repository declares immutable (released, signed,
   frozen). Add what its instructions prescribe instead, such as a new version or an amendment; if
   they prescribe nothing, ask.
6. **Stop on a failing check.** Stop and report the failure. Fix it only when the failure is in
   your own change, then run the check again and report both runs. Never bypass, skip or disable a
   check.
7. **Report the gaps.** Name what the instructions left unclear, as an issue in the repository when
   its instructions say so, otherwise as a note to the person.

## Gotchas

- **Acting from memory.** A repository read last week may have changed its rules. Read its
  instructions again in each session.
- **Restating the repository's rules elsewhere.** Its conventions live in the repository. Cite them;
  do not copy them into a skill, an agent or a note.
- **"Just a typo" in a released file.** A small edit to immutable material is still an edit. Follow
  the prescribed route or ask.
- **Working round a check.** A failing check is information, not an obstacle. Disabling it, or
  changing the input so the check no longer catches it, hides the problem from the person.
- **Filling a gap with a guess.** Where the instructions are silent, ask and report the gap; do not
  invent a convention.

## Boundary & Related Skills

**Owns:** how a worker operates an external repository of house material by that repository's own
instructions: where to work, reading first, using its commands, stopping on its checks, respecting
what it declares immutable, and reporting unclear instructions.

**Does NOT own:** any repository's layout, commands, conventions or content (the repository's own
`AGENTS.md` and docs); the domain judgement for the material (the activity skill of the worker).

**Related:** `rulebook` (the person's own rules for agents, not a repository's), `project-setup`
(scaffolding a repository's agentic files, such as its `AGENTS.md`), `technical-writing` (writing
the docs a repository needs).
