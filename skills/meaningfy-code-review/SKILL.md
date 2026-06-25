---
name: meaningfy-code-review
description: The Meaningfy pre-PR review — two modes (standalone subagent passes, interactive main-thread), five lenses (one subagent run each), and the checklist criteria (architecture, Clean Code/SOLID, security, testing, spec conformance) plus a fit-and-refactoring investigation, reported by priority. Use to supply the review criteria and modes for a Meaningfy change. Trigger on "Meaningfy review checklist", "architecture-conformance review", "review against cosmic-python layers", "pre-PR review criteria", "review modes", "review lenses". For the read-only standalone run, use the external `code-review` command or the `code-reviewer` wrapper.
license: Apache 2.0
metadata:
  category: ai-coding
---

# Meaningfy Code-Review Checklist

## Overview

The **criteria and modes** for a Meaningfy pre-PR review. This skill defines *what to check*, *how to
run it* (two modes, five lenses), and *how to report*. The read-only standalone *run* is performed by
the external `code-review` command or the `code-reviewer` agent wrapper (which loads this skill). It
references `cosmic-python` for the layering rules rather than restating them.

## Review modes

A review has **two modes**. The analysis is always isolated from implementation context.

- **Standalone (default)** — the read-only analysis, run as **five single-lens subagent passes**
  (one lens per subagent run, see Lenses below), then aggregated into one prioritised report. No
  dialogue. This is what the `code-reviewer` agent performs.
- **Interactive** — entered when the developer starts discussing the PR code or the returned findings.
  Runs in the **main thread** over the *aggregated* findings; the reviewer becomes a thinking partner:
  explains findings, weighs trade-offs against the cited principles, and co-designs fixes. It stays
  **read-only** — accepted fixes are applied later by the `implementer`, never by the review.

**Always-subagent rule.** The review *analysis* MUST be triggered as subagent execution(s), isolated
from the implementation/main context — never run inline in the implementation context. Only the
aggregation of returned findings and the interactive discussion of them happen in the main thread.

### Lenses

The analysis is decomposed into a fixed set of **five lenses**; **each lens is one subagent run**.
Lenses are *views* over the checklist below and anchor to existing `cosmic-python` catalogue ids — no
new ids are minted here. A full review runs all five as separate passes; a single lens can be run
alone (e.g. "L1 only").

| Lens | Bundles (aspects) | Anchored ids / checklist section |
|------|-------------------|----------------------------------|
| **L1 · Security & safety** | exposed secrets/credentials; injection (command/SQL/XSS); OWASP-top-10; validate-once-at-boundary; duplicated validation; sensitive-data handling | `BP-VALIDATE-AT-BOUNDARY`, `AP-DUP-VALIDATION`, `guardrails` — *Security* |
| **L2 · Spec correctness & tests** | conformance to the EPIC **requirements/specs** (not the plan): acceptance criteria, edge/error scenarios, no undocumented divergence; **proven by** per-layer unit tests + Gherkin step defs | `BP-COVERAGE-PER-LAYER` — *Testing* + *Spec conformance* |
| **L3 · Architecture conformance** | layer law / dependency direction; no import cycles; component-first vs parallel layouts; I/O-not-in-models; logic-not-in-edges; no cross-variant/`core`-outward/reversed-DAG imports | `AP-IO-IN-MODELS`, `AP-LOGIC-IN-EDGES`, `AP-CROSS-VARIANT-IMPORT`, `AP-PARALLEL-LAYOUTS`, `PR-COMPONENT-FIRST` — *Architecture conformance* |
| **L4 · Principles & clean code** | SOLID; intention-revealing/non-generic names; small cohesive units, no deep nesting; no free strings / raw dicts in any layer; constants/enums in one home; exceptions module | `AP-FREESTR-ANYLAYER`, `AP-DICT-AS-MODEL`, `BP-DOMAIN-REVEALING-NAMES`, `AP-GENERIC-MODULE-NAMES`, `BP-CONSTANTS-ENUMS`, `BP-CONSTANTS-HOME`, `BP-EXCEPTIONS-MODULE`, `AP-EXCEPTIONS-EMBEDDED` — *Code quality* |
| **L5 · Fit, elegance & refactoring** | survey-first fit to existing code; reuse & compactness; no duplicate constants / misplaced shared infra / over-fragmentation / verbatim external copies; config-source decoupling; **the fit & refactoring investigation** (new + touched code) with gitnexus blast radius | `PR-SURVEY-FIRST`, `PR-REUSE-COMPACT`, `PR-SSOT-DRY`, `AP-DUP-CONST`, `AP-MISPLACED-SHARED-INFRA`, `AP-OVER-FRAGMENTATION`, `AP-VERBATIM-EXTERNAL`, `PR-CONFIG-DECOUPLED` — *Reuse & DRY* + *Fit & refactoring investigation* |

**Lens MECE boundaries** (so a finding lands under exactly one lens):
- **L3 vs L4** — L3 owns *cross-file/structural* rules (layer direction, cycles, layout, I/O-in-models,
  logic-in-edges); L4 owns *within-unit* code quality (SOLID, naming, free strings, dicts, exceptions,
  constants). A misplaced import is L3; a magic string is L4.
- **L4 vs L5** — L4 flags a *local* quality defect as-is; L5 owns *cross-file reuse/fit* and the
  *forward-looking refactoring*. "This name is unclear" is L4; "this duplicates the sibling, lift it" is L5.
- **L2 vs all** — L2 is the only lens that judges against the **requirements/specs** (correctness + the
  tests proving it); the others judge the code against principles regardless of requirements.

## Review checklist

Architecture and code-quality rules are **owned by the catalogue**
([`cosmic-python:references/principles-and-anti-patterns.md`](../cosmic-python/references/principles-and-anti-patterns.md));
this checklist cites entry ids, it does not restate them.

### Architecture conformance
- [ ] Dependency direction respected (`cosmic-python` layer law); no higher→lower imports; no cycles.
- [ ] No I/O/framework deps in models (`AP-IO-IN-MODELS`); business logic in services/models, not the edges (`AP-LOGIC-IN-EDGES`); no cross-variant/`core`-outward/reversed-DAG imports (`AP-CROSS-VARIANT-IMPORT`).

### Code quality (Clean Code + SOLID)
- [ ] SRP, intention-revealing names, no deep nesting, OCP/DIP (`cosmic-python` SOLID).
- [ ] No free strings / raw dicts in **any** layer incl. adapters/entrypoints (`AP-FREESTR-ANYLAYER`, `AP-DICT-AS-MODEL`); models over dicts (`PR-MODELS-OVER-DICTS`).

### Reuse & DRY across files
- [ ] New code surveyed for reuse before being written (`PR-SURVEY-FIRST`) — not a near-duplicate of a sibling.
- [ ] No constants/mappings duplicated across sibling modules (`AP-DUP-CONST`); shared infra not buried in one module (`AP-MISPLACED-SHARED-INFRA`).
- [ ] A dict crossing a boundary is a model, not magic keys (`AP-DICT-AS-MODEL`); compact, single-source shape (`PR-SSOT-DRY`, `PR-REUSE-COMPACT`).
- [ ] No large verbatim external copies (`AP-VERBATIM-EXTERNAL`); validation not duplicated (`AP-DUP-VALIDATION`).

### Security
- [ ] No exposed secrets/keys/credentials; input validated once at boundaries (`BP-VALIDATE-AT-BOUNDARY`).
- [ ] No injection (command/SQL/XSS); no OWASP-top-10 exposure. Sensitive-data handling per `guardrails`.

### Testing
- [ ] Unit tests per layer; Gherkin step defs for relevant scenarios.
- [ ] Edge cases and error scenarios from the EPIC covered.
- [ ] Coverage meets the per-layer threshold (`BP-COVERAGE-PER-LAYER`), not only overall.

### Spec conformance
- [ ] Matches the EPIC; all acceptance criteria met; no undocumented divergence.

### Fit & refactoring investigation
*(Lens L5 — recommendations only; the review never edits code.)*
- [ ] New code **fits** the existing code, architecture, and principles — surveyed before written, not a near-duplicate (`PR-SURVEY-FIRST`); misfits cited by the relevant catalogue id.
- [ ] Propose how the **new code and the existing code it touches** could be refactored toward a crisper, more elegant, effective solution (`PR-REUSE-COMPACT`, `PR-SSOT-DRY`).
- [ ] Each refactor candidate carries its **gitnexus blast radius** (`impact … direction: upstream`); HIGH/CRITICAL risk is reported with the recommendation. If gitnexus is unavailable, warn and proceed.

## Output format

Each lens subagent reports its own findings; a full standalone review **aggregates the five passes**
into one report. Tag each finding with its **lens** (L1–L5). Report by priority, each finding with
**file:line**, **what**, **why** (name the principle/id), **how to fix**:
- **Critical** — breaks functionality, security, or architecture boundaries (must fix before merge).
- **Warnings** — quality issues, missing non-critical coverage, naming.
- **Suggestions** — non-blocking improvements (includes L5 refactoring recommendations with blast radius).

## Boundary & Related Skills

**Owns:** the review criteria, the two modes (standalone subagent passes / interactive main-thread),
the five lenses + MECE boundaries, and the report format. **Does NOT** perform the standalone run
itself (external `code-review` / `code-reviewer` wrapper, one lens per subagent), fix code (the
`implementer` applies accepted fixes), or restate layer rules (`cosmic-python`). The fit & refactoring
investigation is **recommendations-only**.
**Related:** `cosmic-python`, `guardrails`, `meaningfy-git-workflow`, external `code-review`, `superpowers:requesting-code-review`, `superpowers:receiving-code-review`.
