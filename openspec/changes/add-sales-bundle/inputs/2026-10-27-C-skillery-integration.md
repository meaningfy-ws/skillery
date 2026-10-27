# C — Where the sales package lands in skillery (integration map)

Read-only survey of `develop` @ 1569728 (released v3.4.0, `VERSION` = 3.4.0), 2026-10-27.
Package under import: skills `sales-agent`, `sales-accounts`, `sales-meeting-coach`, `sales-pipelines`,
`sales-deal-dossier`; scheduled tasks open-day / close-day / weekly-review; Odoo CRM + mail + vault;
five-P / MEDDPICC qualification; Hormozi / Robbins / Voss selling; customer success.

---

## 1. What exists today — owners, boundaries, collision or reuse

### 1.1 `meaningfy-sales` (bundles.yaml)

```yaml
- name: meaningfy-sales
  description: "The commercial role: proposal and offer writing, and estimation"
  skills: [proposal-writing, estimation]
  agents: [proposal-writer]
  requires: [meaningfy-consulting]
```

| Member | Owns (Boundary section) | Delegates / Related | Facets | Collision / reuse with the package |
|---|---|---|---|---|
| `skills/proposal-writing` (refs: proposal-template, sow-template, scope-boundary-checklist) | proposal + SoW production; the in/out scope-boundary discipline; fixed-frame + stop/extend mechanics. Description also says it "**qualifies the need**" (entry skill of the front-of-funnel) | pricing → `estimation`; framing → `executive-communication`; P1 deliverable → `decision-package`; free→paid line → `semantic-consulting-coach` | proposals / sales / semantic-data / profiled / sell / stable | **Collision:** "qualifies the need" overlaps five-P qualification. **Reuse:** `sales-deal-dossier` should feed it (hand-off), never write proposals. "Provisional pending first-engagement gate". |
| `skills/estimation` (refs: estimation-checklist, pert-worksheet) | PERT + WBS + ranges + assumptions/exclusions + contingency | SoW wrapper → `proposal-writing`; sequencing → `decision-package` | offers / sales / generic / reusable / sell / stable | No collision. Hormozi "value stack"/price anchoring would touch *pricing strategy*, which `proposal-writer` refuses and UC-W12 parks — not estimation. |
| `agents/proposal-writer.md` | `type: delegated`, sonnet, tools Read/Grep/Glob/Write/Skill; skills proposal-writing, estimation, executive-communication. Refuses sending, pricing below estimate, pricing strategy alone | test `tests/features/agents/proposal-writer.feature` | proposals / sales / … / experimental | **Reuse:** the sales agent hands a qualified deal + dossier to it (UC-W7 → UC-W8). Pattern to copy for the new agent's Refuses. |

### 1.2 `meaningfy-consulting` (required by `meaningfy-sales`)

| Skill | Owns | Does not own / delegates | Collision / reuse |
|---|---|---|---|
| `semantic-consulting-coach` (refs: engagement-lifecycle, engagement-model, presales-discovery, question-bank, decision-phase-posture, semantic-consulting-domain) | coaching frame for the engagement process, cognitive states, boundary-holding, coaching modes; scope includes "pricing, partnering, B2B sale or B2G tender, **negotiation**" decisions | the commercial model (stages, free→paid boundary, D&O tiers, Semantic Layer blocks) is company fact owned by `references/engagement-lifecycle.md`; framing → `executive-communication`; deliverable → `decision-package`; "Proposal/SoW and effort sequencing are sales hand-offs" | **Major collisions:** (a) `references/presales-discovery.md` is a pre-sales **qualification sheet** (A/B/C questions; internal decision De-prioritise / Deepen discovery / Introduce Decision Phase; boundary "is this relevant?" → "what should we do?") — overlaps five-P/MEDDPICC and `sales-meeting-coach`; (b) negotiation decisions overlap Voss (UC-W13 open point); (c) `engagement-lifecycle.md` §Repeat clients says **Sales/Presales leads the repeat-client relationship** (= customer success) and §Known gaps lists *Qualification, Pre-sale nurture/cadence, Sale/closing, CRM & lead communication, Fit-for-market* as unshaped — the package closes several. **Reuse:** the meeting coach and qualification must cite engagement-lifecycle (stages, boundary) and the services catalogue, never restate. |
| `decision-package` | produces the Decision Package + Deep-tier discovery flow | coaching → coach; framing → exec-comm; SoW → `proposal-writing` (sales hand-off) | Low collision. Deal dossier must not become a mini decision package. |
| `executive-communication` | persuasive method (Governing Thought, SCQA, Minto, answer-first); description includes "**email or Slack note**", "client recommendation" | prose → `technical-writing`; voice → `meaningfy-voice` | **Collision:** outreach email structure. Sales skills should own *cadence/content rules* (booking link, slot, cc, re-contact date) and cite exec-comm/voice for structure and tone. |

### 1.3 `meaningfy-core` writing family

| Skill | Owns | Relevance |
|---|---|---|
| `meaningfy-voice` | company voice profile (British English, no em dash, SMILE, register teach/persuade/bind). `references/channels/` has **offer.md, linkedin.md, blog.md, internal-message.md — all 3-line "Planned" stubs**; no email/outreach channel | **Collision/decision:** the package's "predefined email style" should become a channel profile here (UC-W7 open point; future-features row `add-content-creation`) or stay in the sales package. Single-owner rule favours a `channels/outreach-email.md` in voice. |
| `technical-writing` | docs, docstrings, summaries | Only for docs pages in the change. |
| `explanatory-writing` | Explanation-quadrant texture | Not relevant to sales procedure. |
| `writing-antipatterns` | genre map + inversion matrix; genres incl. Decision, Contract, Coaching dialogue | Related-skill for the meeting coach (coaching genre) and outreach; cite, do not restate. |

Note `tests/ownership.yaml` (single-owner tripwire) has no sales capabilities; new tags (e.g. `five-p-score`, `crm-write-policy`) belong there.

---

## 2. Docs, use cases, register, facets

### 2.1 `docs/practice/ai-sales/` (all read)

| File | Content | Integration |
|---|---|---|
| `sales-runbook.md` | 4 stages (Presale, D&O Light/Deep, Contracting & hand-off, Repeat-client) — each a link into `engagement-lifecycle.md` + RACI; "restates neither" | Add pointers per stage to the sales bundle skills (daily grooming, qualification, account nurture). Must not restate skill rules. |
| `sales-dod.md` | Shipper's contract-conformance DoD (request for offer, offer, contract, minutes); human sign-off, agent-assisted trail | Deal dossier could assemble the trail; no collision. |
| `playbooks/sales-presales.md` | role view: stages, "Skills you invoke" = coach, proposal-writing, exec-comm only | Add the new sales skills/agent. |
| `semantic-layer-services.md` | pointer to services catalogue | Fit criterion for five-P "Fit" (UC-W9 precondition). |
| `services/index.md` + 6 pages | sellable catalogue; 4 of 6 blocks have no owning skill; prices not invented | Fit/offer reference for outreach and qualification. |

### 2.2 `docs/practice/roles-and-raci.md`

- Sales/Presales mandate: presale qualification & relationship (free), commercial lead of D&O (A), partnership/account-nurture (A/R). Skills drawn on: coach, proposal-writing, exec-comm. Artifacts: qualified opportunity, proposal/SoW co-ownership, **account-nurture cadence**.
- RACI: Presale A/R; D&O Light/Deep A; Partnership/account nurture A/R (Shipper I).
- **Customer Success Manager folded into Sales/Presales account-nurture** (adaptation note) → the package's customer success has a documented home.
- **Stale/conflicting:** "Open question: agent wrappers" says roster stays `epic-planner`, `implementer`, `code-reviewer`, documentation-only, no agent for other roles until exercised on a real engagement. Already outdated (`proposal-writer`, `system-architect`, `conceptual-modeller` exist); a sales agent needs this section updated (it *has* been exercised — the pilot).

### 2.3 Use cases (area `sales`: 0 covered, 2 partial, 5 missing)

| UC | Status / change | Served by | Open Points the EPIC should close or explicitly hand off |
|---|---|---|---|
| UC-W7 Sales assistant | partial / `add-sales-bundle`; served_by empty | — | (1) one agent with modes vs custodian/researcher/groomer/drafter under a lead; (2) which safety rules via `guardrails` vs dispatch-contract lines; (3) where the predefined email style lives (sales package vs `meaningfy-voice` channel, UC-W24). Confidence medium; package "not yet in inputs/". Artefacts/Evidence promise `tests/features/sales/` and a `sales-assistant` agent. |
| UC-W8 Proposals & offers | partial / `add-commercial-chain` | proposal-writer, proposal-writing, estimation, decision-package, exec-comm | PDF toolchain/template; who may approve a price (owner vs salesperson in band). Not the sales EPIC's, but the deal dossier→proposal hand-off touches it. |
| UC-W9 Qualify leads & partnerships | missing / `add-commercial-chain` | — | **"Does the five-P skill from the sales package own qualification for UC-W7, W9, W10 (one method, three variants), or does `add-commercial-chain` own it?"**; partnership criteria. The import decides the first. |
| UC-W10 Qualify prospect in a conversation | missing / `add-commercial-chain` | — | **Same agent as UC-W9 or a mode of UC-W7?**; live support during a call and transcript source. `sales-meeting-coach` + MEDDPICC directly serve this. |
| UC-W11 Market research | missing / `add-commercial-chain` | — | markets first; where the brief lives; allowed sources (no paid data). Out of import scope. |
| UC-W12 Commercial structure & offer | missing / `add-commercial-chain` | — | does the structure replace/extend engagement stages + services catalogue (HQ-08.1); contents; where offer-design materials are. MSS step 5 names **Hormozi, Robbins** → collides with package selling method. |
| UC-W13 Negotiation partner (area business) | missing / `add-commercial-chain` | — | extend `semantic-consulting-coach` or separate partner; authors beyond **Voss**, Greene, Sun Tzu ("Greene used only to read motives, as decided for the sales agent"); where briefs are kept. |
| UC-W21 Demo builder (pre-sales) | missing / `add-demo-builder` | — | stack/domain/hosting; reuse location. Out of import scope; presales neighbour. |
| UC-W22 Advisory engagement (consulting) | partial / `add-advisory-agent` | coach, decision-package, exec-comm | hands back to sales (UC-W10) and to sales for a build offer (8a). |

Validator facts (tools/repo_lint/lint.py): `use_case_catalogue` (served_by names must exist), `use_case_coverage` (**every skill and agent must appear in some use case's served_by** — all 5 new skills + agent must be added, UC-W7 at least, likely W9/W10), `docs/use-cases.md` is generated (`make skill-inventory`), future-features ↔ partial/missing check.

### 2.4 `docs/future-features.md` sales rows

| Feature | Change | Note |
|---|---|---|
| Sales agents and CRM — UC-W7, `sales-assistant` (scheduled), skills "CRM grooming, deal and contact management", material in hand outside repo | `add-sales-bundle` | Agent name `sales-assistant` ≠ package's `sales-agent` skill. |
| Commercial chain — UC-W8 PDF, W9–W13; agents `qualifier`, `market-researcher`, `offer-designer`, `negotiation-partner`; material **no** | `add-commercial-chain` | **No change directory exists** (per the rule "a change only when material is in hand"). The package now brings qualification (five-P/MEDDPICC) and selling-method material (Hormozi/Robbins/Voss) — material for this row. |
| Demo builder | `add-demo-builder` | presales neighbour. |
| Content creation & voice channel profiles (incl. offer) | `add-content-creation` | email-style home. |
| Odoo memory skill — "how to store and find things in Odoo" | `add-odoo-memory-skill` | **Overlaps** the package's Odoo-as-memory (DEC-3) and `sales-pipelines`. |
| Config items; Agent aspects (runtime, memory, dependency, tool-policy) | `add-config-items`; `extend-agent-template` | hooks/permissions and runtime needs of the scheduled agent. |
| Open question HQ-08.1 (the commercial layer is unshaped) | — | the package partly answers it. |

### 2.5 `docs/development/catalogue-architecture.md`

- Target structure row: `meaningfy-sales` **(planned)** — stale (it exists since v3.3.0); planned agents `sales-assistant`, `qualifier`, `offer-designer`, `proposal-writer`, `demo-builder`; requires `meaningfy-consulting`.
- Agent roster: only `proposal-writer` for sales; add the sales agent row (`scheduled`).
- Model classes still planned: **Runtime** (`extend-agent-template`), **MemoryStore** (`add-odoo-memory-skill`), ConfigItem beyond hooks (`add-config-items`). The sales agent is the first consumer of all three.
- Area `sales` ↔ domain `ai-sales`.

### 2.6 `facets.yaml` fit

| Facet | Values that fit | Gap |
|---|---|---|
| purpose | `crm` (pipelines, accounts, sales-agent, dossier), `offers` (Hormozi-style offer), `proposals` (hand-off only), `advising` (meeting coach? no — client advising) | no value for *selling conversations / coaching the seller* or *customer success*; use `crm` or add one line (e.g. `selling`) |
| area | `sales`; Voss/negotiation sits in `business` per UC-W13 | — |
| subject | `generic` (selling method), `semantic-data` (Meaningfy offer) | no `crm`/Odoo subject |
| posture | `precise` (CRM write policy = house standard), `profiled` (meeting coach) | — |
| stage | `sell` | no post-sale/relationship stage for customer success (use `any` or add a value) |
| maturity | `experimental` | — |

---

## 3. Agent standard (docs/development/agent-template.md)

- Types (`tools/opencode-agent-map.json` `agentModes`): **`delegated`, `lead`, `scheduled`** only — no "worker" type.
- `scheduled` contract must state: triggers; where it writes its run record; that writes are **logged and reversible**; description says `Not for delegation`.
- D-17 composite: a `scheduled` agent may be started interactively; Input lists `schedule: …` and `human session`; one job, one contract; may ask questions only in a human session.
- Frontmatter allowlist (name, description, type, model alias, tools list, skills, disallowedTools, color, metadata). `memory`, `hooks`, `mcpServers`, `permissionMode` are forbidden/not adoptable (plugin-ignored).
- Body ≤ `MAX_AGENT_BODY_LINES = 40` — kept at 40 specifically for the sales scheduled composite (archived design D-10).
- Agent lives in the one bundle listing its **primary skill** (first local skill).
- Tests: `tests/features/agents/<name>.feature`, Background naming every skill, ≥1 Scenario Outline + Examples. (Draft says `tests/features/sales/` — off-standard path for agent tests.)
- "Deterministic before prose": refusals enforceable by `tools`/`disallowedTools` must be (no Gmail send, no `unlink`).

Recorded gaps (`docs/environment/dual-cli/mapping.md`):

| Gap | Text | Impact on sales |
|---|---|---|
| G-4 | **Claude Desktop / Cowork scheduled tasks load skills, not agent files**; a `scheduled` agent needs an external scheduler (`claude -p --agent meaningfy-<bundle>:<name> "<prompt>"`) | The pilot's open-day/close-day/weekly-review run as Desktop scheduled tasks → they invoke **skills**; an agent file does not run there. DEC-2 must pick: scheduled skills on Desktop, or external cron + `claude -p --agent`. |
| G-5 | opencode has no scheduler; `scheduled` renders `mode: subagent` + gap | accepted per DEC-2. Archived design risk row: "`opencode run --agent` may refuse a subagent-mode agent — `add-sales-bundle` verifies on first use and changes `agentModes.scheduled` in its own delta". |
| G-6 | Claude `tools` allowlist not restrictive on opencode; only `disallowedTools` | send/delete denial must use `disallowedTools`. |
| G-1/G-2 | lead auto-delegation; `--agent` tools restrict the human session | relevant to the interactive mode. |

Precedent: `skills/vault-setup/references/scheduler.md` (cron/launchd, `--permission-mode acceptEdits`, `--disallowedTools` for mv/rm, run log outside the vault) — reusable pattern for the sales scheduled runs.
External deps: `dependencies.yaml` already has **Odoo** (odoo-mcp-multi) and Google Workspace is in `mcp-setup.md`; `used_by` must name the sales skills/agent.

---

## 4. Archived and open EPICs touching sales

| EPIC | What it says for this import |
|---|---|
| `archive/2026-10-26-rebundle-by-activity` | DEC-1 bundles by **activity** (exists only when it holds something); DEC-2 created `meaningfy-sales` now, the package "joins it through `add-sales-bundle`, which owns their deduplication"; DEC-3 every skill/agent serves a use case. Shaping Q3 (owner quote). |
| `archive/2026-10-26-agent-authoring-standard` | D-17 composite and D-10 40-line cap made for sales; risk row: verify `opencode run --agent` on subagent mode; task 8.2 fixed the draft's capability name. Input `2026-10-22-claude-code-project-structure-impact.md` §4: **`meaningfy-sales` 0.5.0** in `vault-files/`, runs as Desktop scheduled tasks, no agent file; write policy (logged, reversible; never send/delete; won/lost needs the owner's yes) is prose in `sales-pipelines`; recommends a full plugin: `sales-agent` `disable-model-invocation`, `sales-pipelines` as base skill, agent with no send/delete tools, `goal-verifier` + `rule-auditor` read-only reviewers, hooks (deny Gmail send / odoo unlink; PostToolUse audit to run note; Stop hook needs Verification), `.mcp.json`. Several of these (hooks in agent, mcpServers) are **not adoptable** under the standard; use `hooks.yaml`/install docs. |
| `archive/2026-10-26-fix-accumulated-skill-defects` | **SO-3** shaped out to `add-sales-bundle`: approvals the agent cannot forge (separate approvals file/channel, dedicated Odoo user) + blank lines in sales run-note templates; "record the approvals as an accepted risk there". **SO-1** `add-offer-writing` (general offer-writing skill, proposal-writing as its Decision Phase shape) — collides with Hormozi offer material. **SO-2** sales-ladder rename (Light→Discovery workshop, Deep→Proof of Value, build→Scaling) owned by `define-blc-engagement-model` — sales skills must use whichever terms are current. |
| `archive/2026-10-26-restructure-and-evaluate-catalogue` | Commercial chain (owner-confirmed): market → commercial structure → qualification → proposal → negotiation → contract (W11→W12→W9/W10→W8→W13→W16); "qualification appears three times: one method, three variants, not three agents"; wave 1 = `add-sales-bundle`, wave 2 = devops + commercial chain. |
| `archive/2026-10-26-define-catalogue-model` | sales/devops land after it; overlaps to reconcile: `add-sales-bundle` items 5 (Hormozi-style offer, packaging, pricing) and 7 (CRM agents); SO-1 `offer-writing` (5, 6). |
| `archive/2026-10-26-skill-crafting-method`, `single-source-distribution` | the package is built to the current method; bundle rule. |
| Open `define-blc-engagement-model` | owns stages/terminology; Known-gaps table (presale process, demo prep, **CRM/lead skill**, strategic negotiation…). |
| Open `define-roles-and-raci`, `define-ai-domains`, `define-lifecycle-playbooks` | implemented in docs but unarchived; own the role/playbook pages the import edits. |
| `add-commercial-chain` | **does not exist** under `openspec/changes/` or archive — only a future-features row and the `change:` field of UC-W8…W13. |

---

## 5. Draft `openspec/changes/add-sales-bundle/` — decisions, open items, staleness

Contents: `proposal.md` (122 lines), `inputs/README.md`, `inputs/2026-10-25-session-findings.md` (secondary, never groomed), `specs/sales-pipeline-custodianship/spec.md` (2 scenarios: bulk import refused; search before create). No design/tasks (by no-go). **The package itself is not in `inputs/`.**

### Decisions

| DEC | Statement |
|---|---|
| DEC-1 | `meaningfy-sales` is a **role bundle**, versioned with the catalogue; the package's 0.x line ends; its changelog imported to inputs |
| DEC-2 | Runtime stays Claude Desktop + scheduler; agent `type: scheduled` with lead-style interactive mode; opencode gap accepted |
| DEC-3 | Odoo is the memory; skillery holds no CRM data; skills: five-P (Pain, Priority, Power, Plan, Fit), **Challenger**, lead→opportunity on two-way signal |
| DEC-4 | Tests are the acceptance criterion (Gherkin in skillery referencing installed skills) |
| DEC-5 | Dedupe: consulting keeps the *advice*, sales keeps the *procedure* |
| DEC-6 | Pilot safety rules become dispatch-contract lines (no bulk import, search before create, next activity on every open deal, nothing risky/irreversible, both senders in cc) |

### Open items

- Findings §3: one agent with modes vs several agents under a lead; which Odoo safety rules become `guardrails` vs contract lines.
- UC-W7's three open points (above); UC-W9/W10 qualification ownership.
- Inputs: package to be dropped; PLAN not derived until present.
- Named follow-ups: server/OpenClaw deployment; event-origin tagging; BioTechX / Future Labs Live lead sources.
- Unrecorded but owed: SO-3 approvals accepted risk; G-5 opencode verification (`agentModes.scheduled`).

### Stale or inconsistent against the repo

| # | Draft says | Repo now |
|---|---|---|
| 1 | package "at a planned 0.4.0" | archived input records **0.5.0** (2026-10-22); package scope now 5 skills + 3 scheduled tasks |
| 2 | Solution 1 / DEC-1: "Declare `meaningfy-sales` … as a **role bundle** (per define-roles-and-raci)" | bundle already declared (v3.3.0) with proposal-writing, estimation, proposal-writer; bundles are **by activity** (rebundle DEC-1). What Changes already says "existing entry" — internal contradiction |
| 3 | Solution 3: dedupe against "the consulting bundle: coach, **proposal-writing**, exec-comm" | `proposal-writing` + `estimation` moved to `meaningfy-sales`; dedupe now spans two bundles + `meaningfy-voice` |
| 4 | DEC-3 method = five-P + Challenger | package adds **MEDDPICC, Hormozi, Robbins, Voss, customer success**; Hormozi/Robbins are UC-W12 (offer-designer), Voss UC-W13 (negotiation-partner), both `add-commercial-chain`; rabbit-hole "do not redesign the sales method" and "do not produce sales materials" need re-scoping |
| 5 | no mention of `add-commercial-chain` / UC-W9, W10 | UC-W9/W10 open points ask this EPIC to decide qualification ownership; the chain EPIC does not exist |
| 6 | DEC-2 "Desktop + scheduler", `type: scheduled` | G-4: Desktop scheduled tasks load **skills not agents**; runtime contract unresolved |
| 7 | Tests in `tests/features/sales/…`, "wire into `make test`" | standard: `tests/features/agents/<name>.feature`; validator checks shape only; scenarios run by hand. Outcome evals live in `tests/evals/<bundle>/` (UC-W9/W10 cite `tests/evals/meaningfy-sales/`, which does not exist) |
| 8 | Capabilities: `dual-cli-generation` "no new bundle", `catalogue-governance` | both specs exist (`openspec/specs/`); agent-authoring rename fix applied (task 8.2). Missing: `external-dependency-register` (Odoo/Gmail used_by), `catalogue-architecture` (roster/target) |
| 9 | What Changes: "README: one bundle row" | row exists (README l.39); it needs extending, plus "I want to…" rows |
| 10 | "each tagged `purpose: crm`" | meeting coach / customer success don't fit `crm` cleanly; `stage` lacks post-sale |
| 11 | Golden thread refs `docs/ai-sales/`, `docs/roles-and-raci.md` (findings §2 at v2.11.0) | now `docs/practice/ai-sales/`, `docs/practice/roles-and-raci.md`; `scheduled` type now exists (findings are secondary/never groomed — fine as input, but the proposal must not lean on them) |
| 12 | Order "after `add-devops-bundle`" | devops is still an untracked draft; sequencing would block the sales import with no reason left (the standard already shipped) |
| 13 | No SO-3 | SO-3 explicitly routed here as an accepted risk |
| 14 | Agent name unspecified | future-features/UC-W7/catalogue-architecture say `sales-assistant`; package skill is `sales-agent` — pick one, avoid skill/agent name confusion |

---

## 6. Integration touchpoints (checklist for the PLAN)

| Touchpoint | Change |
|---|---|
| `bundles.yaml` | add 5 skills + agent(s) to `meaningfy-sales`; update description; keep `requires: [meaningfy-consulting]` (Delegates edges to coach/exec-comm checked by `bundle_requirements`); `meaningfy-voice` is core (implicit) |
| `make bundles` | regenerates `.claude-plugin/marketplace.json`, `bundles/`, `tools/opencode-catalogue.json`, `package.json` version |
| `skills/sales-*/SKILL.md` | six facets; `## Boundary & Related Skills`; strict YAML; CLI-agnostic bodies (no Desktop/`.claude/` paths; vault path `04 Daily/crm-grooming-session/`, Koalendar link and named people are config, not method — consider `add-config-items`) |
| `agents/<sales-assistant>.md` | `type: scheduled`, `Not for delegation`, ≤40 body lines, `disallowedTools` for send/delete, primary skill in `meaningfy-sales` |
| Existing skills edits | `semantic-consulting-coach` (presales-discovery vs five-P; engagement-lifecycle Known gaps; Related → sales skills); `proposal-writing` ("qualifies the need" wording; Related); `executive-communication`, `meaningfy-voice` (email channel) as decided; `tests/ownership.yaml` new tags |
| Use cases | UC-W7 served_by + status (→ covered/partial), Open Points answered; UC-W9/W10 served_by/change/open point (qualification owner); UC-W12/W13 if Hormozi/Robbins/Voss land; `make skill-inventory` regenerates `docs/use-cases.md` + `docs/skill-inventory.md` |
| `docs/future-features.md` | update `add-sales-bundle` row; trim/redefine `add-commercial-chain`; relate `add-odoo-memory-skill`, `extend-agent-template`, `add-content-creation` |
| `docs/development/catalogue-architecture.md` | drop "(planned)" on `meaningfy-sales`; roster row for the scheduled agent |
| `docs/practice/ai-sales/` | runbook + `playbooks/sales-presales.md` pointers to new skills; `docs/practice/roles-and-raci.md` skills-drawn-on + agent-wrapper open question |
| `docs/environment/dual-cli/` | `mapping.md` gaps G-4/G-5 confirmed or `agentModes.scheduled` changed; `dependencies.yaml` Odoo/Google `used_by`; scheduler how-to (reuse vault scheduler pattern) |
| `hooks.yaml` | if audit/deny hooks adopted (intent single-sourced, rendered per CLI) |
| Tests | `tests/features/agents/<agent>.feature`; `tests/trigger_probes.yaml` positive + near-miss per new description (near-misses vs proposal-writing, coach, exec-comm); optional `tests/evals/meaningfy-sales/`; `make validate` green |
| README / CHANGELOG / VERSION | bundle row + "I want to…" rows (groom pipeline, qualify a lead, prepare a meeting); installer-facing CHANGELOG line; MINOR bump |
| `openspec/changes/add-sales-bundle/` | re-shape proposal (items in §5), add package to `inputs/`, spec delta for custodianship (+ scheduled run record, approvals risk) |
