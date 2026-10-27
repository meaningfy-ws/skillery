<!-- PLAN (tasks half). PLAN = design.md + this file. Document type: Implementation. Revision 4 (matches design.md). -->

> Derived from EPIC `add-devops-bundle` (`proposal.md`); design in `design.md`. Each task cites the
> design decision it executes. Gate for every task: `make validate` green at its end (run
> `make bundles` and `make skill-inventory` first when the task touches skills, agents or
> `bundles.yaml`). Failure first: each skill task starts from the gap ids it owns (D-1), which are its
> acceptance cases.

## 0. Precondition

- [x] 0.1 Branch `feature/reshape-devops-bundle` off `develop`; sanitized inputs A–E; EPIC re-shaped;
      PLAN derived.
- [x] 0.2 Owner answers OPEN-1..6 (design.md); answers recorded in the EPIC (DEC-7..10 amended,
      DEC-14, DEC-15) and folded into D-3, D-9, D-10, D-12. Full reports stored in
      `infrastructure-stacks/docs/assessments/2026-10-27/`.
- [x] 0.3 Fold the exhaustive repo reads and their patterns (2026-10-27) into a new input
      `2026-10-27-E-repo-patterns.md` (sanitized) and into D-2/D-3/D-4, D-16, D-17. Deep reports stored
      beside the others in the stacks repo. **Accept:** clarity gate on the PLAN ≥ 9/10, scored by an
      independent subagent. *Outcome 2026-10-27: round 1 8.3 (11 gaps fixed), round 2 **9.2 PASS**;
      four non-blocking leftovers fixed.*

## 1. Deterministic checks first (D-4..D-7)

- [ ] 1.1 (TC-02) `tests/fixtures/devops/compose/` — per rule S1–S9 one missing, one met, one
      excepted fixture; `tests/test_devops_check_stack.py` red. Then
      `skills/stack-operations/scripts/check_stack.py` green. **Accept:** exit 1 on any missing;
      `excepted` never counted as met; the S7 bind-address and S9 fallback cases covered.
- [ ] 1.2 (TC-01) `tests/fixtures/devops/action_cases.yaml` covering every entry, every global
      trigger, the `attempts >= 2` → `escalate` rule and an unlisted action; `tests/test_devops_action_policy.py` red.
      Then `skills/service-reliability/assets/unattended-actions.yaml` and
      `scripts/decide_action.py` green. **Accept:** precedence of D-6 holds; the four outputs `act`,
      `park`, `never`, `escalate` each decided by at least one case; invalid YAML exits non-zero.
- [ ] 1.3 (TC-03) `tests/test_devops_privacy.py` over `skills/{infrastructure-operations,stack-operations,service-reliability,infrastructure-security}`,
      the three agents, `tests/fixtures/devops/` and this change's `inputs/`; `.gitignore` gains
      `tests/fixtures/devops/private-names.local.txt`. **Accept:** green; a planted private address
      and a planted `meaningfy.ws` hostname each fail it once; without the local file the name check
      is skipped with a warning.
- [ ] 1.4 (TC-06) `tests/test_devops_templates.py`: the stack template passes `check_stack.py`;
      every YAML template parses; red until the templates of group 2 exist. **Accept:** green at the
      end of group 2.

## 2. Skills, one per task (D-1, D-2, D-3, D-14)

Each task: create the folder per D-2, the template (Quick Start with a worked example, Workflow,
Gotchas, `## Boundary & Related Skills`), six facets per D-14, description "Use this skill when …"
under 700 characters, add to `meaningfy-devops` in `bundles.yaml` and to UC-W6 `served_by`. Each rule
of D-3 appears once, in its owning skill, with its level, reason and minimum version. Each skill's
`assets/templates/` per D-16 (placeholders only); each anti-pattern of file E it replaces is named in
Gotchas.

- [ ] 2.1a `infrastructure-operations`, method half: `SKILL.md`; safe-change protocol (DEC-6) with
      the consent card example (D-8); change shapes A/B/C; interventions and records (D-9); three
      audiences (DEC-11); the instance/practice split and the sibling layout (DEC-1, DEC-13); repo
      checks; templates `runbook.md`, `execution-log.md`. **Accept:** G-01, G-02, G-04, G-24, G-26
      answered by a named rule; no runbook for one system.
- [ ] 2.1b `infrastructure-operations`, provisioning half: Terraform and Ansible practice;
      environments; create / change / resize / rebuild / sleep / wake / retire; `expires:` rule; the
      D-3 rows owned here; templates `vm-module-block.tf`, `group-vars.yml`,
      `docker-host-playbook.yml`, `role-contract/`, `fail-closed-tasks.yml`, `tombstone.txt`.
      **Accept:** G-05..G-07 answered; the D-17 truths stated (two-layer port rule cited to
      `infrastructure-security`, resize and rebuild traps, `moved` / `import` / hashed certificate
      names / wildcard cutover, both sleep/wake variants); anti-patterns C-A1..C-A11 named in Gotchas.
- [ ] 2.2 `stack-operations`: per-stack minimum S1–S9 citing `check_stack.py`; deploy workflow;
      versions in git and promotion; rollback (keep 3 images, revert + redeploy); new stack; upgrades
      with data. **Accept:** G-08..G-12, G-25 answered; the boundary names `ci-cd-delivery` (DEC-2);
      no text on building or tagging an application image; S-A1..S-A12 named in Gotchas; templates
      `stack/`, `deploy-workflow.yml`, `cutover.sh`, `acceptance.feature`.
- [ ] 2.3 `service-reliability`: monitoring standard; alert tiers; daily check-up (D-10); incident
      response with severities and clocks; postmortem asset; backup and restore with drills;
      unattended operations (DEC-7, D-6, D-7, D-12 summary). **Accept:** G-13..G-19 answered; the
      check-up order matches D-10; the record rules match D-9; templates `backup-role/`,
      `alert-rule.yml`.
- [ ] 2.4 `infrastructure-security`: access (joiner / leaver checklists, MFA, named accounts,
      review), secrets (Vaultwarden, `bw` piping, inventory, rotation; DEC-10), supply chain,
      exposure, four-eyes and break-glass. **Accept:** G-03, G-20..G-23 answered; no secret location
      named.

## 3. Agents (D-11)

- [ ] 3.1 `agents/devops-engineer.md` (`lead`) per D-11. **Accept:** `agent_conformance` green;
      body ≤ 40 lines.
- [ ] 3.2 `agents/ops-watch.md` (`scheduled`) per D-11; triggers and run record stated.
      **Accept:** as 3.1; `make opencode-report` shows the scheduled-agent gap.
- [ ] 3.3 `agents/infra-reviewer.md` (`delegated`) per D-11. **Accept:** as 3.1.
- [ ] 3.4 (TC-04) `tests/features/agents/{devops-engineer,ops-watch,infra-reviewer}.feature`, one
      scenario per spec scenario of `operations-practice` and `unattended-operations` that the agent
      carries. **Accept:** feature shape check green.

## 4. Delivery boundary (D-13)

- [ ] 4.1 `ci-cd-delivery`: remove the `op-delivery.yml` claims in `SKILL.md`,
      `references/delivery-model.md`, `references/deploy-workflow-template.md`; deploy request cites
      `stack-operations`; description trimmed. **Accept:** `grep -rn "op-delivery" skills` empty;
      existing probes for `ci-cd-delivery` still route.

- [ ] 4.2 `meaningfy-git-workflow`: one line — in infrastructure repos the commit scope is the service
      or VM, `[skip ci]` on doc-only commits (D-17). **Accept:** no other rule restated.

## 5. Integration

- [ ] 5.1 `bundles.yaml`: `meaningfy-devops` (description per DEC-3; `requires: [meaningfy-consulting]`,
      where `executive-communication` owns the decision card); `make bundles`;
      `make skill-inventory`. **Accept:** `bundles/meaningfy-devops/` lists four skills and three
      agents.
- [ ] 5.2 UC-W6 per D-15; `docs/future-features.md` DevOps row done; `catalogue-architecture.md`
      agent rows. **Accept:** `use_case_catalogue`, `use_case_coverage` green.
- [ ] 5.3 `docs/environment/devops-agents.md`: the unattended runtime contract (D-12), the agent's
      `bw` session rule (DEC-10), the sibling layout (DEC-13), Slack reporting (DEC-7, DEC-15).
      **Accept:** links green; no host or secret.
- [ ] 5.4 (TC-05) `tests/trigger_probes.yaml`: one positive and one near-miss per new description;
      near-misses against `ci-cd-delivery`, `meaningfy-release`, `project-setup`, `guardrails`.
      **Accept:** probe checks green.
- [ ] 5.5 `tests/ownership.yaml` tags: `safe-change-protocol`, `stack-standard`,
      `unattended-action-policy`, `daily-checkup`, `incident-severity`, `secret-handling`.
      **Accept:** ownership tripwire names one owner per tag.
- [ ] 5.6 README bundle row and "I want to…" rows (operate infrastructure, check the fleet,
      review an infra PR); CHANGELOG lines under Unreleased. **Accept:** `make validate` green.

## 6. Cross-CLI check

- [ ] 6.1 `npm run test:opencode-installer` green; `make opencode-report` lists the expected gaps.
- [ ] 6.2 `opencode run --agent infra-reviewer` once on a read-only prompt. **Accept:** result
      recorded in `docs/environment/dual-cli/mapping.md`.

## 7. Close

- [ ] 7.1 `make validate`, `make validate-spine`, `openspec validate add-devops-bundle --strict`;
      a human privacy review of every new file (no port tied to a named service, no secret location,
      no named weakness — what TC-03 cannot grep), recorded as a checked item in the PR description.
- [ ] 7.2 Owner hand-runs IT-1..IT-4 (design.md *Test cases*) from a checkout of
      `infrastructure-stacks` with `../cloud-infrastructure` beside it. **Accept:** each run's
      outcome recorded here; findings fixed in the owning skill.
- [ ] 7.3 PR into `develop`; `detect_changes` reported in the PR.

## Roadmap

- [x] 0.1 · [x] 0.2 · [x] 0.3 · [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 2.1a · [ ] 2.1b · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 3.1 ·
  [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 4.1 · [ ] 4.2 · [ ] 5.1 · [ ] 5.2 · [ ] 5.3 · [ ] 5.4 · [ ] 5.5 · [ ] 5.6 ·
  [ ] 6.1 · [ ] 6.2 · [ ] 7.1 · [ ] 7.2 · [ ] 7.3

## Verification

`make validate` + `make validate-spine` + `npm run test:opencode-installer` green, `openspec validate
--strict`, the privacy test green, and the owner's hand-runs IT-1..IT-4 passing the two specs.
Follow-ups outside skillery (EPIC *Impact*): the unattended runtime and the allow-listed operations in
`infrastructure-stacks`; the repos' hardening changes seeded by the first check-up; `AGENTS.md`
trimmed to instance facts; Confluence MSC grooming.
