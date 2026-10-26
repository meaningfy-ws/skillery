# Release-only dist and the folder restructure: owner Q&A (2026-10-26)

**Status:** SECONDARY input, never groomed. `design.md` (D-8 revised, D-13…) supersedes it.

## Seeds

1. The owner's questions, 2026-10-26: "can we do dual clis only on release? for example the cicd can
   generate those commit then tag it but they are not commits that evenr get into develop? is this a
   bad practice?"; "I still don;t know what to test and how to do it, and whether now is a good moment
   to do it? can it still be postponed?"; "there is also a new task to rethink around the flder
   structure".
2. A folder review the owner pasted (16 top-level folders): keep `skills/`, `agents/`, `use-cases/`,
   `openspec/`, `docs/`, `tools/`, `tests/`, `.github/`, `.claude-plugin/`; remove `bundles/` (7.3),
   `spec/`, `spine/`, `prompts/`, `hooks/`, `evals/` and the `.claude/` leftovers by moving their
   content; move `tools/linkml_neo4j/` into its skill; split `docs/` into catalogue docs and company
   practice.

## Answers

| # | Question | Owner's answer |
|---|---|---|
| R1 | Publish `dist` only on release tags? | Release-only. |
| R2 | The `#dist` install test? | Postpone to the release. |
| R3 | How to do the restructure? | Fold into rebundle (a task group 9). |
| R4 | Move the company-practice docs now? | Move now to `docs/practice/`. |

The agent's recommendations the owner kept: `dist` stays a branch (a tag never moves for
`/plugin marketplace update`) with a `<tag>-dist` tag per release; skill links into `spine/` are
replaced by facts inside the skills, not by a moved folder; `evals/` goes to `tests/evals/`, not into
a change folder.
