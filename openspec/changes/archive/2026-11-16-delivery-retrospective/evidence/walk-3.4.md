# Walk of task 3.4: the mark line, by hand on Claude Code

Who: the developer (a person validates; an agent never marks this done). Decisions: D-24, D-27.

## Before you start

1. The installed plugins carry the mark rule: `/plugin` shows `meaningfy-building` and
   `meaningfy-navigator` at the release that holds PR #269 (3.16.0 or later).
2. Build the sandbox (a throwaway git repository with four fake changes, no remote):

   ```bash
   bash openspec/changes/delivery-retrospective/evidence/walk-3.4/setup.sh   # ~/sandbox/walk-3.4
   ```

3. Each scenario is one fresh session: `cd ~/sandbox/walk-3.4 && claude`. Paste the prompt,
   watch for the check, then stop the session (Esc, `/exit`) as soon as the check is decided.

## Scenarios

| # | Prompt to paste | Passes when | Fails when |
|---|---|---|---|
| S1 stage start | `Act as the team lead. Deliver stage 1 of openspec/changes/walk-stage. Sandbox: no commit, no PR; stop after the first builder reports.` | The line `mark: change=walk-stage phase=deliver stage=1` stands alone in the lead's message before the first Agent call, again in that turn's last message, and the navigator band shows no "No mark line" warning | No mark, a mark only inside a code block or tool input, or the warning shows |
| S2 hand-over | `Act as the team lead. Deliver stage 2 of openspec/changes/walk-handover from its handover.md. Sandbox: no commit, no PR; stop after the first builder reports.` | `mark: change=walk-handover phase=deliver stage=2` before the first brief | The first brief goes out with no mark |
| S3 shaping | `Shape the EPIC for openspec/changes/walk-shape from its inputs/seed.md, with the epic-planning skill.` | `mark: change=walk-shape phase=shape stage=-` at the start of shaping | Shaping starts with no mark, or a `deliver` phase |
| S4 PLAN | `Derive the PLAN for openspec/changes/walk-plan from its proposal.md, with the epic-planning skill.` | `mark: change=walk-plan phase=plan stage=-` at the start of the PLAN | No mark, or `phase=shape` |
| S5 warning (optional) | `Act as the team lead for openspec/changes/walk-stage. Write no mark line in this session. Brief one implementer for task 1.1, then stop.` | The navigator shows "No mark line in this session…" once, and the implementer still starts | No warning, a second warning, or the spawn is blocked |

## Optional: the report reads the marks

After the scenarios, the sandbox sessions should show phases without `guessed:`:

```bash
d=~/.cache/session-retrospective/walk && rm -rf "$d"
root=~/.claude/projects/$(echo ~/sandbox/walk-3.4 | sed 's#[/.]#-#g')
python3 skills/session-retrospective/scripts/session_digest.py --days 1 --root "$root" --out "$d"
python3 skills/session-retrospective/scripts/epic_report.py "$d" && cat "$d/phases.tsv"
```

## Lead's runs, before the sign-off (2026-11-15)

Headless sessions (`claude -p`, one per scenario, `--max-turns` 15–20) in the sandbox, on the
developer's word to proceed. Read from the stream: where the lead's text holds a mark line,
against its first `Agent` call. "Block" is the position among the lead's content blocks.

| Run | Skills | S1 | S2 | S3 | S4 |
|---|---|---|---|---|---|
| 1 | 3.16.0 installed | fail: worker briefed, no mark | fail: no mark | fail: mark written into `proposal.md` as an HTML comment | fail: same, in `design.md` |
| 2 | fix 1 (D-29), by `--plugin-dir` | mark only in the final message, after a reader agent | same | fail: stopped for questions before step 4, no mark | fail: PLAN written, no mark |
| 3 | fix 2: *Mark first* at the head of `epic-planning` | | | pass: block 5 of 12, in the reply | pass: block 5 of 24 |
| 4 | fix 3: delivery step 1 "first reply, before any read" | pass: block 5, agent at 14, again in the last message | pass: block 5, again in the last message (no worker by turn 20) | | |
| 5 | fixes 2–3 on the lean skills of 3.17.0 (2026-11-16) | pass: block 5, agent at 18, again last | pass: block 5, again last | pass: block 5 | pass: block 5, again at step 6 |

The report on run 3 and 4 sessions takes their phases from the marks (`shape`, `plan`,
`deliver`); events before block 5 stay guessed, as the late-mark rule says. S5 is not run
headless: the navigator band does not show in `claude -p`; its warning is covered by
`mods/navigator/lib/mark.test.ts`.

## Result (filled by the developer)

| # | Pass / fail | Note |
|---|---|---|
| S1 | pass | the lead's run 5 |
| S2 | pass | the lead's run 5 |
| S3 | pass | the lead's run 5 |
| S4 | pass | the lead's run 5 |
| S5 | not walked | covered by unit tests; the band does not show headless |

Signed off by: the developer, Eugeniu Costetchi, on 2026-11-16, on the lead's run 5: "go ahead
with task 3.4, and skip the demo, just go ahead". Task 3.4 ticked; `~/sandbox/walk-3.4` removed.
