<!-- PLAN (tasks half). PLAN = design.md + this file. Document type: Implementation. Revision 3
     (clarity-gate: round 1 8.5/10, round 2 9.0/10 PASS; its six minor notes closed here). -->

> Derived from EPIC: define-catalogue-model (`proposal.md`); design in `design.md` (D-1…D-10, §A, §B).
> Gate for every task: `make validate` green at its end, except where a task names a red step
> (local only). One feature branch off `develop` (`feat/catalogue-model`), one commit per task.
> GitNexus `impact` before editing any symbol in `tools/`; `detect_changes` before each commit.

## 0. Preconditions

- [ ] 0.1 `skill-crafting-method` is merged into `develop` (it edits the same method document).
      **Accept:** its PR is merged; branch from the updated `develop`.
- [x] 0.2 The owner confirms D-3 (vocabularies), §A (assignment) and §B (edge resolution), or amends
      them in `design.md`. **Accept:** recorded in `inputs/2026-10-26-plan-confirmation.md`.
- [x] 0.3 Score this PLAN with the full `clarity-gate`. **Accept:** ≥ 9/10.

## 1. Data (D-1…D-6, §A, §B)

- [ ] 1.1 Write `facets.yaml` with the six facets and their values and one-line explanations (D-1,
      D-3). **Accept:** it parses with `yaml.safe_load`; it holds exactly the values of D-3.
- [ ] 1.2 Add the six `metadata` facets from §A to the 32 `SKILL.md` files and remove
      `metadata.category`. **Accept:** `grep -l "category:" skills/*/SKILL.md` is empty; a one-off
      script check shows 32 × 6 values, all in `facets.yaml`.
- [ ] 1.3 Add the six facets to the 3 agent files (§A), then `make bundles`. **Accept:** the same
      check over `agents/*.md`; `tools/opencode-catalogue.json` shows the facets for the 3 agents
      (local red step: `agent_conformance` rejects `metadata` until 2.2).
- [ ] 1.4 Apply §B / D-5 per skill (delete, move or reword, as listed) in `linkml-engineering`,
      `estimation`, `executive-communication`, `guardrails` and `vault-setup`, touching only those
      lines and `estimation`'s description. **Accept:** recomputing the cross-bundle "depends on"
      edges with `skill_inventory.collect()` shows only building → architecture and edges into core;
      `clarity-gate` is on `executive-communication`'s Related line.
- [ ] 1.5 Add `requires: [meaningfy-architecture]` to `meaningfy-building` in `bundles.yaml`.
      **Accept:** local red step: `bundle_gen` rejects the key until 2.1.
- [ ] 1.6 For `estimation`'s reworded description: one positive and one near-miss probe in
      `tests/trigger_probes.yaml`, and `make skill-inventory`. **Accept:** both probes present
      (`near_miss_of` on the near-miss); `tests/test_skill_inventory.py` passes.

## 2. Contracts (D-6, D-7)

- [ ] 2.1 `tools/bundle_gen`: give `_exact_keys` an `optional` parameter and accept an optional
      `requires` list per bundle (impact on `_exact_keys` and `load` first). Do not render it into `marketplace.json`. **Accept:** `make bundles` runs;
      `git diff .claude-plugin/marketplace.json` shows no `requires`; `tests/test_bundle_gen.py`
      passes, with a new case for an unknown key still rejected.
- [ ] 2.2 Validator agent contract: `metadata` joins `AGENT_OPTIONAL_FIELDS`;
      `spec/agent-template.md` lists it in the frontmatter contract, with the sentence that a
      `metadata`-only change needs no new Gherkin scenario (D-7), and `AGENTS.md`
      "Proven triggers" says "every behavioural agent change ships with a Gherkin scenario", so the
      binding agrees. **Accept:** `make validate` green
      with the 1.3 data.
- [ ] 2.3 Renderer: no code change (D-7). Add an installer test, as a regression guard, that a
      rendered agent carries no `metadata`; record the intended omission in
      `docs/environment/dual-cli/mapping.md`. Then run `claude plugin validate .`
      at the repo root (the marketplace root; `bundles/<b>` has no manifest of its own). **Accept:** `npm run test:opencode-installer` passes; `mapping.md`
      names `metadata`; `claude plugin validate` reports no error for `metadata` (otherwise apply the
      error-matrix fallback and record it).

## 3. Checks (D-8)

- [ ] 3.1 `facets_declared` in `ALL_CHECKS`, with negative tests: a missing facet, a list value, an
      unknown value, an agent without facets. **Accept:** the four tests pass; `make validate` green.
- [ ] 3.2 `bundle_requirements` in `ALL_CHECKS`, reusing `skill_inventory.collect()`, with negative
      tests: an undeclared edge, a cycle, core requiring a bundle, a core skill delegating to another
      bundle, an unknown required bundle. **Accept:** the five tests pass; `make validate` green.
- [ ] 3.3 `doc_register_complete` in `ALL_CHECKS`, reading the §8 table (exact paths and
      `folder/**` prefixes, D-8), with tests: an unmatched file fails; `docs/ai-sales/x/y.md` matches
      the row `docs/ai-sales/**`. **Accept:** both tests pass (green after 5.1; local red
      step before it).

## 4. Catalogue map (D-9)

- [ ] 4.1 Generator: read `facets.yaml`; retire `PURPOSE_OF` and `PURPOSE_BLURB`; turn
      `category_gaps` into a facet-gap check. **Accept:** `grep -n "PURPOSE_OF\|PURPOSE_BLURB"
      tools/skill_inventory.py` is empty; `tests/test_skill_inventory.py` passes.
- [ ] 4.2 Add agents to the Map (inside their bundles, with edges to the skills they load) and the
      bundle-requirements graph. **Accept:** the regenerated file names all 3 agents and shows
      `meaningfy-building → meaningfy-architecture`.
- [ ] 4.3 Add the facet columns and agent rows to each bundle table, and the "By facet" section (one
      table per facet). **Accept:** the `posture` table's `reusable` row lists exactly the 11
      reusable skills of §A.
- [ ] 4.4 Title "Catalogue map"; regenerate with `make skill-inventory`. **Accept:** the drift test
      passes.

## 5. Documentation register and install text (D-10, DEC-7)

- [ ] 5.1 Rewrite `docs/development-method.md` §8 as the register table: every view (exact path or
      `folder/**` prefix), kind, source or topic, make target. **Accept:** `doc_register_complete` green; `README.md`,
      `AGENTS.md`, `CLAUDE.md` and `docs/skill-inventory.md` each have a row.
- [ ] 5.2 README install section: one line saying that bundle requirements are listed in the
      catalogue map, and that `meaningfy-building` needs `meaningfy-architecture`; the same line in
      `docs/environment/setup.md`. **Accept:** both lines present; no hand-kept requirement table.
- [ ] 5.3 `spec/CREATING_SKILLS.md` (the merged guide from `skill-crafting-method`): one short
      section, "Facets and requirements", pointing to `facets.yaml` and §8. **Accept:** it links both;
      no vocabulary is restated.
- [ ] 5.4 CHANGELOG under Unreleased: the facets (contributor action: every new skill or agent
      declares six facets), `requires:`, the catalogue map, the register, and the reworded hand-offs.
      **Accept:** an "Action needed (contributors)" line exists.
- [ ] 5.5 `docs/development-method.md` §3 posture paragraph: say that the posture is read from
      `metadata.posture` (`reusable`, `profiled`, `precise`). **Accept:** ``grep -n "metadata.posture"
      docs/development-method.md`` hits in §3.

## 6. Verification

- [ ] 6.1 `make validate`, `make validate-spine`, `npm run test:opencode-installer` and
      `openspec validate define-catalogue-model --strict`. **Accept:** all green.
- [ ] 6.2 Fresh install on both CLIs of `meaningfy-building` + `meaningfy-architecture` (the declared
      pair). **Accept:** the skill and agent counts match the map; the opencode agents carry no
      `metadata`.
- [ ] 6.3 GitNexus `detect_changes` against `develop`. **Accept:** changed symbols are limited to
      `tools/bundle_gen`, `tools/repo_lint`, `tools/skill_inventory.py` and the tests;
      risk reported in the PR.

## Roadmap

- [ ] 0.1 · [x] 0.2 · [x] 0.3
- [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6
- [ ] 2.1 · [ ] 2.2 · [ ] 2.3
- [ ] 3.1 · [ ] 3.2 · [ ] 3.3
- [ ] 4.1 · [ ] 4.2 · [ ] 4.3 · [ ] 4.4
- [ ] 5.1 · [ ] 5.2 · [ ] 5.3 · [ ] 5.4 · [ ] 5.5
- [ ] 6.1 · [ ] 6.2 · [ ] 6.3

Group 1 before 2 (the data drives the contracts); 2 before 3 and 4; 5.1 before 3.3 goes green;
group 6 last.

## Verification

All gates of 6.1 green, the fresh-install counts in the PR, and this PLAN scored ≥ 9/10 by
`clarity-gate`.
