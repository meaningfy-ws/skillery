# Touch map: harden-checks-and-tests (B) and test-suite-care (E)

Read on the worktree `.claude/worktrees/delivery-process-and-tools` (B and E under `openspec/changes/`), R1 at `/home/lps/work/repos/skillery/openspec/changes/lean-skills/proposal.md`, R2 and R3 proposals in the worktree. Sizes are `wc -c` on 2026-11-14 (SKILL.md plus `references/*.md`; templates, assets and scripts are outside R1's 24 KB budget and are not counted). Sizes of new prose are my estimates from the PLAN's tables unless the PLAN states a figure; neither PLAN states any KB figure, so every KB figure below is "estimated by me".

Common current sizes (body / references / total prose, KB, from wc -c):
cosmic-python 21.4 / 105.5 / 126.9; project-setup 13.9 / 123.5 / 137.4 (plus 158.6 KB of templates and scripts, outside budget); epic-delivery 12.1 / 24.9 / 37.0; meaningfy-code-review 11.3 / 0 / 11.3; test-strategy 8.2 / 81.4 / 89.6 (inventory.md alone 43.5); bdd-gherkin 4.8 / 0 / 4.8; ci-cd-delivery 8.7 / 12.3 / 21.0. Every one of these except bdd-gherkin and ci-cd-delivery is already over 24 KB; every body except bdd-gherkin and ci-cd-delivery is already over 6 KB. So any addition to them is an addition to a skill R1 will rewrite.

Delivery waves from the reconciliation of the four test EPICs: `test-suite-care/design.md` "Delivery decisions" D-17 (B1, then B2, then C and E1 in either order, then B3; D any time after A; E2 and E3 after E1) and the cross-EPIC lines in `harden-checks-and-tests/tasks.md` tasks 1.4, 1.12, 2.4. The reconcile commit is `2b88829` on `origin/feature/reconcile-test-epics`; I used the text in the two designs, not that branch.

---

## EPIC B: harden-checks-and-tests

### 1. State
- Appetite VERY LARGE, three stages, one PR each (`proposal.md`, Appetite; `tasks.md` header).
- Gate: run 1 8.8 FAIL, run 2 9.0 PASS (two runs, "no margin") (`design.md` lines 868 to 886). D-28 and D-29 were added after the gate by owner decision and not re-gated (`design.md` line 893; `tasks.md` header). Scenario sign-off by the owner: "yes i accept everything", 2026-11-14 (`evidence/acceptance.md`).
- Tasks: 35 (stage 1: 1.0 to 1.16 = 17; stage 2: 2.1 to 2.7 = 7; stage 3: 3.1 to 3.11 = 11). Done: only 1.0 is ticked. Task 1.1 is part done (A merged, D-12 table walked, D-15); no stage branch cut. Nothing merged, nothing released. EPIC A is delivered and archived (D-14).
- Spec deltas: new `quality-checks`; modified `catalogue-governance`, `epic-delivery`; added requirements in `code-principles-governance`, `pr-review-modes`, `test-strategy`.

### 2. Touch table (path; what is added; new prose into skills; current prose size of the skill)
| Path | Added or changed | New skill prose (estimated by me) | Current size |
|---|---|---|---|
| `quality/` (new top-level folder: `semgrep/rules`, `report-only`, `suppressions`, `external.json`, `ls-lint/`, `checkmake/`, README) | new artifact type "Check" (D-1) | none in skills; README is the one prose file | not a skill |
| `skills/cosmic-python/references/principles-and-anti-patterns.md` | "Checked by" column on 3 catalogue tables, new entry `AP-SPARQL-FROM-STRINGS` (D-3, task 1.7, 1.12) | about 2 KB | 8.4 KB (file); skill 126.9 |
| `skills/cosmic-python/SKILL.md` | `*Checked by:*` suffix on the 10 clean-code and SOLID bullets (D-3, task 1.12) | about 1 KB | body 21.4 |
| `skills/cosmic-python/references/testing-checklist.md` | suffix on 16 items; item 10 extended with invariants, stateful, Schemathesis, CI profile (D-3, D-9, tasks 1.12, 2.5) | about 2 KB | 3.2 KB |
| `skills/cosmic-python/references/example-testing-patterns.md` | one worked stateful test and one Schemathesis test (D-9, task 2.5): example code | about 2 KB of code | 16.9 KB |
| `skills/project-setup/references/` : `config-files.md`, `decisions.md`, `ci-and-infra.md`, `architecture-guardrails.md`, `layout.md`, `checklists.md`, `modernizing-existing-projects.md` (new section "Adopting the shared checks") | wider Ruff, Suppressions heading, fetch and three check targets, weekly mutation workflow and setup note, import-contract grooming, migration steps (D-4, D-5, D-10, D-11, D-13; tasks 1.5, 1.13, 3.3, 3.6) | about 8 to 10 KB across the seven files | 12.9, 14.2, 13.8, 6.7, 9.9, 8.3, 12.0 KB; skill 137.4 |
| `skills/project-setup/assets/templates/` (`ruff.toml.tmpl`, `pyproject.toml.tmpl`, `Makefile.tmpl`, `dot-importlinter.tmpl`, `dot-gitignore`, `dot-pre-commit-config.yaml`, `ci.yaml.tmpl`, `ci/mutation.yml.tmpl`, `quality/{check_contracts,mutation_report,external_sources}.py`, `quality/tools.sha256`) and `scripts/scaffold.sh` | new targets, scripts, workflow | outside budget (templates, scripts) | not counted |
| `skills/epic-delivery/references/team-and-briefs.md` | tester brief replaced with methods and report fields; result line defined once under "What every brief names"; named in tester, reviewer, checker briefs (D-9, D-29, task 2.4) | about 1.5 KB | 6.7 KB; skill 37.0 |
| `skills/epic-delivery/references/stage-loop.md` | tester ledger row report rule; result-line rule; L3 ledger row moment (D-9, D-11, D-29, tasks 2.4, 3.4) | about 0.7 KB | 10.3 KB |
| `skills/epic-delivery/assets/workflows/epic-delivery.workflow.json` (and `docs/navigator/epic-delivery.workflow.json`) | `reviews.MEDIUM.tester` set to wording with condition (D-9, D-28, task 2.3) | data, not prose | outside budget |
| `skills/meaningfy-code-review/SKILL.md` | L3 lens text: judge import contracts once per EPIC; L1 lens names `AP-SPARQL-FROM-STRINGS` (D-11, tasks 1.7, 3.4) | about 0.8 KB | body 11.3 (no references) |
| `skills/test-strategy/references/software.md`, `inventory.md`, `architecture.md` (and pointer lines) | new and changed rows: static rules, Semgrep, ls-lint/checkmake, mutation, import contract, tester, Hypothesis, L3 `CHK-82`; remove "gap to B" sentence (D-12, D-15, tasks 1.14, 2.6, 3.7) | about 1.5 KB | 6.7, 43.5, 2.8 KB; skill 89.6 |
| `ci-cd-delivery` | "possibly" for the scheduled workflow (proposal Impact); the PLAN puts it in `project-setup` (D-10), so I count it untouched | 0 | 21.0 |
| agents | none. No agent file changes (proposal No-gos: "No new agent"); `tests/features/agents/code-reviewer.feature` gets three scenarios (task 3.4) | tests only | not counted |
| tools and repo | `tools/repo_lint/lint.py` (`TOP_LEVEL_FOLDERS`, `quality_files`), `tools/bundle_gen` (fourth rendered file), `Makefile`, `.github/workflows/validate.yml`, `tests/test_quality.py`, `tests/test_quality_properties.py`, `tests/fixtures/quality/`, `tests/features/epic-delivery.feature`, `requirements-quality.txt`, `dependencies.yaml`, `CONTRIBUTING.md` | code and tests | not counted |
| docs | `docs/development/governance.md` (six types), `AGENTS.md` (line 11, type table, "four rendered files"), `CLAUDE.md` (line 4), new `docs/development/quality.md`, `docs/development/releasing.md` step 2, `docs/practice/ai-coding/working-with-agents.md` (line 44), `README.md`, `CHANGELOG.md` | docs, not skills | not counted |
| mods | none; `make mods` is run, navigator reads the field as wording, no mod change (D-9, D-28) | 0 | n/a |
| specs | `openspec/specs/{quality-checks (new), catalogue-governance, epic-delivery, code-principles-governance, pr-review-modes, test-strategy}` via deltas | spec text | n/a |

Total new skill prose across the three stages: about 18 to 22 KB (my estimate), mostly in `project-setup` references.

### 3. Against R1 (`lean-skills`)
- Over 24 KB after B: cosmic-python (126.9 KB before, about 5 KB more), project-setup (137.4 KB, about 9 KB more), epic-delivery (37.0 KB, about 2 KB more), test-strategy (89.6 KB, about 1.5 KB more). All are over before B; B makes them larger, not newly over. meaningfy-code-review has no references, so its 11.3 KB is a body 5 KB over the 6 KB target; B adds about 0.8 KB to that body.
- Bodies over 6 KB after B: cosmic-python 21.4 (plus 1 KB), epic-delivery 12.1 (B touches references, the body only if a MEDIUM sentence is added), code-review 11.3 (plus 0.8), test-strategy 8.2 (rows are in references).
- What R1 would class as generic and cut: the Hypothesis technique in checklist item 10 (round trip, order independence, bounds, idempotence, `RuleBasedStateMachine`, Schemathesis calls; D-9 Technique); the Ruff selection rationale and the migration steps for existing projects in `modernizing-existing-projects.md` (D-13); likely the mutmut how-to in `ci-and-infra.md`. This is my judgement; R1 has not been run.
- Direct conflict: B D-3 adds `*Checked by:*` to the 10 clean-code and SOLID bullets of `cosmic-python/SKILL.md`; R1's "What Changes" says `cosmic-python` "loses ... its restatements of Clean Code, SOLID". B's tests TC-04 and TC-05 fail when a bullet has no value (D-3), so R1 deleting the bullets breaks B's lint unless B's grammar is changed. R1 DEC "ids must survive" (Rabbit-holes) protects the catalogue ids B uses.
- Example code: yes. Task 2.5 puts a stateful test and a Schemathesis test in `example-testing-patterns.md`. R1 DEC-7 removes copied example code from `cosmic-python`; these two examples are the kind R1 would drop or send to a `docs/` page.
- The new `quality/README.md` is a doc outside `skills/`, so R1's budget does not apply to it.

### 4. Against R2 (orchestrator)
- New skills or agents to list: none (proposal No-gos; D-1 has no skill). `quality/` is a Check, not a skill. External tools it adds (Semgrep, ls-lint, checkmake, mutmut, Hypothesis, Schemathesis) are registered in `dependencies.yaml` as tools, not as skills; the orchestrator routes to skills, so none to list.
- Routing B adds on its own: none. It extends the `test-strategy` pointer lines and matrix rows (D-12 A-8), which R2 DEC-2 says should not become a second routing table; R2 should read them, not copy them.
- B changes no description, so no trigger probes are needed (AGENTS.md rule applies only to description changes).

### 5. Against R3 (`delivery-process-and-tools`)
| B decision | What it changes | R3 relation |
|---|---|---|
| DEC-9 as revised and D-28 (tester at MEDIUM on a condition; `reviews.MEDIUM.tester`) | `epic-delivery` workflow file, spec requirement "The loop scales with the appetite", `epic-delivery.feature` MEDIUM row, tasks 2.1 to 2.3, 2.7 | Absorbed: R3 DEC-3 defines the condition once and says D-28 then cites it; R3 DEC-17. B D-28 and task 2.3 must be rewritten to cite R3, and its LARGE-and-above carve-out ("unchanged") differs from R3's "at every appetite". Task 2.3's field value is also touched by R3 DEC-5 (MEDIUM takes the small review set by default), a second change to the same JSON cell and the same spec requirement. |
| D-29 (result line `result: stage=... role=...`; `team-and-briefs.md` "What every brief names"; ledger returns a report without it as incomplete) | `team-and-briefs.md`, `stage-loop.md`, spec requirement "A challenge or check result ends in one line" | Untouched: R3 No-gos and DEC-17 leave it to B. Shared files with R3, so a rebase, not a conflict. |
| D-9 brief (methods, properties table, ROB and RSK per D-16), report check in the ledger | tester brief in `team-and-briefs.md` | Untouched in intent. R3 DEC-8 and DEC-9 add a tool table that briefs cite; the new brief should cite it, which B cannot do before R3 lands. |
| D-11 / task 3.4 (L3 judges import contracts once per EPIC; reviewer brief and ledger row name the last build stage) | reviewer brief and ledger row in `epic-delivery`, L3 lens | Untouched by decision, but R3 DEC-5 (small review set at MEDIUM) changes who takes L3 at MEDIUM; B D-20 already says "whoever takes L3 in the review set", so it survives. |
| D-25 (proposed): lead reads `tests/mutmut-results/` in the Prepare step and adds survivors to the builder's brief | `epic-delivery` Prepare step | Not decided yet; collides with R3 DEC-7 (lead batches or delegates reading). If kept, give it to a worker. |
| D-24 (proposed): old brief versus new brief on a seeded stage | evidence only | Untouched. |
| Docs: `AGENTS.md` line 11 and type table, "four rendered files" | `AGENTS.md`, `CLAUDE.md` | Same files as R3 DEC-11 and DEC-12 (impact check once per task, size budget); small-text rebase. |
- Not touched by B: `guardrails`, `epic-planning`, the two worker agent files, the instruction template. R3's `tools/repo_lint` budget check and B's `quality_files` lint both edit `tools/repo_lint/lint.py`; rebase only.

### 6. Order
- Before B: R3 (R3 DEC-17 says R3 goes first and B rebases; B stage 2 rewrites the cells R3 changes). EPIC A is already delivered.
- Stage 1 tool side (`quality/`, `lint.py`, `Makefile.tmpl`, `ruff.toml.tmpl`, Semgrep rules): free of R1, R2, R3, because it adds no skill prose. It must precede B2, E1's `requirements-quality.txt` reuse, and C (C adds `quality/vale/`).
- Stage 1 prose side (the "Checked by" suffixes in `cosmic-python`, the seven `project-setup` references): best after R1's cosmic-python pilot (R1 stage 2) and the `project-setup` stage, otherwise written twice, and the 10 SOLID bullets may be deleted by R1.
- B2 after B1 (the D-17 wave), after R3 (same files and the same JSON cell).
- B3 after B2, after C and E1 (D-17), because E1 and B2 both edit the tester brief and B3 closes the programme (E task 3.7).
- Free: B stage 1 tool side against R2 (R2 adds a new skill and edits sales skills, no overlap).

### 7. Not read or not determined
- Full text of B's `specs/*/spec.md` scenarios and `inputs/qa.md`, `inputs/seed.md`, `inputs/ruff-probe/`: not read beyond the requirement names.
- Sizes of new prose are my estimate; the PLAN states none.
- Whether `docs/` files B edits are over any limit: not measured (docs are outside R1).
- R3 has no `design.md`, `tasks.md` or `epic-delivery` spec delta yet (only `specs/activity-tools`), so the exact R3 wording against B's cells is not known. R1 and R2 have no PLAN either, so "what R1 cuts" is my reading of the proposal.
- The reconcile branch `feature/reconcile-test-epics` was not opened.

---

## EPIC E: test-suite-care

### 1. State
- Appetite VERY LARGE (widened from LARGE), three stages (`proposal.md`, Appetite).
- Gate: 9.05 on the fourth run, "with no margin" (`design.md` Gate record). That is four runs, over the two-run limit of R3 DEC-2 and owner decision 7 of `delivery-retrospective/inputs/cross-check-test-epics.md`; those apply to a re-gate from now on. D-35 and D-36 were added after the gate and not re-gated (`tasks.md` header).
- Tasks: 28 (stage 1: 1.0, 1.0b, 1.1 to 1.13 = 15; stage 2: 2.1 to 2.6 = 6; stage 3: 3.1 to 3.7 = 7). Nothing delivered; the stage 1 sign-off (task 1.0) has no `evidence/` folder yet. The change folder has no `evidence/` directory.
- Spec deltas: new `test-suite-care`; added requirements in `epic-delivery`, `test-strategy`, `code-principles-governance`.

### 2. Touch table
| Path | Added or changed | New skill prose (estimated by me) | Current size |
|---|---|---|---|
| `skills/test-suite-care/SKILL.md` (new skill, bundle `meaningfy-building`) | Quick Start, five steps, three classes, Gotchas, Boundary; target 150 lines (D-1) | about 6 to 8 KB | new |
| `skills/test-suite-care/references/` : `measuring.md`, `scenario-map.md`, `waste.md`, `report.md` (stage 1); `ui-suites.md` (stage 2); `non-code-checks.md` (stage 3) | new reference files (D-1, D-4 to D-7, D-9, D-11) | about 18 to 22 KB in total | new |
| `skills/test-suite-care/scripts/phase_times.py`, `overlap.py` | new scripts (D-3) | outside budget | n/a |
| `skills/cosmic-python/references/testing-checklist.md` | amend rules 6 and 14, add rules 17 to 21 and a Sources table; later scope rule 11 (D-8, D-19, D-23; tasks 1.6, 2.3) | about 2 KB (rules) plus about 1 KB (Sources) | 3.2 KB; skill 126.9 |
| `skills/bdd-gherkin/SKILL.md` | one check box "No step joins two actions with 'and'" (D-8) | about 0.1 KB | 4.8 (body) |
| `skills/test-strategy/references/inventory.md`, `software.md`, `ui.md`, `cross-cutting.md` and the pointer line | new `ADQ` rows and two `CHK-` ids; "rules 1-16" to "rules 1-21"; lanes in the Moment cell (D-13, D-22) | about 1.5 KB | 43.5, 6.7, 1.5, 7.3 KB; skill 89.6 |
| `skills/epic-delivery/SKILL.md` (step 4 sentence), `references/team-and-briefs.md` (tester report fields), `references/stage-loop.md` (step 4 detail, ledger row "Distilled in step 4") | distilling rule; builder sorts, lead confirms (D-12, D-35) | about 1.2 KB | 12.1 body; 6.7; 10.3 |
| `skills/project-setup/` : `assets/templates/root/pytest.ini`, `Makefile.tmpl`, `assets/templates/tests/changed.py`, `scripts/scaffold.sh`, `references/testing-setup.md` ("Developer lanes"), `config-files.md`, `layout.md` | `slow` marker, `test-fast`, `test-changed`, `profile-tests`, changed-files script, reference text (D-10, D-26, D-27; task 1.8) | about 2.5 KB prose; rest templates and script outside budget | testing-setup 7.4, config-files 12.9, layout 9.9 KB; skill 137.4 |
| `skills/ci-cd-delivery` | not touched (corrected by the PLAN, proposal DEC-6) | 0 | 21.0 |
| agents | none (proposal Impact: "no agent file changes"); `tests/features/agents/team-lead.feature` gets an Examples row | tests only | n/a |
| tests and registration | `tests/test_test_suite_care.py` (T-1 to T-15), `tests/trigger_probes.yaml` (probes in stages 1 to 3), `tests/features/epic-delivery.feature`, `bundles.yaml`, `use-cases/UC-W18-programming-team-lead.md`, README rows, `CHANGELOG.md`, `docs/skill-inventory.md`, `openspec/changes/harden-checks-and-tests/tasks.md` (up to two lines added by the lead) | not skill prose | n/a |
| mods | none | 0 | n/a |
| specs | `openspec/specs/{test-suite-care (new), epic-delivery, test-strategy, code-principles-governance}` | spec text | n/a |
| other repositories | `rdf-persistence`: map, report, approved reductions (D-14); stage 2 trial repo named at sign-off; stage 3 trial on `technical-writing`'s cold reader | not skillery | n/a |

Total new skill prose across stages: about 30 to 36 KB (my estimate), of which about 24 to 30 KB is the new skill itself.

### 3. Against R1
- Over 24 KB after E: the new `test-suite-care` skill, by my estimate about 24 to 30 KB (SKILL.md target 150 lines plus six reference files); it is at or over the budget on day one, and its SKILL.md body is near or over 6 KB. The PLAN gives no byte figure, so this is the largest unknown. Also over after E: cosmic-python, project-setup, epic-delivery, test-strategy (all over before; E adds about 3.5, 2.5, 1.2, 1.5 KB respectively).
- Bodies over 6 KB: epic-delivery body (12.1 KB, plus one sentence), the new SKILL.md possibly.
- Generic knowledge R1 would cut: checklist rules 17 to 21 with their Sources table (Meszaros, testsmells.org, Vocke, Google's Software Engineering; D-8) are published test-smell knowledge; the six UI rules in `ui-suites.md` restate Cypress and Playwright documentation (D-9); the measurement commands in `measuring.md` are generic pytest and coverage usage; much of `waste.md` (W-1 to W-8) is published smell catalogue. What is Meaningfy's own and stays: the scenario map, the proposal classes, the owner-decides rule, the distilling rule, the non-code check assessment (planted flaws, three runs).
- Example code: the skill is Quick Start with "one worked example" (D-1) and holds scripts (outside budget). No example code is added to an existing skill.
- Process fit: if E1 is written before R1 stage 1 lands, the skill must be reassessed by R1 stage 3; if after, it can be written to the lean shape once.

### 4. Against R2
- New skill: `test-suite-care` (meaningfy-building). The orchestrator must list it as the destination for "make our test suite quicker, which tests can we drop, is this reader any good". It also needs the two neighbours E names in its probes: `cosmic-python` (write tests), `test-strategy` (choose checks), `guardrails` / EPIC D (adversarial reader) (tasks 1.5, 3.3).
- No agent. No routing added by E itself except a pointer line in the new SKILL.md to `test-strategy` ("Answers ADQ in test-strategy's matrix", D-13). R2's DEC-4 one-line pointer to the orchestrator from skills that have external help would go in this skill too; E has no external skill help.
- Trigger probes: E ships three positives and three near-misses (D-16); R2's description must be probed against them (R2 Rabbit-hole "a description that fires on everything").

### 5. Against R3
| E decision | What it changes | R3 relation |
|---|---|---|
| DEC-3 as revised, D-12, D-35 (distilling in step 4: builder sorts tests, lead confirms lists, builder returns a recommendations list; second run of the full gates after) | `epic-delivery` SKILL.md step 4, `stage-loop.md` step 4 and ledger row, tester brief report fields, `epic-delivery.feature`, `team-lead.feature` | Same paragraph R3 DEC-4 rewrites (severity floor, one fix pass checked by the gate). Consistent in spirit with R3 DEC-7 (lead does not build). "Second run of the full gates" could read as a second fix pass against DEC-4; needs a sentence of agreement. Untouched by decision, needs reconciliation of text. |
| D-18 (tester ledger cell and brief if B2 landed) | tester row | Follows B2, which follows R3. |
| D-31 (distilling is not the audit) | wording | Untouched. |
| D-35 "lead copies the Recommendations list into the PR" | lead duties | Small addition against R3 DEC-7 (batched reads, small lead); acceptable as the lead only copies. |
| D-36 (cost numbers read from the two retrospective scripts) | `non-code-checks.md` step 4 | Untouched: R3 No-gos keep the two scripts as they are, which E relies on. |
| D-8 / D-10 testing rules and lanes | cosmic-python, project-setup | Untouched by R3 (R3 touches only project-setup's agentic templates). |
- Not touched by E: `guardrails`, `epic-planning`, worker agent files, instruction template. E's result line: none (E defers to B D-29, D-35).

### 6. Order
- Before E: R3 (R3 DEC-17; E1 edits the same step 4 text). B stage 1 and B stage 2 (E D-17: B1, B2, then E1; D-8, D-12 and tasks 1.12 and 2.4 of B carry the lines for the other order, so E1 may also land first, but both orders cost a reconcile). EPIC A delivered.
- E stage 1 should come after R1 stage 1 (standard and lint) so the new skill is written lean once, and after R1's cosmic-python pilot if the checklist edits are to avoid a rebase; after R2 only if the orchestrator's goal rows must name `test-suite-care` at once (otherwise R2 can add the row later).
- E must precede: B stage 3 (D-17: C and E1 first, then B3), and the programme closing check (E task 3.7, run by whichever of E and B3 lands last).
- Free: E stages 2 and 3 are independent of B, C, D (proposal Impact, D-17) and only need E1. Stage 3 trial (cold reader of `technical-writing`) also depends on nothing in R1 to R3.

### 7. Not read or not determined
- Not read in full: `design.md` D-2 to D-7 and D-9 detail beyond the lines I cite, `specs/test-suite-care/spec.md` scenarios, `inputs/qa.md`, `inputs/seed.md`, `inputs/spike.md`.
- The skill's real size is undetermined; my 24 to 30 KB is an estimate from the D-1 table and the content of D-4 to D-11.
- R3 has no PLAN, so the wording conflict with step 4 is judged from the proposal only.
