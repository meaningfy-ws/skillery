<!-- STATUS: umbrella pitch. Split decided by the owner on 2026-10-29 into three child EPICs.
     Research and seeds: inputs/ (secondary, never groomed); start with inputs/2026-10-28-research-synthesis.md,
     then inputs/qa.md for the owner's decisions that revised it. -->

# EPIC: Reasoning capabilities

**Golden-thread parent:** the owner's seeds in [`inputs/`](inputs/): the handover
[`Reasoning and learning skills.md`](inputs/Reasoning%20and%20learning%20skills.md), the ISWC 2026
vault notes ([findings](inputs/2026-10-28-iswc-vault-findings.md)), and the Q&A record. No
requirement or architecture parent sits above it; the seeds are the root.

## Appetite

**HUGE.** It is split into three child EPICs before any PLAN is written. This change holds the research
and the split, and ships no specs of its own.

## Why

Two kinds of agent failure recur:
- **The owner's rules don't stick.** Corrections, preferences and conventions are lost, or kept as unapproved memory that the agent still ignores.
- **Prose reasoning fails where exactness matters**, in rule sets, closure over data and competency questions, and its errors are invisible. Experts' tacit tensions also go unrecorded.

ISWC 2026 sharpened both: "the model proposes; the machinery decides" (the owner's memo), and an LLM
working in a loop with a solver or reasoner beats an LLM working alone.

## Solution outline

Three child EPICs, each with its own change:

| Child | Bundle | Appetite | What |
|---|---|---|---|
| [`rule-learner`](../rule-learner/proposal.md) | vault-assistant | LARGE | A small symbolic rule and preference learner: rule model and repository in `08 How to/`, learning with per-session approval, weekly grooming and forgetting, and usage monitored from Langfuse |
| [`formal-reasoning`](../formal-reasoning/proposal.md) | meaningfy-architecture | MEDIUM | One reasoning skill: clingo and SWI-Prolog by problem shape, the test-first paraphrase-back loop, CQ testing, rules from text |
| [`dialectical-elicitation`](../dialectical-elicitation/proposal.md) | meaningfy-architecture | MEDIUM | **Postponed (2026-10-29).** An Elenchus-style opponent skill. To be re-shaped once we decide how to set up `elenchus-server` |

The Langfuse deployment is specified for the infrastructure stacks repo:
[`rule-learner/inputs/langfuse-infrastructure-spec.md`](../rule-learner/inputs/langfuse-infrastructure-spec.md).

## Key decisions

- **DEC-1** (owner, 2026-10-28): One umbrella EPIC, delivered through child EPIC changes.
- **DEC-2** (owner, 2026-10-29): The KISS cut of the handover is accepted, then revised into exactly three
  children. The children are not tied to offer creation.
- **DEC-3** (owner, 2026-10-29): Langfuse is the rule-usage infrastructure. It is deployed by the
  infrastructure stacks repo, not by skillery.
- **DEC-4** (owner, 2026-10-29): Reasoning and elicitation skills live in meaningfy-architecture. Rule
  learning lives with the vault, where the rules are stored.
- **DEC-5** (owner, 2026-10-29): Postpone `dialectical-elicitation`. An Elenchus server implementation
  exists, so first decide how to set it up; then re-shape the pitch. Delivery order: `rule-learner` and
  `formal-reasoning` first.

## Rabbit-holes

- Each child carries its own. Across all three: don't let a child rebuild what another owns. Rules-from-text is `formal-reasoning`'s; the rule schema is `rule-learner`'s.

## No-gos

- SysML v2, reinforcement learning, a knowledge-graph mirror of Odoo, MCP servers over rules or reasoners.
- A Langfuse deployment inside skillery.

---

## What Changes

- Nothing in this change itself; each child opens its own capability.

## Capabilities

### New Capabilities

_None here._

### Modified Capabilities

_None here._

## Impact

- vault-assistant and meaningfy-architecture gain skills; `dependencies.yaml` gains clingo, SWI-Prolog,
  pyNMMS (optional), Langfuse (service) and the Langfuse plugin.
