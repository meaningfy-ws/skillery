# Reading: patterns-of-enterprise-application-architecture
Fork `meaningfy-ws/agent-rules-books` at `893a88a6fce3a80c565bf39ac65021b43a8b2990`, read in full on 2026-11-15 by reader A.

| File | Bytes | What it adds |
|---|---|---|
| `SKILL.md` | 912 | Frontmatter and a short entry pointing to the mini set, with the full text for harder pattern choices. |
| `patterns-of-enterprise-application-architecture.md` | 15,501 | The full rule set: a four-layer baseline, choosing Transaction Script, Table Module or Domain Model by force, Service Layer, Remote Facade and DTO, persistence patterns (Repository, Data Mapper, gateways, Active Record), Identity Map, Unit of Work and Lazy Load, an index of object-relational mapping patterns, concurrency and transaction rules, presentation, integration, session state and base patterns, distribution, tests and forbidden patterns. |
| `patterns-of-enterprise-application-architecture.mini.md` | 8,099 | The working version: eighteen decision rules, ten triggers and an eight-question final check. |
| `patterns-of-enterprise-application-architecture.nano.md` | 2,823 | A compact compass: choose the business-logic and persistence pattern by complexity, keep transactions and remote boundaries explicit. |

Total read: 27,335 bytes.

## Goals it serves
Choosing a named enterprise pattern for a concrete pressure: how to persist and map objects, who
owns a transaction, how to handle offline concurrency, how to shape a remote API and its DTOs, and
where session state lives. It fits a specific persistence, transaction or remoting decision. Under
`lean-skills` DEC-5 it is loaded on demand only and never as equal guidance beside
`domain-driven-design`; the fork's matrix agrees and marks the pair as conflicting
(`docs/COMPATIBILITY.md`, row "PoEAA"), and marks it as overlapping `clean-architecture`
(`docs/compatibility/clean-architecture/patterns-of-enterprise-application-architecture.md`, line 14).
Do not use it to choose the overall structure of a Meaningfy service, which `cosmic-python` fixes.

## Conflicts with Meaningfy rules
| # | Their advice (file, heading, line) | The Meaningfy rule it meets (owner skill) | Named in DEC-7, DEC-19 or DEC-20? |
|---|---|---|---|
| 1 | `patterns-of-enterprise-application-architecture.mini.md`, "Decision rules", lines 15-16 and 19: pick Transaction Script, Table Module or Domain Model by the force at hand, and Active Record is acceptable for simple domains. The fork's own pair note (`docs/compatibility/domain-driven-design/patterns-of-enterprise-application-architecture.md`, "Loading Decision", line 14) says equal loading with DDD makes an agent swing between rich modelling and these simpler patterns. | `lean-skills` `proposal.md`, DEC-5: this set is loaded on demand only and never beside `domain-driven-design` as equal guidance; carried into this change as the PoEAA override of D-10. | yes: `lean-skills` DEC-5, the PoEAA override of D-10 (not DEC-7, DEC-19 or DEC-20) |
| 2 | `patterns-of-enterprise-application-architecture.md`, "Architectural Baseline" > "Layering", lines 50 and 56, "Layering Theater", lines 343-344, and `.mini.md`, "Trigger rules", lines 37 and 43: a layer or service that only forwards calls is a review blocker. | `cosmic-python` `SKILL.md`, the four-layer contract, lines 71-81, and "Dependency Direction", lines 83-92: an entrypoint always goes through a service, even a thin one. The book would remove such a service. | not named |
| 3 | `patterns-of-enterprise-application-architecture.md`, "Active Record", lines 160-162, and "Layering", lines 41-49: Active Record (persistence inside the domain object) is allowed for simple domains, and the baseline puts domain logic above the data-source layer, so the domain may depend on it. | `cosmic-python:AP-IO-IN-MODELS` (catalogue line 44) and `SKILL.md`, the models layer, lines 61-63, with "Dependency Direction", lines 85-92: models never do I/O and never depend on adapters, whatever the size of the domain. | not named |
| 4 | `patterns-of-enterprise-application-architecture.mini.md`, "Trigger rules", line 43, and the full text, "Generic Repository Everywhere", lines 346-348: one generic repository for all data access is a forbidden pattern. | `cosmic-python` `references/example-adapters-layer.md`, lines 127-146: the house example is a generic repository over any model. This is a reference example, not a catalogue entry, so the owner may judge it a difference of example rather than of rule. | not named |

Checked and not counted: a Transaction Script in a service (`.mini.md`, line 15; full text, line 311)
does not contradict `cosmic-python`, whose review accepts business logic in `services/` or `models/`
(`SKILL.md`, line 206). DTOs as transport structures and explicit mapping agree with
`cosmic-python:PR-MODELS-OVER-DICTS`. Pattern names such as Gateway, Mapper or Registry are allusions,
which `cosmic-python:BP-DOMAIN-REVEALING-NAMES` allows. The full text calls itself a binding policy
(line 16); DEC-7 answers that.

## Trigger overlap
`cosmic-python` (layering, repositories, unit of work, service layer, dependency injection);
`architecture` (remote boundaries and contracts); `domain-driven-design` (repositories, domain model,
service layer), which is exactly why the on-demand rule exists; `clean-architecture` (layering), an
overlap the fork itself records. Its description would claim most "how should I layer this service"
prompts that `cosmic-python` owns.

## Fallback sentence (draft)
If `patterns-of-enterprise-application-architecture` is not installed, offer `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/agent-rules-books#893a88a6fce3a80c565bf39ac65021b43a8b2990 --skill patterns-of-enterprise-application-architecture --agent claude-code --global --yes` (the opencode command is in `assets/install.md`), and only when the person asks for an enterprise pattern decision; if the person declines, carry on with `cosmic-python` and say once that the pattern catalogue was not used.
