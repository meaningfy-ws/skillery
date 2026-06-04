---
name: clarity-gate
description: Pre-ingestion quality gate for specifications and documents before they drive implementation. Use to score a spec/EPIC against a 13-item checklist (6-criterion rubric, must reach ≥9/10), surfacing hidden assumptions and ungrounded claims. Trigger on "score this spec", "is this spec ready", "run the clarity gate", "check this EPIC before implementation". A lightweight variant applies to routine docs.
license: Apache 2.0
metadata:
  category: ai-coding
---

# Clarity Gate

## Overview

A document is only as good as the assumptions it hides. The **Clarity Gate** is an
*epistemic* check run **before** a specification (EPIC, design, requirements) is allowed
to drive code generation. It verifies that every claim is grounded, every assumption is
made visible, and every requirement is specific enough to generate unambiguous output.

The primary failure mode it catches: a spec that *reads* fine but smuggles unstated
assumptions which compound into defects downstream. Passing a readability check is not
enough — the gate is designed to surface what the prose quietly assumes.

## Quick Start

1. Read the spec to be gated.
2. Apply the 13-item checklist (7 foundation + 6 document-architecture) — see
   `references/clarity-gate-checklist.md` for the full checklist and scoring rubric.
3. Score against the 6 criteria: actionability, specificity, consistency, structure,
   disambiguation, reference clarity.
4. The spec must score **≥ 9/10** to proceed. Below 9: list the specific gaps, revise,
   re-score.

## Full vs. lightweight

- **Full gate (specs/EPICs):** the complete 13-item checklist + scoring; gate at ≥9/10.
  Used before an EPIC proceeds to implementation.
- **Lightweight check (routine docs):** actionable? current (not aspirational)? specific
  references (no vague "see elsewhere")? planned-vs-present clearly marked? single source
  (link, don't copy)? Use for docstrings, READMEs, summaries — no numeric score required.

## Boundary & Related Skills

**Owns:** the readiness check for specs/docs — the checklist, the scoring, the ≥9/10 bar.

**Does NOT own:** producing the spec (that is `epic-planning` + the external `stream-coding`
method), writing code (`cosmic-python`), or writing the docs themselves (`technical-writing`).
The gate *judges*; it does not author.

**Related:** `epic-planning` (produces the EPIC the gate scores), `stream-coding` (the
doc-first method this gate sits inside), `technical-writing` (applies the lightweight check).

## Tips

- Score honestly: a 9/10 that hides one critical assumption is a failed gate, not a pass.
- When you fail a spec, return the *specific* missing items, not a vague "needs work".

## Limitations

- The gate measures spec readiness, not downstream correctness; tests and review remain.
