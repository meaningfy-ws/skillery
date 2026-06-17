# Definition of Done & Quality Gates (build tier)

**Audience:** Meaningfy developers and agents working under the two-tier method.

**Purpose:** the shared bar for "done" at the **BUILD tier** (one Epic), and the gates that enforce
it. This is the single authority for the gate definitions other docs summarise. See
[two-tier-methodology.md](two-tier-methodology.md) for the model and
[opsx-runbook.md](opsx-runbook.md) for the flow.

This is **one ladder** with two clearly-separated halves: the **engagement gates** (human/commercial,
below) sit *above* the **build gates** (automated, further down). They share one file so the
hand-off from selling to building is a single, legible sequence (Q8.2=A).

## Engagement gates (human / commercial)

These govern the engagement *above* the build tier (P0–P3 — see
[`docs/engagement/`](../engagement/README.md)). They are human/commercial sign-offs, a different
audience and cadence from the automated build gates.

| Gate | When | Enforcement |
|------|------|-------------|
| **Proposal signed** | end of P0 → P1 | human sign-off (commercial) — see [`proposal-writing`](../../skills/consulting/proposal-writing/SKILL.md) + [`estimation`](../../skills/consulting/estimation/SKILL.md) |
| **Decision accepted** | end of P1 | human sign-off (client) — the [`decision-package`](../../skills/consulting/decision-package/SKILL.md) is accepted |
| **Architecture accepted** | start of P2 | human sign-off **+** `openspec validate --strict` on the architecture spec |
| **Build DoD** | per Epic in P2 | the automated build-tier gate set below (EPIC-05) |

> **Commercial layer — TODO (to be shaped).** The wider commercial mechanics (qualification,
> pre-sale, sale, marketing, CRM & lead communication, service packaging, fit-for-market) are **not
> yet developed** — they are to be brainstormed, debated, and crystallised. This ladder covers only
> the stage gates that are already settled.

## The build-tier gate set

| Gate | Nature | Owner | Pass condition |
|------|--------|-------|----------------|
| **Clarity gate** | semantic | [`clarity-gate`](../../skills/ai-coding/clarity-gate/SKILL.md) | The PLAN (`design.md` + `tasks.md`) scores **≥ 9/10** on the rubric before implementation |
| **`openspec validate --strict`** | structural | spine ([`spec-stewardship`](../../skills/ai-coding/spec-stewardship/SKILL.md)) | Artifact shape + spec deltas are well-formed |
| **Tests green** | content | [`cosmic-python`](../../skills/engineering/cosmic-python/SKILL.md) + `superpowers:test-driven-development` | Full suite passes; design-failures fix the spec, not the code |
| **Coverage** | content | CI pipeline | **≥ 80%** on production code, higher on new/critical code |
| **Architecture check** | structural | [`cosmic-python`](../../skills/engineering/cosmic-python/SKILL.md) + import-linter | Layer direction respected (`entrypoints → services → models`, `adapters → models`); no forbidden imports |
| **Code review** | content | [`meaningfy-code-review`](../../skills/ai-coding/meaningfy-code-review/SKILL.md) | No unaddressed Critical findings (architecture, security, spec conformance) |

## The automation boundary (single source — other EPICs reference this)

- **`openspec validate --strict` is CI-automated** — it runs structurally in the pipeline (and in
  `make validate-spine`).
- **`clarity-gate` is a human/agent gate — NOT CI-automated.** It is semantic judgement; it cannot
  be reduced to a deterministic CI check. Do not assume CI enforces it.

Guardrails ([`guardrails`](../../skills/ai-coding/guardrails/SKILL.md)) reuse these same gates for
output validation — they do not add a parallel enforcement stack.

## Definition of Done (a task)

A task is done when **all** hold:

- [ ] Implements its EPIC acceptance criteria; no undocumented divergence from the spec.
- [ ] Unit tests per affected layer (models, adapters, services, entrypoints); BDD scenarios covered.
- [ ] Tests green; coverage ≥ 80% (and not lower than before).
- [ ] Architecture check passes (import-linter).
- [ ] Code review passed with no open Critical findings.
- [ ] Committed only with explicit developer consent.

## Definition of Done (an Epic)

- [ ] Every task in the breakdown is done by the above.
- [ ] Clarity-gate history recorded (the PLAN reached ≥ 9/10 before implementation).
- [ ] `openspec validate --strict` passes on the change's deltas.
- [ ] All `.feature` scenarios pass; error-matrix scenarios covered.
- [ ] Change verified, then synced/archived into `openspec/specs/`.

## The two questions

- **Built right (verification):** tests green, coverage met, architecture check clean, review passed.
- **Right thing built (validation):** acceptance criteria and `.feature` scenarios — written from
  the EPIC — demonstrably pass; the delivered behaviour matches the shaped bet.
