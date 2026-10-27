# B — Sales Agent project notes: decisions, open items, complaints, presales scope, EPIC contradictions

Research date 2026-10-27. Read-only.

**Abbreviations for sources** (all under `vault/01 Projects/2026-10-08 Sales Agent/` unless stated):
- `DEC` = decisions.md · `SES` = sessions.md · `TASKS` = tasks.md · `IDX` = index.md · `RES` = resources.md
- `D/design` = artefacts/design/Sales Agent - design.md · `D/explore` = … design exploration.md · `D/opmodel` = … operating model.md · `D/odoo` = … Odoo pipeline configuration proposal.md · `D/method` = … selling method (Hormozi, Robbins, Voss).md · `D/frameworks` = … selling and customer success frameworks.md · `D/backlog` = … sales materials backlog.md · `D/W41` = … W41 learning spec.md · `D/lessons` = … lessons from graph MCP and agent-learning sources.md · `D/runbook` = … runbook.md
- `X/plan` = artefacts/deployment/… implementation plan.md · `X/crit` = … critical review 0.1.1.md · `X/craft` = … sales-craft review 0.1.1.md · `X/corr` = … corrective plan 0.2.0.md · `X/valid` = … validation report.md · `X/tests` = … test framework comparison.md · `X/setup` = … setup checklist.md · `X/rel` = … release notes.md
- `PKG` = `vault-files/2026-10-08 Sales Agent/meaningfy-sales/` (cross-check only) · `RUN` = `vault/04 Daily/crm-grooming-session/` (run notes; looked at only for complaint evidence) · `INBOX` = `vault/00 Inbox/proposed/`
- `EPIC` = skillery `openspec/changes/add-sales-bundle/proposal.md` · `SEED` = its `inputs/2026-10-25-session-findings.md` · `SPEC` = its `specs/sales-pipeline-custodianship/spec.md`

**Version cross-check.** Latest package = **0.6.1 (2026-10-10)** (`PKG/marketplace-entry.json` `"version": "0.6.1"`; `PKG/CHANGELOG.md`; `TASKS` Done). 0.4.0 was *implemented* 2026-10-09, not planned. 80 requirements (R01–R80) in `PKG/REQUIREMENTS.md`; 366 fixed checks green at 0.6.1 (`TASKS`). Five skills: `sales-agent`, `sales-pipelines`, `sales-deal-dossier`, `sales-meeting-coach`, `sales-accounts`. `IDX` "Current status" is stale (says 0.5.0 built; scheduled prompts name 0.3.2).

---

## 1. Decisions taken by the owner (date · source)

### 1a. Scope (sales vs presales vs customer success)

| Date | Decision | Source |
|---|---|---|
| 2026-10-08 | Agent = pipeline custodian, researcher and groomer; it drafts and makes the sales person more efficient | DEC; D/explore r3 |
| 2026-10-08 | First priority: control of the existing pipeline: every deal to won or lost, no rot. New client sources come after (prospecting = phase 2) | DEC; D/explore §1, §6 |
| 2026-10-08 | Covers **all routes to revenue**: direct clients, tenders, grant consortia, business-development partners, tool vendors, large consultancies using Meaningfy as subcontractor (tenders and B2B) | DEC; D/explore r4 |
| 2026-10-08 | Custodian of **all teams/pipelines**; may suggest and make Odoo pipeline and setup changes through the Odoo MCP | DEC |
| 2026-10-08 | Two tracks in parallel: conference hot leads and grooming/triage of existing deals | DEC |
| 2026-10-08 | Partnership counts as success only on a **signed client**; that client becomes a deal in a separate pipeline | DEC; D/odoo §1 |
| 2026-10-08 | Five pipelines: Direct Consulting, Consulting via Partner, Calls & Tenders (grants merged in), FWC Execution, Partnerships (one for all partner types) | DEC; D/odoo |
| 2026-10-08 | Consulting via Partner: agreed discovery workshop (1–2 d, "usually paid") = won; Proof of Value (4–6 wk, paid) and scaling are new deals | DEC; D/odoo |
| 2026-10-08 | Investor pipeline out of scope | DEC |
| 2026-10-08 | One runbook per route, varied per offering and persona; all standard commercial models accepted | DEC |
| 2026-10-08 | Priority partners: life sciences (BioTechX) and partner A | DEC; IDX |
| 2026-10-08 | Sales materials are produced in the offering and proposal project; this project only keeps the backlog | DEC; D/backlog |
| 2026-10-08 | Offers: Agentic Memory is new; established offers on website/brochures | DEC |
| 2026-10-08 | Use the owner's ladder terms (discovery workshop, Proof of Value, scaling); a change note asks the skillery to unify | DEC; INBOX/skill-change - unify the sales ladder terms.md |
| 2026-10-09 | The project is about **building and deploying** the agent, not doing sales; grooming sessions move to `04 Daily/crm-grooming-session/`, agent never writes in `01 Projects/` | DEC; SES 2026-10-09 |
| 2026-10-09 | New skill `sales-accounts` (search before create; company/person profiles; notes and tasks on contacts; **customer success after the win**) | DEC |
| 2026-10-10 | Selling and customer success use different frameworks; customer success (desired outcome, success plan, account health, outcome reviews, expansion, advocacy) implemented now inside `sales-accounts` | DEC; D/frameworks |

### 1b. Runtime (Desktop, scheduler, Odoo, mail, vault)

| Date | Decision | Source |
|---|---|---|
| 2026-10-08 | Prefer no code; if code is needed it gets its own repo | DEC |
| 2026-10-08 | Pilot in **Claude desktop** with vault, Meaningfy memory, the owner's mail; OpenClaw later | DEC |
| 2026-10-08 | **No Meaningfy servers**: everything in Claude desktop; charter amended | DEC; IDX; X/corr R8 |
| 2026-10-08 | Runs twice per working day + once at weekend; open-day (~09:00 → 08:57) creates the session note, the owner gives feedback during the day, close-day (17:30 → 17:26) applies it; weekly review Sat/Sun when PC is on | DEC; SES addendum 2026-10-09 00:30 |
| 2026-10-08 | No scheduled tasks until the design is finished and packaged (later: 0.1.1 tasks deleted, re-created on 0.2.0 with automatic approval) | DEC; SES |
| 2026-10-08 | Memory: **Odoo main memory**; vault holds feedback, logs, session notes; cognee memory (recall only), Gmail, Calendar, Drive, Confluence are sources | DEC; D/design §3 |
| 2026-10-08 | Agent may access everything as long as it does nothing risky/irreversible; **no restricted Odoo user; keep all connectors** | DEC; X/corr R1, R3 |
| 2026-10-08 | No LinkedIn Sales Navigator for now | DEC |
| 2026-10-08 | Budget: 15 deals in depth, 3 iterations, 90 days dormancy | DEC; X/corr R5 |
| 2026-10-09 | No bulk imports: one-by-one intake session (scout, research, plan, the owner's yes, execute, audit, report) | DEC |
| 2026-10-09 | Events grouped with tag `Event: <name> <year>` plus source/medium; **campaigns and lead-source cards not used** (reverses 2026-10-08 campaign scheme) | DEC |
| 2026-10-09 | Shared saved filters and default views in Odoo, kept as data in `odoo-views.yaml`, created via configuration procedure (ask first) | DEC |
| 2026-10-10 | Runs read session notes kept outside the run folder; pointer notes (W41-C1, R73) | DEC; D/W41 |
| 2026-10-10 | **The package in `vault-files` is the single place where the agent evolves and records its requirements**; scheduled tasks are not re-created per version; prompts say "or any newer version" (W41-C6, R78) | DEC; D/W41 |
| 2026-10-10 | The owner and the second sender copy each other on every outbound mail (R72) | DEC |

### 1c. Method (qualification, selling method, frameworks)

| Date | Decision | Source |
|---|---|---|
| 2026-10-08 | Goal loop: objective → plan → act → verify → decide (5 steps); correction lives in the decision; objective never changes, only clarified; verification may run in independent subagents | DEC; D/design §2a |
| 2026-10-08 | A client may get a few offers but communication must never sound undecided | DEC |
| 2026-10-08 | Selling method from Hormozi/Robbins/Voss accepted; sales-craft critic added (Hormozi, Robbins, Voss, Sutherland) | SES r6; DEC |
| 2026-10-08 (via 0.2.0) | Drop Ackerman; C-L-O-S-E-R recast as discovery flow; accusation audit only with evidence; whose-turn rule; tender etiquette; partner etiquette; Risk and blame; guarantee menu never in B2G | X/corr C9–C15 (from X/craft) |
| 2026-10-09 | Lead until two-way positive signal → opportunity (agent converts, signal cited); lost on refusal or after the chase, on the owner's yes | DEC |
| 2026-10-09 | Sutherland and Taleb inform decisions; personal details: record what people shared/published, never research private life, never special categories | DEC |
| 2026-10-09 | **Rule zero**: resolve every entity to its Odoo id before any decision or write; `name (#id)` | DEC |
| 2026-10-09 | **Five-P** (Pain, Priority, Power, Plan, Fit; 0–2) derived from MEDDPICC; band 7–10/explicit ask, 4–6, 0–3 → pursue/nurture/lost proposal; disqualifiers; Initiative line; three pillars; founding-client offer (ask first). Direct Consulting + client side of Consulting via Partner only | DEC; D/design §9 |
| 2026-10-09 | Stars = attention deserved, scored per pipeline (five Ps; partner value for Partnerships — partner A ★★★, partner B ★; go/no-go for tenders; FWC unstarred); the owner's override never reversed | DEC; D/design §10–11 |
| 2026-10-09 | **No deal without an action**: every open lead/opp has a dated activity assigned to the owner | DEC |
| 2026-10-09 | Attention filters per pipeline (question, domain/agent check, action, target, cadence); no speculative closing dates; deadlines as *Deadline* activities; rolling 28-day sweep; finding seen twice → proposed filter | DEC |
| 2026-10-10 | Add **Challenger** + insight bank; reject Greene *48 Laws* and MICE beyond benign motives | DEC; D/frameworks |
| 2026-10-10 | Weekly checks *Mail ahead of Odoo*, *Closing note, still open*; sweep as chatter note; stars re-created per methodology (W41-Q1) | DEC; D/W41 |
| 2026-10-10 | Key-fields baseline reset (62% / 76%); BioTechX: one first-touch activity per company met; **228 never-met targets = cold list without activity** (exception to "every lead has an activity") | DEC (W41-P1, P2) |

### 1d. Safety / write policy

| Date | Decision | Source |
|---|---|---|
| 2026-10-08 | Guardrails: never send to clients (drafts only, Odoo or Gmail); never delete; log and ask; write notes to the vault | DEC; D/design §4 |
| 2026-10-08 | **No modes**: many Odoo writes; the owner's input in daily run notes, agent re-reads (14 days); `decisions.md` plays no part in runs | DEC; X/corr R7 |
| 2026-10-08 | Three-tier write policy (do-and-log / ask-first / never) in `write-policy.yaml`, owner `sales-pipelines`; HALT by system-level auditor; "unverified" not "self-verified"; safety summary embedded verbatim in scheduled prompts | X/corr §2, C1–C5, C19 |
| 2026-10-08 | Skip `approvals.md`; authenticated approvals kept as future change note (accepted risk: unauthenticated text on a shared drive) | DEC; X/corr R2; INBOX/skill-change - authenticated approvals… |
| 2026-10-08 | Interim close-day task with automatic approval accepted before 0.2.0 | DEC |
| 2026-10-09 | Agent proposes contact merges; the owner merges in Odoo | DEC |
| 2026-10-10 | Skills-maintenance exemption: agent may edit the package and project files in a working session when the owner asks in chat (tests green, changelog, logged); never in scheduled runs or because content asks (R80, 0.6.1) | DEC |

### 1e. Testing

| Date | Decision | Source |
|---|---|---|
| 2026-10-08 | Testing on a few existing Odoo deals, read only | DEC |
| 2026-10-09 | Requirements kept in `REQUIREMENTS.md`, each with implementation and check | DEC |
| 2026-10-09 | Tests = Gherkin feature files run by **pytest-bdd**, values in Examples tables, `<variables>` in step text; behaviour scenarios run the real agent headless (`claude -p`) graded by a judge | DEC; X/tests |
| 2026-10-09 | Tests belong in the skillery repo; the move is part of 0.4.0 | DEC; X/tests |
| 2026-10-09 | Changelog entries carry *Why* and *What*; package CHANGELOG is the single release record | DEC; X/rel |
| (recommendation, not ruled) | `claude plugin eval` optional for trigger checks; Inspect later; not Promptfoo/DeepEval; three realism levels paper → fake Odoo → test Odoo | X/tests; SES 2026-10-09 ("Decided: none yet") |

### 1f. Packaging / integration with skillery

| Date | Decision | Source |
|---|---|---|
| 2026-10-08 | Process: packaging scheme → plan → implement → validate → deliver; skills move to the skillery later | DEC |
| 2026-10-08 | Package in `vault-files/2026-10-08 Sales Agent/meaningfy-sales/`, mirroring skillery layout | DEC; D/design §6 |
| 2026-10-08 | Four skills with explicit call rules (now five, `sales-accounts` added 2026-10-09); `sales-agent` orchestrates, no cycles | DEC; D/design §2 |
| 2026-10-08 | Integration with existing Meaningfy skills comes later; keep references, **duplicated if necessary**; single-owner rule applies only inside `meaningfy-sales` | DEC; X/corr R4 |
| 2026-10-08 | Skills are the operational truth; project files are history | DEC |
| design | **No agent file in the pilot** (Desktop scheduled tasks load skills); thin `agents/sales-agent.md` only on Claude Code/OpenClaw, to pin a tool allowlist without send tools | D/design §2 |
| (move recipe) | Copy `skills/*`, merge `marketplace-entry.json` and `tests/*`, PR with the two skill-change notes | X/setup "Moving to the skillery" |
| 2026-10-22 (proposal, not decided) | Ship as full plugin: `sales-agent.md` without send/delete tools, `goal-verifier` and `rule-auditor` read-only subagents, permission deny on mail send and `odoo unlink`, ask on won/lost/config, `PostToolUse` hook logging Odoo writes, `.mcp.json` for odoo + meaningfy-memory | SES 2026-10-22; D/lessons; RES |

---

## 2. Open questions, known defects, pending tasks (status at 0.6.1 / latest notes)

### Still open — owner

- Review the six commercial insights in `sales-meeting-coach/references/insights.md` (TASKS Urgent, 2026-10-10).
- **Approved price ranges** in `selling-method.md` unfilled; until then every price in a draft is ask-first (TASKS Urgent; IDX; X/setup).
- Review the 22 Oct lessons memo: hooks/permissions with the skillery move or later; "few changes" as learning signal; surprise measures in weekly review (TASKS; SES 2026-10-22; D/lessons).
- **Approve Odoo configuration for 0.4.0**: saved filters, *Deadline* activity type, Qualified stage text "five-P scored; disqualifiers checked"; also a "Not a sales deal" lost reason (TASKS; D/design §11 status; SES 2026-10-10).
- Optional: paste the version-free scheduled-task prompts into the three tasks (TASKS).
- Delete old test files in `PKG/tests/` (`run_tests.py`, `write_policy_cases.yaml`, `ownership.yaml`, `trigger_probes.yaml`, `behaviour_cases.yaml`, `tool_inventory.yaml`) — still present on disk (TASKS; verified `ls PKG/tests`).
- Planted-instruction mail test in live runs (TASKS Waiting; X/valid "Not yet tested live").
- Optional: drag eight history notes into `history/` (TASKS).
- two records left as they are at the owner's request (SES 2026-10-10).

### Still open — agent / engineering

- **Move the tests to the skillery** (part of 0.4.0, not done) (TASKS; DEC 2026-10-09).
- **Meeting-plan defect**: in open-day runs the agent announces the plan but does not write it out; failing scenario in `dossier_and_meetings.feature` (TASKS; SES 2026-10-09).
- Full behaviour run `pytest --behaviour --runs 3` never done (TASKS; SES).
- 0.5.0 behaviour scenarios (R64–R70) not run (the owner asked to wait) (TASKS; SES 2026-10-10; PKG/CHANGELOG 0.5.0).
- Behaviour scenarios for R73–R76 missing (fixed checks only) (TASKS).
- Fake Odoo connector for tool-level tests (TASKS; X/tests).
- Score and star BioTechX opportunities and partners in a supervised session; re-score ★★★ deals progressively (TASKS).
- Scheduled-task prompts in IDX still say 0.3.2/0.4.0 (IDX stale).

### Waiting / phase 2

- OpenClaw configuration (phase 2) (TASKS; D/design §1: needs an Odoo connection added to OpenClaw, a security decision on that stack).
- 10-working-day pilot traced in `04 Daily/crm-grooming-session/` (TASKS). Run notes exist 9–23 Oct.
- Authenticated approvals (INBOX change note; X/corr §5).
- Skillery ladder-term unification (INBOX change note, includes mapping question "is the Decision Package the PoV deliverable?").

### Unverified / not tested live (X/valid 0.2.0)

- Planted-instruction mail in a real run; subagents inside scheduled sessions; auditor system checks against live Gmail/Odoo. Also unverified: whether Desktop scheduled tasks and Cowork honour project hooks and permissions (SES 2026-10-22).

### Known residual risks (accepted)

- Never-tier rests on the prompt alone for sends/trash/invites on records the run did not touch (agent uses the owner's own accounts; changes are "unattributed") (X/corr §2 Accepted risk).
- Odoo connector rewrites `description` whole (reason for R74) (D/W41 C2); connector escapes HTML in notes (RUN 2026-10-09 0245 P3; RUN 2026-10-15 "double-escaped HTML").
- `action_set_won` picks another pipeline's won stage (fixed by R79) (D/W41).
- Device calendar sync creates Odoo partners under the owner's uid → auditor lists as unattributed (RUN 2026-10-23).
- Trigger collisions with generic `sales:*` / `small-business:*` plugins (X/crit #7; X/setup suggests disabling them).

### Critical review items: resolved vs. still open

- Resolved in 0.2.0 by the owner's rulings (not by the reviewers' fix): #1 tool limits and #3 restricted Odoo user were **rejected** (R1, R3); #2 approvals.md rejected (R2). Remaining safety rests on write policy + auditor + HALT (X/corr).
- `assets/prompts/` reviewer prompts still not moved to `references/` — deferred to skillery integration (X/corr C17; X/crit #19); confirmed still in `PKG/skills/sales-agent/assets/prompts/`.
- Package references external skills as `meaningfy-core:semantic-consulting-coach` and `meaningfy-core:proposal-writing` (PKG `sales-meeting-coach/SKILL.md` l.103–104, `sales-deal-dossier/SKILL.md` l.102) — **stale** against current skillery bundles (proposal-writing now in `meaningfy-sales`, semantic-consulting-coach in `meaningfy-consulting`).
- Offer ladder "usually paid" contradicts skillery's "presale is the only free stage" (X/crit #8) — unresolved; sits in the ladder change note.

---

## 3. Lessons learned and owner complaints about behaviour/outputs

### Explicit complaints / corrections by the owner

1. **Unreadable output** — "the owner could not read the W41 weekly review in Obsidian": tables without blank lines, lines merging into tables, **cells of several hundred characters**. → R71, 0.5.1: cells ≤ ~100 chars, longer findings in a list (PKG/CHANGELOG 0.5.1; PKG/REQUIREMENTS R71; INBOX/skill-change - blank line before markdown tables.md, same fault in BioTechX import notes).
2. **Answers missed** — intake answers written in another note were not read by daily runs ("yes address this") → R73 (D/W41 C1).
3. **Dossier churn** — sweep marker rewrote whole dossier → chatter note (R74) (D/W41 C2).
4. **Stale pipeline vs mail** — decisions visible in mail not reflected in Odoo; closing notes on open records → R75, R76 (D/W41 C3, C4).
5. **Measures mixed old and new records** (292-record intake hid the old pipeline) → R77 (D/W41 C5).
6. **Version pinning** in prompts and missing folders → "everything must be in the skills agent packaging in vault-files, it evolves on its own recording all the requirements" → R78 (D/W41 C6).
7. **Auditor flagged chat-approved skills work as never-tier** → R80 (DEC 2026-10-10).
8. **Unsafe unattended runs** of 0.1.1 → the owner deleted the scheduled tasks (DEC 2026-10-08; X/crit verdict).
9. **Wrong register in formal offers** (communication skill drifted conversational/pitch-like, brand messaging leaked, chat output line written into client file) (INBOX/skill-change - communication skill.md, 2026-10-22; adjacent, not the sales agent itself).
10. **Pain behind the project**: "meetings roam", "no sales and closing strategy, no right questions, no qualification process"; "the whole deal context is never in one place" (D/explore r3).

### Reviewer / self-found defects in outputs

- Dry-run draft to a prospect asked "have you put it on hold?" while the offer was 78 days overdue **on our side** → whose-turn rule (X/craft S1; X/corr C9).
- Mandatory accusation audit planted doubt in a procedural call (X/craft S7).
- Mail attached to the "better fitting" deal by guess; `sales-agent` description over 1024 chars; 4/29 trigger probes reaching generic skills (SES 0.3.2).
- 15 Oct meeting plan graded "partly met … **too long**", double-escaped HTML; reposted "one paragraph, shorter" (RUN 2026-10-15 l.143, l.166, l.181).
- Draft doubts recorded 13 Oct: time-zone line "adds confusion", presumptuous claim without reference, the second sender cc'd without introduction (RUN 2026-10-13 l.121).
- ~15 facts duplicated 3–9 times in 0.1.1 (X/crit).

### Evidence about length and decision requests (inference, flag as such)

- Daily run notes are **200–374 lines / 4,000–11,000 words** each (`wc` over RUN: e.g. 2026-10-09 = 374 lines/11,255 words; W41 review 362/11,218; 2026-10-16 341/7,159). The design asked for "one screen" (D/opmodel "How it talks back").
- After 16 Oct, every run records "**No new input from you** in the run notes" (RUN 2026-10-19 l.60, 10-20 l.54, 10-21 l.70, 10-22 l.53, 10-23 l.68). Proposals/questions sit unanswered. The one late answer is a single line on 16 Oct Q2. **Inference**: the decision-request channel (long notes, `Answer:` fields) is not working for the owner; no explicit the owner complaint about "decision requests lacking context" was found in the project folder.
- The 2026-10-09 run note itself contains a risk line "Nothing explains why Tue 13 or Wed 14 are not possible" (RUN 2026-10-09 l.323) — the agent noticing missing context in its own decision request.

### Lessons the owner/agent recorded

- Selling-method content imported from B2C one-call closing must be adapted to partner and B2G selling (X/craft verdict).
- Safety from tool removal was rejected in favour of a tested, audited write policy (X/corr R1).
- Single owner per fact inside the bundle; duplication across bundles tolerated until integration (X/corr R4).
- Saved filters as named queries; make gates deterministic (hooks/permissions) on move; learn from approvals ("drafts sent with few changes" as reward); surprise measures as health metric (D/lessons).
- Qualification was lost when method moved from the BioTechX playbook into skills → five Ps restored (D/design §9).
- Write team and stage together (deals 72/122 incident) (X/plan 1.3; SES 2026-10-08).

---

## 4. "Presales" in the owner's mind, and what the package does not cover

The project notes never use the word "presales" as a scope term. They speak of **routes to revenue** and pipeline stages. Mapping:

| Presales activity | Where it sits in the owner's model | Package coverage |
|---|---|---|
| Discovery (meetings, qualification) | Direct Consulting *Qualified → Discovery*; Consulting via Partner *Get-to-know*; MEDDPICC + five Ps; discovery conversation flow (D/odoo; D/design §9) | **Covered** (`sales-deal-dossier`, `sales-meeting-coach`) |
| Discovery workshop (paid first step) | First ladder rung, "usually paid"; agreeing it = won in Consulting via Partner (DEC; D/odoo) | Tracked as a deal; workshop **content/design not covered** |
| Demos | "demo script" in materials backlog P1 (D/backlog); demo on client data as proof (D/method §2) | **Not covered** (no demo script/material) |
| Solution design | *Solution shaping* stage: lead offer, scope outline, budget range (D/odoo) | Stage tracked; **solution/architecture design not covered** |
| Proposals | *Proposal & negotiation*; proposal walkthrough template (D/backlog); package points to external `proposal-writing` (PKG) | **Delegated** to skillery `proposal-writing`; proposal/SoW template backlog P2; general offer anatomy (tenders, FWC orders, phased pilots) proposed in a separate project (INBOX/skill-change - offer-writing skill…, project *2026-10-10 Offerings and Sales Materials*) |
| Pricing / estimation | Price ranges unfilled; rate card P2 (TASKS; D/backlog) | **Not covered** (every price ask-first); `estimation` lives in skillery |
| Tenders / calls / grants | *Calls & Tenders* (Watch → Go/no-go → Consortium & strategy → Writing → Submitted); tender etiquette; go/no-go score (D/odoo; X/corr C10) | Pipeline custody covered; **bid writing, tender watching ("exists elsewhere"), credentials pack, CVs, capability statement not covered** (D/explore r5; D/backlog) |
| Partnerships | One pipeline; partner value rubric; enablement; activation (D/design §11) | **Covered** for pipeline custody; partner one-pagers, enablement tracker, agreement templates **not covered** (D/backlog P2) |
| FWC | *FWC Execution*: need discovery → RfO → offer preparation → submitted (D/odoo) | Pipeline covered; **specific-order offer writing not covered** |
| Customer success / expansion | `sales-accounts` customer success (D/frameworks) | Covered on paper; **renewals and retainers not modelled**; not tested live (D/frameworks "Not yet") |
| Prospecting / new sources | Phase 2 (D/explore §6; D/method §9) | **Not covered** |
| Investor pipeline | Out of scope (DEC) | — |

Not covered by the package overall: sales materials (offer catalogue, ICP/personas, value propositions, case studies, capability statement, CVs, tender credentials, pitch deck, proposal/SoW template, mutual action plan template, question bank, demo script, email/LinkedIn templates beyond patterns, partner one-pagers, agreement templates) (D/backlog); pricing; bid/offer writing; tender watching; prospecting; renewals/retainers; LinkedIn (manual "Check on LinkedIn" line) (PKG/README Limits).

---

## 5. Contradictions between the draft EPIC and the notes

1. **Version status wrong.** EPIC Why: "the package is at a planned 0.4.0"; SEED: "returns into the skills (planned `meaningfy-sales` 0.4.0)". Actual: 0.4.0 implemented 2026-10-09; current 0.6.1 (2026-10-10), R01–R80, five skills (TASKS; PKG/CHANGELOG; PKG/marketplace-entry.json).
2. **Where the agent evolves.** EPIC DEC-1: "package's own 0.x line ends at integration". Owner decision 2026-10-10 (W41-C6, R78): "the package in vault-files is the **single place where the agent evolves and records its requirements**"; scheduled tasks read skills from that folder at any newer version; R80 lets the agent edit the package in working sessions (DEC; D/W41). Moving truth to skillery breaks the self-evolving loop and the scheduled-task read path unless the owner re-decides.
3. **Agent files / type.** EPIC DEC-2: agent of type `scheduled` with `lead`-style interactive mode; Impact "agents/ (+1–2)". Notes: "**No agent file in the pilot.** Desktop scheduled tasks load skills, not agents"; a thin agent only on Claude Code/OpenClaw to pin a tool allowlist (D/design §2). The 22 Oct proposal (undecided) adds `goal-verifier` and `rule-auditor` read-only subagents, permissions and a `PostToolUse` hook (SES 2026-10-22; D/lessons). The EPIC does not mention the three reviewer prompts (goal verifier, guardrail auditor, recipient reader) or the pending hooks/permissions decision.
4. **Tests "non-executing".** EPIC outline 2: "wire them into `make test` as non-executing spec tests unless a runner exists". A runner exists: pytest-bdd step definitions, 366 fixed checks, opt-in behaviour tests via `claude -p` with judge (PKG/tests; X/tests; DEC 2026-10-09). Non-executing would drop the owner's decided test mechanism.
5. **Safety rules incomplete / misframed.** EPIC DEC-6 lists five lines. The owner's policy is a three-tier `write-policy.yaml` (do-and-log / ask-first / never), HALT, system-level auditor, rule zero entity resolution, ≤5 creations per run, commitments ask-first, never `mt_comment`/notify, skills-maintenance exemption (X/corr §2; DEC). "Every open deal has a next activity" has a decided exception: the 228 BioTechX cold-list leads (DEC W41-P2).
6. **SPEC bulk-import scenario.** SPEC: on a bulk import request the agent "refuses … and returns the contacts for review, one record at a time". Owner decision: no bulk import, **intake session** (scout, research, plan, the owner's yes, execute, audit, report), which ran on the 292-record BioTechX intake (DEC 2026-10-09; D/W41 C5). `import_records` is never-tier (X/corr §2). The scenario should be the intake procedure, not a refusal.
7. **Follow-up "event-origin tagging beyond a simple tag".** EPIC Impact. Owner decided 2026-10-09: event tag + source/medium; **campaigns and lead-source cards not used** (DEC). The follow-up reopens a closed decision.
8. **Dedupe direction vs owner's terms.** EPIC DEC-5: consulting keeps advice, sales keeps procedure. Owner: integration later, duplication allowed (X/corr R4), and **skillery should adopt the owner's ladder terms** (INBOX/skill-change - unify…). The EPIC does not carry the ladder-term change or the "usually paid" vs "presale is the only free stage" conflict (X/crit #8).
9. **Bundle membership of neighbours.** EPIC outline 3 / What Changes call `proposal-writing` a consulting skill; the EPIC's own Depends-on says `rebundle-by-activity` put `proposal-writing` and `estimation` in `meaningfy-sales`. Package references `meaningfy-core:…` names that are stale (PKG SKILL.md lines).
10. **Role framing "Sales/Presales hat".** EPIC outline 1. Owner scope is all routes to revenue **plus customer success after the win** (DEC 2026-10-09/10). The single new capability `sales-pipeline-custodianship` covers neither customer success, dossier/research, meeting coaching nor the selling method.
11. **Unsourced seed decision.** SEED: "invite to book via the human's Koalendar link … general brochure and Mapping Workbench brochure". Not found in project notes or package (grep). Possibly from the BioTechX project (RUN W41 mentions "booking link"). Verify before treating as decided.
12. **Lead/opportunity wording.** SEED: "cold = lead; a meeting or positive interaction = deal". Owner: "lead until a **two-way positive signal**; then opportunity (agent converts with the signal cited); lost on refusal or after the chase, **on the owner's yes**" (DEC 2026-10-09). Close, but the EPIC drops "on the owner's yes" for lost.
13. **Missing open work.** EPIC does not mention pending Odoo configuration approval (saved filters, *Deadline* type), the failing meeting-plan scenario, unrun behaviour suites, or the planted-mail live test (TASKS) — relevant if "tests are the acceptance criterion" (DEC-4).

Consistent with notes: Desktop runtime, no servers, OpenClaw later (DEC); Odoo as memory (DEC); no LinkedIn Navigator (DEC); no sales materials in scope (DEC); Challenger, five-P, 48 Laws/MICE rejection (DEC); cc rule (DEC 2026-10-10).
