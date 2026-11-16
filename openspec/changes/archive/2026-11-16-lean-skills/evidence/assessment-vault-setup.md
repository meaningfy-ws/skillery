# Assessment: vault-setup
Before: body 4539 bytes, references 20019 bytes. After: body 6549, references 17079.

Under budget before (24558 of 24576) and failing only pointers, so sorted by section. The three
permission settings files, copied into the vault with placeholders filled in, are material and moved
to `assets/permissions/` byte for byte; the references keep the adapt notes, gaps and verify steps.
Line numbers are those of the files before the rewrite.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title, § Overview l. 17-22 | keep | intro sentences | the bias: create vault files, guide the machine |
| 2 | § Overview l. 24-26 (run from the owner folder, stop line) | keep | Workflow step 1 | |
| 3 | § Rules l. 28-36 | keep | Rules, unchanged | |
| 4 | § Procedure steps 1-3, l. 40-56 | keep | Workflow steps 1-3 | asset links unchanged |
| 5 | § Procedure step 4, l. 57-63 | keep | Workflow step 4, one pointer sentence for both permission references | rulebook allow rule named as `rulebook`'s (owner, already so in the reference) |
| 6 | § Procedure step 5, l. 64-70 | keep | Workflow step 5, one pointer sentence per reference | |
| 7 | § Procedure step 6, l. 71-72 | keep | Workflow step 6, pointer sentence; Before you hand over (Quick diagnostic) | CHK-99 |
| 8 | § Boundary & Related Skills | keep | unchanged; Delegates adds the rulebook allow rule → `rulebook` | |
| 9 | (new) Quick Start | keep | worked example of one run | |

## references/

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 10 | `permissions-claude-code.md`, prose l. 1-26, 92-114 | keep | stays | adapt notes, per machine, verify |
| 11 | `permissions-claude-code.md`, settings JSON l. 27-90 | material | `assets/permissions/claude-code-settings.json` | identical content; the reference says copy it |
| 12 | `permissions-opencode.md`, prose | keep | stays | "shapes below" → "settings files below" |
| 13 | `permissions-opencode.md`, `opencode.json` l. 11-35 | material | `assets/permissions/opencode.json` | identical content |
| 14 | `permissions-opencode.md`, `opencode.scheduled.json` l. 52-57 | material | `assets/permissions/opencode.scheduled.json` | identical content |
| 15 | `obsidian.md` | keep | stays | |
| 16 | `sync.md` | keep | stays | |
| 17 | `memory-and-connectors.md` | keep | stays | |
| 18 | `scheduler.md` | keep | stays | command lines cited by `openspec/specs/vault-setup` |
| 19 | `final-check.md` | keep | stays | CHK-99 |

Second reader: general-purpose subagent (fresh), 2026-11-16. Verdict: nothing lost. Other fixes: the
step 4 pointer now says to read only the permissions reference of the CLI in use; the three JSON assets
were checked byte for byte against the removed blocks.
