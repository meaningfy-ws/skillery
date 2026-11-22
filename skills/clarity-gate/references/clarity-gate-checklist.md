# Clarity gate checklist

The full gate for an EPIC or a PLAN (`design.md` and `tasks.md`). Tick 13 items, score 6 criteria, read the score.

## The Clarity Gate

### Foundation (7)

1. **Actionable**: every section dictates an implementation detail; no "fast" or "scalable".
2. **Current**: nothing outdated, no superseded decision still listed.
3. **Single source**: each decision is written once.
4. **Decision, not wish**: no "might", "ideally", "eventually".
5. **Prompt-ready**: every section is fit to put in an agent's brief; delete what is not.
6. **No future state**: the text describes the current decision only.
7. **No fluff**: no motivational or aspirational prose.

### Document architecture (6)

8. **Type identified**: each document is strategic (EPIC), implementation (PLAN) or reference.
9. **Anti-patterns placed**: in the PLAN only; the EPIC points to them.
10. **Test cases placed**: in the PLAN and the scenarios only; the EPIC points to them.
11. **Error handling placed**: the error matrix is in the PLAN only; the EPIC points to it.
12. **Deep links**: every reference names a path and an anchor (`file.md#anchor`), never "see elsewhere".
13. **No duplication**: the EPIC points to the PLAN, it does not copy it.

## Minimums by appetite

| Appetite | Anti-pattern rows | Error-matrix rows | Worked examples |
|----------|-------------------|-------------------|-----------------|
| TINY | 2 | 2 | 1 |
| SMALL | 3 | 3 | 1 |
| MEDIUM | 4 | 4 | 2 |
| LARGE | 5 | 5 | 3 |
| VERY LARGE | 6 | 6 | 3 |

A row names this change's risk, not a generic one. The anti-pattern row says what not to do, what to do
instead and why. The error row says the failure, how it is detected, the response and the fallback. The
byte budget of `design.md` by appetite is in `assets/design-budgets.json`, the one source; do not pad to the minimum.

## Rubric

| Criterion | Weight | 10/10 means |
|-----------|--------|-------------|
| Actionability | 0.25 | every section has a specific implementation consequence |
| Specificity | 0.20 | every number and threshold is explicit; no "etc" |
| Consistency | 0.15 | one source of truth; no duplicates across documents |
| Structure | 0.15 | tables over prose; a predictable format |
| Disambiguation | 0.15 | anti-patterns and edge cases are explicit; roles, states and cases are mutually exclusive and complete |
| Reference clarity | 0.10 | deep links only |

Score = the weighted sum, out of 10.

## Reading the score

| Score | Reading | Action |
|-------|---------|--------|
| 9 or more | pass | proceed |
| 8.8 to under 9 | the owner may accept a score from 8.8 as good enough; the gate never does on its own | record the owner's word |
| 7 to under 8.8 | 3 to 5 ambiguities | revise and re-score |
| under 7 | not ready | return to the PLAN |

## Failure recovery

| Weak criterion | Fix |
|----------------|-----|
| Actionability | add the implementation consequence to each section |
| Specificity | replace "handle", "fast", "etc" with a number or an action |
| Consistency | keep one source, point to it elsewhere |
| Structure | turn prose into a table |
| Disambiguation or reference clarity | add the missing rows up to the minimum; replace vague references with deep links |
