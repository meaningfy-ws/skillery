# EPIC: Restructure and evaluate the catalogue — measured revision against the method

> **Golden thread.** Parent: the baseline audit of 2026-10-26,
> `openspec/changes/archive/2026-10-26-skill-crafting-method/inputs/baseline-audit.md`. It moves to the archive with that
> change, so cite it by name. The owner's shaping answers are in
> [`inputs/2026-10-26-shaping-qa.md`](inputs/2026-10-26-shaping-qa.md).
> **Roadmap position:** step 4 of 5 (`skill-crafting-method` `design.md` §8). It **follows**
> `define-catalogue-model` (step 3), because a revision reads the skill's recorded posture first and
> batch E needs the resolved edges. It **precedes** the bundle redesign by activity (step 5).

> **Status, 2026-10-27:** Phase 1 three-quarters done (batches D, E and the docs re-check merged);
> batch C paused on a tool incompatibility, with a proposed fix (design D-13) awaiting the owner. See
> `tasks.md`, "Current state", for how to continue.

## Appetite

**Large, in gated batches: about four to six weeks part time, spread over several PRs.** Each batch
is one PR with its own evidence. The EPIC stops after any batch whose results the owner judges
sufficient; it does not have to run every batch to succeed. Model-run spend is approved per batch
(DEC-5).

## Why

The method now says how a skill should be written and proven, and the checks can see where the
catalogue falls short. The baseline audit found:
- 21 descriptions over the target;
- 2 skills over the size budget;
- 2 skills without probes;
- 19 one-way Related links;
- a trigger gap measured by the eval workflow (`executive-communication` does not fire for the
  cover email of a quotation, which its body now owns).

None of the catalogue's skills has behavioural evidence, and no bundle has an eval suite.

Fixing these by edit alone would repeat the problem the method was written to stop: changes judged
by opinion. This EPIC revises the catalogue *with measurements*: every change carries the test the
method asks for, and every bundle gains an eval suite that can be rerun on demand.

## Solution outline

1. **Audit batches A–E**, each a PR with the method's proportionate test:
   - **A**, 21 descriptions: what + when, ≤ 600 characters, probes, and the trigger method;
   - **B**, 2 oversized skills: detail into `references/`, with baseline runs before and after;
   - **C**, the measured trigger gap;
   - **D**, the 2 missing probes;
   - **E**, the 19 Related links (after step 3).
2. **A behavioural eval suite per bundle** under `evals/<bundle>/`. A few cases per key skill, each
   with an `llm` grader for the outcome and a `tool_used` grader for the skill firing. They run by
   hand through the existing `plugin-eval` workflow or locally.
3. **Agents evaluated too.** Cases that dispatch `epic-planner`, `implementer` and `code-reviewer`
   and grade their dispatch contracts: what they return, what they refuse, their side effects.
4. **Repo docs and structure re-checked** against the method and the documentation register from
   `define-catalogue-model`. Anything found becomes a batch here, or is handed to the owning change.
5. **A record per item:** each revised skill or agent gets a before/after entry (scores, runs, cost)
   in `inputs/evidence/`, so the improvement is visible and repeatable.

## Key decisions

- **DEC-1: Measurement before and after every revision.** No skill or agent is revised in this EPIC
  without a recorded "before" from the same suite or probes that judge the "after".
- **DEC-2: Rigour is the method default** (owner, Q2). This means the agentskills.io trigger method
  for description changes, baseline runs with at least 5 repetitions for body restructures, and a
  pinned model per run.
- **DEC-3: Evals stay on demand, under human control** (owner, Q3). Nothing runs on push, pull
  request or release. Every run is started by a person, locally or through `plugin-eval`.
- **DEC-4: One batch, one PR, one evidence file.** A batch is the unit of review and of stopping.
- **DEC-5: Budget is approved per batch.** The owner's starting figure is $5; the estimate for the
  full scope is provisionally about $110–125 (design D-5; the shaping figure of $60–80 rose once
  the record model was fixed to Sonnet on both sides), to be re-measured by calibration (D-12). Each batch states its estimate before it runs, and the owner
  approves it. Cost levers: Haiku for drafting only (the record is Sonnet), worst-first
  ordering, and stopping after any sub-batch.
- **DEC-6: Revisions respect the posture** recorded by `define-catalogue-model`. A reusable skill
  gains no domain content; a profiled skill gains a switch or a profile; a precise skill gains a
  guardrail.
- **DEC-7: No new eval platform.** `claude plugin eval` and `skill-creator` are the tools. An
  observability or monitoring platform for Meaningfy's own agents and apps is out of scope here and
  is named for a separate decision (inputs, Q3).

## Rabbit-holes

- **Do not tune a description until it games the grader.** A grader that passes a weak answer is
  rewritten, not satisfied.
- **Do not chase scores across models.** Pin one model per run; a second model is a deliberate,
  budgeted extra.
- **Do not let eval suites grow without limit.** A few cases per key skill; a case that never fails
  and never informs a decision is removed.
- **Do not redesign bundles here.** That is step 5.

## No-gos

- No new skills, no skill splits, no bundle changes. A finding that needs one is named for a later
  change.
- No eval runs in CI on push, pull request or release (DEC-3).
- No model spend beyond what the owner approved for the batch (DEC-5).
- No adoption of a third-party eval or observability platform (DEC-7).
- No opencode eval runner. It stays a recorded gap.

---

## What Changes

- Descriptions, bodies and Boundary sections of the skills listed in the audit (batches A–E).
- New eval suites under `evals/<bundle>/` for all five bundles, with agent cases in
  `evals/meaningfy-building/`.
- New probes in `tests/trigger_probes.yaml`.
- `inputs/evidence/`: one before/after record per batch.
- Doc and structure fixes found by the re-check, or hand-offs to their owning changes.

No breaking changes for installers. Behaviour should improve: skills trigger where they should and
stay quiet where they should not.

## Capabilities

### New Capabilities

- `catalogue-evaluation`: how the catalogue's skills and agents are evaluated (suites per bundle, the
  before/after record, on-demand runs, per-batch budget).

### Modified Capabilities

- `skill-crafting-method`: possibly a clarification found while applying the method (decided at PLAN).

## Impact

- **Files:** `skills/*/SKILL.md` (descriptions, bodies, Boundary sections), `skills/*/references/`,
  `evals/`, `tests/trigger_probes.yaml`, docs found by the re-check, `docs/skill-inventory.md`
  (regenerated), `CHANGELOG.md`.
- **Cost:** model runs on the owner's account, approved per batch (DEC-5).
- **Siblings:** after `define-catalogue-model`; before the bundle redesign by activity.
