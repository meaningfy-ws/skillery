# Software: the matrix

Checks on code, tests, projects and their delivery. The technique stays with its owner (the Python testing checklist in `cosmic-python`, Gherkin in `bdd-gherkin`, the briefs in `epic-delivery`); this file only says which check answers which question, with what tool, when, and who decides. A check that answers two questions has two rows. `gap → B` rows are filled by the EPIC `harden-checks-and-tests`.

| Question | Check | Technique owner | Tool | Moment | Decided by | Status |
|---|---|---|---|---|---|---|
| VAL | CHK-26 Acceptance demo | `epic-delivery` | the use case, run live | after the last build stage | the developer | exists |
| VAL | CHK-13 Review lens L2, spec conformance | `meaningfy-code-review` | reviewer subagent | per stage, on the PR | the developer, on the findings | exists |
| VER | CHK-1 Test-first loop | `superpowers:test-driven-development` (external) | the test runner | each task | the verifier | exists |
| VER | CHK-2 Testing checklist | `cosmic-python` | pytest | writing and reviewing tests | the verifier | exists |
| VER | CHK-3 Test tiers and markers | `project-setup` | `--strict-markers`, marker hook | each test | the verifier | exists |
| VER | CHK-6 One-minute structure check | `cosmic-python` | reading | per function or class | the verifier | exists |
| VER | CHK-7 Code review against standards | `cosmic-python` | reading | before PR approval | the verifier | exists |
| VER | CHK-8 Import-linter guardrails | `project-setup` | `make check-architecture` | commit; CI | the verifier | exists |
| VER | CHK-9 Quality pyramid and Makefile gates | `cosmic-python` | `make` targets | commit; CI; after scaffolding | the verifier | exists |
| VER | CHK-10 Traceability check | `bdd-gherkin` | scenario-to-test comparison | before each PR | the checker | exists |
| VER | CHK-11 Gherkin quality checks | `bdd-gherkin` | checklist | after writing features | the verifier | exists |
| VER | CHK-13 Review lens L2, tests and docs agree | `meaningfy-code-review` | reviewer subagent | per stage, on the PR | the verifier | exists |
| VER | CHK-14 Review lens L4, clean code | `meaningfy-code-review` | reviewer subagent | per stage, on the PR | the verifier | exists |
| VER | CHK-15 Review lens L5, fit and refactoring | `meaningfy-code-review` | reviewer subagent, impact tool | per stage, on the PR | the verifier | exists |
| VER | CHK-16 Review procedure per lens | `meaningfy-code-review` | five lens subagents | before the PR | the verifier | exists |
| VER | CHK-18 Checker brief | `epic-delivery` | fresh checker subagent | once per stage, after fixes | the checker | exists |
| VER | CHK-19 Reviewer brief | `epic-delivery` | read-only reviewer subagent | once per stage, on the PR | the verifier | exists |
| VER | CHK-20 Narrow checks and task gate | `epic-delivery` | `make` targets | per edit; per task | the verifier | exists |
| VER | CHK-21 The lead's full gates | `epic-delivery` | `make` targets | before the PR; after the fix round | the verifier | exists |
| VER | CHK-22 Diff reading | `epic-delivery` | the lead reads the diff | each task | the verifier | exists |
| VER | CHK-23 Failing-tests fixer round | `epic-delivery` | fixer subagent, failing tests only | after a failing run | the verifier | exists |
| VER | CHK-25 Clean-tree check | `epic-delivery` | `git status` | before the fix round | the verifier | exists |
| VER | CHK-27 Library dependency rule | `epic-delivery` | L3 lens, reviewer brief | build; review | the verifier | exists |
| VER | CHK-28 CI on each push | `project-setup` | CI jobs on `make` targets | each push | the verifier | exists |
| VER | CHK-29 Spec-projection validation and modernisation verify | `project-setup` | `openspec validate`, `make` | project setup; modernisation | the verifier | exists |
| VER | CHK-30 Scaffold Definition of Done | `project-setup` | checklist, `make check-all` | after scaffolding | the verifier | exists |
| VER | CHK-31 Modernisation gap assessment | `project-setup` | `scaffold.sh --dry-run`, rubric | modernising a repository | the verifier | exists |
| VER | static rules for every catalogue entry (Ruff, Semgrep, "Checked by" column) | `cosmic-python` | none yet | none yet | the verifier | gap → B |
| VER | the import-contract check on every PR | `project-setup` | none yet | none yet | the verifier | gap → B |
| ADQ | CHK-2 Testing checklist | `cosmic-python` | pytest | writing and reviewing tests | the checker | exists |
| ADQ | CHK-4 Coverage gate | `project-setup` | `fail_under = 80` | CI | the checker | exists |
| ADQ | CHK-11 Gherkin quality checks | `bdd-gherkin` | checklist | after writing features | the checker | exists |
| ADQ | CHK-13 Review lens L2, testing contract | `meaningfy-code-review` | reviewer subagent | per stage, on the PR | the checker | exists |
| ADQ | CHK-18 Checker brief | `epic-delivery` | fresh checker subagent | once per stage, after fixes | the checker | exists |
| ADQ | CHK-31 Modernisation gap assessment | `project-setup` | 13-dimension rubric | modernising a repository | the checker | exists |
| ADQ | whether the tests bite (mutation testing) | `cosmic-python` | none yet | none yet | the checker | gap → B |
| ROB | CHK-5 Property-based tests | `cosmic-python` | Hypothesis | writing tests | the adversary | exists |
| ROB | CHK-12 Review lens L1, security and safety | `meaningfy-code-review` | reviewer subagent | per stage, on the PR | the adversary | exists |
| ROB | CHK-17 Adversarial tester brief | `epic-delivery` | tester subagent | once per stage, where the review set names it | the adversary | exists |
| ROB | stateful and contract-driven properties for the tester | `epic-delivery` | none yet | none yet | the adversary | gap → B |
| CLR | whether a reader can act on the code and its tests | none yet | none yet | none yet | the cold reader | gap → none yet |
| RSK | CHK-12 Review lens L1, security and safety | `meaningfy-code-review` | reviewer subagent | per stage, on the PR | the adversary | exists |
| RSK | CHK-24 Impact check in Prepare | `epic-delivery` | the project's impact tool | per stage, before the first build | the developer, on a high or critical result | exists |
| RSK | CHK-25 Clean-tree check | `epic-delivery` | `git status` | before the fix round | the checker | exists |
| RSK | CHK-27 Library dependency rule | `epic-delivery` | L3 lens, reviewer brief | build; review | the checker | exists |
