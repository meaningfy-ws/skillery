# Assessment: sales-pipeline-custody
Before: body 15496 bytes, references 28062 bytes. After: body 13330, references 23099.

Measured with `lean_check.py` (the lint's own body). Total 43558 → 36429 bytes: **over the 24576
budget after honest sorting**; an `over_budget` entry is recommended (see the end). Line numbers are
those of the files before the rewrite. Seven reference files became three: the five `route-*.md`
files merged into `routes.md`, `lead-sources.md` merged into `odoo-crm-conventions.md`.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title + intro, l. 14-20 | keep / drop | body title + bias sentence | the list of calling skills dropped (Boundary names them) |
| 2 | § Quick Start, l. 22-36 | keep | body Quick Start | pointer to write-rules moved to Rules |
| 3 | § Workflow, l. 38-45 | keep | body Workflow | |
| 4 | § Write rules, l. 47-53 | keep | body Rules, *Write rules*: two pointer sentences (write-rules, odoo-crm-conventions) + the tiers | |
| 5 | § The five pipelines, table, l. 55-63 | keep | body Rules | "Route file" column replaced by one pointer to `routes.md` |
| 6 | § The five pipelines, data sentence, l. 65 | keep | body Rules | |
| 7 | § Placing a deal, l. 67-75 | keep | body Rules | wording tightened |
| 8 | § Leads and opportunities, l. 77-91 | keep | body Rules | badge/handshake examples kept; "it can merge and create contacts" reason → odoo-crm-conventions (already there) |
| 9 | § The offer ladder in Odoo, l. 93-99 | keep / owner | body Rules; the ladder itself → `semantic-consulting-coach` (already cited) | |
| 10 | § Rot and exit criteria, l. 101-108 | keep | body Rules (heading kept: CHK-98 cites it) | |
| 11 | § Stars, l. 110-127 | keep | body Rules (heading kept: CHK-97, `five-ps.md`, dossier template, `odoo-views.yaml` cite it) | route-file links → "route Partnerships / Calls & Tenders" (sections of `routes.md`) |
| 12 | § Next actions, l. 129-137 | keep | body Rules (heading kept: goal-loop, run-types, `odoo-views.yaml` cite it) | `action_feedback` detail → odoo-crm-conventions (already there) |
| 13 | § Closing dates, l. 139-143 | keep | body Rules | "a guess early in a deal" reason dropped (restates the rule) |
| 14 | § Attention filters, l. 145-149 | keep | body Rules | the per-filter field list dropped (the YAML shows it) |
| 15 | § Lead sources, l. 151-158 | keep | body Rules (short) + `odoo-crm-conventions.md` § Lead sources | |
| 16 | § Reading and writing Odoo, l. 160-162 | keep | body Rules, pointer sentence | |
| 17 | § Objective and acceptance criteria, l. 164-176 | keep | body *Before you hand over* (the goal verifier reads it; CHK-94) | kept as Work item / Acceptance criteria, not the Quick diagnostic form: its rows are the verifier's criteria |
| 18 | § Gotchas, l. 178-186 | keep | body *Common mistakes* table | |
| 19 | § Boundary & Related Skills, l. 188-203 | keep | unchanged | matrix line unchanged |

## references/write-rules.md (8833 → 8717)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 20 | Intro, § 0 entity resolution | keep | unchanged | |
| 21 | § 1 the write policy, intro paragraphs | keep | merged into one paragraph | |
| 22 | § 1 tier-reading bullets (CHK ids, `odoo-*` ids) | keep | unchanged | "Tier by effect, not by tool" kept (ownership tag `crm-write-policy`) |
| 23 | § 1 Activities bullet, last sentence (every record keeps an activity) | drop | — | repetition of body *Next actions* |
| 24 | § 2 Log, § 3 owner's input, § 4 HALT, § 5 content, § 6 unreachable | keep | unchanged | |

## references/odoo-crm-conventions.md (6204 → 6918, absorbs lead-sources)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 25 | Models and fields table, read rules, whole-chatter rule | keep | unchanged | |
| 26 | How to write: internal note "anything that notifies a person is a send" | drop | — | repetition of write-rules § 1 Notes |
| 27 | How to write: next activity "Hard deadlines use the activity type Deadline" | drop | — | repetition of body *Next actions* |
| 28 | How to write: stars "do not write; report the difference" | drop | — | repetition of body *Stars* (the owner's stars win) |
| 29 | All other How-to-write bullets (team+stage, won stage, conversion, entity resolution, old values) | keep | unchanged | |
| 30 | § Logging | keep | unchanged | |

## references/lead-sources.md (1519, deleted)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 31 | Intro (where a lead came from carries context) | drop | — | "why" restating the rule |
| 32 | Source / medium / event tag / campaign table | keep | `odoo-crm-conventions.md` § Lead sources | |
| 33 | Context lives in the vault, once | keep | body *Lead sources* | |
| 34 | Rules: unknown stays empty; existing values do, new ask; approved intake plan; triage proposal | keep | body *Lead sources* (tiers) + `odoo-crm-conventions.md` § Lead sources | |

## references/route-*.md (11506, five files deleted → routes.md 7464)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 35 | Every route's stage table ("Typical agent work") | drop | — | repetition of the *In this stage / Exit when* text in `assets/pipelines.yaml`; the one extra fact (go/no-go "within 3 days", partner commercial model at the get-to-know meeting, check against every requirement) kept in `routes.md` |
| 36 | Every route's "Days to rot: pipelines.yaml" line | drop | — | repetition; `routes.md` intro says it once |
| 37 | Route intros (what the pipeline holds) | drop / keep | body pipelines table; Partnerships tag definitions and "our buyer is the partner" kept in `routes.md` | |
| 38 | Direct Consulting specifics | keep | `routes.md` § Route: Direct Consulting | |
| 39 | Consulting via Partner: partner etiquette, specifics | keep | `routes.md` § Route: Consulting via Partner | |
| 40 | Calls & Tenders: tender etiquette, go/no-go score table, specifics | keep | `routes.md` § Route: Calls & Tenders (CHK-97 path updated) | |
| 41 | FWC Execution specifics | keep | `routes.md` § Route: FWC Execution | |
| 42 | Partnerships: tags, partner value table, `partner_notes`, specifics | keep | `routes.md` § Route: Partnerships | "Priority partners are the ★★★ partners" stated once |

## Citers changed

- `skills/test-strategy/references/inventory.md` CHK-97: `route-calls-and-tenders.md` → `routes.md` (Go/no-go score; Partner value).
- Section names other files cite (*Stars*, *Next actions*, *Leads and opportunities*, *Rot and exit criteria*, *Attention filters*, route Partnerships / Calls & Tenders) are kept.

## Over budget

36429 bytes after sorting. Nothing generic is left: the five pipelines and placement, the lead
lifecycle, the three star rubrics, next-action and closing-date rules, the verifier's acceptance
criteria, the write tiers with their policy ids, and the Odoo field conventions are all Meaningfy's
own, and the sales agent applies them unattended. Recommendation: an `over_budget` entry, or a
later split (for example the write rules into their own skill, which every sales skill cites).

Second reader: general-purpose subagent (fresh), 2026-11-15. Verdict: lost: "the partner is qualified in the *Partner* block" (route Consulting via Partner); the `Deadline:` stand-in activity "counts the same and is converted once the type exists" (*Next actions*); restored in the second reading (`references/routes.md`, `SKILL.md`).
Other fixes: none; the dropped stage tables' agent work is in `assets/pipelines.yaml` (checked stage by stage); remaining citers of the deleted route files are dated study inputs in `openspec/changes/orchestrate-external-skills/inputs/`, left as written.
