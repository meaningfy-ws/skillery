# Touch map: activity-test-profiles (C) and generic-task-test-profiles (D)

Paths are relative to `openspec/changes/` unless they start with `skills/`, `agents/`, `tests/` or `quality/`.
Sizes are bytes of `SKILL.md` ("body") plus `references/` ("refs") measured with `wc -c` in the worktree on 2026-11-14.
"Est." is my estimate from the PLAN's description; neither PLAN states a size in KB for any new prose.
R1 = `lean-skills`, R2 = `orchestrate-external-skills`, R3 = `delivery-process-and-tools`.

Reconciliation note and delivery waves: `test-suite-care/design.md` section "Delivery decisions", D-17:
B stage 1, then B stage 2, then C and E stage 1 in either order, then B stage 3; D at any time after A;
E stages 2 and 3 after E stage 1. Also `activity-test-profiles/design.md` D-16 (C starts when B stages 1 and 2 are merged),
`activity-test-profiles/design.md` D-20 (E), `generic-task-test-profiles/design.md` D-26 (D may land any time after A; rerun `make bundles` and `make skill-inventory` after each rebase).
The cross-check `delivery-retrospective/inputs/cross-check-test-epics.md` holds the owner decisions of 2026-11-14 that produced C's D-36 and D's DEC-12/DEC-13.
R3's DEC-17 (`delivery-process-and-tools/proposal.md`) says R3 is delivered before R1 and before all four test EPICs.

---------------------------------------------------------------------------------------------------

## EPIC C: activity-test-profiles

### 1. State
- Appetite VERY LARGE, five stages by family group: documentation, shaping, DevOps, architecture and modelling, UI (`activity-test-profiles/proposal.md`, DEC-1). Each stage is its own PR into `develop`.
- Gated: yes. Ten gate runs; the first five fail (8.7 to 8.82 on the first PLAN version), the rewritten PLAN failed runs 6 to 9 (8.93 to 8.98) and passed run 10 at 9.15 (`activity-test-profiles/inputs/planning-record.md`). Then D-36 was added after the gate and not re-gated (`activity-test-profiles/design.md` header).
- Tasks: 43 (0.1 to 0.3, 1.1 to 1.10, 2.1 to 2.9, 3.1 to 3.9, 4.1 to 4.5, 5.1 to 5.4, 6.1 to 6.3) in `activity-test-profiles/tasks.md`.
- Delivered: nothing. Only task 0.1 (spec sign-off) is ticked, recorded in `activity-test-profiles/evidence/acceptance.md` (2026-11-14). Delivery starts at task 0.2, once B stages 1 and 2 are merged (design D-16).

### 2. Touch table
| Path | What is added | New prose in skills (est.) | Current prose of that skill |
|---|---|---|---|
| `skills/epic-planning/SKILL.md` | one sentence in step 2 (invariants question), three rules in step 6, a pointer to the tester's brief in `epic-delivery`, optionally a sentence for an appetite without a tester (D-4, D-24, D-35) | up to 7 lines, about 0.6 KB | body 10,871; refs 5,827 |
| `skills/epic-planning/references/invariants.md` (new file) | what an invariant is, write-path list, error-matrix row, the #143 case replayed (D-4) | est. 3 to 4 KB | see above; total after about 20 KB |
| `skills/project-setup/assets/openspec-schema/meaningfy/templates/design.md`, `schema.yaml`, and the copy in `openspec/schemas/meaningfy/` | heading `## Invariants` before `## Error matrix`, one comment line, one bullet (D-2). This is a template, not skill prose | not counted | not measured |
| `skills/technical-writing/SKILL.md` | a step in the `verify` row and "a short section" per adopted check (Vale, docs ls-lint): rule first, command, when, blocks, cost, install, skip note (D-12; task 1.6). Only if the survey and the owner adopt them | est. 1 to 1.5 KB | body 6,118; no references folder |
| `skills/technical-writing/references/` (new folder, conditional) | a check file for `ADQ`, `ROB` or `RSK` only where a failure is recorded (D-14) | not stated; likely none | none |
| `skills/stack-operations/references/stack-standard.md` | subsection *Recommended checks*: ls-lint, three facts, pointer to #216 (D-12; task 3.6), only if adopted | est. 0.5 to 1 KB | body 7,416; refs 19,939 |
| `skills/infrastructure-operations/references/repo-checks.md` | subsection *Recommended checks*: checkmake, outside the file's MUST (D-12) | est. 0.5 to 1 KB | body 9,918; refs 30,453 |
| `skills/architecture/` (reference file only) | a check plus the question id `ROB` inside the existing `**Related:**` line; no added line (D-26). Conditional on a failure | not stated | body 36,473; refs 105,371 |
| `skills/conceptual-modelling/` (or `modelling-conventions`, `linkml-engineering` if the owner names them) | a check in a reference file, conditional (D-14 table) | not stated | conceptual-modelling body 9,462, refs 7,313; modelling-conventions 5,087 + 8,792; linkml-engineering 6,071 + 28,994 |
| `skills/test-strategy/references/documentation.md`, `shaping.md`, `devops.md`, `architecture.md`, `modelling.md`, `ui.md`, `inventory.md` | the ten `gap -> C` rows become `exists` or `accepted`; new `CHK-` ids; the sentence on "gap -> C rows" removed (D-10, D-28). No change to questions, stances or matrix shape (No-gos) | small, about 1 to 2 KB across files | body 8,164; refs 81,420 |
| `skills/<owner>/SKILL.md` pointer lines | question id added where A's `pointer_errors` test demands it (D-10) | a few words each | n/a |
| `quality/vale/`, `quality/ls-lint/docs.yml`, `quality/ls-lint/stacks.yml`, `quality/checkmake/stacks.ini`, manifests, `quality/README.md` | new check configurations and source manifests (DEC-4, D-9) | not skill prose | outside skills |
| `tests/test_test_strategy.py` (adds `CLOSED_FAMILIES`, `closed_family_errors`), `tests/test_quality.py`, `tests/fixtures/quality/`, `tests/ownership.yaml` (`plan-invariants` entry), `tests/trigger_probes.yaml` | tests, fixtures, probes (D-11, D-29, D-1) | not skill prose | outside skills |
| `docs/development/quality.md`, `CONTRIBUTING.md`, `CHANGELOG`, `dependencies.yaml` (Vale entry) | docs and register (task 1.5, 1.6) | not skill prose | outside skills |
| Specs, deltas under `activity-test-profiles/specs/` | `epic-shape` (ADDED three requirements, MODIFIED *templates speak plain language*), `test-strategy` (ADDED four, MODIFIED *Every activity family has a matrix*), `documentation-workflow` (two), `operations-practice` (two), `quality-checks` (four) | n/a | n/a |
| Evidence under `activity-test-profiles/evidence/` | survey files, tool-run files, catch files, baseline, invariants trace | n/a | n/a |

No agent is added or changed. No workflow JSON changes (D-12). The tester's brief is B's and is not edited here (DEC-5; D-35).

### 3. Against R1
- Over 24 KB (body plus refs) already, before C: `architecture` 141,844; `test-strategy` 89,584; `infrastructure-operations` 40,371; `linkml-engineering` 35,065 (if chosen); `stack-operations` 27,355. C adds to `infrastructure-operations`, `stack-operations`, `test-strategy`, `architecture` and possibly `linkml-engineering`, so it deepens a breach R1 must cut anyway. Not over 24 KB and staying under: `epic-planning` about 20 KB after C; `technical-writing` 6 KB to 7.6 KB; `conceptual-modelling` 16.8 KB plus a check.
- Body over 6 KB after C: `epic-planning` (10.9 KB already), `technical-writing` (from 6.1 KB to est. 7.2 to 7.6 KB, because D-12 puts the section in SKILL.md and the skill has no references folder), `infrastructure-operations`, `stack-operations`, `architecture`, `test-strategy`, `conceptual-modelling` (all already over). Only `technical-writing` is pushed over the 6 KB body target by C itself.
- Generic knowledge R1 would likely cut from C's additions: the install note for Vale and ls-lint and the explanation of how each tool works (the tool's own documentation); "what an invariant is and is not" in `references/invariants.md` (general property-testing knowledge). Meaningfy-specific and kept: the rule each check encodes, the survey-and-accept rule, the `## Invariants` section rule 2 (error-matrix row citing the id), the #143 failure.
- Example code in skills: none in the PLAN. The #143 case is a prose worked example. Tool configurations live in `quality/`, outside the skill budget.

### 4. Against R2
- New skills or agents for the orchestrator to list: none. C adds no skill and no agent (No-gos).
- Routing C adds on its own: pointer lines to `test-strategy` rows (D-10) and a pointer from `epic-planning` to the tester's brief in `epic-delivery` (D-35). No goal routing.
- Shared touch: `technical-writing`. R2 routes it to the external `technical-documentation` skill with three overrides (British spelling, no em dash, no contractions in binding text; `orchestrate-external-skills/proposal.md`, DEC-7 and "What Changes"). C adds Vale checks to the same skill with externally chosen styles that could flag the very style the override sets. They must agree on one style source; this is not stated in either PLAN.
- C does not touch the sales, writing or consulting skills.
- C does not touch `test-strategy` questions; R2 adds nothing there.

### 5. Against R3
| C decision | What it changes | R3 relation |
|---|---|---|
| D-36 (`activity-test-profiles/design.md`) and tasks 1.10, 2.9, 3.9, 4.5, 5.4 | an accept-only stage takes the small review set (two merged reviewers); cites the live `epic-delivery` requirement *The loop scales with the appetite* and `epic-delivery` SKILL.md lines 106 to 111 | R3 DEC-5 makes the small set the MEDIUM default and R3 No-gos leave LARGE and larger unchanged. So D-36 is untouched in effect, but the cited line numbers and the requirement text move when R3 modifies `epic-delivery` and its spec; C must re-read both after R3. |
| D-13 and D-36 last bullet (tester and checker stay separate at VERY LARGE, so both run on an accept-only stage) | the tester runs on every stage | R3 DEC-3 defines a tester condition at every appetite (taken from B's D-28). R3 may absorb D-13: a stage with no code to state a property about would fall under the condition. Contradiction unless the condition is written to keep the VERY LARGE tester. |
| D-24 (proposed) an invariant where no tester runs (TINY, SMALL, MEDIUM until B stage 2) | the *Test* cell does not start with `tester`; a sentence in `epic-planning`; scenario *An appetite without a tester* | R3 DEC-3 and DEC-5 change when a tester runs at MEDIUM and below, and R3's rabbit-hole warns not to add a tester where there is none. R3 absorbs the premise; D-24's wording must follow the final condition. |
| D-35 | `epic-planning` points to `epic-delivery`'s `references/team-and-briefs.md` for which properties the tester takes | R3 edits `epic-delivery` (DEC-1 to DEC-7) and its briefs (DEC-8). Pointer survives; the target text changes. Touched, not contradicted. |
| D-1, D-4 (steps 2 and 6 of `epic-planning`) | the invariants question and three rules | R3 DEC-2 edits `epic-planning` (the gate limit of two runs at any appetite). Same file, different steps: no contradiction, a merge order only. |
| D-30 (proposed) reopening a closed family, and any PLAN revision | a revised PLAN is gated again | R3 DEC-2: at most two gate runs on any re-gate. The owner already stated this (cross-check decision 7). Consistent. C's own ten runs are before the rule. |
| tasks 1.10 to 5.4 (stage checker, a PR per stage, `evidence/` handed to the next stage) | five stages in one EPIC | R3 DEC-1 (hand-over note, new session per stage) and DEC-7 (one session delivers one EPIC) pull in different directions for a five-stage EPIC; C's stage loop does not state a hand-over note. Untouched, but the lead running C will need R3's note. |
| D-14 "an accept-only stage ships..." | no skill text, no probe | untouched by R3. |
| worker agents, `guardrails` | not touched by C | untouched. |

### 6. Order
- After A (delivered and archived 2026-11-14): its matrix and family files are C's inputs (`activity-test-profiles/proposal.md`, Parents).
- After B stages 1 and 2 are merged: C needs B's `quality/` tree, tester brief and `quality-checks` capability (`activity-test-profiles/design.md` D-16; `test-suite-care/design.md` D-17). B stage 3 is not needed (`activity-test-profiles/evidence/acceptance.md`).
- C and E stage 1 in either order (`test-suite-care/design.md` D-17); task 0.2 and 1.8 carry the rule for each order (`activity-test-profiles/design.md` D-20, D-27, D-29).
- After R3, because R3 DEC-17 says so, and because C's D-36, D-13, D-24 and D-35 depend on text R3 rewrites.
- Independent of D (`activity-test-profiles/proposal.md`, Impact). Both edit `test-strategy` rows (different families: C six family files, D `generic-writing.md`) and both take next free `CHK-` ids, so whichever is second rebases (`activity-test-profiles/design.md` D-29; `generic-task-test-profiles/design.md` D-26).
- Vs R1: C's skill text is small, so it is cheap to write before or after. The only avoidable double work is the `technical-writing` section (it sits in a body R1 will hold to 6 KB) and the `epic-planning` reference. If R1 is near, write those into the lean shape rather than the current one.

### 7. Not read or not determined
- I did not read C's `inputs/qa.md`, `inputs/seed.md`, the `evidence/` beyond `acceptance.md`, or the body of B's design (only B's tasks and the reconciliation lines).
- Sizes for the new reference file and the technical-writing section are my estimates; the PLAN gives line caps only for `epic-planning` (seven lines).
- Which tools will be adopted, and so which skill rows actually get text, is decided by surveys at delivery time (DEC-2, DEC-3). Stage 4 may add no text at all.
- I did not measure how much of `architecture`/`test-strategy`'s large size is assets rather than prose; my numbers count `references/*` and `SKILL.md` only.

---------------------------------------------------------------------------------------------------

## EPIC D: generic-task-test-profiles

### 1. State
- Appetite LARGE (`generic-task-test-profiles/proposal.md`). Three stages: the reader; the profiles; the rows and the proofs.
- Gated: yes. Seven runs: 8.9, 8.8, 8.9, 8.8, then 9.0 PASS (run 5); after the DEC-11 re-shape run 6 8.9 FAIL and run 7 9.1 PASS (`generic-task-test-profiles/design.md`, Attack record). DEC-12 and DEC-13 (tool list, thin reader agent) and decisions D-15 to D-27 were added afterwards and not gated again.
- Tasks: 25 (1.0 to 1.8, 2.0 to 2.10, 3.1 to 3.5) in `generic-task-test-profiles/tasks.md`.
- Delivered: nothing. No task is ticked. A is delivered, so D can start (tasks header).

### 2. Touch table
| Path | What is added | New prose (est.) | Current prose of that skill or file |
|---|---|---|---|
| `skills/guardrails/references/adversarial-reader.md` (new) | eight sections: when it applies, three steps, who confirms, unattended runs, the brief (a text block), the report, loop end, no reader; the reader's two tool lists (D-1, D-27) | est. 5 to 7 KB | guardrails body 13,347; refs 2,323 |
| `skills/guardrails/SKILL.md` | one bullet in section 5; description 681 to 687 characters (D-1, D-23) | about 0.3 KB | see above; total after about 21 to 23 KB |
| `skills/guardrails/references/subagent-reports.md` | the reader's exception to the *reviewing* fields' verdict (reconciled, task 1.5) | est. 0.3 KB | part of the 2,323 |
| `agents/adversarial-reader.md` (new agent, DEC-13) | thin agent, `tools: [Read, Grep, Glob]`, no method; entry in `bundles.yaml`; `tests/features/agents/adversarial-reader.feature` | not skill prose | n/a |
| `skills/proposal-writing/SKILL.md` | `## Review profile` (Succeeds, Fails, Reader, Attacks), a criteria sentence in Flow step 1, new step 5 *Have it read* (D-2, D-3) | est. 1.2 to 1.8 KB | body 7,129; refs 7,333 |
| `skills/contract-practice/SKILL.md` | the section, a fifth intake bullet, a changed *review* row, one sentence under *Lawyer-review flag* | est. 1.2 to 1.8 KB | body 8,688; no refs |
| `skills/meaningfy-voice/references/channels/linkedin.md`, `blog.md`, SKILL.md lines 23 to 24, description's post trigger | the section with two step lines, pointer and differences in blog, a description change (D-2, D-3, D-12) | est. 1.2 to 1.8 KB | body 1,951; refs 8,227 |
| `skills/executive-communication/SKILL.md` | the section, a criteria line and a closing reader line in *Start here* | est. 1.2 to 1.5 KB | body 14,237; refs 3,431 |
| `skills/sales-conversations/SKILL.md` | the section and a subsection *In an attended session: criteria and a reader* under *Workflow*, pick-up included | est. 1.5 to 2 KB | body 7,077; refs 21,654 |
| `skills/test-strategy/references/generic-writing.md`, `inventory.md`, `SKILL.md` | five `CHK-` ids, ten rows replacing two, `ADQ` row `accepted`, pointer lines, three small edits in the Quick Start and the matrix example column (D-10, D-17) | est. 2 to 3 KB | body 8,164; refs 81,420 |
| `agents/proposal-writer.md`, `agents/sales-agent.md` | `Agent` tool and `guardrails` skill; Input, Output, Side effects, Refuses lines (D-5, DEC-9, DEC-10). Bodies must stay at or under 40 lines. `lawyer` unchanged | few lines each | 45 and 53 lines in the file; body counts frontmatter-free |
| `tests/features/agents/proposal-writer.feature`, `lawyer.feature`, `sales-agent.feature` | scenarios, Background lists | n/a | n/a |
| `tests/test_generic_task_profiles.py` (new), `tests/ownership.yaml`, `tests/trigger_probes.yaml`, `tests/evals/triggers/meaningfy-voice.json` | assertions, ownership entry, probes, one behavioural trigger eval | n/a | n/a |
| `docs/` CHANGELOG, `docs/future-features.md`, use cases UC-W7, UC-W8, UC-W16, UC-W24 (`guardrails` added under `served_by.skills`) | docs lines (task 3.3) | n/a | n/a |
| Specs, deltas under `generic-task-test-profiles/specs/` | ADDED: `company-voice` (new capability, DEC-8), `legal-contract-practice`, `executive-communication`, `sales-method-ownership`, `test-strategy`, `subagent-dispatch` (two requirements); MODIFIED: `subagent-dispatch` *Every subagent returns the base report, extended per purpose* | n/a | n/a |

No Python tool or mod is added. The only tool-like artefact is the thin agent.

### 3. Against R1
- Over 24 KB after D (body plus refs): `test-strategy` 89.6 KB plus 2 to 3 KB; `executive-communication` is 17.7 KB, about 19 KB after; `sales-conversations` is 28.7 KB already (over), plus 1.5 to 2 KB; `guardrails` goes from 15.7 KB to about 21 to 23 KB, close to 24 KB, and R3's tool table (DEC-8) lands in the same skill. `proposal-writing` about 16 KB and `meaningfy-voice` about 11.5 KB stay under; `contract-practice` about 10.5 KB stays under.
- Body over 6 KB after D: `guardrails` (13.3 KB), `executive-communication` (14.2 KB), `contract-practice` (8.7 KB, no refs, all in body), `proposal-writing` (7.1 KB), `sales-conversations` (7.1 KB), `test-strategy` (8.2 KB): all already over, D adds 1 to 2 KB to each body except where it goes to references. `meaningfy-voice` body is 1.95 KB and D puts its section in `references/channels/linkedin.md`, so it stays small.
- Generic knowledge R1 might cut from D's additions: the *Attacks* bullets are largely general review craft (a claim with no evidence, a term that reads two ways, an undefined term, a right given to one side). The Meaningfy-specific parts are the confirm-criteria-in-one-line rule, "leaves the company" test, two reads at most, the rule that the reader reports and does not rewrite, the unread marking, and the pick-up rule for unattended drafts. The brief text block in the new reference is a template; under R1 it could move to `assets/` where it costs no budget.
- Example code in skills: none. D adds example criteria and a worked example in prose (design Algorithm section; tasks do not say they enter the skills). Examples in skills would draw R1's DEC-7 attention only if they are copied from other projects; they are not.

### 4. Against R2
- New skills or agents the orchestrator would have to list: no new skill. One new agent, `adversarial-reader` (`agents/adversarial-reader.md`, DEC-13). R2 routes goals to skills and gives agents a one-line pointer; the reader agent needs none, but the goal "have a reader attack this draft" should route to `guardrails` (`references/adversarial-reader.md`). Not stated in either PLAN. R2's No-gos say "no new agent" for R2 itself, which does not forbid D's.
- Routing D adds on its own: five skills now route to `guardrails` for the reader (plain-text pointer in each *Review profile*; D-2), and the Succeeds/Fails/Attacks rule per kind of piece (D-3, which says which profile when two apply). This is a second routing table by kind of piece beside the orchestrator's by goal.
- Changes to skills R2 also touches:
  - `sales-conversations`: D adds a subsection under *Workflow*; R2 DEC-9 cuts 3 to 4 KB of restated author text from it and from `sales-qualification`. Same file, likely different regions; the order decides who rebases. D adds the reader to `sales-conversations` and R2's `negotiation` and `hundred-million-offers` pointers go into offer and negotiation text.
  - `sales-method-ownership` (living spec): D adds two requirements (offer profile owned by `proposal-writing`, sales-message profile owned by `sales-conversations`); R2 modifies the same capability (sales skills point to external method skills). Different requirements, same capability.
  - `proposal-writing`, `meaningfy-voice`, `executive-communication`, `contract-practice`: R2 does not edit them, but the orchestrator will route offer and messaging goals (`hundred-million-offers`, `storybrand-messaging`, `made-to-stick`) to them, so the orchestrator rows must mention the profile or the two will conflict (a draft made with an external skill still needs criteria and a reader; `generic-task-test-profiles/proposal.md` DEC-3).
  - `agents/proposal-writer.md`, `agents/sales-agent.md`: R2 adds a one-line pointer to the orchestrator in agents with external help; D already edits the same two agent bodies under a 40-line cap.

### 5. Against R3
| D decision | What it changes | R3 relation |
|---|---|---|
| DEC-5, D-1 (guardrails) | adds the reader brief in `guardrails` section 5 plus a new reference and a description edit | R3 edits `guardrails` too: Session hygiene (DEC-1), a new tools-by-activity table (DEC-8, DEC-9), batched reads (DEC-7). Same skill, different sections: a merge-order issue, not a contradiction. R3 No-go: "no description changes" applies to R3 only; D's 681 to 687 characters (D-23) stays valid unless R1 or another EPIC changes the description first. |
| DEC-12 and DEC-13, D-27 (reader tool list, thin agent) | the reader has `Read, Grep, Glob`, and the code tools (Serena, ast-grep, GitNexus) for code. The reference states both lists and the brief carries "Tools: ..., and no other." | R3 DEC-8 and DEC-9 create the one table of recommended tools per activity with real names for each CLI, and R3 adds a lint that checks the table against agents' tool lists. R3 absorbs D-27's naming: D's reference should cite the table, not hold its own list (single source). The owner already ordered worker tool lists outside any EPIC (cross-check decision 1). |
| DEC-9, D-5 (`Agent` tool on `proposal-writer` and `sales-agent`) | unscoped `Agent` in two agents | R3's lint of table against tool lists will see it. R3 itself changes only `implementer` and `code-reviewer` (Impact), so no direct edit overlap. |
| DEC-10 (scheduled sales runs may start the three reviewers) | a scheduled run can now verify | untouched by R3. |
| DEC-4, D-6 (reads: at most two; the author revises only what is theirs) | a loop limit of two reads | R3 DEC-4 (severity floor, one fix pass) is the same idea for stage reviews; no conflict, no overlap (different loops). |
| subagent-dispatch delta (D) | ADDED reader brief and "reader runs on what leaves the company"; MODIFIED *Every subagent returns the base report, extended per purpose* (an exception to the verdict) | R3 modifies the same capability for session hygiene and batched reads. Different requirements. Merge only. |
| DEC-4 (unattended runs get no criteria or reader) | scope of scheduled runs | untouched by R3. |
| D-27 and tasks 1.7 (measures the first-call tokens of each reader run with `session_digest.py`) | uses the retrospective script | R3 No-go: the two retrospective scripts are used as they are. Consistent. |
| `epic-delivery`, `epic-planning`, worker agents `implementer`, `code-reviewer`, review sets | not touched by D | untouched. D's tasks run on whatever stage loop exists; D's gating rule matches R3 DEC-2 (the owner wants at most two runs on a re-gate, `generic-task-test-profiles/design.md` Attack record, last paragraph). |

### 6. Order
- After A (delivered): D needs the matrix, the loop and the adversary stance (`generic-task-test-profiles/proposal.md`, Parents). Can start now.
- Independent of B and C (`generic-task-test-profiles/proposal.md`, Impact), but `test-suite-care/design.md` D-17 says D may land at any time after A, and `generic-task-test-profiles/design.md` D-26 says to rebase and take next free `CHK-` ids if C or E land first.
- After R3 (R3 DEC-17), because R3 puts the tool table in `guardrails` and the reader's tool list should cite it, and R3 changes `guardrails` and the briefs D reads.
- Before R2 if R2's orchestrator rows for offers, contracts, posts and messages are to name the profiles; otherwise R2 rows must be revised once D lands. Reason: the orchestrator's pointer to a skill must say what that skill now requires.
- Relative to R1: D's new text is Meaningfy rules (kept by R1) except the generic parts of the *Attacks* bullets; the cost of going first is rework only in `guardrails`, `executive-communication`, `sales-conversations` (already above budget), which R1 will rewrite. The heavy part, the new reference and the thin agent, is new files and costs nothing to move. D going first means R1 sees the profiles as existing house rules and cannot cut them; going second means D writes into an already lean skill and must fit its budget. The second is cheaper if R1 stages for these skills are close (sales and devops stages are R1's fourth and fifth; `guardrails` and `executive-communication` are in R1's stage 3 or 5, not stated).
- Free: nothing in D blocks on B, C, E.

### 7. Not read or not determined
- I did not read D's `inputs/qa.md`, `inputs/seed.md`, the scenarios section of the design (lines 427 to 490) or the Attack record in full; only the decisions, Algorithm brief and Delivery decisions.
- Size of the reader reference and of each profile section: estimates from the section list and the Algorithm brief (about 1 KB for the brief block).
- Whether R1 assigns `guardrails`, `executive-communication`, `contract-practice` to a stage: R1's proposal gives five stages but not per-skill order.
- Whether the `lean-skills` PLAN (not derived) will accept `guardrails` over its budget by exception.

---------------------------------------------------------------------------------------------------

## Cross-cutting
- Shared files C and D both edit: `skills/test-strategy/references/inventory.md` (new `CHK-` ids; C D-29, D D-10 and D-26), `skills/test-strategy/SKILL.md` and `tests/test_test_strategy.py` state (A's pointer test and C's `CLOSED_FAMILIES`), `tests/ownership.yaml`, `tests/trigger_probes.yaml`, `CHANGELOG`. D adds the thin agent `adversarial-reader` and the reader reference to `guardrails`; C edits `epic-planning` and `technical-writing`.
- R1 hazard for both: A's test `pointer_errors` demands the pointer lines in the owning skills match the matrix rows (`activity-test-profiles/design.md` D-10, D-26; `generic-task-test-profiles/design.md` D-10, D-15). R1 rewriting a skill must keep or regenerate those lines, and the `**Related:**` line of `architecture`.
- D-26 of C: `architecture`'s body is at the 650-line cap; R1 will cut it, which also frees the room C lacks.
