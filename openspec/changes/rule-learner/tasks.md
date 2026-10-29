<!-- PLAN (tasks half). PLAN = design.md + this file. Revision 3, 2026-10-29 (clarity gate rounds 1 and 2 applied). -->

> Derives from: EPIC `rule-learner` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).
> Gate for every task: `make validate` is green at its end. Run `make bundles` and `make skill-inventory`
> first when the task touches skills or `bundles.yaml`. Failure first: group 1 records the failure cases,
> and its fixtures are the acceptance tests.

## 0. Precondition

- [ ] 0.1 Branch `feat/rule-learner` off `feat/reasoning-capabilities`. PLAN gated ≥ 9/10 by an independent subagent.

## 1. Failure cases and fixtures (red)

- [x] 1.1 Write `openspec/changes/rule-learner/inputs/failure-cases.md`, recording for each case the evidence, the expected behaviour and the spec scenario that covers it.
  - **F-1:** a rule the owner stated in one context does not reach another. The 2026-10-27 "no config, YAGNI" rule lives only in one repo's Claude Code auto memory and is absent from vault and opencode sessions.
  - **F-2:** a checkable preference ("British English, no em dash", handover §0) is never enforced on outputs.
  - **F-3:** conflicting rules accumulate unnoticed (the spike's R5/R6).
- [x] 1.2 Build a fixture vault `tests/fixtures/rulebook/vault/`. Its `08 How to/Rules/` holds one note for each of:
  - default-with-exception, and an exception chain of three;
  - a global `activity:*` rule beaten by an activity rule;
  - a conflict;
  - a dead rule by strength, and a dead rule by a same-scope exception;
  - a redundant rule; a pair of mutual duplicates (reported once); an exception that restores a value (not redundant); a rule that overrides a narrower rule through specificity (not redundant);
  - an exception narrower in scope than its base (lint error), and a beats-cycle in an Obsidian-edited fixture (`load` prints "no winner");
  - a weak exception;
  - an `exception_of` cycle and a `supersedes` cycle;
  - a dangling ref;
  - a missing source;
  - a bad regex;
  - an invalid status;
  - a duplicate id;
  - an out-of-vocabulary scope;
  - an unparseable note;
  - an Obsidian-rewritten note (inline list, re-quoted scalars);
  - a check rule;
  - a `dropped` rule.

  Alongside the rule notes:
  - `08 How to/Playbooks/Writing.md`, with vocabulary and two golden examples, one of which fails a check;
  - a second playbook with 31 active rules, generated in the test;
  - `00 Inbox/proposed/`, with one candidate;
  - `tests/fixtures/rulebook/langfuse-observations.json`, with load, cite, override and check events, one truncated load, a GENERATION observation that repeats an earlier cite (it must not count), and noise.
- [x] 1.3 Write `tests/test_rulebook.py` (red). It has one test per scenario of `specs/rule-learning/spec.md` that the script decides, plus one per fixture finding, the exit codes of D-14, and an assertion that rulebook, rule-learner and rule-steward share one bundle (D-2). The clock is fixed with `--today`.

## 2. The rulebook script (green)

- [x] 2.1 `skills/rulebook/scripts/rules.py`: the reader and writer (D-3) and the vault location (D-11). **Accept:** writer output is byte-stable on a round-trip; the Obsidian-rewritten fixture parses to equal values; an unparseable note is a lint error, not a crash.
- [x] 2.2 `load`, `search` and `check` (with `--golden`), with the precedence of D-4 and the output of D-6. **Accept:** the spec scenarios "Default with exception", "A global rule and an activity rule", "Unresolvable conflict" and "A check pattern fails"; the exception-chain fixture.
- [x] 2.3 `lint`, with the classes of D-5. **Accept:** "A dead rule", and one assertion per fixture finding of 1.2.
- [x] 2.4 The writers `add` (with `--candidate`), `update`, `confirm`, `retire` and `approve`, with the refusal rule of D-5 and the id allocation of the error matrix. `approve` follows the vault move procedure. **Accept:** "Adding an approved rule", "Restating an existing rule", the duplicate-add refusal (exit 4), and "a write with only warnings is written".
- [x] 2.5 `cite`, `override` and `stats` (the Langfuse API, `--from-file`, `--since`, `--today`, D-7, the D-10 flags). **Accept:** "A rule overridden twice", "Langfuse unreachable" (exit 3), the truncated-output count, and the format-changed warning.

## 3. Skills

Each skill has a "Use this skill when …" description under 700 characters, a Quick Start with a worked example, Gotchas, `## Boundary & Related Skills`, and the facets purpose `knowledge`, area `personal`, subject `obsidian`, posture `precise`, stage `any`, maturity `experimental`.

- [x] 3.1 `skills/rulebook/`:
  - `SKILL.md`: the use protocol (load, cite, check), precedence, the pointer to the model reference, a body under 200 lines;
  - `references/rule-model.md`: the twelve types with meaning, required fields and an example each; strength; scope and globals; the lifecycle-to-status mapping; the note format and quoting;
  - `references/commands.md`: every subcommand with its exit codes (D-14);
  - `assets/templates/rule.md` and `assets/templates/playbook.md`.

  **Accept:** the spec requirement "One rule model" answered here and nowhere else.
- [x] 3.2 `skills/rule-learner/`:
  - `SKILL.md`: when to listen, owner-turns-only, mutations, the rule approval card, `override`, the D-2 path, and the stop when rulebook is missing;
  - `references/recognition-cues.md`: for each type, its cues, a worked statement and the candidate drafted from it;
  - `references/approval-card.md`: the format, with an example.

  **Accept:** the judgement scenarios "A rule-like statement" and "Text from a document" are each answered by a named rule in the skill. Task 5.1's review against those named rules is the accepted test (no model eval in this change).
- [x] 3.3 `skills/rule-steward/`:
  - `SKILL.md`: the weekly procedure, the D-10 flags, proposals and their application, the stop when Langfuse is unavailable, promotion via `skill-change`;
  - `references/langfuse.md`: the settings, how events and counts are derived (D-7), the opencode gap.

  **Accept:** "A rule overridden twice" and "Langfuse unreachable" are answered.

## 4. Integration (D-13)

- [x] 4.1 **vault-conventions:**
  - the `rule` and `playbook` rows in `references/kinds.md`, with their required properties and the D-3 status mapping;
  - the Staging paragraph for rule candidates and `approve`.

  **vault-promote:** the boundary line.

  **Accept:** the scenarios in `specs/vault-conventions/spec.md`, with vault-promote's kind check passing on the two templates.
- [x] 4.2 **vault-planning:** the weekly rules step, and the sweep skipping `kind: rule`. **vault-capture:** the end-of-session line. **vault-setup:**
  - the `AGENTS.md` load line;
  - the two templates;
  - the permission entries in `references/permissions-claude-code.md` and `references/permissions-opencode.md`, plus the exception to the "refuse it" gap text. Find and record the narrowest pattern each CLI accepts for the rulebook script.

  **Accept:** the scenario in `specs/vault-planning/spec.md`; the permission entry is recorded with the pattern tested on Claude Code.
- [x] 4.3 Catalogue wiring:
  - `bundles.yaml` (vault-assistant);
  - `served_by.skills` of `use-cases/UC-W1-vault-work.md` for all three skills;
  - `dependencies.yaml`: Langfuse (kind `service`) and the Langfuse Claude Code plugin (kind `plugin`, `opencode_status: unsupported`), with every required field;
  - probes: three positive ones, with near-misses of `vault-capture`, `formal-reasoning` and `executive-communication`;
  - a `tests/ownership.yaml` capability `rule-model` (owner rulebook, claim pattern `hard beats default beats soft`);
  - then `make bundles` and `make skill-inventory`.

  **Accept:** `make validate` is green.
- [x] 4.4 Docs:
  - a CHANGELOG line;
  - the parity gap (D-12) in `docs/environment/dual-cli/compatibility.md`;
  - `MEANINGFY_VAULT` and `LANGFUSE_*` in `docs/environment/setup.md`, citing `rule-learner/inputs/langfuse-infrastructure-spec.md` for the deployment.

## 5. Review

- [ ] 5.1 Independent review of the implementation against the specs (judgement scenarios included, per 3.2), the design and the catalogue rules. Fix the findings, and keep `make validate` green.

## 6. After Langfuse is deployed (outside this change's merge)

- [ ] 6.1 Trace one real session, confirm O-1, and save a sanitised response as a second fixture. Run the steward once on real data.

## Roadmap

- [ ] 0.1 · [x] 1.1 · [x] 1.2 · [x] 1.3 · [x] 2.1 · [x] 2.2 · [x] 2.3 · [x] 2.4 · [x] 2.5 · [x] 3.1 · [x] 3.2 · [x] 3.3 · [x] 4.1 · [x] 4.2 · [x] 4.3 · [x] 4.4 · [ ] 5.1 · (later) 6.1

## Verification

`make validate` (with `tests/test_rulebook.py` passing), `openspec validate rule-learner --strict`, and the clarity gate ≥ 9/10 on this PLAN.
