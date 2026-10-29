# rules.py commands

Run `python3 <rulebook skill folder>/scripts/rules.py <command> ...` (`python` on Windows). Every
command that touches the vault finds it through `MEANINGFY_VAULT`, or the current directory when it
holds `08 How to/`. Commands that use dates take `--today YYYY-MM-DD` to fix the clock.

## Stores

In a git repository (not `$HOME`, not the vault), `rules.py` also sees that repository's `docs/rules/`
(`P-` ids; see the rule model, Repository store). Add `--store vault|repo` to `add` (default `vault`)
and `--store all|vault|repo` to `lint` (default `all`). `update`, `confirm` and `retire` take the store
from the id prefix. `approve P-…` and `add --candidate --store repo` are refused: the repository has no
candidates.

## Exit codes

| Code | Meaning |
|---|---|
| 0 | ok, including a write that raised only warnings |
| 1 | `check` found a violation, or `lint` found an error |
| 2 | usage error (a missing or malformed argument) |
| 3 | environment: the vault, or Langfuse for `stats`, is not found or not reachable |
| 4 | a write was refused: it would add a new lint error, it duplicates an active rule, or its target is missing |

## Reading

| Command | Does | Prints |
|---|---|---|
| `load --activity A [--context k=v ...]` | the rules in force for the activity and context | the playbook procedure (`PLAYBOOK <name>` then its body), one line per winning rule (`R-0042 [default] spelling=british: <do> (because: ...)`), the rules without a slot, a `CHECK` line naming the rules with a check pattern, `CONFLICT ...: ask the owner` lines, `SKIPPED` for unreadable notes, then `-- end --` |
| `check --activity A [--context k=v ...] FILE` | runs the check patterns of the rules in force on FILE | `VIOLATION R-NNNN line N: <line>` per hit (exit 1), or `OK`, then `-- end --` |
| `check --golden [--activity A]` | runs each playbook's golden examples through `check`, in the playbook's activity plus the tags written after `\|` in the `golden:` item | `GOLDEN <path>: ok`, `FAIL` (with its violations) or `missing`; exit 1 on any failure |
| `where` | the stores this session sees, and the default store for a new rule | `vault: <path>` or `none (<why>)`, `repository: <root> (docs/rules/ present \| not yet created)` or `none (<why>)`, `default store: repository \| vault`, `-- end --`; always exit 0 |
| `lint [--store all\|vault\|repo]` | the whole rule set: errors per store, warnings over both | `ERROR <code>: ...` and `WARNING <code>: ...` lines and a count; exit 1 on any error |
| `search WORD ...` | rules and candidates whose id, `when`, `do`, slot, value, reason or source hold every word | `R-NNNN [status] [strength] <do> (when: ...)` |

What `load`, `check FILE` and `search` read, by the stores present:

| Vault | Repository store | Prints | Exit |
|---|---|---|---|
| found | none, or no `docs/rules/` yet | the vault's output as before | 0 |
| found | present | both stores, with a `P-` line wherever a repository rule wins | 0 |
| not found | present | the repository rules, then `NOTE personal rules not loaded: vault not found (set MEANINGFY_VAULT)` | 0 |
| not found | none | the vault-not-found message | 3 |

Lint codes: errors `parse`, `missing`, `invalid`, `regex`, `duplicate-id`, `dangling`,
`narrow-exception`, `cycle`; warnings `conflict`, `dead`, `redundant`, `duplicate`,
`weak-exception`, `vocabulary`, `oversized`.

## Recording use (write nothing)

| Command | Records |
|---|---|
| `cite R-NNNN ...` | the rules that shaped an output |
| `override R-NNNN --reason "..."` | a correction by the owner against a rule in force |

Both only print a line. They exist so that the call shows up in the session trace, where `stats`
counts it. A repeated call is a second real event.

## Writing

Every write is checked against the lint first: a write that adds a new error is refused (exit 4) and
the file is left unchanged; new warnings are written and printed.

| Command | Does |
|---|---|
| `add --type T --strength S --scope tag [--scope tag ...] --when ... --do ... --because ... --source ... [--slot --value --instead-of --exception-of --supersedes --check-absent --check-present]` | writes `08 How to/Rules/R-NNNN <title>.md` with the next free id, `status: active`, `private: true` and today's `added`, `approved` and `last_confirmed`. With `--supersedes R-old`, also retires R-old. Refused when `when` and `do` match an active rule: run `confirm` instead |
| `add --store repo ...` | the same in `docs/rules/P-NNNN <title>.md` with `private: false`; creates the folder on the first write and adds the pointer to `AGENTS.md` (exit 3 outside a repository) |
| `add --candidate ...` | the same, written to `00 Inbox/proposed/` with `status: idea` and no approval dates |
| `update R-NNNN --field value ...` | changes the given fields and keeps the id; `--scope` replaces the whole list. A new `do` renames the file to match, after checking that no other note in the vault has the new name |
| `confirm R-NNNN` | sets `last_confirmed` to today; nothing else changes |
| `retire R-NNNN --reason "..."` | sets `status: dropped`, `retired` and `retired_reason`; never deletes. A second call changes nothing |
| `approve R-NNNN` | moves a candidate from `00 Inbox/proposed/` into `08 How to/Rules/`, `status: active`, after checking that no other note in the vault has its name. On a candidate already approved it prints `already approved` and exits 0 |

`add` and `update` take `--dry-run`: nothing is written, and the warnings the write would add (or
the errors that would refuse it) are printed. The rule approval card uses it.

Ids are allocated with an exclusive file create, followed by a check that no other file holds the
same id under another title; on a collision the highest id is read again once and
the write retried.

## Monitoring

`stats [--since 30d] [--from-file FILE]` reads the session traces of the window from Langfuse
(`LANGFUSE_BASE_URL`, `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`) and prints, per rule, the times it
was loaded, cited, overridden and violated, then the usage flags. `--from-file` reads a saved
response of the observations API instead; an unreadable file exits 3. With no `rules.py` event in
the window it warns and raises no usage flag; the stale flag still applies. A missing setting or an unreachable server exits 3 and
names the problem. How the counts are derived is in the `rule-steward` skill.

## Permissions (per machine)

The script's path holds the owner's home folder, so its allow rule never goes into the vault, which
is shared across machines. Add it to the user settings of each machine. Approve the script when asked;
never refuse it, because it reads and writes only rule notes.

### Claude Code

In `~/.claude/settings.json`, under `permissions.allow`; it covers the vault and every code repository:

```json
"Bash(python3 <home>/.claude/plugins/cache/meaningfy-skillery/meaningfy-core/*/skills/rulebook/scripts/rules.py *)"
```

- `<home>` is the home folder written out (`/home/<user>`, `/Users/<user>`). Claude Code matches the
  command text as written, so the rule matches only when the agent runs the script by its full path,
  unquoted, as the rulebook skill says. The `*` in the middle stands for the installed version.
- On Windows, write `python` and the Windows path.
- It is the narrowest pattern the syntax accepts: a `*` matches any text, so `Bash(python3:*)` or
  `Bash(python3 *rules.py *)` would allow any other Python program.
- Recorded 2026-10-29 from the Claude Code permission documentation; **not yet tested live**. The
  first time the owner runs `load`, confirm it runs without a prompt. If Claude Code warns at startup
  about the wildcard, drop the rule and approve the script when asked.

### opencode

In the user-level `~/.config/opencode/opencode.json`:

```json
{ "permission": { "bash": { "python3 <home>/.config/opencode/skills/rulebook/scripts/rules.py *": "allow" } } }
```

- `<home>` is the home folder written out; on Windows, `python` and the Windows path.
- For a project install (`skillery-opencode install --project`), the path is
  `<repo>/.opencode/skills/rulebook/scripts/rules.py`; add that rule to the repository's own settings.
- opencode's `*` matches any text, so a pinned path is the narrowest rule: `python3 *rules.py *` would
  allow any Python program whose arguments mention `rules.py`. Within one map the last matching rule
  wins; how opencode merges the user file with the vault's `"*": "ask"` is not verified, so if the
  script still prompts in the vault, approve it.
- Recorded 2026-10-29 from the opencode permission documentation, **not tested live**.
