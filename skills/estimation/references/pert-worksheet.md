# PERT worksheet

The fillable worksheet for the default technique. PERT (three-point) turns each work-breakdown leaf
into a weighted estimate and a variance that rolls up into a defensible **contingency**. The
arithmetic is fixed; fill the O / M / P columns from the breakdown (decomposed against the
[`epic-planning`](../../../ai-coding/epic-planning/SKILL.md) build breakdown where build work is
involved).

## Formulae

```
Expected (TE) = (O + 4·M + P) / 6
Std dev  (SD) = (P − O) / 6
Variance      = SD²

Engagement TE  = Σ leaf TE
Engagement SD  = √(Σ leaf variances)
Contingency    = k · engagement SD          (k ≈ 1 for ~84% confidence, ≈ 2 for ~98%)
Fixed-frame    = Engagement TE + Contingency
```

> O = optimistic, M = most-likely, P = pessimistic (plausible worst case, not catastrophe). Units:
> person-days (or hours) — keep one unit throughout.

## The table

```markdown
| # | Work-breakdown leaf | O | M | P | TE = (O+4M+P)/6 | SD = (P−O)/6 | Variance = SD² |
|---|---------------------|---|---|---|-----------------|--------------|----------------|
| 1 | <leaf>              |   |   |   |                 |              |                |
| 2 | <leaf>              |   |   |   |                 |              |                |
| … |                     |   |   |   |                 |              |                |
|   | **Totals**          |   |   |   | **Σ TE**        |              | **Σ Variance** |

Engagement TE   = Σ TE                     = <…>
Engagement SD   = √(Σ Variance)            = <…>
Contingency     = k × Engagement SD        = <…>   (k = <1 or 2>)
Fixed-frame     = Engagement TE + Contingency = <…>
```

## Worked micro-example

```
Leaf "landscape reading":  O=3, M=5, P=11
  TE = (3 + 20 + 11)/6 = 5.67    SD = (11−3)/6 = 1.33    Var = 1.78
Leaf "option framing":     O=2, M=3, P=7
  TE = (2 + 12 + 7)/6 = 3.50     SD = (7−2)/6 = 0.83     Var = 0.69

Engagement TE  = 9.17 person-days
Engagement SD  = √(1.78 + 0.69) = √2.47 = 1.57
Contingency    = 1 × 1.57 = 1.57   (≈84% confidence)
Fixed-frame    = 9.17 + 1.57 = 10.7 ≈ 11 person-days
```

> The breakdown table is also the export to **Smartsheet / MS Project** for scheduling — this
> worksheet stops at effort + contingency; the Gantt is rendered externally.
