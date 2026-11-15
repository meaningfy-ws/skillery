# Reading: a-philosophy-of-software-design
Fork `meaningfy-ws/agent-rules-books` at `893a88a6fce3a80c565bf39ac65021b43a8b2990`, read in full on 2026-11-15 by reader A.

| File | Bytes | What it adds |
|---|---|---|
| `SKILL.md` | 723 | Frontmatter and a short entry pointing to the mini set, with the full text for harder trade-offs. |
| `a-philosophy-of-software-design.md` | 13,561 | The full rule set: complexity symptoms, deep against shallow modules, information hiding, caller-centred interfaces, strategic programming, pulling complexity down, defining errors away, comment rules, function size judged by cognitive load, temporal decomposition, when to combine or split code, designing it twice, naming, and forbidden patterns. |
| `a-philosophy-of-software-design.mini.md` | 5,774 | The working version: thirteen decision rules, ten triggers and a five-question final check. |
| `a-philosophy-of-software-design.nano.md` | 2,258 | A compact reminder: lower cognitive load, deep modules, no layer or helper that hides nothing. |

Total read: 22,316 bytes.

## Goals it serves
Reducing the complexity a reader must hold: designing a module's interface, judging whether an
abstraction earns its place, hiding a decision that is likely to change, choosing where an error
case should be absorbed, and writing comments that state contracts rather than narrate code. It
fits API and module design and reviews of shallow abstractions. Do not use it to decide the layer
structure of a Python service (that is `cosmic-python`), or to remove a layer or adapter the house
contract requires on the ground that it is thin.

## Conflicts with Meaningfy rules
| # | Their advice (file, heading, line) | The Meaningfy rule it meets (owner skill) | Named in DEC-7, DEC-19 or DEC-20? |
|---|---|---|---|
| 1 | `a-philosophy-of-software-design.md`, "Function and Variable Rules", lines 191-192 and 198: a long function is a problem only when it raises cognitive load, never by a count of lines; chains of tiny functions are forbidden. | `cosmic-python` `SKILL.md`, "Clean Code Standards", line 121 (under 25 lines is the target) and "Workflow 2", lines 209 and 212 (the review asks whether functions stay under 25 lines and splits nesting of three levels or more). An agent following the book would keep a long function and argue against the review check. | not named |
| 2 | `a-philosophy-of-software-design.md`, "Module Depth Rules" > "Avoid Shallow Modules", lines 68-77 (pass-through service classes are forbidden), with `.mini.md`, "Decision rules", line 15, and "Trigger rules", line 30: a layer or service that only forwards calls is to be rejected. | `cosmic-python` `SKILL.md`, the four-layer contract, lines 71-81, and "Dependency Direction", lines 83-92: an entrypoint delegates to a service even when the service does little more than call an adapter; `cosmic-python:AP-LOGIC-IN-EDGES` keeps logic out of entrypoints. The book would merge or delete such a service. | not named |
| 3 | `a-philosophy-of-software-design.md`, "Avoid Shallow Modules", line 76, and `.mini.md`, line 15: thin wrappers around a library that simplify nothing are forbidden. | `cosmic-python` `SKILL.md`, the adapters layer, lines 66-69, and `cosmic-python:AP-IO-IN-MODELS` (catalogue line 44): every external client sits behind an adapter injected by DIP, however thin. The book would inline such an adapter. | not named |

Checked and not counted: "Combine or Separate Code" (lines 231-243) agrees with
`cosmic-python:AP-OVER-FRAGMENTATION`; avoiding configuration knobs (`.mini.md`, line 16) does not
contradict `cosmic-python:PR-CONFIG-DECOUPLED`, which governs how settings are read, not how many
there are; the warning against optimising for compactness (line 32) is conditional on complexity
rising and does not contradict `cosmic-python:PR-REUSE-COMPACT`. Testing through public contracts
(lines 336-341) is emphasis beside the per-layer test rule. The comment rules (lines 170-185) sit
beside `technical-writing`'s docstrings without contradicting them. The full text calls itself a
binding policy (line 17); DEC-7 answers that.

## Trigger overlap
`cosmic-python` (small functions, SOLID, code structure); `architecture` (interface and contract
design at the component level); `meaningfy-code-review` and the `code-reviewer` agent;
`technical-writing` (docstrings and comments). The fork's matrix marks it as overlapping
`clean-code`, which is not adopted, and complementary to the other seven sets read here.

## Fallback sentence (draft)
If `a-philosophy-of-software-design` is not installed, offer `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/agent-rules-books#893a88a6fce3a80c565bf39ac65021b43a8b2990 --skill a-philosophy-of-software-design --agent claude-code --global --yes` (the opencode command is in `assets/install.md`); if the person declines, carry on with `cosmic-python` alone and say once that the module-depth guidance was not used.
