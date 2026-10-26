<!-- PLAN (tasks half). PLAN = design.md + this file. Document type: Implementation. Revision 3
     (2026-10-26). Clarity gate: 7.5 → 8.8 → 9.2/10 (revision 3), task 0.2. -->

> Derived from EPIC: rebundle-by-activity (`proposal.md`); design in `design.md` (D-1…D-12). Gate for
> every task group (each PR): `make validate` green at its end; a task inside a group may end with
> the expected failures its Accept names. One PR per task group, from `arch/<group>` off
> `develop` (D-11). No model runs (DEC-11). GitNexus `impact` before editing a symbol in `tools/`;
> `detect_changes` before each commit.

## Current state (2026-10-27): done, archived

- **All task groups merged** into `develop` (#81–#94); the EPIC was re-shaped four times by the owner
  (proposal "Re-shape log", DEC-12–DEC-15; design D-13–D-16).
- **Not done:** 7.1 (optional route-A re-test, never approved). **Owed at the first release:** the
  install check from `meaningfy-ws/skillery#dist` (7.2's acceptance, postponed by the owner).
- **Open for the owner:** the Open Points of every use case (`docs/use-cases.md`, "What needs the
  owner"). Archived on 2026-10-27 with `spec-stewardship`.

## 0. Preconditions

- [x] 0.1 PRs #77, #78 and the split are merged; `restructure-and-evaluate-catalogue` 7.1–7.2 done and
      the change archived (`spec-stewardship`). **Accept:** `openspec/specs/catalogue-architecture/`
      exists; `openspec validate --all` green.
- [x] 0.2 Score this PLAN with the full `clarity-gate`. **Accept:** ≥ 9/10, the score in the header
      comment of both PLAN files.

## 1. Use cases and coverage (`arch/use-case-coverage`)

- [x] 1.1 `use_case_coverage` (D-2) with negative tests: an orphan skill and an orphan agent are each
      flagged; a repo without `use-cases/` is silent. **Accept:** the tests pass; on the real repo the
      check lists exactly the six orphans of the Context.
- [x] 1.2 Write UC-W22, UC-W23, UC-W24 (D-1); add the three skills to UC-W18; `make skill-inventory`.
      **Accept:** `use_case_coverage` clean; `docs/use-cases.md` lists 24 use cases.

## 2. The `purpose` facet (`arch/purpose-activities`)

- [x] 2.1 The owner approves D-3's table. **Accept:** dated in `inputs/approvals.md`.
- [x] 2.2 Replace `purpose` in `facets.yaml`; re-tag every skill and agent per D-3 (frontmatter
      `metadata.purpose` only); `make bundles`, `make skill-inventory`. **Accept:** `facets_declared`
      clean; `git diff` touches no `description` and no body.

## 3. The sales bundle (`arch/sales-bundle`)

- [x] 3.1 `bundles.yaml` per D-4; run `make bundles` and read `bundle_requirements` (it fails on the
      three edges). **Accept:** the three expected errors, and no other.
- [x] 3.2 Turn the three hand-offs into see-also sentences (D-4); `make bundles`, `make
      skill-inventory`. **Accept:** `bundle_requirements` clean; `cross_skill_paths` clean.
- [x] 3.3 Announce the move (D-9): CHANGELOG "Action needed (users)", the README bundle table, both
      setup docs. **Accept:** each names `meaningfy-sales` and its install command on both CLIs.

## 4. The agents (`arch/agents-architecture-sales`)

- [x] 4.1 With `bdd-gherkin`, write `tests/features/agents/system-architect.feature`,
      `conceptual-modeller.feature`, `proposal-writer.feature`, each with a return and a refusal
      Scenario Outline. **Accept:** the three files exist; each has a `Background` naming every skill of D-5 and a return
      and a refusal Scenario Outline with `Examples:` (checked by reading them in the PR).
- [x] 4.2 Write the three agents per D-5; add them to `bundles.yaml`; set `served_by.agents` in UC-W19,
      UC-W20, UC-W8; add the names to `ALL_AGENT_NAMES`; `make bundles`, `make skill-inventory`. **Accept:** `agent_conformance`,
      `agent_bundle_membership` and `use_case_coverage` clean; `npm run test:opencode-installer`
      green.
- [x] 4.3 Propose to the owner the status of UC-W8, UC-W19, UC-W20 (`covered` or still `partial`).
      **Accept:** the owner's answer applied and dated in `inputs/approvals.md`.

## 5. Future features (`arch/future-features`)

- [x] 5.1 Write `docs/future-features.md` (D-6) and its register row; replace the Roadmap section of
      `docs/catalogue-architecture.md` with the pointer. **Accept:** `doc_register_complete` and
      `broken_links` clean; every row's use cases exist.
- [x] 5.2 `use_case_changes_registered` (D-12) with the negative tests of design "Test cases"; align
      every use case's `change` with the feature rows; `make skill-inventory`. **Accept:** the check is
      clean on the real repo.
- [x] 5.3 The voice placeholders (D-10). **Accept:** four files, none with a rule; `meaningfy-voice`
      names the folder.

## 6. External dependency register (`arch/dependency-register`)

- [x] 6.1 Tests first: the `dependencies_register` check (an unknown `kind`, a missing `pin`, an
      `opencode_status` that starts with none of the four keywords each fail) and the render drift test. **Accept:** they fail for the expected
      reasons.
- [x] 6.2 `dependencies.yaml` seeded from today's tables; the renderer in `tools/skill_inventory.py`;
      the markers in both docs; the register row. **Accept:** the tests pass; every row of today's
      three tables is rendered, and any changed cell is listed in the PR and approved by the owner.
- [x] 6.3 The `dual-cli-distribution` delta for the matrix requirement (the matrix is rendered from
      the register). **Accept:** `openspec validate rebundle-by-activity --strict` green.

## 7. Bundles as metadata (`arch/dist-branch`, then `arch/bundles-generated`)

- [ ] 7.1 *(Optional, owner's approval needed: it pushes a test branch.)* Re-test route A on a
      GitHub-hosted branch with the spike's entries. **Accept:** the result recorded in
      `inputs/2026-10-26-spike-root-source.md`; if it passes, D-8 is revised before 7.2.
- [x] 7.2 `.github/workflows/dist.yml` (D-8) while `bundles/` is still committed. **Accept:** after
      merge, the `dist` branch exists and `claude plugin details meaningfy-core@meaningfy-skillery`
      from `meaningfy-ws/skillery#dist` lists exactly the `bundles.yaml` members (the
      [installing-a-bundle scenario](../../specs/dual-cli-distribution/spec.md#requirement-installing-a-bundle-loads-exactly-that-bundle)).
- [x] 7.3 The switch PR (D-8): ignore and delete `bundles/`; the CI link check of D-8 in `validate.yml`
      and the generate step in `plugin-eval.yml`; `bundle_gates`, install lines,
      `AGENTS.md`'s distribution sentence, the migration note; the `dual-cli-distribution` delta for
      "Skills and agents are installed from their single source". **Accept:** `make validate` green
      without `bundles/`; `make bundles` recreates it locally; `npm run test:opencode-installer` green.

## 9. Folder restructure (`arch/repo-folders`, D-13)

- [x] 9.1 Tests first: `top_level_folders` (an unknown folder fails) and the widened
      `cross_skill_paths` (a link from a skill into `docs/` fails). **Accept:** they fail for the
      expected reasons.
- [x] 9.2 The development home: `docs/development-method.md`, `docs/catalogue-architecture.*` and
      `spec/*.md` → `docs/development/`; pointers in `AGENTS.md`, README, `CONTRIBUTING.md`.
      **Accept:** `spec/` gone; `broken_links` clean.
- [x] 9.3 `spine/`: `golden-thread.md` → `epic-planning`; the version pin → `openspec/`; the rest →
      `docs/development/`; every skill link into `spine/` removed per D-13. **Accept:** `spine/` gone.
- [x] 9.4 `hooks/`, `prompts/`, `evals/` and the company-practice docs per D-13. **Accept:** those
      folders gone; `hooks_inventory_shape` reads `hooks.yaml`; `plugin-eval.yml` reads `tests/evals/`.
- [x] 9.5 `tools/linkml_neo4j/` → the skill; `scaffold.sh` per D-13; the `linkml-engineering` delta.
      **Accept:** `pytest tests/test_linkml_neo4j_generators.py` green.
- [x] 9.6 Every remaining skill link out of its folder replaced (D-13). **Accept:** the widened
      `cross_skill_paths` clean.
- [x] 9.7 HARD-QUESTIONS and the worktree leftovers per D-13; worktrees pruned.
- [x] 9.9 The `meaningfy` schema moves into `project-setup` (symlinked back); `scaffold.sh` copies it
      from the skill. **Accept:** a real scaffold writes `openspec/schemas/meaningfy/`;
      `openspec schema validate meaningfy` green.
- [x] 9.10 The engagement lifecycle moves into `semantic-consulting-coach`; attribution-only mentions
      of skillery docs removed from skills. **Accept:** `make validate` green.
- [x] 9.8 Living-spec deltas; CHANGELOG line for every moved path. **Accept:** `make validate`,
      `make validate-spine`, `openspec validate --all --strict` green; `ls` shows only the allowed
      folders.

## 10. Only released items are installable (`arch/release-rule`, D-14)

- [x] 10.1 Tests first: an unbundled skill passes lint; a released skill delegating to a WIP skill
      and a released agent loading one each fail `wip_isolation`; `unreleased()` lists exactly the
      WIP paths; the catalogue map shows a WIP section. **Accept:** they fail for the expected reasons.
- [x] 10.2 The checks, `bundle_gen unreleased`, the inventory section, `dist.yml`. **Accept:** the
      tests pass; `make validate` green.
- [x] 10.3 Install routes to `#dist` (opencode installer, `npx skills add`), the method's §6, the
      `dual-cli-distribution` delta, CHANGELOG. **Accept:** no install line reads `#develop`;
      `openspec validate rebundle-by-activity --strict` green.

## 11. Use cases for an agent catalogue (`arch/use-cases-deepened`, D-15)

- [x] 11.1 The template `docs/development/use-case-template.md` and its register row; the
      `use_case_catalogue` section check, test first. **Accept:** the test fails without the code.
- [x] 11.2 All 24 use cases rewritten to the template; UC-W8's approved sections kept as the worked
      example; W19, W20's approved sections kept. **Accept:** `use_case_catalogue` clean; each Open
      Points states a confidence.
- [x] 11.3 The `catalogue-architecture` delta; CHANGELOG. **Accept:** `make validate` and
      `openspec validate rebundle-by-activity --strict` green.

## 8. Release documentation and verification

- [x] 8.1 CHANGELOG under Unreleased, per merged PR, written for the installer.
- [x] 8.2 `make validate`, `make validate-spine`, `npm run test:opencode-installer`, `openspec
      validate rebundle-by-activity --strict`. **Accept:** all green.

## Roadmap

- [x] 0.1 · [x] 0.2
- [x] 1.1 · [x] 1.2
- [x] 2.1 · [x] 2.2
- [x] 3.1 · [x] 3.2 · [x] 3.3
- [x] 4.1 · [x] 4.2 · [x] 4.3
- [x] 5.1 · [x] 5.2 · [x] 5.3
- [x] 6.1 · [x] 6.2 · [x] 6.3
- [ ] 7.1 · [x] 7.2 · [x] 7.3
- [x] 9.1 · [x] 9.2 · [x] 9.3 · [x] 9.4 · [x] 9.5 · [x] 9.6 · [x] 9.7 · [x] 9.8 · [x] 9.9 · [x] 9.10
- [x] 10.1 · [x] 10.2 · [x] 10.3
- [x] 11.1 · [x] 11.2 · [x] 11.3
- [x] 8.1 · [x] 8.2

Order: 0, then 1 before 4 (coverage must exist before agents are added), 2 before 3 and 4 (the new
skills' and agents' purposes use the new values), 3 before 4 (`proposal-writer` lands in
`meaningfy-sales`), 5 after 1 and 4, 6 independent after 0, 7.2 after 3 (so `dist` publishes the new
bundles), 7.3, then 9 (the folder restructure, owner 2026-10-26), then 8.

## Verification

`make validate` green with no `bundles/` in git; every skill and agent serves a use case; every
bundle installs its exact members on both CLIs; three new agents with Gherkin; every move in the
CHANGELOG; the PLAN scored ≥ 9/10.
