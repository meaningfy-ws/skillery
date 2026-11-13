<!-- STATUS: DRAFT, parked 2026-11-11 as an input. Shaped from seed.md without the owner
     (delegated shaping); the owner keeps the EPIC as a note to shape later. Q-1 to Q-6 are open
     (see open-questions.md); every DEC- marked "proposed" stands only until the owner answers. -->


# EPIC: Rules first: skillery's rule skills over the CLI's own memory

**Golden-thread parents:** the archived EPIC
[`rules-in-every-session`](../../archive/2026-10-29-rules-in-every-session/proposal.md), whose reach
this change makes reliable, and the durable spec
[`rule-learning`](../../../specs/rule-learning/spec.md) (*Rules reach every interactive session*,
*Learning comes only from the owner's words*). This EPIC deliberately re-shapes that change's DEC-6,
which rejected a session hook (DEC-1 below).

## Appetite

**LARGE**, delivered in three stages that each ship alone (DEC-11):

1. **Setup you can see.** Every session knows whether rules load, and says what is missing.
2. **Rules before memory.** Rule statements are routed to `rule-learner`, and the CLI's own memory
   stops taking them.
3. **Migration.** The rules already in the CLI's memory move to the rulebook through one approval
   card.

It is LARGE because the boundary of who owns the user's preferences moves from the CLI to the
rulebook, a second mod joins `meaningfy-core`, and existing notes migrate. If the work starts to
change the rule model, precedence or the note format, or to parse session transcripts, it has
overrun this appetite. Stage 3 can be cut without touching stages 1 and 2.

## Why

The owner gives the agent standing instructions in every kind of session. Skillery has three skills
built to keep them (`rulebook`, `rule-learner`, `rule-steward`, in `meaningfy-core`), but on
2026-11-11 a plain standing instruction ("in this repo never ask for commit, pr, or merge, just do
these actions") went to Claude Code's own auto-memory and to a local permission file instead. It
never reached the rulebook. The seed (`inputs/seed.md`) records why:

1. **The CLI's instruction wins.** Claude Code's system prompt tells the agent, every turn, to save
   the user's preferences and corrections (`feedback` and `user` notes) to its auto-memory folder.
   `rule-learner` fires only when its description matches the moment. A standing instruction beats a
   skill description.
2. **The routing was not installed.** The routing line lives in
   [`docs/environment/global-prompt.md`](../../../../docs/environment/global-prompt.md), which each user
   pastes by hand into the CLI's global instructions. Nothing checks that they did.
3. **The store was unreachable.** `MEANINGFY_VAULT` was not set, so `rules.py load` exits 3
   ([`skills/rulebook/SKILL.md`](../../../../skills/rulebook/SKILL.md), *Running the script*).
4. **No hook exists.** [`hooks.yaml`](../../../../hooks.yaml) declares no rule intent;
   `meaningfy-core` ships only the `no-poll-loops` mod.
5. **Rules piled up in the wrong store.** In the auto-memory of the session that raised this, 4 of
   24 notes are `feedback` notes: rules in all but name. `rule-steward`, other projects, other
   clones and worktrees of the same repository, opencode and colleagues cannot see them.

The owner's goal: make the setup and use of skillery rule learning "an active exercise", and
"override claude automemory rules and strengthen them with skillery memory skills on rules in
particular".

## Solution outline

Three outcomes, one per stage.

**1. Setup you can see.** A new plain mod in `meaningfy-core` (working name `rules-first`) adds a
session-start hook. It runs `rules.py where` and gives the agent one short block of context: which
rule stores this session sees, and the routing instruction (load rules when an activity starts,
draft rule statements with `rule-learner`, show the card before the final summary). The routing then
reaches every Claude Code session that has `meaningfy-core`, whether or not the user pasted the
global policy. When a piece is missing, the agent says so once, under the rulebook's existing "say
once" rule, naming the missing piece and the setup page. `rules.py where` also reports whether the
routing policy is present in the CLI's global instructions, so a person can check the setup by hand
on either CLI.

**2. Rules before memory.** Two hooks in the same mod, plus one line of policy:

- **On the prompt.** When the user's prompt holds a rule cue ("always", "never", "from now on",
  "don't", "remember that", "no, do it this way"), the hook adds context: this may be a rule; draft
  it with `rule-learner` and do not save it to the CLI's memory. It never blocks the prompt.
- **On a memory write.** When the agent writes a `feedback` or `user` note into the CLI's
  auto-memory folder, the hook denies the write and names `rule-learner` instead. `project` and
  `reference` notes are written as before.
- **In the policy.** The global policy and the session-start context gain one sentence: preferences
  and corrections go to the rulebook, never to the CLI's memory.

The cue list and the routing text are data files in the rule skills, read by the mod at run time; the
mod carries no method (`docs/development/mods.md`).

**3. Migration.** `rule-learner` gains a short procedure: on the owner's request, read the CLI's
`feedback` and `user` memory notes as a named source (the L-1 exception), draft one approval card
from them, write what the owner approves, and delete the memory copies of approved and rejected rows
only after the owner confirms.

**The test of success.** The failure case of 2026-11-11, replayed in a fresh Claude Code session with
`meaningfy-core` installed: the owner states the same instruction, the agent shows it as a row of
the rule approval card before its final summary, the approved rule is written by `rules.py`, and no
new `feedback` note appears in the CLI's memory. On opencode the same replay ends with the card,
through the global policy.

## Key decisions

- **DEC-1** (proposed): Ship hooks for rules. This re-shapes DEC-6 of `rules-in-every-session`,
  which rejected a session-start hook because it is per CLI and would load rules before the activity
  is known. The reason has changed: the 2026-11-11 failure shows that a routing line the user must
  paste, and a skill description, both lose to the CLI's standing instruction. The new hook does not
  load rules; it reports the stores and the routing, so the activity-time `load` stays as it is.
  Rejected: prompt routing alone (it is what failed).
- **DEC-2** (proposed): One new plain mod in `meaningfy-core`, with one intent in `hooks.yaml` and
  several bindings (session start, prompt submit, pre-tool-use on writes). `mod_bindings_match`
  pairs a plain mod with an intent of its own name, which a single intent with several bindings
  satisfies. Rejected: adding the hooks to `no-poll-loops` (one mod, two purposes, and the name no
  longer says what it does); a separate rules bundle (the rule skills are in `meaningfy-core`, and
  an extra install defeats "every installer gets it").
- **DEC-3** (proposed): A bundle may hold several plain mods and at most one modules mod. `make
  bundles` merges the plain mods' `hooks.json` into the bundle's `plugin.json`. Today the generator
  (`tools/bundle_gen/gen.py`) and the `catalogue-governance` spec allow one mod per bundle; that
  limit came from the modules form (types, `userConfig`, `data/`), which plain mods do not use.
  Rejected: one mod per bundle with a combined "core hooks" mod (DEC-2).
- **DEC-4**: The mod carries no method. The rule cues and the routing text live as data files in
  the skill that owns them (cues in `rule-learner`, routing in `rulebook`), read at run time. The
  global policy quotes the same routing text. Rejected: cue words hard-coded in the mod.
- **DEC-5** (proposed): Redirect, do not disable. Auto-memory stays on; the hook denies only
  `feedback` and `user` notes, whose type is in the note's frontmatter, and its message names
  `rule-learner`. Project state and references stay in the CLI's memory. Rejected: turning
  auto-memory off (it loses project state, and it is a per-user setting a bundle should not change);
  a warning instead of a deny (a warning is one more instruction against the CLI's own, which is the
  failure). See Q-1 and Q-2.
- **DEC-6** (proposed): The prompt hook only adds context and never blocks. A false positive costs a
  few lines of context and a `REJECT` by `rule-learner`, whose "Not a rule" cases already cover a
  one-off request or a fact. A missed rule costs the rule. Precision is tuned by the cue list, not by
  the hook. See Q-3.
- **DEC-7**: `rules.py where` is the setup check, not a new command. It already reports the vault
  and the repository store (`skills/rulebook/references/commands.md`) and always exits 0; it gains a
  line for the routing policy. Rejected: a separate doctor script or `make` target (a second place
  that must know where each CLI keeps its global instructions).
- **DEC-8**: Migration reuses L-1's exception. A memory note is text the agent read, so it yields a
  candidate only when the owner names the source and asks to adopt its rules
  (`skills/rule-learner/SKILL.md`, L-1). No new learning rule is added. Memory copies are deleted
  only after the owner confirms, never as a side effect of the card.
- **DEC-9**: The store rule stays as it is. In a git repository a rule defaults to the repository
  store (L-9; `rules-in-every-session` DEC-2); elsewhere to the vault. This EPIC changes where a rule
  is *routed*, not where it is *stored*. See Q-4 for the authority-grant case.
- **DEC-10** (proposed): Success is measured with what is already traced. `rules.py stats` gains
  one count for the window: rules written (`add`, `confirm`, `update` calls). The replayed failure
  case is the acceptance test. Rejected: scanning the CLI's memory folder from the weekly review
  (personal files outside the vault, Claude Code only). See Q-5.
- **DEC-11**: Three stages in the order of the Appetite. Stage 1 first, because stage 2's routing
  rides on the session-start context and stage 3 needs a reachable store.
- **DEC-12**: opencode. It has no auto-memory, so the memory redirect has nothing to redirect there:
  that is the target state, recorded as "not applicable", not a gap. The session-start and prompt
  hooks run on opencode through `tools/opencode-plugin.mjs` where its plugin events allow, reusing
  the mod's functions as `no-poll-loops` does; where they do not, the global policy is the routing
  and the missing hook is a recorded gap in `docs/environment/dual-cli/compatibility.md`.

## Rabbit-holes

- **What the hook sees.** The memory-write hook must recognise a write into the CLI's auto-memory
  folder and read the note's type from the content being written. The folder is keyed to the
  session's start directory (seed finding 6); the PLAN pins the match on the folder's shape, never
  on one user's path. A write by another tool (a shell redirect) is not seen; accepted.
- **opencode plugin events.** Whether opencode's plugin API can add context at session start and on
  a user message is not yet verified in this repository. The PLAN checks it before stage 1 is
  planned in detail (RISK-2).
- **Data files for a plain mod.** Only a modules mod gets a `data/` folder today
  (`docs/development/mods.md`, *Bundling*). The plain mod must reach the skills' data files inside
  the installed bundle; the PLAN picks the path and a test that asserts it, as `rule-learner` D-2 did
  for the script.
- **Context budget.** The session-start block is read every session. It stays a few lines; the
  playbooks and rules are still loaded only by `load`, per activity.
- **The policy and the hook say the same thing.** The routing text has one home (DEC-4); the global
  policy quotes it, and a test asserts they match, so they cannot drift.
- **Fail open.** Like `no-poll-loops`, every hook lets the session run when `node`, `python3`, the
  script or a data file is missing; it never blocks work because the rule setup is broken.
- **Public repository.** No user's paths, vault location or memory notes go into skillery; tests use
  fabricated notes and folders.

## No-gos

- No change to the rule model, precedence, note format or the lint.
- No new rule store; no rules in the CLI's memory; no rule written without the owner's approval.
- No turning off the CLI's auto-memory from a bundle; no deny of `project` or `reference` notes.
- No Stop hook that holds the session open until a card is shown: it nags, and L-8 already places
  the card before the final summary.
- No loading of rules at session start: `load` stays per activity.
- No reading of session transcripts to find missed rules.
- No editing of a user's global instructions or settings by an installer; the setup check reports,
  the user changes.
- No hooks for scheduled or unattended runs: they neither load nor learn rules
  (`rules-in-every-session` DEC-3).
- No blocking of the user's prompt.

## Risks

- **RISK-1** (likely, medium): the prompt hook nags. Common words ("never", "don't") appear in
  ordinary prompts. Mitigation: context only (DEC-6), a cue list tuned with near-miss probes, and a
  short message the agent can dismiss.
- **RISK-2** (possible, medium): opencode's plugin API cannot add context at session start or on a
  prompt. Mitigation: the global policy remains the routing there, and the gap is recorded
  (DEC-12).
- **RISK-3** (possible, high): Claude Code changes the auto-memory folder or note format, and the
  redirect silently stops matching. Mitigation: the match is one function with tests over a
  fabricated note; the session-start block still routes; the replayed failure case is part of the
  release check.
- **RISK-4** (possible, medium): the deny confuses the agent into retrying or losing the statement.
  Mitigation: the deny message says exactly what to do instead (draft a `rule-learner` candidate for
  the card).
- **RISK-5** (unlikely, high): a rule stated with no store reachable is lost, because the memory
  write is denied. Mitigation: `rule-learner` already drafts the card without a store and offers the
  row text (*The script*); the session-start block has already said which store is missing.

## Success measure

- The replayed failure case passes on Claude Code (card row, approved rule written, no new
  `feedback` note) and on opencode (card row through the global policy).
- A fresh session with no vault and no global policy says once which piece is missing.
- After a month of use, `rules.py stats` shows rules written in the window, and the CLI's memory of
  the owner's main repositories gains no new `feedback` or `user` notes.

## Open questions

- **Q-1** Project-state notes (EPIC status, release history) stay where? (a) in the CLI's memory, as
  today; (b) in the spine (`openspec/`) and the repository's docs; (c) in the vault's project notes
  (`vault-project`). **Recommended: (a)** for this EPIC. They are state, not rules, and moving them
  is a separate question with its own costs; DEC-5 keeps them untouched.
- **Q-2** Restrict auto-memory how? (a) redirect: deny only `feedback` and `user` notes (DEC-5);
  (b) disable auto-memory in the user's settings; (c) policy line only, no hook. **Recommended:
  (a).** (b) loses project state; (c) is what failed on 2026-11-11.
- **Q-3** How eager is the prompt hook? (a) fire on any cue in the list, context only (DEC-6); (b)
  fire only on first-person standing forms ("from now on", "always ... when", "in this repo never");
  (c) no prompt hook, rely on the memory redirect. **Recommended: (a)**, with the near-miss probes
  ("never mind", "don't worry about it", "I never got that mail") deciding the list before release.
- **Q-4** A personal authority grant scoped to one repository ("in this repo never ask for commit,
  PR or merge") goes where? (a) the repository store (`docs/rules/P-NNNN`), shared with the team; (b)
  the vault, scoped `project:<name>`; (c) the repository's `AGENTS.md` by hand. **Recommended: (b)**
  for grants of authority, since a repository rule binds every teammate's agent and this repository
  is public; team conventions keep the repository default (DEC-9). This needs `load` to know the
  project, which the PLAN settles (pass `--context project=<repo>` or infer it from the git root).
- **Q-5** How does `rule-steward` show the change worked? (a) a count of rules written per window
  from traced calls (DEC-10); (b) (a) plus a count of memory writes the hook denied; (c) no new
  measure, the replayed case only. **Recommended: (a).** A denied write is a hook event, not a
  traced `rules.py` call, and counting it needs a new trace path.
- **Q-6** Does stage 3 run for every user or once for the owner? (a) a documented procedure in
  `rule-learner` any user can ask for (DEC-8); (b) a one-off for the owner, done in a session and not
  shipped. **Recommended: (a)**: every Claude Code user with auto-memory has the same notes.

---

## What Changes

- New plain mod in `meaningfy-core` (working name `rules-first`): a session-start hook (stores and
  routing), a prompt-submit hook (rule cues), and a pre-tool-use hook on writes that denies
  `feedback` and `user` notes in the CLI's auto-memory folder; one new intent in `hooks.yaml`.
- `tools/bundle_gen/gen.py` and the `catalogue-governance` spec: several plain mods per bundle, at
  most one modules mod; the bundle's `plugin.json` merges their hooks.
- `tools/opencode-plugin.mjs`: the session-start and prompt hooks where opencode's events allow,
  reusing the mod's functions; otherwise recorded gaps.
- `rulebook`: the routing text as a data file; `rules.py where` reports the routing policy;
  `rules.py stats` counts rules written in the window.
- `rule-learner`: the cue list as a data file; a migration procedure from the CLI's memory under L-1.
- `docs/environment/global-prompt.md`: the rules line quotes the routing text and adds "never to the
  CLI's memory"; `docs/environment/rules.md`, `setup.md`, `dual-cli/compatibility.md`,
  `docs/development/mods.md` and `hook-bindings.md` updated.
- Trigger probes for the changed descriptions, Gherkin scenarios for the hooks and the replayed
  failure case, `CHANGELOG.md`.

## Capabilities

### New Capabilities
- `rules-first-routing`: rule statements and the CLI's own memory writes are routed to the rule
  skills, and every session reports whether its rules can load.

### Modified Capabilities
- `rule-learning`: rules reach sessions through the bundle's hooks as well as the global policy;
  preferences and corrections are kept by the rulebook, not the CLI's memory; migration from the
  CLI's memory.
- `catalogue-governance`: a bundle may hold several plain mods and at most one modules mod.

## Impact

- `mods/` (one new folder), `hooks.yaml`, `bundles.yaml`, `make bundles` outputs,
  `tools/bundle_gen/gen.py`, `tools/repo_lint/lint.py` if a check changes,
  `tools/opencode-plugin.mjs`.
- `skills/rulebook/` (`scripts/rules.py`, `references/commands.md`, a data file),
  `skills/rule-learner/` (`SKILL.md`, a data file), `skills/rule-steward/SKILL.md`,
  `tests/test_rulebook.py`, `tests/trigger_probes.yaml`, `tests/features/`.
- `docs/environment/` (global-prompt, rules, setup, dual-cli/compatibility),
  `docs/development/` (mods, hook-bindings), `CHANGELOG.md`.
- External: each user's Claude Code auto-memory folder (read and, on approval, cleaned in stage 3);
  no change to any user's settings.
