<!-- PLAN (tasks half) for half two. PLAN = design.md (§7 for half two) + this file. Revision 3
     (clarity-gate: round 1 8.4/10, round 2 9.0/10 PASS; its four minor gaps closed here). -->

> Derived from EPIC: skill-crafting-method (`proposal.md`); design in `design.md` §2, §4, §6, §7 and
> the owner decisions D-1…D-4. Gate for every task: `make validate` green at its end. One feature
> branch off `develop` (`docs/skill-crafting-method`), one commit per task, conventional commits.
> GitNexus `impact` before editing any symbol in `tools/`, `detect_changes` before each commit.

## 0. Precondition

- [x] 0.1 Branch from an up-to-date `develop`; `make validate` and
      `npx @fission-ai/openspec@$(cat spine/openspec-version.txt) validate skill-crafting-method --strict`
      both green. **Accept:** both pass before any edit.
- [x] 0.2 Score this PLAN with the full `clarity-gate`. **Accept:** ≥ 9/10.

## 1. Method text (design §2, H-1)

- [x] 1.1 `docs/development-method.md` §2: D-1 into principle 5 and D-2 into principle 6, each
      citing its source; principle 7's budget replaced by a citation; new principle 11 on hooks; the
      third-party content paragraph in principle 4. **Accept:** `grep -n "a few hundred words"
      docs/development-method.md` is empty; `grep -n "hooks/inventory.yaml"` hits in §2; the OWASP ids
      AST01, AST02, AST03, AST05, AST07 and AST10 appear.
- [x] 1.2 §3 step 5 names `skill-creator`, the on-demand eval workflow and the opencode gap; §9 gains
      the D-1 line; the §3 step 3 and §9 wording names the body section `## Boundary & Related Skills`
      instead of `boundary` / `related_skills` keys. **Accept:** ``grep -nE "\`(boundary|related_skills)\`"
      docs/development-method.md`` returns nothing.
- [x] 1.3 `AGENTS.md` "Boundary / related-skills" bullet: the body section `## Boundary & Related
      Skills`, not frontmatter. **Accept:** `grep -n "frontmatter must declare its" AGENTS.md` is empty
      and the bullet names the heading.
- [x] 1.4 The status line at the top of the method: replace "hypothesis under test" with the outcome
      (owned rows kept; adopted rows cited; not separated, D-4). **Accept:** `grep -n "hypothesis"
      docs/development-method.md` is empty.

## 2. Authoring texts (design §4, H-2, H-3)

- [x] 2.1 Rewrite `spec/CREATING_SKILLS.md` as the merged authoring guide: Meaningfy deltas plus
      citations; anything still unique in `CONTRIBUTING.md` moves in. **Accept:** ≤ 200 lines; it
      cites `writing-skills` and agentskills.io by link; no number for size or description length
      that the spec owns.
- [x] 2.2 Reduce `CONTRIBUTING.md` to the entry page. **Accept:** ≤ 40 lines; it links to
      `spec/CREATING_SKILLS.md` and `docs/development-method.md#9-definition-of-done`; no checklist.
- [x] 2.3 Reduce `spec/agent-skills-spec.md` to the citation and field notes. **Accept:** ≤ 40 lines;
      it links to agentskills.io/specification and names `CLAUDE_ONLY_SKILL_KEYS` as the list's home.
- [x] 2.4 Align `spec/skill-template.md` with D-2 (what + when description) and design §2's
      documentation row. **Accept:** the template's description placeholder reads "Use this skill
      when…" and states what the skill does.
- [x] 2.5 Fix every link to removed sections. **Accept:** `make validate` green (`broken_links`).

## 3. Dependencies and evals (design H-7, H-8, H-10)

- [x] 3.1 `docs/environment/setup.md` §2: one row per adopted method with its source and the
      version or read date: `skill-creator`; `writing-skills` (inside `superpowers`, 7.0.0); the
      agentskills.io specification and guides (read 2026-10-26); the Claude Code skill and eval docs
      (read 2026-10-26); OWASP Agentic Skills Top 10 (v1.0, public review). **Accept:** five rows
      present, each with a link and a version or date.
- [x] 3.2 Rewrite the header of `tests/trigger_probes.yaml`: probes are repo fixtures and seed each
      skill's trigger-eval set (agentskills.io method, run with `skill-creator`); CI never runs a
      model. **Accept:** the "HQ-04.1 for the future harness" sentence is gone; the header names
      `skill-creator`.
- [x] 3.3 Add the seed suite `evals/meaningfy-consulting/quotation-bind/` (`prompt.md`, `graders/`)
      in the documented `claude plugin eval` format. **Accept:** with the maintainer's own Claude
      credentials, `claude plugin eval <temporary plugin dir, assembled as in H-7> --case quotation-bind
      --runs 1 --ablation none --no-publish --trust-plugin --max-cost-usd 1` completes and both graders
      report. If no credentials are available, the run is deferred to 6.4 and noted in the PR.
- [x] 3.4 Add `.github/workflows/plugin-eval.yml` (`workflow_dispatch` only; the H-7 inputs; the
      temporary plugin directory with its written `plugin.json`; `--trust-plugin --no-publish`; the
      `ablation` input; upload of `$RUNNER_TEMP/plugin/evals/results/`; a step 0 that checks the secret).
      **Accept:** `grep -nE "^on:|workflow_dispatch|pull_request|push" .github/workflows/plugin-eval.yml`
      shows only `workflow_dispatch`; `grep -n 'RUNNER_TEMP/plugin/.claude-plugin/plugin.json'` and
      `grep -n "ANTHROPIC_API_KEY"` both hit in the file; `actionlint` (if installed) or a YAML
      parse passes.
- [ ] 3.5 Tell the owner that the job needs the `ANTHROPIC_API_KEY` repository secret (it is not
      added by the change). **Accept:** stated in the PR body and in the workflow file's header
      comment.

## 4. Tooling (design H-4, H-5, H-6, H-9)

- [x] 4.1 Move the three top-level `version:` keys to `metadata.version` (strings) in
      `cosmic-python`, `executive-communication` and `semantic-consulting-coach`. **Accept:**
      `grep -ln "^version:" skills/*/SKILL.md` is empty.
- [x] 4.2 Add `frontmatter_keys` and `description_too_long` to `ALL_CHECKS`, with
      `CLAUDE_ONLY_SKILL_KEYS`, and their negative tests in `tests/test_repo_lint_negative.py`
      (a top-level `version`, a non-string `metadata` value, a 1,025-character description).
      **Accept:** `make validate` green on the repo; the three negative tests pass.
- [x] 4.3 Add the two advisory reports (descriptions > 600 characters; `SKILL.md` > 500 lines or
      > 5,000 tokens by characters ÷ 4) to `_print_trigger_notes`. **Accept:** the run lists
      `architecture` and `cosmic-python` under the size note and never fails because of the reports.
- [x] 4.4 Remove `templates_mirrored` and its test. **Accept:** `grep -rn templates_mirrored tools
      tests` is empty.
- [x] 4.5 Add `METHOD_CHECKS` to `lint.py` (the H-6 subset of `ALL_CHECKS`; run GitNexus `impact`
      on `ALL_CHECKS` first) and a test that runs it on a temporary tree holding only
      `skills/foo/SKILL.md` with a `## Boundary & Related Skills` section. **Accept:** the test
      passes with no error; every name in `METHOD_CHECKS` is also in `ALL_CHECKS`.

## 5. Release documentation

- [x] 5.1 CHANGELOG under Unreleased: what contributors now follow (the cited methods, D-1, D-2), the
      new gates, the on-demand eval workflow, and the moved `version` keys. **Accept:** the lines are
      written for a contributor, and name the gates.
- [x] 5.2 `make skill-inventory` if any description changed. **Accept:**
      `tests/test_skill_inventory.py` passes.

## 6. Verification

- [x] 6.1 `make validate`, `make validate-spine` (this change passes) and `openspec validate
      skill-crafting-method --strict`. **Accept:** all green for this change.
- [x] 6.2 Line count of the seven authoring texts before and after. **Accept:** the total falls from
      1,414 to ≤ 800 lines (design §4 estimate: about 700); the counts are recorded in the PR.
- [x] 6.3 GitNexus `detect_changes` against `develop`. **Accept:** only `tools/repo_lint/lint.py`
      and the tests are in scope; risk reported in the PR.
- [ ] 6.4 Start the eval workflow once by hand for `meaningfy-consulting` after the owner adds the
      secret. **Accept:** the run completes under its cost ceiling and uploads results; if the secret
      is absent, recorded as a gap at archive.

- [x] 6.5 Baseline audit (roadmap step 2, `design.md` §8): run `make validate` on the merged change
      and write `inputs/baseline-audit.md`, listing every blocking finding (expected none) and every
      advisory finding (descriptions over 600 characters, bodies over 500 lines or about 5,000
      tokens), grouped into proposed revision batches with a one-line scope each. **Accept:** the
      file lists each finding with its skill and number, and every finding belongs to exactly one
      batch.

- [x] 6.6 Write the EPIC for roadmap step 4: `openspec/changes/restructure-and-evaluate-catalogue/`
      (`proposal.md` plus `inputs/`), using the epic-planning procedure: seed intake from
      `inputs/baseline-audit.md` (6.5) and `design.md` §8, an owner Q&A, then appetite, why,
      solution outline, decisions, rabbit holes and no-gos. It covers a rigorous restructuring and
      evaluation of the current repo: which skills, docs and bundles are revised, the evaluation
      protocol (D-1 baseline runs, the agentskills.io trigger method with `skill-creator`, the
      on-demand `claude plugin eval` per bundle, before/after records), and the order relative to
      `define-catalogue-model`. **Accept:** the proposal exists, cites the audit as its golden-thread
      parent, has no-gos and DEC ids, and passes the lightweight `clarity-gate` readiness check. *(Done 2026-10-26; the proposal stays
      uncommitted until its PLAN adds spec deltas, because a proposal-only change fails
      `validate-spine` in CI.)*

## Roadmap

- [x] 0.1 · [x] 0.2
- [x] 1.1 · [x] 1.2 · [x] 1.3 · [x] 1.4
- [x] 2.1 · [x] 2.2 · [x] 2.3 · [x] 2.4 · [x] 2.5
- [x] 3.1 · [x] 3.2 · [x] 3.3 · [x] 3.4 · [ ] 3.5
- [x] 4.1 · [x] 4.2 · [x] 4.3 · [x] 4.4 · [x] 4.5
- [x] 5.1 · [x] 5.2
- [x] 6.1 · [x] 6.2 · [x] 6.3 · [ ] 6.4 · [x] 6.5 · [x] 6.6

Groups 1, 2, 3 and 4 are independent after 0; group 5 follows them; group 6 comes last.

## Verification

`make validate` + `make validate-spine` + `openspec validate --strict` green, the authoring-text line
count in the PR, and this PLAN scored ≥ 9/10 by `clarity-gate`.
