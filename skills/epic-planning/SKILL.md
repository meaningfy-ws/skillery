---
name: epic-planning
description: Turn a Work Shape or architecture docs into an implementation-ready EPIC.md specification, then gate it. Use specifically to produce the EPIC spec artifact — description, glossary, algorithm, concrete examples, anti-patterns, test-case specs, error matrix, task breakdown, roadmap — and run it through the clarity gate (≥9/10). Trigger on "write/refine an EPIC", "turn this Work Shape into a spec", "plan this epic". For the general doc-first build loop use the external `stream-coding` skill; this skill only produces the EPIC.md.
license: Apache 2.0
metadata:
  category: ai-coding
---

# EPIC Planning

## Overview

Translate business requirements (a Confluence Work Shape, architecture docs, sample data) into
a precise, implementation-ready **EPIC.md** — the bridge between business intent and executable
instructions. Ask before assuming; never produce a spec with hidden assumptions.

## Procedure

1. **Read all inputs** before asking: `MEMORY.md`, the Work Shape, architecture docs, sample
   data, and any existing `EPIC.md` (if refining).
2. **Ask focused, grouped questions** for anything missing or ambiguous — make no assumptions.
   After each round, summarise what you understood and confirm.
3. **Write `EPIC.md`** using the two-part structure in `references/epic-template.md`
   (Part 1 Specification — frozen once planning is done; Part 2 Implementation Log).
4. **Run the clarity gate** (the `clarity-gate` skill): the spec must score **≥ 9/10** before it
   is ready. Below 9, list the specific gaps and revise.
5. Keep the EPIC status header current as work progresses.

## What you do NOT do

- Write implementation code, Gherkin step definitions, or commit changes.
- Make architectural decisions unilaterally — propose options with trade-offs; the developer decides.

## Boundary & Related Skills

**Owns:** the planning procedure + the EPIC.md structure (template in `references/`).
**Delegates:** spec scoring → `clarity-gate`; the doc-first build method → external `stream-coding`;
Gherkin → `bdd-gherkin`; code → `cosmic-python`. This skill produces the **spec**, not the build.
**Related:** `clarity-gate`, `stream-coding` (external), `bdd-gherkin`, `architecture`.
