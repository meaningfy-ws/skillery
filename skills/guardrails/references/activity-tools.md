# Tools for each activity

The one table of recommended tools. Agents, briefs and bindings point here and carry no tool rules
of their own. Use the first tool of the row that your session has; when it is absent, use the
Fallback and say so in the report.

In the *Claude Code* column every backticked token is a tool name an agent can call (a lint check
matches it against the named agents' `tools:` lists). Flags and commands are plain text or sit in
*Fallback*. The *opencode* column is not checked: there a tool is reached as `<server>_<tool>`.

| Activity | Agents | Claude Code | opencode | Fallback |
|---|---|---|---|---|
| Read code by symbol | implementer, code-reviewer | `mcp__serena__serena_repl` (s.lsp.find_symbol) | unverified, gap | `Grep`, then `Read` of the range |
| Find references | implementer, code-reviewer | `mcp__serena__serena_repl` (s.lsp.find_referencing_symbols) | unverified, gap | `Grep` for the name |
| File overview | implementer, code-reviewer | `mcp__serena__serena_repl` (s.lsp.get_symbols_overview) | unverified, gap | `Grep` for definitions |
| Edit a symbol body or insert beside it | implementer | `mcp__serena__serena_repl` (s.edit.replace_symbol_body, insert_after_symbol, insert_before_symbol) | unverified, gap | `Edit` |
| Rename | implementer | `mcp__serena__serena_repl` (s.lsp.rename_symbol); in an indexed repository `mcp__gitnexus__rename` | unverified, gap; `gitnexus_rename` | `mcp__ast-grep__find_code_by_rule`, then `Edit`; never find-and-replace |
| Safe delete | implementer | `mcp__serena__serena_repl` (s.lsp.safe_delete_symbol) | unverified, gap | find references first, then `Edit` |
| Diagnostics | implementer, code-reviewer | `mcp__serena__serena_repl` (s.lsp.get_diagnostics_for_file) | unverified, gap | the project's own lint and type check through `Bash` |
| Structural search and rewrite (ast-grep) | implementer, code-reviewer | `mcp__ast-grep__find_code`, `mcp__ast-grep__find_code_by_rule` | `ast-grep_find_code`, `ast-grep_find_code_by_rule` | `Grep` |
| Impact and change check (GitNexus) | lead, code-reviewer | `mcp__gitnexus__impact`, `mcp__gitnexus__detect_changes`, `mcp__gitnexus__context` | `gitnexus_impact`, `gitnexus_detect_changes`, `gitnexus_context` | `Grep` for callers; warn that no impact check ran |
| Read a file or a range | lead, implementer, code-reviewer | `Read` | `read` | `Bash` with a ranged read |
| Edit a file | lead, implementer | `Edit`, `Write` | `edit`, `write` | `Bash` for a mechanical change only |
| Search text | lead, implementer, code-reviewer | `Grep`, `Glob` | `grep`, `glob` | `Bash` with `grep` or `find` |
| Run checks | lead, implementer, code-reviewer | `Bash` | `bash` | none |
| Wait for a long command | lead, implementer | `Bash` run in the background; its completion notice is the wait | `bash` | one blocking wait; never a sleep loop |
| Watch and merge a PR | lead | `Bash` run in the background | `bash` | none |

Serena has two tools. Call `initial_instructions` once per session for the manual and the session
id. Then call `serena_repl` with `s.info("lsp")` or `s.info("edit")` once to see that facade's
operations. After that, put several operations in one `serena_repl` call: for example find a
symbol, list its references and read the file overview together.
