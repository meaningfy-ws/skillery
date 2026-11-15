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

## Result (filled by the developer)

| # | Pass / fail | Note |
|---|---|---|
| S1 | | |
| S2 | | |
| S3 | | |
| S4 | | |
| S5 | | |

Signed off by: ______ on ______. Then tick task 3.4 and remove `~/sandbox/walk-3.4`.
