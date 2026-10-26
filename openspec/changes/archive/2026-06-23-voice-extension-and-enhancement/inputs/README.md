# W3DS Style-Reproduction Package

Everything needed to make an LLM produce new text in the voice of the
"On Web 3.0 Data Space" corpus (Post-Platforms Foundation LinkedIn essays).

This README answers two things: **what needs to be in place**, and **where each
piece sits in Diataxis**.

---

## 1. The two populations of artefact

The artefacts do not all belong to one category. They split into two kinds, and
this split is the most important architectural fact in the package:

- **Operative artefacts** — text the *LLM* consumes and executes. These are the
  product itself, not documentation about it. Diataxis does not classify them.
  They are governed instead by prompt-engineering layering (voice / structure /
  task held apart).
- **Documentation artefacts** — text a *human* reads to understand, run, and
  maintain the capability. These map cleanly onto Diataxis.

The **House Style Profile** is the one bridge artefact: it is reference-grade
documentation a human consults, and at the same time the machine input that
Prompt B was built from.

---

## 2. Artefact register (what needs to be in place)

| # | Artefact | File | Population | Status |
|---|----------|------|-----------|--------|
| 1 | House Style Profile (full analysis) | `../post-platforms-style-profile.md` | Bridge | Done (prior turn) |
| 2 | Shared voice reference + lexicon | `house-voice.md` | Operative + reference | In this package |
| 3 | Per-genre generation prompt (the essay) | `genre-w3ds-essay.md` | Operative | In this package |
| 4 | Banner / visual brief | embedded in #3 | Operative | In this package |
| 5 | How-to: generate, validate, refresh, extend | `how-to-generate-and-validate.md` | Documentation | In this package |
| 6 | Explanation: design rationale + limits | `explanation-design-rationale.md` | Documentation | In this package |
| 7 | Tutorial: guided first run | not built | Documentation | Deferred (see note) |

**Why no Tutorial yet.** With a single genre, the how-to's "generate an essay"
recipe already serves the learning function; a separate tutorial would near-
duplicate it. A real Tutorial earns its place once there are several genres or a
new operator who needs a guided, low-stakes first pass. The register marks the
slot so it is visible, not forgotten.

---

## 3. Diataxis classification

Diataxis sits on two axes: **action vs cognition**, and **acquisition (study) vs
application (work)**. Documentation artefacts map as follows.

| Artefact | Audience | Quadrant | Why |
|----------|----------|----------|-----|
| House Style Profile | analyst / reviewer (also machine) | **Reference** | Authoritative, consulted not read through; you look up a trait, you do not study it cover to cover |
| `house-voice.md` | machine (prepended) + human lookup | **Reference** | A distilled, lookup-shaped subset of the profile |
| `how-to-generate-and-validate.md` | operator with a job to do | **How-to guide** | Goal-oriented steps for someone who already knows what they want |
| `explanation-design-rationale.md` | maintainer / stakeholder | **Explanation** | Discursive, answers "why it is built this way", no steps |
| Tutorial (deferred) | new operator learning | **Tutorial** | Study + action: a safe, guided end-to-end first run |

**Operative artefacts fall outside the four quadrants.**
`genre-w3ds-essay.md` and the banner brief are not documentation about a system;
they are instructions a system executes. Their nearest doc-analogue is Reference
(authoritative, declarative), but treating an executable prompt as Reference
documentation is a category error worth resisting. They are configuration / the
product. Govern them with the layering in section 4, not with Diataxis.

This is the contradiction not to smooth over: a prompt and a style profile are
often lumped together as "the docs", but only one of them is documentation.

---

## 4. Mapping to the faceted architecture

The package already lines up with the Layer 0–3 model:

- **Layer 0 — shared voice reference:** `house-voice.md`
- **Layer 1 — structure / method:** the genre skeleton (currently inside
  `genre-w3ds-essay.md`; splits out into its own structure artefact under the
  faceted target)
- **Layer 2 — channel doer:** `genre-w3ds-essay.md` (and the banner brief, which
  would become its own channel doer)
- **Layer 3 — quality gate:** the self-check (in #3) plus the holdout validation
  procedure (in #5)

So the operative half of this package is a single-genre instance of the faceted
architecture. Adding genres means adding Layer 2 doers that prepend the same
Layer 0 voice and reference the relevant Layer 1 structure.

---

## 5. Configurable knobs (read before reusing for Meaningfy)

Three traits of this corpus run opposite to the Meaningfy house standards:
US spelling, heavy em-dash use, and high-intensity claims with large round
numbers. They are faithful to the target voice, so they are kept ON by default,
but they are isolated as explicit switches at the top of `house-voice.md`.
Flipping them is a one-line change, which is what lets the same package serve
either "reproduce this voice as-is" or "adapt toward Meaningfy".

---

## 6. Where to keep it

A Claude Project is the natural home: profile + `house-voice.md` in project
knowledge; `genre-w3ds-essay.md` as a reusable instruction. The two
documentation files live alongside as the operator and maintainer guides.
