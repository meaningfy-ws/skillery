---
name: formal-reasoning
description: "Use this skill whenever a question has an exact answer an engine can check and clingo or SWI-Prolog is installed: a quick test of a few facts and rules, conflicts or dead rules in a rule set with defaults and exceptions, a minimal fix, closure or lineage over a knowledge base, competency questions run as tests with agreed answers, or rules derived from a text. It picks the engine (clingo for finite rule sets, SWI-Prolog with tabling for large fact bases) and runs a test-first, paraphrase-back loop. Not for checking data against a model (linkml-engineering), building the model (conceptual-modelling) or keeping the user's own work rules (rulebook)."
license: Apache 2.0
metadata:
  purpose: modelling
  area: cross-cutting
  subject: modelling
  posture: precise
  stage: design
  maturity: experimental
---

# Formal Reasoning

Agents reason in prose, and prose reasoning about rules goes wrong without anyone seeing it. On
hard cases LLM-written proofs are right about a third of the time, while an agent that runs a solver
and reads its feedback gets them right. This skill gives the agent two engines and a loop: write the
rules, write the tests with their expected answers, run, read the paraphrases back, fix.

Use it for a quick test in any work, not only modelling: whenever a question has an exact answer and
an engine is installed, a few facts, rules and one test answer it in a minute.

The scripts need Python 3.11 or later and the engine. They never install anything:
`python scripts/check_env.py` says which engines are present. With no engine, say in one line which
engine would answer and where its install line is, and stop: never present prose reasoning as checked.

## Quick Start

**Input:** "Do our pricing rules conflict for a public tender?"

1. Copy [`templates/reasoning-project/clingo/`](templates/reasoning-project/clingo/) to a project
   folder ([the template README](templates/reasoning-project/README.md) has the layout and a Prolog
   twin). Write the rules in `rules.lp`, each with a `%%` paraphrase line above it:

   ```
   %% A public client is priced at a fixed price.
   pricing(fixed) :- client(public).
   %% A tender is priced in time and materials.
   pricing(tm) :- channel(tender).
   %% Two pricing decisions conflict.
   conflict :- pricing(X), pricing(Y), X < Y.
   ```

   The facts go in `facts.lp`: `client(public). channel(tender).`
2. Write the test in `tests.toml` before running, with the answer you expect:

   ```toml
   [[test]]
   id = "T1"
   question = "Do the pricing rules conflict for a public tender?"
   query = "conflict/0"
   expect = ["conflict"]
   ```

3. Run it from the skill folder: `python scripts/run_rules.py <project>`.

   ```
   clingo 5.8.2 | time 0.001 s | memory 24.5 MiB | ground rules 5, atoms 5
   paraphrases:
     rules.lp:2  pricing(fixed) :- client(public).
         means: A public client is priced at a fixed price.
     ...
   PASS T1: [conflict]
   summary: 1 passed, 0 failed
   ```

4. Read every `means:` line against the rule beside it. A paraphrase that does not say what the rule
   does is a bug in the rule or in the paraphrase; fix it before trusting any `PASS`.

**Output:** an exit code (0 all passed, 1 a test failed, 2 input refused, 3 engine missing) and a
report you can paste into a review. Here: yes, the two pricing rules conflict.

## The loop

1. **Choose the engine** from the shape of the question (below). If no engine fits, say so and stop.
2. **Write the tests first.** Each `[[test]]` has an `id`, a `query`, the `expect`ed answer and,
   for a competency question, the `question` in words and who agreed the answer and when
   (`agreed_by`, `agreed_on`). An answer written after the run certifies whatever the code says.
   Read `references/patterns.md` when the question is a conflict, a dead rule, an exception with
   priority, a minimal fix, a closure or a competency question: it gives each as a minimal template
   of rules, paraphrases and test.
3. **Write the rules**, each with a `%%` paraphrase line directly above it. Facts use base
   predicates; rules lift them. Read `references/pure-subset.md` before writing rules in either
   language: it holds what each may use, what the run refuses, and why facts never define a ruled
   predicate.
4. **Run** `run_rules.py`. It refuses (exit 2) a rule without a paraphrase, impure Prolog, a
   malformed tests file, or any engine error or warning, before it reports any answer.
5. **Paraphrase back.** Read each `means:` line beside its rule. Then read each `FAIL` line: it
   names the test, the question, the expected and the actual answer.
6. **Fix** the rule, the paraphrase or (only with whoever agreed it) the expected answer, and run
   again until it exits 0. Save the `--json` report under `runs/` when the result matters.

Read `references/rules-from-text.md` when the rules come from a policy, a contract or a regulation:
it adds the source hash, clause ids, deontic classes, the paraphrase-or-flag rule and the citation of
each clause in its rule.

## Rules

### Engine choice

| The question | Engine | Why |
|---|---|---|
| A finite rule set with defaults, exceptions and priorities: conflicts, dead rules, gaps, minimal fixes, allocation | **clingo** (`rules.lp`) | Answer sets cover every situation at once; `#minimize` finds the smallest fix |
| Closure, lineage, entity-resolution clusters or competency questions over a fact base, small or large | **SWI-Prolog** with `:- table` (`rules.pl`) | Goal-directed: it touches only the facts a query needs, and tabling ends recursion |
| Does the instance data conform to the model? | **No engine here**: the SHACL/OWL toolchain | Conformance belongs to the modelling skills |

The file extension picks the engine. clingo grounds every fact before solving, so the report prints
the ground size on every run and warns when the facts file passes 10,000 statements. Read
`references/engines.md` when the engine is unclear, the ground size grows, or an engine is missing:
it adds the grounding guard, when not to use an engine at all, and where each install line lives.

### The test format

`tests.toml` holds one `[[test]]` table per question. The same keys serve both engines:

| Key | clingo | SWI-Prolog |
|---|---|---|
| `query` | a predicate signature, `wins/1` | a goal, `part_of(X, t1)` |
| `expect` | the matching atoms, or `"UNSAT"` when the rules must have no answer set | the solutions as `writeq` prints the goal; `[]` for none. A conjunction prints whole: `part_of(lot1,t1),part_of(item3,lot1)`. Name every variable you want to see: each `_` prints as a fresh `_123` |
| `mode` | `cautious` (in every answer set, the default) or `brave` (in some) | not used |

`id`, `query` and `expect` are required; `question`, `agreed_by` and `agreed_on` are optional, and
required in practice for a competency question. Answers compare as sets, ignoring order and
whitespace. A `#show` in the rules never hides an answer from a test, and a clingo query on a
predicate the program never uses is refused, like an unknown procedure in Prolog.

### Common mistakes

| Mistake | Why it fails | Do instead |
|---|---|---|
| Asking the model to "reason carefully" about a rule set | it still reasons in prose | run the rules in an engine with tests |
| Writing the expected answers after the run | the test certifies the code | agree them first; record `agreed_by`, `agreed_on` |
| A cut or `assert` "for speed" | order-dependent code hides wrong answers | `:- table` and pure clauses; the run refuses the rest |
| Loading a million-row CSV into clingo | grounding blows up | SWI-Prolog, or query the data where it lives |
| A facts file defining a predicate the rules also define | SWI-Prolog silently replaces the rules | facts on base predicates (`direct_part_of/2`); the run refuses the warning |
| Reading "no output" as "no solutions" | an unknown predicate or a syntax error also prints nothing | the run treats any engine error or warning as a refusal |
| Formalising a clause that cannot be paraphrased back | the rule says something the text does not | list it as flagged prose for a human |
| Copying an engine's install steps into a project's docs | they drift | point to the engine's entry in skillery's `dependencies.yaml` |

## Boundary & Related Skills

**Owns:** which engine answers which question; the test-first, paraphrase-back loop and its two
scripts; the pure subsets; the reasoning patterns; rules from text; and competency-question tests
(the test format, agreed answers, running them on every model change).

**Does NOT own:**
- the domain model, its terms and the model-source decision → `conceptual-modelling`;
- LinkML authoring, generation and its quality gates, including SHACL/OWL conformance checks →
  `linkml-engineering`;
- generic modelling craft (naming, reusable properties) → `modelling-conventions`;
- business-language scenarios and test data from use cases → `bdd-gherkin`;
- scoring a specification for hidden assumptions → `clarity-gate`;
- the change that records why a rule set exists, and its decisions → `epic-planning`;
- the user's own rules and preferences for agents → `rulebook` (unrelated: it shares no code or
  engine with this skill).

**Related:** `conceptual-modelling` and `linkml-engineering` cite this skill for competency
questions; `bdd-gherkin` and `clarity-gate` when the rules come from a text.

Answers `VAL, VER, ADQ, ROB, CLR` in `test-strategy`'s matrix (`references/modelling.md`).
