# Assessment: service-reliability
Before: body 6285 bytes, references 22409 bytes. After: body 5084, references 19456.

Total prose 28694 → 24540 bytes, under the 24576 budget; no `over_budget` entry. Measured with the
lint's own `_body`. Nearly every passage is Meaningfy's own (channels, labels, clocks, thresholds, the
owner's policy); the cuts are generic SRE advice and repetition across the body and the references.
`scripts/`, `assets/` and every reference file name are unchanged; every section that `test-strategy`
(CHK-37, CHK-43 to CHK-45, CHK-49, CHK-56), `infrastructure-operations` and `docs/environment/` cite
keeps its heading. Line numbers are those of the files before the rewrite.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Intro, l. 16-21 | keep | body intro | rewritten as the bias (agent judging safety itself); MUST/SHOULD levels and "facts live in the infra repos" kept |
| 2 | § Quick Start, l. 23-46 | keep | body Quick Start | worded shorter; steps 5-6 merged |
| 3 | § Workflow, six pointers, l. 50-66 | keep | body Workflow, pointer sentences | asset and script links dropped from the body: each is linked from the reference read at that moment (alerting, incident-response, backup-restore, unattended-operations) |
| 4 | "Each rule is stated once…", l. 68-69 | keep | body Rules, first paragraph | |
| 5 | § Gotchas: never-succeeded backup, agent decides, no SSH, no third attempt, one issue | keep | body Rules, Common mistakes | also stated in their references |
| 6 | § Gotchas: copying a backup role, alert with no runbook, quiet check-up posts, postmortem actions, unreadable monitoring | drop | — | repetition: stated in `backup-restore.md` (Making a backup), `alerting.md` (The rule), `daily-checkup.md` (The output; Monitoring unreadable), `incident-response.md` (Postmortem) |
| 7 | — (new) | keep | body Before you hand over, Quick diagnostic | three questions drawn from rows 5, the check-up output and verify-before-close |
| 8 | § Boundary & Related Skills, l. 94-114 | keep | unchanged | matrix line unchanged |

## references/alerting.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 9 | Intro, l. 3-4 | keep | intro, first clause | second clause ("must reach them") is the page tier, already in the table |
| 10 | § The rule, § The two tiers | keep | unchanged | CHK-45 cites "The rule" |
| 11 | § Writing a good alert: symptom not cause; `for:` duration | drop | — | generic alerting practice |
| 12 | § Writing a good alert: summary → incident title; runbook location; delete or fix an alert ignored twice | keep | § House rules for an alert | "teaching people to ignore" reason dropped (restates the rule) |
| 13 | § Not now | keep | one line | Meaningfy scope decision |

## references/backup-restore.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 14 | Intro, l. 3-4 | drop | — | restates the headings |
| 15 | § The rules (three rows) | keep | unchanged | CHK-44 |
| 16 | § What is not required (no encryption, why; no second provider, no immutable copy; EU) | keep | "Not required" paragraph | |
| 17 | § Deciding, RPO/RTO defaults | keep | § Deciding | worded shorter |
| 18 | § Making a backup: the role's step list | drop | — | describes the template in `assets/templates/backup-role/`, which holds it |
| 19 | § Making a backup: one role, never copy; metric written last and atomically; one credential per service; 26 h alert; test by backdating | keep | § Making a backup | |
| 20 | § The restore drill, six steps | keep | § The restore drill, one paragraph | every step kept (from storage, scratch, proving query, timed, clean up, record); CHK-44 cites this heading |
| 21 | Restore into production | keep | unchanged | |
| 22 | § Not now | keep | one line | |

## references/daily-checkup.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 23 | Intro, nine checks (1-9) | keep | unchanged | check 9's drift sentence folded into the item; CHK-37 cites item 8, CHK-43 the file |
| 24 | Sleeping stacks; missing operations; monitoring unreadable | keep | same section | the link back to unattended-operations dropped (repetition) |
| 25 | "Since the previous report" link to incident-response | keep | sentence kept, link dropped | the pinned log is defined in incident-response Records |
| 26 | § The output, block and three bullets | keep | block unchanged, bullets as one paragraph | |

## references/incident-response.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 27 | Intro: definition of an incident | drop | — | general knowledge |
| 28 | Intro: every incident an issue in `infrastructure-stacks` | keep | intro | |
| 29 | § The rule, § Severities and clocks, words not numbers, GDPR, security incidents | keep | unchanged | |
| 30 | § Duty, § Records (table), interventions line | keep | unchanged | `infrastructure-operations` and `docs/environment/devops-agents.md` cite Records |
| 31 | Notify paragraph | keep | one sentence | |
| 32 | § Working an incident, six steps | keep | one paragraph | all six steps kept |
| 33 | § Postmortem | keep | unchanged but the last sentence | "remediation in progress months later" restates "finished only when every action is an issue"; CHK-56 |
| 34 | § Not now | keep | one line | |

## references/monitoring-standard.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 35 | Intro | keep | shortened | |
| 36 | § The rules, SHOULD note | keep | unchanged | CHK-45 |
| 37 | § What else the monitoring stack holds; § How targets and rules change | keep | worded shorter | |
| 38 | § Not now | keep | one line | |

## references/unattended-operations.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 39 | Intro, owner's quote | keep | unchanged | |
| 40 | Tier table, "Examples" column | drop (in part) | three act examples kept in the "Means" cell | the exact list is the YAML's `actions`, which holds every example |
| 41 | "The order the script applies…", l. 40-41 | drop | — | repetition: the YAML header states the precedence; the reference says the order is in the YAML |
| 42 | § How a decision is made, decision table | keep | unchanged | `monitoring_unreadable` fact now also says "report it, label `ops-parked`" (from row 44) |
| 43 | § Unattended hands are named operations | keep | shortened | "the check-up lists every missing operation" stays in `daily-checkup.md` |
| 44 | § When things are missing (three rows) | drop | — | repetition: monitoring unreadable → row 42 and `daily-checkup.md`; Slack unreachable → incident-response Records; two triggers → the runtime contract |
| 45 | § The runtime contract, in short | keep | one paragraph | every grant and the no-SSH, no-cloud-token rule kept |

Second reader: general-purpose subagent (fresh), 2026-11-16. Verdict: nothing lost. The record is complete (every file sorted, sizes filled); repetition claims for rows 6, 40, 41 and 44 verified (`unattended-actions.yaml` holds the precedence and every tier example; `incident-response.md` Records holds `ops-report`); citers (CHK-37, CHK-43 to CHK-45, CHK-49, CHK-56, *Records*, *Duty*) true.
