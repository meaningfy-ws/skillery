# Baseline audit of the catalogue against the method (roadmap step 2)

**Status:** SECONDARY input; the golden-thread parent of the `restructure-and-evaluate-catalogue`
EPIC (roadmap step 4). Taken 2026-10-26 on branch `docs/skill-crafting-method` after groups 1–4,
with `make validate` and one eval run.

**Blocking findings: none.** `frontmatter_keys` and `description_too_long` pass on all 32 skills.

## Findings and proposed batches

Each finding belongs to exactly one batch. The test needed follows the proportionate rule
(principle 5): probes only for wording and descriptions, a baseline run for a body restructure.

### Batch A: descriptions over the 600-character target (21 skills)

| Skill | Characters |
|---|---|
| `estimation` | 1,006 |
| `decision-package` | 1,003 |
| `project-setup` | 980 |
| `conceptual-modelling` | 927 |
| `proposal-writing` | 881 |
| `ci-cd-delivery` | 860 |
| `linkml-engineering` | 823 |
| `modelling-conventions` | 806 |
| `writing-antipatterns` | 784 |
| `vault-conventions` | 783 |
| `explanatory-writing` | 768 |
| `vault-setup` | 756 |
| `vault-project` | 717 |
| `vault-capture` | 695 |
| `meaningfy-code-review` | 694 |
| `epic-planning` | 688 |
| `meaningfy-release` | 673 |
| `guardrails` | 635 |
| `vault-resume` | 631 |
| `spec-stewardship` | 611 |
| `vault-daily` | 604 |

**Scope:** rewrite each as what + when, in the imperative, ≤ 600 characters (principle 6), with a
positive and a near-miss probe per skill. Several summarise their workflow, which `writing-skills`
records as a cause of the body being skipped.

### Batch B: skills over the specification's body budget (2 skills)

| Skill | Size |
|---|---|
| `architecture` | 650 lines, about 8,722 tokens |
| `cosmic-python` | 405 lines, about 5,254 tokens |

**Scope:** move detail into `references/` (one level deep) without changing what the skill owns. This
is a body restructure, so it needs a baseline run before and after on the same scenarios.

### Batch C: a trigger gap measured by the eval workflow (1 skill)

| Skill | Evidence |
|---|---|
| `executive-communication` | The seed case `evals/meaningfy-consulting/quotation-bind` asks for the cover email of a formal quotation. In two runs (one on the default model, one on `claude-sonnet-5-5`) no skill was invoked, so the `skill-fired` grader failed. The skill's description does not mention quotations or contractual cover messages, although its body (3.1.0) now owns them. |

**Scope:** a description change, measured by the agentskills.io trigger method (about 20 queries,
half near-misses, 3 runs) and the seed case. This can share a PR with batch A if `executive-communication`
is handled there, but it is listed apart because it has measured evidence.

### Batch D: missing trigger probes (2 skills)

| Skill | Finding |
|---|---|
| `linkml-engineering` | no trigger probe (coverage gap) |
| `modelling-conventions` | no trigger probe (coverage gap) |

**Scope:** one positive and one near-miss probe each (`near_miss_of` the closest neighbour, likely
`conceptual-modelling`).

### Batch E: Related links that are not returned (19 pairs)

`reciprocal_related_report` lists 19 pairs where A names B as Related and B does not name A, for
example `bdd-gherkin` → `architecture` and `estimation` → `epic-planning`. Five of them involve
`architecture`, three `project-setup`.

**Scope:** for each pair, either add the return link or decide the link is one-way and say so in the
`## Boundary & Related Skills` section. This overlaps the catalogue model's edge work (step 3), so
batch E runs after step 3.

## Recorded, not batched

- **Claude-only frontmatter keys:** `argument-hint` (7 skills) and `disable-model-invocation` (4)
  are allowed and listed in `CLAUDE_ONLY_SKILL_KEYS`; opencode ignores them. No action.
- **Cross-bundle dependencies** (11 undeclared edges): resolved by `define-catalogue-model` (step 3).
- **opencode behavioural evals:** no runner exists; recorded as a gap in the method.
