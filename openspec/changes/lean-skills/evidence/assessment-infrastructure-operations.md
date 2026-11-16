# Assessment: infrastructure-operations
Before: body 9230 bytes, references 30453 bytes. After: body 7152, references 25252 (after the second reading's restore).

Measured with the stage's `lean_check.py` (the lint's own `_body`). Total prose 39683 → 32404 bytes,
over the 24576 budget: an `over_budget` entry is recommended (see the end). Line numbers are those of
the files before the rewrite. RISK-9 checked: the matrix line cites `references/devops.md`, which is
not a file of this skill, so it does not collide with the own `references/documentation.md`.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title and three-layer table, l. 14-25 | keep | body intro | bias sentence added (apply before anyone read the plan) |
| 2 | "written for a person who is not a devops engineer: each rule says why", l. 25 | keep | body intro | "each rule says why" dropped: restates the style |
| 3 | § Where things live, l. 27-38 | keep | body Rules, first three bullets | spec `operations-practice` DEC-1, DEC-13, DEC-17 |
| 4 | § Quick Start, l. 40-57 | keep | body Quick Start | decision-card owner sentence dropped (in protocol step 4 and Boundary) |
| 5 | § Workflow intro, workflow JSON, l. 61-63 | keep | body Workflow | spec: the DevOps workflow is data |
| 6 | § Workflow steps 1-8, l. 65-78 | keep | body Workflow, nine pointer sentences (D-5 form) | step 8 split into two sentences, one file each |
| 7 | Template rule and table, l. 80-93 | keep | body Rules, last bullet and table | spec DEC-16; consent-card row dropped (in Quick Start); "one log schema" merged into the execution-log row |
| 8 | Gotcha: copying a block (third copy), l. 99-100 | drop | | repetition of `ansible-practice.md` SHOULD |
| 9 | Gotcha: facts copied by hand between layers, l. 101-102 | drop | | repetition of `terraform-practice.md` § Hand-offs |
| 10 | Gotcha: role defaults with another service's values, l. 103-105 | drop | | repetition of `ansible-practice.md` MUST |
| 11 | Gotcha: insecure fallbacks, l. 106-108 | keep | `ansible-practice.md` § Roles (default password, default sudo, world-open allow-list), owner `infrastructure-security` | moved: the reference only had the default-login case |
| 12 | Gotcha: dead code kept live, l. 109-110 | drop | | repetition of `lifecycle-procedures.md` MUST tombstone |
| 13 | Gotcha: third-party role internals, l. 111-112 | drop | | repetition of `ansible-practice.md` |
| 14 | Gotcha: docs that restate code, l. 113-114 | drop | | repetition of `documentation.md` |
| 15 | Gotcha: fetch-and-run at "current", pin exact, l. 115-116 | drop | | repetition of `terraform-practice.md` MUST pins |
| 16 | Gotcha: temporary exceptions with `expires:`, l. 117-118 | drop | | repetition of `lifecycle-procedures.md` MUST |
| 17 | Gotcha: iterating against production, l. 119-120 | drop | | repetition of `environments.md` |
| 18 | Gotcha: one credential per backup, l. 121-122 | owner | `service-reliability`; one line kept in `ansible-practice.md` SHOULD ("one credential per service") | |
| 19 | Gotcha: one log schema, skeleton runbook, l. 123-124 | drop | | template table row and `documentation.md` ("a skeleton is not a doc") |
| 20 | Gotcha: trusting the cloud firewall, l. 125-126 | owner | `infrastructure-security`; `terraform-practice.md` § Firewalls keeps "public traffic only" | |
| 21 | New: § Before you hand over | keep | body Quick diagnostic | distilled from protocol steps 5-7 and the reviewer; no new rule |
| 22 | § Boundary & Related Skills, l. 128-151 | keep | body, unchanged | |
| 23 | Matrix line, l. 153 | keep | unchanged | |

## references/safe-change-protocol.md (5913 → 4945)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 24 | Intro, "the small changes are the ones nobody reads twice" | drop | | why restating the rule |
| 25 | Steps 1-7 | keep | same file | dry-run table folded into step 3's sentence; "Docs drift" dropped (the live state decides) |
| 26 | § Non-trivial changes, MUST and why | keep | same file | |
| 27 | § The reviewer, all bullets and severity table | keep | same file | CHK-40 cites this section |
| 28 | § When it goes wrong: sibling missing, template disagrees, AGENTS.md contradicts | drop | | repetition of body Rules |
| 29 | § When it goes wrong: apply fails, verify fails, `bw` locked | keep | same file | |

## references/change-shapes.md (1943 → 1794)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 30 | Intro; "This file only says which shape" | keep; drop | same file | the meta sentence dropped |
| 31 | Needs-a-change table, three shapes, protocol and `stack-operations` sentences | keep | same file | |

## references/interventions.md (1471 → 1285)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 32 | Intro "so the next person can see what was done" | drop | | why restating the rule |
| 33 | Table of records, notification channels, Confluence change log, owner line | keep | same file | |

## references/documentation.md (3059 → 2566)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 34 | Three audiences, The repo wins, Writing docs that stay true | keep | same file | spec DEC-11 |
| 35 | § Runbooks, the five numbered parts | drop | | repetition of `assets/templates/runbook.md`, which holds every part; the section names the parts in one sentence (CHK-57) |
| 36 | § Handover, the test | keep | same file | CHK-57 "The test" |

## references/repo-checks.md (1779 → 1590)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 37 | Intro "a merge to main reaches production" | keep | folded into the MUST's why | |
| 38 | MUST, table, free-plan rule, owner lines | keep | same file | CHK-36 |

## references/terraform-practice.md (4713 → 3435)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 39 | Intro, "Terraform holds the machines" list | drop | | repetition of the body's layer table |
| 40 | § Plan, review, apply: MUST, steps 1-4, pending change | keep | same file | CHK-41 |
| 41 | § State and pins: MUST, backend, version pins, Ansible pins, drift check | keep | same file | compressed |
| 42 | § Hand-offs, SHOULD, `role` join key | keep | same file | join key detail in `environments.md` |
| 43 | § Firewalls | keep | same file | |
| 44 | Idioms: `moved {}`, `import {}` | drop | | generic Terraform knowledge |
| 45 | Idiom: DNS short TTL behind a load balancer | drop | | generic; the cutover TTL stays in `stack-operations` `cutover.md` |
| 46 | Idioms: certificate hash, single-target health check, wildcard override, VM safety, two-step removal | keep | § House idioms | "Why" column folded into the idiom where not obvious |
| 47 | § No-gos | keep | same file | owner decision |

## references/ansible-practice.md (3603 → 2853)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 48 | Intro, the list of what Ansible configures | drop | | repetition of the body's layer table |
| 49 | Runs: dry run, check mode skips `command`/`shell`, tags on includes, `changed=0` | keep | same file | CHK-42; "use modules, not shell" dropped as generic, `creates:`/`changed_when:` kept |
| 50 | Runs: rehearse, pins | drop | | repetition (`environments.md`, `terraform-practice.md`), cited in one line |
| 51 | Playbooks and variables, list-replaces-not-merges, SHOULD third copy | keep | same file | |
| 52 | Roles: the role contract list | drop | | repetition of `assets/templates/role-contract/README.md`, which states every item |
| 53 | Roles: MUST defaults, fail closed, third-party roles, secrets owner | keep | same file | insecure-fallback gotcha joined (row 11) |
| 54 | Testing: lint, Molecule tier | keep | same file | CHK-42 |

## references/environments.md (1727 → 1431)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 55 | Intro: shared state, network and key reach production | drop | | why restating the rule |
| 56 | Naming, labels, join key, SHOULD/MUST separation, root module, inventory, throwaway VM, cloud account | keep | same file | |

## references/lifecycle-procedures.md (6245 → 5285)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 57 | Intro, common rules (announce, irreversible, code first) | keep | same file | |
| 58 | Create, Change with MUST `expires:` | keep | same file | |
| 59 | Resize steps and trap | keep | same file | steps 1-2 and 5-6 merged; CHK-52 |
| 60 | Rebuild steps 1-3 (data, baseline, snapshot) | keep | same file, step 1 | merged; checksum kept (CHK-52) |
| 61 | Rebuild capacity, two applies, host key, restore, rollback | keep | same file | |
| 62 | Sleep and wake, variants table | keep | same file | |
| 63 | Retire, MUST tombstone | keep | same file | |

## Over budget

Recommended `over_budget` entry: 32404 bytes. Every reference passage left is Meaningfy's own
procedure that the three devops agents and the `operations-practice` spec rely on (protocol, the
reviewer's grading, the lifecycle traps, the records); cutting further loses rules, not words.

Second reader: general-purpose subagent (fresh), 2026-11-16. Verdict: lost: the reason for `keep_disk = true` (a resize never grows the disk, so a later downsize stays possible); restored in the second reading, in `terraform-practice.md` § House idioms. Citers (CHK-36 to CHK-42, CHK-52, CHK-57, the three devops agents, `operations-practice`) checked and true; drop claims for rows 8-20 verified in the named references and owner skills (installer pinning: `infrastructure-security` `supply-chain.md`).
