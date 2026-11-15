# Install check (task 1.1)

Date: 2026-11-15. CLI: `skills` 1.8.1 (`npx -y skills@1.8.1`), Node v22.23.5, run from a Claude Code
session (the CLI printed "Agent detected, installing non-interactively").

Scratch folder: `$S` = `/tmp/claude-1000/-home-lps-work-repos-skillery/ce2a5d27-9855-4040-8716-69b51bead992/scratchpad/spike-install`.
Every command ran from `$S` with this prefix (shown once, then written as `$E`):

```
E="DO_NOT_TRACK=1 DISABLE_TELEMETRY=1 HOME=$S/home CLAUDE_CONFIG_DIR=$S/claude XDG_CONFIG_HOME=$S/xdg"
env $E <command>
```

The forks were cloned read-only for the comparison: `agent-rules-books` at
`893a88a6fce3a80c565bf39ac65021b43a8b2990` and `wondel-ai-skills` at
`c5265583b1a9740f06831e1d3e89b35bba3eb430` (both equal to the pins of the plan).

## 1. Listing

| # | Command | Exit | Key output |
|---|---|---|---|
| 1 | `env $E npx -y skills@1.8.1 add meaningfy-ws/agent-rules-books --list` | 0 | "Found 14 skills" |
| 2 | `env $E npx -y skills@1.8.1 add meaningfy-ws/wondel-ai-skills --list` | 0 | 64 skills listed |

Names (checked one by one against the listed names):

- `agent-rules-books`: all 8 present (`refactoring`, `working-effectively-with-legacy-code`,
  `a-philosophy-of-software-design`, `clean-architecture`, `domain-driven-design`,
  `designing-data-intensive-applications`, `patterns-of-enterprise-application-architecture`, `release-it`).
- `wondel-ai-skills`: all 16 present (`negotiation`, `hundred-million-offers`, `mom-test`,
  `obviously-awesome`, `jobs-to-be-done`, `influence-psychology`, `predictable-revenue`,
  `monetizing-innovation`, `storybrand-messaging`, `one-page-marketing`, `made-to-stick`,
  `crossing-the-chasm`, `scorecard-marketing`, `good-strategy-bad-strategy`,
  `high-output-management`, `technical-documentation`).

Note: `--list` has no ref and reads the default branch head; it did not fail for either fork.

## 2. Install

| # | Command | Exit | Result |
|---|---|---|---|
| 3 | `env $E npx -y skills@1.8.1 add meaningfy-ws/agent-rules-books#893a88a6fce3a80c565bf39ac65021b43a8b2990 --skill refactoring clean-architecture --agent claude-code --global --yes` | 0 | "Installed 2 skills"; both copied |
| 4 | `env $E npx -y skills@1.8.1 add meaningfy-ws/wondel-ai-skills#c5265583b1a9740f06831e1d3e89b35bba3eb430 --skill technical-documentation --agent opencode --global --yes` | 0 | "Installed 1 skill"; copied |
| 5 | `env $E npx -y skills@1.8.1 add meaningfy-ws/agent-rules-books#893a88a --skill refactoring --agent claude-code --global --yes` | 1 | "Failed to clone repository ... Could not find remote branch 893a88a to clone" |
| 6 | as 3 but `--skill refactoring --skill clean-architecture`, with `HOME=$S/h2 CLAUDE_CONFIG_DIR=$S/c2` (fresh folders) | 0 | both skills installed |

The lock file records the full commit as `ref` for all three installed skills
(`$S/home/.agents/.skill-lock.json`).

### Where the files land (scratch tree)

```
claude/skills/refactoring/            (SKILL.md, refactoring.md, .mini.md, .nano.md)
claude/skills/clean-architecture/     (SKILL.md, clean-architecture.md, .mini.md, .nano.md)
home/.agents/.skill-lock.json
home/.agents/skills/technical-documentation/   (SKILL.md, references/)
```

- claude-code: `$CLAUDE_CONFIG_DIR/skills/<name>/` (so `~/.claude/skills/<name>/` for a normal user).
- opencode: `$HOME/.agents/skills/<name>/` (so `~/.agents/skills/<name>/`).
- Lock file: `$HOME/.agents/.skill-lock.json`.
- Not verified: that opencode itself reads `~/.agents/skills`; opencode was not run. The entry should
  carry `opencode_status: unverified (installed to ~/.agents/skills; opencode not run)` (DEC-14).
- The claude-code summary box printed `~/.agents/skills/<name> copy -> Claude Code` as the source, but
  no copy was left there; the final list shows `./claude/skills/<name>`.

### Installed equals fork

`diff -r` of each installed folder against the fork's folder of the same name: no difference for
`refactoring`, `clean-architecture` and `technical-documentation` (`technical-documentation` folder is
24 tracked files in the fork). Answer: yes.

## 3. Telemetry

`skills@1.8.1`, file `dist/_chunks/remove.mjs` in the npx cache:

- line 3349: `TELEMETRY_URL = "https://www.skills.sh/tele/t"`; line 3350: `AUDIT_URL = ".../tele/audit"`.
- line 3356 to 3358: `isEnabled()` returns `!process.env.DISABLE_TELEMETRY && !process.env.DO_NOT_TRACK`.
- line 3362: `fetchAuditData` returns early if not enabled; line 3382: `track` returns early if not enabled.

Either variable, set to any non-empty value, suppresses the event and the audit call. The network was
not watched; the evidence is the source. The only other outbound call found on the install path is
`https://api.github.com/repos/<owner>/<repo>` (line 595), which is not telemetry and is not switched off.

Side note: the real `~/.npm/_npx/6a6938656d30e380` already existed from 11:36, before this check; the
check's own npm cache went to the scratch `HOME`.

## Answers

| Question | Answer |
|---|---|
| 24 names listed, `agent-rules-books` | yes (8 of 8) |
| 24 names listed, `wondel-ai-skills` | yes (16 of 16) |
| Several skills in one command | space-separated after one `--skill` works; `--skill` repeated also works. Use the space-separated form |
| Full 40-character commit ref | works |
| Short ref (`#893a88a`) | fails, exit 1 ("Could not find remote branch") |
| Landing path, claude-code | `~/.claude/skills/<name>/` (follows `CLAUDE_CONFIG_DIR`) |
| Landing path, opencode | `~/.agents/skills/<name>/` |
| Installed equals fork | yes |
| Telemetry opt-out | `DO_NOT_TRACK=1` or `DISABLE_TELEMETRY=1`; `remove.mjs:3356-3358` |

Error-matrix rows answered: names present (no stop); full commit accepted (pin stays the commit); flags as
in the 1.8.1 help; `DO_NOT_TRACK=1` stops the event (source); opencode installs but its lookup of
`~/.agents/skills` is unverified.

## Recommended command templates

Claude Code:

```
DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/<fork>#<40-character-commit> --skill <name> [<name> ...] --agent claude-code --global --yes
```

opencode:

```
DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/<fork>#<40-character-commit> --skill <name> [<name> ...] --agent opencode --global --yes
```
