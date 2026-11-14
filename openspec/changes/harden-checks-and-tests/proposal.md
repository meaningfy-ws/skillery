<!-- STATUS: EPIC shaped 2026-11-13 from the owner's conversation (inputs/seed.md, inputs/qa.md,
     rounds 0-5). RE-SHAPED the same day (round 6, logged in inputs/qa.md): the bet grew into a
     catalogue-wide test strategy and was split into four EPICs. This is B, the software slice; it
     depends on A (test-strategy) and fills the software rows of A's matrix (DEC-14). Vale moved to
     C (DEC-7). Readiness-checked twice on 2026-11-13; the fixes and the appetite (Q-19) are
     folded in. PLAN derived 2026-11-14 (design.md, tasks.md), ahead of A's delivery and written
     against A's PLAN. No DEC text changed; the owner's round-8 answers (inputs/qa.md) narrow DEC-8
     (ls-lint: banned file names only, required files checked in make) and read DEC-4 strictly
     (scripts live in project-setup's templates, not in quality/). Both are recorded in design.md
     D-1 and D-5. -->

# EPIC: harden checks and tests

**Parents:** EPIC A [`test-strategy`](../test-strategy/proposal.md) (the discipline and the matrix
this EPIC fills for software); the owner's requests of 2026-11-13 (`inputs/seed.md`, `inputs/qa.md`); the live
capabilities `epic-delivery` (the adversarial tester and the review sets), `code-principles-governance`
(the catalogue and the groomed import-linter guardrails), `pr-review-modes` (the L3 lens) and
`catalogue-governance` (the agreed top-level folders and artifact types).

## Appetite

**VERY LARGE**, in three stages (the owner's call, Q-19, after the readiness check found the scope
beyond LARGE): (1) `quality/`, the wider Ruff selection, the Semgrep rules and the "Checked by"
column; (2) the tester's methods and its range; (3) the weekly mutmut run and the import-contract
check. Several related capabilities change together (static rules, test strength,
the import-linter review), a new artifact type and top-level folder appear, and the tester's
boundary moves from LARGE to MEDIUM. If encoding the catalogue needs new catalogue entries (DDD,
TDD, fixtures), that is the follow-up EPIC, not this one (Q-18).

## Why

Our quality rules are prose that agents and reviewers must remember. The "adversarial tester" we
run is an implementer with a sharper prompt and no method: the owner saw one at work and it was
"just an implementer with extra prompts" (Q-2). Nothing measures whether agent-written tests bite,
the cosmic-python antipatterns are caught only when a reviewer happens to notice them, and
import-linter contracts can drift (packages left uncovered, `ignore_imports` growing) without
anyone asking whether they still hold. Ruff, which every project already runs, is set to a small
selection and misses checks it could make for free.

## Solution outline

1. **Checks that run, not rules that are remembered.** Every entry of the cosmic-python catalogue,
   its clean-code and SOLID sections and the testing checklist gets a checker, chosen in order:
   Ruff (a wider selection), import-linter, a Meaningfy Semgrep rule, or "review only, because…".
   The catalogue shows which, so coverage is visible. Outcome: an antipattern that a tool can see
   fails `make` before any reviewer reads the code.
2. **A `quality/` home in skillery.** Meaningfy Semgrep rules with their tests, the manifest of
   hand-picked external Semgrep sources, and the ls-lint and checkmake configurations
   that encode the canonical layout, names and Makefile. Projects fetch it at a pinned skillery
   release through a `make` target that `project-setup` scaffolds. Outcome: one source of checks,
   upgraded by bumping a pin.
3. **An adversarial tester with proper methods.** The tester keeps its brief and gains methods:
   Hypothesis properties and stateful tests, and Schemathesis where an OpenAPI contract exists; its
   report lists the properties it stated. It runs from MEDIUM up. Outcome: "try to break it" becomes
   a repeatable technique with a visible result.
4. **Tests that are measured.** A weekly mutmut run on `develop` writes the surviving mutants to
   `tests/mutmut-results/` in a bot PR; a person picks them up, plans the fixes and deletes the
   folder once empty. Outcome: weak tests are found every week, not by accident.
5. **Import contracts that stay true.** A mechanical check on every PR (every top-level package is
   under a contract; `ignore_imports` does not grow without a recorded decision) and an L3 judgement
   once per EPIC (the contracts still match the layering and the EPIC's ADRs).

## Key decisions

- **DEC-1**: Semgrep is the static-rule engine; CodeQL is out of the standard — CodeQL is free only
  on open-source code and most Meaningfy repos are private; rejected: Semgrep plus CodeQL (round 0).
- **DEC-2**: Checker order: Ruff first (extend the `project-setup` selection), import-linter for
  imports, Semgrep only where neither can, review for the rest. Each catalogue entry records its
  checker in a "Checked by" column, the per-rule source; `test-strategy`'s software rows cite it by
  `CHK-` id and do not list rules — rejected: Semgrep for all our rules (Q-17).
- **DEC-3**: Scope is what the catalogue already holds: the cosmic-python catalogue, its clean-code
  and SOLID sections and the testing checklist (including item 6 as A's DEC-9 rewrites it). New
  DDD and TDD rules, and fixture organisation and reuse rules beyond item 6, are a follow-up EPIC;
  PEP style stays with Ruff — rejected: grow the catalogue first (Q-13, Q-18). The hygiene group
  the owner chose in Q-13 is kept: `requests` without a timeout, naive `datetime` and bare `except`
  come with Ruff's wider selection (DEC-2) and need no catalogue entry; "SPARQL built from strings"
  is the one exception to "no new entries": it gets a catalogue entry and a Semgrep rule.
- **DEC-4**: A new top-level folder `quality/` holds the checks, as a sixth artifact type in
  `governance.md`; the top-level folder check allows it. `quality/` holds only executable rule
  files and configurations; what a rule enforces and why stays with the skill that owns it (for
  this EPIC, the `cosmic-python` catalogue entry it checks) — rejected: skill assets spread over
  several skills; a separate repository (Q-1, Q-5).
- **DEC-5**: Projects consume `quality/` through a `make` target that fetches it from a pinned
  skillery release tag into a gitignored folder — rejected: raw remote URLs; a vendored copy (Q-6).
- **DEC-6**: External rules are hand-picked by the owner and recorded per tool in a manifest (source,
  pinned version, licence, why picked); agents propose candidates, the owner approves each in the
  PR; no external rule text is copied in — rejected: whole packs with a deny-list; vendored rules
  (Q-1, Q-7).
- **DEC-7** *(re-shaped, round 6)*: Vale moves to EPIC C (`activity-test-profiles`), the
  documentation family; Q-16 (hand-picked external styles only) travels with it. `quality/` is
  built so C can add a Vale manifest beside Semgrep's — was: Vale in this EPIC.
- **DEC-8**: For projects scaffolded by `project-setup`: ls-lint checks file and folder names and
  the canonical layout; checkmake checks Makefile hygiene; the required Makefile targets come from
  `project-setup`'s template. Docs folders and stacks repositories are EPIC C's — rejected:
  a custom layout script (Q-4).
- **DEC-9**: The adversarial tester stays an `implementer` with a brief, gains Hypothesis
  (properties, stateful), Schemathesis with an OpenAPI contract, and runs from MEDIUM up; the
  review-set data in `epic-delivery.workflow.json` changes accordingly. The brief takes
  `test-strategy`'s adversary stance (`ROB`, `ADQ`) — rejected: a new tester
  agent; LARGE-only (round 0, Q-2).
- **DEC-10**: mutmut runs weekly on `develop` in scheduled CI and opens or updates one bot PR that
  adds `tests/mutmut-results/`; it never fails a build; whoever picks the results up plans the fixes
  and deletes the folder when empty — rejected: per-PR runs; direct push to `develop` (Q-8, Q-9).
- **DEC-11**: The import-linter review is a mechanical check on every PR plus the L3 lens once per
  EPIC — rejected: L3 only; weekly with mutmut (Q-10).
- **DEC-12**: In skillery, `quality/`'s own tests run locally in `make validate` and CI skips them
  with a clear message when a tool is missing (lean CI kept); skillery does not run the checks on
  its own code — rejected: a CI job for them; dogfooding (Q-14, Q-15).
- **DEC-13**: Mitigated risks: external sources change or relicense (pinned versions, licence per
  source, re-approval on bump); noise (few rules, new external sources start report-only, every
  suppression carries a reason); tools missing (pinned installs through `make`, cached in CI).
  Accepted risk: nobody picks up the mutmut results (Q-11).
- **DEC-14** *(re-shape, round 6)*: This EPIC depends on A and lands after it. It fills the software
  rows of `test-strategy`'s matrix: `ADQ` for mutmut, `ROB` for Hypothesis and the tester, `VER` for
  the static rules; each fills a `gap` row A marked for B and flips it to `exists`. By A's
  DEC-8 the techniques stay with their owners: how to write a property or a stateful test goes in
  the `cosmic-python` testing checklist, the tester's brief in `epic-delivery`, the wiring in
  `project-setup`.
- **DEC-15**: B proves three things (Q-12): every catalogued rule has a checker or a "review only,
  because…" entry, and every Meaningfy Semgrep rule a fixture test; the tester's report lists the
  properties it stated; the mutmut bot PR and the import-contract check each run once end to end
  on a sample project.

## Rabbit-holes

- **Free-text dict keys** (`AP-FREESTR-ANYLAYER`): a naive rule flags every string subscript,
  including the adapter's I/O edge where raw dicts are allowed. Narrow it, ship it report-only
  first, and tune from the fixtures.
- **"ALL of them"**: many clean-code and SOLID statements are not shape-checkable. "Review only,
  because…" is an honest answer; a brittle rule written to tick a box is not.
- **Ruff's wider selection** will fire on existing projects. The PLAN states how the new selection
  reaches an existing project (a migration note), not only a fresh scaffold.
- **Fetching at a pin**: offline machines and CI caches. Keep it one `make` target and one pin;
  no package registry, no installer.
- **Ordering with A**: A adds `criteria` to every phase of `epic-delivery.workflow.json`; this
  EPIC's review-set edit lands after A and keeps that field. The tester change is one field per
  appetite.
- **mutmut on large suites** can run for hours. Scope it to the package, not the tests, and let the
  PLAN set a time budget.

## No-gos

- No CodeQL, no paid static-analysis service.
- No formal methods (TLA+, Alloy, CrossHair) in this EPIC; they stay design-time tools, parked.
- No new catalogue entries (DDD, TDD, fixture organisation): follow-up EPIC.
- No Vale or other documentation checks (EPIC C); no copying of external rule text into skillery.
- No change to the discipline, the question set or the matrix's shape (EPIC A); only its software rows.
- No dogfooding the checks on skillery's own code; no new heavy tools in skillery's CI.
- No new agent: the tester remains a brief for `implementer`.
- No ls-lint or checkmake for docs folders or stacks repositories (EPIC C).
- No change to the test-scenario interview or the PLAN's error matrix (EPIC C); the tester takes
  its properties from the PLAN as written.
- No mutation testing per PR, and no build that fails on mutation results.
- No change to PEP-style checking beyond Ruff's selection.

---

## What Changes

- New top-level folder `quality/` (Semgrep rules + tests, the external-source manifest, ls-lint
  and checkmake configurations, README); `governance.md`, `AGENTS.md` and the top-level folder
  check name it as the sixth artifact type.
- `cosmic-python`: the catalogue gains a "Checked by" column; the testing checklist names its
  checkers; Hypothesis item extended with stateful tests and Schemathesis.
- `test-strategy` (from EPIC A): the software rows of the matrix name the new checks.
- `project-setup`: wider Ruff selection; `make` targets to fetch `quality/` at a pin and run Semgrep,
  ls-lint and checkmake; a weekly mutmut workflow in the CI template; the mechanical
  import-contract check; a migration note for existing projects.
- `epic-delivery`: the tester brief gains its methods and report fields; the review sets name the
  tester from MEDIUM up (**BREAKING** for MEDIUM EPICs: one more dispatch per stage).
- `meaningfy-code-review`: L3 judges the import-linter contracts once per EPIC.
- `make validate` runs `quality/`'s tests locally; CI skips them when a tool is missing.

## Capabilities

### New Capabilities
- `quality-checks`: the `quality/` artifact type, its rules and their tests, external-source
  manifests, the pinned fetch, and the weekly mutation report.

### Modified Capabilities
- `catalogue-governance`: the agreed top-level folders include `quality/`; a sixth artifact type.
- `code-principles-governance`: every catalogue entry records its checker; the import-linter
  contracts are checked per PR and judged per EPIC.
- `epic-delivery`: the adversarial tester's methods, report and appetite range.
- `pr-review-modes`: the L3 lens's once-per-EPIC contract review.

## Impact

- Skills: `cosmic-python`, `project-setup`, `epic-delivery`, `meaningfy-code-review`; possibly
  `ci-cd-delivery` for the scheduled workflow.
- Repo: `quality/`, `docs/development/governance.md`, `AGENTS.md`, `tools/repo_lint` (top-level
  folders), `Makefile` (`make validate`), `docs/skill-inventory.md` if descriptions change.
- Projects scaffolded or modernised by `project-setup`: new `make` targets, a wider Ruff selection,
  a weekly workflow.
- Dependencies for projects: Semgrep, ls-lint, checkmake, mutmut, Hypothesis, Schemathesis
  (pinned).
- Order: after EPIC A (`test-strategy`).
- Follow-ups recorded as issues: #210 (DDD, TDD and fixture rules), #214 (CodeQL, declined for now),
  #215 (the hygiene rules).
