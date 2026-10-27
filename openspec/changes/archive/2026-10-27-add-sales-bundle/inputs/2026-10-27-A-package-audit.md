# A. Audit of the `meaningfy-sales` package (0.6.1) against skillery standards

Package root: `…/vault-files/2026-10-08 Sales Agent/meaningfy-sales/` (88 files, 6 487 lines). All paths below are relative to it.
Standards used: `docs/development/skill-template.md`, `agent-template.md`, `creating-skills.md`, `governance.md`, `agent-skills-spec.md`, `AGENTS.md` (dual-CLI rules), `tools/repo_lint/lint.py` (`MAX_SKILL_LINES = 650`, `MAX_DESCRIPTION_CHARS = 1024`, `MAX_AGENT_BODY_LINES = 40`, `_CLI_ISM = /opsx:|\.claude/`, boundary heading regex `^##\s+.*\bboundary\b`).

Legend. **Kind**: M = method (reusable knowledge) · C = Meaningfy-specific config or data · R = runtime / agent behaviour · T = test · D = doc. **Verdict**: keep / polish / restructure / drop.

---

## 0. Inventory shape

| Area | Files | Lines | Note |
|---|---|---|---|
| Root docs (`README.md`, `REQUIREMENTS.md`, `CHANGELOG.md`, `marketplace-entry.json`, `pytest.ini`) | 5 | 498 | good human docs; REQUIREMENTS is an 80-row traceability table (R01–R80) |
| `scheduled-tasks/` | 4 | 118 | three Desktop scheduled-task prompts + the safety summary they embed |
| `skills/sales-agent` | 10 | 592 | orchestrator: goal loop, run types, 3 templates, 3 reviewer prompts, 1 stub |
| `skills/sales-accounts` | 6 | 360 | entity resolution, profiles, personal-data rules, customer success |
| `skills/sales-deal-dossier` | 6 | 373 | dossier, MEDDPICC, five Ps, value equation, research checklist |
| `skills/sales-meeting-coach` | 7 | 375 | meeting plan, selling method, conversation tools, email patterns, insights, objections |
| `skills/sales-pipelines` | 11 | 1 412 | 5 pipelines, hard rules, write policy (304-line YAML), Odoo views (391), pipelines export (280), 5 route files |
| `tests/` | 39 | 2 759 | pytest-bdd suite (fixed checks + LLM-judged behaviour) **plus** a superseded legacy harness (`run_tests.py` + 4 YAML case files) |

Overall: unusually disciplined for a field-built package (one owner per capability already tracked, write policy as data with an evaluator, requirement traceability, Gherkin with Examples tables). The problems are (a) structure against the skillery template, (b) Meaningfy-instance data and owner-personal facts inside skill bodies, (c) one skill (`sales-agent`) that is really an agent, (d) human-facing outputs written as machine logs, with decision requests that carry ids instead of context.

---

## 1. Per-file audit

### 1.1 Root and scheduled tasks

| File | Owns (one line) | Kind | Verdict | Reason |
|---|---|---|---|---|
| `README.md` | narrative of the 5 skills, how it works, 4 usage recipes, setup, tests | D | restructure | Good content, but it restates rules owned by skills (write tiers, lead/opportunity/lost, stars, personal details, customer success) — a doc must narrate and point (governance rule 3). Split into the bundle's Quick Start (recipes → skill Quick Starts and README "I want to…" rows) and a `docs/` page for runtime setup (Desktop connectors, local MCPs). |
| `REQUIREMENTS.md` | R01–R80, each with source decision, implementing file, checking feature | D/T | restructure | Valuable failure-first record; in skillery it becomes the EPIC's spec deltas (`openspec/changes/add-sales-bundle/specs/…`) and the inputs, not a shipped file. Implementation paths will all change. |
| `CHANGELOG.md` | why/what of 0.1–0.6.1 | D | drop (import to EPIC inputs) | EPIC DEC-1: the 0.x line ends at integration; changelog goes to `inputs/`. |
| `marketplace-entry.json` | plugin entry for `.claude-plugin/marketplace.json` | C | drop | `make bundles` renders the marketplace from `bundles.yaml`; hand-written entries are forbidden. Version 0.6.1 conflicts with root `VERSION`. |
| `pytest.ini` | pytest-bdd config, `behaviour` marker | T | drop | Skillery has its own pytest config and no `pytest-bdd` dependency (`requirements*.txt`: `pyyaml`, `pytest`). |
| `scheduled-tasks/open-day.md` | Desktop scheduled prompt, Mon–Fri 08:57, OPEN DAY | R | restructure | Runtime artefact, not a catalogue artefact. Absolute owner path (`<owner synced drive>/…`), "Claude desktop", "device tools", "local MCPs `odoo`, `meaningfy-memory`", connector list. Belongs in the agent's **Input** (`schedule: …`) plus a `docs/environment/` setup page; the prompt text should shrink to "run sales-agent, run type open-day". |
| `scheduled-tasks/close-day.md` | same, 17:26, CLOSE DAY | R | restructure | Same as above. |
| `scheduled-tasks/weekly-review.md` | same, Sat/Sun 09:52, WEEKLY REVIEW | R | restructure | Same as above. |
| `scheduled-tasks/safety-summary.txt` | 8-line digest of the hard rules embedded in each task | R | drop | Third copy of the hard rules (also in `hard-rules.md`, README, each task). One-owner violation, deliberate but unnecessary once the agent loads the rules skill. |

### 1.2 `skills/sales-agent`

| File | Owns | Kind | Verdict | Reason |
|---|---|---|---|---|
| `SKILL.md` | role, call graph, goal loop summary, run table, reviewer list, run priorities | R + M | restructure → **agent** + skill | This is an orchestrator ("Who you are: you work for the owner…", "No skill calls this one"). In skillery it is `agents/sales-agent.md`, `type: scheduled` (with human-session trigger), ≤40-line body, dispatch contract. The method part (goal loop, run types, priorities) becomes the agent's primary skill. No facets, no Quick Start, has `## Overview` (forbidden), no `## Boundary & Related Skills` (lint fails), description 1 022 chars (at the limit). |
| `references/agent-loop.md` | goal loop (objective→plan→act→verify→decide), budget and terms (15 deals, 3 iterations, 90-day dormancy, 28-day sweep, rot clock) | M + C | polish | Strong, reusable method. Mixes generic loop with Meaningfy numbers and Odoo field names (`mail.tracking.value`, `date_last_stage_update`). Keep the loop as method; move numbers to a "terms" table owned once. "Odoo profile: the `odoo` connector on the owner's computer" is a runtime fact → agent/env doc. |
| `references/hard-rules.md` | stub: "moved in 0.2.0" | — | drop | Stub kept only because the session could not delete files. |
| `references/run-types.md` | start-of-run checks, open day, close day, weekly review, working session, intake session; Obsidian table rule | M + R | restructure | Core of the runs skill. The Obsidian table rule (R71) duplicates `vault-conventions` (which owns "the table check before saving"); cite it instead. Vault paths (`04 Daily/crm-grooming-session/`, `01 Projects/`) are owner-vault layout → should come from `vault-conventions` / a config, not hard-coded. Long single paragraphs; weekly-review step 4 is a 12-line paragraph. |
| `assets/templates/grooming-session.md` | daily run note | R (output) | restructure | Decision content (*Needs you today*, *Proposals*, *Questions*) sits **below** the machine log (Plan / Done / Verification / Decision). Answer-first violated. See §3. |
| `assets/templates/intake-session.md` | intake session note | R (output) | restructure | 10-column plan table and 9-column audit table cannot be read in Obsidian on a laptop; P2 points to the wrong section ("identity, section 3"; merges are §5). See §3. |
| `assets/templates/weekly-review.md` | weekly review note | R (output) | restructure | Opens with a 7-item objective checklist and a 4-column metrics table; the decisions (advance-or-close, proposed changes) are 6th and 9th. `Answer` lives in a table cell. See §3. |
| `assets/prompts/goal-verifier.md` | independent reviewer prompt | M | polish | Good, portable. Return shape is a pipe line without separator row (breaks the package's own R71 table rule when pasted). Could become a `delegated` agent later; keep as asset now. |
| `assets/prompts/guardrail-auditor.md` | system-level audit, HALT | M + C | polish | Very good. Odoo-model-specific checks are fine as instance profile. Same table-shape issue in the Return block. |
| `assets/prompts/recipient-reader.md` | read a draft as the recipient | M | keep | Generic, crisp, reusable; candidate for `executive-communication` or `meaningfy-voice` reuse (not sales-specific). |

### 1.3 `skills/sales-accounts`

| File | Owns | Kind | Verdict | Reason |
|---|---|---|---|---|
| `SKILL.md` | accounts: Odoo shape, workflow, profile depth, account after the deal, acceptance criteria | M + C | polish/restructure | Solid. Missing Quick Start, Gotchas, Boundary section, facets; `## Overview`; description 1 001 chars. Customer success section repeats `customer-success.md` in a 7-bullet summary (second statement). External `anthropic-skills:odoo-mcp-tools` does not exist in the catalogue or installed list. |
| `references/identity.md` | entity resolution: kinds, keys, decide table, tying evidence, merges, naming | M | keep (polish) | Best file in the package; generic CRM method (posture R). The rule "a proposal without an id is not actionable" (§6) is right but incomplete — it drives the id-only outputs the owner complains about; add "and with one line of context". The merge-proposal shape (§5) is the **model** decision request the rest should copy. |
| `references/personal-details.md` | three GDPR-safe rules for personal details | M | keep | Clear, bounded, legally careful. |
| `references/customer-success.md` | desired outcome, success plan, account health, outcome reviews, expansion, advocacy | M | polish | Good method, but post-sale (`purpose: client-delivery`, not `crm`); overlaps `semantic-consulting-coach` engagement lifecycle (delivery/expansion). Consider its own skill or moving to consulting. |
| `assets/templates/company-profile.md` | company profile (14 sections) in Odoo `comment` | R (output) | polish | Complete but long; no "one-line who they are" at top; *Identity* and *Keys* overlap. |
| `assets/templates/person-profile.md` | person profile (10 sections) | R (output) | polish | Good human shape ("how to talk to them"). Same: lead with a one-liner. |

### 1.4 `skills/sales-deal-dossier`

| File | Owns | Kind | Verdict | Reason |
|---|---|---|---|---|
| `SKILL.md` | homework workflow, depth by stage, acceptance criteria | M | polish | Missing template sections; `## Overview`; workflow step "4b" (renumber). External `meaningfy-core:semantic-consulting-coach` is stale (now `meaningfy-consulting`) — skillery cites bare names anyway. |
| `references/five-ps.md` | five-P verdict, bands, disqualifiers | M + C | keep | Crisp rubric, explicit OPEN handling. Disqualifiers are Meaningfy-specific (CDISC, IDMP). |
| `references/meddpicc.md` | MEDDPICC spine + question per element + three pillars | M | polish | Question bank overlaps `semantic-consulting-coach/references/presales-discovery.md` (both ask "what have you tried / what does it cost"). Decide one owner of prospect questions. |
| `references/research-checklist.md` | where to look, what to capture, rules | M | keep | Short and clear. "Luxembourg Business Registers" fine as example. |
| `references/value-equation.md` | Hormozi value equation, risk and blame, guarantees, founding-client offer, objection map | M + C | restructure | Guarantees and founding-client offer are **commercial policy**, overlapping `proposal-writing` (fixed frame, stop/extend) and `semantic-consulting-coach` engagement lifecycle (three safeguard options). Objection drivers here vs taxonomy in `objections.md` — two classification schemes for objections. |
| `assets/templates/dossier.md` | deal dossier in Odoo `description` | R (output) | restructure | 17 sections; Summary starts with internal scoring code (`★★ nurture · Five Ps 6/10 (1 OPEN)`) before saying what the deal is. See §3. |

### 1.5 `skills/sales-meeting-coach`

| File | Owns | Kind | Verdict | Reason |
|---|---|---|---|---|
| `SKILL.md` | meeting plan workflow, replies/revivals, draft acceptance criteria | M | polish | Description names seven authors — triggers on method names, not jobs. Related list uses stale `meaningfy-core:` qualifiers for `semantic-consulting-coach`, `proposal-writing`, `executive-communication`. |
| `references/selling-method.md` | principles, Taleb, personal touches, channel matrix, price rule, cadence | M + C | restructure | Rich but 97 lines of mixed concerns. Price rule and "approved ranges: OPEN" table is commercial policy (pricing owner = `estimation`/`proposal-writing`). Voice rules ("never 'leading'") overlap `meaningfy-voice`. Channel matrix B2G/B2B overlaps `semantic-consulting-coach` (B2B sale vs B2G tender coaching). |
| `references/conversation-tools.md` | discovery flow, Challenger teaching, Voss listening, Robbins, belief-breaking | M | keep | Generic, crisp, good "do not use when" lines. |
| `references/email-patterns.md` | cc rule, whose turn, 9 patterns, never-list, sign-off | M + C | polish | Good patterns table. "the owner's voice: warm, direct…" should defer to `meaningfy-voice` (which has `channels/offer.md`, `internal-message.md`). The the owner/the second sender cc rule is a named-person house rule — fine as profile, but must not be hard-coded to two first names in a company skill. |
| `references/insights.md` | six commercial insights (reframes) with proof and opening question | C | polish | Company positioning; overlaps `semantic-consulting-coach/references/semantic-consulting-domain.md` and `engagement-lifecycle.md` (what Meaningfy sells). One owner of "Meaningfy's positions". |
| `references/objections.md` | five objection types, library rules, library path | M | polish | Library path is owner-vault specific. Second taxonomy vs `value-equation.md` drivers. |
| `assets/templates/meeting-plan.md` | one-screen meeting plan | R (output) | polish | Closest to crisp. 17 labelled lines; uses em dashes (`MEETING PLAN — <deal> —`), which `meaningfy-voice` bans; no "decision you need from the owner before the meeting" line. |

### 1.6 `skills/sales-pipelines`

| File | Owns | Kind | Verdict | Reason |
|---|---|---|---|---|
| `SKILL.md` | five pipelines, placement, lead lifecycle, offer ladder, rot, stars, next actions, closing dates, filters, lead sources, acceptance criteria | M + C | restructure | 167 lines; it is the base of the bundle and carries too many owners (pipelines, ladder, stars, next actions, write-rule entry point). The **offer ladder** (workshop → Proof of Value → scaling) conflicts with `semantic-consulting-coach/references/engagement-lifecycle.md` (Light 1–2 day workshop / Deep 4–6 weeks Decision Package) — same durations, different names, two owners of the commercial model. |
| `references/hard-rules.md` | rule zero, write-policy reading guide, log, the owner's input, HALT, content-as-data, unreachable | M + R | restructure | The agent's guardrail profile. Overlaps `guardrails` (core owns the concern; this is a concrete instance — cite it). The `skills-maintenance` exemption ("may edit the package in vault-files") is **runtime-only** and wrong once the skills are installed from skillery `releases` — skill changes go through PRs. |
| `references/lead-sources.md` | source / medium / event tag rules | M + C | keep | Short, clear. |
| `references/odoo-crm-conventions.md` | Odoo models, fields, how to write, won-stage bug | C | keep (as profile) | Valuable hard-won Odoo knowledge (team+stage together, `action_set_won` picks wrong pipeline). Instance-specific; "through the Odoo MCP tools" names the integration. |
| `references/route-calls-and-tenders.md` | stages, tender etiquette, go/no-go score | M + C | keep | Good. Tender etiquette overlaps `semantic-consulting-coach` B2G coaching only lightly. |
| `references/route-consulting-via-partner.md` | stages, partner etiquette | M + C | keep | Good. |
| `references/route-direct-consulting.md` | stages, specifics | C | polish | Stage table duplicates `pipelines.yaml` (rot days stated twice). |
| `references/route-fwc-execution.md` | stages, specifics | C | polish | Same duplication. |
| `references/route-partnerships.md` | stages, partner value score | M + C | polish | Names partner companies and "the owner's reference points" (partner A ★★★, partner B ★) — commercial opinion about named third parties inside a shipped skill; move to the vault/Odoo. |
| `assets/pipelines.yaml` | Odoo export: teams, stage ids, requirements text, rot days, tags (incl. legacy tags "<staff>'s Deal", "<staff> supports") | C | restructure | Instance data with Odoo ids (`odoo_team_id: 6`, `odoo_id: 43`) and people's names in legacy tags. EPIC DEC-3 says skillery holds no CRM data. Keep stage names, exit criteria and rot days as company method; drop ids, legacy and parked teams (read live from Odoo). |
| `assets/write-policy.yaml` | the tiers of every action (do/ask/never), 50 entries, evaluator semantics | C + M | keep (polish) | Excellent: policy as data, testable. Tool namespace (`gmail.*`, `docs.*` = Claude Docs, `trigger.*` = Desktop scheduler, `browser.*` = Claude in Chrome, `memory.*` = company memory MCP) mirrors one desktop's connector set; generalise the comment and keep the evaluator semantics. Remove `skills-maintenance`/`package.write` for the catalogue copy. |
| `assets/odoo-views.yaml` | 35 attention filters, closing-date stages, Deadline type, views | C | keep | Clear question/action/target/cadence per filter. Instance config; fine as a profile asset. |

### 1.7 `tests/`

| File | Owns | Kind | Verdict | Reason |
|---|---|---|---|---|
| `README.md` | how to run, read, maintain the tests | D | restructure | Good; fold the maintenance rules into skillery's `docs/development` testing narrative. |
| `conftest.py` | `--behaviour`, `--runs`, R-id markers, cost line | T | drop/merge | Conflicts with skillery `tests/conftest.py`; R-id markers die with REQUIREMENTS.md. |
| `run_tests.py` | legacy plain-Python harness (T1–T4) | T | drop | Superseded by the pytest-bdd suite; reimplements the policy evaluator a second time. |
| `behaviour_cases.yaml` | legacy E1–E13 behaviour cases | T | drop | Superseded by `features/behaviour/*.feature`. |
| `write_policy_cases.yaml` | legacy 90 policy cases | T | drop | Duplicate of the 120 table rows in `features/write_policy.feature`. |
| `tool_inventory.yaml` | write-capable tools on the owner's desktop | T/C | drop | Byte-identical duplicate of `data/tool_inventory.yaml`. |
| `ownership.yaml` | single-owner claims for the sales skills | T | restructure | Written "to merge into the skillery's tests/ownership.yaml" — do exactly that. |
| `trigger_probes.yaml` | probes per skill, near-miss flags | T | restructure | Same: merge into skillery `tests/trigger_probes.yaml`, using skillery's `near_miss_of:` field. |
| `data/tool_inventory.yaml` | connector snapshot 2026-10-08 | T/C | polish | Runtime snapshot; keep only if the write-policy completeness test is ported. |
| `data/neighbour_skills.yaml` | paraphrased competing skills for trigger test | T | polish | Stale names (`meaningfy-core:proposal-writing`). Skillery's probe file already tests against installed neighbours. |
| `support/__init__.py` | package marker | T | drop | — |
| `support/package.py` | path/frontmatter/feature readers | T | drop | Skillery lint has its own readers. |
| `support/policy.py` | write-policy evaluator (most restrictive wins) | T | keep (port) | Deterministic, small, the one piece of real logic; port as plain pytest helper. |
| `support/agent.py` | runs agent + judge via `claude -p --tools ""` | T/R | restructure | Claude-CLI-only (`claude -p`, `--system-prompt-file`, `--strict-mcp-config`): not dual-CLI. Keep as an opt-in eval runner outside `make validate` (fits the roadmap's Haiku-evals step), never in CI. |
| `test_write_policy.py` | steps for policy tables | T | keep (port) | Port to `pytest.mark.parametrize` over a YAML or the feature tables. |
| `test_package.py` | structure, links, ownership, probe counts | T | drop | Duplicates `tools/repo_lint` (frontmatter, links, size, ownership, probes). Its "external skills qualified with plugin" check contradicts skillery (bare names). |
| `test_templates.py` | "file contains text", numbered questions, Obsidian tables | T | polish | String-presence checks are brittle; keep the table-render check (generic, useful) and a few requirement anchors. |
| `test_scheduled_tasks.py` | safety summary embedded, version named | T | drop | Tests runtime prompts that will not ship. |
| `test_requirements.py` | REQUIREMENTS ↔ tags ↔ files | T | drop | Replaced by OpenSpec spec traceability. |
| `test_odoo_views.py` | filter completeness, stage names exist | T | keep (port) | Deterministic over the YAML assets. |
| `test_behaviour.py` | Given→situation, When→agent, Then→judge | T/R | restructure | Same runtime dependency as `support/agent.py`. |
| `features/write_policy.feature` | 11 outlines, 120 rows: every action → tier | T | keep (port) | The most valuable test; deterministic. |
| `features/package.feature` | structure, ownership phrases, probes | T | drop (merge data) | Ownership rows → `tests/ownership.yaml`; probes → `trigger_probes.yaml`; the rest is skillery lint. |
| `features/templates.feature` | 267 lines of required-text rows; table rendering | T | polish | Trim to requirement anchors that matter; add the missing "decision request is self-contained" check (§3). |
| `features/scheduled_tasks.feature` | scheduled-task contents | T | drop | Runtime. |
| `features/requirements.feature` | traceability | T | drop | Runtime of this package's own process. |
| `features/odoo_views.feature` | filters complete, stages exist | T | keep (port) | Deterministic. |
| `features/behaviour/safety.feature` | injected mail, open tender, unreachable system | T | keep as agent spec | Portable as `tests/features/agents/sales-agent.feature` scenarios (shape-checked, run by hand per CLI). |
| `features/behaviour/input_and_halt.feature` | The owner's yes applied; unlogged write halts | T | keep as agent spec | Same. |
| `features/behaviour/pipeline.feature` | forward move, whose turn, conversion, partnership, one offer | T | keep as agent spec | Same. |
| `features/behaviour/entity_resolution.feature` | ambiguous person/deal → question | T | keep, **amend** | Asserts "question naming both candidates with their ids and the evidence" — add a Then for a recommendation and a one-line context per candidate. |
| `features/behaviour/accounts.feature` | personal details; won client stays an account | T | keep as agent spec | — |
| `features/behaviour/dossier_and_meetings.feature` | homework, plan, same-day follow-up, personal touches | T | keep as agent spec | — |
| `features/behaviour/qualification.feature` | five Ps, OPEN → question, explicit ask, disqualifier | T | keep as agent spec | — |
| `features/behaviour/selling.feature` | insight-led outreach; manipulation refused | T | keep as agent spec | — |
| `features/behaviour/customer_success.feature` | desired outcome, red recovery, green growth | T | keep as agent spec | — |
| `features/behaviour/attention.feature` | stars, next actions, overdue, closing dates, deadlines | T | keep as agent spec | — |
| `features/behaviour/triggers.feature` | probe → skill | T | drop (merge data) | Becomes rows in `tests/trigger_probes.yaml` (one positive + one near-miss per description). |

---

## 2. Conformance against skillery standards (all five skills)

| Check | Status in the package | Skillery rule |
|---|---|---|
| Six facets under `metadata` | **missing** in all 5 | `facets.yaml`, validator fails |
| `## Boundary & Related Skills` | **missing** (they have `## Related skills`; regex needs "boundary") | lint `_BOUNDARY_HEADING` fails |
| `## Quick Start` with worked example | missing in all 5 | skill-template |
| `## Gotchas` | missing | skill-template |
| `## Overview` | present in all 5 | creating-skills: "No Overview that repeats the description" |
| Description form | "Meaningfy's sales agent for the owner's…"; 770–1 022 chars (limit 1 024; two within 25 chars) | "Use this skill when …; it …", aim well under the limit |
| Strict YAML | OK (folded `>-`) | — |
| Size | 99–167 lines | ≤650, OK |
| External skill names | `meaningfy-core:semantic-consulting-coach`, `meaningfy-core:proposal-writing`, `meaningfy-core:executive-communication` (wrong bundle), `anthropic-skills:odoo-mcp-tools` (does not exist) | bare names; one owner |
| One owner per fact | mostly tracked; duplicates: hard rules ×4 (hard-rules, safety-summary, 3 tasks, README), rot days ×2 (route files + pipelines.yaml), customer success ×2, objection classification ×2, Obsidian table rule vs `vault-conventions`, offer ladder vs `engagement-lifecycle` | single-source-of-authority |
| Agent vs skill | `sales-agent` is an orchestrator in skill form | agent-template: `type: scheduled`, ≤40 lines, dispatch contract |
| Personal facts in company skills | "the owner" 139× in skill bodies, "the second sender" in cc rule, "the owner's reference points" on named partners, legacy tags with staff names | a company catalogue installs for "a second person" (EPIC Why) |

---

## 3. Readability of what the agent outputs to the human

### 3.1 Structural problems (all run-note templates)

| Problem | Where | Effect |
|---|---|---|
| Machine log before decisions | `grooming-session.md`: Objective → Pipeline at a glance → Applied → Iteration (Plan, Done, Verification, Decision) → **then** Needs you today, Proposals, Questions | The owner scrolls past dozens of `system · model · name (#id) · field · old → new · source` lines to find what they must decide. Violates answer-first (`executive-communication`; writing-antipatterns A9). |
| Objective checklist first in every note | all three templates | The first screen is the agent's acceptance criteria, which are for the verifier, not the human. |
| Over-wide tables | intake plan (10 cols), intake audit (9 cols), weekly pilot measures (5), pipeline at a glance (5) | Unreadable in Obsidian; the package's own R71 rule caps *cells* at 100 chars, not columns. writing-antipatterns A8 "dense tables in place of prose: avoid" for Decision genre. |
| Answers inside table cells | `weekly-review.md` *Advance or close* `\| Answer \|` | Editing a table cell in Obsidian is error-prone; inconsistent with the `- [ ] … Answer:` convention elsewhere. |
| Internal codes as headline | `dossier.md` Summary starts `★★ nurture · Five Ps 6/10 (1 OPEN)`; five-P line `5/10 (Pa2 Pr0 Po1 Pl1 Fi1; 2 OPEN)`; account health `(Ou · Ch · Sp · Ad · Se; n OPEN)` | Codes need the rubric open to decode. Lead with the deal in words, scores second. |
| Ids as the unit of meaning | identity.md §6 "A proposal without an id is not actionable"; hard-rules §0 "Every record … named `name (#id)`" | Correct for traceability, but the rules stop at the id: no rule requires *what the record is* or *why it matters*. Combined with the 100-char cell cap, decision rows collapse to `name (#id) · reason · evidence`. |
| Evidence cited by id, not quoted | identity.md §1 "cite by id"; odoo-views actions "with the mail cited", "with the note cited" | The owner gets `thread 18f3a…` instead of the sentence that decides it. |
| Em dashes, mixed register | `meeting-plan.md`, auditor, verifier return blocks | `meaningfy-voice` bans em dash; not cited anywhere. |
| No "by when / what if no answer" | every Proposal and Question | The owner cannot triage; the agent cannot apply a default. |

### 3.2 Every decision request, quoted, with what is missing

| # | Location | Quoted text | Missing context |
|---|---|---|---|
| D1 | `skills/sales-agent/assets/templates/grooming-session.md`, *Proposals* | `- [ ] P1 · <record name (#id)> · <won/lost · pipeline change · configuration · commitment in a draft · other ask-first item> · reason · evidence · Answer:` | what the deal is in one line (company, offer, stage, value); the recommended answer; what "yes" will do (exact write); what happens if no answer (default, deadline); evidence as a quoted sentence with date, not an id; last contact and whose turn. |
| D2 | same, *Questions* | `- [ ] Q1 · <question> · Answer:` | everything: which record, why the agent cannot decide, the options with the agent's pick, what is blocked until answered. |
| D3 | same, *Needs you today* | `Deal name (#id) · why · what is ready (plan, draft) · what you need to do.` | where the plan/draft is (link to draft, meeting time), deadline, one line of situation. Best of the set, but the template gives no example. |
| D4 | same, *Pipeline at a glance* | `the owner's stars that differ from the score: name (#id) · his · the score's.` | which P drove the difference and its evidence; what the agent proposes; that it is a question at all (no `Answer:`). |
| D5 | `skills/sales-pipelines/SKILL.md`, *Stars* | `It records the difference in the run note ("the owner ★★★, score says ★★: why?")` | same as D4; "why?" with no score breakdown forces the owner to open the dossier. |
| D6 | `skills/sales-pipelines/SKILL.md`, *Next actions* | `While a proposal waits for the owner, the activity is "decide on P<n>", due the next working day.` | The worst case: an Odoo activity whose whole text is a pointer to a line in a vault note the owner is not looking at. Needs the decision itself in the summary ("Mark Acme workshop lost? No reply after 3 touches since 12 Sep; yes = lost, reason 'no response'") plus the note name. |
| D7 | `skills/sales-agent/references/agent-loop.md` §3 | ``in a scheduled run, write a question in the note (`- [ ] … Answer:`)`` | no shape at all; same as D2. |
| D8 | `skills/sales-agent/assets/templates/intake-session.md`, *Proposals* | `- [ ] P1 · **Approve the plan above** (creations beyond five, new tags). Exceptions can be listed ("all except #7, #12"). · Answer:` | a summary of what approval means (counts: N companies, N people, N leads, N opportunities, new tags); the rows the agent is least sure of, called out; the plan rows' *Why* is ≤100-char cell. |
| D9 | same | `- [ ] P2 · Merge proposals found while scouting (identity, section 3). · Answer:` | bundles all merges into one yes/no; points to the wrong section (merges are §5 of `identity.md`); drops the good merge shape of §5 (records, agreeing/disagreeing keys, which to keep, what moves). |
| D10 | same, *Questions* | `- [ ] Q1 · Ambiguous matches: <name> → candidates <ids> with the evidence for each. · Answer:` | candidates as ids only; needs per candidate: name, employer, role, the key that agrees and the one that disagrees; the agent's best guess; what is blocked. |
| D11 | `skills/sales-agent/assets/templates/weekly-review.md`, *Advance or close* | `\| Deal \| Pipeline / stage \| Days in stage \| Recommendation \| Reason \| Answer \|` | last two-way contact and its date, whose turn, what "close" writes (lost reason), the one thing that would change the recommendation; answer in a table cell. |
| D12 | same, *Proposed changes to the instructions* | `- [ ] <change to a skill or template> · why · Answer:` | the observed failure (run, record, what went wrong), the exact before → after text, which file; in skillery this is an issue/PR, not a vault answer. |
| D13 | same, *Bands* | `Bands that fell this week · stars the owner set that differ from the score (asked once).` | no shape, no `Answer:`; same as D4. |
| D14 | same, *Accounts* | `\| Client (#id) \| Health (score · colour · OPEN) \| … \| Action \|` | the action is a cell; a red account's recovery plan needs a paragraph and a yes. |
| D15 | `skills/sales-pipelines/references/route-calls-and-tenders.md` | `Write a go/no-go scorecard … for the owner's decision within 3 days` | no output shape for the decision: needs call name, deadline, our role, the 4 scores with one-line reasons, recommendation, and what "go" commits (effort, partners). |
| D16 | `skills/sales-pipelines/assets/odoo-views.yaml`, `hy-mail-ahead` / `hy-closing-note-open` / `overdue` | `propose the stage move, won, lost or a new deal, with the mail cited` · `propose lost … with the note cited` · `propose a new date with a reason` | "cited" = an id; should require the decisive sentence quoted with sender and date. |
| D17 | `skills/sales-accounts/references/identity.md` §3 | `write a question with the candidates (name (#id)) and the evidence for each` | add employer/role per candidate and the agent's pick. |
| D18 | `skills/sales-accounts/references/identity.md` §3 (employer move) | `Propose (ask first) moving the contact (parent_id, function)` | no shape: old/new employer, evidence of the move, what happens to open deals. |
| D19 | `skills/sales-accounts/references/customer-success.md` §3 | `Red … a recovery plan in the run note, Needs you today for the owner` | no recovery-plan shape (signal that failed, proposed action, by when). |
| D20 | `skills/sales-agent/assets/templates/*`, `HALT: none` + hard-rules §4 | `writes HALT: <reason> at the top of the note` | what was violated, on which record, what to check, and the literal `the owner: resume` instruction to clear it. |
| D21 | `scheduled-tasks/open-day.md` final lines | `Finish with three lines for the owner: … how many proposals and questions wait for his answer.` | counts only; the chat summary should list the top 3 decisions in one line each. |
| D22 | `skills/sales-agent/references/agent-loop.md` §4 | `list every write of the iteration under Needs you today for the owner to check` (unverified run) | dumps raw log lines on the human; should summarise by record and flag only the risky ones. |
| D23 | `skills/sales-agent/assets/prompts/guardrail-auditor.md` | `Unattributed (may be the owner): none \| list` | an implicit question ("was this you?") with no `Answer:` and no record context. |

**Good counter-examples already in the package** (the shape to generalise): the merge proposal in `identity.md` §5 (records, keys that agree and disagree, which to keep and why, what moves, Answer) and the configuration-proposal criteria in `sales-pipelines/SKILL.md` ("lists each change as before → after; … says what happens to the deals affected").

**Missing rule (recommendation).** One owner for a *decision card*: `P<n> · <decision in one sentence, as a yes/no> · <record in words + (#id)> · situation in ≤2 lines (stage, last contact and date, whose turn) · recommendation and why · yes = <exact write> · no answer by <date> = <default> · evidence: "<quoted sentence>" (<source, date>) · Answer:`. The placement question: `writing-antipatterns/references/decision.md` marks curse of knowledge (A13) as **welcome** for the Decision genre ("the reader is assumed to share context") — exactly wrong for an asynchronous approval request read days later. Either add an "approval request" genre there, or let `executive-communication` own the card and the sales run skill apply it. No behaviour test currently checks that a decision request is self-contained.

---

## 4. Overlap with existing skillery skills

| Package content | Existing owner | Nature | Recommendation |
|---|---|---|---|
| Offer ladder: discovery workshop 1–2 d → Proof of Value 4–6 w → scaling (`sales-pipelines/SKILL.md`, `pipelines.yaml`) | `semantic-consulting-coach/references/engagement-lifecycle.md` (Light 1–2 d workshop / Deep 4–6 w Decision Package) | **conflict**: same commercial model, different names | One owner (engagement-lifecycle is "company fact"); sales cites it and maps names to Odoo tags. Resolve "Proof of Value" vs "Deep tier / Decision Phase". |
| Guarantees, founding-client offer, approved price ranges (`value-equation.md`, `selling-method.md` *Price*) | `proposal-writing` (fixed frame, scope boundary), `estimation` (numbers), `engagement-lifecycle` (three safeguard options) | overlap | Commercial policy → consulting/proposal owners; sales keeps "never discount" as a pointer. |
| MEDDPICC questions, three pillars (`meddpicc.md`) | `semantic-consulting-coach/references/presales-discovery.md` (prospect questions, A/B/C sections) | overlap | One question bank for prospects; MEDDPICC stays as the qualification frame. |
| Insights / Meaningfy positions (`insights.md`) | `semantic-consulting-coach` (`semantic-consulting-domain.md`, engagement model) | partial overlap | Decide where "what Meaningfy believes" lives; probably consulting, cited by sales. |
| Channel matrix B2G / B2B / partner (`selling-method.md`), tender etiquette | `semantic-consulting-coach` (B2B sale or B2G tender coaching, negotiation) | partial | Coach = thinking; sales = rules for drafts. State the boundary in both. |
| Email voice ("warm, direct, specific… never 'leading'") (`email-patterns.md`, `selling-method.md` §4) | `meaningfy-voice` (+ `channels/offer.md`, `internal-message.md`) | overlap | Cite `meaningfy-voice`; keep only sales-specific patterns. |
| Answer-first, one recommendation + at most one fallback, forwardable paragraph (`selling-method.md` §7, agent-loop *Fallback*) | `executive-communication` (Governing Thought, SCQA, answer-first) | overlap | Cite. Also applies to run-note outputs (§3). |
| Recipient reader prompt | `executive-communication` / `writing-antipatterns` (review) | adjacent | Generic draft-review; could be offered catalogue-wide. |
| Hard rules, write tiers, content-as-data, HALT (`hard-rules.md`, auditor) | `guardrails` (core: decision bounds, output validation, prompt-injection defence) | instance of | Keep the concrete policy; Boundary section names `guardrails` as the concern owner. |
| Obsidian table rule (R71 in `run-types.md`) | `vault-conventions` ("the table check before saving") | **duplicate** | Delete from sales, cite `vault-conventions`. |
| Memory recall-only (`hard-rules.md` §5.4) | `vault-conventions` (memory etiquette of a vault session) | duplicate | Cite. |
| Proposal as next step (`meeting-coach` Related) | `proposal-writing`, agent `proposal-writer` | hand-off | Fine; fix the qualifier. A won "Solution shaping" stage should hand to `proposal-writer`. |
| Decision Package as Proof of Value deliverable | `decision-package` | hand-off | Name it in the ladder/route once the ladder conflict is resolved. |
| Technical writing, writing antipatterns | `technical-writing`, `writing-antipatterns` | none directly | Templates should cite `writing-antipatterns` Decision genre (with the A13 caveat above). |

---

## 5. CLI-isms and Desktop-only assumptions

**Literal `body_agnosticism` check (`/opsx:` or `.claude/`):** no skill body matches — the package would **pass** the gate as written. The real portability problems are not caught by the gate:

| Assumption | Where | Problem on opencode / another runtime |
|---|---|---|
| "subagents", "start fresh subagents with the prompts in `assets/prompts/`" | `sales-agent/SKILL.md`, `agent-loop.md`, prompt titles | Claude-shaped wording; acceptable if phrased "independent reviewer run (a fresh agent with only these inputs)". Already has the "no subagent → unverified" fallback (good). |
| "the `odoo` connector on the owner's computer", "through the Odoo MCP tools" | `agent-loop.md` *Terms*, `odoo-crm-conventions.md` | runtime install fact; belongs in the agent's dispatch contract / env doc. |
| Tool namespace `gmail.*`, `calendar.*`, `drive.*`, `docs.*` (Claude Docs), `trigger.*` (Desktop scheduler), `browser.*` (Claude in Chrome), `memory.*`, `vault.write`, `package.write` | `write-policy.yaml`, `data/tool_inventory.yaml` | normalised names (good), but the inventory is one desktop's connector set on 2026-10-08. Keep as abstract capability classes; drop Claude-product entries or mark them optional. |
| `anthropic-skills:odoo-mcp-tools` | `sales-accounts/SKILL.md`, `sales-pipelines/SKILL.md` | non-existent external; plugin-qualified name. |
| Absolute paths `<owner synced drive>/…/vault`, "Claude desktop", "device tools", "Approval setting: automatic" | `scheduled-tasks/*.md`, README *Setup* | Desktop-only, single-machine. Not shippable. |
| Vault layout `04 Daily/crm-grooming-session/`, `01 Projects/`, `objection library.md` | `run-types.md`, `objections.md`, hard-rules, write-policy `vault-run-note` | owner-vault specific; should resolve through `vault-conventions` or a configured run folder. |
| `skills-maintenance`: edit "the `meaningfy-sales` package in vault-files" | `hard-rules.md` §3, `write-policy.yaml`, auditor | meaningless once installed from skillery `releases`; skill changes are PRs. |
| `claude -p --system-prompt-file … --tools "" --strict-mcp-config` | `tests/support/agent.py`, `tests/README.md` | Claude Code CLI only; behaviour tests cannot run on opencode. |
| Named people: the owner (139× in skills), the second sender (cc rule), two staff members (legacy tags) | throughout | not a CLI-ism, but a "second person installs it" blocker. Parameterise as "the owner" / "the co-founder in cc", set per installation. |

---

## 6. Test portability

| Test | Portable as | Depends on runtime? | Action |
|---|---|---|---|
| `features/write_policy.feature` + `test_write_policy.py` + `support/policy.py` | plain pytest (parametrize over YAML or the feature tables) | no | **Port**; keep ~120 cases; add to `make validate`. Needs a decision: add `pytest-bdd` or rewrite steps as parametrize (skillery uses plain pytest). |
| write-policy completeness ("every tool has an entry") + `data/tool_inventory.yaml` | plain pytest | partly (inventory is a desktop snapshot) | Port with an abstract inventory. |
| `features/odoo_views.feature` + `test_odoo_views.py` | plain pytest | no | **Port** (if `odoo-views.yaml` ships). |
| Obsidian table-render check (`templates.feature` last outline, `test_templates.py::_tables`) | plain pytest / repo_lint check | no | **Port**, ideally generic for all vault-writing skills (complements `vault-conventions`). |
| `templates.feature` required-text rows | plain pytest | no | Port a trimmed subset; add "decision card fields present" rows. |
| `package.feature` / `test_package.py` | — | no | Drop; covered by `tools/repo_lint`. Ownership rows → `tests/ownership.yaml`. |
| `ownership.yaml`, `trigger_probes.yaml`, `behaviour/triggers.feature` | skillery `tests/ownership.yaml`, `tests/trigger_probes.yaml` | no | **Merge** (they were written for this). Convert `near_miss: true` → `near_miss_of: <skill>`. |
| `features/behaviour/*.feature` (10 files, ~28 outlines) | Gherkin under `tests/features/agents/sales-agent.feature` (+ per-skill features if desired) | yes, to execute (LLM) | **Port as specs**: skillery shape-checks agent features and runs them by hand per CLI. Each needs the Background line naming every `skills:` entry. Executing them stays opt-in via a runner. |
| `support/agent.py`, `test_behaviour.py`, `conftest.py --behaviour` | opt-in eval tool | yes (Claude CLI) | Keep outside `make validate`; candidate seed for the roadmap's eval step. |
| `scheduled_tasks.feature`, `test_scheduled_tasks.py` | — | yes | Drop. |
| `requirements.feature`, `test_requirements.py` | — | process-specific | Drop; OpenSpec spec traceability replaces it. |
| `run_tests.py`, `behaviour_cases.yaml`, `write_policy_cases.yaml`, `tests/tool_inventory.yaml` | — | — | Drop (legacy, duplicate). |

---

## 7. Recommended split for skillery

| Skillery artefact | Built from | Facets (suggested) | Notes |
|---|---|---|---|
| **agent `sales-agent`** (`type: scheduled`, human session allowed, `Not for delegation`) | `sales-agent/SKILL.md` role + call graph; scheduled-task schedules as **Input** triggers; run-note location and logged/reversible writes as **Output/Side effects**; never-tier as **Refuses** | purpose crm, area sales, posture precise, stage sell | ≤40-line body; skills: `crm-runs` (primary), `crm-pipeline-custody`, `crm-accounts`, `deal-qualification`, `sales-conversations`. opencode `scheduled` gap recorded. |
| **skill `crm-runs`** (primary of the agent) | `agent-loop.md`, `run-types.md`, the three run-note templates, the three reviewer prompts | crm, sales, generic→spec?, precise | Owns the goal loop, run types, run-note shapes **and the decision card** (or cites `executive-communication` if that owns it). Rewrite templates answer-first. |
| **skill `crm-pipeline-custody`** (rename of `sales-pipelines`) | pipelines/stages/exit/rot, placement, lead lifecycle, stars, next actions, closing dates, filters, lead sources, Odoo conventions; `odoo-views.yaml`; a stripped `pipelines.yaml` | crm, sales, profiled | Offer ladder → cite `engagement-lifecycle`. Odoo ids and legacy tags out. |
| **skill `crm-write-policy`** (or fold into `crm-pipeline-custody`) | `hard-rules.md`, `write-policy.yaml`, guardrail-auditor criteria | crm, sales, precise | Concrete instance of `guardrails`; remove `skills-maintenance`. Keeping it separate makes the policy citable by any future CRM-writing agent and keeps custody under the size of one concern. |
| **skill `crm-accounts`** (from `sales-accounts`) | `identity.md`, `personal-details.md`, profile templates | crm, sales, reusable | Entity resolution is generic CRM method. |
| **customer success** | `customer-success.md` | client-delivery, consulting | Either a section of `crm-accounts` (pointer) or moved next to `semantic-consulting-coach` delivery; decide in the EPIC. |
| **skill `deal-qualification`** (from `sales-deal-dossier`) | dossier template, MEDDPICC, five Ps, research checklist, risk and blame | crm/offers, sales, profiled | Guarantees and founding-client offer → `proposal-writing`/`engagement-lifecycle`; prospect questions deduped with `presales-discovery.md`. |
| **skill `sales-conversations`** (from `sales-meeting-coach`) | meeting plan, conversation tools, email patterns, objections (one taxonomy), selling principles, channel matrix | offers, sales, profiled | Voice → `meaningfy-voice`; answer-first → `executive-communication`; price → `estimation`; insights → consulting owner or kept here as the one owner. |
| docs page `docs/environment/…/sales-agent-runtime.md` | README *Setup*, scheduled-task schedules, connector list | — | Desktop + scheduler setup, the one place absolute-path and connector facts live (as instructions, not paths). |
| EPIC inputs | `REQUIREMENTS.md`, `CHANGELOG.md`, `behaviour_cases.yaml` | — | Failure cases → spec deltas and acceptance tests. |

Naming note: the package's `sales-*` prefix collides in trigger space with the generic `sales:*` plugin skills installed next to it (`sales:pipeline-review`, `sales:call-prep`, `sales:crm-hygiene-check`); the package compensates with "Meaningfy" in every description and the "Meaningfy sales agent:" prompt prefix. Noun-anchored names (`crm-…`, `deal-qualification`) follow governance's "prefer noun/artifact-anchored descriptions near external neighbours".
