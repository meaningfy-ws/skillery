<!-- STATUS: EPIC shaped 2026-11-13 from the owner's conversation (inputs/seed.md, inputs/qa.md,
     rounds 6-7). EPIC A of four, split from the re-shaped harden-checks-and-tests: A (this) →
     B harden-checks-and-tests → C activity-test-profiles → D generic-task-test-profiles.
     Readiness-checked 2026-11-13 (ready); three stale non-decision lines corrected then: the
     BREAKING bullet (narrowed by PLAN D-5) and two references to navigator-follows-the-work, which
     is archived. No DEC changed. PLAN derived and attacked the same day; clarity gate 9.1/10 PASS
     on the third run by an independent scorer. Ready for delivery. -->

# EPIC: test-strategy

**Parents:** the owner's requests of 2026-11-13 (`inputs/seed.md`, `inputs/qa.md`); the re-shape of
[`harden-checks-and-tests`](../harden-checks-and-tests/proposal.md); the live capabilities
`epic-delivery` (its *Verification and validation* section), `code-principles-governance`,
`workflow-definitions` and `catalogue-governance`.

## Appetite

**LARGE.** A new cross-cutting skill, a boundary move (verification and validation leave
`epic-delivery`), a new required field in every workflow file with its lint, and light edits to
about ten skills that gain a pointer. If the work starts writing the per-activity profiles (C, D) or
the software checks (B), it has overrun: those are their own EPICs.

## Why

The owner: "TDD/BDD philosophy is core across all activities we do, and for each activity we
execute we shall know when/how we fail and how we succeed." Today only software has that, and even
there the knowledge is in pieces. The questions a check answers (are we building the right thing,
are we building it right, do the tests bite, are the edge cases covered, is the document clear, is
the contract risky) are asked nowhere as one set. Verification and validation are defined inside
`epic-delivery`, out of reach of docs, contracts or sales work. Two skills give opposite rules for
test data. And nobody can say which check answers which question for which activity, so an
"adversarial tester" ends up as an implementer with a sharper prompt (`harden-checks-and-tests`
Q-2).

## Solution outline

1. **One discipline, stated once.** `test-strategy`, in `meaningfy-core`, owns the loop that applies
   to every activity: state how the work succeeds and how it fails before doing it, do it,
   challenge it against those criteria, decide, revise. A test is any criterion agreed before the
   work, with a pass or fail result and its evidence. Criticism without a criterion is turned into
   one, or it is not a test. Outcome: any activity, from a module to a LinkedIn post, starts by
   saying what would make it fail.
2. **The questions and the stances.** The skill owns the question set (validation, verification,
   test adequacy, robustness, clarity, risk) and the stances that ask them (verifier, validator,
   adversary, cold reader, checker). Review, adversarial testing and revising are workflow steps
   that take a stance; they are not separate skills.
3. **The matrix.** The skill's core reference maps each activity family × question → technique →
   tool → moment → owning skill. A fills it from an inventory of every check the catalogue already
   has and marks each gap; B, C and D fill the gaps. Outcome: "which check answers this question
   here?" has one place to look.
4. **One home per fact.** The generic parts move in (verification vs validation from
   `epic-delivery`); duplicates go (the TDD/BDD loop and fixture advice in `testing-setup.md`); each
   technique stays with its owner and gains one line naming the question it answers.
5. **Workflows declare it.** Every phase of every workflow file states how it succeeds and how it
   fails, and `make validate` fails when one does not. The bindings mandate the principle and route
   to `test-strategy`.

## Key decisions

- **DEC-1**: One skill, `test-strategy`, cross-cutting know-how, cited and never restated (the
  pattern of `writing-antipatterns`) — rejected: separate testing and review skills; one testing
  skill per activity family (round 6).
- **DEC-2**: The founding principle, in the owner's words above, is the skill's first rule and is
  mandated by `AGENTS.md` and `project-setup`'s agentic template (Q-3).
- **DEC-3**: A test is a criterion agreed before the work, a pass or fail result, and its evidence.
  A review finding without a criterion is either turned into one or recorded as an opinion.
- **DEC-4**: The question set (validation, verification, test adequacy, robustness, clarity, risk)
  and the stances (verifier, validator, adversary, cold reader, checker) are defined in
  `test-strategy`. `epic-delivery`'s *Verification and validation* section moves here; it keeps the
  acceptance demo, the validation review and the check ledger (when and who). `guardrails` keeps
  the four-eyes rule and dispatch mechanics — rejected: leaving V&V in `epic-delivery`.
- **DEC-5**: Three layers, three owners: the discipline in `test-strategy`; each technique and tool
  with the skill that owns the activity; each moment and role in the workflow file and its skill
  (round 6).
- **DEC-6**: The matrix has one reference file per activity family (software, documentation, DevOps,
  UI, shaping, modelling, architecture, generic writing). A writes every family's file from the
  inventory and marks gaps; it writes no new technique — rejected: writing only the families that
  have checks today.
- **DEC-7**: `test-strategy` lives in `meaningfy-core` (Q-1).
- **DEC-8**: Consistency rule for every family: technique content stays with its owning skill, so
  the Python testing checklist stays in `cosmic-python`, Gherkin in `bdd-gherkin`, the cold reader
  in `technical-writing` — rejected: moving the checklist into `test-strategy` (round 6).
- **DEC-9**: Test data: polyfactory factories for model objects, a small builder only where a factory
  cannot express the object; stated in checklist item 6. `testing-setup.md` keeps only the wiring
  and points to the checklist, superpowers TDD and `bdd-gherkin` (Q-2).
- **DEC-10**: Every workflow phase declares how it succeeds and how it fails, as data in its
  workflow file; a validator check fails a default phase without them (Q-3) — rejected: the skill alone;
  the bindings alone.
- **DEC-11**: No agent. The stances are taken by existing agents and briefs; a tester or critic
  agent waits until a standalone use recurs.
- **DEC-12**: A proves four things: the matrix covers the inventory; each moved fact has one home;
  the triggers hold against the neighbours; a non-code activity uses the skill in a worked example
  (Q-4).

## Rabbit-holes

- **The neighbours' triggers.** superpowers TDD, `verification-before-completion`, `clarity-gate`
  and `bdd-gherkin` all sit close. The description must route "which check, why, for what" here
  and "how to write the test" to them; the near-miss probes prove it.
- **A new workflow field** must be read by the navigator mod without breaking it: the navigator
  validates the field's shape and does not display it (PLAN D-5).
- **"Success and failure" per phase** can turn into boilerplate. One short line each, naming the
  evidence, not a paragraph.
- **The inventory** can sprawl into a review of every skill. It records what exists and where; it
  does not judge or rewrite the techniques.

## No-gos

- No per-activity profiles beyond the inventory and the marked gaps (C, D).
- No software checks: no `quality/`, Ruff, Semgrep, Hypothesis or mutmut work (B).
- No new agent.
- No rewriting a technique that another skill owns; only a pointer line and the moves in DEC-4 and
  DEC-9.
- No change to what a gate means or to the phases of any workflow, beyond the new criteria field.

---

## What Changes

- New skill `skills/test-strategy/` in `meaningfy-core`: the loop, the questions, the stances, and
  `references/<family>.md` per activity family with the matrix rows and marked gaps.
- `epic-delivery`: the *Verification and validation* section moves to `test-strategy`; a pointer
  stays.
- `cosmic-python`: testing checklist item 6 states the polyfactory rule.
- `project-setup`: `testing-setup.md` keeps the wiring only; the agentic template mandates the
  principle.
- `AGENTS.md`: mandates the principle and routes to `test-strategy`.
- Every `*.workflow.json`: each phase gains its success and failure criteria, required in the nine
  default files and optional (shape-checked) in a repository's override file; nothing breaks.
- About ten technique-owning skills gain one line naming the question their technique answers.

## Capabilities

### New Capabilities
- `test-strategy`: the discipline, the question set, the stances, the matrix and its inventory.

### Modified Capabilities
- `epic-delivery`: verification and validation are defined in `test-strategy`.
- `workflow-definitions`: every phase declares success and failure criteria.
- `code-principles-governance`: the test-data rule has one home.
- `catalogue-governance`: the bindings mandate the founding principle.

## Impact

- Skills: new `test-strategy`; edits in `epic-delivery`, `cosmic-python`, `project-setup`, and a
  pointer line in `clarity-gate`, `bdd-gherkin`, `technical-writing`, `conceptual-modelling`,
  `formal-reasoning`, `architecture`, `meaningfy-code-review`, `guardrails`, `rulebook`,
  `linkml-engineering`.
- Data: every workflow file; `bundles.yaml`; the navigator mod must tolerate the new field.
- Tooling: `tools/repo_lint` (the criteria check); `make bundles`, `make skill-inventory`.
- Order: lands before B (`harden-checks-and-tests`).
- Follow-ups recorded as issues: #211 (a tester or critic agent).
