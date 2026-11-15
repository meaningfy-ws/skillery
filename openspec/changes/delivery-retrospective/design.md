> Derives from: EPIC `delivery-retrospective` ([`proposal.md`](proposal.md)), appetite MEDIUM.

## Context

The two scripts, first in `inputs/scripts/` and moved by task 1.1 to
[`skills/session-retrospective/scripts/`](../../../skills/session-retrospective/scripts/), produced the 2026-11-14 findings.
`session_digest.py` (stdlib, read-only) turns the Claude Code transcripts under
`~/.claude/projects/` into `sessions.jsonl`, `agents.jsonl` and `events.jsonl`; `epic_report.py`
turns those into `epics.tsv`, `phases.tsv` and `signals.txt`. Today:

- phase is the last skill the lead loaded (`SKILL_PHASE` in `epic_report.py`); stage is unknown;
- `epic_report.py` runs at import time from `sys.argv`, so it cannot be tested;
- `repo_of` assumes `~/work/repos/<name>`;
- `--out` defaults to `./session-digest`, which is inside the repository when run from one;
- an unknown record type is skipped in silence.

`delivery-process-and-tools` (R3) is delivered before this EPIC. It gives the result line
(its DEC-18, in `skills/epic-delivery/references/team-and-briefs.md`) and makes one session one
stage with a hand-over note (its DEC-1). This PLAN reads both and changes neither.

The navigator mod receives, at the end of each main turn, `AnswerShown` with `result.text`
(`mods/navigator/register.tsx`), and `SpawnStarted` for each subagent. Whether `result.text` holds
every text block of the turn or only the last one is not known (task 3.1).

The PLAN was attacked on 2026-11-15 by a fresh reader; its twelve counterexamples are folded into
D-1 to D-9, the error matrix, RISK-6 to RISK-8 and tasks 1.2, 2.2 to 2.4, 3.3 and 4.2.

## Goals / Non-Goals

**Goals:** the skill and its two scripts, tested in `make validate`; marks written by the lead and
read by the report; result lines read and counted once; the four mitigations of DEC-7 to DEC-10;
one real run as evidence.

**Non-Goals:** everything under the EPIC's no-gos. Also: no new metric, table or signal beyond
what the marks and result lines add; the rest of the report keeps its current output.

## Decisions

Settled in the EPIC: DEC-1 to DEC-11. New here:

- **D-1** Mark parsing. A mark is a whole line of a main-session assistant text block, outside a
  fenced code block, that matches
  ``^[-*\s`]*mark: change=([a-z0-9][a-z0-9-]*) phase=(shape|plan|deliver) stage=(\d+|-)`?\s*$``
  (the same bullet and backtick wrapping as D-3). A line that matches ``^[-*\s`]*mark:`` and not the
  full pattern is an event `mark-bad`, counted in `signals.txt`, never used. The navigator uses this
  same pattern; one fixture string list, `tests/fixtures/session-retrospective/mark-lines.json`
  (lines and whether each is a mark), is asserted by the Python tests and the navigator's unit test. Marks in subagents, in tool inputs and in fenced blocks are ignored (only the lead writes
  them, in its own words).
- **D-2** A mark also sets the session's current epic to its `change`, overriding the path guess
  from that point on, because the mark is the lead's own statement. A subagent's events take the
  epic, phase and stage in force when it was spawned (its first record), for its whole life, even if
  the lead writes a new mark meanwhile.
- **D-3** Result lines. A line, outside a fenced block, that matches
  `^[-*\s`]*result: stage=(\S+) role=(tester|reviewer|checker)( \w[\w-]*=\S+)+`?\s*$` (a list
  bullet or a backtick around it allowed) is an event `result` with its key-value pairs. Worker
  lines are read from a subagent's assistant text and count only with `accepted=-`. Lead lines are
  read from the lead's assistant text, a `Bash` command (`gh pr create` or `gh pr edit` body) and
  the `content` of a lead `Write` or `Edit` (a body file), and count only when `accepted` is a
  number, so a lead quoting a worker's line adds nothing. A round's key is (session, stage, role,
  lens); the n-th worker line under one key is round n. A lead line fills `accepted` of the latest
  round under its key that has none; a lead line with no worker round makes one round. Rounds are
  never matched across sessions. Result and mark lines are extracted from the full text or input
  before `emit` truncates it (`limit`). The rounds are written to `rounds.tsv` in the digest folder,
  columns `repo, epic, session, stage, role, lens, round, findings, accepted, verdict` (`-` where
  a column does not apply), and `signals.txt` sums them by role.
- **D-4** Phase attribution in the report: for each session, walk its events in time order; before
  the first valid mark, phase comes from `SKILL_PHASE` as today and the row's phase is prefixed
  `guessed:`; from a mark on, phase and stage are the mark's until the next mark, or until the lead
  loads a skill `SKILL_PHASE` files under `archive` or `release`, which ends the mark's span and
  returns to the guess (DEC-4). `phases.tsv` gains a `stage` column. `signals.txt` prints "guessed
  share of cost: N%".
- **D-5** Output folder. Default `~/.cache/session-retrospective/<YYYY-MM-DD>`. Before writing, the
  script runs `git -C <nearest existing parent of the output folder> rev-parse --show-toplevel`; if
  it succeeds, the script exits 2 with "output folder is inside a git working tree: <root>; pass
  --out outside it" and writes nothing. That also catches a home folder kept in git, where the
  default is refused too; there is no override. Without `git` on the path, it falls back to looking
  for a `.git` entry in the parents.
- **D-6** Format drift. Every line read counts in the denominator, the skipped `api-request` and
  `attachment` lines included. Known types: those the script handles plus those seen in the
  owner's real transcripts and skipped on purpose, in one constant (task 2.2). Unknown records and
  unparseable lines are counted per type; above 1% of lines, the digest warns on stderr with the
  counts and types. Two sentinels warn whatever the share: a session with assistant records and no
  usage at all, and a run where no session has a `cost-state` record (a renamed field inside a known
  type). The output is still written; the exit code stays 0. Messages, one line each on stderr:
  `warning: unknown records <n> of <total> lines (<p>%, threshold 1%): <type>=<n>, ...` with `<p>`
  to one decimal and the threshold compared before rounding; `warning: session <id8> has assistant
  records and no usage`; `warning: no session has a cost-state record`.
- **D-7** Repository. From the session's `cwd`, walk up to the first folder holding `.git`. A `.git`
  folder: the repository is that folder's name. A `.git` file (a worktree): read its `gitdir:` path,
  which ends in `<repo>/.git/worktrees/<name>`, and take `<repo>`. When `cwd` no longer exists (a
  removed worktree): use the part of `cwd` before `/.claude/worktrees/` when present, else the last
  folder of `cwd`.
- **D-8** Testability. `epic_report.py` gets a `main(digest_dir)` and a `__main__` guard; the
  module-level code moves into functions without changing its output except D-3 and D-4. The
  `--selftest` of `session_digest.py` is replaced by pytest tests, not kept beside them.
- **D-9** The navigator warning is evaluated at `TurnEnded`, never at the spawn: `AnswerShown`
  and the change read arrive only at the end of a turn, after the spawn (`register.tsx`), so a
  check at the spawn would warn every lead that wrote its mark in the same turn, and would see no
  change on a hand-over session's first turn. State gains `marked`, `markWarned` and
  `workerThisTurn` (booleans; `Started` resets all three, a resumed session included, which the
  rule covers: a resumed session writes its mark before its first brief). A worker is a spawn whose
  `SpawnAsked` signal has no `agentId` (the lead's own, not a nested spawn) and whose `type` equals
  `implementer` or `code-reviewer` or ends with `:implementer` or `:code-reviewer` (the plugin
  prefix, as in `meaningfy-building:implementer`); `SpawnAsked` sets `workerThisTurn`. An
  `Explore`, `Plan` or other reader is not a worker. `AnswerShown` whose text holds a line matching
  the D-1 pattern sets `marked`. At `TurnEnded`, when `workerThisTurn`, `change` not null, `marked` false and
  `markWarned` false, the navigator adds one warning "No mark line in this session: write the mark
  line (epic-delivery)" and sets `markWarned`; it then clears `workerThisTurn`. Task 3.1 checks
  whether `AnswerShown` holds every text block of the turn; if it holds only the last, the rule in
  `epic-delivery` asks for the mark in the turn's last message too.
- **D-10** Where the mark sentence sits: `epic-delivery` defines the form in
  [`references/team-and-briefs.md`](../../../skills/epic-delivery/references/team-and-briefs.md),
  section *What every brief names*, item 6, directly under the three result-line forms, and its
  `## The loop of a stage` names the duty in one sentence; `epic-planning`
  ([`SKILL.md`](../../../skills/epic-planning/SKILL.md), section *Procedure*) adds one sentence to
  step 4 (`phase=shape`) and one to step 6 (`phase=plan`).
- **D-11** Skill shape. `skills/session-retrospective/SKILL.md`, body target 6 KB, no references
  unless the body passes it: title and the bias it corrects (guessing where the time went), Quick
  Start (run both scripts on 14 days, read `signals.txt`), Rules with a Common mistakes table
  (cost per epic is an estimate; count Langfuse by `tool_id`; guessed rows are not facts; never
  commit a digest), Triggers (after an EPIC is archived; before a cost decision such as
  `test-suite-care`), Boundary. The body names no `.claude/` path (the `body_agnosticism` check):
  it says "the CLI's local transcripts, the script's default folder". Facets: purpose `software-development`, area `coding`, subject
  `spec-driven`, posture `precise`, stage `any`, maturity `experimental`.

## Algorithm / approach

Worked example, a delivery session of change `x`, stage 2:

```text
lead text:   "mark: change=x phase=deliver stage=2"
lead:        Agent(implementer)          -> no result line (builders write none)
lead:        Agent(code-reviewer L1+L2)  -> worker text "result: stage=2 role=reviewer lens=L1+L2 findings=3 accepted=-"
lead Bash:   gh pr create --body "... result: stage=2 role=reviewer lens=L1+L2 findings=3 accepted=1 ..."
```

`events.jsonl` gets `mark` (epic `x`, phase `deliver`, stage `2`), the dispatches and commands,
and two `result` events. `epic_report.py` files every later event under `x / deliver / 2`, and
`rounds.tsv` shows one reviewer round for (x, 2, reviewer, L1+L2), findings 3, accepted 1. A
session for change `y` with no mark files its events as `guessed:deliver`, stage empty, and the
guessed share rises by their cost.

Idempotency: both scripts are pure functions of the transcripts; a re-run overwrites its output
folder's files and gives the same result for the same input.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Back-fill a mark onto earlier events | Leave them guessed and labelled | DEC-5; a late mark would rewrite history the session did not state |
| Commit a real digest, or a fixture cut from a real transcript | Hand-written synthetic fixtures | DEC-7; skillery is public |
| Copy the 2026-11-14 findings into the skill | Point to running the scripts | Lean standard; findings age |
| Fail the digest on an unknown record | Count, warn, carry on | DEC-8; a partial review beats none |
| Count the worker's and the lead's result line as two rounds | Key by (session, stage, role, lens), worker lines by order | D-3 |
| Treat a quoted or fenced `mark:` or `result:` line as real | Whole lines outside fences; lead lines need a numeric `accepted` | D-1, D-3 |
| Let a deliver mark cover the archive and release work after it | End the span at an archive or release skill | D-4, DEC-4 |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| Output folder inside a git tree | D-5 walk-up | Exit 2, message names the root, nothing written |
| Transcript format moved | Unknown records > 1% of lines (D-6) | Warning on stderr with types; output written |
| A field renamed inside a known type (`usage`, `cost-state`) | D-6 sentinels | Warning naming the sentinel; output written |
| Home folder kept in git | `rev-parse` succeeds for the default (D-5) | Exit 2: pass `--out` outside it |
| Lead's count in a body file or `gh pr edit` | D-3 reads `Write`/`Edit` content and both commands | Round gets the count |
| Lead quotes a worker's line, or a reviewer quotes the worked example | Lead line without a number; fenced or partial line | Not counted (D-3) |
| A re-review after the fix pass | Second worker line under the same key | Round 2 (D-3) |
| Archive or release after the last deliver mark | Archive or release skill load | Span ends; guessed (D-4) |
| Resumed session | `Started` resets `marked` | One warning unless the lead marks again, as the rule asks |
| A line starts `mark:` but is malformed | D-1 regex fails | `mark-bad` event, counted in `signals.txt`, ignored |
| Lead never writes a mark | No `mark` event in the session | Rows `guessed:`; guessed share printed; navigator warning (Claude Code) |
| Mark written mid-session | Events before it have no mark | Those stay guessed (D-4) |
| Result line from the worker only | No lead line for the round key | One round, `accepted` unknown |
| Session `cwd` deleted | `cwd` not a folder | D-7 fall-back |
| Corrupt JSON line | `json.loads` fails | Skipped as today, counted as unknown (D-6) |
| Empty or missing digest folder for the report | File not found | `epic_report.py` exits 2 naming the missing file |
| `AnswerShown` lacks mid-turn text | Task 3.1 spike | Rule asks for the mark in the last message (D-9) |

## Invariants

| Invariant | Test |
|---|---|
| Sessions, subagents, calls, token sums and cost do not change from the old scripts on the same transcripts | Task 4.2 real run (old against new) |
| No event before a session's first mark carries a mark's phase | Unit test, task 2.4 |
| A worker line and the lead's line for one round count once | Unit test, task 2.4 |
| The digest never writes inside a git tree | Unit test, task 2.3 |

## Risks / Trade-offs

- **RISK-1** Private text leaks into the public repository (likely without care, high impact).
  Mitigated: DEC-7, D-5, synthetic fixtures, evidence as numbers only, reviewer lens on the
  evidence file.
- **RISK-2** Claude Code changes its transcript format in a release (likely over months, medium
  impact). Mitigated: D-6 warning; the old numbers stay comparable through task 4.2's check.
- **RISK-3** Leads skip the mark (likely at first, medium impact). Mitigated: D-9 warning on Claude
  Code, `guessed` label and share everywhere; accepted on opencode (parity gap recorded in
  `docs/environment/dual-cli/compatibility.md`).
- **RISK-4** Owner-specific layout gives wrong repository names on another machine (certain on
  other machines, low impact). Mitigated: D-7.
- **RISK-5** The 2026-11-14 window rolls out of the transcripts before delivery (certain after about
  30 days). Accepted: task 4.2 compares old and new scripts on the same transcripts instead.
- **RISK-6** The navigator misses a mark written mid-turn if `AnswerShown` carries the last text
  block only, and warns falsely once. Mitigated: task 3.1 checks it; the rule then asks for the
  mark in the last message too; a false warning never blocks.
- **RISK-7** A lead explaining the rule writes an example mark as a whole line outside a fence, and
  the report takes it as real (unlikely, low impact). Accepted: the skill text puts examples in
  fences; a wrong mark shows as an odd change id in the report.
- **RISK-8** Tester and checker rounds have no lens, so two rounds of one stage are told apart only
  by order (D-3). Accepted: order within one session is reliable.
- Trade-off: a mark is one more line the lead must remember at every stage; it is the price of a
  stage that is stated, not guessed.

## Open Questions

None blocking. Task 3.1 settles the only unknown (what `result.text` holds) before stage 3 codes it.

## Delivery decisions

Recorded by the lead during stage 1 (2026-11-15).

- **D-12** Stage 1 started before wave 4 on the developer's word ("proceed to next stage here"):
  it touches only the scripts, the new skill and its tests. Stage 2 edits `epic-delivery` and
  checks its order against `delivery-process-and-tools` first.
- **D-13** Builders grouped by file: one for 1.1 and 1.3 (scripts and tests), one for 1.2 (the
  skill) in parallel, one for 2.1 to 2.4 in order, since all four edit the same two scripts.
- **D-14** `rounds.tsv` is written by `epic_report.py`, not the digest: a round needs the report's
  epic attribution (refines D-3).
- **D-15** A subagent takes the lead's mark only when one was in force at its spawn; with none,
  its own path guess stays, so unmarked totals and grouping do not change (refines D-2).
- **D-16** The mark is read before the model call of the same record, so the call that writes the
  mark is filed under it; a mark in a later block of the same message leaves that one call guessed.
- **D-17** A lead line identical to the last lead-made round of its key (a PR body created, then
  edited) adds no round (refines D-3).
- **D-18** `session_digest.py` gets `main(argv)`; `phases.tsv` is `repo, epic, phase, stage,
  est_usd`; `signals.txt` adds the guessed share, the malformed-mark count and review rounds by
  role.
- **D-19** The D-6 known list comes from one type count over the owner's real transcripts
  (692,696 lines, none unparseable); only type names are in the code.
