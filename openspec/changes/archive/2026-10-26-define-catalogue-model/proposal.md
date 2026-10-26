# EPIC: The catalogue model — facets, bundle requirements and one generated picture

> **Golden thread.** Parent: the owner's three questions of 2026-10-26 and the findings checked
> against the repo, in [`inputs/2026-10-26-seed-and-findings.md`](inputs/2026-10-26-seed-and-findings.md);
> the owner's shaping answers are in [`inputs/2026-10-26-shaping-decisions.md`](inputs/2026-10-26-shaping-decisions.md).
> **Siblings:**
> - `skill-crafting-method` (PLAN gated, not implemented) edits the same method document. This EPIC
>   follows it, and owns only §8 and the posture field.
> - `define-ai-domains` owns the word "domain" for business areas (DEC-2).
> - `add-devops-bundle` and `add-sales-bundle` should land after this, so their skills are born with
>   facets and their bundles with `requires:`.
> - **Roadmap position (owner, 2026-10-26):** step 3 of 5. The steps:
>   1. implement `skill-crafting-method`;
>   2. record the baseline audit against the method;
>   3. **this EPIC**;
>   4. a rigorous restructuring and evaluation of the repo, shaped as its own EPIC
>      (`restructure-and-evaluate-catalogue`) from the audit;
>   5. bundles redesigned by activity
>      ([`inputs/2026-10-26-plan-confirmation.md`](inputs/2026-10-26-plan-confirmation.md)).

>   The roadmap is recorded in `skill-crafting-method`'s `design.md` §8.

## Appetite

**Medium: one EPIC, about two weeks part time.** Most of it is data: 32 skills and 3 agents gain
facet values; `bundles.yaml` gains requirements. The tooling extends the existing inventory
generator and validator; it does not replace them. If the vocabularies cannot be agreed within the
appetite, the EPIC ships the mechanism with the vocabularies that are agreed, and names the rest.

## Why

Skillery can say which bundle a skill is in and which skills an agent loads. It cannot say what a
skill is for, how far it transfers, where in the work it helps, how mature it is, or what a bundle
needs from the others.

- **Classification is split.** The facts that exist are split across two taxonomies: a purpose list
  hidden inside the generator script, and a `category` field on 28 of 32 skills that nothing reads.
- **Posture is unrecorded.** The posture rule shipped in 3.1.0 is recorded nowhere per skill.
- **Agents are missing.** They are absent from the only picture of the ecosystem.
- **Bundles leak.** 11 skill-to-skill dependencies cross into bundles nobody declared as needed,
  including a cycle (building ↔ architecture) and the base bundle depending outward (`guardrails`).
  An installer who takes one bundle gets hand-offs to skills they do not have.
- **Documentation drifts.** No register says which documentation views are generated and which are
  written by hand. Facts get restated across docs; the 3.1.0 documentation pass found exactly that.

Why now: two new bundles (devops, sales) are about to be added. Adding them before the model exists
doubles the cleanup.

## Solution outline

1. **One set of facets, declared in each skill and agent**, under frontmatter `metadata`. String
   values keep the frontmatter valid against the Agent Skills specification. Each facet has a closed
   vocabulary held in one file that the validator and the generator both read.
2. **Bundle requirements in `bundles.yaml`.** Each bundle lists the bundles it `requires:`. Every
   cross-bundle "depends on" edge must point into a required bundle, and the requirement graph must
   be acyclic with `meaningfy-core` at the bottom. Today's 11 undeclared edges are each resolved: by
   declaring the requirement, rewording a hand-off as "related", or moving a skill.
3. **One generated picture.** The inventory becomes the catalogue map: skills **and agents**, viewable
   by bundle, purpose, area, stage and posture, with the dependency graph and the bundle
   requirements. It is drift-tested as today. The README and the docs link to it instead of keeping
   their own tables.
4. **A documentation register in the method (§8).** Every documentation view is listed with its kind:
   *generated* (its source and the make target that renders it) or *hand-written* (the one topic it
   owns). A view not in the register is a defect.

## Key decisions

- **DEC-1: Facets live in the artefact, vocabularies in one file.** Each skill and agent declares
  its facet values in `metadata`. The allowed values per facet live in one vocabulary file (format
  decided at PLAN). `PURPOSE_OF` in the generator and the unused `metadata.category` are retired into
  it. One source per fact.
- **DEC-2: Declared facets: `purpose`, `area`, `subject`, `posture`, `stage`, `maturity`.**
  - `purpose`: the kind of job (today's seven purposes, cleaned of the two that are really areas, are the starting vocabulary).
  - `area`: the business area served, aligned with `define-ai-domains`' domains (coding, consulting,
    sales), plus `personal` and `cross-cutting`. It replaces `category`.
  - `subject`: the knowledge it carries, which shows how far it transfers (for example generic,
    semantic-data, python, linkml, vault). This is the owner's "domain", renamed because
    `define-ai-domains` already uses that word.
  - `posture`: R / C / P.
  - `stage`: the goal it advances, as a lifecycle stage (for example sell, shape, design, build,
    ship, operate, personal).
  - `maturity`: experimental, stable or deprecated. Added on the owner's invitation, because it
    gives retirement and issue triage a recorded state.
- **DEC-3: Derived descriptors are never declared.** The generator computes and shows them: bundle,
  bundle requirements, depends-on and related edges, the skills an agent loads, invocation mode
  (model or explicit only), CLI support and recorded gaps, size and always-on cost. Declaring them
  would create a second source.
- **DEC-4: `meaningfy-core` requires nothing, and the requirement graph is acyclic.** A dependency
  that would break either rule is reworded as "related" or the skill moves. Cycles are not declared
  away.
- **DEC-5: The validator enforces facets, vocabulary and requirements.** It checks presence, the
  allowed values, cross-bundle edges against `requires:`, and acyclicity, so the model cannot rot
  between releases. The posture check is presence and vocabulary only; whether the value is right
  is review.
- **DEC-6: The documentation register lives in `docs/development-method.md` §8** (owner, Q4). Every
  file under `docs/`, plus `README.md`, `AGENTS.md` and `CLAUDE.md`, is in the register or is a
  defect.
- **DEC-7: Installing follows requirements.** The README and the install docs state each bundle's
  requirements. Automatic installation of required bundles is out of scope (see No-gos).

## Rabbit-holes

- **Do not build an ontology.** Facets are flat lists of strings; no hierarchy, no inference, no RDF.
  The model is the smallest one that answers the owner's three questions.
- **Do not let vocabularies grow per skill.** A value nobody else uses is not a facet value. New
  values come through a PR to the vocabulary file, not ad hoc.
- **Do not hand-maintain any view the generator can render.** If a picture is wanted, it is generated.
- **Do not reorganise the bundles during this EPIC** beyond what DEC-4 forces for the 11 edges.
  Re-bundling for its own sake is a separate change.

## No-gos

- No new skills, no skill content changes beyond frontmatter `metadata` and the hand-off wording that
  DEC-4 forces.
- No automatic installation of required bundles by either installer (DEC-7).
- No edit of `docs/development-method.md` outside §8 and the posture lines; the rest belongs to
  `skill-crafting-method`.
- No human "owner" facet; accountability per skill belongs to `define-roles-and-raci`.
- No change to the `ai-*` documentation structure; `define-ai-domains` owns it.

---

## What Changes

- Every `skills/*/SKILL.md` and `agents/*.md` gains `metadata` facet values; `metadata.category` is
  retired.
- A vocabulary file holds the allowed values of each facet.
- `bundles.yaml` gains `requires:` per bundle; the 11 undeclared edges are resolved.
- `tools/skill_inventory.py` becomes the catalogue map generator: agents included, facet views,
  bundle requirements. `PURPOSE_OF` is retired.
- `tools/repo_lint` gains the facet, vocabulary and requirement checks.
- `docs/development-method.md` §8 becomes the documentation register; README and install docs state
  bundle requirements.

**BREAKING (for contributors only):** a skill or agent without facets, or with a value outside the
vocabulary, fails `make validate`.

## Capabilities

### New Capabilities

- `catalogue-model`: facets and their vocabularies, bundle requirements, the generated catalogue map,
  and the documentation register.

### Modified Capabilities

- `catalogue-governance`: one new requirement (bundles declare the bundles they require) and one
  modified (the posture rule gains the recorded `metadata.posture` field).
- A later change, seeded in [`inputs/2026-10-26-plan-confirmation.md`](inputs/2026-10-26-plan-confirmation.md),
  redesigns the bundles around Meaningfy's activities; this EPIC's mechanism (facets, `requires:`,
  the map) is what that change will reuse.

## Impact

- **Files:**
  - all skills and agents (frontmatter only);
  - a new vocabulary file;
  - `bundles.yaml` and the rendered marketplace;
  - `tools/skill_inventory.py`, `tools/repo_lint/lint.py` and their tests;
  - `docs/skill-inventory.md` (becoming the catalogue map);
  - `docs/development-method.md` §8;
  - README and the install docs.
- **Siblings:** follows `skill-crafting-method`; precedes `add-devops-bundle` and `add-sales-bundle`;
  aligns `area` with `define-ai-domains`.
