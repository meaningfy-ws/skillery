<!-- PLAN (tasks half). PLAN = design.md + this file. Document type: Implementation. Revision 3
     (2026-10-26). Clarity gate: 7.5 → 8.8 → 9.2/10 (revision 3), task 0.2. -->

> Derived from EPIC: rebundle-by-activity (`proposal.md`); design in `design.md` (D-1…D-12). Gate for
> every task group (each PR): `make validate` green at its end; a task inside a group may end with
> the expected failures its Accept names. One PR per task group, from `arch/<group>` off
> `develop` (D-11). No model runs (DEC-11). GitNexus `impact` before editing a symbol in `tools/`;
> `detect_changes` before each commit.

## 0. Preconditions

- [ ] 0.1 PRs #77, #78 and the split are merged; `restructure-and-evaluate-catalogue` 7.1–7.2 done and
      the change archived (`spec-stewardship`). **Accept:** `openspec/specs/catalogue-architecture/`
      exists; `openspec validate --all` green.
- [x] 0.2 Score this PLAN with the full `clarity-gate`. **Accept:** ≥ 9/10, the score in the header
      comment of both PLAN files.

## 1. Use cases and coverage (`arch/use-case-coverage`)

- [ ] 1.1 `use_case_coverage` (D-2) with negative tests: an orphan skill and an orphan agent are each
      flagged; a repo without `use-cases/` is silent. **Accept:** the tests pass; on the real repo the
      check lists exactly the six orphans of the Context.
- [ ] 1.2 Write UC-W22, UC-W23, UC-W24 (D-1); add the three skills to UC-W18; `make skill-inventory`.
      **Accept:** `use_case_coverage` clean; `docs/use-cases.md` lists 24 use cases.

## 2. The `purpose` facet (`arch/purpose-activities`)

- [x] 2.1 The owner approves D-3's table. **Accept:** dated in `inputs/approvals.md`.
- [ ] 2.2 Replace `purpose` in `facets.yaml`; re-tag every skill and agent per D-3 (frontmatter
      `metadata.purpose` only); `make bundles`, `make skill-inventory`. **Accept:** `facets_declared`
      clean; `git diff` touches no `description` and no body.

## 3. The sales bundle (`arch/sales-bundle`)

- [ ] 3.1 `bundles.yaml` per D-4; run `make bundles` and read `bundle_requirements` (it fails on the
      three edges). **Accept:** the three expected errors, and no other.
- [ ] 3.2 Turn the three hand-offs into see-also sentences (D-4); `make bundles`, `make
      skill-inventory`. **Accept:** `bundle_requirements` clean; `cross_skill_paths` clean.
- [ ] 3.3 Announce the move (D-9): CHANGELOG "Action needed (users)", the README bundle table, both
      setup docs. **Accept:** each names `meaningfy-sales` and its install command on both CLIs.

## 4. The agents (`arch/agents-architecture-sales`)

- [ ] 4.1 With `bdd-gherkin`, write `tests/features/agents/system-architect.feature`,
      `conceptual-modeller.feature`, `proposal-writer.feature`, each with a return and a refusal
      Scenario Outline. **Accept:** the three files exist; each has a `Background` naming every skill of D-5 and a return
      and a refusal Scenario Outline with `Examples:` (checked by reading them in the PR).
- [ ] 4.2 Write the three agents per D-5; add them to `bundles.yaml`; set `served_by.agents` in UC-W19,
      UC-W20, UC-W8; add the names to `ALL_AGENT_NAMES`; `make bundles`, `make skill-inventory`. **Accept:** `agent_conformance`,
      `agent_bundle_membership` and `use_case_coverage` clean; `npm run test:opencode-installer`
      green.
- [ ] 4.3 Propose to the owner the status of UC-W8, UC-W19, UC-W20 (`covered` or still `partial`).
      **Accept:** the owner's answer applied and dated in `inputs/approvals.md`.

## 5. Future features (`arch/future-features`)

- [ ] 5.1 Write `docs/future-features.md` (D-6) and its register row; replace the Roadmap section of
      `docs/catalogue-architecture.md` with the pointer. **Accept:** `doc_register_complete` and
      `broken_links` clean; every row's use cases exist.
- [ ] 5.2 `use_case_changes_registered` (D-12) with the negative tests of design "Test cases"; align
      every use case's `change` with the feature rows; `make skill-inventory`. **Accept:** the check is
      clean on the real repo.
- [ ] 5.3 The voice placeholders (D-10). **Accept:** four files, none with a rule; `meaningfy-voice`
      names the folder.

## 6. External dependency register (`arch/dependency-register`)

- [ ] 6.1 Tests first: the `dependencies_register` check (an unknown `kind`, a missing `pin`, an
      `opencode_status` that starts with none of the four keywords each fail) and the render drift test. **Accept:** they fail for the expected
      reasons.
- [ ] 6.2 `dependencies.yaml` seeded from today's tables; the renderer in `tools/skill_inventory.py`;
      the markers in both docs; the register row. **Accept:** the tests pass; every row of today's
      three tables is rendered, and any changed cell is listed in the PR and approved by the owner.
- [ ] 6.3 The `dual-cli-distribution` delta for the matrix requirement (the matrix is rendered from
      the register). **Accept:** `openspec validate rebundle-by-activity --strict` green.

## 7. Bundles as metadata (`arch/dist-branch`, then `arch/bundles-generated`)

- [ ] 7.1 *(Optional, owner's approval needed: it pushes a test branch.)* Re-test route A on a
      GitHub-hosted branch with the spike's entries. **Accept:** the result recorded in
      `inputs/2026-10-26-spike-root-source.md`; if it passes, D-8 is revised before 7.2.
- [ ] 7.2 `.github/workflows/dist.yml` (D-8) while `bundles/` is still committed. **Accept:** after
      merge, the `dist` branch exists and `claude plugin details meaningfy-core@meaningfy-skillery`
      from `meaningfy-ws/skillery#dist` lists exactly the `bundles.yaml` members (the
      [installing-a-bundle scenario](../../specs/dual-cli-distribution/spec.md#requirement-installing-a-bundle-loads-exactly-that-bundle)).
- [ ] 7.3 The switch PR (D-8): ignore and delete `bundles/`; the CI link check of D-8 in `validate.yml`
      and the generate step in `plugin-eval.yml`; `bundle_gates`, install lines,
      `AGENTS.md`'s distribution sentence, the migration note; the `dual-cli-distribution` delta for
      "Skills and agents are installed from their single source". **Accept:** `make validate` green
      without `bundles/`; `make bundles` recreates it locally; `npm run test:opencode-installer` green.

## 8. Release documentation and verification

- [ ] 8.1 CHANGELOG under Unreleased, per merged PR, written for the installer.
- [ ] 8.2 `make validate`, `make validate-spine`, `npm run test:opencode-installer`, `openspec
      validate rebundle-by-activity --strict`. **Accept:** all green.

## Roadmap

- [ ] 0.1 · [x] 0.2
- [ ] 1.1 · [ ] 1.2
- [x] 2.1 · [ ] 2.2
- [ ] 3.1 · [ ] 3.2 · [ ] 3.3
- [ ] 4.1 · [ ] 4.2 · [ ] 4.3
- [ ] 5.1 · [ ] 5.2 · [ ] 5.3
- [ ] 6.1 · [ ] 6.2 · [ ] 6.3
- [ ] 7.1 · [ ] 7.2 · [ ] 7.3
- [ ] 8.1 · [ ] 8.2

Order: 0, then 1 before 4 (coverage must exist before agents are added), 2 before 3 and 4 (the new
skills' and agents' purposes use the new values), 3 before 4 (`proposal-writer` lands in
`meaningfy-sales`), 5 after 1 and 4, 6 independent after 0, 7.2 after 3 (so `dist` publishes the new
bundles), 7.3 last before 8.

## Verification

`make validate` green with no `bundles/` in git; every skill and agent serves a use case; every
bundle installs its exact members on both CLIs; three new agents with Gherkin; every move in the
CHANGELOG; the PLAN scored ≥ 9/10.
