<!-- PLAN (tasks half). PLAN = design.md + this file. Document type: Implementation. Revision 1. -->

> Derived from EPIC `add-sales-bundle` (`proposal.md`); design in `design.md`. Each task cites the
> design decision it executes. Gate for every task: `make validate` green at its end (run
> `make bundles` and `make skill-inventory` first when the task touches skills, agents or
> `bundles.yaml`). Package paths are relative to the package root in `inputs/POINTER.md`.

## 0. Precondition

- [x] 0.1 Feature branch `feature/add-sales-bundle` off `develop`. Redact staff, partner and client
      names from the four `inputs/2026-10-27-*.md` reports (replace with roles: the owner, the
      second sender, partner A…). **Accept:** a grep for every person and partner name in the
      owner's local `sales-config.yaml` (TC-06) over `openspec/changes/add-sales-bundle/` is empty;
      commit the EPIC, PLAN and inputs.

## 1. Owners the sales skills will cite (D-4, D-12)

- [ ] 1.1 `executive-communication`: add `references/decision-request.md` (fields, ≤150-word cap,
      evidence grades, the worked example of design.md) and one Workflow line pointing to it.
      **Accept:** spec `agent-decision-requests` scenarios hold on reading; `make validate` green.
- [ ] 1.2 `writing-antipatterns` Decision genre: the A13 exception for asynchronous approval
      requests, citing 1.1. **Accept:** one paragraph; no card field restated.
- [ ] 1.3 `meaningfy-voice`: add `references/channels/outreach-email.md` from the package's
      `email-patterns.md` tone lines and `selling-method.md` §4, names replaced by roles.
      **Accept:** the channel index lists it; no named person.

## 2. Skills, one per task (D-2, D-3, D-5, D-7, D-13)

Each task: create `skills/<name>/` from the file map, apply the template (Quick Start with a worked
example, Workflow, Gotchas, `## Boundary & Related Skills`, six facets per D-13), description
"Use this skill when …" under 700 characters, bare skill names in Related, and add the skill to
`meaningfy-sales` in `bundles.yaml` and to UC-W7 `served_by`.

- [ ] 2.1 `sales-pipeline-custody`: pipelines, placement, lead lifecycle, stars, next actions,
      closing dates, filters, lead sources, Odoo conventions, routes, `write-rules.md`, the three
      YAML assets stripped per D-3/D-7. **Accept:** no Odoo id or person name in the folder;
      `skills-maintenance`/`package.write` absent; ladder cited, not stated.
- [ ] 2.2 `sales-accounts`: identity, personal details, customer success, two profile templates
      (one-line lead). **Accept:** identity §6 requires context with the id; customer success stated
      once.
- [ ] 2.3 `sales-qualification`: dossier, five-P, MEDDPICC merged with the question sections of
      `presales-discovery.md` (D-11), research checklist, value-equation trimmed (D-12).
      **Accept:** add the skill to UC-W9 and UC-W10 `served_by`; dossier summary opens in words.
- [ ] 2.4 `sales-conversations`: meeting plan, conversation tools, email patterns (tone cited to
      1.3), one objection taxonomy, selling method minus price, insights. **Accept:** no em dash in
      templates; price sentences point to `estimation`/config.
- [ ] 2.5 `sales-operations`: goal loop, run types, reviewers, `configuration.md`,
      `sales-config.example.yaml`, the three run-note templates rewritten to D-5 with cards per
      1.1, the weekly-review self-edit card per D-6. **Accept:** every template opens with
      Decisions needed; no table over 5 columns; every config key used by any sales skill is
      documented in `configuration.md`.

## 3. The agent (D-8, D-9)

- [ ] 3.1 `agents/sales-agent.md`: `type: scheduled`, sonnet, `skills:` the five (operations
      first), `disallowedTools` per D-8, description ending "Not for delegation". Dispatch contract:
      Input `schedule: open day / close day / weekly review` and `human session`; Output the run
      note; Side effects logged, reversible Odoo writes and drafts only; Refuses send, delete,
      won/lost and bulk import without a card. **Accept:** `agent_conformance` green; body ≤ cap.
- [ ] 3.2 `tests/features/agents/sales-agent.feature` per D-14 from the ten package behaviour
      files, amended per report A §6 and with a scenario per spec delta of this change.
      **Accept:** feature shape check green.

## 4. One owner per fact elsewhere (D-10, D-11, D-12)

- [ ] 4.1 Ladder rename in `engagement-lifecycle.md` (with the one-release "formerly" note) and in
      `semantic-consulting-coach/SKILL.md`, `engagement-model.md`, `semantic-consulting-domain.md`,
      `decision-package/SKILL.md`, `docs/practice/ai-sales/{sales-runbook.md,services/index.md,playbooks/sales-presales.md}`,
      `docs/practice/roles-and-raci.md`, `docs/practice/ai-consulting/playbooks/technical-consultant.md`,
      `docs/practice/ai-coding/build-lifecycle.md`, `use-cases/UC-W12-…`, `use-cases/UC-W22-…`.
      **Accept:** `grep -rnE "Light tier|Deep tier|Light workshop|Deep Decision" skills docs use-cases agents`
      returns only the "Formerly called" line; no free/paid change.
- [ ] 4.2 `presales-discovery.md` cites `sales-qualification` for questions (D-11);
      `proposal-writing` description drops "qualifies the need"; Boundary sections of
      `semantic-consulting-coach`, `proposal-writing`, `guardrails`, `vault-conventions` name the
      sales skill that owns the neighbouring fact. **Accept:** `make validate` green; probes in 6.3
      still route.

## 5. Deterministic tests (D-7, D-14)

- [ ] 5.1 (TC-01, TC-02) `tests/fixtures/sales/write_policy_cases.yaml` (the 120 rows, capability-class names) and
      `tests/test_sales_write_policy.py` with the ported evaluator; cases first, red, then green
      against `write-policy.yaml`. Plus completeness: every capability class in the policy file
      appears in at least one case. **Accept:** green in `make validate`.
- [ ] 5.2 (TC-03..TC-05) `tests/test_sales_assets.py`: Odoo-view completeness (every filter has question, action,
      target, cadence; every stage it names exists in `pipelines.yaml`); table render (≤5 columns,
      separator row) over every sales template; each template's Decisions needed section cites the
      card. **Accept:** green; a deliberately broken fixture fails each check once.
- [ ] 5.3 Merge the package's `ownership.yaml` rows into `tests/ownership.yaml` with the new tags
      (`crm-write-policy`, `five-p-score`, `decision-card`, `offer-ladder`, `run-note-shape`).
      **Accept:** the ownership tripwire passes and names one owner per tag.

## 6. Use cases, docs, probes

- [ ] 6.1 UC-W7: status covered, `served_by` the agent and five skills, open points answered with
      DEC-1/D-12/DEC-4. UC-W9/W10: qualification owner answered (DEC-10), status partial.
      `docs/future-features.md`: sales row done; `add-commercial-chain` re-scoped (qualification
      removed). `catalogue-architecture.md`: drop "(planned)", add the agent row. **Accept:**
      `use_case_catalogue`, `use_case_coverage` green.
- [ ] 6.2 `docs/environment/sales-agent.md` (D-9): connectors, documented server names, Desktop
      task schedules and prompt texts, CLI scheduler pointer, `sales-config.yaml` location, accepted
      risks. `dependencies.yaml` Odoo/Google `used_by` name the sales skills. Runbook, playbook,
      roles-and-raci (agent-wrapper open question closed) point to the skills. **Accept:** links
      green; no absolute owner path.
- [ ] 6.3 `tests/trigger_probes.yaml`: one positive and one near-miss per new description; near-misses
      against `proposal-writing`, `semantic-consulting-coach`, `executive-communication` and the
      `sales:*` plugin skills named in D-1. **Accept:** probe checks green.
- [ ] 6.4 README bundle row extended and three "I want to…" rows (groom the pipeline, qualify a
      lead, prepare a meeting); CHANGELOG line for installers; `VERSION` 3.5.0 at release.
      **Accept:** version-sync gate green after `make bundles`.

## 7. Cross-CLI check

- [ ] 7.1 `make bundles`; confirm `bundles/meaningfy-sales/` lists the five skills and the agent.
- [ ] 7.2 `npm run test:opencode-installer` green; `make opencode-report` shows the G-5 gap for
      `sales-agent`.
- [ ] 7.3 Run `opencode run --agent sales-agent "close day"` against a read-only prompt once; if it
      refuses, apply D-9's fallback. **Accept:** result recorded in `mapping.md`.

## 8. Close

- [ ] 8.1 `make validate`, `make validate-spine` green; `openspec validate add-sales-bundle --strict`.
- [ ] 8.2 Privacy grep over `skills/sales-*`, `agents/sales-agent.md`, `tests/`, `docs/`: no owner
      or staff names, Odoo ids, partner names or prices. **Accept:** empty.
- [ ] 8.3 Owner hand-run of IT-01..IT-05 (design.md *Test cases*) on Claude Desktop and the CLI,
      against the live pipeline, read-only first. **Accept:** the note opens with Decisions needed, fits one
      screen, every card passes the spec; findings fixed in the owning skill.
- [ ] 8.4 PR into `develop`; `detect_changes` reported in the PR.

## Roadmap

- [x] 0.1 · [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 3.1 ·
  [ ] 3.2 · [ ] 4.1 · [ ] 4.2 · [ ] 5.1 · [ ] 5.2 · [ ] 5.3 · [ ] 6.1 · [ ] 6.2 · [ ] 6.3 · [ ] 6.4 ·
  [ ] 7.1 · [ ] 7.2 · [ ] 7.3 · [ ] 8.1 · [ ] 8.2 · [ ] 8.3 · [ ] 8.4

## Verification

`make validate` + `make validate-spine` + `npm run test:opencode-installer` green, `openspec validate
--strict`, the privacy grep empty, and the owner's one hand-run (8.3) passing the decision-card spec.
