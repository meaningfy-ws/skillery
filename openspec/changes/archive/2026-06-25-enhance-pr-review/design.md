# PLAN (design) — Two-mode PR review with refactoring investigation

> Parent: [`proposal.md`](./proposal.md) — EPIC "Two-mode PR review with refactoring investigation"

## Context

`meaningfy-code-review` (skill) owns the review *criteria* + report format; `agents/code-reviewer.md`
(agent) is the read-only run that loads the skill + `cosmic-python`. Today the flow is single-shot:
the agent runs the checklist, returns Critical/Warnings/Suggestions, and stops. There is no
conversational follow-up and no dimension that asks "could this fit better?" — only rule compliance.
Both artifacts are Markdown; there is no production code. The catalogue
(`cosmic-python:references/principles-and-anti-patterns.md`) is the single source of authority for all
rule text and is enforced by `make validate` (single-source, reciprocal related-skills, triggers).

## Goals / Non-Goals

**Goals:**
- Two named review modes with explicit homes (standalone = agent; interactive = main thread).
- An interactive thinking-partner protocol entered when the developer engages.
- A fit-and-refactoring investigation dimension in both modes, recommendations-only, with gitnexus
  blast radius for refactor candidates.
- Keep cited ids + brief glosses; keep the catalogue untouched; keep `make validate` green.

**Non-Goals:**
- No applied edits, no run-harness command, no new deps, no catalogue relocation, no changes to
  `superpowers:*` / `ponytail-review`, no conversational subagent (see EPIC No-gos).

## Decisions

(Settled bets cited, not re-argued: DEC-1 mode homes, DEC-2 interactive trigger, DEC-3 read-only
recommendations, DEC-4 refactor scope + gitnexus, DEC-5 keep ids+gloss, DEC-6 no relocation.)

New planning-level choices:
- **D-E — Five lenses, mapped onto the existing checklist sections.** The current checklist already
  has six headings (Architecture, Code quality, Reuse & DRY, Security, Testing, Spec conformance);
  the five lenses **re-bundle** them: L1=Security, L2=Testing+Spec conformance, L3=Architecture,
  L4=Code quality, L5=Reuse & DRY + the new refactoring investigation. No catalogue entries are added
  (DEC-7) — each lens is a *view* over existing ids. A 6th lens (splitting tests out of L2) rejected as
  fragmentation.
- **D-F — One `code-reviewer` invocation per lens; the dispatcher lives in the main thread / command,
  not in the agent.** `code-reviewer` has read-only tools (no `Agent`/`Task`), so it cannot fan out
  itself. The agent gains a **lens input** (which lens to apply; default = a note that the caller runs
  all five as separate passes). The main thread (or the external `code-review` command) dispatches the
  five subagent runs and aggregates — mirroring the official `code-review` command's parallel-agent
  pattern. This satisfies "always a subagent" (DEC-8) without new machinery in the agent.
- **D-A — Modes documented as one "## Review modes" section in the skill, not a new skill.** The
  two modes are a few paragraphs of protocol, not machinery; a sibling skill would fragment the
  criteria (`PR-REUSE-COMPACT`, EPIC rabbit-hole "no framework"). Alternative (new `pr-review-interactive`
  skill) rejected as over-fragmentation (`AP-OVER-FRAGMENTATION`).
- **D-B — Fit-and-refactoring is a new checklist section ("### Fit & refactoring investigation"),
  reusing existing principle ids** (`PR-SURVEY-FIRST`, `PR-REUSE-COMPACT`, `PR-SSOT-DRY`, the layer
  AP-*). No new catalogue entries are minted — the principles already exist; the section composes
  them into a review lens. Keeps DEC-6 intact.
- **D-C — Interactive trigger is behavioural, not detected by code.** The skill states the rule
  ("default standalone; when the developer discusses the PR code/findings, continue in the main thread
  as a thinking partner"); the main-thread Claude follows it. No mode flag, no state machine.
- **D-D — gitnexus step reuses the agent's existing blast-radius pattern.** The agent already runs
  `gitnexus_impact({target, direction: "upstream"})` for modified symbols and warns-and-proceeds when
  unavailable; the refactoring investigation extends that same step to *refactor candidates* (new code
  + touched existing code), not just modified symbols.

## Algorithm / approach

**Skill (`meaningfy-code-review/SKILL.md`)** — add two sections and update the boundary:

1. `## Review modes`
   - **Standalone (default):** the analysis runs as **five single-lens subagent passes** (DEC-7,
     DEC-8), aggregated into one prioritised report; no dialogue. (DEC-1)
   - **Interactive:** entered when the developer starts discussing the PR code or findings (DEC-2);
     runs in the **main thread** over the *aggregated* findings; the reviewer explains findings, weighs
     trade-offs against cited principles, and co-designs fixes. Read-only — accepted fixes go to the
     `implementer`. (DEC-3)
   - `### Lenses` table: L1–L5, the aspects each bundles, and the catalogue ids each anchors to
     (a view over the existing checklist, no new ids — D-E). One lens = one subagent run.
2. `### Fit & refactoring investigation` (new checklist subsection, both modes)
   - Does the change fit existing code + architecture + principles? (cite `PR-SURVEY-FIRST`,
     `cosmic-python` layer law, SOLID, `AP-*` for misfits.)
   - How could the **new code** and the **existing code it touches** be refactored for a crisper,
     more elegant, effective solution? (cite `PR-REUSE-COMPACT`, `PR-SSOT-DRY`.)
   - For each refactor candidate, report **gitnexus blast radius** (upstream) and HIGH/CRITICAL risk.
     (DEC-4)
   - Output is **recommendations only** — no edits. (DEC-3)
3. Update `## Boundary & Related Skills`: two modes, interactive home = main thread, refactoring is
   recommendations-only.

**Agent (`agents/code-reviewer.md`)** — scope + lens input + one process step:
- State it performs **one lens of the standalone analysis per subagent run** (interactive lives in
  the main thread per the skill); accepts a **lens input** (L1–L5; default note = caller runs all five).
- Add the L5 process step: "Fit & refactoring investigation — assess fit; propose refactors for new +
  touched code; run gitnexus blast radius on each refactor candidate; report as recommendations."
- Keep read-only (no Write/Edit) unchanged; always invoked as a subagent (DEC-8).

**Aspects not named at intake, folded into the lenses (each must appear in the skill's lens table):**
- L1 — input **validation-at-boundary** (`BP-VALIDATE-AT-BOUNDARY`); OWASP-top-10 beyond injection;
  duplicated validation (`AP-DUP-VALIDATION`).
- L2 — **per-layer test coverage** not just overall (`BP-COVERAGE-PER-LAYER`); edge/error scenarios;
  Gherkin step-def presence.
- L3 — **no import cycles**; **component-first vs parallel layouts** (`AP-PARALLEL-LAYOUTS`); DAG/tools→main
  one-way only.
- L4 — **domain-revealing names / no generic module names** (`BP-DOMAIN-REVEALING-NAMES`,
  `AP-GENERIC-MODULE-NAMES`); **exceptions module** (`BP-EXCEPTIONS-MODULE`, `AP-EXCEPTIONS-EMBEDDED`);
  **constants/enums homing** (`BP-CONSTANTS-ENUMS`, `BP-CONSTANTS-HOME`); deep nesting.
- L5 — **over-fragmentation** (`AP-OVER-FRAGMENTATION`); **misplaced shared infra**
  (`AP-MISPLACED-SHARED-INFRA`); verbatim external copies (`AP-VERBATIM-EXTERNAL`);
  config-source decoupling (`PR-CONFIG-DECOUPLED`).

Worked example: a new adapter duplicates a sibling's SPARQL-key constants → standalone finds it,
cites `AP-DUP-CONST`, recommends lifting to a shared module, and reports the upstream blast radius of
the existing constants. If the developer then asks "is that lift worth it given X?" → interactive mode
discusses the trade-off in the main thread, still applying nothing.

Idempotency: reviews are pure reads; re-running is inherently safe (no state mutated).

### Anti-patterns
- ❌ A new `pr-review-interactive` skill or a mode-detection state machine (over-fragmentation /
  speculative machinery).
- ❌ Restating any catalogue rule text or re-homing entries (single-source breach — DEC-6).
- ❌ The review applying refactors or any edit (breaks read-only contract — DEC-3).
- ❌ Coupling the refactoring step to gitnexus being present (must warn-and-proceed).
- ❌ Running a lens analysis inline in the main/implementation context (defeats the isolation in
  DEC-8 — every lens analysis is dispatched as a subagent; only aggregation/discussion is in-thread).
- ❌ Minting a new lens or a new catalogue id for an aspect that an existing id already covers
  (DEC-6/DEC-7 — lenses are views over existing ids, not a new taxonomy).
- ❌ Lens overlap — the same finding reported under two lenses (see the MECE note below).

### Lens MECE boundaries
The five lenses are **mutually exclusive, collectively exhaustive** over the existing six checklist
sections (D-E). Boundary rules that resolve the near-overlaps:
- **L3 vs L4** — L3 owns *cross-file/structural* rules (layer direction, cycles, layout, I/O-in-models,
  logic-in-edges); L4 owns *within-unit* code quality (SOLID, naming, free strings, dicts, exceptions,
  constants). A misplaced import is L3; a magic string is L4.
- **L4 vs L5** — L4 flags a *local* quality defect as-is; L5 owns *cross-file reuse/fit* and the
  *forward-looking refactoring* (survey-first, compactness, dedup, the gitnexus investigation). "This
  name is unclear" is L4; "this duplicates the sibling, lift it" is L5.
- **L2 vs all** — L2 is the only lens that judges against the **requirements/specs** (correctness +
  the tests proving it); the others judge the code against principles regardless of requirements.

## Error matrix

| Failure mode | Expected handling |
|---|---|
| gitnexus index unavailable during refactor investigation | Warn "blast radius unavailable", proceed with the rest of the review (DEC-4) |
| Developer engages but no agent run happened yet | Run standalone first (or read the diff), then continue interactively |
| Refactor candidate has HIGH/CRITICAL upstream impact | Report the risk with the recommendation; do not imply it is safe |
| `make validate` flags a single-source breach after edits | Replace any restated text with an id citation; do not relocate entries |

## Risks / Trade-offs

- **[Risk] Interactive protocol is prose, so adherence depends on the main-thread model.** →
  Mitigation: state the trigger and the read-only rule crisply; it mirrors `superpowers:receiving-code-review`
  discipline already in the ecosystem.
- **[Risk] Refactoring dimension invites scope creep into rewrites.** → Mitigation: EPIC rabbit-hole +
  D-B cap it to recommendations citing existing principles; no edits (DEC-3).
- **[Risk] Editorial glosses drift from catalogue text over time.** → Mitigation: glosses stay
  one-line and cite the id; the id remains authority; validator guards restatement.

## Open Questions

- None blocking. (Whether to later add a worked interactive transcript to the skill is a nice-to-have,
  deferred — not part of this appetite.)
