# Rules from text

Rules derived from a policy, a contract or a regulation keep their link to the text. A reader must
be able to go from any rule to the clause it came from, and from any clause to its rule or to the
reason it has none.

## Contents

- [1. Fix the source](#1-fix-the-source)
- [2. Number the clauses](#2-number-the-clauses)
- [3. Classify each clause](#3-classify-each-clause)
- [4. Paraphrase or flag](#4-paraphrase-or-flag)
- [5. Cite the clause in the rule](#5-cite-the-clause-in-the-rule)
- [Hand-offs](#hand-offs)

## 1. Fix the source

Record the source's title, version and a SHA-256 hash of the exact text you worked from, in the
project README:

```
source: Pricing policy v3 (pricing-policy.md), sha256 9f2c…e41a, read 2026-10-29
```

When the hash changes, the rules are stale until every changed clause is reviewed.

## 2. Number the clauses

Give every clause a stable id: the document's own numbering where it has one (`§4.2(b)`), otherwise
`C-1`, `C-2` in reading order. One clause states one norm; split a sentence that states two.

## 3. Classify each clause

| Class | It says | Typical rule |
|---|---|---|
| obligation | must, shall | a constraint that forbids its absence |
| permission | may | a choice, or a rule that blocks a prohibition |
| prohibition | must not, shall not | a constraint |
| definition | "X means Y" | a rule that derives the defined term |
| exception | "except where", "unless" | a rule that blocks the general rule ([patterns](patterns.md#exception-with-priority)) |
| defeater | "does not apply when" | a rule that blocks without stating the opposite |

## 4. Paraphrase or flag

Formalise a clause only when you can write a rule whose `%%` paraphrase says what the clause says,
and someone who knows the domain agrees. Otherwise the clause is **flagged prose**: list it in the
project README with its id and the reason, and write no rule for it.

```
## Flagged prose (no rule)
- §4.2(c) "reasonable notice": the period is not stated; ask the policy owner.
```

An ambiguous clause is never resolved by guessing. It stays flagged until a person decides, and
that decision is recorded with the project's change.

## 5. Cite the clause in the rule

Start the paraphrase with the clause id:

```
%% §4.2(b): a public client's tender is priced at a fixed price.
pricing(T, fixed) :- tender(T), public(T).
```

Every clause then ends as a rule, a flagged entry, or "no norm" (a heading, an example), and a test
per obligation and prohibition checks that the rules say what the clause says.

## Hand-offs

- Turning the clauses into business-language scenarios and test data: `bdd-gherkin`.
- Scoring the source or the derived rules for hidden assumptions before they drive work:
  `clarity-gate`.
- Recording why the rule set exists and the decisions on flagged clauses: the project's change
  (`epic-planning`).
