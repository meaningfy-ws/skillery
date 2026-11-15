# Reading: clean-architecture
Fork `meaningfy-ws/agent-rules-books` at `893a88a6fce3a80c565bf39ac65021b43a8b2990`, read in full on 2026-11-15 by reader A.

| File | Bytes | What it adds |
|---|---|---|
| `SKILL.md` | 664 | Frontmatter and a short entry pointing to the mini set, with the full text for harder trade-offs. |
| `clean-architecture.md` | 17,782 | The full rule set: the dependency rule, frameworks, database and web as details, responsibilities of the domain, application, interface-adapter and infrastructure layers, ports owned by inner layers, composition root, boundary economics, component principles, naming, testing, forbidden patterns, and default feature shapes. |
| `clean-architecture.mini.md` | 5,486 | The working version: fourteen decision rules, nine triggers and an eight-question final check. |
| `clean-architecture.nano.md` | 2,254 | A compact reminder: details are plugins, dependencies point inward, adapters stay humble. |

Total read: 26,186 bytes.

## Goals it serves
Keeping business rules independent of frameworks, databases and delivery: deciding which way a
dependency should point, where a port belongs, what a controller may decide, how to wire concrete
classes at the edge, and how to test policy without real infrastructure. It fits boundary reviews
and refactoring toward inward dependencies. Do not use it to name or lay out folders in a Meaningfy
Python service, which follows `cosmic-python`'s four layers and their names; do not load it as an
equal guide beside `patterns-of-enterprise-application-architecture`, which the fork's matrix marks
as overlapping (`docs/COMPATIBILITY.md`, matrix row "CleanA", and
`docs/compatibility/clean-architecture/patterns-of-enterprise-application-architecture.md`, line 14).

## Conflicts with Meaningfy rules
| # | Their advice (file, heading, line) | The Meaningfy rule it meets (owner skill) | Named in DEC-7, DEC-19 or DEC-20? |
|---|---|---|---|
| 1 | `clean-architecture.md`, "Preferred Default Shapes", lines 466-478: a feature is laid out as `domain`, `application`, `adapters`, `infrastructure`. | `cosmic-python` `SKILL.md`, "Canonical vocabulary", lines 409-412: the folders are `models/`, `adapters/`, `services/`, `entrypoints/`, and book names are synonyms mapped onto ours, not folder names. An agent following the book would create the wrong folders. | not named |
| 2 | `clean-architecture.mini.md`, "Decision rules", line 18, and `clean-architecture.md`, "Code Generation Rules" > "5. Prefer Stable Dependencies", lines 200-202, and "Forbidden Patterns" > "Direction Violations", lines 377-380: the interface a use case needs belongs to the inner layer; an interface defined in an outer layer and used by core policy is forbidden. | `cosmic-python` `references/example-adapters-layer.md`, "Core Principle: Abstract Interface + Multiple Implementations", lines 7-37, and "Example: Repository Adapter", lines 115-146 (the abstract class lives in `adapters/`), with "Dependency Direction" in `SKILL.md`, lines 85-90 (services may import adapters). The book would move every port out of `adapters/` into `services/` or `models/`. | not named |
| 3 | `clean-architecture.md`, "5. Prefer Stable Dependencies", line 203 (avoid shared common packages), "Utility Dumping Grounds", lines 382-385, and `.mini.md`, "Trigger rules", line 34 (a generic `core` package is split by use case). | `cosmic-python:PR-COMPONENT-FIRST` (catalogue line 19) and `SKILL.md`, "Scaling up", lines 143-165: a larger project has one `core`/`commons` component that every other component imports. The mini wording limits the advice to a package used as an escape hatch, but line 203 does not, and an agent may dismantle `commons`. | not named |
| 4 | `clean-architecture.mini.md`, "Trigger rules", line 32: validation found in controllers or handlers is moved inward. (The full text, "Controller-Centric Logic", line 364, narrows this to validation that is business policy; the mini file, which the skill loads, does not.) | `cosmic-python:BP-VALIDATE-AT-BOUNDARY` (catalogue line 27) and `SKILL.md`, the entrypoints layer, line 79: input is validated once at the entrypoint or service entry, and the entrypoint handles argument validation. An agent reading the mini rule would move input validation out of the entrypoint. | not named |

Checked and not counted: the dependency rule, humble adapters, use cases as one application action
and core tests without infrastructure all agree with `cosmic-python`. Not merging use cases to remove
duplication (`.mini.md`, line 22) is conditional and does not contradict `PR-SSOT-DRY`. The full text
calls itself a binding policy (line 15) and ends by telling the agent to reject a conflicting change
(line 515); DEC-7 answers that.

## Trigger overlap
`cosmic-python` (its description opens with Clean Architecture guidance, layering and boundary
enforcement); `architecture` (boundaries between containers and components); `project-setup`
(import-linter guardrails); `meaningfy-code-review` (the architecture-conformance lens); the
`system-architect` and `implementer` agents. This is the set with the widest overlap with an
existing Meaningfy skill.

## Fallback sentence (draft)
If `clean-architecture` is not installed, offer `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/agent-rules-books#893a88a6fce3a80c565bf39ac65021b43a8b2990 --skill clean-architecture --agent claude-code --global --yes` (the opencode command is in `assets/install.md`); if the person declines, carry on with `cosmic-python` alone, which already holds the house layering, and say once that the book's guidance was not used.
