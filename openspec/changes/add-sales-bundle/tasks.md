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

- [x] 1.1 `executive-communication`: add `references/decision-request.md` (fields, ≤150-word cap,
      evidence grades, the worked example of design.md) and one Workflow line pointing to it.
      **Accept:** spec `agent-decision-requests` scenarios hold on reading; `make validate` green.
- [x] 1.2 `writing-antipatterns` Decision genre: the A13 exception for asynchronous approval
      requests, citing 1.1. **Accept:** one paragraph; no card field restated.
- [x] 1.3 `meaningfy-voice`: add `references/channels/outreach-email.md` from the package's
      `email-patterns.md` tone lines and `selling-method.md` §4, names replaced by roles.
      **Accept:** the channel index lists it; no named person.

## 2. Skills, one per task (D-2, D-3, D-5, D-7, D-13)

Each task: create `skills/<name>/` from the file map, apply the template (Quick Start with a worked
example, Workflow, Gotchas, `## Boundary & Related Skills`, six facets per D-13), description
"Use this skill when …" under 700 characters, bare skill names in Related, and add the skill to
`meaningfy-sales` in `bundles.yaml` and to UC-W7 `served_by`.

- [x] 2.1 `sales-pipeline-custody`: pipelines, placement, lead lifecycle, stars, next actions,
      closing dates, filters, lead sources, Odoo conventions, routes, `write-rules.md`, the three
      YAML assets stripped per D-3/D-7. **Accept:** no Odoo id or person name in the folder;
      `skills-maintenance`/`package.write` absent; ladder cited, not stated.
- [x] 2.2 `sales-accounts`: identity, personal details, customer success, two profile templates
      (one-line lead). **Accept:** identity §6 requires context with the id; customer success stated
      once.
- [x] 2.3 `sales-qualification`: dossier, five-P, MEDDPICC merged with the question sections of
      `presales-discovery.md` (D-11), research checklist, value-equation trimmed (D-12).
      **Accept:** add the skill to UC-W9 and UC-W10 `served_by`; dossier summary opens in words.
- [x] 2.4 `sales-conversations`: meeting plan, conversation tools, email patterns (tone cited to
      1.3), one objection taxonomy, selling method minus price, insights. **Accept:** no em dash in
      templates; price sentences point to `estimation`/config.
- [x] 2.5 `sales-operations`: goal loop, run types, reviewers, `configuration.md`,
      `sales-config.example.yaml`, the three run-note templates rewritten to D-5 with cards per
      1.1, the weekly-review self-edit card per D-6. **Accept:** every template opens with
      Decisions needed; no table over 5 columns; every config key used by any sales skill is
      documented in `configuration.md`.

## 3. The agent (D-8, D-9)

- [x] 3.1 `agents/sales-agent.md`: `type: scheduled`, sonnet, `skills:` the five (operations
      first), `disallowedTools` per D-8, description ending "Not for delegation". Dispatch contract:
      Input `schedule: open day / close day / weekly review` and `human session`; Output the run
      note; Side effects logged, reversible Odoo writes and drafts only; Refuses send, delete,
      won/lost and bulk import without a card. **Accept:** `agent_conformance` green; body ≤ cap.
- [x] 3.2 `tests/features/agents/sales-agent.feature` per D-14 from the ten package behaviour
      files, amended per report A §6 and with a scenario per spec delta of this change.
      **Accept:** feature shape check green.

## 4. One owner per fact elsewhere (D-10, D-11, D-12)

- [x] 4.1 Ladder rename in `engagement-lifecycle.md` (with the one-release "formerly" note) and in
      `semantic-consulting-coach/SKILL.md`, `engagement-model.md`, `semantic-consulting-domain.md`,
      `decision-package/SKILL.md`, `docs/practice/ai-sales/{sales-runbook.md,services/index.md,playbooks/sales-presales.md}`,
      `docs/practice/roles-and-raci.md`, `docs/practice/ai-consulting/playbooks/technical-consultant.md`,
      `docs/practice/ai-coding/build-lifecycle.md`, `use-cases/UC-W12-…`, `use-cases/UC-W22-…`.
      **Accept:** `grep -rnE "Light tier|Deep tier|Light workshop|Deep Decision" skills docs use-cases agents`
      returns only the "Formerly called" line; no free/paid change.
- [x] 4.2 `presales-discovery.md` cites `sales-qualification` for questions (D-11);
      `proposal-writing` description drops "qualifies the need"; Boundary sections of
      `semantic-consulting-coach`, `proposal-writing`, `guardrails`, `vault-conventions` name the
      sales skill that owns the neighbouring fact. **Accept:** `make validate` green; probes in 6.3
      still route.

## 5. Deterministic tests (D-7, D-14)

- [x] 5.1 (TC-01, TC-02) `tests/fixtures/sales/write_policy_cases.yaml` (the ported rows, normalised tool names) and
      `tests/test_sales_write_policy.py` with the ported evaluator; cases first, red, then green
      against `write-policy.yaml`. Plus completeness: every entry id decides at least one case. **Accept:** green in `make validate`.
- [x] 5.2 (TC-03..TC-05) `tests/test_sales_assets.py`: Odoo-view completeness (every filter has question, action,
      target, cadence; every stage it names exists in `pipelines.yaml`); table render (≤5 columns,
      separator row) over every sales template; each template's Decisions needed section cites the
      card. **Accept:** green; a deliberately broken fixture fails each check once.
- [x] 5.3 Merge the package's `ownership.yaml` rows into `tests/ownership.yaml` with the new tags
      (`crm-write-policy`, `five-p-score`, `decision-card`, `offer-ladder`, `run-note-shape`).
      **Accept:** the ownership tripwire passes and names one owner per tag.

## 6. Use cases, docs, probes

- [x] 6.1 UC-W7: status covered, `served_by` the agent and five skills, open points answered with
      DEC-1/D-12/DEC-4. UC-W9/W10: qualification owner answered (DEC-10), status partial.
      `docs/future-features.md`: sales row done; `add-commercial-chain` re-scoped (qualification
      removed). `catalogue-architecture.md`: drop "(planned)", add the agent row. **Accept:**
      `use_case_catalogue`, `use_case_coverage` green.
- [x] 6.2 `docs/environment/sales-agent.md` (D-9): connectors, documented server names, Desktop
      task schedules and prompt texts, CLI scheduler pointer, `sales-config.yaml` location, accepted
      risks. `dependencies.yaml` Odoo/Google `used_by` name the sales skills. Runbook, playbook,
      roles-and-raci (agent-wrapper open question closed) point to the skills. **Accept:** links
      green; no absolute owner path.
- [x] 6.3 `tests/trigger_probes.yaml`: one positive and one near-miss per new description; near-misses
      against local neighbours (`vault-project`, `vault-capture`, `semantic-consulting-coach`,
      `executive-communication`, `proposal-writing`); the probe file names local skills only, so the
      `sales:*` plugin collision is left to the evals step. **Accept:** probe checks green.
- [x] 6.4 README bundle row extended and three "I want to…" rows (groom the pipeline, qualify a
      lead, prepare a meeting); CHANGELOG lines for installers under Unreleased; `VERSION` moves at release (meaningfy-release).
      **Accept:** version-sync gate green after `make bundles`.

## 7. Cross-CLI check

- [x] 7.1 `make bundles`; confirm `bundles/meaningfy-sales/` lists the five skills and the agent.
- [x] 7.2 `npm run test:opencode-installer` green; `make opencode-report` shows the G-5 gap for
      `sales-agent`.
- [x] 7.3 Run `opencode run --agent sales-agent "close day"` against a read-only prompt once; if it
      refuses, apply D-9's fallback. **Accept:** result recorded in `mapping.md`.
      *Outcome 2026-10-27: the subagent-mode agent started from a project install (opencode 2.1.4);
      no fallback needed; recorded in `mapping.md` G-5.*

## 8. Close

- [x] 8.1 `make validate`, `make validate-spine` green; `openspec validate add-sales-bundle --strict`.
- [x] 8.2 Privacy grep over `skills/sales-*`, `agents/sales-agent.md`, `tests/`, `docs/`: no owner
      or staff names, Odoo ids, partner names or prices. **Accept:** empty.
- [ ] 8.3 Owner hand-run of the day cycle IT-1..IT-4 (design.md *Test cases*, revision 3) on one
      working day: open day on Desktop, close day on the CLI, the next open day. Runs after group 9.
      **Accept:** every step's column holds; findings fixed in the owning skill.
- [x] 8.4 PR into `develop`; `detect_changes` reported in the PR. *Draft PR #107, open until 8.3.*

## 9. Day cycle (revision 3: DEC-11, DEC-12, D-5, D-15..D-17)

- [x] 9.1 `sales-operations/assets/templates/grooming-session.md`: *Watch* → *Attention list* (P1 /
      P2 / P3, count and change per rank, every item listed) and a *Today's plan* section (per deal:
      talk to / answer / chase, with the person). **Accept:** TC-04 and TC-05 green; no "one screen"
      or "only what fired" left in the sales skills.
- [x] 9.2 `sales-operations/SKILL.md` *Priorities inside a run*: map the seven priorities onto P1–P3
      (D-15). **Accept:** each priority names its rank; within a rank, stars then age.
- [x] 9.3 `references/run-types.md` open day: read the previous working day's note first and carry
      forward its open items, then write *Today's plan*; close day: record the day's actions on each
      deal, apply the owner's statements, infer moves within the tiers, give every deal touched today
      a dated next activity, refresh the counts (D-16). **Accept:** both run types read as the plan
      and the record of one note.
- [x] 9.4 `sales-pipeline-custody/references/write-rules.md` §3: the owner's statement naming a deal
      and won/lost is the yes; an unstated lost reason is inferred and logged; won/lost seen only in
      a third party's mail is a card (D-17). Add the three cases to
      `tests/fixtures/sales/write_policy_cases.yaml` if the evaluator can express them, else to the
      feature file. **Accept:** TC-01, TC-02 green.
      *Outcome: the statement is an answer, not a tier (policy data unchanged), so the cases went to
      the feature file.*
- [x] 9.5 `tests/features/agents/sales-agent.feature`: replace the replay and the planted-instruction
      scenarios with the day-cycle scenarios of the custodianship spec (open, close, piling up, owner
      says lost, client mail says won, evidence moves forward). **Accept:** feature lint green.
- [x] 9.7 Weekly review and plan (D-18): `weekly-review.md` gains *Next week* (outcomes, focus
      deals, capacity); `run-types.md` weekly review writes it; the daily template splits the
      attention list into *This week* / *Later*; open day re-checks carried items in Odoo (D-16).
      **Accept:** TC-04, TC-05 green; the capacity rule is stated once (run-types).
- [x] 9.8 Configuration (D-3, D-19): restore `booking_link`, replace `price_ranges` by
      `offer_catalogue` in `configuration.md`, the example config, `selling-method.md`,
      `route-consulting-via-partner.md`, `write-rules.md`; add `assets/offer-catalogue.example.md`
      (placeholders only); `email-patterns.md` puts the booking link in meeting proposals.
      **Accept:** no `price_ranges` left; privacy grep (8.2) empty.
- [x] 9.6 `docs/environment/sales-agent.md` and CHANGELOG line: the daily note in words for the
      installer (one file a day, ranked, morning plan, evening record). **Accept:** `make validate`,
      `make validate-spine`, `openspec validate add-sales-bundle --strict` green.

## Roadmap

- [x] 0.1 · [x] 1.1 · [x] 1.2 · [x] 1.3 · [x] 2.1 · [x] 2.2 · [x] 2.3 · [x] 2.4 · [x] 2.5 · [x] 3.1 ·
  [x] 3.2 · [x] 4.1 · [x] 4.2 · [x] 5.1 · [x] 5.2 · [x] 5.3 · [x] 6.1 · [x] 6.2 · [x] 6.3 · [x] 6.4 ·
  [x] 7.1 · [x] 7.2 · [x] 7.3 · [x] 8.1 · [x] 8.2 · [ ] 8.3 · [x] 8.4 ·
  [x] 9.1 · [x] 9.2 · [x] 9.3 · [x] 9.4 · [x] 9.5 · [x] 9.7 · [x] 9.8 · [x] 9.6

## Verification

`make validate` + `make validate-spine` + `npm run test:opencode-installer` green, `openspec validate
--strict`, the privacy grep empty, and the owner's one hand-run (8.3) passing the decision-card spec.
