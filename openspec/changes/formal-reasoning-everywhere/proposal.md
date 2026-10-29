<!-- STATUS: EPIC shaped 2026-10-29 from the owner's statement of the same day (inputs/qa.md).
     Decisions marked (proposed) await the owner's confirmation; next: derive the PLAN. -->

# EPIC: Formal reasoning everywhere an engine exists

**Golden-thread parent:** the archived EPIC [`formal-reasoning`](../archive/2026-10-29-formal-reasoning/proposal.md),
whose reach this change widens. It re-shapes the umbrella's DEC-4
([`reasoning-capabilities`](../archive/2026-10-29-reasoning-capabilities/proposal.md)) for this skill:
reasoning was placed in meaningfy-architecture.

## Appetite

**SMALL.** One capability touched in a few places: the skill changes bundle, its description and
Quick Start lead with the quick test, and its neighbours follow. If the work starts to add an engine,
a new script or an install step, it has overrun this appetite.

## Why

The owner wants quick tests "in almost any scenario where the asp or swi prolog exists": state a
few facts and rules, ask a question with an answer agreed beforehand, and let the engine answer. The
skill can already do this, but only for people who install the architecture bundle, and its
description and Quick Start read as a modelling tool. A consultant checking an argument, a developer
checking a business rule or a writer checking a policy's logic never sees it.

The skill stays separate from the rule skills: it builds a knowledge base in ASP or Prolog and reasons
over it and tests it; the rule skills keep the user's preferences. They share no code.

## Solution outline

- **Every install has it.** `formal-reasoning` moves to `meaningfy-core`. The modelling skills keep
  citing it as they do now.
- **The quick test leads.** The description and the Quick Start open with the smallest useful run:
  a few facts and rules, one test with its expected answer, one command. Modelling uses (competency
  questions, closure over a model's facts, rules from text) follow as patterns.
- **The engine decides whether it applies.** The skill runs `check_env.py` first. With no engine
  installed, it says which one would answer and where its install line is, and stops; it never
  installs anything and never falls back to prose reasoning presented as checked.
- **Outcome:** in any session on a machine with clingo or SWI-Prolog, a question with an exact answer
  can be checked by an engine in a minute, and the answer shows each rule's paraphrase beside it.

## Key decisions

- **DEC-1** (owner, 2026-10-29): "we shall be able to do quick tests in almost any scenario where the
  asp or swi prolog exists." The skill's reach is every session where an engine is installed, not
  architecture and modelling work only.
- **DEC-2** (proposed): Move `formal-reasoning` to `meaningfy-core`. Rejected: keeping it in
  meaningfy-architecture with a broader description (only architects would have it installed); a new
  bundle (one more install for a capability meant to be everywhere).
- **DEC-3** (proposed): No new mode or script. The quick test is the existing loop with the smallest
  project; test-first and paraphrase-back stay mandatory, because a quick test that writes its expected
  answer after the run certifies nothing.
- **DEC-4** (proposed): The engines stay optional. `dependencies.yaml` keeps them as optional, and
  installing `meaningfy-core` never requires them.

## Rabbit-holes

- **Over-triggering.** In core, the description is seen in every session. It must trigger on "check
  this exactly", "do these rules conflict", "test this with clingo/Prolog", and not on every question
  that contains the word "rule" (the rule skills own the user's preferences).
- **Quick versus careful.** A shorter Quick Start must not drop the agreed answer or the paraphrase
  check; those are what make the answer trustworthy.
- **Engine missing in most sessions.** Most machines have neither engine yet. The stop message must
  be one line and useful, not a lecture.

## No-gos

- No new engine, no new script, no change to `run_rules.py`'s behaviour or exit codes.
- No automatic install of clingo or SWI-Prolog.
- No merging with the rule skills; no use of `rules.py` here or of the engines there.
- No change to the competency-question test format.

---

## What Changes

- `bundles.yaml`: `formal-reasoning` moves from `meaningfy-architecture` to `meaningfy-core`;
  regenerate the bundles and the skill inventory.
- `skills/formal-reasoning/SKILL.md`: the description and the Quick Start lead with the quick test;
  the Boundary section names the rule skills as unrelated neighbours.
- Trigger probes: a positive quick test outside modelling, and a near-miss of the rule skills.
- Docs: the README rows of both bundles, the use-case catalogue's `served_by`, a CHANGELOG line.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `formal-reasoning`: the skill ships in `meaningfy-core`, and quick tests run wherever an engine is
  installed.

## Impact

- `meaningfy-core` grows by one skill; `meaningfy-architecture` shrinks by one.
- Every user gets the skill; it stays inert on machines without an engine, apart from the one-line
  stop.
