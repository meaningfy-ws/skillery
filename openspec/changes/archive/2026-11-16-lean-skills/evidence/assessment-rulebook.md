# Assessment: rulebook
Before: body 7742 bytes, references 19530 bytes. After: body 6369, references 18189.

Total 27272 → 24558, under the 24576 budget; no `over_budget` entry needed. `scripts/rules.py` and
`assets/` are material and untouched. Line numbers are those of the files before the rewrite.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title, l. 14 | keep | body title | |
| 2 | § Overview, l. 18-24 (owner's statements become explicit rules; script decides, agent proposes; nothing statistical) | keep | body bias sentences | "nothing learned statistically" dropped: rule-learner states symbolic learning |
| 3 | § Overview, l. 26-28 (where the model and commands are) | keep | two pointer sentences (Workflow end, Rules) | D-5 form |
| 4 | § Quick Start, l. 30-62 | keep | body Quick Start, unchanged | |
| 5 | § Running the script, l. 66-73, 76-77 | keep | body Rules, Running the script | tests need "never as `cd`", `MEANINGFY_VAULT` |
| 6 | § Running the script, l. 74-75 (permission rule link) | keep | the `commands.md` pointer sentence | |
| 7 | § Running the script, l. 78 (plain text, safe to show) | drop | | the model sees the output |
| 8 | § Where rules live, l. 82-90 | keep, drop | body Rules, one sentence (stores, `where`) | paths repeat the rule model's Lifecycle, Repository store and playbook paragraph; required properties → `vault-conventions` (Related) |
| 9 | § Use protocol, l. 94-107 | keep | body Workflow: the use protocol, unchanged | CHK-112 cites "Use protocol, step 4": still true |
| 10 | § Precedence, l. 111-115 | drop | | repeats the rule model's Precedence; pointer covers it |
| 11 | § Writing rules, l. 119-129 | keep | body Rules, Writing rules (name kept for CHK-117) | |
| 12 | § Gotchas, l. 133-144 | keep | body Common mistakes table | hand-edit and exit-4 rows merged (same fix) |
| 13 | § Boundary & Related Skills, l. 146-159 | keep | unchanged | |

## references/rule-model.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 14 | Intro line ("the one definition ... never restate it") | drop | | the Boundary says it |
| 15 | § Fields | keep | unchanged | |
| 16 | § The twelve types | keep | unchanged | |
| 17 | § Strength | keep | unchanged; the "dead on arrival" reason shortened | |
| 18 | § Scope | keep | unchanged | test reads coding, code-review, planning |
| 19 | § Precedence, the "why it cannot loop" sentence | drop | shortened to the consequence | restated the rule |
| 20 | § Lint | keep | unchanged; now carries the lint codes from `commands.md` | one list, not two |
| 21 | § Lifecycle | keep | unchanged | |
| 22 | § Repository store | keep | unchanged except "Reading" | "`load`, `check FILE` and `search` read both stores" repeats `commands.md`'s read table |
| 23 | § Note format | keep | unchanged | |

## references/commands.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 24 | Intro: how to run, how the vault is found | drop | | repeats the body's Running the script |
| 25 | § Stores | keep | shortened (defaults stated once; the `lint` row shows the values) | |
| 26 | § Exit codes | keep | unchanged | |
| 27 | § Reading | keep | `check --golden` row points to the rule model for the `golden:` format | |
| 28 | Lint codes line | keep | moved into the rule model's Lint | |
| 29 | § Recording use | keep | unchanged | |
| 30 | § Writing, intro (lint before write) | drop | one line kept: a refused write leaves the file unchanged | repeats the body's Writing rules and the rule model |
| 31 | § Writing, "after checking that no other note has the name" (update, approve) | drop | | script internals the agent cannot act on |
| 32 | § Writing, id allocation with exclusive create and retry | drop | | script internals; `tests/test_rulebook.py` covers it |
| 33 | § Monitoring, Langfuse variable names | owner | `rule-steward` (`references/langfuse.md`) | |
| 34 | § Monitoring, the rest | keep | unchanged | |
| 35 | § Permissions (per machine) | keep | heading kept (cited by `vault-setup`); "matches the full unquoted path" dropped in the second reading (the body's Running the script says it); dates of recording dropped, "not tested live" kept | |

Second reader: general-purpose subagent (fresh), 2026-11-16. Verdict: nothing lost. Other fixes: trimmed
the repeated "full, unquoted path" sentence from `commands.md` so develop's later `stats` line (`echo
rules.py add` counts) merges cleanly and keeps the total at 24,573 after the merge; develop changed no
line of `rule-model.md`, and `commands.md` merges without conflict.
