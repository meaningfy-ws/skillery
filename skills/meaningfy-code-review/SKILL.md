---
name: meaningfy-code-review
description: The Meaningfy pre-PR review checklist and criteria — architecture conformance (layer direction), Clean Code/SOLID, security, testing, and spec conformance, reported by priority. Use to supply the review criteria for a Meaningfy change. Trigger on "Meaningfy review checklist", "architecture-conformance review", "review against cosmic-python layers", "pre-PR review criteria". For the read-only review run itself, use the external `code-review` command or the `code-reviewer` wrapper.
license: Apache 2.0
metadata:
  category: ai-coding
---

# Meaningfy Code-Review Checklist

## Overview

The **criteria** for a Meaningfy pre-PR review. This skill defines *what to check* and *how to
report*; the read-only review *run* is performed by the external `code-review` command or the
`code-reviewer` agent wrapper (which loads this skill). It references `cosmic-python` for the
layering rules rather than restating them.

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

## Output format

Report by priority, each finding with **file:line**, **what**, **why** (name the principle),
**how to fix**:
- **Critical** — breaks functionality, security, or architecture boundaries (must fix before merge).
- **Warnings** — quality issues, missing non-critical coverage, naming.
- **Suggestions** — non-blocking improvements.

## Boundary & Related Skills

**Owns:** the review criteria + report format. **Does NOT** perform the read-only run (external
`code-review` / `code-reviewer` wrapper), fix code, or restate layer rules (`cosmic-python`).
**Related:** `cosmic-python`, `guardrails`, `meaningfy-git-workflow`, external `code-review`, `superpowers:requesting-code-review`.
