# EPIC: Two-mode PR review with refactoring investigation

## Appetite

Small–medium. Editorial + behavioural changes to one skill and one agent (plus a thin doc/wiring touch). No production code, no new dependencies. A few focused sessions.

## Why

The `meaningfy-code-review` skill and `code-reviewer` agent only do a one-shot, fire-and-forget pass: they check the change against the checklist but never (a) hold a conversation with the developer about the findings, nor (b) investigate how the new code — and the existing code it touches — could be refactored into a better, crisper fit. Reviewers want both a hands-off gate *and* a thinking partner, and they want fit/elegance assessed, not just rule compliance.

## Solution outline

Give the review **two modes**, owned by the skill, distinguished by where the work happens:

- **Standalone (default)** — the read-only analysis, run as a **series of single-lens subagent passes** (one lens per subagent run), then aggregated into prioritised findings. No dialogue.
- **Interactive** — entered when the developer starts discussing the PR code. Runs in the **main thread** (a subagent cannot converse), where the reviewer becomes a thinking partner over the *returned, aggregated* findings: explains them, weighs trade-offs, and co-designs fixes with the developer.

The review **analysis always runs in subagents**, isolated from the implementation/main context, so review reasoning never pollutes implementation context. The analysis is decomposed into a fixed set of **lenses** — each lens is one subagent run addressing a bundle of aspects:

- **L1 · Security & safety** — secrets/credentials, injection/OWASP, validate-at-boundary, sensitive-data handling.
- **L2 · Spec correctness & tests** — conformance to the EPIC **requirements** (the specs, not the plan): acceptance criteria, edge/error scenarios, no undocumented divergence; proven by per-layer unit tests + Gherkin step defs.
- **L3 · Architecture conformance** — layer law / dependency direction, no cycles, component-first, I/O-not-in-models, logic-not-in-edges, no cross-variant imports.
- **L4 · Principles & clean code** — SOLID, intention-revealing names, no free strings / raw dicts in any layer, constants/enums in one home, exceptions module.
- **L5 · Fit, elegance & refactoring** — survey-first fit to existing code, reuse & compactness, no duplication/misplaced-infra/over-fragmentation, and the refactoring investigation of new + touched code with gitnexus blast radius.

Add a **fit-and-refactoring investigation** as a first-class review dimension in both modes: assess whether the EPIC's change fits the existing code and honours the architecture and named principles (`cosmic-python` layering, SOLID, KISS/DRY), then propose how the new code — and the existing code it touches — could be refactored toward a more elegant, crisp, effective solution. Use **gitnexus** to discover the blast radius of any code flagged for refactoring, so recommendations carry their risk. The investigation produces **recommendations only**; the review never edits code (the `implementer` applies what's accepted).

Outcome: a review that is by default an unattended quality gate, becomes a collaborator the moment the developer engages, and always reports not just "what's wrong" but "how this could fit better."

## Key decisions

- **DEC-1**: The skill owns **both modes**; the interactive mode runs in the **main thread**, the standalone analysis runs in **subagents** only — because a dispatched subagent runs to completion and cannot hold a back-and-forth.
- **DEC-7**: The standalone analysis is decomposed into a **fixed set of 5 lenses** (L1 security, L2 spec-correctness+tests, L3 architecture, L4 principles+clean-code, L5 fit+elegance+refactoring); **each lens is one subagent run**. Lenses bundle aspects and anchor to existing catalogue ids — no new entries are minted (DEC-6).
- **DEC-8**: The review analysis is **always triggered in subagent execution(s)**, isolated from the implementation/main context. A review is never run inline in the implementation context; only the aggregation + interactive discussion of returned findings happen in the main thread.
- **DEC-2**: Interactive mode is **triggered by the developer engaging** with the PR code/findings; standalone is the default when no discussion is started.
- **DEC-3**: The fit-and-refactoring investigation is **recommendations-only**; the review keeps its **read-only** contract. Accepted refactors are applied later by the `implementer`.
- **DEC-4**: Refactoring scope is the **new code plus the existing code it touches**; **gitnexus** blast-radius (`impact … direction: upstream`) qualifies every refactor recommendation with its risk.
- **DEC-5**: The cited catalogue ids (`AP-*`, `PR-*`, `BP-*`) are **kept** — they are the single-source-of-authority mechanism (`code-principles-governance`), not cryptic noise. Each checklist line **keeps its brief human gloss** alongside the id.
- **DEC-6**: **No anti-patterns are moved.** The four named in intake (`AP-IO-IN-MODELS`, `AP-FREESTR-ANYLAYER`, `AP-DICT-AS-MODEL`, `AP-DUP-CONST`) already live in the `cosmic-python` catalogue; the checklist already only cites them. Any change here is editorial wording, not relocation.

## Rabbit-holes

- Do **not** build a generic "interactive agent" framework or a mode-detection state machine — interactive mode is a main-thread skill protocol, not new machinery.
- Do **not** let the refactoring dimension drift into applying edits or large rewrites — recommendations with blast radius, full stop.
- Do **not** re-open the catalogue's rule text or re-home its entries (DEC-6); resist "while we're here" refactors of `cosmic-python`.
- Avoid coupling the skill to a specific gitnexus availability — degrade gracefully when the index is absent (the agent already warns-and-proceeds).

## No-gos

- No applying refactors or any code edits from the review (read-only stays read-only).
- No moving/renaming/restating `cosmic-python` catalogue entries.
- No new dependencies, CLI, or run-harness command (continues to lean on the external `code-review` / `code-reviewer` wrapper for the standalone run).
- No changes to `superpowers:*` or `ponytail-review`; this EPIC does not consolidate external review lenses.
- No model/tooling change to make the subagent itself conversational.

---

## What Changes

- `meaningfy-code-review` skill: define the **two modes** (standalone default, interactive in main thread), the **5 lenses** (one subagent run each, with the aspects each bundles + the catalogue ids it anchors to), the **interactive protocol** (thinking-partner behaviour over aggregated findings, trigger), and a new **fit-and-refactoring investigation** owned by lens L5 (gitnexus blast radius; recommendations-only).
- `code-reviewer` agent: scope it to a **single-lens subagent run** parameterised by the lens to apply (default: run all 5 lenses as separate passes); add the L5 fit-and-refactoring step (with gitnexus blast radius); keep it read-only; always invoked as a subagent (DEC-8).
- Editorial: keep cited ids + brief glosses (DEC-5); no catalogue relocation (DEC-6).
- Update the skill's **Boundary & Related Skills** to reflect the two modes and the main-thread interactive home.

## Capabilities

### New Capabilities

- `pr-review-modes`: the two review modes (standalone vs interactive), where each runs, the always-subagent isolation rule, the fixed 5-lens decomposition (one subagent run per lens), the interactive trigger and thinking-partner protocol, and the fit-and-refactoring investigation dimension (recommendations-only, gitnexus blast radius).

### Modified Capabilities

<!-- None. code-principles-governance is unchanged: the cited ids stay, no entries move (DEC-5, DEC-6). -->

## Impact

- `skills/meaningfy-code-review/SKILL.md` — new sections (modes, interactive protocol, fit-and-refactoring), boundary update.
- `agents/code-reviewer.md` — standalone scoping + refactoring-investigation process step.
- No code, dependencies, or APIs affected. `make validate` (catalogue single-source, reciprocal related-skills, triggers) must stay green.
- Relies on existing `gitnexus` MCP tooling for blast radius; degrades gracefully when unavailable.
