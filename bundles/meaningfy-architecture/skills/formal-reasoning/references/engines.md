# Engines: which one, how big, and when not at all

## Contents

- [Choose by the shape of the question](#choose-by-the-shape-of-the-question)
- [The grounding guard](#the-grounding-guard)
- [When not to use an engine](#when-not-to-use-an-engine)
- [Installing the engines](#installing-the-engines)

## Choose by the shape of the question

| The question | Engine | Shape that decides it |
|---|---|---|
| Does a rule set with defaults, exceptions and priorities conflict? Is a rule dead? Where is there a gap? | **clingo** | finite rules over a small, closed set of situations; every situation is checked at once |
| What is the smallest change that removes every conflict? How do we allocate people or slots under constraints? | **clingo** | a choice plus `#minimize`: search over alternatives |
| What is everything X is part of, derives from, or is the same as? | **SWI-Prolog** with `:- table` | recursion over facts; goal-directed, so only the facts a query needs are touched |
| A competency question over the model's facts | **SWI-Prolog** (clingo when the question is about a rule set) | a query with an agreed answer over fixture facts |
| A transitive closure over tens of thousands of facts | **SWI-Prolog** with `:- table`, never clingo | clingo would ground every row first |
| Does the instance data conform to the model? | **neither** | the SHACL/OWL toolchain of `linkml-engineering`; no engine of this skill runs |

**A rule set with exceptions.** Use clingo. The conflict test's answer atoms name the clashing rules,
the slot, and the situation they clash in: `conflict(r5,r6,pricing)` and
`clash_on(r5,r6,client,public)` ([patterns](patterns.md#conflict-and-the-situation-it-happens-in)).

**Closure over a large fact base.** Use SWI-Prolog with `:- table` on the recursive predicate. Tabling
makes left recursion and cycles terminate and keeps each answer once.

## The grounding guard

clingo replaces every variable by every value it can take before it solves (grounding). The ground
program can grow far beyond the input: a rule joining three predicates of 10,000 rows can produce
billions of ground rules.

- Every clingo run prints `ground rules N, atoms M` beside the time and peak memory. Read it: a ground
  size several orders above the input is the warning sign.
- Before grounding, the run warns when the facts file has more than 10,000 statements ("row-scale").
  It runs anyway; the warning means "consider SWI-Prolog".
- To shrink grounding: bind every variable through a positive body atom, split a rule that joins
  unrelated predicates, and filter early with a base predicate instead of a computed one.

## When not to use an engine

- **Conformance of data to a model**: SHACL/OWL through the modelling skills.
- **A lookup or a count** that one query in the data's own store answers (SQL, SPARQL): run it there.
- **A rule that cannot be paraphrased back**: it stays flagged prose
  ([rules-from-text](rules-from-text.md)).
- **Only on a recorded need**, never by default: Z3 (arithmetic and bit-vector constraints), eclingo
  (epistemic logic), argumentation frameworks, DuckDB (analytics over files), SymPy (symbolic
  maths). None is a declared dependency. Record the need in the project's change before adding one.

## Installing the engines

The skill never installs an engine. `python scripts/check_env.py` reports each engine as present,
with its version, or missing, with a one-line hint; `--need clingo|prolog|any` exits 3 when the
engine you need is missing.

The install lines live in one place: the `clingo` and `SWI-Prolog` entries of skillery's
`dependencies.yaml`, and the environment setup page (`docs/environment/setup.md`). clingo comes from
pip; SWI-Prolog is a system package. Both scripts need Python 3.11 or later.
