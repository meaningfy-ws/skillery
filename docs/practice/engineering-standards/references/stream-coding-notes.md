# Stream Coding: Documentation-First Development Methodology

**From:** [Stream Coding v3.4](https://github.com/frmoretto/stream-coding) by Francesco Marinoni Moretto

Stream Coding is the methodology for PLANNING and DOCUMENTING before coding; Cosmic Python gives the
architecture. The method itself is owned by the external [`stream-coding`](https://github.com/frmoretto/stream-coding) skill (install:
[`environment/setup.md` §2](../../../environment/setup.md#2-external-dependencies)); these notes keep only
the Meaningfy mapping and point to the skill for everything else.

---

## The Core Insight

> **"When code fails, fix the spec—not the code. If your docs are good enough, AI writes the code."**

The phase split (40/40/20) and why it pays: [`stream-coding`](https://github.com/frmoretto/stream-coding), "The Stream Coding Truth" and "The 4-Phase
Methodology".

---

## PHASE 1: STRATEGIC THINKING (40% of time)

Documentation Audit, the 7 Questions and the exit criteria: [`stream-coding`](https://github.com/frmoretto/stream-coding), Phase 1. The Strategic Blueprint
is replaced at Meaningfy by the [`decision-package`](../../../../skills/decision-package/SKILL.md) skill
(see [`strategic-blueprint-checklist.md`](strategic-blueprint-checklist.md)).

---

## PHASE 2: AI-READY DOCUMENTATION (40% of time)

The four mandatory sections (anti-patterns, test case specifications, error handling matrix, deep
links): [`stream-coding`](https://github.com/frmoretto/stream-coding), Phase 2. At Meaningfy the EPIC and PLAN carry them through
[`epic-planning`](../../../../skills/epic-planning/SKILL.md).

---

## ⚠️ THE CLARITY GATE (Mandatory Between Phase 2 & 3)

**NEVER SKIP THIS GATE.** The 13-item checklist and the 6-criterion score (≥ 9/10 to proceed) are
owned by the [`clarity-gate`](../../../../skills/clarity-gate/SKILL.md) skill.

---

## PHASE 3: EXECUTION (15% of time)

Generate → verify → integrate. If generated code fails, fix the spec and regenerate; a manual patch
creates Divergence. Detail: [`stream-coding`](https://github.com/frmoretto/stream-coding), Phase 3.

---

## PHASE 4: QUALITY & ITERATION (5% of time)

The Rule of Divergence and the Day 2 workflow: [`stream-coding`](https://github.com/frmoretto/stream-coding), Phase 4.

---

## Integration with Cosmic Python

Stream Coding is **methodology and strategy** (WHAT to build, HOW to plan).
Cosmic Python is **architecture and execution** (HOW to structure code, HOW to test, HOW to maintain quality).

**Together:**

```
Stream Coding Phase 1     → Cosmic Python: Architectural Decisions (ADRs)
Stream Coding Phase 2     → Cosmic Python: Layers, Interfaces, Testing approach
Stream Coding Phase 3     → Cosmic Python: Code generation follows layer rules
Stream Coding Phase 4     → Cosmic Python: Maintain boundaries, run quality gates
```

When integrating:
1. **Phase 1 (Stream)**: Answer 7 Questions. For architecture decisions, reference Cosmic Python layer patterns
2. **Phase 2 (Stream)**: Write specs. Ensure they specify Cosmic Python layers (models, adapters, services, entrypoints)
3. **Phase 3 (Stream)**: Generate code. Code should naturally follow Cosmic Python patterns
4. **Phase 4 (Stream)**: Prevent divergence. Update specs when adding features, code regenerates with correct architecture

---

## The Stream Coding Contract

The per-phase checklist is the sum of the phases above: [`stream-coding`](https://github.com/frmoretto/stream-coding) and [`clarity-gate`](../../../../skills/clarity-gate/SKILL.md).

---

## Key Differences: Stream Coding vs Traditional Development

See [`stream-coding`](https://github.com/frmoretto/stream-coding), "The Stream Coding Truth".

---

## Summary

Stream Coding tells you WHAT to build and HOW to plan; Cosmic Python tells you HOW to structure the
code. **The core belief:** Documentation is not a step toward coding. Documentation IS the product.
Code is just the compiled output.
