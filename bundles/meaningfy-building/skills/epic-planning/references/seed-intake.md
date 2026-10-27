# Seed intake & the Q&A record

How `epic-planning` turns messy human input into a shaped EPIC without losing the originals.

## Seed sources (read all before asking)

- **Human seed files** — the brief, the rough notes, the "what I want" dump. The primary raw input.
- **Architecture & ADRs** — the system context the EPIC must fit (see the `architecture` skill).
- **Sample / test data** — concrete examples that pin down ambiguous requirements.
- **Free notes** — Slack threads, meeting notes, whiteboard photos transcribed.
- **Existing-codebase analysis** (brownfield) — what already exists and constrains the change;
  optionally gathered with GitNexus (`gitnexus_query`, `gitnexus_context`).

Enumerate what you read, out loud, so the human can correct the input set before you elicit.

## Elicitation discipline

- One concern at a time. Group related questions, but do not dump a wall of them.
- Surface **every** ambiguity, conflict, and unstated assumption — and get a decision on each.
- After each round: summarise what you understood, and confirm before moving on.
- Make **no silent assumptions** (Human Sovereignty). If something cannot be decided now, park it as
  an Open Question in the PLAN's `design.md`, not a guess.
- This composes with `superpowers:brainstorming` and maps to `/opsx:explore` — reference, don't
  restate, those disciplines.

## Archiving the seeds (traceability, never deleted)

Write to `changes/<id>/inputs/`:

- `inputs/seeds/` — the original seed files, verbatim.
- `inputs/qa.md` — the Q&A record: each question, the answer/decision, and the resulting `DEC-` id
  if it became a key decision in the EPIC.

Rules:

- **Secondary, preserved, never groomed or deleted.** The authored EPIC (`proposal.md`) is the
  primary, shaped truth; the seeds are evidence of how it was shaped.
- The EPIC **supersedes** the seeds — when they conflict, the EPIC wins and records why.

## The Q&A record format

```
## Q: <the question, one concern>
- Asked because: <which ambiguity/assumption it resolves>
- Answer: <the human's decision>
- → DEC-<n> (if it became a key decision in the EPIC)
```
