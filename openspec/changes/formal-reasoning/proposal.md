<!-- STATUS: pitch, 2026-10-29. Shaped from the owner's decisions of 2026-10-29 (see the umbrella's
     inputs/qa.md). Next: owner fine-tunes this pitch, then the PLAN is derived and gated. -->

# EPIC: Formal reasoning — exact, auditable reasoning engines for modelling and architecture work

**Golden-thread parent:** the umbrella EPIC [`reasoning-capabilities`](../reasoning-capabilities/proposal.md).
Research: handover §4.1–4.2, 4.1a, 4.7 and 5.1–5.2, and the [`research-synthesis`](../reasoning-capabilities/inputs/2026-10-28-research-synthesis.md).

## Appetite

**MEDIUM.** It adds one new skill with its references, scripts, templates and tests, two declared
engines, and one-line pointers from the modelling skills. If it grows a third engine, a service or
an MCP, it has overrun.

## Why

Agents reason in prose. Where the answer must be exact and explained, prose reasoning is unreliable,
and its mistakes cannot be seen. That covers rule sets with defaults, exceptions and priorities,
traceability and closure over data, and competency questions over a model. LLM-written proofs fall to
about 32% correct on hard cases (ISWC OntoLM), while an agent working in a loop with solver feedback
solves every instance of ASP-Bench. Meaningfy's positioning is "proofs an agent can check" (the
owner's ISWC note), so the catalogue should give agents the engines and the discipline to use them.

## Solution outline

One skill, **`formal-reasoning`** (bundle meaningfy-architecture, `maturity: experimental`, facet
subject `modelling`).

**How it is used is kept separate from how it is installed.** The skill covers *which engine for which
question* and *how to use it*. Installation lives in `dependencies.yaml` and the environment docs. A
`check_env` script reports which engines are present and points to the install doc; it never installs
anything.

**Two engines, chosen by the shape of the problem:**

| Problem | Engine |
|---|---|
| Finite rule sets with defaults, exceptions and priorities; consistency checks; minimal fixes; allocation | **clingo (ASP)** |
| Closure, lineage and entity-resolution clusters over larger fact bases; competency questions over facts | **SWI-Prolog (with tabling)** |
| Data conformance to the model | Existing SHACL/OWL toolchain (pointer only) |

**A grounding-size guard:** estimate the size of the ground program before choosing clingo, and report
grounding time and memory in every run.

**The loop:** write rules, then tests with expected answers, then run, then paraphrase each rule back
in plain language, then fix. The skill keeps to a pure declarative subset of each language, and
`run_rules` returns the answer, the derivation, the time and memory, and the paraphrase in a fixed
format.

**References:**
- `patterns.md`: consistency, exceptions and priority, minimal fix, closure, **competency-question testing**;
- `rules-from-text.md`: classify clauses (obligation, permission, prohibition, definition, exception, defeater), formalise only what paraphrases back, cite the source clause, and hash the source;
- `pure-subset.md`;
- `when-not.md`;
- the reasoning-project layout as a template that cites the spine and does not restate it.

**Competency-question testing:** each CQ becomes a query (Prolog goal or SPARQL) with an expected answer
agreed with the domain expert beforehand, run against fixture facts on every model change.
conceptual-modelling and linkml-engineering cite this pattern; they don't restate it.

## Key decisions

- **DEC-1** (owner): Keep both clingo and SWI-Prolog, each for a different kind of reasoning.
  Rejected: clingo only.
- **DEC-2** (owner): Installation ease is separate from usage. Engines are declared dependencies with
  install docs; the skill detects them and never installs them. Rejected: choosing engines by how easy
  they are to install.
- **DEC-3** (owner): One reasoning skill in the modelling and architecture bundle (meaningfy-architecture).
  Rejected: several reasoning skills, or placement in core.
- **DEC-4** *(proposed)*: CQ testing is a pattern of this skill. Rejected: linkml-engineering quality
  gates, because CQ tests are reasoning over facts, not LinkML craft.
- **DEC-5** *(proposed)*: Text-to-rules and the reasoning-project layout are references and templates
  inside this skill. Rejected: separate `rules-from-text` and `reasoning-project` skills (they overlap
  the spine, clarity-gate and bdd-gherkin).
- **DEC-6** *(proposed)*: Z3, eclingo, argumentation frameworks, DuckDB and SymPy are named in `when-not.md`
  as "only on a recorded need". Rejected: declaring them now.

## Rabbit-holes

- **Translation risk.** An exact engine does not prove that Claude captured the intent. Paraphrase-back and expected-answer tests are mandatory, not optional.
- **Grounding blow-up in clingo** on row-scale data. The guard plus the engine table route this to Prolog.
- **Prolog traps:** cut, negation as failure with unbound variables, clause-order tricks. The pure subset bans them.
- **Engine installation differs per OS.** SWI-Prolog needs a system install, while clingo comes from pip. Document it; don't paper over it.

## No-gos

- No bundled engines, and no automatic installation.
- No reasoning service or MCP.
- No SysML v2.
- No SHACL/OWL re-teaching: that stays with the modelling skills.
- No formalising of text that cannot be paraphrased back: it stays flagged prose.

---

## What Changes

- New skill `formal-reasoning` in meaningfy-architecture: `SKILL.md`, references, `scripts/check_env` and
  `scripts/run_rules` with tests, and templates.
- `dependencies.yaml` gains clingo and SWI-Prolog; the environment docs gain their install lines.
- One-line pointers from conceptual-modelling and linkml-engineering to the CQ-testing and reasoning patterns.

## Capabilities

### New Capabilities

- `formal-reasoning`: engine choice, the reasoning loop, CQ testing, and rules from text.

### Modified Capabilities

_None._

## Impact

- Bundle meaningfy-architecture; `dependencies.yaml`; the environment setup docs.
- External engines on the user's machine: clingo (pip, MIT) and SWI-Prolog (system package, BSD-2).
