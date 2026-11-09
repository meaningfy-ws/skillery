Title: implementer/code-reviewer: add Serena tools; epic-delivery: builder owns the per-task gates

**Where:** meaningfy-building 3.10.1 — agents `implementer`, `code-reviewer`; skill `epic-delivery`.

**What happened.** Langfuse traces of rdf-persistence epic sessions (2026-10-27 to 2026-11-09)
show the shell, not the model, takes the time: 4.1 h of Bash against 1.5 h of model calls in one
session, 1.6 h against 44 min in another. Besides polling loops (fixed in the repo with a hook),
two causes belong to the method:

1. Each task's gates run twice: the builder runs them, then the lead runs them all again
   (≈ 5 min per task paid twice). `epic-delivery` says "the lead re-runs the project's gates".
2. Builders read whole files and rewrite code with Python heredocs. The `implementer` and
   `code-reviewer` agents have fixed tool lists without MCP tools, so they cannot use Serena
   (`get_symbols_overview`, `find_symbol`, `find_referencing_symbols`, `replace_symbol_body`,
   `insert_after_symbol`) even when the repo has it.

**Proposed.**

(a) Add Serena's read and symbol-edit tools to `implementer` and `code-reviewer` (optional: they
are absent where Serena is not installed).

(b) In `epic-delivery`, step 2 of the stage loop: the builder runs the per-task gates and reports
each with its time and test count; the lead re-runs only the fast quality gate and reads the diff;
the full suite once before the PR catches a wrong report. After a red run, re-run only the failing
tests, then the full run once.

**Evidence.** rdf-persistence `openspec/changes/agent-efficiency/` (proposal DEC-6, DEC-8;
inputs/seed.md).
