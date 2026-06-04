# Definition of Done & Quality Gates

**Audience:** Meaningfy developers and agents working under the AI-coding methodology.

**Purpose:** the shared bar for "done" and the gates that enforce it. Referenced by
[AI Coding Methodology](ai-coding-methodology.md) and the
[AI Coding Runbook](ai-coding-runbook.md); this file is the single authority for the gate
definitions those documents summarise.

> This document concerns the **AI-coding workflow** (Work Shape → EPIC → Gherkin → task).
> For the *repository reorganization* quality gates, see `.claude/EPIC-setup-quality-gates.md`.

## Quality gates

| Gate | When | Owner | Pass condition |
|------|------|-------|----------------|
| **Clarity Gate** | Before an EPIC proceeds to implementation | `epic-planner` | Spec scores **≥ 9/10** on the 13-item checklist (see the `clarity-gate` skill); every claim grounded, every assumption visible |
| **Tests green** | After every generate-verify-integrate cycle | `implementer` | Full suite passes; failures triaged trivial-bug vs. design-failure (design failures fix the spec, not the code) |
| **Code review** | Before commit / PR | `code-reviewer` | No unaddressed Critical findings (architecture, security, spec conformance) — see the `meaningfy-code-review` skill |
| **Architecture check** | During review | `code-reviewer` + `importlinter` | Layer dependency direction respected (`entrypoints → services → models`, `adapters → models`); no forbidden imports |
| **Coverage** | CI | pipeline | **≥ 80%** on production code, higher on new/critical code |

## Definition of Done (a task)

A task is done when **all** hold:

- [ ] Implements its EPIC acceptance criteria; no undocumented divergence from the spec.
- [ ] Unit tests per affected layer (models, adapters, services, entrypoints); Gherkin step definitions implemented for the covering scenarios.
- [ ] Tests green; coverage ≥ 80% (and not lower than before).
- [ ] Architecture check passes (importlinter / `make check-architecture`).
- [ ] Code review passed with no open Critical findings.
- [ ] Task memory file written; EPIC roadmap updated.
- [ ] Committed only with explicit developer consent (per the runbook).

## Definition of Done (an EPIC)

- [ ] Every task in the breakdown is done by the above.
- [ ] Clarity Gate history recorded (the spec reached ≥ 9/10 before implementation).
- [ ] All Gherkin features pass; error-handling-matrix scenarios covered.
- [ ] PR opened referencing the EPIC and summarising outcomes.

## The two questions

- **Built right (verification):** tests green, coverage met, architecture check clean, review passed.
- **Right thing built (validation):** acceptance criteria and Gherkin scenarios — written from the EPIC and the Work Shape — demonstrably pass; the delivered behaviour matches the shaped intent.
