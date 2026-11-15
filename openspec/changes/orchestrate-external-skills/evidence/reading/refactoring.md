# Reading: refactoring
Fork `meaningfy-ws/agent-rules-books` at `893a88a6fce3a80c565bf39ac65021b43a8b2990`, read in full on 2026-11-15 by reader A.

| File | Bytes | What it adds |
|---|---|---|
| `SKILL.md` | 616 | Frontmatter and a three-line entry: load the mini set first, open the full text only when the mini set leaves a trade-off open. |
| `refactoring.md` | 17,866 | The full rule set: behaviour-preserving small steps, a smell catalogue, the named moves of the book, function, class, conditional, mutation and error rules, forbidden patterns, a default edit order and stopping rules. |
| `refactoring.mini.md` | 5,167 | The working version the skill loads: about fourteen decision rules, ten triggers and a seven-question final check. |
| `refactoring.nano.md` | 1,986 | A compressed always-on reminder of the same bias in eight rules and five checks. |

Total read: 25,635 bytes.

## Goals it serves
Cleaning up existing code without changing what it does: preparing a change that is awkward to make,
removing the smell that blocks it, keeping structural edits apart from behaviour changes, and knowing
when to stop. It fits a refactoring pass, a review of a cleanup patch, or the refactor step of a TDD
cycle. Do not use it to design a new service or system (that is `cosmic-python` and `architecture`),
for legacy code with no tests (prefer `working-effectively-with-legacy-code`), or as a reason to
remove the layers and ports the house structure requires.

## Conflicts with Meaningfy rules
| # | Their advice (file, heading, line) | The Meaningfy rule it meets (owner skill) | Named in DEC-7, DEC-19 or DEC-20? |
|---|---|---|---|
| 1 | `refactoring.md`, "Forbidden Patterns" > "Abstracting Too Early", lines 343-345, with "Middle Man and Speculative Generality", lines 152-154, and `refactoring.mini.md`, "Decision rules", line 23: no interface until a second real need exists; forwarding layers and interfaces kept for a possible future are to be removed. | `cosmic-python` `SKILL.md`, "SOLID Principles Applied Systematically", line 132 (DIP: depend on an abstraction, inject the concrete class), "On Architecture Decisions", line 308 (a service never imports a concrete implementation), and the four-layer contract, lines 71-81 (an entrypoint delegates to a service). An agent following the book would delete a repository interface that has one implementation, or a thin service between an entrypoint and an adapter, both of which the house structure requires. | not named |
| 2 | `refactoring.mini.md`, "Trigger rules", line 33, and `refactoring.md`, "Duplicated Code", lines 108-111: on the third occurrence of the same edit, centralise it; duplication is a default target. | `cosmic-python` `SKILL.md`, "Clean Code Standards", line 124 (three similar lines do not justify a helper, ten do) and "On Code Structure", line 293 (two or three are fine, five or more warrant extraction). The book extracts at the third copy; the house waits longer. Low stakes, but the thresholds disagree. | not named |

Checked and not counted, because they differ only in emphasis: the warning against `utils`, `helpers`
and `common` modules (`refactoring.md`, "Class and Module Rules", line 276) is limited to a reflex
answer to duplication and agrees with `cosmic-python:AP-GENERIC-MODULE-NAMES`; it does not forbid the
`core`/`commons` component of `PR-COMPONENT-FIRST`. The warning against micro-methods (line 116) sets
no number and does not contradict the 25-line target. The full text calls itself a binding policy
(line 16) and every file is titled "OBEY"; that claim of authority is answered by DEC-7 (a Meaningfy
preference always wins), so it is not a separate row.

## Trigger overlap
`cosmic-python` (its description claims Clean Code and SOLID work and code review against them);
`meaningfy-code-review` and the `code-reviewer` agent (review of a cleanup patch);
`superpowers:test-driven-development` (the refactor step); the `implementer` agent. The fork's own
matrix marks `refactoring` as overlapping `refactoring-guru`, which is not adopted.

## Fallback sentence (draft)
If `refactoring` is not installed, offer `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/agent-rules-books#893a88a6fce3a80c565bf39ac65021b43a8b2990 --skill refactoring --agent claude-code --global --yes` (the opencode command is in `assets/install.md`); if the person declines, carry on with `cosmic-python` alone and say once that the book's refactoring guidance was not used.
