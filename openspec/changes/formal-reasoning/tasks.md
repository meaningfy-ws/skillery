<!-- PLAN (tasks half). PLAN = design.md + this file. Revision 2, 2026-10-29 (clarity gate: round 1 8.4, round 2 9.2 PASS). -->

> Derives from: EPIC `formal-reasoning` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).
> Gate for every task: `make validate` is green at its end. Run `make bundles` and `make skill-inventory`
> first when the task touches skills or `bundles.yaml`. Failure first: the group 1 fixtures are the
> recorded failure cases and the acceptance tests.

## 0. Precondition

- [ ] 0.1 Branch `feat/formal-reasoning` off `feat/reasoning-capabilities`. PLAN gated ≥ 9/10 by an independent subagent.

## 1. Failure cases and fixtures (red)

- [x] 1.1 Record the failure cases in `openspec/changes/formal-reasoning/inputs/failure-cases.md`. **F-1:** a prose answer about the spike playbook (`reasoning-capabilities/inputs/spike/`) that misses the dead rule. **F-2:** a prose answer about a recursive part-of closure that misses a transitive member. Each records the question, the wrong prose answer, the expected answer and the fixture that encodes it.
- [x] 1.2 Write the fixtures `tests/fixtures/formal-reasoning/`:
  - `clingo-conflict/` (the worked example, all passing);
  - `clingo-dead-rule/` (F-1): a paraphrased adaptation of `reasoning-capabilities/inputs/spike/playbook.lp`. Its test is `query="wins/1", mode="brave"`, expecting r1–r8. R9 is absent from the brave consequences, which means it is dead;
  - `clingo-fail/` (one wrong expectation);
  - `clingo-unsat/`;
  - `prolog-closure/` (F-2: the CQ worked example, tabled, base predicate `direct_part_of`);
  - `prolog-error/` (an unknown procedure, which must exit 2, not "no solutions");
  - `no-paraphrase/`;
  - `impure/` (a cut and an `assert`);
  - `bad-tests/` (malformed TOML).
- [x] 1.3 Write `tests/test_formal_reasoning.py` (red): one test per spec scenario of the requirements "Installation is separate from use", "Every run is test-first and paraphrased back" and "Competency questions…", using the D-8 exit codes. The Prolog tests skip without `swipl` unless `REQUIRE_ENGINES=1` (D-10).

## 2. Scripts (green)

- [ ] 2.1 `skills/formal-reasoning/scripts/check_env.py`: `--need clingo|prolog|any` (D-8, D-9). **Accept:** the spec scenario "SWI-Prolog is missing" (simulated by an empty `PATH`).
- [ ] 2.2 `skills/formal-reasoning/scripts/run_rules.py`: the steps of design §Algorithm and D-1…D-8, stdlib plus the engines only. **Accept:** all of group 1 green, with clingo and swipl present locally.
- [ ] 2.3 Add `clingo>=5.8` to `requirements-dev.txt`. In `.github/workflows/validate.yml`, add a `sudo apt-get update && sudo apt-get install -y swi-prolog-nox` step and the job env `REQUIRE_ENGINES: "1"` (D-10). **Accept:** the workflow YAML parses, and `make validate` is green locally.

## 3. The skill

- [ ] 3.1 Write `skills/formal-reasoning/SKILL.md`:
  - the frontmatter, with the facets purpose `modelling`, area `cross-cutting`, subject `modelling`, posture `precise`, stage `design`, maturity `experimental`, and a "Use this skill when …" description under 700 characters;
  - a Quick Start with the clingo worked example;
  - the loop: rules, tests, run, paraphrase, fix;
  - the engine choice in one table;
  - Gotchas built from the anti-patterns;
  - `## Boundary & Related Skills`, which names conceptual-modelling, linkml-engineering, modelling-conventions, bdd-gherkin, clarity-gate and epic-planning.
  
  **Accept:** under 300 body lines; the body_agnosticism gate is green.
- [ ] 3.2 Write the references:
  - `engines.md`: the engine table, the grounding guard, "when not to use an engine", and pointers to the install entries;
  - `patterns.md`: consistency and conflict (`conflict(R1,R2,Slot)` with `sit/2`, which names the rules and the situation), dead rule (missing from the brave consequences of `wins/1`), exceptions with priority, minimal fix (`#minimize`), closure, and CQ tests with the `agreed_by` and `agreed_on` fields, each as a minimal template;
  - `pure-subset.md`;
  - `rules-from-text.md`: clause ids, deontic classification, paraphrase-or-flag, cite the source clause, a source hash. It cites bdd-gherkin and clarity-gate for test and assumption work and does not restate them.
  
  **Accept:** every spec requirement is answered by a named section.
- [ ] 3.3 Write the templates `skills/formal-reasoning/templates/reasoning-project/`:
  - `README.md`: the layout `rules.*`, `facts.*`, `tests.toml`, `runs/`, citing the spine for the charter and decisions;
  - two runnable projects, `clingo/` (`rules.lp`, `facts.lp`, `tests.toml`) and `prolog/` (`rules.pl`, `facts.pl`, `tests.toml`).
  
  **Accept:** `run_rules.py` on each project exits 0.
- [ ] 3.4 Catalogue wiring (D-12):
  - `bundles.yaml` (meaningfy-architecture);
  - `served_by.skills` in `use-cases/UC-W20-conceptual-modeller.md`;
  - `dependencies.yaml` entries `clingo` (kind `framework`) and `SWI-Prolog` (kind `cli-tool`), each with every required field, the licence in `summary`, and `opencode_status: native`;
  - two probes in `tests/trigger_probes.yaml` (a positive one, and a near-miss of `conceptual-modelling`);
  - the `tests/ownership.yaml` capability (D-11);
  - one citing line each in conceptual-modelling and linkml-engineering;
  - then `make bundles` and `make skill-inventory`.
  
  **Accept:** `make validate` is green.

## 4. Docs

- [ ] 4.1 Add a CHANGELOG line for the installer and the engine install lines in `docs/environment/setup.md`. Add no README row: the skill is not an entry point, since the modelling skills cite it.

## 5. Review

- [ ] 5.1 Independent review of the implementation against the spec scenarios, the design decisions and the catalogue rules. The scenarios on engine routing ("A rule set with exceptions", "Closure over a large fact base", "Data conformance") and "An ambiguous clause" are judgement scenarios. They are checked by this review against the named sections of `engines.md` and `rules-from-text.md`, and by the trigger probes; that is the accepted test. Fix the findings, and keep `make validate` green.

## Roadmap

- [ ] 0.1 · [x] 1.1 · [x] 1.2 · [x] 1.3 · [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 4.1 · [ ] 5.1

## Verification

`make validate` (with `tests/test_formal_reasoning.py` passing and clingo and swipl present), `openspec validate formal-reasoning --strict`, and the clarity gate ≥ 9/10 on this PLAN.
