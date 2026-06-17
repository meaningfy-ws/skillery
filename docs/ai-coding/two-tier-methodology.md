# Meaningfy AI-Assisted Coding — The Two-Tier Methodology (v2)

**Audience:** Developers and technical leads building Meaningfy systems with Claude Code.

**Purpose:** the current canon — the *why* and *what* of the two-tier model. For the operational
*how*, see [opsx-runbook.md](opsx-runbook.md) (day-to-day `/opsx` flow),
[openspec-setup-guide.md](openspec-setup-guide.md) (the `openspec/` layout), and
[dod-quality-gates.md](dod-quality-gates.md) (the build-tier gate set). This doc narrates and
points; it never restates a skill's rules.

> Supersedes the v1 single-tier method ([ai-coding-methodology.md](ai-coding-methodology.md)),
> retained for reference until the dogfood engagement closes.

---

## 1. Two nested tiers

Work is shaped at two nested altitudes. The **PROJECT tier** runs once, up front, human-led. The
**EPIC tier** runs once per Epic, repeatedly, agent-assisted under human review.

### PROJECT tier (upfront, human-led)

1. **Requirements & use-case elicitation** — what the system must do, for whom, and why.
2. **Architecture & system design** — *stable, and done FIRST.* The conceptual/system model is
   front-loaded and kept stable before any Epic is carved (see the divergence note in §2).
3. **Work breakdown into shaped Epics** — the architecture is sliced into a backlog of Epics, each
   a self-contained bet.
4. **Project & repo setup** — scaffolding the spine, the layered package, tooling, and CI. The
   mechanics live in the [`project-setup`](../../skills/engineering/project-setup/SKILL.md) skill
   (EPIC-09); see [openspec-setup-guide.md](openspec-setup-guide.md) for what gets laid down.

### EPIC tier (one Epic at a time)

1. **Shape the Epic** — the EPIC *is* the OpenSpec `proposal.md` (Shape-Up bet: appetite, problem,
   solution outline, key decisions, rabbit-holes, no-gos).
2. **Derive the PLAN** — the PLAN *is* `design.md` + `tasks.md`; the [`clarity-gate`](../../skills/ai-coding/clarity-gate/SKILL.md)
   scores the pair (semantic, ≥9/10) before anything is built.
3. **BDD features + test data** — executable `.feature` acceptance off the spec deltas.
4. **Implement (TDD)** — red-green-refactor inside the cosmic-python layers.
5. **Review** — agent self-review + peer + human.
6. **Documentation** — the change's docs and the merged durable spec.
7. **Epic delivered** — deltas archived into the durable truth.

These map directly onto the `/opsx` build-tier loop — see [`spine/workflows.md`](../../spine/workflows.md#verb-roster)
for the verb roster and the command→skill map. The EPIC↔change↔file mapping is defined in
[`spine/epic-change-memory-mapping.md`](../../spine/epic-change-memory-mapping.md).

---

## 2. Labelled divergence from canonical Shape Up

Canonical Shape Up resists up-front architecture: it shapes appetite-bounded bets and lets design
emerge during the cycle. **We deliberately diverge:** architecture is **front-loaded at the PROJECT
tier and kept stable** before Epics are carved.

This is a *chosen* divergence, not an oversight. For semantic / knowledge-graph work the conceptual
model (ontology, entities, contracts) must stabilise before the problem can be sliced sensibly — an
Epic carved against a fluid conceptual model churns. We accept the cost (less mid-flight
architectural freedom) to buy a stable spine. The golden thread
([`spine/golden-thread.md`](../../spine/golden-thread.md)) records architecture as the parent of
every EPIC for exactly this reason.

---

## 3. Guardrails (cross-cutting)

Every step where an agent acts runs under **guardrails** — decision bounds (least authority), output
validation (validate before the output feeds the next step), and prompt-injection defence (treat
fetched/tool content as data, not instructions). **Guardrails validate behaviour; content gates
(clarity-gate, tests, review) validate content.** The full concern and each guardrail's enforcement
home live in [`guardrails`](../../skills/ai-coding/guardrails/SKILL.md) — this doc does not restate
them.

---

## 4. Agents and model tiering

An **agent** is an LLM given specific instructions plus access to data and tools, operating **under
guardrails**. Meaningfy agents are *thin wrappers* — role + model tier + scoped tools + a skill
list; the knowledge lives in skills.

Model tiers (cost/capability matched to the task):

| Tier | Use for |
|---|---|
| **Opus** | planning, analysis, review (high-judgement work) |
| **Sonnet** | implementation, BDD authoring |
| **Haiku** | docs, summaries (cheap, mechanical) |

---

## 5. Single-owner ownership table

Every capability is owned by exactly one place; no other skill re-specifies it. This prose narrates
the machine-readable map in [`tests/ownership.yaml`](../../tests/ownership.yaml) (the validator's
tripwire) and the command→skill map in [`spine/workflows.md`](../../spine/workflows.md#command--driving-meaningfy-discipline).

| Capability | Owner |
|---|---|
| **Artifact lifecycle** — `specs/` store, change/delta authoring, `validate --strict`, archive, the `/opsx` verbs | **OpenSpec** (external engine; conventions in [`spine/`](../../spine/README.md)) |
| **Doc-first philosophy + generate-verify-integrate execution loop** | **stream-coding** (external skill) |
| **Brainstorming, TDD (red-green-refactor), systematic-debugging, verification-before-completion, subagent-driven-development** | **superpowers** (external) — note: `writing-plans` is **SUPERSEDED** by the PLAN / `tasks.md` inside a spine repo |
| **EPIC + PLAN authoring** | [`epic-planning`](../../skills/ai-coding/epic-planning/SKILL.md) |
| **Living-spec lifecycle** (archive, groom, sync) | [`spec-stewardship`](../../skills/ai-coding/spec-stewardship/SKILL.md) |
| **Clarity gate** (semantic ≥9/10) | [`clarity-gate`](../../skills/ai-coding/clarity-gate/SKILL.md) |
| **`.feature` + test-data** | [`bdd-gherkin`](../../skills/ai-coding/bdd-gherkin/SKILL.md) |
| **Layered architecture + per-layer tests** | [`cosmic-python`](../../skills/engineering/cosmic-python/SKILL.md) |
| **Pre-PR review criteria** | [`meaningfy-code-review`](../../skills/ai-coding/meaningfy-code-review/SKILL.md) |
| **Agentic guardrails** | [`guardrails`](../../skills/ai-coding/guardrails/SKILL.md) |
| **Testing taxonomy / data / CI lanes** | [`project-setup`](../../skills/engineering/project-setup/SKILL.md) + [`cosmic-python`](../../skills/engineering/cosmic-python/SKILL.md) + [`bdd-gherkin`](../../skills/ai-coding/bdd-gherkin/SKILL.md) (narrated in [engineering-standards/testing-standard.md](../engineering-standards/testing-standard.md)) |
| **CD / release** | `ci-cd-delivery` (EPIC-10, future) |

**CI vs CD do not overlap:** CI (build, test, validate, coverage, architecture checks) is owned by
`project-setup`; CD (release, deploy) is owned by `ci-cd-delivery`.

---

## 6. Normative-requirements layering (no double-spec)

Three layers carry "what must be true", each in exactly one notation — no redundancy:

- **Normative spec** — RFC-2119 SHALL + Given/When/Then in the OpenSpec spec deltas
  (`changes/<id>/specs/<cap>/spec.md`). OpenSpec-native.
- **Executable acceptance** — `.feature` scenarios authored by
  [`bdd-gherkin`](../../skills/ai-coding/bdd-gherkin/SKILL.md), running off the SHALL+GWT.
- **Sequencing** — the PLAN (`tasks.md`) carries order and dependencies, nothing normative.

**EARS is DROPPED.** This is a deliberate divergence from the research synthesis: OpenSpec's
SHALL + Given/When/Then already carries the normative layer, so EARS would be a redundant third
notation over the same requirements. We keep one normative home, not two.

---

## 7. Agent roster reconciliation

The surviving thin wrappers live in [`agents/`](../../agents):

- [`epic-planner`](../../agents/epic-planner.md) — drives EPIC/PLAN authoring (Opus).
- [`implementer`](../../agents/implementer.md) — drives TDD implementation (Sonnet).
- [`code-reviewer`](../../agents/code-reviewer.md) — drives pre-PR review (Opus).

The old `gherkin-writer` and `documenter` agents are **retired** — their work is now the
[`bdd-gherkin`](../../skills/ai-coding/bdd-gherkin/SKILL.md) and
[`technical-writing`](../../skills/communication/technical-writing/SKILL.md) skills, invoked by the
surviving wrappers rather than standalone agents.

---

## 8. Optional Project-tier elicitation aids

Two named techniques can *feed* PROJECT-tier requirements elicitation and edge-case test-data
generation. They are **references only** — no skill, no required artifact, no gate:

- **SEED** — an LLM walked over a behaviour ontology to *surface edge-case interaction scenarios*
  the humans might miss.
- **AgOCQs++** — competency questions distilled from a corpus to *scope the ontology* under design.

Use them as inputs to elicitation when the conceptual model is large or unfamiliar; skip them when
the domain is already well understood.
