<!-- PLAN (design half). PLAN = this file + tasks.md. Document type: Implementation. Revision 3. -->

> Parent: EPIC `add-sales-bundle` ([`proposal.md`](proposal.md)), DEC-1..14. Evidence in
> [`inputs/`](inputs/README.md); report letters below (A, B, C, D) are those four 2026-10-27 reports.

## Context

The package `meaningfy-sales` 0.6.1 (88 files, 6 487 lines, location in `inputs/POINTER.md`) has five
skills, three Desktop scheduled-task prompts and a pytest-bdd suite. Report A §1 judges every file;
report C §6 lists every skillery touchpoint. This PLAN turns those two tables into an executable
import.

Fixed by the repo on `develop` @ 1569728 (v3.4.0):

- `meaningfy-sales` exists in `bundles.yaml` with `proposal-writing`, `estimation`,
  `proposal-writer`, `requires: [meaningfy-consulting]`.
- Agent standard: `type: scheduled` maps to opencode `subagent` with gap G-5
  (`tools/opencode-agent-map.json`); body ≤ `MAX_AGENT_BODY_LINES` (40); optional fields only
  `disallowedTools`, `color`, `metadata`; agent features in `tests/features/agents/<name>.feature`.
- Lint: every skill and agent appears in some use case's `served_by`; Boundary heading required;
  installed skills link nothing outside their folder; bodies contain no `/opsx:` or `.claude/`.
- Tests: plain pytest with `pyyaml` only (`requirements-dev.txt`); no `pytest-bdd`.
- Ladder names: `Light`/`Deep` appear in about 25 files (13 named in task 4.1, plus the consulting method pages, runbook and DoD found at execution). The open change
  `define-blc-engagement-model` does not rename them, so DEC-9 is executed here.

## Goals / Non-Goals

**Goals:**
- The five skills and one agent of the EPIC table, passing `make validate`, installable from
  `releases` on both CLIs.
- Outputs the owner can act on: answer-first daily notes, a complete ranked attention list and
  decision cards (DEC-5, DEC-11).
- One owner per fact across the catalogue (offer ladder, qualification, voice, safety).
- No Meaningfy CRM data, staff or partner names in any shipped file (DEC-3).
- The deterministic tests of the package running in `make validate`.

**Non-Goals:**
- Running the behaviour scenarios automatically (hand-run per CLI, as for every agent).
- An eval runner (the roadmap's Haiku-evals step owns that).
- Hooks, a dedicated Odoo user, authenticated approvals (accepted risk, below).
- Any presales capability not already in the package (DEC-8).

## Decisions

New PLAN-level choices. Bets settled in the EPIC are cited, not re-argued.

- **D-1 Names stay `sales-*`.** Report A suggests `crm-*` to avoid the generic `sales:*` plugin
  skills. Rejected: the EPIC names, UC-W7 and the bundle all say sales, and the collision is
  handled where it is measured, by near-miss probes against `sales:pipeline-review`,
  `sales:call-prep` and `sales:crm-hygiene-check` (task 6.3). Descriptions anchor on "Meaningfy",
  "Odoo" and the artifact (run note, dossier, profile).
- **D-2 File map.** Every package file has exactly one destination (table in *Approach*). Files
  report A marks *drop* are not imported.
- **D-3 Instance data lives in one configuration file in the owner's vault.** Skills hold method
  and stage names; Odoo ids are read live from Odoo; everything else that is instance data lives
  in `sales-config.yaml`, with exactly the seven keys the skills use: `owner`, `second_sender`, `run_note_folder`, `objection_library`, `partner_notes`, `booking_link`, `offer_catalogue` (a vault note; a price it does not list is ask-first). *Revision 3 (DEC-14): `booking_link` restored, `price_ranges` folded into the offer catalogue note.* *Revision 2 (task 2.5): booking link, brochures, cold list, creation cap and Odoo profile were dropped as unused (owner: YAGNI, no configuration a fixed rule can replace); the creation cap is a fixed 5 in the write rules, and the input marker is the fixed `Owner:`.* `sales-operations/references/configuration.md` documents every key;
  `sales-operations/assets/sales-config.example.yaml` holds placeholders only (`<owner>`,
  `<second-sender>`). Each run reads it first; a missing key is reported, never guessed (error
  matrix). Rationale: one place to change per installation; a second salesperson installs the
  same skills with their own file.
- **D-4 The decision card is owned by `executive-communication`** in a new
  `references/decision-request.md` (DEC-5): fields, the ≤150-word cap, the evidence grades, one
  worked example. `writing-antipatterns` Decision genre gains one exception: in an asynchronous
  approval request, assumed shared context (A13) is a defect, not welcome. Sales templates and the
  agent cite the card; they never restate its fields.
- **D-5 Run-note shape** (owned by `sales-operations`, `assets/templates/`): `HALT` line only when
  halted → **Decisions needed** (cards, by deadline) → **Attention list** (every item needing
  attention, in words, ranked P1 / P2 / P3, each rank headed by its count and the change since
  yesterday, e.g. `P2 · this week: 14 (+3)`) → **Today's plan** (open day: per deal, talk to /
  answer / chase, with the person) → **Done by the agent** (before → after, one line per record) →
  collapsed **Log**. Tables ≤5 columns. *Revision 3: "Watch, only what fired" and the one-screen cap
  are replaced (DEC-11): nothing is hidden, the ranking does the work.*
- **D-15 Attention ranks** (owned by `sales-operations`, *Priorities inside a run*, which maps its
  seven priorities onto them): **P1 today**: meetings today and tomorrow, replies waiting for the
  owner, deadlines within 3 working days, unanswered cards past their `BY`; **P2 this week**:
  overdue or missing next actions, ★★★ rotting, late-stage deals without a next step, deadlines
  within 14 days; **P3 grooming**: other rot, unscored records, empty fields, stale dossiers.
  Within a rank, more stars first, then older. Counts compare with the previous working day's note;
  no previous note shows `(new)`.
- **D-16 Day cycle** (DEC-11, DEC-13, `references/run-types.md`). *Open day* reads the previous
  working day's note first (its *Open for tomorrow*, unanswered cards, planned touches not done),
  re-checks each item in Odoo and mail (activity done, stage moved, mail sent or answered) and
  carries forward only what is still open, logging the rest as `resolved since`; then the signals
  since; then writes *Today's plan* from the week's focus deals and new P1 items, up to the week's
  capacity. *Close day* reads the owner's
  notes and the day's mail and calendar, records what happened on each deal (an internal note or a
  done activity: meeting booked, mail sent, call held), applies the owner's statements (DEC-12),
  infers stage and field changes from the evidence within the tiers, and ends with every deal touched
  today holding a dated next activity (`odoo-activity`, do and log). Close day polishes the note:
  plan items marked done or carried, counts refreshed.
- **D-18 Weekly review and plan** (DEC-13, `references/run-types.md`, `weekly-review.md`). After
  the review: *Next week*: 3–5 sales outcomes, the focus deals (each with its outcome), the
  capacity (owner actions per day; proposed from last week's done count, 5 when there is no
  history; the owner edits it with an `Owner:` line). The attention list of each daily note splits
  P1–P3 into *This week* (focus deals and new P1, shown in full) and *Later* (collapsed, counts per
  rank). A new P1 that pushes the day past capacity is listed, and the lowest planned item moves to
  tomorrow. The owner's personal week plan is `vault-planning`'s; this is the sales part only.
- **D-19 Offer catalogue** (DEC-14). `sales-operations/assets/offer-catalogue.example.md`: sections
  Offerings (per offer: name, what it includes, ladder step), Commercial structures, Approved price
  ranges, Materials (links). The agent reads it, never edits it; the weekly review raises a card
  for an offer or price used in a deal but absent from it, or when it is unchanged for 90 days.
- **D-17 The owner's statement is a yes** (DEC-12, `write-rules` §3). Besides `yes` after an
  `Answer:`, a statement by the owner that names a deal and an outcome ("Owner: Acme Data is
  won", or the same said in a session) is the yes for `odoo-won-lost` on that deal. A lost reason
  not stated is picked from Odoo's lost reasons by the evidence and logged. The policy data is
  unchanged: won/lost stays *ask*; the statement is the answer.
- **D-6 Self-edit becomes an issue draft** (DEC-7). The weekly review's "proposed changes to the
  instructions" becomes a decision card whose "yes" is "the owner files this text as a
  `skill-defect` issue". The write-policy entries `skills-maintenance` and `package.write` are
  deleted.
- **D-7 Write policy stays data, tested by an evaluator in tests only.**
  `sales-pipeline-custody/assets/write-policy.yaml` keeps the three tiers, "most restrictive
  wins", its normalised tool namespace (`odoo.*`, `gmail.*`, `calendar.*`, `drive.*`, `slack.*`,
  `vault.*` and the others) and every entry: most entries set *never* or *ask*, so dropping one
  would loosen it to the *ask* default. Removed: the `skills-maintenance` entry (DEC-7) and the
  file's own `version` (root `VERSION` is the only version). Fact names say `owner_`, not a
  person's name. A header comment maps each namespace to the documented connector. The evaluator
  (`support/policy.py`) is ported into `tests/test_sales_write_policy.py`; the package's 109 rows become
  `tests/fixtures/sales/write_policy_cases.yaml` (105 kept, the four self-edit rows dropped, seven added so every entry is exercised). *Revision 2 (task 2.1): the earlier "ten
  capability classes" would have lost the field-level matching (`odoo.write` on `crm.lead.stage_id`).*
- **D-8 Deterministic refusals.** The agent allows the documented servers by wildcard
  (`mcp__odoo__*`, `mcp__google-workspace__*`, names from `mcp-setup.md`) and denies by exact name
  the two Odoo tools whose names are known: `unlink` and `import_records` (bulk import). The Google
  Workspace server's tool names are not documented, so mail send and delete stay enforced by the
  write policy's never-tier and the auditor's HALT: a recorded residual risk, as are the opencode
  gaps (MCP allow and deny entries have no opencode analogue). *Revision 2 (task 6.2).*
- **D-9 Runtime binding.** Desktop scheduled tasks call the `sales-operations` skill with a run
  type (G-4); the CLI path is `claude -p --agent meaningfy-sales:sales-agent "<run type>"` from an
  external scheduler, following the pattern in `vault-setup/references/scheduler.md` (cited, not
  copied). One page, `docs/environment/sales-agent.md`, holds connectors, schedules and the three
  prompt texts. opencode: verify `opencode run --agent sales-agent` once (task 7.3); if it refuses
  a subagent, change `agentModes.scheduled` to `primary` in this change and record it.
- **D-10 Ladder rename (DEC-9).** `engagement-lifecycle.md` gets the new names and one line
  "Formerly called the Light and Deep tiers." under the ladder table. The free/paid line is unchanged: presale is the only
  free stage. The package's "workshop usually paid" is corrected to that rule.
- **D-11 Qualification split (DEC-10).** `sales-qualification` owns five-P, MEDDPICC, the prospect
  question bank, evidence grading, research checklist and the dossier. `presales-discovery.md`
  keeps the relevance boundary and the three internal outcomes (De-prioritise / Deepen discovery /
  Introduce the Proof of Value) and replaces its question sections with a pointer. Report A's
  overlapping MEDDPICC questions are merged into one bank, deduplicated by question intent.
- **D-12 Commercial policy leaves the sales skills.** Guarantees and the founding-client offer →
  cite the safeguard options in `engagement-lifecycle`; price → `estimation`/`proposal-writing`,
  with approved ranges in the config file; the email tone → a new `meaningfy-voice` channel
  `channels/outreach-email.md` (replaces nothing; the four existing channels stay). One objection
  taxonomy (from `objections.md`) in `sales-conversations`; the value-equation drivers map onto it.
  The six commercial insights stay in `sales-conversations/references/insights.md` as their one
  owner.
- **D-13 Facets.** All five: `area: sales`, `stage: sell`, `maturity: experimental`. Purpose:
  `crm` for operations, pipeline-custody, accounts, qualification; `offers` for conversations.
  Subject `generic` except qualification and conversations (`semantic-data`, they carry Meaningfy's
  disqualifiers and insights). Posture `precise` for operations and pipeline-custody, `profiled`
  for the other three. Customer success stays inside `sales-accounts` (the EPIC table); no new
  facet value.
- **D-14 Tests port (no `pytest-bdd`).** Deterministic: write policy, Odoo-view completeness,
  Obsidian table render (generic over every `assets/templates/*.md` of the sales skills), and a
  decision-card shape check over the templates. Behaviour: the ten package feature files become
  one `tests/features/agents/sales-agent.feature` (Background naming the five skills; one Scenario
  Outline per package file; amended per report A §6, e.g. entity resolution asks with context and
  a recommendation). `support/agent.py` is not imported; it is noted as seed material for the evals
  step.

## Algorithm / approach

### File map (D-2)

| Package source | Destination | Treatment |
|---|---|---|
| `sales-agent/SKILL.md` role + call graph | `agents/sales-agent.md` | dispatch contract, ≤40 lines |
| `sales-agent/SKILL.md` method, `references/agent-loop.md`, `references/run-types.md` | `skills/sales-operations/SKILL.md`, `references/goal-loop.md`, `references/run-types.md` | numbers stay in the one *Terms* section; table rule → cite `vault-conventions` |
| `sales-agent/assets/templates/*.md` (3) | `sales-operations/assets/templates/` | rewritten to D-5 |
| `sales-agent/assets/prompts/*.md` (3) | `sales-operations/assets/prompts/` (same three files) | pipe returns become lists; each prompt is handed whole to a reviewer, so they stay separate files (revision 2) |
| `sales-pipelines/SKILL.md`, `references/{lead-sources,odoo-crm-conventions,route-*}.md` | `skills/sales-pipeline-custody/` same names | ladder → cite `engagement-lifecycle`; rot days only in `pipelines.yaml` |
| `sales-pipelines/references/hard-rules.md` | `sales-pipeline-custody/references/write-rules.md` | cites `guardrails`; §3 exemption deleted |
| `sales-pipelines/assets/{pipelines,odoo-views,write-policy}.yaml` | `sales-pipeline-custody/assets/` | ids, legacy and parked teams, partner ratings out (D-3, D-7) |
| `sales-accounts/**` | `skills/sales-accounts/**` | identity §6 gains "and one line of context"; profiles lead with a one-liner |
| `sales-deal-dossier/**` | `skills/sales-qualification/**` | value-equation trimmed per D-12; dossier summary in words first |
| `sales-meeting-coach/**` | `skills/sales-conversations/**` | voice → `meaningfy-voice`; meeting-plan em dashes removed |
| `scheduled-tasks/*.md` | `docs/environment/sales-agent.md` | prompts shrink to "run `sales-operations`, run type X" |
| `REQUIREMENTS.md`, `CHANGELOG.md` | `inputs/` (redacted) | secondary |
| `tests/ownership.yaml`, `tests/trigger_probes.yaml` | merged into skillery's files | `near_miss: true` → `near_miss_of:` |
| rest of `tests/` | per D-14 or dropped (report A §1.7) | — |

### Worked example — one decision request before and after

Before (package template D1):
`- [ ] P1 · Acme Data (#412) · lost · no reply · mail 18f3a… · Answer:`

After (card, D-4):
```
DECIDE: Mark the Acme Data discovery workshop deal lost?            [Acme Data]
BY: Fri 31 Oct — their budget year closes; after that the deal rots.
RECOMMEND: A — three touches since 12 Sep, no reply.
OPTIONS: A. Lost, reason "no response" → deal closes, re-contact task 1 Feb.
         B. One more touch → I draft it today for you to send.
         C. Do nothing → it stays open and keeps flagging.
FACTS: last two-way contact 9 Sep (call notes, confirmed) · champion left (LinkedIn, assumed)
YES WRITES: stage Lost, lost reason "no response", activity "re-contact" 2027-02-01.
REPLY: A / B / C / edit: …
```

### Idempotency

Runs are at-least-once (a Desktop task may fire twice or be re-run by hand). Safe because: every
write re-reads the record and writes only fields whose value differs (a replay is a no-op);
activities and notes are created only after searching for one with the same summary on the same
record; the run note is one file per date and type, appended per iteration, never recreated; the
creation cap counts records created today, read from Odoo, not from memory.

### Anti-patterns

| ❌ Don't | ✅ Do instead | Why |
|---|---|---|
| A decision request that is `name (#id) · reason · Answer:` or a link to a note line | A decision card per `executive-communication/references/decision-request.md` | The owner must open three records to decide; 23 such requests are the main complaint (report A §3.2) |
| Write a staff first name, a partner company, `odoo_team_id: 6` or a price into a skill | Use a role (`the owner`, `the second sender`) or a `sales-config.yaml` key | skillery is public and a second salesperson installs the same skills (DEC-3) |
| Copy the ladder table, voice rules, guardrail principles or card fields into a sales skill | One sentence that cites the owner skill by bare name | Two owners drift; the package already had four copies of the hard rules |
| Keep `safety-summary.txt` or embed rules in the Desktop prompt texts | The prompt says "run `sales-operations`, run type X"; rules load with the skill | A fourth copy of the rules fell out of date in the pilot |
| Port the tests with `pytest-bdd` | `pytest.mark.parametrize` over the YAML fixtures | `requirements-dev.txt` holds `pyyaml` only; a new dependency for table parsing is not worth it |
| Edit `bundles/`, `.claude-plugin/marketplace.json` or `tools/opencode-catalogue.json` | `make bundles` and commit its output | `make validate` and CI fail on any hand edit |
| Store rot days in both a route file and `pipelines.yaml` | Rot days only in `pipelines.yaml`; route files cite it | The package stated them twice (report A §1.6) |

### Test cases

Deterministic (in `make validate`):

| ID | Component | Input | Expected output | Edge cases |
|---|---|---|---|---|
| TC-01 | write-policy evaluator | each of the 112 cases of `write_policy_cases.yaml` | the row's tier | an action matching two entries returns the stricter tier; an unlisted write tool returns *ask* |
| TC-02 | write-policy completeness | every entry id of `write-policy.yaml` | each id is the deciding entry of ≥1 case | an entry added without a case fails |
| TC-03 | Odoo views | `odoo-views.yaml` + `pipelines.yaml` | every filter has question, action, target, cadence; every stage it names exists | a filter naming a parked team fails |
| TC-04 | table render | every `skills/sales-*/assets/templates/*.md` | every table has ≤5 columns and a separator row | a table inside a fenced block is ignored |
| TC-05 | card citation | every run-note template | a `Decisions needed` section exists, is the first `##` after the title (or after a `HALT` line), and cites `decision-request` | the intake template, which also has a plan section |
| TC-06 | privacy | the files of task 8.2 | no match for the names in the owner's local `sales-config.yaml`, nor for `odoo_.*_id:` | run as a manual grep, since the names list is not in the repo |
| TC-07 | catalogue lint | the whole repo | `make validate` green (facets, Boundary, probes, served_by, agent conformance, ownership) | — |

Behaviour (hand-run on Claude before release, `tests/features/agents/sales-agent.feature`): one
workflow, the **day cycle**, run on one ordinary working day against the live pipeline. *Revision 3:
replaces the five fragment cases IT-01..05 (owner: not a consistent workflow).*

| Step | When | The owner does | The note and Odoo then show |
|---|---|---|---|
| IT-1 open | morning, Desktop scheduled task | nothing; reads the note | one new daily note; yesterday's open items re-checked in Odoo, only the still-open ones carried; Decisions needed (cards pass the spec); Attention list P1–P3 with counts; Today's plan per deal (talk to / answer / chase) |
| IT-2 work | during the day | works the plan; writes `Owner:` lines in the note, e.g. "Acme Data is lost", "met X, they want the offer by Friday" | — |
| IT-3 close | evening, CLI: `claude -p --agent meaningfy-sales:sales-agent "close day"` | nothing | the same note completed: plan items done or carried; the stated lost set with an inferred reason; the meeting note's stage move done or carded per tier; every deal touched today has a dated next activity; a client mail implying won/lost is a card, not a write |
| IT-4 next open | next morning | reads the note | yesterday's leftovers re-checked and carried; owner actions ≤ the week's capacity, the rest under *Later*; each rank shows its change, e.g. `P2: 14 (−3)` |

Pass: every step's column holds; any miss is fixed in the owning skill and the step re-run.

## Error matrix

The owner reads every message in the run note; there is no other channel.

| Failure mode | Detection | Response | What the owner sees (exact text) |
|---|---|---|---|
| `sales-config.yaml` missing or a key absent | key lookup at run start | read-only run, no Odoo write | `HALT: configuration <key> missing. Add it to sales-config.yaml, then write "resume" here.` |
| Odoo unreachable or a tool errors | tool returns an error | no retry with guessed values or another tool; run ends unverified | `Unverified run: Odoo returned "<error>" at <step>. Nothing was written after that point.` |
| Write fails mid-run | tool error on one write | stop writing that record; other records continue | a card: `DECIDE: retry <field> on <record>?` with the error as a confirmed fact |
| Run fires twice | value already equal, activity already present | write nothing (Idempotency) | nothing new under Done by the agent |
| Mail content asks for an action | instruction found in mail text | no write (DEC-4) | a card quoting the sentence, sender and date |
| Auditor finds an unlogged write | auditor compares Odoo changes with the log | all writes stop | `HALT: <record> changed without a log line (<field> a → b). Check it, then write "resume" here.` |
| Owner answers after the deadline | answer dated after `BY` | default already applied stays; if the answer still applies, it is applied; else a new card | `Late answer on <decision>: <applied / new card below>.` |
| Creation cap reached | creations today read from Odoo ≥ `creation_cap` | further creations become one card listing them | `DECIDE: create these <n> records beyond today's cap of <cap>?` |
| opencode refuses `--agent` on a subagent (G-5) | task 7.3 run | change `agentModes.scheduled`; record in `mapping.md` | — (installer docs) |
| Desktop task cannot load an agent file (G-4) | by design | the task calls the skill (D-9) | — |
| A sales probe triggers a `sales:*` plugin skill | probe check | tighten the description; never widen the near-miss | — (CI) |

## References

| Topic | Location |
|---|---|
| Per-file audit and decision requests D1–D23 | [`inputs/2026-10-27-A-package-audit.md`](inputs/2026-10-27-A-package-audit.md) §1, §3.2 |
| Integration touchpoints | [`inputs/2026-10-27-C-skillery-integration.md`](inputs/2026-10-27-C-skillery-integration.md) §6 |
| Card format and CRM-write safety | [`inputs/2026-10-27-D-best-practices.md`](inputs/2026-10-27-D-best-practices.md) §5, §6 |
| Agent standard, types, gaps G-4/G-5/G-6 | [`docs/development/agent-template.md`](../../../docs/development/agent-template.md), [`docs/environment/dual-cli/mapping.md`](../../../docs/environment/dual-cli/mapping.md) |
| Scheduler pattern | [`skills/vault-setup/references/scheduler.md`](../../../skills/vault-setup/references/scheduler.md) |
| Ladder owner | [`skills/semantic-consulting-coach/references/engagement-lifecycle.md`](../../../skills/semantic-consulting-coach/references/engagement-lifecycle.md) |

## Risks / Trade-offs

- [Never-tier relies on prompt + `disallowedTools` named per install; the agent uses the owner's
  own accounts] → accepted risk carried from the pilot (SO-3); recorded in the runtime page and in
  the custodianship spec. Mitigation: auditor HALT, before → after log.
- [Approvals in a shared note are unauthenticated text] → accepted risk (SO-3), same record.
- [Ladder rename touches 13 files in two other bundles] → one task group, one commit, links
  checked by `make validate`; the "Formerly called" line helps readers of older documents.
- [Size: ~70 files moved] → tasks are per skill so each ends green.
- [Behaviour regressions are only caught by hand runs] → the feature file is the checklist the
  owner runs once on Claude before release (task 8.3).

## Open Questions

None blocking. Two owner items from the pilot remain owner tasks outside this EPIC and do not
block it: reviewing the six commercial insights, and filling approved price ranges (until then every
price in a draft is ask-first — already the policy).
