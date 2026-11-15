---
name: session-retrospective
description: "Use this skill after an EPIC is archived, or before a decision about delivery cost or process (for example how much testing a stage deserves), to review where agent-session time and money actually went: run the digest and report scripts over the CLI's local transcripts, then read the signals and the rounds table instead of guessing. Owns running and reading that review. The mark line is defined by epic-delivery; the Langfuse usage report of rules is rule-steward."
license: Apache 2.0
metadata:
  purpose: software-development
  area: coding
  subject: spec-driven
  posture: precise
  stage: any
  maturity: experimental
---

# Session retrospective

After an EPIC people say "the reviews cost too much" or "stage 2 dragged". Memory favours the
loud moments and forgets the quiet hours. This skill replaces the guess with a count: how long each
session ran, what it cost, in which phase and stage, and how many review rounds each stage took.

## Quick Start

Worked example: review the last two weeks. Write the digest outside every repository (private text
lives in it), then report on it.

```bash
python3 skills/session-retrospective/scripts/session_digest.py --days 14 --out ~/retro/2026-11-15
python3 skills/session-retrospective/scripts/epic_report.py ~/retro/2026-11-15
```

1. `session_digest.py` reads the CLI's local transcripts (read-only) and writes `sessions.jsonl`,
   `agents.jsonl`, `events.jsonl` and `rounds.tsv`. Without `--out` it writes to the script's default
   folder, `~/.cache/session-retrospective/<date>`. It refuses any folder inside a git working tree
   (exit 2, nothing written), the default included when the home folder is kept in git.
2. `epic_report.py` reads that folder and writes the tables and `signals.txt`.
3. Read `signals.txt` first: cost and time per epic, per phase and stage, the share of cost that is
   guessed, and review rounds by role. Then open `rounds.tsv`, one row per review round
   (`repo, epic, session, stage, role, lens, round, findings, accepted, verdict`), to see which
   stage took three rounds and whether the findings were accepted.
4. Warnings on stderr (`unknown records`, `no usage`, `no cost-state`) mean the transcript format
   moved: the numbers are lower bounds until the script is updated.

## Rules

- **Phase and stage come from the lead's mark line**, whose form `epic-delivery` defines. Before the
  first mark, and for archive and release, the script guesses from the skills loaded; those rows
  are labelled `guessed:` and their share is printed. Treat a guessed row as a hint.
- **Cost per epic is an estimate.** It sums the CLI's own cost records over sessions that touched
  the epic; a session that worked on two epics is split by its marks, or by path when unmarked.
- **Rounds come from result lines** (`result:` forms in `epic-delivery`). No line, no round: a
  stage with no lines is unmeasured, not free.
- **Count Langfuse by `tool_id`, never by spans.** It holds about a third fewer events than the
  transcripts and may repeat a long turn; the scripts read the transcripts for that reason.
- **Never commit a digest.** It holds prompts, reports and commands. Keep it outside the repository
  and share numbers only, never text. Findings belong in the EPIC's notes, not in this skill.
- **One run, one question.** State what you want to learn (which phase costs most; do reviews
  find what testers miss) before opening the files, and stop when it is answered.

### Common mistakes

| Mistake | Instead |
|---|---|
| Quote a cost per epic as exact | Say "about", and name the guessed share |
| Read a stage with no result lines as cheap | Report it as unmeasured |
| Run with `--out` inside the repository | Use a folder outside any git tree; the script refuses it |
| Ignore a format warning | Fix or flag the script before trusting the totals |
| Compare Langfuse spans with the report | Count distinct `tool_id`, or use the report |
| Paste a digest or a prompt into an issue or PR | Paste counts only |

## Triggers

- After an EPIC is archived: review its sessions, stages and rounds.
- Before a cost or process decision, such as `test-suite-care` or how many reviewer lenses a stage
  gets: look at what the last EPICs really spent.
- When the report warns of format drift: update the scripts, then run again.

## Boundary & Related Skills

**Owns:** running the two scripts, reading `signals.txt` and `rounds.tsv`, and the caveats on what
the numbers mean.

**Delegates:** the mark line and the result lines, and the duty to write them → `epic-delivery`
(shaping and planning cite it from `epic-planning`); the Langfuse usage report of the owner's rules
→ `rule-steward`; the decision a review informs → the EPIC that makes it.

**Related:** `epic-delivery`, `epic-planning`, `spec-stewardship`, `test-strategy`, `rule-steward`.
