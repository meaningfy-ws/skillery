# Seed — rules first: skillery's rule skills over the CLI's own memory (secondary, never groomed)

Captured from the owner's session of 2026-11-11 (delivery of `named-workers-and-legal`), in the
owner's words where quoted. Inputs only: no EPIC, no PLAN yet.

## The trigger

During the session the owner gave a standing instruction:

> in this repo never ask for commit, pr, or merge, just do these actions

> mark that permission

The agent stored it in Claude Code's own auto-memory (a note in the CLI's per-project memory
folder on the owner's machine) and in a local permission file. It did not use `rule-learner`, and
the rule never reached the owner's rulebook. Asked where the rule lives, the owner said:

> when you say memory rule ... where is this rule stored? in claude memory? in this repo? in local
> user memory? in the meaningfy skillery rules as encoded on rule learning process ... ? be more
> specific on your internals

> what needs to happen, so you start use actively every time you claude automemory, you rather use
> my skillery rule learner and rule steward .... is there any action hook?

> take this analysis and the prospect and shape a new epic pitch that addresses the problem of setup
> and usage of skillery rule learning an active exercise. and eventually that we override claude
> automemory rules and strengthen them with skillery memory skills on rules in particular.

## What the session found (the diagnosis)

1. **The CLI's own instructions win.** Claude Code's system prompt tells the agent, every turn, to
   save the user's preferences and corrections (its `feedback` and `user` memory types) to its
   auto-memory folder. `rule-learner` fires only when its description matches the moment. A
   standing instruction beats a skill description, so preferences land in the CLI's memory.
2. **The routing policy was not installed.** skillery ships a global policy
   (`docs/environment/global-prompt.md`) whose rules line routes to `rulebook` at the start of an
   activity and to `rule-learner` before the final summary. It is meant for `~/.claude/CLAUDE.md`
   (or opencode's `AGENTS.md`). On the owner's machine that file did not exist, so nothing routed to
   the rule skills.
3. **The rule store was unreachable.** `MEANINGFY_VAULT` was not set in a session started in a code
   repository, so `rules.py load` would exit 3 even if called.
4. **No hook exists.** `hooks.yaml` declares none for rules; `meaningfy-core` ships only the
   `no-poll-loops` mod. Rule learning depends entirely on prompt routing and model judgement.
5. **Rules accumulated in the wrong store.** Several of the CLI's auto-memory notes on the owner's
   machine are rules in all but name (tool habits, standing git authority, YAGNI/no-config, move
   files rather than regenerate). They are invisible to `rule-steward`'s weekly review, to other
   projects, to other CLIs (opencode has no such memory), and to colleagues.
6. **Scope surprises.** The CLI's memory is keyed to the folder the session starts in: a session
   started in a git worktree or another clone of the same repository does not see it.

## The prospect discussed (not decided)

- **Setup made checkable:** install the global policy, set `MEANINGFY_VAULT`, and have a check
  (a `rules.py where`-style doctor, or `make`/install step) that says plainly whether rules load in
  this session and, if not, which of the three pieces is missing.
- **A deterministic trigger:** a hook that sees rule statements in the user's prompt ("always",
  "never", "from now on", "don't", "do it this way", "remember that") and tells the agent to draft
  them with `rule-learner`, not the CLI's memory. Possibly a second hook at session start that
  reminds the agent to `load` rules for the activity, and one before the final summary that offers
  the approval card.
- **Override the CLI's auto-memory for rules:** preferences and corrections go to the rulebook;
  the CLI's memory keeps only project state and references. Options seen: a binding line in the
  global policy; disabling auto-memory (`autoMemoryEnabled: false`), which also loses useful project
  state; or a hook on memory writes that redirects rule-like notes to `rule-learner`.
- **Migration:** one `rule-learner` approval card for the rules already sitting in the CLI's memory;
  approved ones are written to the vault and the memory copies removed.
- **Ship it, not just configure it:** the hooks as a `meaningfy-core` mod declared in `hooks.yaml`
  and rendered for both CLIs, so every installer gets the same behaviour.

## Open questions for shaping

- Where do project-state notes (EPIC status, release history) belong if auto-memory is restricted:
  stay in the CLI's memory, move to the spine, or to the vault's project notes (`vault-project`)?
- Is a prompt-pattern hook precise enough, or does it nag? What is the near-miss (a "never" that is
  not a rule)?
- Can a hook see, or veto, the CLI's own memory writes on both CLIs? (opencode has no auto-memory:
  is that a gap or the target state?)
- Should a repository-scoped rule (like the git authority above) live in the vault with a repository
  scope, or in that repository's `AGENTS.md`?
- How does `rule-steward` measure that the change worked (rules learned per week, memory notes that
  should have been rules)?

## Related

- `rulebook`, `rule-learner`, `rule-steward` (`meaningfy-core`); `docs/environment/rules.md`;
  `docs/environment/global-prompt.md`; `hooks.yaml`; the `no-poll-loops` mod as the model of a
  shipped hook.
- Archived change `2026-10-29-reasoning-capabilities` (where the rule skills were introduced).
- Issue #185 (navigator reads the session's own checkout, not a worktree) shows the same
  folder-scope trap as finding 6.
