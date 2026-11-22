# EPIC: A skill that owns the rules for UI tests

Golden-thread parents: issue #230 (the decision it asked for); the `test-strategy` capability's
requirement *Every activity family has a matrix* (the UI family's `ADQ` and `RSK` gaps); the
archived `test-suite-care` design, stage 2 (the six UI rules parked "until a UI skill exists").

## Appetite

MEDIUM. One new capability: a skill with its tests, probes and docs. Its neighbours get light
changes: one rule moves out of `cosmic-python` and one is reworded there, the `test-strategy` UI
matrix gets new rows, and `project-setup` gains one interview question and the files that answer it.
The `project-setup` part is the edge of this appetite: if it grows past the tool's config file, one make
target and one line of the binding, cut it rather than grow the EPIC.

## Why

No skill owns the rules for UI tests. An agent asked to write a browser test has only rule 2 of the
`cosmic-python` testing checklist to go on. Six well-sourced rules were drafted on 2026-11-14 and
then parked, because there was no skill to put them in. The UI row of the test matrix has two
open gaps: whether the UI scenarios would catch a broken screen, and what can go wrong outside the
screens. Projects with a front end, such as `entity-resolution-service-webapp`, write their suites
without a standard. That suite retries tests until they pass and has no accessibility check
(`inputs/trial-baseline.md`).

## Solution outline

A new skill, `ui-testing`, becomes the single owner of how UI tests are written and run, whichever
tool a project chose. Its rules are written without naming a tool. Each rule that a tool changes
gets one row per tool, for Cypress and for Playwright, pointing to that tool's own documentation.
An agent reads which tool the project uses from the project's binding, where `project-setup` writes
it.

The first version holds:
- the six parked rules;
- rule 2 of the testing checklist (where front-end tests live, end-to-end scenarios as Gherkin);
- how the accessibility check on each visited page is done, and which findings fail the run;
- which browsers and viewports a suite runs, and when;
- how to show that the UI scenarios would catch a broken screen.

The last two fill the `RSK` and `ADQ` gaps of the UI matrix.

Success is measured on a real suite:
- The skill's rules applied to `entity-resolution-service-webapp` find the rule breaks it really
  has.
- An agent writing one new scenario for that project breaks those rules without the skill and
  keeps them with it.

## Key decisions

- **DEC-1** A new skill, `ui-testing`, in the `meaningfy-building` bundle, beside `cosmic-python`
  and `test-suite-care`, owns the UI test rules. Reason: #230 asked for one owner, and the
  developer chose a skill. Rejected: a permanent home inside `test-suite-care` or `cosmic-python`.
  Both are about Python code and suites, not screens.
- **DEC-2** The rules are written without naming a tool, and each project chooses Cypress or
  Playwright. A rule that a tool changes carries one minimal row per tool: one line, plus the tool's
  documentation page and the date it was checked on. Reason: the developer wants projects free to
  choose. Rejected: Playwright only (it would leave a Cypress project without rules) and rules that
  name no tool at all (an agent cannot act on them).
- **DEC-3** Rule 2 of the testing checklist moves to `ui-testing`. `cosmic-python` keeps a
  one-line pointer in its place, and the `CHK-58` inventory row names the new owner. Checklist rule
  11 ("one assert per idea") is scoped to unit and feature tests, so that it does not conflict with
  "one journey groups its assertions". Reason: one fact, one owner. Rejected: leaving rule 2 where
  it is, which would give UI test rules two owners.
- **DEC-4** The first version carries the six parked rules, rule 2, the accessibility check
  how-to, the browser and device matrix (`RSK`) and the broken-screen check (`ADQ`). The two
  matrix rows name `ui-testing` as their technique owner. Reason: these are the developer's choice
  and the matrix's open gaps. Rejected: visual regression (see No-gos).
- **DEC-5** `project-setup` records the project's UI tool. For a product that has a UI, its
  interview asks for Playwright, Cypress or none. The answer writes the tool's config file, one
  make target that runs the UI suite, and one line in the project's `AGENTS.md` naming the tool.
  `ui-testing` reads that line. Where it is missing, `ui-testing` falls back to the config file it
  finds. Reason: the developer chose scaffolding over a hand-written line. Rejected: a binding line
  only, written by hand.
- **DEC-6** The proof is a trial on `entity-resolution-service-webapp`, done in two parts:
  - An audit of its Playwright suite against the skill's rules, counting the breaks rule by rule.
  - The same brief given to an agent twice, once without the skill and once with it: write one new
    end-to-end scenario. The two outputs are compared.

  The trial's findings are the recorded failure case and the acceptance test. The trial reads that
  repository and changes nothing in it. A pull request there is offered to its owner, never opened
  on our own. Reason: the developer chose a real project; this one has a live Playwright suite.
  Rejected: trigger probes alone.

## Rabbit-holes

- **Whose package manager.** A Python repository with a JavaScript front end has two toolchains.
  The scaffold writes the tool's config and one make target, and nothing more: no front-end app,
  no bundler and no Node version manager.
- **How strict the accessibility check is.** Failing on every axe finding makes the check noisy,
  and people end up switching it off. The PLAN picks a fixed level of severity and gives a written
  way to accept a known finding. It does not tune per project.
- **Retries.** Retrying a test until it passes hides a flaky test. The skill points to checklist
  rule 14 (quarantine, never retry to pass) rather than writing its own retry policy.
- **Per-tool rows that grow into a tutorial.** A row is one line and a documentation link. Any
  longer row is a sign that the tool's own documentation should be read instead.
- **The trial suite is in fair shape.** The audit's "before" may be small (RISK-1). A small but
  real result is enough: the EPIC does not hunt for breaks.
- **Order.** This EPIC is independent of the open `activity-test-profiles` change. Its stage 5 (UI
  family) will find an owner here once this EPIC is archived. `test-suite-care` stage 2 (the audit
  of a UI suite) stays parked, and when it resumes it cites `ui-testing` for its rules.

## No-gos

- Visual regression testing (screenshot comparison).
- A third tool (Selenium, WebdriverIO, TestCafe), and rules for component-test runners (Vitest,
  Jest) beyond where their tests live.
- Example test code in the skill beyond the one-line per-tool rows.
- Any change to `entity-resolution-service-webapp` without its owner's approval.
- Resuming `test-suite-care` stage 2 (the audit of UI suites) or changing `activity-test-profiles`.
- Scaffolding a front-end application or its build in `project-setup`.
- UX design or the UX review lens (CHK-59 stays with `meaningfy-code-review`).

---

## What Changes

- **New skill** `skills/ui-testing/`, declared in `meaningfy-building` in `bundles.yaml`, with:
  - its six facets;
  - trigger probes (positive and near-miss);
  - a README row and a CHANGELOG line.
- `cosmic-python` testing checklist: rule 2 is replaced by a pointer to `ui-testing`, and rule 11
  is scoped to unit and feature tests.
- `test-strategy`:
  - `references/ui.md`: the `ADQ` and `RSK` rows are filled and owned by `ui-testing`, and the
    `VER` and `ROB` rows name `ui-testing`.
  - `references/inventory.md`: new check ids, and `CHK-58` re-pointed.
- `project-setup`:
  - the interview asks for the UI tool (product archetype);
  - templates for the Playwright and Cypress config files;
  - a make target that runs the UI suite;
  - a line in the `AGENTS.md` template naming the tool.
- `evidence/` in this change: the trial audit and the before and after comparison.

## Capabilities

### New Capabilities
- `ui-testing`: the rules for writing and running UI tests, whichever tool the project chose. This
  covers where the tests live, setting state, selectors, waiting, external sites, resetting
  state, grouping assertions, the accessibility check, the browser and device matrix, and how to
  show that the suite would catch a broken screen.

### Modified Capabilities
- `test-strategy`: the UI family's `ADQ` and `RSK` rows stop being gaps.
- `lean-project-templates`: `project-setup` gains the UI tool question and its files.

## Impact

- **Files.**
  - `skills/ui-testing/**` (new);
  - `skills/cosmic-python/references/testing-checklist.md`;
  - `skills/test-strategy/references/{ui,inventory}.md`;
  - `skills/project-setup/` (interview, templates, Makefile template);
  - `bundles.yaml` and the generated bundles;
  - `tests/trigger_probes.yaml`;
  - `docs/skill-inventory.md`, `README.md` and `CHANGELOG.md`.
- **Dependencies.** None for skillery. A scaffolded project with a UI depends on the tool it
  chose.
- **Other repositories.** `entity-resolution-service-webapp` is read only.
