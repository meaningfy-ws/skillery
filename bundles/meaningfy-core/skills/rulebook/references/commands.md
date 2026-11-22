# rules.py commands

How the script is run and finds the vault is in the skill body. Commands that use dates take
`--today YYYY-MM-DD` to fix the clock.

## Stores

In a git repository (not `$HOME`, not the vault), `rules.py` also sees that repository's `docs/rules/`
(`P-` ids). `add --store` defaults to `vault`, `lint --store` to `all`; `update`, `confirm` and
`retire` take the store from the id prefix. `approve P-…` and `add --candidate --store repo` are
refused: the repository has no candidates.

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
| `load --activity A [--brief] [--context k=v ...]` | the rules in force for the activity and context; `--brief` omits the playbook | the playbook procedure (`PLAYBOOK <name>` then its body), one line per winning rule (`R-0042 [default] spelling=british: <do> (because: ...)`), the rules without a slot, a `CHECK` line naming the rules with a check pattern, `CONFLICT ...: ask the owner` lines, `SKIPPED` for unreadable notes, then `-- end --` |
| `check --activity A [--context k=v ...] FILE` | runs the check patterns of the rules in force on FILE | `VIOLATION R-NNNN line N: <line>` per hit (exit 1), or `OK`, then `-- end --` |
| `check --golden [--activity A]` | runs each playbook's golden examples through `check` in their context (the `golden:` format is in the rule model) | `GOLDEN <path>: ok`, `FAIL` (with its violations) or `missing`; exit 1 on any failure |
| `where` | the stores this session sees, and the default store for a new rule | `vault: <path>` or `none (<why>)`, `repository: <root> (docs/rules/ present \| not yet created)` or `none (<why>)`, `default store: repository \| vault`, `routing policy: present (<file>) \| missing (<fix>) \| unknown (routing.md not found)` (the sentence of `assets/routing.md` in the global instructions), `-- end --`; always exit 0 |
| `lint [--store all\|vault\|repo]` | the whole rule set: errors per store, warnings over both | `ERROR <code>: ...` and `WARNING <code>: ...` lines and a count; exit 1 on any error |
| `search WORD ...` | rules and candidates whose id, `when`, `do`, slot, value, reason or source hold every word | `R-NNNN [status] [strength] <do> (when: ...)` |

What `load`, `check FILE` and `search` read, by store:

| Vault | Repository store | Prints | Exit |
|---|---|---|---|
| found | none, or no `docs/rules/` yet | the vault's output as before | 0 |
| found | present | both stores, with a `P-` line wherever a repository rule wins | 0 |
| not found | present | the repository rules, then `NOTE personal rules not loaded: vault not found (set MEANINGFY_VAULT)` | 0 |
| not found | none | the vault-not-found message | 3 |

## Recording use (write nothing)

| Command | Records |
|---|---|
| `cite R-NNNN ...` | the rules that shaped an output |
| `override R-NNNN --reason "..."` | a correction by the owner against a rule in force |

Both only print a line, so the call shows up in the session trace, where `stats` counts it. A
repeated call is a second real event.

## Writing

A refused write (exit 4) changes nothing.

| Command | Does |
|---|---|
| `add --type T --strength S --scope tag [--scope tag ...] --when ... --do ... --because ... --source ... [--slot --value --instead-of --exception-of --supersedes --check-absent --check-present]` | writes `08 How to/Rules/R-NNNN <title>.md` with the next free id, `status: active`, `private: true` and today's `added`, `approved` and `last_confirmed`. With `--supersedes R-old`, also retires R-old. Refused when `when` and `do` match an active rule: run `confirm` instead |
| `add --store repo ...` | the same in `docs/rules/P-NNNN <title>.md` with `private: false`; creates the folder on the first write and adds the pointer to `AGENTS.md` (exit 3 outside a repository) |
| `add --candidate ...` | the same, written to `00 Inbox/proposed/` with `status: idea` and no approval dates |
| `update R-NNNN --field value ...` | changes the given fields and keeps the id; `--scope` replaces the whole list. A new `do` renames the file to match |
| `confirm R-NNNN` | sets `last_confirmed` to today; nothing else changes |
| `retire R-NNNN --reason "..."` | sets `status: dropped`, `retired` and `retired_reason`; never deletes. A second call changes nothing |
| `approve R-NNNN` | moves a candidate from `00 Inbox/proposed/` into `08 How to/Rules/`, `status: active`. On a candidate already approved it prints `already approved` and exits 0 |

`add` and `update` take `--dry-run`: nothing is written, and the warnings the write would add (or
the errors that would refuse it) are printed. The rule approval card uses it.

## Monitoring

`stats [--since 30d] [--from-file FILE]` reads the session traces of the window from Langfuse and prints, per rule, the times it
was loaded, cited, overridden and violated, then the usage flags. Under the `window` line it prints
`rules written: <n>` (calls of `add`, `confirm`, `update` or `approve`, not the ones carrying
`--dry-run` or `--candidate`) and `memory writes denied: <n>` (observations carrying the
rules-first mod's deny marker). Both are trends, not an audit: a turn the plugin sends twice counts twice, and any text with `rules.py add` in it counts (an `echo rules.py add` too). `--from-file` reads a saved
response of the observations API instead; an unreadable file exits 3. With no `rules.py` event in
the window it warns and raises no usage flag; the stale flag still applies. A missing setting or an unreachable server exits 3 and
names the problem. The Langfuse settings and how the counts are derived are `rule-steward`'s.

## Permissions (per machine)

The script's path holds the owner's home folder, so its allow rule never goes into the vault, which
is shared across machines. Add it to the user settings of each machine. Approve the script when asked;
never refuse it, because it reads and writes only rule notes.

### Claude Code

In `~/.claude/settings.json`, under `permissions.allow`; it covers the vault and every code repository:

```json
"Bash(python3 <home>/.claude/plugins/cache/meaningfy-skillery/meaningfy-core/*/skills/rulebook/scripts/rules.py *)"
```

- `<home>` is the home folder written out (`/home/<user>`, `/Users/<user>`); the middle `*` is the
  installed version.
- On Windows, use `python` and the Windows path.
- It is the narrowest pattern the syntax accepts: a `*` matches any text, so `Bash(python3:*)` or
  `Bash(python3 *rules.py *)` would allow any other Python program.
- **Not yet tested live.** On the owner's first `load`, confirm it runs without a prompt. If Claude
  Code warns about the wildcard, drop the rule and approve the script.

### opencode

In the user-level `~/.config/opencode/opencode.json`:

```json
{ "permission": { "bash": { "python3 <home>/.config/opencode/skills/rulebook/scripts/rules.py *": "allow" } } }
```

- `<home>` is the home folder written out; on Windows, `python` and its path.
- For a project install (`skillery-opencode install --project`), the path is
  `<repo>/.opencode/skills/rulebook/scripts/rules.py`; add the rule to the repository's settings.
- opencode's `*` matches any text, so a pinned path is the narrowest rule: `python3 *rules.py *` would
  allow any Python program naming `rules.py`. The last matching rule in a map wins; how opencode
  merges the user file with the vault's `"*": "ask"` is not verified, so if the script still prompts
  in the vault, approve it. **Not tested live.**
