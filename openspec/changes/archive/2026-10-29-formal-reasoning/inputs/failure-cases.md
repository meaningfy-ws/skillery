# Failure cases: prose reasoning without an engine

Recorded 2026-10-29 for the `formal-reasoning` change (task 1.1). Each case is a question an agent
answered in prose, the wrong answer it gave, the answer an engine gives, and the fixture that encodes
it. The fixtures are the acceptance tests in `tests/test_formal_reasoning.py`.

## F-1: the dead rule in the playbook

- **Source:** the spike playbook, `../../2026-10-29-reasoning-capabilities/inputs/spike/playbook.lp` (nine
  writing and pricing rules with strengths, scopes and specificity).
- **Question:** "Which rules of this playbook can ever take effect? Is any rule dead?"
- **Wrong prose answer:** "Every rule applies in some situation: each has a scope that some request
  matches, so all nine rules can take effect. There is no dead rule."
- **Expected answer:** r1 to r8 win in some situation; **r9 never wins**. r9 ("send immediately",
  default, French only) always fires together with r3 ("send after approval", hard, no scope), and a
  hard rule beats a default one on the same slot. r9 is dead.
- **Fixture:** `tests/fixtures/formal-reasoning/clingo-dead-rule/`, test `DEAD-1`: the brave
  consequences of `wins/1` are exactly `wins(r1)` to `wins(r8)`.

## F-2: the missed transitive member

- **Source:** a part-of hierarchy of a tender: `item3` is a direct part of `lot1`, and `lot1` is a
  direct part of tender `t1`.
- **Question:** "Which items belong to tender t1?"
- **Wrong prose answer:** "Only `lot1` belongs to `t1`: it is the only thing listed as a part of
  `t1`." The prose answer reads the direct links and misses the transitive member.
- **Expected answer:** `lot1` and `item3`. `item3` is a part of `lot1`, which is a part of `t1`.
- **Fixture:** `tests/fixtures/formal-reasoning/prolog-closure/`, competency question `CQ-1`, with
  tabled `part_of/2` lifted from the base predicate `direct_part_of/2`.
