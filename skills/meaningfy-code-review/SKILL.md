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

### Architecture conformance
- [ ] Dependency direction respected: `entrypoints → services → models`, `adapters → models`.
- [ ] No imports from higher layers into lower layers; no circular deps.
- [ ] Models contain no I/O or framework dependencies.
- [ ] Business logic lives in services/models, not adapters/entrypoints.

### Code quality (Clean Code + SOLID)
- [ ] Small, single-responsibility functions/classes (SRP); intention-revealing names.
- [ ] No deep nesting, no unnecessary duplication, no clever tricks.
- [ ] No raw dicts / magic strings in models or services — domain models, constants, enums.
- [ ] Extend via new classes/strategies, not piled-up conditionals (OCP); depend on abstractions (DIP).

### Security
- [ ] No exposed secrets/keys/credentials; input validation at boundaries.
- [ ] No injection (command/SQL/XSS); no OWASP-top-10 exposure.

### Testing
- [ ] Unit tests per layer; Gherkin step defs for relevant scenarios.
- [ ] Edge cases and error scenarios from the EPIC covered.
- [ ] Coverage meets project threshold (≥ 80%).

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
**Related:** `cosmic-python`, external `code-review`, `superpowers:requesting-code-review`.
