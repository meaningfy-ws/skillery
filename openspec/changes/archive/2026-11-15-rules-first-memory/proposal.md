# EPIC: Rules first: the rulebook over the CLI's own memory

**Golden-thread parents:** the archived EPIC
[`rules-in-every-session`](../archive/2026-10-29-rules-in-every-session/proposal.md), whose reach
this change makes reliable, and the durable spec [`rule-learning`](../../specs/rule-learning/spec.md)
(*Rules reach every interactive session*, *Weekly stewardship reads usage from Langfuse*). This EPIC
deliberately re-shapes that change's DEC-6, which rejected a session hook (DEC-1 below).

Shaped on 2026-11-15 from `inputs/seed.md`, the parked `inputs/draft-proposal.md` (LARGE, not
accepted), `inputs/audit-2026-11-15.md` (almost nothing delivered, remainder MEDIUM) and the owner's
answers in `inputs/answers-2026-11-15.md`.

## Appetite

**MEDIUM.** One new capability: a plain mod in `meaningfy-core` that tells every session where its
rules are and stops the CLI's memory from taking preferences, with the routing sentence, the setup
check and the usage counts it needs. Two stages (DEC-9). The prompt-cue hook, the opencode plugin
hooks and the migration of existing memory notes are cut (No-gos). If the work starts to change the
rule model, precedence, the note format or the store rule, or to parse session transcripts, it has
overrun this appetite.

## Why

On 2026-11-11 the owner said "in this repo never ask for commit, pr, or merge, just do these
actions". The agent saved it to Claude Code's own auto-memory, not the rulebook. Claude Code's
system prompt tells the agent every turn to save preferences and corrections (`feedback` and `user`
notes) there; `rule-learner` fires only when its description matches; the routing line in
`docs/environment/global-prompt.md` must be pasted by hand and was not. Nothing in a bundle routes
rules or blocks that write, so the failure still reproduces on a fresh install (audit, section 4).
Rules kept there are invisible to `rule-steward`, to opencode, to other clones and to colleagues.

## Solution outline

**Every session knows where its rules are.** A new plain mod, `rules-first`, in `meaningfy-core`
adds a session-start block of a few lines: what `rules.py where` reports (the stores this session
sees, and now whether the routing policy is installed) and the routing text. The routing text says:
load rules when an activity starts; draft what the user states or corrects with `rule-learner` and
show the card before the final summary; preferences and corrections go to the rulebook, never to the
CLI's memory; project state goes to the spine and the repository's docs. When a piece is missing,
the agent says so once, under the rulebook's existing "say once" rule.

**The CLI's memory stops taking preferences.** The same mod denies a write of a `feedback` or `user`
note into Claude Code's auto-memory folder. The deny message tells the agent exactly what to do
instead: draft the statement as a `rule-learner` candidate for the card. Other notes save as before.

**The routing is written down where people install from.** The global policy and `project-setup`'s
instruction template carry the same routing sentence, quoted from its one home.

**It shows whether it worked.** `rules.py stats` counts, for its window, the rules written and the
memory writes denied.

**The test of success.** The 2026-11-11 failure replayed in a fresh Claude Code session with
`meaningfy-core` installed: the owner gives the same instruction, the agent shows it as a row of the
rule approval card before its final summary, `rules.py` writes the approved rule, and no new
`feedback` note appears in the CLI's memory.

## Key decisions

- **DEC-1**: Ship a hook for rules. This re-shapes DEC-6 of `rules-in-every-session`, which rejected
  a session-start hook because it is per CLI and would load rules before the activity is known. The
  2026-11-11 failure shows that a pasted routing line and a skill description both lose to the CLI's
  standing instruction. The block does not load rules; `load` stays per activity. Rejected: prompt
  routing alone (what failed).
- **DEC-2**: One new plain mod, `rules-first`, with one `hooks.yaml` intent of the same name and two
  bindings (session start; pre-tool-use on file writes). Rejected: adding the hooks to
  `no-poll-loops` (one mod, two purposes); a separate rules bundle (an extra install defeats "every
  installer gets it").
- **DEC-3**: A bundle may hold several plain mods and at most one modules mod. The one-mod limit
  (`tools/bundle_gen/gen.py`, the `catalogue-governance` spec) came from the modules form, which
  plain mods do not use; the bundle's `plugin.json` already lists hooks files as an array.
- **DEC-4**: The mod carries no method. The routing text lives once, as a data file in `rulebook`;
  the mod reads it at run time and the global policy and template quote it, checked by a test.
  The deny message is the mod's own, as `no-poll-loops` keeps its message.
- **DEC-5** *(owner, Q-2)*: Redirect, do not disable. Auto-memory stays on; only `feedback` and
  `user` notes are denied. Rejected: turning auto-memory off (loses state; a per-user setting a
  bundle must not change); a policy line only (what failed).
- **DEC-6** *(owner, Q-1)*: Project state belongs in the spine and the repository's docs. The
  routing text says so; the hook does not deny `project` or `reference` notes (DEC-5), and existing
  notes are not moved (DEC-8).
- **DEC-7** *(owner, Q-4)*: The store rule stays as it is. A rule stated in a git repository,
  including a personal authority grant, defaults to that repository's store (L-9); the owner may
  switch the row to the vault on the card. This EPIC changes where a statement is *routed*, not where
  it is *stored*. Rejected: a vault `project:<repo>` default for grants (needs project inference in
  `load`).
- **DEC-8** *(owner, Q-3, Q-6)*: Cut the prompt-cue hook and the migration of existing memory notes;
  both are later EPICs if wanted. The owner's local cue-hook trial keeps collecting near-misses.
- **DEC-9**: Two stages. Stage 1 ships the mod, the bundle change, `where` and `stats`, and runs the
  replay, which needs no template line. Stage 2 adds the routing sentence to the global policy, the
  instruction template and this repository's `AGENTS.md`; it starts only after
  `delivery-process-and-tools` stage 3 is merged, because that stage rewrites the same template
  under a size budget.
- **DEC-10** *(owner, Q-5)*: `rules.py stats` gains two counts for its window: rules written (`add`,
  `confirm`, `update`, `approve` events, not counting dry runs or candidates) and memory writes denied (observations carrying the deny message's
  marker). No new trace path. Rejected: scanning the CLI's memory folder from the weekly review.
- **DEC-11**: `rules.py where` is the setup check. It gains one line: whether the routing sentence is
  in the user's global instructions for either CLI. It still always exits 0. Rejected: a separate
  doctor script (a second place that must know where each CLI keeps its instructions).
- **DEC-12**: opencode has no auto-memory, so the deny has nothing to do there (not applicable, not a
  gap). The session-start block is Claude Code only in this EPIC; on opencode the global policy routes
  and the missing block is a recorded gap in `docs/environment/dual-cli/compatibility.md`.

## Rabbit-holes

- **What the hook sees.** It must recognise a write into the auto-memory folder, which is keyed to
  the session's start folder. The match is on the folder's shape under the CLI's config root, never
  on one user's path. A write by a shell command is not seen; accepted.
- **Reaching the routing file.** A plain mod gets no `data/` folder. It reads the file through the
  bundle's own `skills/rulebook/` link; a test asserts the path resolves in the rendered bundle.
- **Context budget.** The block is read every session; it stays a few lines.
- **Fail open.** Like `no-poll-loops`, a missing `node`, `python3`, script or data file never blocks
  the session.
- **Public repository.** No user's paths, vault location or memory notes go into skillery; tests use
  fabricated notes and folders.

## No-gos

- No change to the rule model, precedence, note format, lint or the store rule (DEC-7).
- No new rule store; no rule written without the owner's approval.
- No turning off the CLI's auto-memory; no deny of `project` or `reference` notes.
- No prompt-cue hook, no Stop hook, no reading of session transcripts.
- No migration of existing memory notes (M-1 to M-3 deferred with it).
- No opencode plugin hooks; the opencode gap is recorded, not closed.
- No loading of rules at session start.
- No installer edits to a user's global instructions or settings; `where` reports, the user changes.
- No edits to the lines of the instruction template owned by `delivery-process-and-tools` (design D-1).

---

## What Changes

- New plain mod `mods/rules-first/` (session-start block, memory-write deny, its tests); a
  `rules-first` intent in `hooks.yaml`; `meaningfy-core` in `bundles.yaml` lists it.
- `tools/bundle_gen/gen.py`: several plain mods per bundle, at most one modules mod.
- `skills/rulebook/`: the routing text as a data file; `where` reports the routing policy; `stats`
  counts rules written and memory writes denied; `references/commands.md`.
- `skills/rule-steward/SKILL.md`: the two counts in the weekly report.
- `docs/environment/global-prompt.md`, `project-setup`'s `AGENTS.md.tmpl`, this repository's
  `AGENTS.md`: the routing sentence. `docs/environment/rules.md`, `docs/development/mods.md`,
  `docs/environment/dual-cli/compatibility.md` updated.
- Gherkin `tests/features/rules-first-memory.feature`; `CHANGELOG.md`.

## Capabilities

### New Capabilities
- `rules-first-routing`: every Claude Code session is told where its rules are and how statements
  are routed, and the CLI's memory refuses preference and correction notes.

### Modified Capabilities
- `rule-learning`: rules reach sessions through the bundle's hook as well as the global policy;
  stewardship counts rules written and memory writes denied.
- `catalogue-governance`: a bundle may hold several plain mods and at most one modules mod.

## Impact

- `mods/rules-first/`, `hooks.yaml`, `bundles.yaml`, `make bundles` outputs, `tools/bundle_gen/gen.py`.
- `skills/rulebook/` (`scripts/rules.py`, `references/commands.md`, an asset),
  `skills/rule-steward/SKILL.md`, `tests/test_rulebook.py`, `tests/test_bundle_gen*.py`,
  `tests/features/`.
- `docs/environment/` (global-prompt, rules, dual-cli/compatibility), `docs/development/mods.md`,
  `AGENTS.md`, `skills/project-setup/assets/templates/agentic/AGENTS.md.tmpl`, `CHANGELOG.md`.
- External: each Claude Code user's auto-memory folder is written less; no user setting changes.
