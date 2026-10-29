<!-- PLAN (tasks half). PLAN = design.md + this file. Revision 1, 2026-10-29. -->

> Derives from: EPIC `rules-in-every-session` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).
> Gate for every task: `make validate` is green at its end. Run `make bundles` and
> `make skill-inventory` first when the task touches skills or `bundles.yaml`.
> **Failure first:** each step opens with its failing tests (group 1), and they go green in the
> groups that follow.
> **Two steps, two pull requests:**
> - **Step 1** (groups 1A, 2, 3 and 5.1) merges into `develop` alone and leaves `rules.py` untouched.
> - **Step 2** (groups 1B, 6, 7 and 8.1) branches from `develop` after step 1 merges, as
>   `feat/rules-repository-store`.
> - If step 2 is cut, mark its tasks `cut`, delete the requirement "A development rule can live in the
>   repository" from the spec delta, and archive.
> - Group 4 holds live checks that do not block either merge.

## 0. Precondition

- [ ] 0.1 Merge `develop` into `feat/rules-in-every-session`. This brings in PR #123's
  `docs/environment/rules.md`, which tasks 3.1 and 8.1 edit.
- [ ] 0.2 Have an independent subagent gate this PLAN at ≥ 9/10. The owner answers the hand-off's
  question round, and the answers are folded into `design.md` Decisions.

## 1. Failure cases and fixtures (red)

### 1A. Step 1

- [ ] 1.1 Write `openspec/changes/rules-in-every-session/inputs/failure-cases.md`. For each case,
  record the evidence, the expected behaviour and the spec scenario:
  - **F-1 (step 1):** a rule stated in a code repository is lost, and a vault rule is not applied
    there. Evidence: `bundles.yaml` puts the skills in `vault-assistant`, `global-prompt.md` has no
    rules line, and the only load line is `skills/vault-setup/assets/AGENTS.md:31`. This is rule-learner
    F-1 again, outside the vault.
  - **F-2 (step 1):** the Claude Code allow rule names `vault-assistant`, so it breaks with the move.
  - **F-3 (step 2):** a project convention ("never commit straight to main in this repo") can only go to
    one person's vault, where the team never sees it.
  - **F-4 (step 2):** a team rule and a personal rule that disagree would not be reported, because no
    tool reads both.
- [ ] 1.2 Add tests T-1, T-2 and T-3 (design, Test case specifications) to `tests/test_rulebook.py`.
  **Accept:** they fail on the branch as it is.

### 1B. Step 2 (at the start of step 2's branch)

- [ ] 1.3 Build the fixture `tests/fixtures/rulebook/repo/`, with no `.git` (tests create it in
  `tmp_path`):
  - `AGENTS.md`, without the pointer;
  - `docs/rules/P-0001 never commit straight to main.md`: constraint, hard, `activity:coding`;
  - `docs/rules/P-0002 use American spelling.md`: `activity:writing`, `spelling=american`, default,
    against vault `R-0001`;
  - `docs/rules/P-0003 ….md`: `exception_of: R-0001`, the cross-store dangling case;
  - a note in `docs/rules/` whose frontmatter holds an `R-` id;
  - `docs/rules/README.md`, with no frontmatter;
  - `langfuse-observations-repo.json`: one `load` event that prints a `P-` line, and one `cite P-0001`.

  The vault fixture is unchanged.
- [ ] 1.4 Add T-4 to T-20 (`stats` T-18 uses the file from 1.3).
  **Accept:**
  - T-4 passes, since it is the existing suite;
  - every other test fails for the missing behaviour, not for a setup error.

## 2. Step 1: reach (green)

- [ ] 2.1 `bundles.yaml`:
  - move the three skills to `meaningfy-core`;
  - change both bundle descriptions (D-1).

  Change the facets of `rulebook` and `rule-learner` (D-2). Then run `make bundles` and
  `make skill-inventory`. **Accept:** T-1; `test_the_three_skills_share_one_bundle` stays green.
- [ ] 2.2 Rulebook and learner text:
  - **`rulebook`:**
    - a description that covers any session, under 700 characters, with "(writing, offers, reviews,
      coding, code-review, planning)";
    - "Running the script" for a session outside the vault;
    - the "say once" rule (D-5) in the use protocol;
    - the open activity list in `references/rule-model.md` (D-4).
  - **`rule-learner`:**
    - a description that covers any session;
    - L-4 cites the activity list;
    - the no-store behaviour (D-5).

  **Accept:** spec scenarios "A rule stated in a code repository", "A rule applied outside the vault"
  and "No vault available" are each answered by a named sentence in a skill.
- [ ] 2.3 Permissions (D-6):
  - add the "Permissions (per machine)" section to `skills/rulebook/references/commands.md`;
  - in both `vault-setup` permission references, replace the per-machine sections with the pointer;
  - keep the "approve, never refuse" exception.

  **Accept:** T-3.
- [ ] 2.4 `docs/environment/global-prompt.md`: the D-3 line and the two-CLI header. **Accept:** T-2.
- [ ] 2.5 Catalogue wiring:
  - **Probes** in `tests/trigger_probes.yaml`:
    - positive: "from now on, keep PR descriptions under ten lines in every repo", expecting
      `rule-learner`, near miss of `meaningfy-git-workflow`;
    - near miss: "set up commitlint so this repo enforces conventional commits", expecting
      `meaningfy-git-workflow`, near miss of `rule-learner`.
  - Add `rulebook` and `rule-learner` to `served_by.skills` of `use-cases/UC-W18-programming-team-lead.md`
    and to its row in `docs/use-cases.md`.

  **Accept:** `make validate` green.

## 3. Step 1: user-facing docs

- [ ] 3.1 Docs:
  - **`docs/environment/rules.md`:**
    - the bundle column becomes `meaningfy-core`;
    - a "Where your rules work" table from `inputs/qa.md` (D-7), with Cowork "not yet verified";
    - a Quick Start with worked example 1.
  - **`docs/environment/vault-assistant.md`:** the rule skills come from `meaningfy-core` and still run
    in the vault.
  - **`docs/environment/setup.md`:** the heading names `meaningfy-core`; `MEANINGFY_VAULT` is also set
    in the `env` key of `~/.claude/settings.json`.
  - **`README.md`:** move the three skills from the vault-assistant bundle row to the meaningfy-core row.
  - **`CHANGELOG.md`:** one line for the installer, marked **BREAKING** for the Claude Code allow rule,
    giving the new pattern.

## 4. Live checks (run after the step-1 release; never block a merge)

- [ ] 4.1 **Claude Code permission pattern.** On a machine with the released `meaningfy-core`:
  1. Put the D-6 allow rule in `~/.claude/settings.json`.
  2. Run `load` once from a code repository and once from the vault.
  3. Record in the D-6 section either "tested live <date>, no prompt" or the pattern that worked.
  4. If neither works, record "approve when asked".
- [ ] 4.2 **Cowork.**
  1. Install `meaningfy-core` in Cowork.
  2. Ask it to load the writing rules, with `MEANINGFY_VAULT` set and a local folder granted.
  3. Record in the `docs/environment/rules.md` table whether the script ran, whether it saw the
     variable, and whether it saw the vault. This closes O-1.

## 5. Step 1: review

- [ ] 5.1 Have an independent subagent review step 1 against the spec's first requirement, D-1 to D-7
  and the catalogue rules. Fix the findings, keep `make validate` green, and open the step-1 PR.

## 6. Step 2: the script (green)

- [ ] 6.1 `find_stores()` with the D-8 exclusions, and `where` (D-17). **Accept:** T-14, T-20.
- [ ] 6.2 The repository reader and the id rules (D-9, D-10, D-11), plus `load`, `check FILE` and
  `search` over the union (D-15, D-16). **Accept:** T-4, T-5, T-11, T-12, T-13, T-19.
- [ ] 6.3 `lint --store` with per-store errors and union warnings (D-14), and the write refusal over
  the combined lint. **Accept:** T-15, T-16.
- [ ] 6.4 The writers: `add --store` (default `vault`), `update`/`confirm`/`retire` by prefix, and the
  `approve` and `--candidate` refusals (D-13). Create `docs/rules/` only on a real write, and add the
  pointer (D-12). **Accept:** T-6 to T-10, T-17.
- [ ] 6.5 `stats` stays `R-`-only. Update the module docstring's subcommand list, and keep the file
  stdlib-only. **Accept:** T-18; `grep -E "^(import|from) "` shows stdlib modules only.

## 7. Step 2: skills and docs

- [ ] 7.1 **`rulebook`:**
  - `references/rule-model.md` gains a "Repository store" section: the folder, the `P-` prefix,
    `private: false`, no candidates, the pointer line verbatim, and references within one store;
  - `references/commands.md` gains `where`, `--store`, and the D-16 table;
  - `SKILL.md`: "Where rules live" names both stores.
- [ ] 7.2 **`rule-learner`:** the Store column, the heading reminder, `to vault` / `to repo`, deferral
  limited to the vault, and the DEC-8 closing line (D-18), in `SKILL.md` and
  `references/approval-card.md`, with the example card updated.
  **Accept:** spec scenarios "A project convention stated while coding" and "A personal preference
  stated while coding" are each answered by a named sentence.
- [ ] 7.3 **`rule-steward`:** `lint --store vault` in its procedure and the boundary line (D-14).
  **`project-setup`:** the one citing line in `references/agentic-setup.md` (D-19).
- [ ] 7.4 Docs:
  - `docs/environment/rules.md`: a "Rules in a repository" section with worked examples 2 to 4;
  - a CHANGELOG line;
  - `make bundles` and `make skill-inventory`.

## 8. Step 2: review

- [ ] 8.1 Have an independent subagent review step 2 against the spec's second requirement, D-8 to
  D-19, the error matrix and the backwards-compatibility tests. Fix the findings and open the step-2 PR.

## Roadmap

- [ ] 0.1 · [ ] 0.2
- [ ] **Step 1:** 1.1 · 1.2 · 2.1 · 2.2 · 2.3 · 2.4 · 2.5 · 3.1 · 5.1 · (after release, non-blocking) 4.1 · 4.2
- [ ] **Step 2:** 1.3 · 1.4 · 6.1 · 6.2 · 6.3 · 6.4 · 6.5 · 7.1 · 7.2 · 7.3 · 7.4 · 8.1

## Verification

Run these at the end of each step:
- `make validate`, with `tests/test_rulebook.py` passing;
- `openspec validate rules-in-every-session --strict`;
- the clarity gate, ≥ 9/10 on this PLAN.
