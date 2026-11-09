<!-- STATUS: EPIC shaped 2026-11-09 from the owner's conversation (inputs/seed.md, inputs/qa.md);
     round 2 (Q-1..Q-3 in inputs/qa.md) answered the same day: recommendations taken. Frozen.
     PLAN not derived. -->

# EPIC: navigator workflows — work shaping, architecture, modelling and release

**Parents:** the owner's requests of 2026-11-09 (`inputs/seed.md`, `inputs/qa.md`); the `navigator`
change and its `workflow-definitions` capability (workflows are data, shipped by their owning
skill); the processes owned by `epic-planning`, `architecture`, `conceptual-modelling` and
`meaningfy-release`.

## Appetite

**SMALL.** Four workflow files in four owning skills, data only, plus one engine rule (DEC-6) and
the tests and docs that go with them. If a workflow needs a new `enter` key, a new gate kind, or
navigator code beyond DEC-6, the work has outgrown SMALL: stop and re-shape as MEDIUM.

## Why

Navigator follows a session only where a workflow file exists, and today that covers EPIC delivery,
DevOps and sales well, architecture and modelling as one blurred path, and release not at all. A
person shaping an EPIC sees `apply`, `verify` and `archive` ahead of them as if they were
delivering. An architect sees a modelling phase. A modeller sees architecture's phases. Someone
cutting a release gets no band at all, which is where a forgotten back-merge or install check
happens. The method for each already lives in its skill; the band does not yet show it.

## Solution outline

Each process gets the phases its own skill already describes, in the owner's words, shipped as a
workflow file in that skill:

- **Work shaping** (`epic-planning`'s part of build-tier): explore → variants → decide → propose →
  design → revise. It is build-tier's front half and becomes the `work-shaping` variant, so a
  shaping session sees only these six phases and ends at the clarity gate. Delivery (apply, verify,
  archive) follows in the full workflow.
- **Architecture** (`architecture`): drivers → use cases → C4 → decide → domain. The session leaves
  ADRs, use cases and C4 views behind; its last phase is the initial domain model, owned by
  `conceptual-modelling`, so **Next step** hands the session over to modelling.
- **Modelling** (`conceptual-modelling`, its own workflow): elicit → model → generate → validate,
  starting from the initial domain model when architecture handed it over.
- **Release** (`meaningfy-release`): branch → bump → validate → merge → publish → back-merge, with a
  `hotfix` variant.

Outcome: in each of these sessions the band shows where the work stands in that skill's own steps,
and **Next step** points to the skill that should run next.

## Key decisions

- **DEC-1**: A workflow exists only for a skill that describes an ordered process inside one
  session. This EPIC adds four. — Knowledge skills (writing, git, cosmic-python, code review alone)
  would show a band that never moves; rejected: one workflow per skill.
- **DEC-2**: Work shaping uses the owner's six phases, named as the owner named them, replacing
  build-tier's `shape` and `plan`; the `work-shaping` variant replaces `exploratory`. — One name
  per step across the method; rejected: keeping `shape`/`plan` beside the new names.
- **DEC-3**: Architecture keeps the workflow name `architecting` (so a repo file that extends it
  still resolves), stops activating on modelling, and runs the owner's five phases. Its last phase,
  `domain`, is owned by `conceptual-modelling`: the handover is that phase's owner, not a new
  mechanism. — Rejected: a cross-workflow link field.
- **DEC-4**: Modelling is its own workflow, owned by `conceptual-modelling`, starting on
  `conceptual-modelling`, `linkml-engineering` or the `conceptual-modeller` agent. Its gates: a
  command gate on `make generate-models` (generate) and a file gate on the review record in the
  change's `evidence/` (validate). — Its phases are not architecture's; rejected: a variant of
  `architecting`.
- **DEC-5**: Release is its own workflow, owned by `meaningfy-release`, starting only on that
  skill, with command gates for its phases and a `hotfix` variant. — Rejected: activating on
  `git tag` or a `release/` branch alone, which would catch ordinary work.
- **DEC-6**: One engine rule: a **file gate** that passes advances the phase the way a command gate
  already does (`advanceOn`), into a phase with no `enter`. — Architecture's phases are told apart
  only by the files they write; rejected: a new `enter.files` key (more schema for the same signal).
- **DEC-7**: Navigator stays method-free: every phase, owner, gate and glob is in a workflow file
  in its owning skill, and a repo can override any of them with `extends`.
- **DEC-8**: The PLAN may start now; this change archives only after `navigator` has archived, so
  its `workflow-definitions` delta lands on the archived spec; at that point the requirement
  *Default workflow files live in their host skills* is rewritten as a MODIFIED delta (six files,
  modelling moved). — Rejected: stacking a delta on an unarchived change's delta.

## Rabbit-holes

- **A phase with no signal.** Every phase needs something navigator can see: a skill, an agent, a
  change state, a command or a file. A phase with none is one **Next step** can only guess. The
  design names the signal of each phase; where there is none (likely `variants` and `decide`), the
  phase is entered by order and said so.
- **Globs differ per repo.** Where use cases, C4 views and the evidence record live is a project
  convention. The defaults follow `project-setup` and `architecture`; a repo overrides them, and the
  user guide says how.
- **Two workflows on one session.** Architecture and modelling can both be active in one session;
  the last skill loaded chooses, as today. The handover must not bounce back.
- **Renaming phase ids** touches the strict reminder text, tests, the user guide and
  `docs/development/workflows.md`.
- **Publish differs by repo**: skillery publishes through `releases.yml`, a library to PyPI. The
  gate matches the GitHub release or tag, not either mechanism.

## No-gos

- Workflows for project-setup, decision-package or a sales `offer` variant: a later EPIC (Q-1).
- Workflows for knowledge skills, the rulebook trio or the vault.
- Any new `enter` key or gate kind; any navigator code beyond DEC-6.
- Method text in the mod; strict-mode semantics; opencode.

---

## What Changes

- `epic-delivery`'s build-tier file: phases explore, variants, decide, propose, design, revise,
  apply, verify, archive; variant `work-shaping` replaces `exploratory`; `brownfield` renamed onto
  the new ids. **BREAKING** for a repo file that names `shape` or `plan`.
- `architecture`'s architecting file: five phases, modelling removed from `activate`.
- New `conceptual-modelling` modelling file; new `meaningfy-release` release file.
- Navigator: a passed file gate advances the phase (DEC-6), with tests.
- User guide (`docs/environment/navigator.md`) and `docs/development/workflows.md`: the new
  workflows and phase names. CHANGELOG.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `workflow-definitions` (from the `navigator` change): the default workflows and their phases;
  a file gate advances a phase.

## Impact

Four skills' `assets/workflows/` (`make bundles` links them into the navigator bundle), navigator's
`lib/phase.ts` and tests, two docs. No agent changes; no skill body changes beyond a line where a
skill names its workflow.
