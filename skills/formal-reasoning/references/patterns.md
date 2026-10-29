# Reasoning patterns

Each pattern is a minimal template: rules with their paraphrases, and the test that checks them.
Copy it into a reasoning project and rename the predicates.

## Contents

- [Conflict and the situation it happens in](#conflict-and-the-situation-it-happens-in)
- [Dead rule](#dead-rule)
- [Exception with priority](#exception-with-priority)
- [Minimal fix](#minimal-fix)
- [Closure](#closure)
- [Competency-question tests](#competency-question-tests)

## Conflict and the situation it happens in

Facts describe the rules: `rule(Id, Slot, Value, Strength)` and `scope(Id, Dimension, Value)`. A
choice picks one value per dimension, so each answer set is one situation (`sit/2`).

```
%% Each situation picks exactly one value per dimension.
1 { sit(D,V) : val(D,V) } 1 :- dim(D).
%% A rule fires when the situation matches every part of its scope.
fires(R) :- rule(R,_,_,_), sit(D,V) : scope(R,D,V).
%% A rule wins when it fires and nothing beats it.
wins(R) :- fires(R), not beats(_,R).
%% Two winning rules conflict when they set the same slot to different values.
conflict(R1,R2,S) :- wins(R1), wins(R2), rule(R1,S,V1,_), rule(R2,S,V2,_), V1 != V2, R1 < R2.
%% Two clashing rules clash in every situation that matches both their scopes.
clash_on(R1,R2,D,V) :- conflict(R1,R2,_), scope(R1,D,V).
%% The second rule's scope is part of that situation too.
clash_on(R1,R2,D,V) :- conflict(R1,R2,_), scope(R2,D,V).
```

`beats/2` holds the priority (see [Exception with priority](#exception-with-priority)). Test with
`mode = "brave"` (in some situation): `query = "conflict/3"` names the rules and the slot,
`query = "clash_on/4"` names the situation, for example `clash_on(r5,r6,client,public)` and
`clash_on(r5,r6,channel,tender)`.

## Dead rule

A rule that wins in no situation is dead. It is missing from the brave consequences of `wins/1`:

```toml
[[test]]
id = "DEAD-1"
question = "Which rules win in at least one situation?"
query = "wins/1"
mode = "brave"
expect = ["wins(r1)", "wins(r2)", "wins(r3)"]
```

A rule absent from `expect` and from the answer is dead. A gap is the reverse: a slot with no
winning rule in some situation.

## Exception with priority

A default holds unless an exception applies; the exception is its own rule with its own paraphrase.

```
%% By default, a tender is priced in time and materials.
pricing(T, tm) :- tender(T), not fixed_price_exception(T).
%% A public client's tender is an exception to that default.
fixed_price_exception(T) :- tender(T), public(T).
%% A public client's tender is priced at a fixed price.
pricing(T, fixed) :- fixed_price_exception(T).
```

For ranked rules, priority is a relation, not rule order:

```
%% A firing rule beats another firing rule on the same slot when it is stronger.
beats(O,R) :- fires(O), fires(R), rule(O,S,_,SO), rule(R,S,_,SR), str(SO,A), str(SR,B), A > B.
```

## Minimal fix

Let the solver choose what to drop, forbid the conflict, and minimise the drops:

```
%% Any rule may be dropped from the set.
{ drop(R) } :- rule(R,_,_).
%% A rule is kept unless it is dropped.
kept(R) :- rule(R,_,_), not drop(R).
%% Two kept rules must not set the same slot to different values.
:- kept(R1), kept(R2), rule(R1,S,V1), rule(R2,S,V2), V1 != V2.
#minimize { 1,R : drop(R) }.
```

Test `query = "drop/1"`. The run computes consequences over the optimal answer sets only: `brave`
lists every rule some smallest fix drops, `cautious` the rules every smallest fix drops.

## Closure

Table the recursive predicate and lift it from a base predicate:

```prolog
:- table part_of/2.
%% A direct part is a part.
part_of(X, Y) :- direct_part_of(X, Y).
%% A part of a part is a part of the whole.
part_of(X, Z) :- part_of(X, Y), part_of(Y, Z).
```

Lineage, "same as" clusters and reachability have the same shape. With tabling, cycles in the facts
terminate: a dataset that feeds itself through two others is listed once.

## Competency-question tests

A competency question (CQ) is a question the model must answer. Write each as a test before the
model changes, with an answer the domain expert agreed:

```toml
[[test]]
id = "CQ-1"
question = "Which items belong to tender t1?"
query = "part_of(X, t1)"
expect = ["part_of(lot1,t1)", "part_of(item3,t1)"]
agreed_by = "domain expert"
agreed_on = "2026-10-29"
```

- **Agreed beforehand.** `agreed_by` and `agreed_on` record who fixed the answer and when. Change an
  expected answer only with that person, and update both fields.
- **Over fixture facts.** The facts file holds a small, hand-checked sample of the domain, on base
  predicates. It is test data, not the production store.
- **On every model change.** Run the CQ project whenever the model or its rules change, in CI where
  the project has it. A changed answer fails the run and names the CQ by its id and its question.
- **One question per test.** The `question` text is what a reviewer reads in a failure.
