# Reuse or precision: a posture for each skill

**Status:** analysis input for the PLAN, a companion to
[`2026-10-26-defect-analysis.md`](2026-10-26-defect-analysis.md). Produced 2026-10-26 against
v3.0.0. The question it answers: for each skill, should a fix **widen** it (maximise reuse across
domains and activities) or **harden** it (add precision and guardrails)? The wrong choice in either
direction produces the defects in the inventory.

## 1. The two failure directions

| Direction | What it looks like | Seen in |
|---|---|---|
| **Too generic** | The trigger fires on everything, so the skill's defaults are applied where they do not fit | `executive-communication` applied a pitch structure and a conversational tone to a formal quotation (W2) |
| **Too specific** | The method transfers, but its domain is baked into the rules or examples, so it misfires or stays silent elsewhere | `proposal-writing` covers one offer shape only (SO-1); semantic-consulting examples leak semantic positioning into SME offers (W2 item 3) |

The worst case is both at once: a **broad trigger with narrow content**. A broad trigger alone is
fine when the content is truly general, and a narrow content alone is fine when the trigger is
narrow too.

## 2. Decision rule

For each skill, ask two questions:

1. **Does the method hold outside Meaningfy's domain and outside the activity it was written for?**
   (Minto's pyramid holds for any decision; the vault layout holds only in a Meaningfy vault.)
2. **What does a wrong fire or a wrong default cost?** (A weak paragraph costs little. A wrong file
   move, a wrong price or a contractual commitment costs a lot.)

| Method transfers? | Cost of error | Posture | What a fix does |
|---|---|---|---|
| yes | low | **R: Reusable core** | Keep the method domain-free. Harden only the trigger edge: a near-miss probe, a "not for" clause. Domain and house content go in swappable `references/`. |
| yes | high | **C: Core + profiles** | A domain-free method plus **explicit switches** (register, genre, offer shape, domain) that select a profile. Never an implied default. Add a preconditions step: "which profile applies?" |
| no | any | **P: Precise house standard** | Do not generalise. Harden with guardrails: hard rules, stop conditions, refusals with a route, a final check, `ownership.yaml` tripwires. |

## 3. Hardening and reuse tools

**Guardrails for P and C skills**

1. Description scope words plus a **"Not for …"** clause that names where to go instead.
2. A **near-miss probe** in `tests/trigger_probes.yaml`.
3. An **applicability step** at the start: preconditions, plus the profile or switch chosen and stated.
4. **Stop and route** lines: "if X, stop and use Y".
5. A **self-check or final check**: one mechanical checklist, not prose.
6. An **`ownership.yaml` tripwire** for facts that must not be restated.

**Reuse levers for R and C skills**

1. The method lives in `SKILL.md`, the domain in `references/`.
2. Neighbours **cite** rather than restate.
3. **Worked examples from at least two domains**: a model infers the domain from the examples, so a
   single-domain example set is a hidden rule.
4. Defaults are named as **profiles** ("default profile: Meaningfy"), so a user can swap them.

**Systemic gap found.** The method requires "one positive and one near-miss probe" per description
change. `tests/trigger_probes.yaml` has **30 probes, all positive, 0 near-misses**. So the
trigger-edge guardrail that R skills rely on does not exist yet. That is the most effective single
hardening action for the generic skills, and it is in scope (probes are explicitly allowed).

## 4. Posture per skill (all 31)

| Skill | Posture | Evidence | Action in this EPIC |
|---|---|---|---|
| `writing-antipatterns` | **R** | genre map is domain-free | widen: U7/U8 are general defects (W1); the positive-form rule is guarded (genre-dependent) |
| `technical-writing` | **R** | 51 lines; trigger "explain how X works" overlaps `explanatory-writing` (its own Explanation sub-mode) | near-miss probe against `explanatory-writing` |
| `explanatory-writing` | **R** | craft moves are domain-free | near-miss probe against `technical-writing` |
| `clarity-gate` | **R** | rubric applies to any spec | none |
| `bdd-gherkin` | **R** | domain-free | none |
| `modelling-conventions` | **R** | explicitly "shared craft" | none |
| `guardrails` | **R** | applies to any agent step | none; it is the catalogue the P skills draw on |
| `estimation` | **R** | PERT and work breakdown are domain-free | none; it stays the owner of numbers for SO-1 |
| `spec-stewardship`, `epic-planning` | **R** | OpenSpec spine, any repo | `epic-planning`: one boundary line (work-shape vs EPIC, V5) |
| `architecture` | **R** | C4, ADRs: domain-free | none |
| **`executive-communication`** | **C** (today: broad trigger, narrow content) | "When to use" lists proposal, email and Slack; "When NOT" excludes only chat and code; the voice examples are all semantic; registers are teach and decide only | **harden + profile** (W2, below) |
| **`proposal-writing`** | **C** (today: too specific) | one offer shape (P1 Decision Phase) | generalise via SO-1 `offer-writing` (core) with shape profiles; until then add "Not for: tenders, framework orders, SME quotations → no skill yet, say so" |
| **`decision-package`** | **C** (today: too specific) | description ties it to a "semantic/data consulting engagement"; its anatomy (recommendation, scope, roadmap, buy/build/defer) transfers to SME digitalisation and AI work | flag only: the wording is a boundary move, so it goes to SO-2 `define-blc-engagement-model` |
| `semantic-consulting-coach` | **P** | domain in its name, 77 domain mentions | keep precise; do **not** add SME or AI service lines here (W2 item 6 belongs in `docs/ai-sales/services/`); ladder terms in SO-2 |
| `vault-*` (9 skills) | **P** | only valid in a Meaningfy vault; errors move or lose notes | **harden**: one hub (`vault-conventions`) holding the move/delete guardrails, project homes and a sections check (V1–V5); the others cite it |
| `cosmic-python`, `meaningfy-code-review` | **P** | Python-specific by design | none |
| `project-setup`, `ci-cd-delivery`, `meaningfy-git-workflow`, `meaningfy-release` | **P** | house policy | none |
| `conceptual-modelling`, `linkml-engineering` | **P** | LinkML and OWL stack | none |

## 5. What changes in the inventory

| Finding | Posture | Effect on the fix |
|---|---|---|
| **W1** | R | Unchanged. U7 and U8 are **general** rules because they hold in every domain. The examples in the new entries should come from at least two domains (semantic copy and SME/AI copy) so they do not re-teach the semantic domain. |
| **W2** | C | Sharpened. The skill keeps its broad reuse (Minto and SCQA transfer) and gains precision through **switches**, not by narrowing its trigger:<br>1. **Register switch**: teach / decide / **bind**. Bind is the contractual register and routes to the Contract genre.<br>2. **"When NOT"** gains: "a contractual document (quotation, SoW, tender): this skill writes only its cover message or executive summary; the document's structure belongs to the offer skill".<br>3. **Domain from the request, not the examples**: add one SME/AI worked example beside the semantic one, and mark the key-ideas content (if adopted) as marketing-only.<br>4. **Applicability step**: state the register and audience before drafting.<br>5. Near-miss probe: "write the quotation for this SME package" must not resolve to `executive-communication` alone. |
| **SO-1** | C | Shaped as **core + shape profiles**: the twelve-question anatomy is the core; Decision Phase, tender, framework order, phased pilot and SME quotation are profiles. `proposal-writing` becomes the Decision Phase profile. This is the reuse answer to a too-specific skill, and it absorbs W2's quotation playbook. |
| **V1–V5** | P | Unchanged in direction, now justified: the vault is a precise house standard, so the fix is **guardrails** (owner-requested mode, trash not delete, unique-name check, link report, memory warning, a sections check), concentrated in one hub so the precision is stated once. |
| **New: G1** | R | **Near-miss probes** for the generic skills whose triggers collide: `executive-communication` vs `proposal-writing` (quotation), `technical-writing` vs `explanatory-writing` ("explain how X works"), `writing-antipatterns` vs `executive-communication` ("why does this read badly"), and `vault-promote` vs `vault-tidy`. Batch E. |

**Rule for future fixes**, proposed for `docs/development-method.md` (one paragraph, owned there):
before editing a skill, name its posture (R, C or P). An R fix must not add domain content to
`SKILL.md`. A C fix adds a switch or a profile, never a silent default. A P fix adds a guardrail
with an enforcement home. The posture decides whether a fix widens or hardens.
