<!-- SECONDARY. The seed of the EPIC; superseded by proposal.md, never deleted or groomed. -->

# Seed: the navigator does not follow the work

Captured 2026-11-13 from the owner's conversation: five screenshots from three parallel Claude Code
sessions in one product repository that runs several git worktrees at once, then a diagnosis of the
`navigator` mod against its code, the repository on disk and the mod API types.

## The owner's words

- "analyse this cluttered and verbose navigator, still hard to read/understand"
- "why was the cosmic python not used?" (about the warning *cosmic-python loaded and left unused*)
- "note the actions it does not match well with the phase" (a session merging, archiving and
  releasing while the band says `apply`)
- "here is what in the subagent is seen, same navigator"
- "lets start proposing a new epic change that addresses the navigator issues listed above and
  adopt proper solutions"
- On scope: skillery is generic. The failure came from one product repository; the fix and its
  acceptance must hold for any repository.

## The recorded failure (the acceptance test)

Three sessions, each started in the repository's main checkout and then moved into its own git
worktree (`.claude/worktrees/<name>`, branch `feature/<change>`):

| Session | Work | Band said |
|---|---|---|
| 1 | an implementer running in an EPIC's apply | `tasks 0/0`, false "unused" warnings; repository not identified |
| 2 | merge a PR, archive its change, rebase the next change, run full gates, prepare a release PR | `apply`; a warning keyed to another change (`process:second-check:aggregate-events`) |
| 3 | task 3.1 of `tenant-dump-restore` (4 of 8 tasks done) | status line `aggregate-events · LARGE · apply 0/0 · 14 more open` |

## Diagnosis (checked against code, disk and API docs)

1. **Wrong root.** `mods/navigator/io.ts` `repoRoot()` uses `$.session.repo()?.root`, documented as
   "the main working tree's for a worktree". Every repository read (changes, branch, tasks,
   `deviations.md`, plan-drift diff, clean tree, validate, archive check) runs in the main checkout.
2. **Guessed change.** The main checkout's branch names no change, so `readChange` follows the most
   recently modified one (`lib/change.ts`), whichever session wrote last. Hence `0/0`, the wrong
   appetite, gates, quotas and warnings. Accept would write into the wrong change's
   `deviations.md`.
3. **Worktree paths.** Edits are made relative to the main root and become
   `.claude/worktrees/<wt>/…`, so file gates and PLAN paths never match.
4. **Subagent skill loads count as the lead's** (`skill.prompt` ignores `agentId`): the lead's
   `skills` row fills with the implementer's loads, and the "unused" check fires on them.
5. **The "unused" check** flags any skill load followed by another load; session 2 showed
   `cosmic-python (apply)` and "cosmic-python loaded and left unused" at once.
6. **Missing phase signals.** `archived` is hard-coded false; merges, rebases, release commands are
   not signals; a session moving to another change keeps the old phase.
7. **Subagent task not shown.** The spawn description ("Task 3.1 dump and restore") is stored and
   never drawn; the band is the session's, identical in every agent view.
8. **Clutter.** The same fact two or three times (cost, the clarity warning, the running agent);
   plugin prefixes, model ids and raw warning keys; finished agents and an eight-skill trail in
   full; up to 14 buttons; warnings in arrival order, so `+9 more` hides what may matter.

## Mod API facts found (Claude Code mod types)

- `$.session.repo().root`: the main working tree's root for a worktree.
- `$.session.root()`: where the session started, or where `/cd` or a worktree move took it; a
  shell `cd` does not move it.
- `$.session.cwd()` read inside a hook: that hook's agent's directory (a subagent's own).
- `agent.spawn` carries `cwd` and `isolation: 'worktree'`; `tool.call` and `turn.complete` carry
  `agentId`.
- The navigator's state is one in-memory session atom; nothing persists it.
