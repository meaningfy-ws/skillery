<!-- PLAN (design half). PLAN = this file + tasks.md. Revision 2, 2026-10-29: clarity gate round 1
     scored 8.4, round 2 9.2 (PASS). All 15 gaps were applied; the experiments that found them are noted inline. -->

> Derives from: EPIC `formal-reasoning` ([`proposal.md`](proposal.md)), golden-thread parent
> [`reasoning-capabilities`](../2026-10-29-reasoning-capabilities/proposal.md). Acceptance criteria are the scenarios in
> [`specs/formal-reasoning/spec.md`](specs/formal-reasoning/spec.md).

## Context

- No skill in the catalogue runs a logic engine. The modelling skills generate and check OWL/SHACL only
  (overlap audit, `reasoning-capabilities/inputs/2026-10-28-catalogue-overlap-audit.md`).
- The owner decided to keep two engines, each for its kind of reasoning (DEC-1). Installation is kept
  separate from use (DEC-2). There is one skill, in meaningfy-architecture (DEC-3).
- Facts that shape the design (`reasoning-capabilities/inputs/2026-10-28-external-verification.md`):
  - clingo 5.8.2 installs from pip on every OS and has an embeddable Python API.
  - SWI-Prolog needs a system install (apt, brew, conda linux-64). janus-swi also needs a system
    swipl and a C compiler.
- Precedents in this repo:
  - shipped executables live in the owning skill's `scripts/` and are tested from `tests/` by path
    (`tests/test_devops_check_stack.py`);
  - a skill's script dependency goes into `requirements-dev.txt` so CI can test it (`linkml` for
    `linkml-engineering`);
  - CI is `.github/workflows/validate.yml` on Python 3.11.

## Goals / Non-Goals

**Goals:**
- The agent picks the right engine and runs a test-first, paraphrased reasoning loop with one command.
- A failing expected answer, a rule without a paraphrase, and impure Prolog are all caught by the script,
  not by prose discipline.
- Competency questions are executable tests whose answers were agreed beforehand.

**Non-Goals:**
- **Proof trees.** clingo gives no derivations, and a Prolog meta-interpreter breaks under tabling. Paraphrase plus expected answers is the audit in this version (O-1).
- **SPARQL execution.** Conformance and RDF queries stay with the modelling skills' toolchain (DEC-6).
- **Installing engines.** Bundling them, or wrapping them in a service or MCP, is also out (proposal no-gos).

## Decisions

- **D-1 Engine by file extension.** `rules.lp` runs on clingo and `rules.pl` on SWI-Prolog. There is no engine flag, since the file already says which language it is.
- **D-2 clingo in-process, Prolog as a subprocess.**
  - clingo runs through its Python API, imported lazily so that Prolog-only users need no clingo.
  - SWI-Prolog runs as `swipl` in a subprocess, with no janus-swi, because janus needs a C build.
  - Each Prolog test gets a timeout (default 30 s).
- **D-3 Tests in TOML.** `tests.toml` is parsed with the stdlib `tomllib` (Python ≥ 3.11), so the scripts need nothing beyond the engines. YAML would need PyYAML on the user's machine.
- **D-4 One test format for both engines.** `[[test]]` entries carry:
  - `id`;
  - an optional `question` (the natural-language competency question);
  - `query`;
  - `expect`;
  - optional `mode`;
  - optional `agreed_by` and `agreed_on`.

  - **Prolog:** `query` is a goal, and the expected answer is the set of solutions printed with `writeq`. `expect = "UNSAT"` and `expect = []` mean the same thing: no solution.
  - **clingo:** `query` is a predicate signature `name/arity`, and the expected answer is the set of matching atoms, taken from `m.symbols(atoms=True)` so that a user's `#show` cannot hide them. `mode` is `cautious` (true in all answer sets, the default) or `brave` (true in some). `expect = "UNSAT"` asserts that the program has no answer set.
  
  Comparison is order-insensitive and whitespace-insensitive in both engines.
- **D-5 Paraphrase comments.**
  - Every rule needs a `%% ` comment line directly above it, possibly as several `%%` lines.
  - In `.pl`, a rule is a statement with `:-` after its head. A statement that *starts* with `:-` is a directive (for example `:- table p/2.`) and is exempt.
  - In `.lp`, a rule is a statement containing `:-`, which includes constraints that start with `:-`, or a choice rule (`{…}`). Plain facts and `#` directives are exempt.
  - **Facts never define a predicate that has rules.** Consulting `facts.pl` after `rules.pl` silently redefines that predicate (verified on swipl 10.0.2, gate round 1). Facts use base predicates such as `direct_part_of/2`, and a paraphrased rule lifts them. `pure-subset.md` states this rule.
  - The run prints each paraphrase beside its rule's first line. Paraphrase-back is thereby a mechanical gate, not a promise.
- **D-6 The pure Prolog subset**, checked lexically outside comments and quoted atoms:
  - no `!`;
  - no `assert`, `asserta`, `assertz`, `retract` or `retractall`;
  - no `nb_setval` or `b_setval`.

  `:- table` directives are allowed and recommended for recursion.
- **D-7 The grounding guard.**
  - After solving, the report prints the number of ground rules and atoms (`ctl.statistics['problem']['lp']['rules'|'atoms']`), the time (`['summary']['times']`), and the peak memory. Memory comes from `resource.getrusage`, `RUSAGE_CHILDREN` for swipl, with `ru_maxrss` normalised to MiB (KiB on Linux, bytes on macOS).
  - The statistics are read **only after `solve()`**; read before it, they are zero (verified, gate round 1).
  - Before grounding, if the facts file has more than 10,000 statements and the engine is clingo, the run warns that the input is row-scale and suggests Prolog. The run goes ahead anyway.
- **D-8 Exit codes.**
  - 0: every test passed.
  - 1: a test failed.
  - 2: input refused (missing paraphrase, impure Prolog, unparseable tests, unknown extension).
  - 3: the engine is missing.

  These are the same codes as `check_env.py --need`.
- **D-9 Install hints in the scripts.** A hint is one line per engine that names the `dependencies.yaml` entry. It does not copy the install procedure: `dependencies.yaml` and the environment docs stay the single source.
- **D-10 Test dependencies.**
  - `clingo>=5.8` goes into `requirements-dev.txt`.
  - CI runs `sudo apt-get update && sudo apt-get install -y swi-prolog-nox`, and sets `REQUIRE_ENGINES: "1"` as the job's `env`.
  - The scripts need Python ≥ 3.11 (`tomllib`). That is stated in the skill and in the `dependencies.yaml` entries.
  - Prolog tests skip when `swipl` is absent locally, but fail when `REQUIRE_ENGINES=1`, which CI sets, so CI cannot silently skip them.
- **D-11 CQ testing is a pattern of this skill** (proposal DEC-4). conceptual-modelling and linkml-engineering each gain one citing line, and a new `tests/ownership.yaml` capability `competency-question-tests` (owner `formal-reasoning`, claim pattern `agreed_by`) guards the single source.
- **D-12 Catalogue wiring.**
  - `formal-reasoning` joins `served_by.skills` in `use-cases/UC-W20-conceptual-modeller.md`, as the `use_case_coverage` lint requires (`tools/repo_lint/lint.py:346`).
  - The facets are area `cross-cutting` (reasoning serves modelling, requirements and rule work alike, not only coding) and stage `design`.
  - `dependencies.yaml` entries carry every required field: `name, kind, summary, source, pin, provenance, used_by, opencode_status, claude_install, opencode_install`. The licence goes in `summary` (there is no licence key), and `opencode_status` is `native`.

## Algorithm / approach

`run_rules.py <project-dir> [--facts FILE] [--tests FILE] [--json]` works through these steps:

1. **Locate the files.** Rules: exactly one of `rules.lp` or `rules.pl`. Facts: the matching `facts.lp` or `facts.pl`, if present. Tests: `tests.toml`.
2. **Lint the rules file.** Check paraphrases (D-5) and, for Prolog, purity (D-6). Exit 2 on any finding, listing all of them.
3. **Run the engine.**
   - **clingo:** `Control(["0", f"--enum-mode={mode}"])`; add the rules and facts; ground; solve, keeping the last model (the consequences); **then** read the statistics (D-7). There is one control per mode used, so the program is grounded at most twice.
   - **Prolog:** for each test, run `swipl -q -g "consult(rules), [consult(facts),] forall((<query>), (writeq(<query>), nl)), halt" -t "halt(1)"`, with the working directory set to the project folder. `consult(facts)` is included only when `facts.pl` exists. There is a timeout per test.
     - Exit 2 if swipl exits non-zero, or if its stderr contains `ERROR:` or `Warning:`. Every swipl warning refuses the run, singleton-variable and discontiguous warnings included; `pure-subset.md` lists this. An unknown procedure or a syntax error must never be read as "no solutions" (verified, gate round 1).
     - A clean run with empty output is the no-solution answer.
4. **Compare** each test's answer with `expect` (D-4).
5. **Report.**
   - A header with the engine, its version, the time, the memory and the grounding size.
   - The paraphrase table.
   - One line per test: `PASS id: <answer>`, or `FAIL id ["<question>"]: expected … got …`. The question appears when the test has one, which is how a failing competency question is named.
   - The summary.
   
   `--json` prints the same data as one JSON object.
6. **Exit** with the codes of D-8. The run is a pure function of its input files and is safe to repeat.

**Worked example (clingo).** A `rules.lp` with:

```
%% A public client is priced at a fixed price.
pricing(fixed) :- client(public).
%% A tender is priced in time and materials.
pricing(tm) :- channel(tender).
%% Two pricing decisions conflict.
conflict :- pricing(X), pricing(Y), X < Y.
```

Its `facts.lp` holds `client(public). channel(tender).` The test `{id="T1", query="conflict/0", expect=["conflict"]}` passes and reports 5 ground rules. A test expecting `[]` fails, with exit 1.

**Worked example (Prolog CQ).** A `rules.pl` with:

```
:- table part_of/2.
%% A direct part is a part.
part_of(X, Y) :- direct_part_of(X, Y).
%% A part of a part is a part of the whole.
part_of(X, Z) :- part_of(X, Y), part_of(Y, Z).
```

The facts in `facts.pl` are `direct_part_of(lot1, t1). direct_part_of(item3, lot1).` The test `{id="CQ-1", question="Which items belong to tender t1?", query="part_of(X, t1)", expect=["part_of(lot1,t1)", "part_of(item3,t1)"], agreed_by="domain expert", agreed_on="2026-10-29"}` passes.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Ask the model to "reason carefully" about a rule set | Run it in an engine with tests | LLM proofs collapse on hard cases (about 32%, ISWC OntoLM) |
| Write expected answers after running | Agree them first (`agreed_by`, `agreed_on`) | Otherwise the test certifies whatever the code says |
| Use cut or `assert` "for speed" | Use `:- table` and pure clauses | Order-dependent code hides wrong answers |
| Load a 1M-row CSV into clingo | Prolog, or the data's own store | Grounding blow-up (D-7) |
| Restate the install steps in the skill | Point to `dependencies.yaml` | Single source (DEC-2) |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| Engine missing | lazy import fails, or `shutil.which("swipl")` is None | exit 3, with the D-9 hint |
| Rule without a paraphrase | D-5 lint | exit 2, listing every offending line |
| Impure Prolog | D-6 lint | exit 2, naming the construct and its line |
| Syntax error in the rules, or unknown procedure | the clingo exception; swipl exits non-zero, or its stderr has `ERROR:`/`Warning:` | exit 2, with the engine's message. Never read as "no solutions" |
| Facts redefine a ruled predicate | swipl prints `Redefined static procedure` (a `Warning:`) | exit 2; `pure-subset.md` explains the base-predicate pattern |
| Prolog query loops | subprocess timeout | test FAIL "timeout after N s", and the run continues with the next test |
| Grounding too large | statistics after solving (D-7); D-7 pre-check | warning in the report; the run is never silently aborted |
| Malformed `tests.toml` | a `tomllib` error or a missing key | exit 2, naming the test index |
| Run repeated | inputs unchanged | same output (pure, idempotent) |

## Risks / Trade-offs

- **[Lexical lints can be fooled]** (for example `!` inside a string). → They skip quoted atoms and comments; a false positive is reported with its line so the author can see it. Acceptable for a guard.
- **[SWI-Prolog in CI adds an apt step]** of about 20 s. → It is accepted, and it is the only system package.
- **[`writeq` output formatting]** differs between SWI-Prolog versions in operator spacing. → Whitespace is normalised before comparison (D-4).

## Open Questions

- **O-1** Is a Prolog `--explain` (meta-interpreter proof tree, untabled predicates only) worth adding after the first real use? It is parked, not guessed.

## Implementation notes

- **2026-10-29, D-4 (`#show` and consequences).** Reading `m.symbols(atoms=True)` does not stop a
  user's `#show` from hiding answers. In `brave` and `cautious` mode clasp computes consequences only
  over the shown atoms, so on the spike playbook (`#show conflict/3. #show sit/2.`) the brave
  consequences of `wins/1` came back as four rules, not eight (clingo 5.8.2). The smallest fix:
  `run_rules.py` appends `#show name/arity.` for every queried signature before grounding. Reading
  `atoms=True` is kept.
- **2026-10-29, Algorithm step 3 (`#minimize` and consequences).** With an optimisation statement,
  `Control(["0", "--enum-mode=<mode>"])` computes consequences over every model met on the way to the
  optimum, and clingo warns that they "may depend on enumeration order". The minimal-fix pattern then
  reported a cost-2 fix as part of the smallest one. The control now also gets `--opt-mode=optN`, so
  consequences range over the optimal answer sets only; without optimisation the flag changes nothing.
  Guarded by the fixture `clingo-minimal-fix/`.
- **2026-10-29, D-5 amended after review (task 5.1).** The run prints each paraphrase beside the
  rule's *whole statement*, not its first line, so the body of a multi-line rule is shown too. The
  lint now ends a statement at a `.` followed by whitespace, a comment or the end of the line (a
  second rule on a line needs its own paraphrase, which only a line above the first can give, so it
  is refused), treats only `"` as a quote in `.lp` (`a'` is a name), skips Prolog character codes
  (`0'a`), and refuses block comments. A clingo query on a signature the program never uses is
  refused (exit 2) through clingo's "no atoms over signature" message, as Prolog refuses an unknown
  procedure. Explicit `--facts` and `--tests` paths must exist and are made absolute. A Prolog query
  is wrapped as `writeq((Query))`, so a conjunction prints whole.
