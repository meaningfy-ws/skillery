# EPIC: Fix the accumulated skill defects — one pass, one owner per fix

> **Golden thread.** Parent: the human's **accumulated defect notes** (12 vault notes, analysed and
> cited but not copied, because this repo is public; see [`inputs/README.md`](inputs/README.md)).
> Secondary: [`inputs/2026-10-25-session-findings.md`](inputs/2026-10-25-session-findings.md), the
> defects observed during the 2026-10-25 analysis session.
> **Independent of** every sibling; the human has placed it between `add-devops-bundle` and
> `add-sales-bundle`, but nothing blocks pulling it forward if the notes are ready earlier.

## Appetite

**Small per defect, bounded overall: one batch.** Each fix is a scoped edit to the skill that owns
the fact. If a defect turns out to need a new skill or a split of an existing one, it is *named*
here and shaped separately; it does not grow this EPIC.

## Why

Skills accumulate drift: a trigger that fires too eagerly or not at all, a rule stated in two skills
with two wordings, a reference file a SKILL.md no longer points at, a step that assumes a tool that
moved. The human has been collecting these in notes as he worked. Left as notes they decay; fixed ad
hoc they bypass the gates. One batch through the spine keeps each fix traceable to the note that
reported it.

Why now: the defects predate the three bundles about to land; fixing them first means the new
bundles are built against corrected neighbours and the dedupe passes in `add-devops-bundle` /
`add-sales-bundle` reconcile against truth, not against known-wrong text.

## Solution outline

1. **Triage the notes into a defect table** in `design.md` at PLAN time: id, reporting note, owning
   skill, kind (trigger / content / structure / link / dual-CLI), severity, fix.
2. **Fix by owner.** Every edit lands in the single skill that owns the fact (`AGENTS.md`'s
   single-source-of-authority rule); where the defect is duplication, the duplicate is deleted and a
   citation left.
3. **Prove the trigger fixes** with `tests/trigger_probes.yaml` entries, and the content fixes with
   `skill-creator`'s eval loop where the skill has evals; where it has none, add the minimum probe.
4. **Regenerate** `docs/skill-inventory.md`; descriptions that changed are the usual cause of drift
   there.

## Key decisions

- **DEC-1: Fixes are grouped by owning skill, not by note.** One PR may close several notes if they
  land in one skill; one note may spawn edits in two skills only when it reports a duplication.
- **DEC-2: A defect that needs a new skill, a skill split, or an agent change is out of scope here
  and recorded in a "Shaped out" table** in the EPIC at PLAN time, each with the sibling or future
  change that should take it.
- **DEC-3: Every trigger fix gets a probe.** A description change without a probe is not a fix; it is
  a guess. `tests/trigger_probes.yaml` is the existing home.
- **DEC-4: Use `skill-creator` (Anthropic) as the authoring tool for content fixes** — eval, compare,
  tune the description — and record in the PR which fixes it was used on. Rationale: it is the
  session's answer to "is there a proper skill that supports organising and managing other skills";
  this EPIC is where it is first applied in anger.
- **DEC-5: The install-side defects observed in session are not skill defects** (five-fold plugin
  duplication, stale installed copy) and belong to `single-source-distribution`. Listed in inputs so
  they are not re-reported here.

### Re-shape of 2026-10-26 (logged event)

The defect analysis ([`inputs/2026-10-26-defect-analysis.md`](inputs/2026-10-26-defect-analysis.md))
showed that most notes share five root causes, so fixing note by note would reproduce them. The owner
widened the bet ([`inputs/2026-10-26-plan-decisions.md`](inputs/2026-10-26-plan-decisions.md)):

- **DEC-6: Root-cause fixes may move a rule to its single owner.** Project resolution moves from
  `vault-resume` into `vault-conventions`, and the three move procedures in `vault-tidy`,
  `vault-promote` and `vault-project` collapse into one section there. Moving a fact to its owner is
  the single-source rule, not a restructuring; the "do not refactor" rabbit hole still forbids
  everything else.
- **DEC-7: Each skill fix names its posture first** (R reusable core / C core + profiles / P precise
  house standard, [`inputs/2026-10-26-reuse-vs-precision.md`](inputs/2026-10-26-reuse-vs-precision.md)).
  The posture decides whether a fix widens or hardens.
- **DEC-8: In scope as well:** near-miss trigger probes (G1); the bridge from vault `skill-change`
  notes to GitHub issues (P1); the posture rule in `docs/development-method.md`; spec deltas for the
  normative statements the fixes change.
- **DEC-9: A bounded documentation crystallisation pass.** Shrink the repo docs, make them easier to
  read and remove redundancies, only in files that no other open change's `tasks.md` edits. For claimed
  files, the findings are handed to the claiming change's `inputs/`.
- **DEC-10: Vault permissions put `mv` and `rm` on ask** (owner's choice). Deletion still goes to
  `.trash/` by default; `rm` is for an explicit request for permanent deletion.

## Rabbit-holes

- **Do not refactor a skill while fixing it.** A fix changes the line that is wrong; restructuring a
  skill is its own change. The one exception is DEC-6: a rule moves to its single owner.
- **Do not rewrite a document during the docs pass (DEC-9).** Cut duplicates, replace restatements
  with links, tighten wording. A document that needs a new structure is named for a later change.
- **Do not fix the same fact in two places.** If the note points at a duplicate, delete one.
- **Do not open the "merge CONTRIBUTING + CREATING_SKILLS" question here** — it is in
  `skill-crafting-method` half two (moved from `single-source-distribution`, R3).

## No-gos

- **No new skills, no skill splits, no agent edits** (DEC-2).
- **No changes to tooling or gates** beyond adding probes/evals. A new probe key is data the
  validator ignores, not a gate change.
- **No edits to files another open change's `tasks.md` edits** (DEC-9), and none to
  `CONTRIBUTING.md` or `spec/*` (`skill-crafting-method`).

---

## What Changes

- Edits to 12 skills: the 9 `vault-*` skills (`vault-daily` is checked only), `writing-antipatterns`,
  `executive-communication` and `epic-planning`. Each edit is a scoped correction or a move to the
  owner (DEC-6).
- Near-miss and positive entries in `tests/trigger_probes.yaml`.
- `docs/development-method.md`: the posture rule and the vault-note intake line.
- The documentation crystallisation pass on unclaimed docs (DEC-9), with hand-off notes for claimed
  ones.
- Regenerated `docs/skill-inventory.md`; a CHANGELOG entry with a migration line for vault owners.
- A "Shaped out" table of the deferred items (in `design.md`).

No breaking changes for catalogue users. Vault owners re-run `vault-setup` to receive the new
permissions and templates (migration line).

## Capabilities

### New Capabilities

- `executive-communication`: the first durable spec for an existing skill (register switch,
  contractual routing).

### Modified Capabilities

- `vault-conventions`, `vault-curation`, `vault-project-lifecycle`, `vault-setup`,
  `writing-antipatterns`, `catalogue-governance`.

## Impact

- **Files:** `skills/vault-*/…`, `skills/writing-antipatterns/…`, `skills/executive-communication/…`,
  `skills/epic-planning/SKILL.md`, `tests/trigger_probes.yaml`, `docs/development-method.md`,
  unclaimed docs (DEC-9), `docs/skill-inventory.md`, `CHANGELOG.md`.
- **Siblings:** none blocked; `add-sales-bundle`'s dedupe pass benefits if this lands first; claimed
  docs findings are appended to their owners' `inputs/`.
