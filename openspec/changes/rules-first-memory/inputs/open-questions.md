# Open questions — rules-first-memory (secondary, never groomed)

Parked on 2026-11-11: the owner chose to keep this EPIC as a note and shape it later. A first draft
of the EPIC is `draft-proposal.md` (proposal only, DEC-1..DEC-12, not accepted); the seed is
`seed.md`. These questions are open; each has the drafter's recommended answer first.

## Shaping questions (from the draft)

- **Q-1. Where do project-state notes go** (EPIC status, release history)? (a) stay in the CLI's
  auto-memory; (b) the spine and repository docs; (c) the vault's project notes. Recommended: (a).
- **Q-2. How is auto-memory restricted?** (a) a hook refuses only preference and correction notes,
  everything else still saves; (b) turn auto-memory off; (c) a policy line only. Recommended: (a).
- **Q-3. How eager is the prompt hook?** (a) any listed cue word adds a hint, never blocks, tuned
  with near-miss probes ("never mind", "don't worry about it"); (b) only first-person standing forms
  ("from now on", "I want you to always"); (c) no prompt hook. Recommended: (a).
- **Q-4. Where does a personal authority grant for one repository go?** (a) the repository's rule
  store; (b) the vault, scoped to that project; (c) the repository's `AGENTS.md` by hand.
  Recommended: (b) — a public repository's store would bind every teammate's agent. The PLAN must
  then settle how `load` knows the project.
- **Q-5. How does `rule-steward` show the change worked?** (a) a count of rules written per window,
  plus the replayed 2026-11-11 failure case as acceptance test; (b) (a) plus a count of refused memory
  writes; (c) the replay only. Recommended: (a).
- **Q-6. Is the migration for everyone or a one-off?** (a) a documented procedure any user can run;
  (b) a one-off for the owner. Recommended: (a).

## Migration questions (from the owner's first migration card)

A first migration card drafted 11 candidate rules from the owner's auto-memory notes (tool habits,
the standing git authority, no-config, move-don't-regenerate), all proposed to the vault, none
written yet. Open:

- **M-1.** Was the authority for admin merges, tags and releases given for one release only, or
  standing for the repository? If standing: "do it without asking, but cut a release only once
  implementation is finished".
- **M-2.** Rules that repeat a repository's `CLAUDE.md` "Tool habits" (read/edit with the file
  tools; questions in one round): keep them as personal rules too, or rely on the repository file?
- **M-3.** Most candidates quote the memory note, not the owner's own sentence; reword the sources
  before approving, or accept the note's wording as the source?

## Drafting notes to carry into shaping

- The draft found that a bundle may hold only one mod today (`tools/bundle_gen/gen.py`, the
  `catalogue-governance` spec), and `meaningfy-core` already has `no-poll-loops`; a second mod needs
  that rule changed (draft DEC-3).
- The draft reverses `rules-in-every-session` DEC-6 (no session-start hook) on purpose (draft DEC-1).
- Unchecked: whether opencode's plugin API can add context at session start or on a prompt (draft
  RISK-2), and whether the CLI's memory-note format stays stable (draft RISK-3).
- A local trial is running on the owner's machine: the global policy in the personal agent file,
  the vault variable set, and a prompt-cue hook that adds a `rule-learner` hint. Its observations
  (false matches such as "never mind") are input for Q-3.
