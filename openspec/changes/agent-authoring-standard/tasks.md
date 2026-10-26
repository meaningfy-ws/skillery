<!-- PLAN (tasks half). PLAN = design.md + this file. Document type: Implementation. Revision 2. -->

> Derived from EPIC: agent-authoring-standard (`proposal.md`); design in `design.md`. Each task cites the design section it executes. Gate for every task:
> `make validate` and `npm run test:opencode-installer` green at the end of the task, except where a
> task names a red step (local only, never committed red).

## 0. Precondition

- [x] 0.1 Verify every Cross-EPIC contract item (design.md Context) on the working branch: `bundles.yaml`
      with the stated keys and the three agents under `meaningfy-building`; `tools.bundle_gen.gen.load`
      importable; `tools/opencode_gen/` absent; `tools/opencode-agent-map.json` with `modelAliases`,
      `toolNames`, `toolPermission`; `renderAgent(frontmatter, body, map)` exported from `tools/opencode-bundle-lib.mjs`;
      `bundle_gen.agent_frontmatter` and `tools/opencode-catalogue.json`;
      `agent_bundle_membership` in `ALL_CHECKS`. **Accept:** all present; else stop and report the missing
      item to the team lead.

## 1. The standard (D-2, D-3, D-6, D-9, D-10, D-11, D-13, D-17)

- [x] 1.1 In `tools/repo_lint/lint.py` remove `documenter` and `gherkin-writer` from `ALL_AGENT_NAMES`,
      with the comment `# documenter, gherkin-writer: DEC-7 backlog candidates (spec/agent-template.md), not retired names`.
      **Accept:** `make validate` green.
- [x] 1.2 Write `spec/agent-template.md` with `##` sections in this order: *Frontmatter contract* (D-3
      table), *Types* (the D-9 "Dispatch contract must also state" column only, plus a link to
      `../docs/environment/dual-cli/mapping.md` for rendering), *Dispatch contract* (four labels, D-7,
      D-17), *Body* (D-10 skeleton; "the cap is `MAX_AGENT_BODY_LINES` in `tools/repo_lint/lint.py`" — no
      number), *Which bundle* (D-4), *Deterministic before prose* (D-6), *Tests* (D-11), *Field
      adoption* (D-5 table incl. the plugin-ignored column and the D-14 deferral record), *Candidate
      roles* (D-13), *Skeleton* (a fenced copy of the D-10 skeleton with placeholder frontmatter).
      **Accept:** `make validate` green; `grep -nwE "40" spec/agent-template.md` is empty (the cap is named, not stated);
      `grep -E "/opsx:|\.claude/" spec/agent-template.md` is empty.
- [x] 1.3 `spec/skill-repo-governance.md`: rule 2 → "An agent carries no knowledge. Keep an agent only
      when it is a named worker others dispatch, needs a declared runtime type, or needs a model/tool
      restriction that must hold on both CLIs (skill-level `model`, `allowed-tools`, `context: fork` are
      Claude-only). Refusals a tool restriction can enforce are enforced, not written — see
      `agent-template.md` (a markdown link to `agent-template.md#deterministic-before-prose`)."; the four-types table's Agent
      rule cell → "Thin wrapper — see `agent-template.md` (a markdown link to `agent-template.md`)"; add `## Agents` (≤ 3
      lines: the template link and "checked by `agent_conformance` in `tools/repo_lint`").
      **Accept:** `broken_links` clean; no field name or number from D-3 in the file.

## 2. Lint, test-first (design.md "`agent_conformance(repo)`")

- [x] 2.1 In `tests/test_repo_lint_negative.py` add helpers `_agent(root, name, fm: dict, body: str)`,
      `_feature(root, name, skills: list[str], outline: bool = True)`, `_agent_map(root)` (writes a
      minimal `tools/opencode-agent-map.json` with `agentModes`), reuse the sibling's
      `bundles.yaml` fixture helper, and add the 16 M-tests and 2 P-tests named in the design tables.
      **Accept:** `python -m pytest tests/test_repo_lint_negative.py -q` shows exactly those 18 failing.
- [x] 2.2 Implement `agent_conformance` with the constants, `_agent_map` reader and messages of the
      design table; add P1/P2 to `agent_bundle_membership` (membership via `bundle_gen.load`). Do **not**
      add `agent_conformance` to `ALL_CHECKS` yet. **Accept:** 2.1 tests green;
      `test_clean_fixture_passes_all` green; `make validate` green.

## 3. Renderer (D-9, D-15; spec `dual-cli-generation` "Agent type is rendered per CLI")

- [x] 3.1 Run GitNexus `impact({target: "renderAgent", direction: "upstream"})` and note the blast radius
      in the PR (re-index first if `renderAgent` is unknown). In `tests/opencode-bundle-installer.test.mjs`
      add tests for TC-08…TC-11 and give every synthetic agent there `type: delegated`. **Accept:** the
      new tests red, the old ones green.
- [x] 3.2 Add `agentModes`, `colors` and `toolNames.Skill` to `tools/opencode-agent-map.json`; make
      `bundle_gen` carry `type` into `tools/opencode-catalogue.json`; in `renderAgent` replace the `primary` read with `agentModes[type]`, throw on missing/unknown type,
      push the G-5 gap for `scheduled`, map `color`, drop `skills` and append the D-15 body line.
      **Accept:** `npm run test:opencode-installer` green except the real-repo render test, which goes
      green in task 5 — commit 3.2 together with task 5.

## 4. Displaced knowledge into its owner

- [x] 4.1 `skills/meaningfy-code-review/SKILL.md` §Review procedure step 2 (*Gather*): append "L2 also
      runs the project's test suite (`make test` / `pytest`) and reports failures." **Accept:** `make
      validate` green; `make skill-inventory` leaves no diff.

## 5. Re-cut, scenarios, wire-in (one commit with 3.2)

- [x] 5.1 Replace `agents/code-reviewer.md`, `agents/epic-planner.md`, `agents/implementer.md` with the
      design.md target files verbatim, then run `make bundles`. **Accept:** each body ≤ 30 lines;
      `make lint` reports no stale catalogue.
- [x] 5.2 Write `tests/features/agents/{code-reviewer,epic-planner,implementer}.feature` per the
      design.md Gherkin table, following `bdd-gherkin`. **Accept:** M15–M17 clean for all three.
- [x] 5.3 Add `agent_conformance` to `ALL_CHECKS` after `agent_skill_alignment`; add
      `test_agents_conform_to_standard` to `tests/test_repo_lint.py`. **Accept:** `make validate` and
      `npm run test:opencode-installer` green; adding `bundle: x` to one agent turns `make lint` red with
      M2 (revert).

## 6. Load test on both CLIs (Cross-EPIC contract item 7; D-8, D-15)

- [x] 6.1 (run 2026-10-26, Claude Code CLI, as plugin subagents `meaningfy-building:<agent>`: code-reviewer stayed in L3 and cited cosmic-python entry ids; implementer fixed the file and did not commit; epic-planner returned a question round. `claude --agent` as main thread does NOT preload `skills:`. Original: **Merge gate**: when run,
      ask the dispatched `code-reviewer` to quote a line of `meaningfy-code-review` to prove the preload, and
      check `claude --debug` for unrecognised-field and skipped-skill warnings — review-implementation F-8) Push the branch. In a fresh `CLAUDE_CONFIG_DIR`: `claude plugin marketplace add
      meaningfy-ws/skillery#<branch>`, `claude plugin install meaningfy-building@meaningfy-skillery`.
      Confirm the three agents are listed once; dispatch `code-reviewer` with lens L3 on a one-line diff,
      `implementer` on a trivial task, `epic-planner` on a two-line seed (expect a question round); confirm
      each has its skills in context. Record the working plugin-scoped agent name and the exact
      `claude --agent …` literal (used by 7.2, 8.1). **Accept:** all three behave per their first
      Examples row; results (CLI, version, pass/fail) in the PR description.
- [ ] 6.2 (partial 2026-10-26, opencode v2.1.4: `--project` install from the pushed branch; `opencode debug agents` lists code-reviewer, epic-planner, implementer as `subagent` with mapped models; theme `color` values resolve to grey #aaaaaa (cosmetic gap); dispatches not run — no opencode provider authenticated) On opencode, install `meaningfy-building` from the same pushed branch with the sibling's
      installer command; check each rendered file has `mode: subagent`, no `skills` key, the D-15 body
      line, a theme `color`; run the same three dispatches and confirm the skills were loaded.
      **Accept:** as 6.1; any failure fixed or recorded as a gap in mapping.md.

## 7. Docs (pointer edits; D-2)

- [x] 7.1 `docs/environment/dual-cli/mapping.md`, agent frontmatter table only: add the three `type`
      rows (D-9 rendering columns, incl. the lead and scheduled Claude commands); correct `skills: […]` →
      "not an opencode field; rendered as a load-skills body line"; add `color` → "theme colour via
      `colors` in `tools/opencode-agent-map.json`"; add a "Recorded agent gaps" list G-1…G-5 (D-8, D-9).
      **Accept:** `broken_links` clean; `grep -n "opencode agent \`skills\` list" mapping.md` is empty.
- [x] 7.2 `README.md` "Getting started": replace the "Skill or agent?" agent bullets with: agents are
      delegated workers by default; types are `delegated`, `lead`, `scheduled`; how an agent is written →
      `spec/agent-template.md`, next to the skill template. Add one example invocation per agent ("use the
      code-reviewer agent with lens L3 on this diff" + "a full review is five, one per lens"; "use the
      implementer agent on task 2.1 of change <id>"; "use the epic-planner agent on these seeds; answer its
      question round"). Build-loop table rows 1–3 "Driven by" → "**epic-planner** agent (returns question
      rounds) ◦ …". **Accept:** `readme_inventory_gaps` and `broken_links` clean.
- [x] 7.3 `docs/development-method.md` (untracked draft; three pointer edits only): §4 intro sentence
      "(The normative shape … until it lands, this section is the working rule.)" → "The normative shape
      is `spec/agent-template.md` (a markdown link to `../spec/agent-template.md`)."; §5 "Every agent" bullet "Model, tools
      and bundle in frontmatter" → "Model and tools in frontmatter; bundle in `bundles.yaml`"; §8 row
      "The agent contract" → a markdown link to `../spec/agent-template.md`. Keep a `cp` of the
      file before editing and paste `diff` output in the PR. **Accept:** `grep -c "until it lands"` = 0;
      `grep -c "bundle in \`bundles.yaml\`"` = 1; `grep -c "spec/agent-template.md](../spec/agent-template.md)"`
      ≥ 2; `diff` shows only those three hunks.
- [x] 7.4 `AGENTS.md` four-artefact table, Agent row rule → "Thin wrapper — see
      `spec/agent-template.md`" written as a markdown link. **Accept:** `broken_links` clean; the row
      contains `(spec/agent-template.md)`.
- [x] 7.5 `docs/environment/setup.md` table row `epic-planner` → "thin wrapper loading `epic-planning`,
      `clarity-gate`, `bdd-gherkin`, external `stream-coding`"; `docs/ai-coding/build-lifecycle.md` line
      ~143 "fixes the spec (not just the code) on design-level failures" → "proposes the spec fix on
      design-level failures; the developer or epic-planner applies it", and line ~256 list: add "(type
      `delegated`)" to each agent. **Accept:** `broken_links` clean; grep finds the new phrases.

## 8. CHANGELOG and coordination

- [x] 8.1 Under `## [Unreleased]` (below the sibling's release section, Cross-EPIC contract item 6)
      add "**Changed** — Agents follow one written standard (`spec/agent-template.md`), checked by
      `make validate`. `implementer` no longer commits: it reports, you commit. `code-reviewer` reviews
      one lens per dispatch; ask for a lens (L1–L5), or five for a full review. `epic-planner` returns
      question rounds for you to answer instead of asking mid-run." **Accept:** line present; no version
      bump.
- [x] 8.2 `openspec/changes/add-sales-bundle/proposal.md` Capabilities line citing `agent-authoring` →
      "`catalogue-governance` (requirement "Agents conform to the agent authoring standard"): first use of
      the `scheduled` type, incl. the interactive composite (agent-authoring-standard design D-17)". No
      other edit. **Accept:** `grep -c "\`agent-authoring\`:" add-sales-bundle/proposal.md` = 0.

## 9. Verify and sync

- [x] 9.1 (all green 2026-10-26 on a clean checkout of the branch; the 4 sibling proposals are not shipped) `make validate`, `npm run test:opencode-installer`, `make validate-spine` and
      `npx --yes @fission-ai/openspec@$(cat spine/openspec-version.txt) validate agent-authoring-standard --strict`
      green; GitNexus `detect_changes({scope: "compare", base_ref: "develop"})` shows only expected
      symbols. **Accept:** all exit 0.
- [ ] 9.2 Spec sync at archive (`spec-stewardship`): archive the change, `make fix-spec-links`, groom
      the two ADDED requirements in `openspec/specs/catalogue-governance/spec.md` and
      `openspec/specs/dual-cli-generation/spec.md`. **Accept:** `make validate` + `make validate-spine`
      green after archive.

## Roadmap

- [x] 0.1 · [x] 1.1 · [x] 1.2 · [x] 1.3 · [x] 2.1 · [x] 2.2 · [x] 3.1 · [x] 4.1 · [x] 3.2 + 5.1–5.3 (one
  commit) · [ ] 6.1 · [ ] 6.2 · [x] 7.1 · [x] 7.2 · [x] 7.3 · [x] 7.4 · [x] 7.5 · [x] 8.1 · [x] 8.2 ·
  [ ] 9.1 · [ ] 9.2

## Verification

`make validate` (lint incl. `agent_conformance` + pytest negatives), `npm run test:opencode-installer`
(renderer), `make validate-spine`; the three agents load from a pushed branch on both CLIs (6.x);
clarity gate ≥ 9/10 (design.md scorecard).
