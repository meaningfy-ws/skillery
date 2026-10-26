# Seed and findings: the catalogue model (2026-10-26)

**Status:** SECONDARY input. Preserved verbatim, never groomed, never deleted.

## The owner's questions (verbatim)

> "do you capture any rules to package, bundle, create dependecies cross skils and agents
> do you have anywhere a way to specify wherher a skill is precice and specific and whether it is
> reusable, and how?
> do you specify anywhere how to maintain a picture of the skilsls and agents in an skillery
> ecossystem, and organsied per purpose and domains and facets and goals ... ?"
> "the last point in on propero documentation management"
> "shape that as a new EPIC"

## What the repo has (checked at v3.1.0 + `develop`)

| Concern | What exists | Enforced |
|---|---|---|
| Packaging | each skill and agent in exactly one bundle (`bundles.yaml`); `make bundles` renders both CLIs' install trees | yes (`bundle_gates`, membership checks) |
| Agent → skill | agent `skills:` frontmatter; primary skill in the agent's bundle | yes (`agent_bundle_membership`, `agent_skill_alignment`) |
| Skill → skill | prose: each skill's `## Boundary & Related Skills` section, with *Delegates* and *Related* lines; the inventory parses them into "depends on" and "related" edges | advisory only (`reciprocal_related_report`) |
| Bundle → bundle | nothing | no |
| External dependencies | `docs/environment/setup.md` | no |
| Reuse versus precision | the posture rule R / C / P (`docs/development-method.md` §3, `catalogue-governance` spec, 3.1.0) | no; no skill records its posture |
| Ecosystem picture | `docs/skill-inventory.md`, generated, drift-tested: a bundle map with 6 purposes, a relations graph, and per-bundle tables | yes (drift test) |
| Classification | two competing taxonomies: `PURPOSE_OF` (6 purposes, hand-kept inside `tools/skill_inventory.py`) and `metadata.category` (5 values on 28 of 32 skills, ignored by the inventory; missing on `architecture`, `cosmic-python`, `executive-communication`, `semantic-consulting-coach`) | partly |
| Agents in the picture | absent; the inventory covers skills only | — |
| Documentation management | no register of which views are generated and which are hand-written, or who owns each | no |

## Cross-bundle "depends on" edges (from the inventory parser)

18 edges cross a bundle boundary; 7 point into `meaningfy-core` (fine, every installer has core).
The other 11 have no declared requirement:

| From (bundle) | To (bundle) |
|---|---|
| `cosmic-python` (building) | `architecture`, `conceptual-modelling`, `linkml-engineering` (architecture) |
| `project-setup` (building) | `architecture` (architecture) |
| `linkml-engineering` (architecture) | `project-setup` (building) |
| `estimation` (consulting) | `epic-planning` (building) |
| `executive-communication` (consulting) | `clarity-gate` (building) |
| `guardrails` (**core**) | `clarity-gate`, `cosmic-python`, `meaningfy-code-review` (building) |
| `vault-setup` (vault-assistant) | `project-setup` (building) |

Three shapes of problem:
- **A cycle:** building ↔ architecture.
- **Core depending outward:** `guardrails`.
- **A heavy pull:** a vault user would need the whole developer bundle for one reference.

## Collision to avoid

`define-ai-domains` already uses **domain** for the business area Meaningfy works in (coding, selling,
advising). `metadata.category` holds roughly those values today. The owner's "domain" facet (subject
matter, transferability) needs another name.
