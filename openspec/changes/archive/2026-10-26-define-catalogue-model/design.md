<!-- PLAN (design half). PLAN = this file + tasks.md. Document type: Implementation. Revision 1. -->

> Parent: EPIC `define-catalogue-model` ([`proposal.md`](proposal.md), DEC-1…DEC-7). Inputs:
> [`inputs/2026-10-26-seed-and-findings.md`](inputs/2026-10-26-seed-and-findings.md) (the 11 edges,
> the two taxonomies), [`inputs/2026-10-26-shaping-decisions.md`](inputs/2026-10-26-shaping-decisions.md).
> Acceptance criteria are the deltas under [`specs/`](specs/).

## Context

The catalogue holds 32 skills and 3 agents in 5 bundles (v3.1.0). Its classification is split:
`PURPOSE_OF` and `PURPOSE_BLURB` in `tools/skill_inventory.py` hold 7 purposes, and
`metadata.category` sits on 28 skills with 5 values that nothing reads. Bundles have no requirements,
and 11 skill-to-skill "depends on" edges cross into bundles nobody declared. Agents are not in the
inventory. The documentation has no register.

The facts the tooling already has:
- `bundles.yaml` is checked by `bundle_gen` against exact key sets (`_BUNDLE_KEYS`).
- Agent frontmatter is a closed contract (`AGENT_REQUIRED_FIELDS` + `AGENT_OPTIONAL_FIELDS`).
- The opencode renderer maps agent fields through `tools/opencode-agent-map.json`.
- The inventory parses "depends on" from each skill's `**Delegates:**` line (`_DELEGATES`) and
  "related" from `**Related:**`.

## Goals / Non-Goals

**Goals:**
- every skill and agent declares six facets from closed vocabularies;
- bundles declare their requirements, with no undeclared cross-bundle edge and no cycle;
- one generated catalogue map covers skills and agents by facet;
- the documentation register is in §8, with a check.

**Non-Goals:** see the proposal's No-gos (no ontology, no re-bundling beyond DEC-4, no automatic
installation of requirements, no owner facet, no edits to the `ai-*` documentation structure).

## Decisions

- **D-1. The vocabulary file is `facets.yaml` at the repo root**, beside `bundles.yaml`. Both are
  authored sources the tools read, and neither is rendered. Shape:

  ```yaml
  facets:
    purpose:
      writing: "produce or review prose"
      # … one line per value; the line is the explanation the map shows
  ```

  It replaces `PURPOSE_OF` and `PURPOSE_BLURB`. `metadata.category` is removed from the 28 skills
  that have it.
- **D-2. The facet keys in frontmatter** are `metadata.purpose`, `metadata.area`, `metadata.subject`,
  `metadata.posture`, `metadata.stage` and `metadata.maturity`. All are required on every skill and
  every agent, each a single string value from `facets.yaml` (no lists). One value per facet keeps
  the map readable; a skill that seems to need two values is a candidate for splitting, which is a
  separate change.
- **D-3. The vocabularies** are as follows; the owner confirms them before task 1.1. Purpose is
  cleaned of today's two area-like purposes ("Consulting & Business", "Personal Vault"), so the facets
  do not overlap.

  | Facet | Values |
  |---|---|
  | `purpose` | `writing` (produce or review prose) · `advising` (coach client decisions) · `offering` (scope, price and propose work) · `modelling` (domain models and system design) · `planning` (shape work and keep specs) · `building` (structure code and scaffold repos) · `quality` (tests, gates, review, guardrails) · `delivery` (version control, CI/CD, releases) · `knowledge` (capture and curate personal notes and plans) |
  | `area` | `coding` · `consulting` · `sales` · `personal` · `cross-cutting` |
  | `subject` | `generic` · `semantic-data` · `modelling` · `python` · `spec-driven` · `git-release` · `delivery-infra` · `obsidian` |
  | `posture` | `reusable` (R) · `profiled` (C) · `precise` (P) |
  | `stage` | `sell` · `advise` · `shape` · `design` · `build` · `verify` · `release` · `any` |
  | `maturity` | `experimental` · `stable` · `deprecated` |

- **D-4. The assignment** (§A below) is the starting data. Posture values come from the 3.1.0
  assessment (`openspec/changes/archive/2026-10-26-fix-accumulated-skill-defects/inputs/2026-10-26-reuse-vs-precision.md`).
  Every current skill and agent is `stable`.
- **D-5. Edge resolution** (§B below, confirmed by the owner). One requirement is declared:
  `meaningfy-building` requires `meaningfy-architecture`. Five skills change their delegation text:
  - `linkml-engineering`, `vault-setup`: delete the name from the Delegates line (it is already on
    Related);
  - `estimation`: delete the `epic-planning` bullet from "This skill DELEGATES", and reword its
    frontmatter description, which also says it "DELEGATES … the build breakdown to `epic-planning`",
    to "pairs with `epic-planning` for the build breakdown". That is a description change, so it gets
    a positive and a near-miss probe and a regenerated inventory;
  - `executive-communication`: delete `clarity-gate` from Delegates and add it to Related;
  - `guardrails`: reword the Delegates sentence so it hands nothing to the three building skills
    and names them as the gates it points to, while they stay on Related.

  The result is acyclic, and `meaningfy-core` requires nothing.
- **D-6. `requires:` in `bundles.yaml`** is an optional list of bundle names per bundle;
  `meaningfy-core` is implicit and never listed. `_exact_keys` treats every listed key as required,
  so it gains an `optional` parameter, and `requires` is passed as optional for bundles. It is not rendered into `marketplace.json`, which has no field for it; the catalogue map
  and the README show it (DEC-7).
- **D-7. Agents carry `metadata` too.**
  - `metadata` joins `AGENT_OPTIONAL_FIELDS` in the validator; the facet check makes it required
    in practice.
  - `spec/agent-template.md` gains it in the frontmatter contract, with one sentence: a change to an
    agent's `metadata` only is not behavioural and needs no new Gherkin scenario.
  - The opencode renderer (`renderAgent`) already emits only a fixed set of fields, so `metadata` is
    dropped without any code change. An installer test guards that, and
    `docs/environment/dual-cli/mapping.md` records the omission as intended (no gap).
  - `bundle_gen` copies agent frontmatter into `tools/opencode-catalogue.json`, so the facets
    appear there after `make bundles`. That is accepted: the file is the agents' frontmatter record.
  - On Claude, `claude plugin validate` checks the agent files (task 2.3).
- **D-8. The checks share one parser.** The new requirement check imports the inventory's
  `collect()` for "depends on" edges instead of parsing skills a second time.
  - `facets_declared`: all six keys are present with allowed values, on every skill and agent; the
    message names the file, the key and the allowed values.
  - `bundle_requirements`: every required bundle exists; `meaningfy-core` lists nothing; the graph is
    acyclic; every cross-bundle "depends on" edge points into a required bundle or core. The
    message names the edge and the missing requirement.
  - `doc_register_complete`: every `docs/**/*.md`, plus `README.md`, `AGENTS.md` and `CLAUDE.md`,
    matches a row of the §8 register. A row is either an exact POSIX path relative to the repo root
    or a folder prefix written `folder/**`, which matches every file at any depth below it. Matching
    is a plain string comparison or prefix test, not `fnmatch` or `PurePath.match`, whose `**`
    handling differs across Python versions.
- **D-9. The catalogue map keeps its path and target** (`docs/skill-inventory.md`,
  `make skill-inventory`), because it is linked from many files. The title becomes "Catalogue map".
  Changes:
  - the Map diagram gains the agents (inside their bundles, with edges to the skills they load) and
    a bundle-requirements graph;
  - the Relations diagram is unchanged;
  - each bundle table gains the facet columns and agent rows;
  - a new section "By facet" has one table per facet (value → skills and agents), generated from
    `facets.yaml`.
- **D-10. The register in §8 is a table** with the columns *view* (an exact path or a `folder/**`
  prefix, D-8), *kind* (generated or hand-written), *source or topic* and *rendered by* (a make
  target, or —). A prefix row (for example `docs/ai-sales/**`) covers a folder that one topic owns. Today's §8 routing rows stay
  as the hand-written views they describe.

### §A. Assignment (starting data)

Order: purpose · area · subject · posture · stage. Maturity is `stable` for all.

| Skill or agent | Bundle | Facets |
|---|---|---|
| `technical-writing` | core | writing · cross-cutting · generic · reusable · any |
| `explanatory-writing` | core | writing · cross-cutting · generic · reusable · any |
| `writing-antipatterns` | core | writing · cross-cutting · generic · reusable · any |
| `meaningfy-git-workflow` | core | delivery · coding · git-release · precise · build |
| `guardrails` | core | quality · coding · generic · reusable · verify |
| `semantic-consulting-coach` | consulting | advising · consulting · semantic-data · precise · advise |
| `decision-package` | consulting | advising · consulting · semantic-data · profiled · advise |
| `proposal-writing` | consulting | offering · sales · semantic-data · profiled · sell |
| `estimation` | consulting | offering · sales · generic · reusable · sell |
| `executive-communication` | consulting | writing · cross-cutting · generic · profiled · any |
| `architecture` | architecture | modelling · coding · modelling · reusable · design |
| `conceptual-modelling` | architecture | modelling · coding · modelling · precise · design |
| `modelling-conventions` | architecture | modelling · coding · modelling · reusable · design |
| `linkml-engineering` | architecture | modelling · coding · semantic-data · precise · design |
| `epic-planning` | building | planning · coding · spec-driven · reusable · shape |
| `spec-stewardship` | building | planning · coding · spec-driven · reusable · shape |
| `clarity-gate` | building | quality · cross-cutting · generic · reusable · shape |
| `bdd-gherkin` | building | quality · coding · generic · reusable · verify |
| `meaningfy-code-review` | building | quality · coding · python · precise · verify |
| `cosmic-python` | building | building · coding · python · precise · build |
| `project-setup` | building | building · coding · python · precise · build |
| `ci-cd-delivery` | building | delivery · coding · delivery-infra · precise · release |
| `meaningfy-release` | building | delivery · coding · git-release · precise · release |
| `vault-setup`, `vault-conventions`, `vault-project`, `vault-resume`, `vault-capture`, `vault-promote`, `vault-tidy`, `vault-planning`, `vault-daily` | vault-assistant | knowledge · personal · obsidian · precise · any |
| agent `epic-planner` | building | planning · coding · spec-driven · precise · shape |
| agent `implementer` | building | building · coding · python · precise · build |
| agent `code-reviewer` | building | quality · coding · python · precise · verify |

### §B. Edge resolution

| Edge (from → to) | Resolution | Why |
|---|---|---|
| `cosmic-python` → `architecture`, `conceptual-modelling`, `linkml-engineering` | **declare** building requires architecture | a developer applying the layering needs the design skills |
| `project-setup` → `architecture` | covered by the same requirement | — |
| `linkml-engineering` → `project-setup` | **delete from Delegates** (already Related) | otherwise architecture ↔ building would form a cycle; the scaffold is a "see also" for a modeller |
| `estimation` → `epic-planning` | **delete from the DELEGATES list; reword the description** (already Related) | a consultant should not need the developer bundle to estimate |
| `executive-communication` → `clarity-gate` | **move from Delegates to Related** | the clarity check is optional for a writer |
| `guardrails` → `clarity-gate`, `cosmic-python`, `meaningfy-code-review` | **reword the Delegates sentence** (already Related) | `meaningfy-core` requires nothing (DEC-4) |
| `vault-setup` → `project-setup` | **delete from Delegates** (already Related) | it is an analogy ("the way project-setup does for a repository"), not a hand-off |

Resulting requirement graph: `meaningfy-building → meaningfy-architecture → (core)`; every other
bundle requires only core. Acyclic.

## Algorithm / approach

1. **Data first:** write `facets.yaml` (D-1, D-3) and the facet values (§A) into 32 `SKILL.md` and
   3 agent files, removing `metadata.category`. Also `requires:` in `bundles.yaml` (D-6) and the six
   Delegates→Related moves (§B).
2. **Contracts:** add `metadata` to the agent contract and to the renderer's `catalogueOnlyFields`
   (D-7), and add `requires` to the bundle schema (D-6).
3. **Checks:** `facets_declared`, `bundle_requirements` and `doc_register_complete` (D-8), each with
   negative tests.
4. **Map:** extend the generator (D-9); retire `PURPOSE_OF` and `PURPOSE_BLURB`; `category_gaps`
   becomes a facet-gap check; regenerate.
5. **Register:** rewrite §8 (D-10); the README install section gains one line pointing to the
   requirements in the map.

*Worked example.* `estimation` today reads `**Delegates:** … the build breakdown to `epic-planning` …`.
After §B its `**Delegates:**` line no longer names `epic-planning`, and its `**Related:**` line does.
The inventory then shows `estimation ⇢ epic-planning` as a dashed "related" edge, and
`bundle_requirements` finds no cross-bundle "depends on" edge from `meaningfy-consulting`.

**Idempotency:** every step edits versioned text or regenerates a file from sources, so re-running
the generator or a check changes nothing once the sources are stable.

### Anti-patterns

- ❌ A facet value invented in a skill's frontmatter without a row in `facets.yaml`.
- ❌ Lists as facet values ("purpose: [writing, quality]").
- ❌ Declaring a requirement to silence a cycle (DEC-4).
- ❌ Hand-editing `docs/skill-inventory.md` or a README table the map already renders.
- ❌ Rendering `requires` into `marketplace.json` under an invented key.
- ❌ Changing a skill's body beyond the Delegates→Related move.

## Error matrix

| Failure mode | Expected handling |
|---|---|
| A skill lacks a facet, or uses a value outside the vocabulary | `facets_declared` fails, naming the file, the key and the allowed values |
| A new cross-bundle "depends on" edge appears | `bundle_requirements` fails, naming the edge and the bundle to require (or "reword to Related") |
| `requires:` lists an unknown bundle, lists core, or forms a cycle | `bundle_requirements` fails with that reason |
| An agent's `metadata` reaches opencode | It does not; `renderAgent` emits a fixed field set, and the installer test asserts it |
| Claude Code rejects `metadata` in agent frontmatter | Task 2.3 catches it with `claude plugin validate`; fallback: agent facets move to the agent's entry in `bundles.yaml`, recorded as a decision change |
| A new doc is added without a register row | `doc_register_complete` fails, naming the path |
| `facets.yaml` gains a value nobody uses | the map's "By facet" section shows an empty value; review removes it |

## Risks / Trade-offs

- [One value per facet loses nuance (for example `executive-communication` is both writing and
  consulting)] → `area: cross-cutting` absorbs most of it; a real second purpose is a split signal.
- [The vocabularies are a judgement] → the owner confirms D-3 before data entry; a later change is a
  one-file PR plus the skills that use the value.
- [Rewording six Delegates lines weakens hand-offs] → the Related line keeps the pointer, and only the
  install-time guarantee is dropped.
- [Overlap with `skill-crafting-method` in the method doc] → this change edits only §8, and waits
  for that change's merge (task 0.1).

## Open Questions

- None. The owner confirmed D-3, §A and §B on 2026-10-26 ([`inputs/2026-10-26-plan-confirmation.md`](inputs/2026-10-26-plan-confirmation.md)),
  with the bundle redesign by activity seeded for a later change.
