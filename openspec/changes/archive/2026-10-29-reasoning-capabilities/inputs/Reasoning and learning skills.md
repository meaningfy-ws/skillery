---
kind: exploration
date: 2026-10-28
about: "[[Skills and Agents]]"
private: true
---
# Reasoning and learning skills: full summary of the exploration

Written on 2026-10-28 from one long working session. It records what Eugen wants, what was explored, what was decided, how it would be packaged in the skillery, and what is still unexplored. Anything marked **unverified** comes from memory or from a source I only skimmed. The decisions are proposals until Eugen confirms them.

## 0. Handover brief (read this first in a new chat)

**What this file is.** The single record of one long working session on reasoners, Elenchus-style dialogue, rule learning from Eugen's interactions, monitoring, and packaging in the skillery. Nothing has been built yet. Every skill, folder and tool named here is a proposal until Eugen confirms it in section 9.

**How to work with Eugen** (his stated preferences): opinionated recommendations rather than menus of options; concise prose with light formatting; British English and no em dash for Meaningfy-voice text.

**State of play.**
- Research is done for the engines, Elenchus and pyNMMS, SysML v2, the learning loop, rule consistency, Langfuse and the reference list (section 10 marks what was opened and what was not).
- Decided in principle: five skills plus a shared `rulekit` tool, a `09 Rules/` vault folder, three monitoring signals in separate homes, clingo for rule-set work and SWI-Prolog, SPARQL or DuckDB for data-heavy work.
- Not decided: the eight items in section 9, and the unexplored items in section 8.

**Constraints the next chat must respect.**
- Vault conventions: every note has a `kind`; new kinds and method changes go through a `skill-change` note in `00 Inbox/proposed/`; an agent never edits a skill; `private: true` by default; only a person sets `memory: common`; no absolute local paths; people, organisations and technologies get no files of their own.
- Agents propose and Eugen approves. Nothing learned about him is stored without his approval.
- Odoo stays the system of record for people and organisations.

**Suggested first moves, in order.**
1. Walk through section 9 and settle the eight decisions.
2. Draft `learned-rules` and `rulekit` (rule schema, ledger shape, lint script), then start trial 1 on offers.
3. Run the engine benchmark (item 20) and the Langfuse spike (5.7) as separate small tasks.

**Starter prompts.**
- "Read this note, then propose the rule schema and the `rulekit` command set for `learned-rules`."
- "Read this note, then draft the `SKILL.md` for `rule-reasoning` with the grounding-size guard."
- "Read this note, then write the OpenSpec proposal for the sixth change."

## 1. Intentions

Nine intentions came out of the session. They are listed in the order they appeared.

| # | Intention | Short form |
|---|---|---|
| I1 | Give Claude exact, auditable reasoning (logic and rule engines) in addition to Python, for rule-heavy work | Add reasoning tools |
| I2 | Place that capability in the modelling agent, and decide whether development skills need it | Where it belongs |
| I3 | Use expert dialogue to surface contradictions and record rationale (the Elenchus idea, pyNMMS reasoner) | Elicitation |
| I4 | Have each agent, project and recurring activity learn how Eugen works: preferences, procedures, exceptions, writing voice, way of thinking, proposed company conventions, and the entities he deals with | Learning agent |
| I5 | Check that the learned rules are consistent, and decide whether to formalise them | Rule consistency |
| I6 | Judge adjacent ideas: SymPy, SysML, other reasoners, reinforcement learning | Adjacent options |
| I7 | Package everything in the skillery (meaningfy-ws/skillery) for now | Packaging |
| I8 | Govern reasoning work properly: how a reasoning project is structured and maintained when it is more than a one-time check, and how to derive rules from natural language | Governance and method |
| I9 | Monitor the learned rules (what changed, what was triggered and how often, when and why decided), choosing between agents and skills, an MCP over a rules folder, and Langfuse; keep it as simple as possible but robust | Monitoring |

## 2. How the exploration ran

1. **Logic engines as tools.** Claude already writes Python on the fly. Adding Prolog or Datalog was assessed. First answer: add SWI-Prolog with tabling and skip a separate Datalog engine.
2. **Size of the change.** It would not change daily work, because most work is drafting and judgement. It matters for a narrow slice: rule checks that need an exact answer and a derivation. Advice: run a cheap experiment, do not build it out.
3. **Where it belongs.** A standalone skill next to the modelling skills, cited by them, kept out of default loadouts. Development gets at most a pointer.
4. **Packaging first pass.** One self-contained skill with scripts, references and a test-first template.
5. **SymPy and other tools.** SymPy needs no connection. Better candidates are an OWL reasoner with SHACL, Z3, and DuckDB.
6. **Elenchus.** Photos of Bradley Allen's ISWC 2026 workshop talk were analysed, together with pyNMMS.
7. **Alternatives to pyNMMS.** Argumentation tools, clingo, eclingo and others were surveyed.
8. **Which reasoner for which task.** A task-to-engine table was produced, then extended to modelling, mapping, integration, ontology engineering, requirements and specification management.
9. **SysML v2.** Where it helps, where it does not, which open-source tools exist.
10. **Learning agent.** Reinforcement learning was rejected in favour of explicit, reviewable rules from corrections. The RoomKG meta-policies paper was assessed. Rule types, a schema, scope, precedence, lifecycle and monitoring were defined.
11. **Consistency of rules.** Failure modes and a ladder of checking frameworks.
12. **Recap and decisions.** Consolidated in section 3 and section 5.
13. **Packaging redesign and monitoring.** Added governance and method skills, a shared tool, a vault rules folder, a three-signal monitoring design, a decision on MCP versus Langfuse, and a Langfuse infrastructure spike (sections 5.1 to 5.7).
14. **References and handover.** Verified links were gathered for the tools and papers (section 10), the Syside licence question was settled, and a handover brief was added at the top (section 0).

## 3. Decisions (proposed)

| Area | Decision |
|---|---|
| Exact reasoning | One skill, `rule-reasoning`. **clingo (ASP) is the default engine for rule-set work** (small, finite problems with exceptions, priorities, minimal fixes and consistency checks). **SWI-Prolog is the engine for data-heavy work** (closure and competency-question tests over large fact bases), alongside SPARQL or DuckDB where the data already sits in a store. See 4.1a for the speed and memory reasoning. SymPy gets a paragraph inside the skill, not a folder. |
| Elicitation | A separate skill, `dialectical-elicitation`, built on pyNMMS, marked experimental. Core rule: Claude only asks and challenges and never proposes content. |
| Learning | A skill, `learned-rules`: log corrections, distil weekly into candidate rules, Eugen approves, one playbook per activity, one rule schema with precedence and a retire-when-stale lifecycle. |
| Governance and method | Two more reasoning skills: `reasoning-project` (structure, tests, change log and maintenance for anything that outlives one check) and `rules-from-text` (method for turning natural language into checkable rules). See 5.1 and 5.2. |
| Shared tool | `rulekit`: one small tool (library and command line) for lint, conflict check, event log and usage statistics. An MCP front only if Chat-mode use justifies it, and no logic lives in the MCP. |
| Vault side | A `09 Rules/` folder with one note per rule (a new `rule` kind, proposed through a `skill-change` note), private by default. Promotion path: personal, company-proposed, validated, then skillery. See 5.4. |
| Monitoring | Three signals in three homes: loaded (verifiable, from Langfuse tool spans), applied (self-reported footer parsed by a stop hook into `log.jsonl`), overridden (human, from the correction log). Langfuse observes behaviour and never owns the rules. See 5.5 and 5.6. |
| Langfuse | Run an infrastructure spike: self-hosted in EU infrastructure, one real session traced, privacy and retention rule agreed. See 5.7. |
| Rule consistency | A decision-table lint script first. Move to clingo only if exceptions make the script strain. |
| Entities | Odoo stays the system of record. The vault holds notes keyed by Odoo ID. No knowledge graph mirror. |
| Conformance checks | Use the existing SHACL and OWL toolchain. No new skill unless a gap appears. |
| Deferred or dropped | Reinforcement learning, SysML (only if a client mandates it), eclingo, argumentation tools, Z3 and DuckDB (only when a real problem appears), Soufflé. |

**A revision worth noting.** The first advice was SWI-Prolog before anything else. It changed to clingo as the default for rule-set work, because clingo also handles defaults, exceptions and priorities, which is what the rule-set consistency work needs. Prolog's negation as failure is the weaker fit for that. A later comparison of the two engines (section 4.1a) adds a limit: clingo is the wrong choice when the problem is a large volume of data, because its grounding step can exhaust memory. So the final split is by problem size and shape, not one default for everything.

## 4. What was found, by topic

### 4.1 Logic engines and what they are for

| Need | Engine | Notes |
|---|---|---|
| Transitive closure, competency questions against facts | SWI-Prolog (tabling), or plain SPARQL if data is in a store | Prolog also has a semantic-web library and a Python bridge (janus). |
| Defaults, exceptions, priorities, minimal-fix problems | clingo (ASP) | Returns concrete counterexamples. |
| Numeric constraints, configuration validity | Z3 (SMT) | Only when numbers are involved. |
| Tabular analytics at scale, recursive queries | DuckDB | For data-quality profiling. |
| Does data conform to the model | SHACL and an OWL reasoner | Not a logic-programming task. |
| Known versus merely possible, audit evidence | eclingo | Rare. |
| Conflicting claims with priorities | Argumentation (ASPIC+, ABA) | Rare. |
| Symbolic algebra, exact arithmetic | SymPy or Python Fraction/Decimal | Rarely needed in this business. |

**The weak link moves, it does not vanish.** The engine is exact, but Claude's translation of intent into rules can still be wrong. Mitigations: tests with known facts and expected conclusions, printing rules in plain language before trusting the output, and restricting Claude to a pure declarative subset.

### 4.1a Clingo versus SWI-Prolog: speed and memory

**Source.** Eugen pasted a two-part comparison (paradigms, then performance) that appears to be an AI-generated search summary; it carries its own "may include mistakes" disclaimer. It is kept here as supplied, with my assessment beside it. Nothing in it was benchmarked in this session.

**Paradigms, as the comparison states them.**

| Feature | clingo (ASP) | SWI-Prolog |
|---|---|---|
| Paradigm | Answer set programming: declarative modelling of stable models | Logic programming: query-driven execution of Horn clauses |
| Execution | Bottom-up, ground then solve: rules become propositional logic and are evaluated globally | Top-down, backward chaining with SLD resolution and unification |
| Search | SAT-style conflict-driven clause learning | Depth-first search with backtracking |
| Order dependence | Rule and literal order do not affect correctness, only grounding efficiency | Rule and goal order decide path, termination and performance |
| Negation | Negation as failure under stable model semantics | Negation as failure under completion semantics, which can be unsound with unbound variables |
| Optimisation | Native `#minimize` and `#maximize` | Through libraries such as `clpfd` or meta-predicates |
| Generality | Not a general-purpose language; uses Python or Lua APIs for the rest | Turing complete, with a production ecosystem (HTTP server, package manager, IDE tools) |

**Speed and memory, as the comparison states them.**

| Metric | clingo | SWI-Prolog |
|---|---|---|
| Startup | Fast solver, but heavy grounding can delay it | Immediate |
| Scaling with data volume | Poor: the ground program grows with the data and can exhaust RAM | Excellent: indexed lookups over millions of facts |
| Scaling with constraint complexity | Excellent: the solver prunes mutually exclusive constraints globally | Poor in pure form: backtracking over complex constraint trees can time out |
| Memory | High and volatile; scales with the grounded program | Low and predictable; only the active execution path is held |
| Best at | Fixed-size problems with complex rules: scheduling, optimisation, puzzles | Large datasets with simple or streaming queries: parsing, filtering, expert systems |

**The comparison's rule of thumb.** Choose clingo for a fixed-size problem with highly complex rules. Choose SWI-Prolog for a massive dataset with simple or streaming queries.

**My assessment of the comparison** (from general knowledge, not verified in this session):
- **Sound and important:** the grounding bottleneck in clingo, its order independence, native optimisation, and Prolog's order dependence. These are the main practical differences.
- **Oversimplified:** calling Prolog "constraint logic programming" mislabels it (constraint solving comes from libraries). Saying clingo is not Turing complete "by design" is also too simple, because ASP with unrestricted function symbols can fail to ground at all.
- **Overstated:** "low and predictable" memory for Prolog. Facts live in memory, and tabling, which I recommended for terminating recursion, stores answers and can grow large.
- **Missing:** tabling, which removes much of the infinite-loop risk the comparison attributes to Prolog, and clingo's incremental solving.
- **Source quality:** a generated summary. Treat it as a map of where to measure, not as evidence.

**What this changes for Meaningfy.**

| Task | Engine | Why |
|---|---|---|
| Consistency of a rule set or playbook (finite scope tags, tens of rules) | clingo | Small ground program, exceptions and priorities handled natively, returns counterexamples |
| Minimal-fix and allocation problems (staffing, work packages) | clingo | Native optimisation |
| Compliance rules with defaults and exceptions over a bounded set of cases | clingo | Declarative exceptions |
| Closure, lineage and entity-resolution clusters over large data | SWI-Prolog with tabling, or SPARQL or DuckDB if the data is already in a store | Avoids a grounding blow-up |
| Competency-question tests against a large fact base | SWI-Prolog or SPARQL | Query-driven, scales with data |
| Conformance of data to the model | SHACL and OWL | Not a logic-programming job |

**Guard in the skill.** `rule-reasoning` should tell Claude to estimate the size of the ground program before choosing clingo, to prefer SWI-Prolog, SPARQL or DuckDB when the input is row-scale data, and to report grounding time and memory in the derivation output so a blow-up is visible early.

### 4.2 Where reasoning pays off in Meaningfy's work

| Area | Useful checks | Engine |
|---|---|---|
| Ontology engineering and modelling | Ontology consistency, unsatisfiable classes, competency questions tested against facts, contradictions in how an expert describes the domain | OWL reasoner, SPARQL or Prolog, pyNMMS |
| Data mapping | Output conforms to target model, every target property is mapped, conflicting mappings feed one property, alignment does not break class satisfiability | SHACL, Datalog-style queries, OWL reasoner |
| Data integration | Entity resolution as closure, quality rules with legitimate exceptions, lineage as transitive closure | Datalog or Prolog, clingo |
| Requirements and specification management | Traceability completeness (no orphans), impact analysis, regulatory rules with exceptions, contradictions between formalisable requirements, cross-reference errors | Graph queries (SPARQL or Datalog), clingo, Z3 |
| Elicitation sessions | Commitment-heavy conversations, including requirements | pyNMMS-style challenge loop |

Ranked by expected frequency of use: SHACL and OWL, then traceability queries, then clingo, then pyNMMS, then the rare engines.

**Observation from the offer-anatomy note.** The cross-reference errors found in the source offers (a task citing the wrong task number) are exactly what an automatic graph query catches. That is a concrete early use case for requirements and offer quality checks.

**Limit.** Most requirements are natural language. Formalise only the critical, checkable subset, and let Claude flag candidate contradictions in the rest for human judgement.

### 4.3 Elenchus and pyNMMS

**Source.** Bradley P. Allen, "Elenchus: A Dialectical AI Assistant for Traceable Ontology Engineering", 1st Workshop on AI-Assisted Approaches to Knowledge Engineering (AIAA4KE), ISWC 2026, Bari, 26 October 2026. Photographed slides were analysed. The underlying paper is Allen (2026), "Elenchus: Generating Knowledge Bases from Prover-Skeptic Dialogues", arXiv:2603.06974. Its abstract describes the LLM as a defeasible derivability oracle whose unreliability is contained by the expert's authority, and the paper names a repository, `bradleypallen/elenchus`.

**The idea.**
- It inverts generate-validate-repair. The expert is the respondent and states commitments and denials. The LLM is the opponent: it only challenges, claiming two statements cannot both stand, and asserts nothing itself. The expert then retracts, refines or contests.
- Generation scales with compute but validation scales with expert attention, so the bottleneck returns to authoring: the cost of saying what one thinks.
- The implementation is a Claude Code agent defined by a long prompt file. Commitments, denials, challenges and tensions are stored as labelled GitHub issues, which gives a versioned, browsable record.
- A reasoner called pyNMMS (nonmonotonic multisuccedent sequent calculus, after Hlobil and Brandom) checks derivability. Inferences do not chain by default, and a new premise can defeat an inference. The expert's sentences stay atomic, so nothing is formalised by hand.
- Current work: dialectical states as RDFS/OWL ontologies, with an Oxigraph triple store.

**Limitations stated in the talk.**
- It is an existence proof, not an evaluation.
- The model has almost certainly seen the history of the ontology used in the test, so the result shows the dialectic captures rationale, not that the LLM discovers it.
- Oracle bias: false negatives are invisible to both parties.
- Arguing with the opponent can be fatiguing.
- One expert and one LLM only.
- The base is not yet an RDFS/OWL ontology.
- In the test, six of seven challenges matched documented design tensions.

**pyNMMS as software.** It is on PyPI (version seen: 0.6.1), with documentation and a GitHub repository (`bradleypallen/pyNMMS`) linked from the package page. It implements the NMMS sequent calculus from Hlobil and Brandom (2025) with root-first backward proof search, memoisation and backtracking. It has a command line (`tell`, `ask`, `repl`) and a `pynmms.onto` subpackage that adds ontology axiom schemas (subClassOf, range, domain, subPropertyOf, disjointWith and others) while keeping nonmonotonicity. It is single-author, 0.x research code. **Unverified:** licence, test coverage, maintenance outlook.

**Why it matters for Meaningfy.** It fits the explainability and traceability positioning. "The ontology plus the auditable dialogue that justifies each commitment" is a sellable deliverable.

**Relation to Prolog and clingo.** Different question. pyNMMS checks that an expert's own statements cohere. Prolog, OWL and SHACL check a model against rules and data.

### 4.4 Alternatives to pyNMMS

No drop-in replacement exists. Neighbouring families:

| Family | Tools found | Notes |
|---|---|---|
| Argumentation (Python) | PyArg (`python-argumentation`) covers abstract argumentation, ASPIC+ and ABA with explanations; a newer `argumentation` package covers Dung frameworks, ASPIC+, ABA and ADFs with optional clingo and Z3 backends | Maturity of the newer one not judged. |
| Argumentation (other) | Arg2P (ASPIC+ on tuProlog, JVM, priorities and burden of proof); Scalop (Rust, abstract argumentation and ABA); aba-web | ABA dispute trees are the nearest analogue to the prover-skeptic loop, but they require formalised rules and attacks. |
| ASP | clingo | General nonmonotonic workhorse. |
| Epistemic | eclingo (epistemic logic programs on clingo), selp (single-shot solver) | selp is a research prototype. No mature tool for dynamic epistemic logic was found. |
| Defeasible logic | SPINdle, DeLP | **Unverified**, from memory. |

**Elenchus-specific gap.** Multiple respondents are not supported. ABA or ASPIC+ might earn a place there if a multi-expert version is ever needed.

### 4.5 SysML v2

**Useful for:** system-level specification (structure, behaviour, interfaces, constraints), requirements to design to verification traceability through satisfy and verify relations, trade-off analysis, and contexts where a client already mandates model-based systems engineering.

**Not useful for:** data and domain modelling (LinkML, OWL and UML do it better, and SysML has no ontology semantics), software internals (cosmic-python and C4 are the right level), communication diagrams (Mermaid or PlantUML), and small teams with no MBSE habit.

**Open-source tooling an agent can use.**

| Tool | What it is | Caveat |
|---|---|---|
| SysML v2 pilot implementation | Reference parser and language server, Jupyter kernel, REST API services | Proof of concept. |
| Eclipse SysON | Open-source web modelling tool, textual import and export, APIs, Capella interoperability | Its site says it is not yet intended for production. |
| SysIDE Community Edition (Sensmetry) | Free and open-source VS Code extension, with a SysML v2 and KerML parser and language server | Textual editing and analysis only. |
| Syside Automator (Sensmetry) | Python API to load, query, create and generate SysML v2 models | **Proprietary and paid**: needs a licence key, offers a 30-day trial, requires Python 3.12 or later, and CI use needs a deployment key from a business plan. |
| sysml2kit | Python toolkit: writes SysML v2 text, reads and writes API JSON, API client, MCP server with nine agent tools | Maturity not judged. |
| PySysML2, ANTLR4 grammar, API clients | Parsers and clients | Not assessed in depth. |

**When not to let an agent do it:** generating a whole system model from prose with no expert review, working without a parser in the loop (Claude's SysML v2 syntax will be unreliable because the language is new), editing a shared model through the API without version control and approval, and safety-critical or contractual models with no independent check.

**Position.** Do not adopt by default. For requirements and specification traceability, a LinkML or RDF graph queried with SPARQL gives most of the benefit with less overhead. Revisit if a client mandates SysML or a project needs real system architecture modelling; then build around sysml2kit or SysIDE CE (the free editor and language server; the Automator API is paid) with a validate-then-present loop.

### 4.6 The learning agent

**Goal.** The agent learns and stores Eugen's preferences, procedures, methods and exceptions, writing voice, way of thinking, conventions to propose to the company, and the entities he interacts with.

**Rejected: reinforcement learning.** One person generates too little signal, there is no simulator or reward, and a learned behaviour is opaque and hard to undo. Explicit rules are readable, editable and deletable.

**The loop.**
1. Capture the signal: the difference between Claude's draft and Eugen's final version, plus one line on why. Accept and reject decisions count too.
2. Distil candidate rules in a fixed shape: when, do X rather than Y, because Z, with examples. One correction is a candidate. A rule needs a few examples.
3. Eugen approves or rejects. The agent proposes and a human approves, so it cannot learn its own mistakes or flattering habits.
4. Store per activity, with scope and precedence.
5. Apply the relevant playbook and cite which rule fired.
6. Keep golden examples to catch regressions, and promote recurring rules into skills in the skillery.

**Where each kind of knowledge lives.**

| Knowledge | Home |
|---|---|
| Format, tone, language preferences | Built-in preferences (small, stable, everywhere) |
| Procedures, methods, exceptions | One playbook per activity in the vault, promoted into skills when general |
| Writing | A voice profile from before-and-after edits and golden examples; personal voice kept separate from the company voice |
| Way of thinking | Principles with reasoning and a worked example, in decision notes; elicited with an Elenchus-style challenge loop |
| Conventions proposed to the company | Proposal flow: draft, proposed, adopted, then skillery or an ADR |
| People, organisations, interactions | Odoo as system of record; vault notes keyed by Odoo ID |

**Entities.** Do not mirror Odoo into a knowledge graph, because two sources of truth drift. Build a graph only for cross-source queries Odoo cannot answer, and make it reference Odoo IDs. The agent proposes contacts and interactions from mail and calendar and writes to Odoo only under the existing tiered write policy.

**Rule types.**

| Type | Example |
|---|---|
| Trigger | When a tender arrives, run the compliance matrix first |
| Preference (soft) | Prefer short sentences |
| Default with exception | British English, except for US clients |
| Constraint (hard) | Never send without approval |
| Procedure | Steps in order |
| Checklist | Before finishing, verify arithmetic and cross-references |
| Selection heuristic | Fixed price when scope is clear, time and materials when it is not |
| Parameter | At most three options, under 400 words |
| Definition or convention | Naming and terminology |
| Escalation or autonomy | Ask before writing to Odoo |
| Quality criterion | A good offer has no orphan requirements |
| Principle | The reasoning behind a choice |

Start with default-with-exception, preference, constraint, procedure, convention and escalation.

**Scope.** Tag rules by activity, context (client type, audience, language, channel) and project. Organise storage by activity, one playbook each, with a global playbook for cross-cutting rules. Avoid a deep hierarchy.

**Rule schema.** ID, type, strength (hard, default, soft), scope tags, condition, action, links to exceptions, one-line rationale, example pointer, source (stated or approved after distillation), owner (personal or company), status (candidate, active, retired), date added, last applied, times applied.

**Precedence.** Hard beats default beats soft. More specific scope beats more general. Same-level conflicts are flagged to Eugen, never resolved silently by recency.

**Lifecycle.** Candidate, active, reviewed when stale or often overridden, retired. Nothing is deleted without Eugen's say-so.

**Monitoring.** Override rate (best quality signal), unexplained corrections (missing rules), staleness, conflicts between overlapping scopes, and playbook size (about 30 rules each).

**What to borrow from the RoomKG meta-policies paper** (Kim, Francois-Lavet and Cochez, ISWC 2026; only the project page was read, not the full paper). A learned selector chooses among named symbolic memory heuristics (newest, most recently used, most frequently used, and the matching eviction rules) while execution stays symbolic and traceable. It is trained by reinforcement learning in a synthetic room world. The gain over the best fixed rule is about one to two points of accuracy, and absolute scores are below 50 per cent, so it does not transfer directly. Worth borrowing:
- the principle that adaptation lives in choosing among named, inspectable procedures;
- annotating every rule with added, last applied and applied counts, so stale rules can be retired like least-recently-used items;
- explicit conflict handling: no single recency rule wins everywhere, so a person decides when a recent correction contradicts an old frequently applied rule.

The organisation behind it (HumemAI) builds open-source persistent agent memory and may be worth a look as an alternative to the current memory MCP, after a maturity check.

### 4.7 Consistency of rules

**What can go wrong.** Direct conflicts (two rules apply, opposite actions), dead rules (always overridden), precedence cycles, circular exceptions, gaps (common situations with no rule), and drift (rule says one thing, actual edits say another). The first five are logical and checkable. Drift is empirical and is checked against the correction log.

**Frameworks, in order of use.**

| Step | Framework | When |
|---|---|---|
| 1 | Decision-table analysis in a plain script | Scope is a few finite tags: enumerate every combination and see which rules fire. Covers most needs. |
| 2 | clingo | Defaults, exceptions and priorities that a script handles clumsily. Returns a concrete counterexample. |
| 3 | Z3 | Numeric constraints only. |
| 4 | OWL and SHACL | If rules are stored as RDF: structural checks such as scope subsumption and orphaned exceptions. Weak on default-with-exception. |

**Skipped for now.** Argumentation (adds machinery not needed yet), deontic logic (no mature tooling; model escalation as constraints), pyNMMS (a source of rules, not a checker of the rule set).

**Limit.** A solver checks structure, not whether a rule captures intent. Natural-language conditions cannot be checked, so keep the formal part to conditions that are unambiguous tags.

## 5. Packaging in the skillery

**Placement (revised).**

| Piece | Plugin or home | Why |
|---|---|---|
| `rule-reasoning` | meaningfy-architecture | Capability: choose an engine (the 4.1a split), run it, return the answer with a derivation. Next to `conceptual-modelling` and `linkml-engineering`, which cite it as they cite `modelling-conventions` |
| `rules-from-text` | meaningfy-architecture | Method for natural language to rules. Also used by `learned-rules` when it distils a correction, and by requirements work |
| `reasoning-project` | meaningfy-architecture | Governance for reasoning work that outlives one check |
| `dialectical-elicitation` | meaningfy-architecture | Elicitation for models and requirements; experimental |
| `learned-rules` | meaningfy-core | Cross-cutting, like the voice and writing skills |
| `rulekit` | skillery `tools/`, location open (see section 9) | Shared tool for lint, conflicts, event log and statistics, used by all five skills |
| Change to `vault-capture` and `vault-planning` | vault-assistant | Log corrections in the agreed format; add a rules step to the weekly review |
| Change to `vault-conventions` | vault-assistant | The `09 Rules/` folder and the `rule` kind, proposed through a `skill-change` note |

Build order: `learned-rules` and `rulekit` first, because the correction log feeds everything else; then `rule-reasoning` and `rules-from-text`; then `reasoning-project`; `dialectical-elicitation` last, as it is the most experimental.

**Proposed folder layout for `rule-reasoning`.**

```
rule-reasoning/
  SKILL.md                 narrow trigger, pure-subset rules, test-first loop
  references/
    pure-subset.md         what to avoid (cuts, negation-as-failure traps, clause-order tricks)
    patterns.md            closure, compliance check, consistency check, competency-question test
  scripts/
    check_env.sh           detects clingo and swipl, prints an install hint if missing
    run_rules.py           facts, rules and query in; answer and derivation out, fixed format
  templates/
    rules_and_tests.pl     facts, rules and expected conclusions side by side
```

The other four skills follow the same shape, with their own references, scripts and templates. `learned-rules` would ship the rule schema, the distil-and-approve prompt, the decision-table lint script and an example playbook.

**Design decisions.**
- Do not bundle engines. Declare them as dependencies and let `check_env.sh` fail clearly with an install hint. This keeps skills installable from Claude Code and opencode.
- State that these skills need a terminal with the engines installed, so they degrade gracefully where that is not possible (for example in a plain chat sandbox).
- Put the proof-trace format in `run_rules.py` from day one. That is the cheap version of a dedicated tool.
- Keep each skill's description narrow, so it only loads for rules, recursion, constraints, derivation, elicitation or correction capture.
- Cross-reference, never copy: modelling skills get a one-line pointer to `rule-reasoning`, and the testing guidance in development skills gets one line.
- Method lives in the skillery. Eugen's actual playbooks live in the vault. Only conventions the company adopts are promoted into the skillery.
- Mark all five skills experimental until their eval passes. Each ships one eval.
- Per the vault conventions, an agent never edits a skill. Method changes arrive as `skill-change` notes in `00 Inbox/proposed/`, and Eugen opens the pull request.

**Sequencing against the five planned OpenSpec changes** (single-source distribution, agent authoring standard, devops bundle, skill-defects fix batch, sales bundle). Add these as a sixth change, "reasoning and learning skills", after the first two, so each skill is authored once in the final layout. Prototype locally in the checkout in the meantime and keep it out of distribution.

### 5.1 `rules-from-text`: deriving rules from natural language

1. Split the source into clauses and give each a stable ID.
2. Classify each clause: obligation, permission, prohibition, definition, exception or defeater.
3. Formalise only what can be paraphrased back in plain language. Anything that cannot stays as flagged prose.
4. Make every rule cite its source clause.
5. Take positive and negative test cases from the text's own examples, and add edge cases.
6. Show each rule as a plain-language paraphrase and let the human confirm it.
7. Run a dialectical pass on the commitments the rules imply (see `dialectical-elicitation`).
8. Store the source hash, so a changed source flags the rules that cite it for review.

This is the same procedure whether the text is a regulation, a requirements document or one of Eugen's own corrections.

### 5.2 `reasoning-project`: structure and maintenance

A reasoning project is any rule-checking work that will be run more than once or kept for a client.

```
reasoning/
  charter.md   question, scope, engine and why, owner, review cadence
  sources/     natural-language texts with clause IDs, hashed
  rules/       formal rules, each citing its source clause
  facts/       fixtures, pulled by script and never hand-edited
  tests/       expected conclusions, positive and negative
  runs/        dated outputs: answer, derivation, time, memory
  log.jsonl    event ledger (shared format, see 5.3)
```

Maintenance rules:
- Tests run on every change to rules, facts or sources.
- A changed source hash flags the rules that cite it.
- Engine versions are pinned, and each run records time and memory so a grounding blow-up is visible.
- Decisions go in the ledger, not in chat.
- Non-one-off projects have a review cadence in the charter; unused or often failing rules are reviewed and retired.
- A one-off check shrinks to a charter-lite file plus one run record.

### 5.3 One ledger shape for rules and dialectical state

The dialectical state from Elenchus (commitments, denials, tensions, resolutions) and the learned rules are both statements with a status and an event history. They can share one append-only event shape, so `rulekit` serves both. Proposed fields: event ID, timestamp, subject ID (rule or statement), event type (created, approved, changed, retired, loaded, applied, overridden, tension raised, resolved), actor (person or agent), session or trace ID, reason, evidence link. For dialectical work the state is kept as files in the project, not GitHub issues, because client material should not live in an issue tracker.

### 5.4 Vault side

- A new folder `09 Rules/`, with `personal/`, `company-proposed/` and a candidates area. Under the vault conventions, new folders and kinds arrive through the owner's request and a `skill-change` note.
- **One note per rule** (kind `rule`), so each carries properties (ID, type, strength, scope, status, dates, counts) that Bases views can query for active, stale and overridden rules. `rulekit load --activity offers` returns a merged view, so loading cost stays low. The alternative, one file per playbook, is simpler to read but weaker for tooling. This is flagged as an open decision.
- Every rule note is `private: true` by default. Only a person sets `memory: common`.
- Promotion path: personal, then marked company-proposed, then validated (lint plus review), then moved into skillery. Nothing reaches the company without a person's step.
- The weekly review in `vault-planning` gains a rules step: candidates awaiting approval, stale rules, rules often overridden, conflicts.

### 5.5 Monitoring: three signals, three homes

| Signal | Reliability | Captured by | Home |
|---|---|---|---|
| Rule loaded | Verifiable | The agent's tool call to `rulekit load` | Langfuse tool spans, plus the ledger |
| Rule applied | Self-reported | A footer line naming the rule IDs used, parsed by a stop hook | `log.jsonl` |
| Rule overridden | Human | The correction log: Eugen's edit contradicts a cited rule | `log.jsonl` |

The footer is self-reported by the model, so it can miss a rule applied silently or claim one that was not. That is why "loaded" (visible in tool calls) is kept as the verifiable signal and "overridden" as the human one.

### 5.6 MCP, Langfuse or neither

- **No MCP at first.** Skills plus the command-line tool work in Claude Code and opencode. A thin MCP wrapper over the same library is justified only if Eugen uses regular Chat mode, where there are no hooks. The MCP must hold no logic of its own.
- **Langfuse is not the rule log.** Rule history is knowledge: it must sync with the vault, stay private and survive a change of tooling. Langfuse is for skill, tool and cost telemetry.
- **Optional later:** tag Langfuse traces with rule IDs through its API. The plugin supports deterministic trace IDs from a seed, which makes this possible.
- `rulekit` works offline and does not depend on Langfuse.

### 5.7 Langfuse spike

**What the plugin README says** (fetched 2026-10-28):
- It is Langfuse's own plugin, MIT-licensed, not an Anthropic product. Hooks read the session transcript at the end of each turn and at session end, and emit traces with turns, generations, tool calls and token usage.
- It covers the Claude Code command line and Claude Code mode in the desktop app. Regular Chat mode is not covered.
- It tags traces with `skill:<name>` for every skill invoked, by default, and can capture skill text, which is off by default. That gives skill-reading behaviour with no extra work.
- It sends conversation turns and tool calls to the endpoint set in `LANGFUSE_BASE_URL`, which can be self-hosted.
- Image capture needs media storage configured on a self-hosted instance, or must be switched off.
- It needs `uv` or a suitable Python. Recent desktop builds can fail to deliver plugin options and need a workaround that stores the secret in plaintext.
- Captured text can be truncated with a configurable maximum.

**Corrections to the text that was pasted.** It presents the plugin as provided by Anthropic, which is wrong. It also lists thinking blocks and cost tracking, which the README does not mention, so check them in the spike.

**From memory, unverified:** self-hosting Langfuse needs Postgres, ClickHouse, Redis and S3-compatible storage. The spike should confirm the components and the resource cost.

**Privacy.** Sessions contain client material and private vault notes. Self-host in EU infrastructure, truncate captured text, and disable the plugin for sensitive work. Decide a retention and deletion rule, and a GDPR position, before any real use.

**Acceptance criteria for the spike.**
1. Langfuse deployed with the existing Terraform and Ansible stack, monitored by the existing Prometheus.
2. One real Claude Code session traced, with skill tags visible.
3. A written privacy and retention rule, including which projects are excluded.
4. Resource cost measured.
5. A go or no-go on adopting it for skill-reading behaviour.

## 6. Trials and keep-or-drop tests

| Trial | Scope | Keep if | Drop if |
|---|---|---|---|
| 1. `learned-rules` on offers | One month, one playbook | The override rate falls and Eugen approves a useful number of rules | Few rules are approved, or maintenance is a chore |
| 2. `rule-reasoning` on the competency question bank | Known facts, expected answers | Claude's rule translation needs little correction and Eugen reaches for it again | Many fix-up loops, or never thought of |
| 3. `dialectical-elicitation` on one ontology workshop | One real session | Challenges surface tensions the expert had not seen and the session is bearable | Challenges are noise, or the session is exhausting |

| 4. `rulekit` event log and stop hook on the offers playbook | One month alongside trial 1 | Applied and overridden counts are usable and the weekly review takes minutes | The footer is unreliable or the review is a chore |
| 5. Langfuse spike (5.7) | One session, then one week of use | Skill and tool traces answer real questions about skill reading, within the privacy rule | No question it answers that the ledger does not, or the privacy rule cannot be met |

Run trial 1 first: highest payoff, lowest cost, and the corrections log it needs also feeds the others.

## 7. Risks and caveats

- **Translation risk.** Exact engines do not guarantee that Claude captured the intent.
- **Over-trust.** A derivation looks authoritative. Always show rules in plain language and test against known cases.
- **Rule drift and over-application.** Narrow rules applied too widely make the agent worse. Scope and review them.
- **Context dilution.** Load only the relevant playbook.
- **Privacy.** Personal thinking stays in the vault. Only a person sets `memory: common`. Adopted conventions are the only thing that moves to shared repositories.
- **Research-grade tooling.** pyNMMS, the newer argumentation package, sysml2kit and others are young. Pin versions and expect breakage.
- **Fatigue.** Being challenged by an LLM opponent is tiring. Time-box sessions.

## 8. Unexplored aspects (my view of what is missing)

**Design questions not yet answered**
1. **Concrete rule format.** Markdown with front matter, YAML, or LinkML? Storing rules in LinkML would let SHACL check them and would follow the existing toolchain, but it adds weight.
2. **Where playbooks live in the vault.** The vault conventions have no `playbook` kind. A new kind has to be proposed through a `skill-change` note, and the folder choice (`08 How to/`, a project's artefacts, or `03 Resources/`) is open.
3. **Capturing corrections with no friction.** How the draft-versus-final diff is logged automatically (editor hook, git diff, a capture step) decides whether the loop is used at all.
4. **Retrieval.** How the agent decides which playbook to load per task, and how to keep that cheap.
5. **Provenance of rules.** Whether each rule should carry PROV-O style provenance, as Elenchus does for implications.
6. **Rule-to-test linkage.** Linking rules to golden examples so a change shows what it breaks.

**Safety and governance**
7. **Prompt-injection and poisoning.** Rules and correction logs are text the agent reads as guidance. Treat them as data that needs approval, and never let content from mail or web pages enter a playbook unreviewed.
8. **GDPR and learned facts about people.** Notes on named individuals, and anything inferred about them, need a policy for storage, retention and deletion.
9. **Company versus personal conventions.** The boundary and the promotion path need a written rule.

**Operations**
10. **Environment management.** Engines (clingo, swipl, pyNMMS) must be installable across Claude Code, opencode and Claude Desktop. A container or a pinned environment script may be needed.
11. **Licences.** Seen so far: clingo is MIT-licensed (per a GitHub mirror of its README); Z3 is MIT-licensed; SysIDE CE is free and open source; Syside Automator is proprietary and paid; the Langfuse plugin is MIT. Still to check before any client delivery: pyNMMS, SWI-Prolog and janus-swi, SysON (the Eclipse project; an EPL licence is indicated on a slide but not confirmed), eclingo, PyArg and the other argumentation packages, sysml2kit, DuckDB, Oxigraph and pySHACL.
12. **Measuring value.** Define baselines before the trials: time per offer, edit distance between draft and final, override rate.
13. **Context and cost budget** of loading playbooks and running solvers.

**Scope extensions**
14. **Multi-person conventions.** Elenchus supports one expert. Company conventions involve several people, so a multi-respondent method would be needed (ABA or ASPIC+ may fit).
15. **Eliciting tacit rules.** An Elenchus-style session for Eugen's own habits, as a structured way to surface principles that edits alone will not reveal.
16. **Requirements to SysML export.** Whether the requirements graph should be exportable to SysML v2 for clients who need it.
17. **Offer anatomy checks.** The traceability chains in the offer-anatomy analysis (requirement to section, task to artefact to acceptance to schedule to invoice, claim to reference) are a ready-made first test for graph-based checks.

**Commercial angles**
18. **An explainable rule layer on top of an LLM** as a client offer, and a **defensible record of why the ontology is as it is** as a deliverable, both aligned with the DORA and AI Act traceability positioning. Pricing, packaging against the delivery ladder (discovery workshop, proof of value, scaling) and a first pilot client are open.
19. **Contact with the authors.** The Elenchus author's ISWC roadmap (RDFS, OWL 2 RL and SHACL support) overlaps the LinkML and OWL toolchain. A conversation at ISWC could shape or accelerate a collaboration.

**Validation of the engine choice**

20. **Benchmark on Meaningfy's own workloads.** The speed and memory claims in 4.1a are untested here. Run both engines on two real cases: a rule-set consistency check (expected to favour clingo) and a closure or entity-resolution query over a realistic fact volume (expected to favour SWI-Prolog, SPARQL or DuckDB). Record time, memory and grounding size, and set the size threshold at which the skill should switch engine.

**Monitoring and packaging**

21. **Ledger format.** Plain lines of JSON in the vault, or something queryable. JSON lines are simple and sync well, but need a reader for statistics.
22. **Reliability of the applied-rule footer.** Measure how often the model's citations match what a human sees, before relying on usage counts.
23. **Where `rulekit` is published and installed from.** A package index, or an install from the skillery repository, and how that interacts with the single-source distribution change.
24. **Per-rule notes versus per-playbook files.** Test both on the offers playbook before deciding.
25. **Chat-mode gap.** Regular Chat mode has no hooks and so no automatic usage logging; decide whether that matters, or whether an MCP front is worth building.
26. **Langfuse alternatives.** If the spike's cost is too high, a minimal local log and the ledger may be enough. Other observability tools were not assessed.
27. **Retention.** How long traces and rule events are kept, and how rule history is removed on request.

## 9. Open decisions for Eugen

1. Confirm the revised skill set (five skills plus `rulekit`), their plugin placement and the build order in section 5.
2. Confirm the engine split: clingo for rule-set work, SWI-Prolog (or SPARQL, DuckDB) for data-heavy work, with the grounding-size guard in the skill.
3. Choose per-rule notes or per-playbook files, and the rule file format.
4. Approve proposing the `09 Rules/` folder and the `rule` kind through a `skill-change` note.
5. Decide where `rulekit` is published, and whether an MCP front is needed at all.
6. Approve the Langfuse spike and its privacy rule, or decide to rely on the ledger alone.
7. Decide when to start trial 1, and which activity (offers is the recommendation).
8. Decide whether to add the work as a sixth OpenSpec change or prototype locally first.

## 10. References

**Status key.** *Opened* means the page or record was retrieved or appeared in search results during this session. *Address only* means the address is the project's well-known one from my knowledge and was not opened, so check it before citing. *Not located* means the item was cited on the Elenchus slides and I could not find it.

### Papers and books

| Item | Link | Status |
|---|---|---|
| Allen, B. P. (2026). Elenchus: Generating Knowledge Bases from Prover-Skeptic Dialogues. arXiv:2603.06974 | https://arxiv.org/abs/2603.06974 | Opened |
| Allen's Elenchus repository, named in the paper | https://github.com/bradleypallen/elenchus | Address only |
| Hlobil, U., and Brandom, R. (2025). Reasons for Logic, Logic for Reasons (the source of the NMMS calculus). The OUP review dates the book 2024 while pyNMMS cites 2025, so confirm the year and publisher | Review: https://academic.oup.com/pq/article/76/1/441/8089862 | Review opened; book details not confirmed |
| Brandom, R. (1994). Making It Explicit. Harvard University Press | no link | Not retrieved |
| Restall, G. (2005). Multiple Conclusions. In Hájek, Valdés-Villanueva and Westerståhl (eds), Logic, Methodology and Philosophy of Science: Proceedings of the Twelfth International Congress, pp. 189 to 205. College Publications | https://consequently.org/writing/multipleconclusions/ | Opened |
| Dutilh Novaes, C. (2020). The Dialogical Roots of Deduction. Cambridge University Press | https://doi.org/10.1017/9781108800792 | Opened |
| Moreau, L., Groth, P., Cheney, J., Lebo, T., and Miles, S. (2015). The rationale of PROV. Journal of Web Semantics 35, 235 to 257. This is my identification of the slides' "Moreau et al., 2015": its abstract describes a retrospective analysis of PROV's design decisions, which matches how the Elenchus paper describes its comparison source | https://doi.org/10.1016/j.websem.2015.04.001 | Opened (record) |
| Hlobil (2026) on implication-space semantics for RDF, and Hlobil et al. (2025) on material bases, both cited on the slides | no link | Not located |
| Kim, T., François-Lavet, V., and Cochez, M. (2026). Neuro-Symbolic Meta-Policies for Temporal Knowledge-Graph Memory under Partial Observability. arXiv:2607.18368 | https://arxiv.org/abs/2607.18368 | Cited on the project page; arXiv page itself not opened |
| Cabalar, P. and co-authors (2020). eclingo: A solver for Epistemic Logic Programs. arXiv:2008.02018 | https://arxiv.org/abs/2008.02018 | Opened |
| selp: A Single-Shot Epistemic Logic Program Solver. arXiv:2001.01089 | https://arxiv.org/abs/2001.01089 | Title seen in search results |
| Solving Epistemic Logic Programs using Generate-and-Test with Propagation (a newer eclingo version). arXiv:2410.22130 | https://arxiv.org/abs/2410.22130 | Opened |

### Reasoners and engines

| Tool | Link | Status and notes |
|---|---|---|
| pyNMMS | https://pypi.org/project/pyNMMS/ and https://github.com/bradleypallen/pyNMMS | Opened (PyPI); documentation and repository are linked from the package page |
| clingo and the Potassco suite | https://potassco.org and https://github.com/potassco/clingo | Opened indirectly; MIT licence per a mirror README |
| eclingo | https://github.com/potassco/eclingo | Opened via paper references and a fork's README |
| SWI-Prolog | https://www.swi-prolog.org | Site news seen (version 9 tabling features: well-founded semantics, incremental, monotonic and shared tabling) |
| janus-swi (Python and SWI-Prolog bridge) | https://pypi.org/project/janus-swi/ | Opened |
| Z3 | https://github.com/Z3Prover/z3 and https://pypi.org/project/z3-solver/ | Opened indirectly; MIT licence |
| DuckDB | https://duckdb.org | Address only |
| pySHACL | https://pypi.org/project/pyshacl/ | Address only. A separate Rust-backed variant, `pyshacl-turbo` (MIT or Apache-2.0), appeared in results at https://pypi.org/project/pyshacl-turbo/; it is a different package |
| Oxigraph and pyoxigraph | https://github.com/oxigraph/oxigraph | Address only; pyoxigraph seen as a dependency of pyshacl-turbo |

### Argumentation and defeasible reasoning

| Tool | Link | Status and notes |
|---|---|---|
| PyArg | https://research-portal.uu.nl/en/publications/pyarg-for-solving-and-explaining-rgumentation-in-python/ | Opened; confirm the PyPI package name before installing |
| `argumentation` package (ASPIC+, ABA, ADFs, optional clingo and Z3 backends) | https://github.com/ctoth/argumentation | Seen via a mirror; maturity not judged |
| Arg2P | https://klibs.io/package/it.unibo.tuprolog.argumentation/arg2p | Opened (package index) |
| Scalop | https://docs.rs/scalop | Opened |
| aba-web | https://github.com/kenrick95/aba-web | Opened |
| SPINdle, DeLP, Capella | not retrieved | From memory; search before citing |

### SysML v2

| Tool | Link | Status and notes |
|---|---|---|
| SysML v2 release and pilot implementation (OMG) | https://github.com/Systems-Modeling/SysML-v2-Release and https://github.com/Systems-Modeling/SysML-v2-Pilot-Implementation | Seen as upstreams of a fork list |
| Eclipse SysON | https://mbse-syson.org/ and https://github.com/eclipse-syson/syson | Opened; site says not yet for production |
| SysIDE Community Edition | https://github.com/sensmetry/sysml-2ls | Opened; free and open source |
| Syside Automator | https://pypi.org/project/syside/ | Opened; proprietary and paid, 30-day trial |
| sysml2kit | https://pypi.org/project/sysml2kit/ | Opened; has an MCP server with nine tools |
| SysML v2 resources list | https://github.com/daltskin/SysML-v2-Resources | Opened |
| SysMLNexus (includes PySysML2) | https://github.com/SysMLNexus | Opened; mirrors and forks |

### Observability and agent memory

| Item | Link | Status and notes |
|---|---|---|
| Langfuse Observability Plugin for Claude Code | https://github.com/langfuse/Claude-Observability-Plugin | Opened (README, 2026-10-28) |
| Langfuse integration page named in the pasted text | https://langfuse.com/integrations/developer-tools/claude-code | Address only |
| RoomKG Meta-Policies project page (HumemAI) | https://humem.ai/research/roomkg-meta-policies | Opened |
| HumemAI GitHub organisation and the project repository | https://github.com/humemai and https://github.com/humemai/roomkg-meta-policies | Named on the project page; not opened |

### Material supplied in the session

- The Elenchus workshop talk (photographed slides), AIAA4KE at ISWC 2026, 26 October 2026.
- The pasted clingo versus SWI-Prolog comparison (an AI-generated summary, no URL); assessed in 4.1a.
- The pasted Langfuse summary; corrections in 5.7.
- Vault material: the offer anatomy analysis, the Skills and Agents idea note and the skillery notes.
