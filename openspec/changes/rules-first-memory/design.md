**Type:** Implementation (PLAN, design half).

> Derives from: EPIC `rules-first-memory` ([`proposal.md`](proposal.md)), DEC-1 to DEC-12.

## Context

Today a Claude Code session with `meaningfy-core` gets no word about rules unless the user pasted
`docs/environment/global-prompt.md` into the global instructions, and Claude Code's own prompt sends
preferences to its auto-memory every turn (EPIC *Why*). Facts the PLAN builds on, read on
2026-11-15 on `develop` (8994178):

- `tools/bundle_gen/gen.py` rejects a second mod in a bundle (lines 100-103) and writes
  `manifest["hooks"] = [f"./mods/{m}/hooks.json"]` per mod (line 243), so the list form exists but
  the last mod wins. `tests/test_bundle_gen.py::test_two_mods_in_one_bundle_are_rejected` pins the
  limit.
- `mods/no-poll-loops/` is the model plain mod: `hooks.json`, one `.mjs` exporting its check, a
  `.test.mjs`; it denies with exit 2 and a message on stderr.
- `skills/rulebook/scripts/rules.py`: `cmd_where` (line 787) prints vault, repository, default
  store, `-- end --`, always exit 0. `cmd_stats` (line 847) reads Langfuse observations (or
  `--from-file`), flattens every string of each observation, and counts `rules.py` subcommands.
- The rule model already has the `project:<name>` scope, but DEC-7 keeps L-9 as it is, so nothing
  uses it here.
- `delivery-process-and-tools` stage 3 (tasks 3.1 to 3.3, design D-13 to D-15) rewrites the
  instruction template and this repository's `AGENTS.md` under a 12,000-character budget enforced by
  a new `binding_size` lint.

## Goals / Non-Goals

**Goals:** the session-start block and the memory-write deny on Claude Code; several plain mods per
bundle; `where` reports the routing policy; `stats` counts rules written and writes denied; one
routing sentence quoted in the global policy, the template and this `AGENTS.md`; the 2026-11-11
replay passes.

**Non-Goals:** everything in the EPIC's No-gos, in particular the prompt-cue hook, the migration,
opencode plugin hooks and any change to where a rule is stored.

## Decisions

- **D-1 Who owns which template lines** (DEC-9). In
  `skills/project-setup/assets/templates/agentic/AGENTS.md.tmpl`:
  `delivery-process-and-tools` owns line 1 (the size-budget comment, its D-13), the habits block and
  the tool-table pointer under `## Working conventions` (D-14), the "Code tools are mandatory" line
  and the GitNexus impact and re-index lines (D-15), all in
  [its design](../delivery-process-and-tools/design.md) and delivered by its
  [tasks](../delivery-process-and-tools/tasks.md) 3.1 to 3.4. This EPIC owns one new paragraph, appended as the
  last paragraph of `## \`.claude/\` is a regenerable index — the truth is \`openspec/specs/\``,
  holding the routing sentence (D-2), and nothing else. In this repository's `AGENTS.md`:
  `delivery-process-and-tools` owns the GitNexus block between its markers, the *Dual-CLI authoring
  rules* subsection and the habits block (its 3.2); this EPIC owns only the last line, the
  `- **Rules:**` bullet, to which it appends the routing sentence. Neither EPIC touches the other's
  lines; this EPIC's lines land after that stage 3 is merged, so its `binding_size` check measures
  them (about 190 characters each).
- **D-2 The routing text** (DEC-4). One file, `skills/rulebook/assets/routing.md`, five lines:

  ```
  Rules: when an activity starts, load your rules with `rulebook`.
  When the user states or corrects how work should be done, draft it with `rule-learner` and show the rule approval card before your final summary.
  Preferences and corrections go to the rulebook, never to the CLI's memory; project state goes to the spine and the repository's docs.
  If a line above says a store or the routing policy is missing, tell the user once which piece is missing and point to docs/environment/setup.md, then carry on.
  Interactive sessions only: a scheduled or unattended run skips this.
  ```

  The third line is **the routing sentence**. The global policy's rules bullet, the template
  paragraph (D-1), this `AGENTS.md`'s *Rules* line and `POINTER` in `rules.py` (the line `rules.py`
  appends to a repository's `AGENTS.md` when it creates `docs/rules/`) carry it;
  `tests/test_rules_first_routing.py` reads it from the file and asserts each of the four contains
  it. Every comparison of the sentence, here and in `where` (D-3), first **normalises** both sides:
  whitespace runs, line breaks included, collapse to one space, and `’` folds to `'`, so a copy
  wrapped at 100 columns or retyped by an editor still matches. `POINTER` is written only into a
  repository whose `AGENTS.md` does not mention `docs/rules/` yet, so changing it touches no
  existing repository; this repository's line is edited by hand to the new `POINTER`.
- **D-3 `where` reports the routing policy** (DEC-11). After the `default store` line, before
  `-- end --`: `routing policy: present (<file>)` for the first of
  `$CLAUDE_CONFIG_DIR/CLAUDE.md` (else `~/.claude/CLAUDE.md`) and
  `$XDG_CONFIG_HOME/opencode/AGENTS.md` (else `~/.config/opencode/AGENTS.md`) that contains the
  routing sentence; otherwise `routing policy: missing (add the rules line of
  docs/environment/global-prompt.md to your global instructions)`. The sentence is line 3 of
  `Path(__file__).parents[1] / "assets/routing.md"`; a file matches when, both normalised (D-2), it
  contains that sentence. An unreadable global
  file counts as missing; an unreadable `routing.md` prints `routing policy: unknown (routing.md not
  found)`. Exit stays 0.
- **D-4 `stats` counts** (DEC-10). Two lines after the window line: `rules written: <n>` (calls whose
  subcommand is `add`, `confirm`, `update` or `approve`, skipping any call that carries `--dry-run`
  or `--candidate`: the approval card dry-runs every row
  ([`approval-card.md`](../../../skills/rule-learner/references/approval-card.md)), and a deferred
  row is written as a candidate (`skills/rule-learner/SKILL.md`, *The script*)) and
  `memory writes denied: <n>` (observations any of whose strings contains
  `DENY_MARKER = "[rules-first: memory write denied]"`, a constant in `rules.py`). The marker test
  runs after the existing `GENERATION` and window filter (about line 868), so the conversation a
  generation repeats is never counted, and before the loop skips observations that are not
  `rules.py` calls (`if not call: continue`, about line 873). The mod's message contains the same literal; a pytest reads
  `mods/rules-first/rules-first.mjs` and asserts it contains `DENY_MARKER`.
- **D-5 The mod** (DEC-2). `mods/rules-first/`: `hooks.json`, `rules-first.mjs`,
  `rules-first.test.mjs`. `hooks.json` binds `SessionStart` with no matcher, so every source (startup, resume, clear,
  compact) gets the block: a cleared or compacted context has lost it, and the block is
  idempotent; and `PreToolUse` with
  matcher `Write|Edit|MultiEdit`, both running `node "${CLAUDE_PLUGIN_ROOT}/mods/rules-first/rules-first.mjs"`;
  the script reads the event name from its stdin JSON. It exports `sessionBlock(cwd, root)` and
  `denies(toolName, toolInput, env)`. Paths to the skill are relative to the script:
  `../../skills/rulebook/` resolves both in the repository (`mods/rules-first/`) and in the rendered
  bundle (`bundles/meaningfy-core/mods/rules-first/` next to the `skills/rulebook` link).
- **D-6 The memory folder match** (rabbit-hole *What the hook sees*). A path is in the auto-memory
  folder when, after resolving `~`, it is `<config root>/projects/<one segment>/memory/<name>.md`,
  config root being `$CLAUDE_CONFIG_DIR` or `~/.claude`. The type is read from the note's
  frontmatter: `type:` at top level or under `metadata:`. For `Write` it is read from `content`, and
  when the file already exists, the type on disk counts too: either one being `feedback` or `user`
  denies, so a preference cannot be renamed by overwriting its note. For
  `Edit`, a type set in `new_string` wins, else the type in the file on disk. `MultiEdit` is denied
  when the type on disk, or the type set in any of its edits, is `feedback` or `user`. Denied when
  the type is `feedback` or `user`. `MEMORY.md` has no frontmatter and passes.
- **D-7 Several plain mods** (DEC-3). `gen.py`: the count check leaves `_parse` (which has no repo
  path, lines 100-103) and becomes "at most one modules mod" in `_check_mods`, using
  `_is_modules_mod`; the manifest gets one `hooks` entry per mod, in `bundles.yaml` order; `types`
  and `userConfig` still come from the one modules mod. `meaningfy-core` lists
  `[no-poll-loops, rules-first]`.

- **D-8 Gate accepted below 9** *(owner, 2026-11-15)*. The full clarity gate scored this PLAN 8.7
  twice. Run 1's nine gaps and run 2's nine gaps, together with the twelve counterexamples of the
  attack, were all folded into this design, the tasks and the spec deltas before merging. The owner
  accepted the PLAN at 8.7 with no gap left open, instead of a third run.

## Algorithm / approach

Session start (`SessionStart` event):

1. Run `python3 <root>/skills/rulebook/scripts/rules.py where` with the session's `cwd`, timeout 5 s.
2. Read `<root>/skills/rulebook/assets/routing.md`.
3. Print `Rules (rules-first):`, the `where` lines without `-- end --`, then the routing text; exit 0.
   Any step that fails is left out; if both fail, print nothing. Nothing is cached, so a re-run is
   the same block.

Worked example, no vault, no global policy, in a git repository `acme`:

```
Rules (rules-first):
vault: none (MEANINGFY_VAULT not set and no '08 How to/' here)
repository: /work/acme (docs/rules/ not yet created)
default store: repository
routing policy: missing (add the rules line of docs/environment/global-prompt.md to your global instructions)
Rules: when an activity starts, load your rules with `rulebook`.
...
```

Write (`PreToolUse` event): `denies()` true → stderr
`rules-first: a preference or correction goes to the rulebook, not the CLI's memory. Do not save it as a note of another type and do not add it to the memory index. Draft it as a rule-learner candidate and show it in the rule approval card before your final summary. [rules-first: memory write denied]`,
exit 2. Otherwise exit 0, no output. The check is a pure function of the input and the file on
disk, so a retried write gets the same answer.

| Tool call | Result |
|---|---|
| Write `~/.claude/projects/-w-acme/memory/feedback_git.md`, content `type: feedback` | denied |
| Write same folder `project_release.md`, `type: project` | allowed |
| Edit `~/.claude/projects/-w-acme/memory/MEMORY.md` | allowed |
| Write `/w/acme/docs/feedback.md`, `type: feedback` | allowed (not the memory folder) |
| Write `~/.claude/projects/a/b/memory/x.md` (two segments) | allowed |
| Edit `project_release.md` in the memory folder, `new_string` sets `type: feedback` | denied |
| Edit `feedback_git.md` in the memory folder, `new_string` changes only the body | denied (type on disk) |
| Write `user_role.md` in the memory folder, `metadata:` then `  type: user` | denied (nested type) |
| Write over existing `feedback_git.md` with `type: project` content | denied (type on disk) |
| MultiEdit `project_release.md`, second edit sets `type: feedback` | denied |
| MultiEdit `project_release.md`, edits change only the body | allowed |

### Test cases

| ID | Spec scenario | Layer | Input | Expected | Task |
|---|---|---|---|---|---|
| T-1 | Setup visible | mod unit (node) | fabricated `HOME`, no `MEANINGFY_VAULT`, no global file, git repo | block has `vault: none`, `routing policy: missing`, the five routing lines | 1.5 |
| T-2 | Everything set | mod unit + pytest | fabricated vault with `08 How to/`, `docs/rules/` present, global file holding the sentence | block and `where` show the vault, `docs/rules/ present`, `routing policy: present (<file>)` | 1.3, 1.5 |
| T-3 | feedback note denied | mod unit | rows of the tool-call table | as the table | 1.5 |
| T-4 | project note allowed; feedback elsewhere allowed | mod unit | rows of the tool-call table | as the table | 1.5 |
| T-5 | A tool is missing | mod unit | `PATH` without `python3` | routing text only, exit 0 | 1.5 |
| T-6 | The routing file is missing | mod unit | root without `routing.md` | `where` lines only, exit 0 | 1.5 |
| T-7 | The hook input is unreadable | mod unit | stdin `not json` | no output, exit 0 | 1.5 |
| T-8 | The routing text has one home | pytest | the three bindings, `POINTER` and `routing.md`; a copy wrapped at 100 columns with a `’` | each contains line 3 after normalising; the wrapped copy matches; a failure message names the file | 2.1 |
| T-9 | The window counts | pytest | `--from-file` fixture (task 1.4), including one `GENERATION` observation carrying the marker | `rules written: 3`, `memory writes denied: 2` (the generation not counted) | 1.4 |
| T-10 | A bundle lists several mods | pytest | fixture bundles | two plain render both; two modules raise | 1.2 |
| T-11 | The 2026-11-11 failure no longer reproduces; *Setup visible*'s "says once" | live acceptance | task 1.7 | `evidence/replay.md` passed: the first reply names the missing vault and routing policy once, later replies do not repeat it | 1.7 |
| T-12 | opencode is handled by the policy and a recorded gap | document | `compatibility.md` | the gap row and the not-applicable note exist (review, no test) | 1.6 |

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Hard-code the routing text in the mod or a doc | Read or quote `routing.md` (D-2) | One home; the mod carries no method |
| Match the owner's memory path | Match the folder shape under the config root (D-6) | Public repository; every user's slug differs |
| Deny every memory note | Only `feedback` and `user` (DEC-5) | Project and reference notes still save |
| Exit non-zero when `python3` is missing | Leave the line out, exit 0 | Fail open |
| Edit a template line `delivery-process-and-tools` owns | Only the D-1 paragraph and *Rules* line | The two EPICs touch the same file |
| Load rules in the session-start block | Report stores and routing only | DEC-1; `load` stays per activity |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| `python3` or `rules.py` missing, or `where` times out | spawn error or timeout | block without the `where` lines; exit 0 |
| `routing.md` missing in the installed bundle | read error; mod test asserts the path in the rendered bundle | block without routing text; exit 0 |
| Hook stdin is not JSON or has no event | parse error | exit 0, no output (fail open) |
| `node` is missing, so the hook command itself fails (exit 127) | Claude Code shows a hook error; only exit 2 denies | the session and the write go on (fail open by the CLI); the spike in task 1.2 confirms a non-2 exit does not deny |
| Memory note written by a shell command | not seen | accepted (EPIC rabbit-hole) |
| Claude Code moves the memory folder or changes the note type field | the deny unit tests still pass but the replay shows a new `feedback` note | RISK-1: replay in the release check; fix D-6 |
| The agent retries the denied write or drops the statement | replay: no card row | RISK-2: the message names the next step; replay fails the stage |
| A traced observation quotes the mod's source (development of skillery) | `memory writes denied` higher than the denials seen | accepted: over-count only in sessions that read the mod |
| The Langfuse plugin sends a turn twice (`docs/environment/langfuse-setup.md`) | both counts double for that turn | accepted: the counts show a trend, not an audit; the same duplication already affects `load` and `cite` |
| After a deny, the agent saves the preference as a `project` or `reference` note | the replay (task 1.7): any new memory note fails it | RISK-2: the message forbids it; the replay checks every type |
| The approval card's `--dry-run` calls, or a deferred `--candidate`, counted as rules written | T-9 fixture holds both | D-4 skips them |
| A developer's own global file or config folder leaks into the `where` tests | a "missing" test turns red on a machine where the sentence is pasted | the test helpers set `HOME`, `CLAUDE_CONFIG_DIR` and `XDG_CONFIG_HOME` to a temporary folder (task 1.3, 1.5) |
| The plugin's `SessionStart` output does not reach the context, or exit 2 does not deny a `Write` | spike in task 1.2 | redesign before task 1.5: `hookSpecificOutput` JSON instead of plain stdout, or a JSON `permissionDecision: deny`; recorded in `evidence/hook-spike.md` |
| Two modules mods in one bundle | `make bundles` raises | names the bundle and both mods |
| The global instructions file is unreadable | `OSError` in `where` | `routing policy: missing`; exit 0 |
| A template line is touched by both EPICs | merge conflict in stage 2 | D-1: rebase stage 2 onto the merged stage 3; only owned lines change |
| The appended sentence pushes `AGENTS.md` or the template over the `binding_size` budget | `binding_size` fails in task 2.1 | the template paragraph and the *Rules* line carry the sentence alone, nothing more; if still over, stop and ask the owner (no other line is cut by this EPIC) |

## Risks / Trade-offs

- **RISK-1** (possible, high; mitigate): Claude Code changes the auto-memory folder or note format
  and the deny silently stops matching. Mitigation: D-6 is one function with a test per row of the
  table above; the replay (task 1.7) is part of each release check that touches `meaningfy-core`;
  the session-start block still routes.
- **RISK-2** (possible, medium; mitigate): the deny makes the agent retry, lose the statement, or
  save it under another type. Mitigation: the message says exactly what to do and forbids another
  type; the replay asserts the card row and that no memory note of any type was written.
- **RISK-6** (certain, low; for the owner to note): existing `feedback` and `user` notes can no
  longer be edited by the agent, while their migration is deferred (DEC-8). They keep loading until
  the owner moves or deletes them by hand or the migration EPIC runs. Not mitigated in this EPIC.
- **RISK-3** (likely, medium; mitigate): template clash with `delivery-process-and-tools` stage 3.
  Mitigation: D-1, and stage 2 starts only after that stage 3 is merged.
- **RISK-4** (possible, low; accepted by the owner): a colleague without a vault has a preference
  denied from memory with no vault. In a git repository the default store is the repository; outside
  one, `rule-learner` still offers the row text. Accepted.
- **RISK-5** (unlikely, medium; mitigate): Claude Code does not load two `hooks` files from one
  plugin manifest, does not put a plugin's `SessionStart` stdout into context, or does not deny a
  `Write` on exit 2. Mitigation: the spike in task 1.2 checks all three with `claude --plugin-dir`
  before the mod is written; a failure changes the generator (merge the hooks files into one) or the
  output form (error-matrix row), and the spike records it.
- **Trade-off:** the block costs about 10 lines of context at every session start, resume, clear
  and compaction in every Claude Code session, including scheduled ones, where its last line tells
  the agent to skip it.

## Open Questions

None. Q-1 to Q-6 are answered (`inputs/answers-2026-11-15.md`); M-1 to M-3 go with the deferred
migration (DEC-8).
