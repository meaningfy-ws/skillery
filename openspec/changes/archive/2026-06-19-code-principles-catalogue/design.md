<!-- PLAN (design half). PLAN = this file + tasks.md. The clarity gate scores the pair (≥9/10). -->

> Parent: EPIC `code-principles-catalogue` (proposal.md) — derived from DEC-1..DEC-11.

## Context

The Meaningfy skills produce strong PLANs but code with recurring symbol-level defects (eds4jinja2
evidence in `inputs/seeds.md`). The rules that would catch them are scattered and partially restated,
and `meaningfy-code-review` exempts adapters. This change makes `cosmic-python` the single **reference**
owner of a catalogue that every reused phase discipline cites, repositions `bdd-gherkin` into design,
and wires it into the opsx phases. No runtime code; skillery dogfoods this as an OpenSpec change.

## Goals / Non-Goals

**Goals:**
- One catalogue file, cited (never copied) by `meaningfy-code-review`, the agents, and the global prompt.
- The four seed principles are **named** catalogue entries: read-neighbours-before-implementing,
  single-source-of-truth-&-DRY, prefer-models-over-dicts, design-for-reuse-**and-compactness**.
- Each opsx phase reads the catalogue via its existing discipline; the survey-&-reuse hook is real
  (lands in the `implementer` wrapper + `spine/workflows.md`, where the harness honours it).
- `bdd-gherkin` scenario/edge-case authoring becomes a design-phase PLAN artifact; `epic-planning`
  gains the test-scenario interview.
- `make validate` stays green **and newly enforces** single-source-of-authority (boundary sections,
  reciprocal links, agent/skill alignment, blocking ownership claims) — so the de-duplication cannot silently
  re-erode (the cross-skill audit in `inputs/skill-audit-findings.md` proved it already had).

**Non-Goals:**
- No new skill; no fork of external plugins; no edit to the user's private `~/.claude/CLAUDE.md`.
- No runtime/code change to eds4jinja2.
- No re-derivation of the whole coding-prompt into the catalogue.

## Decisions

All bet-level choices are settled in the EPIC (DEC-1..DEC-11) — cited, not re-explained. New
planning-level choices:

- **PLAN-D1 (catalogue shape)**: `references/principles-and-anti-patterns.md` has three sections —
  **Principles** (the named "why"), **Best practices** (the "do"), **Anti-patterns** (the ❌ "don't",
  each with *smell → fix*). Each entry has a short stable slug id (e.g. `AP-DUP-CONST`) so review
  findings and commit messages can cite it. Seeds: the eds4jinja2 findings + gaps **G1–G4** from
  `inputs/global-prompt-gap-analysis.md`. Gap **G5** (sensitive-data interaction) lands in `guardrails`,
  the catalogue cross-links it.
- **PLAN-D2 (cosmic-python SKILL.md reframe)**: Workflows 1–4 collapse into a short **"What good looks
  like"** reference + a **"Survey & reuse first"** practice pointer; the step-by-step *ritual* prose is
  removed and delegated (the Boundary section already delegates TDD). SKILL.md links the catalogue; it
  does not inline it.
- **PLAN-D3 (code-review by reference)**: the checklist's Architecture/Code-quality items become
  "review against the catalogue (`AP-*`, `BP-*`)"; the only first-class content kept is report format
  (priority + file:line + principle id + fix), security, spec-conformance, test-presence, and the new
  **Reuse & DRY across files** group (duplicated constants? reinvented helper? dict-that-should-be-model?
  shared infra misplaced?).
- **PLAN-D4 (survey hook placement)**: a one-line gate in `agents/implementer.md` ("before writing a
  new file: read siblings + grep for reusable symbols; reuse/extend/refactor-to-fit") + a row in
  `spine/workflows.md`. Not a cosmic-python workflow (would compete with `superpowers:TDD`).
- **PLAN-D5 (bdd-gherkin reposition)**: change the skill's framing + `spine/workflows.md` row so the
  `.feature` authoring sits in plan/design and is a PLAN artifact the clarity gate can score; step
  definitions stay in implement. `epic-planning` gains a "test-scenario/assertion/edge-case interview"
  bullet in its Elicit step. **Fix all three disagreeing surfaces** (audit D1/A9): `agents/epic-planner.md`
  skills list, `spine/workflows.md` ordering, and the reciprocal `clarity-gate`↔`bdd-gherkin` Related link.
- **PLAN-D6 (validator hardening — DEC-12)**: add blocking checks to `tools/repo_lint/lint.py`, each with a
  negative test in `tests/`: (1) `boundary_section_present` — every `skills/*/SKILL.md` has `## Boundary &
  Related Skills`; (2) `reciprocal_links` — if A lists B under Related/Delegates, B lists A; (3)
  `agent_skill_alignment` — every skill in an `agents/*.md` list exists and the agent's phase skills cover the
  delegations declared by its primary skill; (4) make the existing `ownership_claim_report` **blocking** and
  extend `ownership.yaml` to the catalogue ids. Keep each check independent so it can be triaged alone.
- **PLAN-D7 (own the coverage + lightweight-check rules once — DEC-14)**: the catalogue owns the coverage
  rule **including the per-layer nuance**; `meaningfy-code-review` and `project-setup` cite it (closes the
  overall-vs-per-layer divergence). `technical-writing` cites `clarity-gate`'s lightweight check (id) rather
  than restating its four criteria.

## Algorithm / approach

Documentation/governance change applied as independent, individually-revertible edits, each verified by
`make validate`. Order: **catalogue first** (so citers have a target), then citers, then wiring.

1. Write the catalogue (PLAN-D1). Named principle ids for the four seeds + `AP-*`/`BP-*` for findings & G1–G4.
2. Reframe `cosmic-python/SKILL.md` to cite it (PLAN-D2); add survey-&-reuse as a named practice.
3. Rewrite `meaningfy-code-review/SKILL.md` to cite catalogue ids + add Reuse & DRY group (PLAN-D3).
4. Add G5 to `guardrails/SKILL.md`; catalogue cross-links it.
5. Reposition `bdd-gherkin` + add the `epic-planning` interview bullet (PLAN-D5).
6. Add the survey hook to `agents/implementer.md`; update `agents/{code-reviewer,epic-planner}.md` to cite the catalogue (PLAN-D4).
7. Update `spine/workflows.md` (phase↔skill+catalogue rows) and root `CLAUDE.md`/`prompts/` routing.
8. Add the version-SSOT tick to `project-setup/references/checklists.md` (DEC-9).

**Idempotency:** every step is a file edit — safe to re-run/revert; `make validate` is the replayable check.

Worked example (the litmus the catalogue must catch): the eds4jinja2 `parallel_executor` literal
`{"head": {"vars": []}, "results": {"bindings": []}}` → catalogue `AP-DICT-AS-MODEL` + `AP-DUP-CONST`
→ review flags it with both ids → fix = shared SPARQL-results model reused across the adapters.

### Anti-patterns
- ❌ Copying any catalogue rule into a citer (defeats SSOT) — citers link by id only.
- ❌ Turning the survey step into a cosmic-python procedure that duplicates `superpowers:TDD`.
- ❌ Letting the catalogue balloon into a re-derived coding-prompt (seed only; grow via review findings).
- ❌ Leaving "compactness" implied — it must be a named principle (the check flagged this).
- ❌ Putting the survey-&-reuse hook only as prose in a skill instead of on a harness-honoured surface
  (`agents/implementer.md` + `spine/workflows.md`) — prose-only guidance does not fire at implement-time.
- ❌ Repositioning `bdd-gherkin` by editing its prose alone while leaving `spine/workflows.md` ordering it
  post-spec — the phase map and the skill must agree, or routing still sends it to the wrong phase.

## Error matrix

| Failure mode | Expected handling |
|---|---|
| `make validate` fails after an edit (boundary/related-skills frontmatter) | Fix frontmatter; re-run; do not merge red |
| A catalogue rule still restated in a citer | Single-source-of-authority breach → replace with an id citation |
| A seed principle has no named catalogue entry | Block PLAN completion → add the entry (esp. compactness) |
| External plugin referenced but not installed in a consuming repo | Cite by name + note install in routing; never fork |
| Global-prompt gap (G1–G5) not landed in a skill | Re-open the audit row; land it before archive |

## Risks / Trade-offs

- **[Citation indirection]** readers must follow a link to the catalogue → Mitigation: SKILL.md keeps a
  one-line summary + the id index; the catalogue is one short file.
- **[bdd-gherkin reposition ripples]** other docs assume it is post-spec → Mitigation: grep+update
  `spine/workflows.md` and any routing that orders it; it remains pre-implementation, only the framing moves.
- **[Scope breadth]** many surfaces touched (now incl. the validator) → Mitigation: catalogue-first ordering;
  each edit reverts independently; the validator checks are independent so one can be disabled without the rest.
- **[Validator surfaces pre-existing debt]** the new blocking checks will flag asymmetries across the whole
  catalogue at once (incl. consulting skills) → Mitigation: land the checks **after** DEC-13 boundary fixes;
  if a flagged asymmetry is genuinely out of this change's scope, record it in `ownership.yaml`/an allow-list
  with a dated note rather than silently weakening the check.
- **[Validator over-reach]** an alignment check could be too strict and block legitimate agent designs →
  Mitigation: scope check (3) to "declared delegations are covered", not "exact set equality".

## Open Questions

- Should the version-SSOT tick also assert "no second hard-coded version literal" via a lint, or stay a
  human DoD tick? (Lean: human tick now; lint is a separate follow-up.) — non-blocking.
- Does `guardrails` G5 warrant a tiny "interaction safety" subsection or a one-liner? (Lean: one-liner +
  catalogue cross-link.) — non-blocking.
