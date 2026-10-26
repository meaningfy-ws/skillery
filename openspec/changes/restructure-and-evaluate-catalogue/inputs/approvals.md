# Owner approvals of model spend (restructure-and-evaluate-catalogue)

Every batch that uses model runs is approved here before it runs (design D-5, D-12). Runs use the
owner's Claude login in the isolated trigger environment, or `ANTHROPIC_API_KEY` once provided.

| Date | Batch | Approved | Scope | Notes |
|---|---|---|---|---|
| 2026-10-27 | calibration + C | up to $5 | 2 calibration queries; `executive-communication` Sonnet before/after on its 20-query trigger set (120 runs), Haiku drafts, one rerun of the seed case `quotation-bind` | if calibration puts C above $5, ask again before running it (task 0.3) |

## Calibration (task 0.3)

| Model alias | Model id reported | `total_cost_usd` per query | Measured on |
|---|---|---|---|
| `sonnet` | `claude-sonnet-5-5` | $0.0295 | 2026-10-27, isolated, query "write the cover email to send with our formal quotation to the client" |
| `haiku` | `claude-haiku-5-5` | $0.0038 | same |

**Batch C re-estimate:** 120 Sonnet record runs ($3.54) + about 120 Haiku draft runs ($0.46) + one
seed-case rerun (about $0.10) = about $4.10, within the $5 approved. Run cap: 120 Sonnet + 240 Haiku.

## Spend log

| Date | Batch | What ran | Runs | Cost | Valid? |
|---|---|---|---|---|---|
| 2026-10-27 | calibration | 1 query on `sonnet`, 1 on `haiku`, isolated (`claude -p --output-format json`) | 2 | $0.033 (measured) | yes |
| 2026-10-27 | harness checks | 2 `haiku` queries to inspect which commands and skills a session loads | 2 | ≈ $0.008 (est.) | yes (diagnostic) |
| 2026-10-27 | C, Sonnet "before" | `run_eval.py`, 20 queries × 3 runs | 60 | ≈ $1.77 (est.) | **no**: the harness cannot register the skill in Claude Code 2.1.310 (design D-13) |

**Total so far:** ≈ $1.81 of the $5 approved for calibration + C. **Remaining:** ≈ $3.19.
**Re-estimate for C with D-13:** ≈ $4.10 (Sonnet before and after, 120 runs; Haiku drafts; the seed
case) → C would end at ≈ $5.90, about $1 over the approval. **The owner decides** (tasks.md,
"Current state").

*(The "owner decides" note above is superseded by the reshape below.)*

## Reshape, 2026-10-27

The owner set Haiku as the record model for all evals (`2026-10-27-reshaping-qa.md`, R3), and D-13
was adopted. Batch C re-estimated on Haiku: 120 record runs + up to 120 draft runs at $0.0038 + the
seed case ≈ $1, within the ≈ $3.19 left of the $5 approval. Task 2.4 records the owner's confirmation
of this scope change before C runs.
