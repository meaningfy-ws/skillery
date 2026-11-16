---
name: clarity-gate
description: Pre-ingestion quality gate for specifications and documents before they drive implementation. Use to score a spec/EPIC against a 13-item checklist (6-criterion rubric, must reach ≥9/10), surfacing hidden assumptions and ungrounded claims. Trigger on "score this spec", "is this spec ready", "run the clarity gate", "check this EPIC before implementation". A lightweight variant applies to routine docs.
license: Apache 2.0
metadata:
  purpose: software-development
  area: cross-cutting
  subject: generic
  posture: reusable
  stage: shape
  maturity: stable
---

# Clarity Gate

An *epistemic* check run **before** a specification (EPIC, design, requirements) drives code. The
mistake it corrects: passing a spec that *reads* fine but smuggles unstated assumptions, which
compound into defects downstream. The gate verifies that every claim is grounded, every assumption
visible, and every requirement specific enough to generate unambiguous output.

## Quick Start

A PLAN's `design.md` says "retry the upload a few times, then fail gracefully"; `tasks.md` says
"handle errors as usual".

1. Read the spec to be gated.
2. Apply the 13-item checklist (7 foundation + 6 document-architecture). Item 1 (Actionable) and
   item 12 (Deep Links) fail: "a few", "gracefully" and "as usual" decide nothing. Read
   `references/clarity-gate-checklist.md` whenever you run the full gate: it adds the 13 items, the
   weighted 6-criterion rubric, the score interpretation, the self-assessment questions and the
   failure-recovery table.
3. Score against the 6 criteria: actionability, specificity, consistency, structure,
   disambiguation, reference clarity. Result: 7/10.
4. Return the specific gaps: "a few → 3 retries, 2 s back-off"; "gracefully → which error, to whom";
   "as usual → link the error matrix row". The PLAN is revised and re-scored: 9/10, pass.

The spec must score **≥ 9/10** to proceed. Below 9: list the specific gaps, revise, re-score. The
one exception: a gap the developer explicitly accepts, recorded as a decision (`epic-planning` says
when that is offered).

## Rules

### Full vs. lightweight

- **Full gate (specs/EPICs):** the complete 13-item checklist + scoring; gate at ≥9/10.
  Used before an EPIC proceeds to implementation.
- **Lightweight check (routine docs):** actionable? current (not aspirational)? specific
  references (no vague "see elsewhere")? planned-vs-present clearly marked? single source
  (link, don't copy)? Use for docstrings, READMEs, summaries — no numeric score required.

### Scoring honestly

- A 9/10 that hides one critical assumption is a failed gate, not a pass.
- A failed spec gets the *specific* missing items back, never a vague "needs work".
- Apply **MECE** as a completeness lens: roles, permissions, states, and edge cases should be
  **mutually exclusive** (no overlap) and **collectively exhaustive** (no gaps). Overlaps hide
  conflicting rules; gaps are the unstated cases that become defects.

## Boundary & Related Skills

**Owns:** the readiness check for specs/docs — the checklist, the scoring, the ≥9/10 bar. It
measures spec readiness, not downstream correctness; tests and review remain.

**Does NOT own:** producing the spec (that is `epic-planning` + the external `stream-coding`
method), writing code (`cosmic-python`), or writing the docs themselves (`technical-writing`).
The gate *judges*; it does not author.

**Related:** `epic-planning` (produces the EPIC the gate scores), `bdd-gherkin` (authors the
design-phase `.feature` coverage the gate scores), `spec-stewardship` (lifecycle after gating),
`guardrails` (behaviour gate alongside this content gate), `stream-coding` (the doc-first method this
gate sits inside), `technical-writing` (applies the lightweight check).

Answers `VER, CLR` in `test-strategy`'s matrix (`references/documentation.md`, `references/shaping.md`).
