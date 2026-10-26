<!-- PLAN (tasks half). PLAN = design.md + this file. The apply phase parses `- [ ]` checkboxes. -->

> Derived from EPIC: single-source-distribution ([`proposal.md`](proposal.md)). Reasoning:
> [`design.md`](design.md) (D1–D20, the Cross-EPIC contract, the Review disposition). Evidence:
> [`spike-dec5.md`](spike-dec5.md).

Conventions for every task:
- Work on `feat/single-source-and-agent-standard`, or on a `feature/` branch off it.
- Before editing any function, run GitNexus `impact({target, direction: "upstream"})` and note the
  risk (CLAUDE.md).
- Code tasks write the failing test first and watch it fail (`superpowers:test-driven-development`).
- "Gate" is the command that must pass before you tick the task.

**Commit boundaries.** Every pushed commit must be green on `make validate`:
- **C1** = 1.0
- **C2** = 1.1–1.4 + 2.1–2.2 + 3.1. Rendering `marketplace.json` without `skills` lists turns lint
  red until lint and the inventory read `bundles.yaml`.
- **C3** = group 4 + 5.1–5.2. The opencode tree and its tests are deleted together with the new
  installer.
- **C4** = 6.1
- **C5** = group 7
- **C6** = group 8

## 0. Baseline

- [x] 0.1 Run `make install && make validate` and `make validate-spine`; record the results in the PR.
      **Gate:** green. Exception: only the known shaping-only siblings may fail `validate-spine`
      (`add-devops-bundle`, `add-sales-bundle`, `fix-accumulated-skill-defects`,
      `skill-crafting-method`). Note them.

## 1. Strict YAML, `bundles.yaml`, `tools/bundle_gen` (D18, D2, D3, D4, D6)

- [x] 1.0 (C1) Add TC-11b to `tests/test_repo_lint_negative.py` and see it fail. Add
      `frontmatter_strict_yaml` to `tools/repo_lint/lint.py` (D5) and register it in `ALL_CHECKS`;
      `make lint` now lists the 12 skills. Quote each failing `description` per D18, using a throwaway
      script. For each file, assert that the old raw value equals the new value from
      `yaml.safe_load`, and that the diff touches only that one line. **Gate:** `make validate` green;
      `git diff --stat` shows 12 `SKILL.md` files with 1 line each.
- [x] 1.1 Write `tests/test_bundle_gen.py`: TC-01…TC-07, TC-07b, TC-22, TC-23, TC-24 (design.md).
      **Gate:** fails with `ModuleNotFoundError: tools.bundle_gen`.
- [x] 1.2 Create `tools/opencode-agent-map.json` with `modelAliases`, `toolNames` and
      `toolPermission`, copied verbatim from `tools/opencode_gen/gen.py` `MODEL_ALIASES` / `TOOL_NAMES` /
      `TOOL_PERMISSION`. Create `tools/bundle_gen/{__init__,__main__,gen}.py` with `load`,
      `agent_frontmatter`, `render`, `write` and `gate_errors`, exactly as in D4/D6. **Gate:** every
      TC in 1.1 passes except TC-22.
- [x] 1.3 Author `bundles.yaml` per D2: the five bundles copied from today's `marketplace.json` (same
      order, descriptions and skill order); `agents: [epic-planner, implementer, code-reviewer]` on
      `meaningfy-building` and `agents: []` elsewhere. **Gate:** `python -m tools.bundle_gen check`
      reports only stale-file and missing-link errors.
- [x] 1.4 Makefile: add the `bundles` target (`python -m tools.bundle_gen generate`) and add it to
      `.PHONY`. Run `make bundles`. **Gate:**
      - TC-22 passes;
      - `marketplace.json` has 5 entries with `source: "./bundles/<name>"` and no `skills`/`strict`;
      - `bundles/` holds 32 skill links and 3 agent links;
      - `tools/opencode-catalogue.json` exists;
      - `claude plugin validate .` reports `✔ Validation passed` (if `claude` is unavailable, note it
        and rely on IT-01).

## 2. `repo_lint` (D5)

- [x] 2.1 Tests:
      - `tests/test_repo_lint_negative.py`: replace `_marketplace()` with a `_bundles()` helper that
        writes `bundles.yaml`. Adapt the membership cases to TC-08, TC-09 and TC-11. Add TC-10 with
        the three exact messages. Turn `random-bundle` into TC-12 (no error). Add TC-26.
      - `tests/test_repo_lint.py`: `test_every_marketplace_skill_exists` reads `bundles.yaml`; drop the
        `EXPECTED_BUNDLE_NAMES` assertion.

      **Gate:** the new and changed tests fail.
- [x] 2.2 Edit `tools/repo_lint/lint.py`:
      - `_marketplace_skills` and `_bundle_membership` derive from `tools.bundle_gen.gen.load`;
      - add `agent_bundle_membership` to `ALL_CHECKS`, with the D5 messages verbatim;
      - delete `EXPECTED_BUNDLE_NAMES` and its comment;
      - replace `opencode_tree_gates` with `bundle_gates`;
      - in `agents_canonical_invariant`, add the CLAUDE.md gitnexus-block check;
      - add `"bundles"` to `_SKIP_DIRS`, and reword the `.opencode` comment without the words
        `opencode_gen` or `generated`.

      **Gate:** `pytest tests/test_repo_lint*.py` green.

## 3. Skill inventory

- [x] 3.1 (C2 closes) Edit `tools/skill_inventory.py`:
      - `_bundles()` derives from `bundle_gen.gen.load`;
      - the module docstring (lines 5–11) and the line-230 comment name `bundles.yaml` and
        `tools/bundle_gen` instead of `marketplace.json` and `tools/opencode_gen`.

      Also fix the `tests/test_skill_inventory.py` docstring, then run `make skill-inventory`.
      **Gate:** `make validate` green; the `docs/skill-inventory.md` diff is the provenance header
      only. Commit C2.

## 4. opencode installer (D6, D7, D8, D11)

- [x] 4.1 `package.json`: set `files` to `["skills", "agents", "tools/opencode-catalogue.json",
      "tools/opencode-agent-map.json", "tools/opencode-plugin.mjs", "tools/opencode-bundle-lib.mjs",
      "tools/skillery-opencode.mjs", "README.md", "LICENSE"]`. There is **no** `dependencies` key.
      **Gate:** `node -e "JSON.parse(require('fs').readFileSync('package.json'))"` exits 0.
- [x] 4.2 Rewrite `tests/opencode-bundle-installer.test.mjs`. The fixture is `skills/`, `agents/`,
      `tools/opencode-catalogue.json` and `tools/opencode-agent-map.json`, with no `.opencode/`. Keep
      the three existing behaviours and add TC-13…TC-21 and TC-25. **Gate:**
      `npm run test:opencode-installer` fails on the new cases only.
- [x] 4.3 Edit `tools/opencode-bundle-lib.mjs`:
      - roots: `CATALOGUE` = `<root>/tools/opencode-catalogue.json`, `AGENT_MAP`, `SKILLS_ROOT`,
        `AGENTS_ROOT`; drop `GENERATED_SKILLS_ROOT`;
      - `loadCatalogue()` checks only the shape (D6);
      - add `agentsForBundles`, `agentBody(stem)` (split at the second `---` line) and
        `renderAgent(frontmatter, body, map)`;
      - change the error message to "missing skill".

      **Gate:** TC-13, TC-14, TC-19 and TC-25 pass.
- [x] 4.4 Edit `tools/skillery-opencode.mjs`:
      - the copy filter skips `__pycache__`, `*.pyc` and `*.pyo`;
      - agents are installed only for `--global` and `--project`; with `--target`, print the D7
        notice instead;
      - check every skill and agent destination before writing anything;
      - write agent files via a temp file and a rename;
      - print `gap:` lines and write `managedAgents`;
      - uninstall removes agents no longer managed;
      - `status` prints agent counts;
      - read manifests tolerantly; add a `report` command; update the usage text.

      **Gate:** TC-15…TC-18 and TC-21 pass.
- [x] 4.5 Repoint `tools/opencode-plugin.mjs` to `SKILLS_ROOT`. **Gate:** TC-20 passes and the full
      `npm run test:opencode-installer` suite is green.
- [x] 4.6 Run `npm pack --dry-run`. **Gate:** IT-04.

## 5. Delete the generated tree and the old generator (DEC-1, DEC-4, D9, D10, D12)

- [x] 5.1 Remove the old artefacts and rewire the Makefile:
      - `git rm -r .opencode opencode.json tools/opencode_gen tests/test_opencode_gen.py`;
      - append `.opencode/` to `.gitignore`, commented as installer `--project` output;
      - Makefile: delete `generate-opencode`, add `opencode-report: node tools/skillery-opencode.mjs report`,
        and update `.PHONY`.

      **Gate:**
      - `make validate` green;
      - `grep -rn "opencode_gen\|generate-opencode\|GENERATED_SKILLS_ROOT" tools tests Makefile` is empty.
- [x] 5.2 (C3 closes) In `skills/linkml-engineering/references/generation-and-templates.md` (~line 106),
      replace `tools/opencode_gen` with `tools/bundle_gen`. **Gate:** `make validate` green. Commit C3.

## 6. CI (D16)

- [x] 6.1 (C4) *(green in CI on #58, #59, #60)* Add an `opencode-installer` job to `.github/workflows/validate.yml`:
      `actions/checkout@v4`, `actions/setup-node@v4` (node 20), `npm run test:opencode-installer`.
      **Gate:** the job is green on the pushed branch.

## 7. Documentation sync (D11, D13, D14, D20)

Use one grep for the doc gates below:
`grep -rn "generate-opencode\|committed .opencode\|\.opencode/skills\|OPENCODE_CONFIG_DIR\|opencode_gen" <file>`.
It must be empty, except for intended migration text in `CHANGELOG.md`. `.opencode/plugin/` and
`.opencode/agents/` remain legitimate consumer-repo paths.

- [x] 7.1 `AGENTS.md`, per D13: bundle assignment, Dual-CLI authoring bullets, the version bullet
      (three rendered files), a **Branch flow** bullet, and "How to validate" naming the CI node job.
      Per D14, add the scope and re-index line **outside** the gitnexus markers. **Gate:** doc grep;
      `make validate` green.
- [x] 7.2 `CLAUDE.md`: delete the gitnexus block and add one line saying GitNexus guidance lives in
      `AGENTS.md`. **Gate:** TC-26 check green on the real repo.
- [x] 7.3 `CONTRIBUTING.md`, per the D13 table:
      - replace the Submission Checklist with a routing paragraph to §9 and `spec/CREATING_SKILLS.md`;
      - Step 3: `bundles.yaml` + `make bundles`;
      - delete Step 4;
      - Step 5: the `git add` list becomes `skills/my-new-skill bundles.yaml bundles/ .claude-plugin/marketplace.json tools/opencode-catalogue.json README.md`;
      - fix the Summary and "Removing Skills".

      **Gate:** doc grep; no `- [ ]` lines remain; `broken_links` green.
- [x] 7.4 `spec/CREATING_SKILLS.md` (~lines 23, 52, 68, 311): register in `bundles.yaml` + run
      `make bundles`, and delete the generate-opencode sentence. Add one line under "YAML Frontmatter":
      quote a `description` that contains `: `. **Gate:** doc grep.
- [x] 7.5 `docs/development-method.md`, pointer-level edits only:
      - §3 step 6 and §6 bullet 1, per D13;
      - the §9 bundle line becomes "`make bundles` if membership or agent frontmatter changed";
      - add exactly **one** new §9 line: the licence/provenance line from D13.

      **Gate:** doc grep; §9 has exactly one more line than before.
- [x] 7.6 `README.md`:
      - skills **and agents** each in exactly one bundle;
      - agents ship with `meaningfy-building`;
      - repo-structure block: drop `.opencode/`; add `bundles.yaml`, `bundles/` and
        `tools/opencode-catalogue.json` (rendered, never hand-edit); `.claude-plugin/` (rendered);
      - "Uninstall & conflicts": delete the old-bundles row and its worked example; add an
        "Upgrading from ≤ 2.11" row that links to the CHANGELOG migration note.

      **Gate:** `readme_inventory_gaps` and `broken_links` green.
- [x] 7.7 `docs/environment/dual-cli/setup-opencode.md`:
      - Step 3: agents are installed with `--global` and `--project`, not with `--target`;
      - Step 10: the expected output names the agent count;
      - the plugin route is skills only (a gap);
      - replace the direct-checkout route with `node tools/skillery-opencode.mjs install <bundle> --project`;
      - verification: `npx skills add meaningfy-ws/skillery#<ref> --list` shows no skipped skill.

      **Gate:** doc grep; each step is one runnable action.
- [x] 7.8 `docs/environment/dual-cli/setup-claude.md`:
      - Step 1: the Windows prerequisite, plus "remove and re-add the marketplace if you added it
        before enabling `core.symlinks`";
      - Step 9: the expected per-bundle counts;
      - add a "Testing a branch" note: install from the pushed branch, never from a local path.

      **Gate:** doc grep.
- [x] 7.9 `docs/environment/dual-cli/mapping.md`:
      - the skills, agents and `VERSION` rows: opencode "copied from `skills/` at install", "rendered
        at install from `agents/` + `tools/opencode-catalogue.json`"; Claude "via `bundles/<b>/`
        symlinks";
      - add `bundles.yaml` and `tools/opencode-agent-map.json` rows;
      - leave the `type` rows to the sibling.

      `docs/environment/dual-cli/README.md` lines 4 and 19: "Change bundle membership → `make bundles`".
      `docs/environment/dual-cli/compatibility.md` lines 21–23: the agent renderer targets
      `.opencode-version`.
      **Gate:** doc grep; `broken_links` green.
- [x] 7.10 `docs/environment/setup.md`: re-grep and fix any hits. **Gate:** doc grep.
- [x] 7.11 Re-grep `tests/ownership.yaml`, `tests/trigger_probes.yaml`, `prompts/`,
      `.github/ISSUE_TEMPLATE/` and `hooks/` for `marketplace.json` membership claims, and fix each
      hit. **Gate:** doc grep over those paths.
- [x] 7.12 (D20) Two one-line edits to other changes' proposals:
      - Append to the "Half two" bullets of `openspec/changes/skill-crafting-method/proposal.md`:
        "- *(Inherited 2026-10-26 from `single-source-distribution` R3:)* decide the merge of
        `CONTRIBUTING.md` + `spec/CREATING_SKILLS.md` into one authoring guide."
      - In `openspec/changes/fix-accumulated-skill-defects/proposal.md` line 62, change "it is in
        `single-source-distribution`" to "it is in `skill-crafting-method` half two (moved from
        `single-source-distribution`, R3)".

      **Gate:** `openspec validate skill-crafting-method` and `fix-accumulated-skill-defects`
      are no worse than at 0.1.
- [x] 7.13 (DEC-8, F6) `spec/skill-repo-governance.md`:
      - rule 1 gains the provenance exception;
      - line 18 becomes `bundles.yaml` (rendered to `.claude-plugin/`, `bundles/` and
        `tools/opencode-catalogue.json`);
      - line 35 becomes "`bundles.yaml`↔dirs (skills and agents), strict-YAML frontmatter".

      **Gate:** doc grep; `broken_links` green.

## 8. Release 3.0.0 (DEC-6 re-shaped, R7, D15)

- [x] 8.1 (C6) Set `VERSION` → `3.0.0` and `hooks/inventory.yaml` `version` → `3.0.0`, then run
      `make bundles`. **Gate:** version-sync and `hooks_inventory_shape` green.
- [x] 8.2 `CHANGELOG.md`:
      - header: the catalogue version is the root `VERSION`;
      - a new `## [3.0.0] - <date>` section whose first part is **"Action needed"**, carrying D15
        items 1–5 verbatim in substance;
      - **Changed:** bundles are declared once in `bundles.yaml`. Claude bundles load exactly their
        skills and agents: 3 agent registrations instead of 15, and a ~1.9 MB cache instead of ~57 MB.
        opencode installs skills from `skills/` and agents at install. 12 skill descriptions are
        quoted so strict loaders (opencode, `npx skills`) read them;
      - **Removed:** the `.opencode/` tree, `opencode.json`, `make generate-opencode`, the
        direct-checkout route, and the committed `PARITY.md`/`GAP.md` (now `make opencode-report`).

      **Gate:** reviewed against dev-method §5; `broken_links` green.

## 9. Verification

- [x] 9.1 `make validate`, `make validate-spine` (the 0.1 exceptions only) and
      `npm run test:opencode-installer` are green.
- [x] 9.2 *(run 2026-10-26 on the pushed branch: IT-03 9 skills + 3 agents, loader 0 skipped; IT-04 219 files, nothing under .opencode/ or bundles/)* Run IT-03 and IT-04 on the pushed branch, including the `npx skills … --list` loader check,
      and paste the output into the PR.
- [x] 9.3 *(run 2026-10-26: IT-01 and IT-02 counts equal Verification counts; IT-02 updated in place, no reinstall)* Run IT-01 and IT-02 in a fresh `CLAUDE_CONFIG_DIR` from the pushed branch (method:
      `spike-dec5.md` "How to reproduce"). **Gate:** the counts equal design.md "Verification counts".
- [ ] 9.4 *(not run — no Cowork/Desktop run in this release; CHANGELOG item 5 stands)* IT-05 (manual, best-effort): install `meaningfy-core` and `meaningfy-building` from the
      pushed branch in Cowork or Claude Desktop, and record the counts. If nobody can run it, write
      "not run" in the PR. The CHANGELOG item 5 then stands as written.
- [x] 9.5 Run GitNexus `detect_changes({scope: "compare", base_ref: "develop"})`. Affected symbols
      may be only in `tools/bundle_gen`, `tools/repo_lint/lint.py`, `tools/skill_inventory.py`, the
      three `tools/*.mjs`, and the deleted `tools/opencode_gen`. **Gate:** no unexpected module.
- [x] 9.6 `npx --yes @fission-ai/openspec@$(cat spine/openspec-version.txt) validate single-source-distribution --strict`
      reports valid.

## 10. Spec-delta sync (after merge to `develop`)

- [x] 10.1 *(archived 2026-10-26 after v3.0.0)* Archive the change (`/opsx:archive` on Claude, `opsx-archive` on opencode), then run
      `make fix-spec-links`.
- [x] 10.2 *(groomed 2026-10-26)* Groom the `dual-cli-generation` and `dual-cli-distribution` Purposes (D4/D6 wording), and
      check that no MODIFIED requirement lost a scenario. **Gate:** `make validate-spine` and
      `groomed_spec_purpose` green.

## Roadmap

- [x] 0.1 · [x] 1.0 (C1) · [x] 1.1 · [x] 1.2 · [x] 1.3 · [x] 1.4 · [x] 2.1 · [x] 2.2 · [x] 3.1 (C2) ·
  [x] 4.1 … [x] 4.6 · [x] 5.1 · [x] 5.2 (C3) · [ ] 6.1 (C4, needs push) · [x] 7.1 … [x] 7.13 (C5) · [x] 8.1 ·
  [x] 8.2 (C6) · [x] 9.1 · [ ] 9.2–9.4 (need push / manual) · [x] 9.5 · [x] 9.6 · [ ] 10.1 · [ ] 10.2 (after merge)
- Order: 1.0 first; groups 1 → 2 → 3 in sequence; group 4 may start after 1.4; group 5 needs 2–4;
  group 7 needs 5; group 8 comes last before 9.

## Verification

The change is verified when:
- `make validate`, `make validate-spine` and `npm run test:opencode-installer` are green;
- the IT-01…IT-04 outputs are in the PR, with IT-05 recorded or marked "not run";
- `openspec validate single-source-distribution --strict` reports valid;
- the clarity gate scores 9.3/10 (design.md scorecard).
