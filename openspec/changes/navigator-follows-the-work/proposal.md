<!-- STATUS: EPIC shaped 2026-11-13 from the owner's conversation (inputs/seed.md, inputs/qa.md,
     rounds 1-6). Folds in issues #185, #188 and #148. Round 6 settled DEC-5 (release always
     triggers the release workflow) and took the risk defaults Q-13..Q-15. Frozen.
     PLAN derived the same day (design.md, tasks.md, five spec deltas); attacked by a fresh
     subagent (A-1..A-12, all folded in); clarity gate 9.4/10 by an independent scorer (second
     run; 9.0 with one item failing before). Ready for delivery. -->

# EPIC: navigator follows the work

**Parents:** the owner's requests of 2026-11-13 (`inputs/seed.md`, `inputs/qa.md`); the live
capabilities `session-navigation`, `drift-detection`, `workflow-definitions` and `epic-delivery`
(archived from the `navigator`, `navigator-workflows` and `lean-delivery` changes); issues #185,
#188 and #148.

## Appetite

**VERY LARGE**, in four stages. The navigator's data, signals and band change together, and #148
moves the review-set boundary between `epic-delivery`, `meaningfy-code-review` and the
`code-reviewer` agent. Without #148 this would be LARGE. If a stage needs per-agent workflows or a
state file outside the session atom, the bet is wrong: stop and re-shape.

## Why

The navigator tells a person where their work stands, and in a repository that runs several git
worktrees at once it tells them about the wrong work. It reads the main checkout instead of the
worktree being worked, guesses the change by whichever folder was written last, and so shows another
change's tasks (`0/0`), phase, gates and warnings in every parallel session; its Accept button would
write into that other change's `deviations.md` (#185). Around that, the band repeats itself, hides
the warnings that matter behind `+9 more`, raises false "skill left unused" alarms and does not say
which task a subagent is working on. A band that is wrong or unreadable is worse than none: people
learn to ignore it. Separately, the review set a stage gets scales by the EPIC's appetite alone, so a
small stage of a large EPIC pays for five full reviews (#148).

## Solution outline

1. **Right data (stage 1).** Every repository read runs in the worktree where the work happens:
   the lead's, found from where it edits, and each subagent's own. The followed change is the one
   the followed branch names; when none matches, the band says so instead of guessing. Each
   agent's skill loads and task stay with that agent. Outcome: in any repository, a session in a
   worktree sees its own change, tasks and warnings, and Accept writes where the work is.
2. **The phase follows what happens (stage 2).** Archiving a change, merging its PR, ticking its
   last task and running release commands move the phase; moving to another change re-places the
   phase from that change's files. Outcome: a session that merges and releases is not shown in
   `apply`.
3. **A band you can read at a glance (stage 3).** Folded, three lines: what runs now (stage, task →
   agent), the next step, the most serious warning with a count. Everything else in Details, each
   fact once, no internal names. Warnings ranked by severity; the "unused skill" check counts real
   use per agent. Outcome: the band answers "where am I and what next" without reading a table.
4. **Review sized to the stage (stage 4, #148).** The review set follows the size and risk of the
   stage's diff, not only the EPIC's appetite, as data in the workflow file; merged lenses are
   allowed when the lead records the decision, and the `code-reviewer` agent accepts that brief.
   Outcome: small stages of large EPICs stop paying for redundant reviews.

## Key decisions

- **DEC-1**: All navigator state stays in the one session atom; `deviations.md` stays the only file
  the navigator writes — the owner's call; rejected: per-change durable state in the change folder
  (it would let gates survive `/clear` and be shared across sessions).
- **DEC-2**: The lead's root is the git working tree its latest file write landed in, when that tree
  belongs to the same repository (any worktree, inside or beside the main checkout); before any
  write, the session's own root. A subagent's root is the directory its own events run in. The main
  working tree's root is never used for a worktree session (Q-17, #185) — rejected: the launch
  directory (today's bug); a warning only (Q-7, superseded).
- **DEC-3**: The followed change is the open change the followed branch names, matched on whole
  name segments; with no match the navigator follows no change and says so — rejected: the most
  recently modified change (it is whichever session wrote last).
- **DEC-4**: The atom keeps an entry per agent: its root, branch, skill loads and task (the spawn's
  description). A subagent's skill loads never enter the lead's trail — rejected: one session-wide
  trail.
- **DEC-5**: Four signals move the phase: the change folder moving into `archive/` (archive); the
  followed branch's PR merged (accept passed, ready to archive); all tasks ticked (accept, kept);
  release commands (the release workflow activates, with or without `meaningfy-release` loaded,
  and the band asks for the skill when it is not) — rejected: skill loads as the only signal. The
  owner: "meaningfy release must always be triggered on release" (Q-19); this replaces the
  `workflow-definitions` scenario *Ordinary work does not start a release*.
- **DEC-6**: When the followed change changes, the phase is re-placed from the new change's files,
  placed and not entered: no leave or enter warnings, and the old change's gates and warnings leave
  the view (Q-6) — rejected: keeping a record per change in the atom.
- **DEC-7**: A loaded skill counts as used when the same agent makes any tool call or spawns a
  subagent after loading it, before its turn ends; the check stays, at the lowest severity (Q-3) —
  rejected: dropping the check; the current rule (another load next means unused).
- **DEC-8**: Folded band: three lines (now / next / top warning and count). Details: the rest.
  No plugin prefixes, no raw warning keys, a model only when it differs from the parent's, each
  fact once (cost on the status line only). Running subagents show as `<task> → <type>
  (<elapsed>)`, at most two then `+n`; finished ones grouped in Details (Q-4, Q-10).
- **DEC-9**: Warnings rank by severity: gates and process, then plan drift, then subagent rules,
  then hygiene, then heuristics. Accept shows the warning's message, not its key, and lives in
  Details only (Q-8).
- **DEC-10**: The mode shows in Details only; the status line keeps `● strict` (Q-9) — modifies the
  `session-navigation` requirement that the mode is always visible in the unfolded band.
- **DEC-11**: Acceptance is generic: unit tests and Gherkin scenarios on synthetic repository
  fixtures (worktrees inside and beside the main checkout, several open changes, parallel
  sessions). The recorded failure becomes fixtures, not a named repository (Q-11).
- **DEC-12**: The review set scales with the stage's diff size and risk as well as the EPIC's
  appetite: a small or low-risk stage may merge the lenses into two reviewers (L1+L2, L3+L4+L5);
  the adversarial tester and the checker stay separate; the lead records the choice as a decision
  in `design.md`. The rule is data in `epic-delivery.workflow.json` (#148) — rejected: appetite
  only.
- **DEC-13**: The `code-reviewer` agent accepts a brief naming several lenses when it cites the
  recorded decision; without one it still refuses (#148).
- **DEC-14**: #188 enters whole: the lead-band check becomes a Gherkin scenario for every lead that
  owns a workflow; the lawyer's live trial in the contract repository runs as a close-stage task,
  its findings filed through `skillery-feedback` (Q-18).

## Rabbit-holes

- **Which commands are "release"** (DEC-5): too broad a match (any `git tag`) starts a release
  for a throwaway tag. The PLAN names the commands in the release workflow's data, not in code.
- **Following edits can flap** (DEC-2): a stray write into another worktree flips the followed
  change. Only the lead's writes re-root the lead, only writes inside a working tree of the same
  repository count, and the band always names the checkout it reads.
- **Merge detection** (DEC-5): a merge happens by `gh pr merge`, a web button or a `git merge`;
  only what the session itself runs is visible. The PLAN picks the evidence (command or repository
  state) and leaves the rest out.
- **"Stage size"** (DEC-12): it is easy to invent a line-count formula. Keep it a small, stated
  rule in the workflow data that a lead can read and override with a recorded decision.
- **Per-turn reads per root**: reading changes and git for several agents' roots at every turn end
  can slow a session; read only the roots that were active this turn.

## No-gos

- No navigator state outside the session atom; no new file written besides `deviations.md`.
- No workflow or phase per subagent; a subagent is shown, not navigated.
- No guessing a change by modification time.
- No opencode port: mods are Claude Code only (recorded, not a gap).
- No change to what a gate means or to the phases of any workflow, beyond DEC-5's signals.
- No hotkeys; no redesign of other mods' bands (ponytail draws below as today).
- No new reviewer lens and no change to what each lens checks (#148 changes only how many
  reviewers carry them).

---

## What Changes

- The navigator reads every repository fact from the worktree being worked, per agent, and follows
  the change the branch names, or none (#185).
- Each agent's root, branch, skill loads and task are kept apart in the session atom.
- Edits are recorded relative to the worktree they land in, so file gates and plan drift match.
- Accept writes `deviations.md` into the followed change in the followed worktree.
- New phase signals: archive move, merged PR, release commands; a change hand-off re-places the
  phase.
- **BREAKING (display):** the band becomes now / next / warning with a Details view; the skill
  trail, the subagent list, appetite and mode move into Details; warnings rank by severity.
- The "unused skill" check counts use per agent.
- The review set scales by stage size and risk; merged lenses with a recorded decision;
  `code-reviewer` accepts such a brief (#148).
- Gherkin for every lead's workflow on the band; the lawyer's live trial is run and reported
  (#188).
- The defect issue template's label names a label that exists (side note of #148).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `session-navigation`: which change the line and band follow; the band's shape; where the mode
  shows; subagents with their task.
- `drift-detection`: plan drift and deviations read the followed worktree; warning severity; the
  reworked unused-skill check.
- `workflow-definitions`: the archive, merge and release signals; a hand-off re-places the phase;
  the lead-band scenario.
- `epic-delivery`: the review set by stage size and risk; merged lenses by recorded decision.
- `pr-review-modes`: merged lenses allowed beyond TINY and SMALL when a decision is recorded.

## Impact

- `mods/navigator/`: `io.ts`, `register.tsx`, `types.d.ts`, `lib/change.ts`, `lib/phase.ts`,
  `lib/state.ts`, `lib/dispatch.ts`, `lib/view.ts`, and their tests; the bundled copy via
  `make bundles`.
- `skills/epic-delivery/` (SKILL.md, references, `assets/workflows/epic-delivery.workflow.json`),
  `skills/meaningfy-code-review/SKILL.md`, `agents/code-reviewer.md`,
  `skills/meaningfy-release/assets/workflows/release.workflow.json`.
- `tests/features/` (navigator and lead-band scenarios), `.github/ISSUE_TEMPLATE/defect.yml`.
- Docs: the navigator user and developer guides; CHANGELOG; `docs/skill-inventory.md` if a
  description changes.
