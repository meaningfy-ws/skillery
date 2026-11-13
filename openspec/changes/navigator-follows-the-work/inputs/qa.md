<!-- SECONDARY. The elicitation record of the EPIC; never deleted or groomed. -->

# Q&A: navigator follows the work (2026-11-13)

## Before the rounds

- **State scope.** Offered: change-scoped durable state (gates, phase, accepted) in the change
  folder, session state in the atom, per-agent entries. **Owner: keep everything in the session
  atom.** `deviations.md` stays the only file the navigator writes.

## Round 1

| Q | Asked | Answer |
|---|---|---|
| Q-1 | One EPIC or split | **One EPIC, LARGE, three stages** (right data; phase signals; band and warnings) |
| Q-2 | Branch names no open change | **Follow the change the branch names, matched on whole segments; else none.** Never guess by mtime |
| Q-3 | The "loaded and left unused" warning | **Rework it** (not drop) |
| Q-4 | Band shape | **Now / next / warnings**, everything else in Details |

## Round 2

| Q | Asked | Answer |
|---|---|---|
| Q-5 | Signals that move the phase | **All four**: change folder moved to `archive/` → archive; PR merged → accept/archive-ready; all tasks ticked → accept (kept); release commands → release workflow |
| Q-6 | A session moves to another change | **Re-place from that change's files** (placed, not entered); the old change's gates and warnings leave the view |
| Q-7 | Edits land in another worktree than the one followed | **Warn: "edits in X, navigator follows Y"**; root from `session.root()` (lead) and the hook's `session.cwd()` (subagent); no guessing |
| Q-8 | Warning order and Accept | **Severity tiers** (gate/process > plan drift > subagent rules > hygiene > heuristics); folded band shows the top one and a count; **Accept, with the message not the key, in Details only** |

## Round 3

| Q | Asked | Answer |
|---|---|---|
| Q-9 | Where the mode shows | **Details only** (modifies the session-navigation requirement that the mode is always visible in the unfolded band); the status line keeps `● strict` |
| Q-10 | Subagents in the folded band | **Running only, `<task> → <type> (<elapsed>)`**, at most two then `+n`; no plugin prefix; model only when it differs from the parent's; finished agents grouped in Details |
| Q-11 | What acceptance proves | **Owner correction:** skillery is generic, not tied to the repository the failure came from. **At least unit tests and Gherkin scenarios**, on synthetic repository fixtures (worktrees, several open changes, parallel sessions) |
| Q-12 | Risks | **Owner correction:** ask the general risk elicitation (what outside the work could change, who is hurt and how badly, what we do, what we accept) and derive the options from context; do not offer a pre-made list of implementation risks |

## Round 4 (risk, asked generally)

| Q | Asked | Answer |
|---|---|---|
| Q-13 | What outside the EPIC could change under it | *No answer.* Default taken, **open for the owner**: the platform (mod API) and how people move between worktrees |
| Q-14 | Who is hurt and how badly | *No answer.* Default taken, **open for the owner**: loose mode misleads (medium); strict mode can block a commit or archive wrongly (high) |
| Q-15 | Response in the field | *No answer.* Default taken, **open for the owner**: hide or disable the band, PATCH release, the failure becomes a test |
| Q-16 | Accepted rather than mitigated | **Rare edge cases of use** (a clear warning, not full support); **platform drift after release** (handled by the issue loop) |

## Round 5 (open issues folded in)

The owner listed three open issues as related: #185, #188, #148.

| Q | Asked | Answer |
|---|---|---|
| Q-17 | #185's case: the session stays in the main checkout and edits a sibling worktree (`../<repo>-<topic>`) by path, so `session.root()` never moves | **Follow the edits automatically.** Supersedes Q-7 (warn only) |
| Q-18 | Which issues the EPIC takes in (recommended: #185 all, #188's lead-band half, #148 out) | **All three in**: #185; #188 both parts; #148 (review set by stage size, merged lenses, the `code-reviewer` brief contract) |

Consequence stated to the owner: with #148 the EPIC moves boundaries between `epic-delivery`,
`meaningfy-code-review` and the `code-reviewer` agent, so the appetite rises from LARGE to
**VERY LARGE**, delivered in four stages.
