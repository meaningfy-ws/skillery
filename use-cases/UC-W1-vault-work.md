---
id: UC-W1
title: Vault work
primary_actor: a Meaningfy colleague working in a personal vault
trigger: the colleague opens a work session in the vault
success_guarantee: the vault follows the shared spine (works and tasks, not projects), the colleague's local variations are kept, and the session's changes are saved in place
area: personal
served_by:
  agents: []
  skills:
  - vault-setup
  - vault-conventions
  - vault-project
  - vault-resume
  - vault-capture
  - vault-promote
  - vault-tidy
  - vault-planning
  - vault-daily
  - rulebook
  - rule-learner
  - rule-steward
status: covered
change: add-vault-local-config
---

# UC-W1 Vault work

## Brief Description

Vault work with a renamed structure ("not projects but works/tasks"); colleagues' local variations anchored in one shared spine.

## Stakeholders and Interests

- **The colleague:** a vault that resumes where the last session stopped, in their own words.
- **Other colleagues:** the same note shapes in every vault, so skills and shared notes work for all.
- **The company:** only what a person opted in reaches the company memory.

## Preconditions

The vault exists with its owner profile in the vault's `AGENTS.md` and its permission settings
(`vault-setup`); the external `obsidian@obsidian-skills` plugin is installed; the company memory's MCP
server is configured for recall.

## Minimal Guarantees

Nothing is moved, merged, renamed, deleted or archived without the colleague's yes. The company
memory is never written from a vault session (recall only). A claim nobody asked for lands in
`00 Inbox/proposed/`, never in a project. A hedge stays a hedge; a rationale the notes do not give is
written "not stated".

## Main Success Scenario

1. The colleague names the work to resume.
2. The assistant reads its charter, latest session entries, decisions and tasks, makes at most one
   memory recall naming it, and summarises where things stand and what is next (`vault-resume`).
3. The colleague works with the assistant; every note it writes follows the shared shape
   (`vault-conventions`).
4. **[human]** At the end, the colleague says what was done or decided outside the conversation.
5. The assistant files the session: a dated session entry, and only what applies to tasks,
   decisions, the charter and resources (`vault-capture`).
6. The assistant reports every file changed and the questions the session left open.
7. **[human]** The colleague promotes staged notes (`vault-promote`), approves a tidy plan
   (`vault-tidy`), or sets `memory: common` on a note to share it.

## Extensions

- 1a. No vault, or the owner profile is incomplete: `vault-setup` creates what is missing and reports
  each prerequisite; the use case restarts at 1.
- 1b. The work does not exist yet: `vault-project new` runs the charter gate; **[human]** the
  colleague answers its five questions; the use case continues at 3.
- 2a. The memory server does not answer: the recall is skipped and the summary says so in one line.
- 3a. The vault's `AGENTS.md` clashes with a shared convention: the vault wins for that vault, and the
  clash becomes a `kind: skill-change` note in `00 Inbox/proposed/`.
- 7a. The work is finished: `vault-project close` writes the final entry and moves the folder to
  `06 Archive/` only after the colleague's yes.

## Out of Scope

Planning across horizons and the morning note (UC-W4), the calendar and task secretary (UC-W3), quick
capture away from the desk (UC-W5), software EPICs and repository scaffolding (UC-W18), and the
ingestion pipeline that carries opted-in notes into the company memory.

## Artefacts

- The work folder (`01 Projects/YYYY-MM-DD Name/`, or `07 Perso/` for personal work) with its five
  standing files; read by the colleague and by the next `vault-resume`.
- Meeting notes (`kind: meeting`) in the folder's `artefacts/`; shared with the company only when the
  colleague sets `memory: common`.
- Staged notes and `kind: skill-change` notes in `00 Inbox/proposed/`; read by the colleague, and by
  the skillery maintainers when a person opens the pull request.
- The vault's `AGENTS.md` and per-CLI permission settings; read by every vault skill at run time.
- Planned: the colleague's local variation file over the shared spine (`add-vault-local-config`).

## Evidence

- `tests/trigger_probes.yaml`: a positive probe for each of the nine `vault-*` skills and near-miss
  probes between `vault-promote`, `vault-tidy` and `vault-conventions`.
- The final check of `vault-setup` reports each prerequisite as present or missing.
- Planned: an outcome suite under `tests/evals/vault-assistant/` (`evaluate-catalogue`).

## Feedback Loop

Friction the colleague meets becomes a `kind: skill-change` note in `00 Inbox/proposed/`; a person
turns it into a Defect issue or a skillery pull request against the owning `vault-*` skill. A miss in
triggering becomes a probe row in `tests/trigger_probes.yaml`.

## Slices

1. The shared spine: setup, conventions, the work lifecycle, resume, capture, promote and tidy:
   released (the nine `vault-*` skills in `vault-assistant`).
2. The renamed structure, works and tasks instead of projects: planned (`add-vault-local-config`, to
   confirm).
3. Colleagues' local variations anchored in the shared spine: planned (`add-vault-local-config`).

## Open Points

**Confidence:** medium. Slice 1 restates the released skills; slices 2 and 3 extrapolate from one
line of the brief, and the skills still use "projects" throughout.

- Does "works and tasks, not projects" rename `01 Projects/` and the project files for every vault,
  or is it one colleague's local name for the same shape?
- What may a colleague vary locally (folder names, kinds, templates, write rules), and what is fixed by
  the spine?
- Is the rename part of `add-vault-local-config`, or a change of its own?
