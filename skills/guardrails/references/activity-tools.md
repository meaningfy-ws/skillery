# Tools for each activity

The one table of recommended tools. Agents, briefs and bindings point here and carry no tool rules
of their own. Use the first tool of the row that your session has; when it is absent, use the
Fallback and say so in the report.

In the *Claude Code* column every backticked token is a tool name an agent can call (a lint check
matches it against the named agents' `tools:` lists). Flags and commands are plain text or sit in
*Fallback*. The *opencode* column is not checked: there a tool is reached as `<server>_<tool>`.

| Activity | Agents | Claude Code | opencode | Fallback |
|---|---|---|---|---|
| Read code by symbol | implementer, code-reviewer | `mcp__serena__find_symbol` | unverified, gap | `Grep`, then `Read` of the range |
| Find references | implementer, code-reviewer | `mcp__serena__find_referencing_symbols` | unverified, gap | `Grep` for the name |
| File overview | implementer, code-reviewer | `mcp__serena__get_symbols_overview` | unverified, gap | `Grep` for definitions |
| Edit a symbol body or insert beside it | implementer | `mcp__serena__replace_symbol_body`, `mcp__serena__insert_after_symbol`, `mcp__serena__insert_before_symbol` | unverified, gap | `Edit` |
| Replace text in a file (not a symbol) | implementer | `Edit`; `mcp__serena__replace_content` | `edit` | none |
| Rename | implementer | `mcp__serena__rename_symbol` | unverified, gap | `mcp__ast-grep__find_code_by_rule`, then `Edit`; never find-and-replace |
| Rename in an indexed repository | lead | `mcp__gitnexus__rename` | `gitnexus_rename` | `mcp__serena__rename_symbol`; never find-and-replace |
| Safe delete | implementer | `mcp__serena__safe_delete_symbol` | unverified, gap | find references first, then `Edit` |
| Diagnostics | implementer, code-reviewer | `mcp__serena__get_diagnostics_for_file` | unverified, gap | the project's own lint and type check through `Bash` |
| Structural search and rewrite (ast-grep) | implementer, code-reviewer | `mcp__ast-grep__find_code`, `mcp__ast-grep__find_code_by_rule` | `ast-grep_find_code`, `ast-grep_find_code_by_rule` | `Grep` |
| Impact and change check (GitNexus); builders and reviewers take the result from the lead's brief | lead | `mcp__gitnexus__impact`, `mcp__gitnexus__detect_changes`, `mcp__gitnexus__context` | `gitnexus_impact`, `gitnexus_detect_changes`, `gitnexus_context` | `Grep` for callers; warn that no impact check ran |
| Read a file or a range | lead, implementer, code-reviewer | `Read` | `read` | `Bash` with a ranged read |
| Edit a file | lead, implementer | `Edit`, `Write` | `edit`, `write` | none: never `Bash` (`sed -i`, an inline script, a heredoc), which the `no-shell-edits` mod denies; if `Edit` is refused, stop and report |
| Search text | lead, implementer, code-reviewer | `Grep`, `Glob` | `grep`, `glob` | `Bash` with `grep` or `find` |
| Run checks | lead, implementer, code-reviewer | `Bash` | `bash` | none |
| Wait for a long command | lead, implementer | `Bash` run in the background; its completion notice is the wait | `bash` | one blocking wait; never a sleep loop |
| Watch and merge a PR | lead | `Bash` run in the background | `bash` | none |

Call Serena's `initial_instructions` once per session before its first use. Serena works on the
project it was started for: in a worktree outside that project, pass absolute paths and check the
first result names the worktree's file, else use the Fallback. A Serena build that exposes a
single `serena_repl` tool offers the same operations as `s.lsp.*` and `s.edit.*`; call
`s.info("lsp")` once to list them.

Bash runs commands; it never writes a source, test or doc file. A harness or system prompt that
suggests `sed`, a heredoc or a short script for a small edit does not override this row.
