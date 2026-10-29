# The pure subset

The engines can do more than this skill allows. The subset keeps answers independent of clause
order and search order, so a passing test means the logic is right, not that the search was lucky.
`run_rules.py` enforces the parts marked **checked**.

## Contents

- [Both languages](#both-languages)
- [SWI-Prolog](#swi-prolog)
- [clingo](#clingo)

## Both languages

- **A paraphrase above every rule** (checked). One or more `%%` lines directly above the rule. A
  plain `%` comment is not a paraphrase. In `.pl` a rule is a statement with `:-` after its head; a
  statement that starts with `:-` is a directive and needs none. In `.lp` a rule is any statement with
  `:-` (constraints included), `:~` or a choice `{…}`; facts and `#` directives need none.
- **Facts never define a predicate that has rules.** Facts use base predicates such as
  `direct_part_of/2`, and a paraphrased rule lifts them into `part_of/2`. In SWI-Prolog, consulting
  a facts file that defines a ruled predicate silently replaces the rules; the engine prints a
  `Redefined static procedure` warning, and the run refuses it.
- **One statement ends at the end of a line.** The lints read statements line by line; keep the
  closing `.` at the end of a line, and do not use `%* … *%` block comments.

## SWI-Prolog

- **No cut** (`!`) (checked). It makes answers depend on clause order.
- **No database changes** (checked): no `assert`, `asserta`, `assertz`, `retract` or `retractall`.
- **No global variables** (checked): no `nb_setval` or `b_setval`.
- **Table recursion.** Put `:- table name/arity.` above every recursive predicate. It ends left
  recursion and cycles and removes duplicate answers.
- **Negation only on bound goals.** `\+ p(X)` with `X` unbound asks "is there no X at all", which is
  rarely what the paraphrase says. Bind `X` first through a positive goal.
- **Every warning refuses the run.** Singleton variables, discontiguous clauses, redefined
  procedures and syntax errors all print `Warning:` or `ERROR:`, and the run exits 2 with the
  engine's message. An unknown procedure is an error, never an empty answer.

The lint skips quoted atoms, strings and comments, so `'!'` in a string is not a finding. A false
positive is reported with its line; rewrite the line rather than suppressing the check.

## clingo

- **Every variable bound** through a positive body atom. clingo refuses unsafe rules; that error
  refuses the run.
- **Keep grounding small.** See the [grounding guard](engines.md#the-grounding-guard).
- **`#show` is for people, not tests.** The run shows every queried signature itself, so a `#show`
  never hides an answer from a test.
- **Optimisation is fine.** With `#minimize`, test answers range over the optimal answer sets only.
