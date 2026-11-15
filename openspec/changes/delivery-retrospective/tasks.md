> Derives from: EPIC `delivery-retrospective` ([`proposal.md`](proposal.md)); design in
> [`design.md`](design.md). Waits for `delivery-process-and-tools` to be merged (its result line and
> hand-over notes).

## 1. The skill and its home (stage 1)

- [x] 1.1 `git mv` the two scripts from `inputs/scripts/` to `skills/session-retrospective/scripts/`
  (moved, not rewritten). Spec: *A skill holds the review scripts*.
- [x] 1.2 Write `skills/session-retrospective/SKILL.md` per D-11, lean on arrival (not in
  `skill-budget.yaml`). Declare it in `meaningfy-building` in `bundles.yaml`; run `make bundles` and
  `make skill-inventory`. Add one positive and one near-miss trigger probe to
  `tests/trigger_probes.yaml`. Re-index GitNexus for the new `scripts/` (`npx gitnexus analyze --skip-agents-md`). Acceptance:
  `make lint` green (`body_agnosticism` included: no `.claude/` path in the body), body ≤ 6 KB.
- [x] 1.3 D-8: give `epic_report.py` a `main(digest_dir)` and a `__main__` guard; exit 2 on a
  missing input file. Replace `--selftest` with `tests/test_session_retrospective.py`, carrying its
  asserts, on synthetic fixtures under `tests/fixtures/session-retrospective/`.

## 2. What the scripts read (stage 1)

- [x] 2.1 D-7: `repo_of` from the git root, worktree and removed-`cwd` cases. Test each case with
  temporary folders. Spec: *The repository is the git root*.
- [x] 2.2 D-6: unknown record count and warning. Read the record types of one real run (types and
  counts only, not committed) to fill the known list. Tests: a fixture with 2% unknown records
  warns, one with none does not; a session with assistant records and no usage warns; a run with no
  `cost-state` warns. Spec: *Unknown record types are counted and warned about*.
- [x] 2.3 D-5: default output folder and the refusal inside a git tree. Tests, with `HOME`
  monkeypatched to `tmp_path`: an output folder inside a `git init` folder exits 2 and writes
  nothing; the default under a home kept in git is refused; an output folder outside any tree is
  written. Spec: *Private text stays out of repositories*.
- [x] 2.4 D-1 to D-4: `mark`, `mark-bad` and `result` events in the digest; marks set phase, stage
  and epic (lead and its later subagents) in the report; `guessed:` label and guessed share; rounds
  keyed per D-3 and written to `rounds.tsv`; the shared `mark-lines.json` fixture (D-1). Tests: the
  fixture's lines; a subagent spanning a new mark (keeps its spawn-time epic and phase); a session
  with marks (no `guessed` row); a late mark (earlier events
  guessed); a malformed mark; a mark inside a fence (ignored); a round with the worker's line and
  the lead's line in a `Write` body file (one round, lead's count); a lead quoting `accepted=-`
  (no extra round); a re-review (two rounds); an archive skill after a deliver mark (guessed from
  there). Specs: *Phase and stage come from the latest mark*, *Round outcomes come from result
  lines, counted once*.

## 3. The mark in the skills and the navigator (stage 2)

- [ ] 3.1 Spike: check whether the navigator's `AnswerShown` text holds every text block of a turn
  or only the last (one real turn with a text block before a tool call). Record the answer in
  `evidence/answer-text.md` and pick the form of D-9.
- [ ] 3.2 D-10: the mark's form under the result line in `epic-delivery`
  `references/team-and-briefs.md`, the duty in its loop; one sentence each at steps 4 and 6 of
  `epic-planning`. Run `make bundles`. Specs: *The lead marks phase and stage*, *The lead marks
  shaping and the PLAN*.
- [ ] 3.3 D-9: the navigator warning at `TurnEnded`, with unit tests in `mods/navigator/lib/`: mark
  and implementer spawn in one turn, no warning; implementer spawn with no mark, one warning, the
  worker starts; a hand-over session's first turn (change read at the turn end), warning; a second
  unmarked turn, no second warning; an `Explore` spawn or a nested spawn, no warning; a
  `meaningfy-building:implementer` spawn, warning; no open change, no warning; the shared
  `mark-lines.json` fixture asserted against the navigator's pattern. Record the opencode gap in `docs/environment/dual-cli/compatibility.md`.
  Spec: *The navigator warns of a worker without a mark*. Acceptance: `make mods` green.
- [ ] 3.4 Agent scenario in `tests/features/epic-delivery.feature`: the lead starting stage 2 writes
  the mark before its first brief; shaping writes `phase=shape`. Walked by hand on Claude Code.

## 4. Docs and proof (stage 2)

- [ ] 4.1 `docs/environment/langfuse-setup.md`: the "Phase, stage or task, review outcome" row
  points to the mark and the result line. CHANGELOG line for the installer.
- [ ] 4.2 Real run, DEC-11: copy the transcripts of the last 14 days to a snapshot under
  `~/.cache/session-retrospective/` first, so the running session cannot change them; run the old
  scripts (from git history) and the new ones on that snapshot (`--root`), each with an explicit
  `--out` outside any git tree. Record in `evidence/real-run.md` only: run time, and sessions, subagents, calls, token sums and
  cost for both (equal), the guessed share, the unknown-record count. No prompt, path, title or
  command text. Acceptance: the invariant of the first row of design *Invariants* holds; the new digest
  plus the new report take under 60 s of wall clock together.

## Roadmap

- [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 — stage 1, one PR
- [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 4.1 · [ ] 4.2 — stage 2, one PR

## Verification

`make validate` green (script tests, `make mods`, lint, bundles, inventory),
`openspec validate delivery-retrospective --strict`, the agent scenario walked, and
`evidence/real-run.md` showing equal totals.
