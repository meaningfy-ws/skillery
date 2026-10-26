# Inputs: `add-meaningfy-assistant`

Seed inputs for a handover. Nothing in this folder is a durable OpenSpec artifact: it is source
material for the agent that shapes `proposal.md`, `design.md`, `tasks.md` and `specs/` for this
change. Keep these files, and don't groom them; the EPIC supersedes them without replacing them.

## The ask, in one paragraph

Build a new skillery plugin, **`meaningfy-assistant`**, holding the skills that drive a personal
Obsidian vault and a daily assistant in Claude Code: the project method (create, capture, close,
promote), the note conventions, an invoked tidy, and the morning note. The behaviour is already
specified, as requirements, in two OpenSpec changes of the private repo
`meaningfy-ws/infrastructure-stacks` (below). This change turns those requirements into skills,
registers the plugin, and keeps `make validate` green on both CLIs.

## Reading order

1. [`brief.md`](brief.md): why, the plugin, the design rules every skill follows, the vault the
   skills operate on, the decisions already taken, and the open questions.
2. [`skills.md`](skills.md): one section per skill, with purpose, triggers, reads, writes, what it
   must never do, and draft acceptance scenarios.
3. [`repo-constraints.md`](repo-constraints.md): what skillery's own rules and validator require
   (a new bundle name is pinned in code, the opencode tree, trigger probes, and more).

## The upstream requirements (private repo, read locally, never copy here)

This repository is **public**. The upstream material is in a **private** repository and contains
client names, personal paths and infrastructure details. Read it from a local checkout; cite it by
path; copy none of it into skillery. Summaries in this folder are already anonymised.

| What | Path in `meaningfy-ws/infrastructure-stacks` |
| --- | --- |
| Vault EPIC (layout, write rules, skills, DEC-1 to DEC-18) | `openspec/changes/add-personal-vault/proposal.md` |
| Vault requirements | `openspec/changes/add-personal-vault/specs/personal-vault/spec.md` |
| Daily assistant EPIC (DEC-1 to DEC-12) | `openspec/changes/add-daily-assistant/proposal.md` |
| Daily assistant requirements | `openspec/changes/add-daily-assistant/specs/daily-assistant/spec.md` |
| The Infra owner's review of the vault EPIC, 2026-09-14 | `openspec/changes/add-personal-vault/inputs/discussion-2026-09-14.md` |
| Study of the reference vault (what to take, what to leave) | `openspec/changes/add-personal-vault/inputs/study-evault-2026-09-14.md` §2, §4, §7, §8 |
| The reference vault's own skills, as used for two months | the reference vault's `skills/` folder under `openspec/changes/add-personal-vault/inputs/sources/` |
| The brainstorm's vault design (kinds, properties, rules) | `openspec/changes/add-personal-vault/inputs/sources/50-vault-architecture.md` |

On 2026-09-14 these edits sat on the branch `docs/personal-vault-decisions` (worktree
`../infrastructure-stacks-vault`); check whether it has merged before reading from `main`.

## For the agent taking this over

- Shape the EPIC with `epic-planning`, gate the PLAN with `clarity-gate` (≥ 9/10), author skills
  per `spec/CREATING_SKILLS.md`. The Infra owner approves the EPIC before any skill is written.
- Where the upstream requirements and this folder disagree, the upstream requirements win; report
  the drift.
- Ask the Infra owner the open questions in `brief.md` §8 before shaping; don't assume.
