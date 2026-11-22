---
name: explanatory-writing
description: Apply explanatory craft so that Explanation-quadrant prose reads clearly — one controlling metaphor, a concrete example beside every abstract claim, self-answered question pivots, short declaratives, coin-and-explain, a confident grounded close. Use when writing or improving an explainer, a blog-style or internal explanation, or broad-audience teaching prose (Diátaxis Explanation; not Reference or How-to). Trigger on "make this explainer clearer", "why does this read flat", "write a blog-style explanation", "add a worked example or metaphor", "tighten the rhythm of this prose". Executes the Meaningfy technical/educational register from `company-voice.md`. Owns texture, not document structure (`executive-communication`) or doc placement (`technical-writing`).
license: Apache 2.0
metadata:
  purpose: content
  area: cross-cutting
  subject: generic
  posture: reusable
  stage: any
  maturity: stable
---

# Explanatory Writing

Explanations drift abstract and flat: claims with no instance, three half-metaphors, uniform
sentences, a hedged ending. This skill owns the **texture** of Explanation-quadrant prose (how the
sentences land), not its structure or placement. It executes the technical/educational register of
`meaningfy-voice` and restates none of its rules.

## Quick Start

Request: *"Write an explainer of how eVault sync works, for the docs site."*

| Skill | Owns | Decides |
|-------|------|---------|
| `technical-writing` | placement & form | a `docs/` Explanation page (AsciiDoc/Antora), not Reference; invokes the Explanation sub-mode |
| `explanatory-writing` | texture | the metaphor, example-beside-claim, the question pivot, the rhythm, the close, under the knobs |
| `clarity-gate` | the check | actionable · current · specific refs · single-source |
| `executive-communication` | structure | *not invoked here* (no decision). If it were a recommendation, its answer-first pyramid would win by precedence |

Before: "The eVault enforces ACL-gated PID resolution over the RDF envelope." After: "Each person
gets a small personal data server. We call it an eVault. It holds your data and decides, request by
request, who is allowed to see what."

## Rules

**The Diátaxis fit-map.**

| Quadrant | Use the craft? | Why |
|----------|----------------|-----|
| **Explanation** (explainers, blog posts, internal notes, broad-audience teaching) | **Yes, home** | Understanding-oriented prose is what these moves serve. |
| **Tutorial** (framing/intro only) | Partial | Borrow direct address and "imagine…"; keep the steps literal and low-surprise. |
| **How-to** (recipes) | No | Terse, goal-oriented; the texture bloats it. Keep only direct address and concrete naming. |
| **Reference** (lookup) | No | Must stay dry and declarative; the craft is harmful here. |

If the request is Reference or How-to, decline and point back to `technical-writing` / how-to form.

**The seven craft moves:** one controlling metaphor · a concrete example beside every abstract
claim · self-answered question pivots · short declaratives · direct address · coin-and-explain,
once · a confident, grounded close. Read `references/craft-moves.md` when drafting or revising an
explainer: it adds each move's vetted before/after example and the vetting rule (an example that
reads punchier than the house voice is re-authored).

**The voice it executes.**

- **Register selection is not ours.** Follow `company-voice.md`'s rule (teach → technical/educational;
  decide → general/executive). This skill executes the technical/educational register and adds no
  parallel dial.
- **Knobs are positive defaults linked to the house sources**; where a default and its source
  disagree, the source wins. Read `references/knobs.md` when choosing spelling, claims, rhythm,
  vocabulary or rhetorical questions, or when reproducing a foreign voice: it adds the five knobs
  with their authority and the single named "flip" that turns a default off for one job.
- Read `references/voice-schema.md` when scoring a sample's voice or handing a profile to a capture
  method: it adds the eight axes, which four the craft moves realise and which the house voice owns.

**Precedence when directives compete: structure > clarity > texture.** If answer-first structure
conflicts with a slow-burn metaphor lede, lead with the answer, then apply texture beneath it.

## Before you hand over

Quick diagnostic for one piece:

| Question | If not | Action |
|---|---|---|
| One controlling metaphor, carried start to finish? | three half-metaphors read as noise | keep one, cut the rest |
| A concrete, named example beside every abstract claim? | the claim cannot be checked | add the instance |
| At least one self-answered question as a pivot? | the prose has no momentum | turn a section on the reader's next question |
| Short declaratives breaking the rhythm? | uniform, flat prose | break a medium sentence with a short line |
| British English, no em dash, no overclaiming (knobs)? | off-voice | fix per `company-voice.md`; on short prose land at least one British marker where it falls naturally, since absence of US forms does not prove the register |
| Register right for the purpose (teach or decide)? | texture traded for answer-first clarity | apply the precedence rule |

**Calibrating the skill (variant batch).** When tuning the rules or onboarding, generate 3–5
variants of the same piece, collect about 20–30 across a few prompts, and inspect the batch for drift
against the fit-map and the knobs. Calibrate on accept/reject: when a variant reads punchier than the
house standard, name what gave it away and tighten the rule. It runs on existing Meaningfy docs and
needs no corpus-capture project.

## Boundary & Related Skills

**Owns:** the *texture* of Explanation-quadrant prose: the craft moves, the fit-map, the 8-axis
schema, the positive-default knobs, and variant-batch validation.

**Does NOT own:** document **structure** / answer-first persuasion (`executive-communication`); doc
**placement, format, and type** (`technical-writing`); the **voice profile** itself
(`meaningfy-voice`); the **clarity check** (`clarity-gate`).

The precedence rule (structure > clarity > texture) and the routing trace in the Quick Start are the
boundary in practice.

**Related:** `meaningfy-voice`, `technical-writing`, `executive-communication`, `writing-antipatterns` (genre-conditional failure modes, including where this skill's own craft moves invert).

Answers `CLR` in `test-strategy`'s matrix (`references/generic-writing.md`).
