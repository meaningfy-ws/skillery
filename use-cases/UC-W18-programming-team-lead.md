---
id: UC-W18
title: Programming partner and team lead
primary_actor: a Meaningfy developer
trigger: a piece of software work is to be shaped, built or reviewed
success_guarantee: the work is done through the Meaningfy SDLC steps and roles, following every Meaningfy convention
area: coding
served_by:
  agents:
  - epic-planner
  - implementer
  - code-reviewer
  skills:
  - epic-planning
  - spec-stewardship
  - clarity-gate
  - bdd-gherkin
  - meaningfy-code-review
  - cosmic-python
  - project-setup
  - ci-cd-delivery
  - meaningfy-release
  - meaningfy-git-workflow
  - guardrails
  - technical-writing
  - rulebook
  - rule-learner
status: covered
---

# UC-W18 Programming partner and team lead

## Brief Description

Programming partner and team lead of developers, architects, designers, product developers and modellers, using all Meaningfy conventions, SDLC steps and roles. The most developed area.
The loop is EPIC, PLAN, apply, review, archive: `epic-planner` shapes and plans, `implementer`
builds one task at a time, `code-reviewer` reviews one lens per dispatch, and the developer
commits.

## Stakeholders and Interests

- **The developer:** a partner that knows the conventions, so the work is shaped, built and
  reviewed without restating them.
- **The reviewers and the team:** changes that follow one layering, one commit standard and one
  spec trail.
- **The owner:** every change traceable from an EPIC to the merged code and the living specs.
- **The client:** software that matches its agreed specification.

## Preconditions

The repository is Meaningfy-standard or is brought up to standard first (`project-setup`): an
`openspec/` spine, `AGENTS.md`, the test and lint tooling. The developer has the seeds for the work
(notes, an issue, a client request).

## Minimal Guarantees

Nothing is committed, pushed or merged by an agent; no code is written before a PLAN scored at
least 9/10 by `clarity-gate`; an open decision is returned as a question, never assumed.

## Main Success Scenario

1. The developer gives the seeds for a piece of work.
2. `epic-planner` returns question rounds until no decision is open.
3. **[human]** The developer answers each round and agrees the shaped EPIC.
4. `epic-planner` derives the PLAN (`design.md`, `tasks.md`, the `.feature` coverage) and scores it
   with `clarity-gate`; below 9/10 it revises.
5. `implementer` implements one ready task test-first and reports the result and its impact.
6. `code-reviewer` reviews the change, one dispatch per lens (L1 to L5), and reports by priority.
7. **[human]** The developer decides on the findings, commits under `meaningfy-git-workflow` and
   opens the pull request.
8. After the merge, the developer archives the change and merges its spec deltas into the living
   specs (`spec-stewardship`).

## Extensions

- 1a. The repository is not to standard: `project-setup` brings it up to standard first, then the
  use case restarts at 1.
- 1b. The work is a wording or link tweak that moves no boundary: a direct pull request from a
  feature branch, with no EPIC.
- 4a. The work needs a system design or a domain model first: the developer turns to UC-W19 or
  UC-W20, and returns at 4 with their artefacts.
- 5a. The impact check reports HIGH or CRITICAL: `implementer` stops and returns the impact report;
  the developer decides.
- 5b. A test fails because the design is wrong: `implementer` returns a spec fix for
  `epic-planner` (back to 4), never a patch that hides it.
- 6a. A Critical finding: back to 5 for that task.
- 7a. The change is a release: `meaningfy-release` governs the release branch, the version and the
  notes.

## Out of Scope

System architecture (UC-W19), the conceptual model (UC-W20), operating environments (UC-W6),
client delivery and project management (UC-W23), and any commit, push or merge by an agent.

## Artefacts

- The EPIC and PLAN in `openspec/changes/<id>/` (`proposal.md`, `design.md`, `tasks.md`, spec
  deltas, `inputs/`), read by the developer, the reviewers and the implementer.
- The `.feature` files the PLAN names, read by the implementer and the reviewer.
- The code and tests in the repository, read by the reviewer.
- The review findings by priority, returned to the developer.
- The living specs in `openspec/specs/` after the archive, read by everyone who changes the system
  next.

## Evidence

- `tests/features/agents/epic-planner.feature`, `tests/features/agents/implementer.feature` and
  `tests/features/agents/code-reviewer.feature`: the return and refusal scenarios of the three
  agents.
- The clarity-gate scorecard of each PLAN (at least 9/10).
- `make validate` and the project's own test suite, green before the pull request.
- skillery's own EPICs, run through this loop, in `openspec/changes/archive/`.

## Feedback Loop

A defect or a request comes in through `.github/ISSUE_TEMPLATE/` (defect, request); it leaves as a
trigger probe in `tests/trigger_probes.yaml`, a fix in the owning skill, a scenario row in the
agent's feature file, or an EPIC. Each EPIC ends with a retro note that becomes a skill change
through the lessons loop (`docs/development/lessons-loop.md`).

## Slices

1. Shape and plan (EPIC and gated PLAN): released (`epic-planner`, `epic-planning`,
   `clarity-gate`, `bdd-gherkin`).
2. Build test-first in clean layers: released (`implementer`, `cosmic-python`).
3. Review by lens: released (`code-reviewer`, `meaningfy-code-review`).
4. Archive and steward the living specs: released (`spec-stewardship`).
5. Repository standard, delivery and release: released (`project-setup`, `ci-cd-delivery`,
   `meaningfy-release`).
6. Conventions every step uses: released (`meaningfy-git-workflow`, `guardrails`,
   `technical-writing` in `meaningfy-core`).

## Open Points

**Confidence:** high. The steps restate the loop that exists, its agents and their feature files.

- The owner's phrase is "team lead of developers, architects, designers, product developers and
  modellers": should one lead agent dispatch the others, or does the developer stay the
  orchestrator as today?
- Designers and product developers have no agent: are they in this use case, or separate ones?
