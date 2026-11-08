PLAN for EPIC `align-agent-team-delivery`. Appetite LARGE; one stage per group below, but run as
one branch `feature/align-agent-team-delivery` (skillery is docs and skills, no code paths).

## 1. New skill `epic-delivery`
- [x] 1.1 `skills/epic-delivery/SKILL.md` per design §1 (facets, CLI-agnostic body, Boundary section)
- [x] 1.2 `references/team-and-briefs.md`, `stage-loop.md`, `dependencies.md`, `verification-validation.md`
- [x] 1.3 `bundles.yaml` (meaningfy-building), `make bundles`, `make skill-inventory`
- [x] 1.4 Probes in `tests/trigger_probes.yaml` (positive + near-miss of `epic-planning`)
- [x] 1.5 `tests/features/epic-delivery.feature` (scaling, dependency decision, who asks the developer)

## 2. Neighbour skills (design §3)
- [x] 2.1 `guardrails` §5
- [x] 2.2 `bdd-gherkin`
- [x] 2.3 `meaningfy-code-review`
- [x] 2.4 `cosmic-python` testing checklist
- [x] 2.5 `architecture`
- [x] 2.6 `conceptual-modelling`
- [x] 2.7 `technical-writing`
- [x] 2.8 `meaningfy-git-workflow`
- [x] 2.9 `epic-planning`, `spec-stewardship` pointers
- [x] 2.10 `meaningfy` schema: optional `evidence/`

## 3. project-setup projection
- [x] 3.1 `develop/{index,agents,testing}.adoc` templates
- [x] 3.2 `architecture/index.adoc` template
- [x] 3.3 `AGENTS.md.tmpl` block

## 4. Docs
- [x] 4.1 `docs/practice/ai-coding/working-with-agents.md` (new)
- [x] 4.2 `build-lifecycle.md`, `dod-quality-gates.md`, `opsx-runbook.md`
- [x] 4.3 playbooks + new `developer.md`; `roles-and-raci.md`
- [x] 4.4 `docs/development/workflows.md`, `docs/development/README.md` (Q-4)
- [x] 4.5 README entry row, CHANGELOG

## 5. Sibling repos (parallel members, design §8)
- [x] 5.1 mapping-workbench-v2 `docs/lean-delivery` committed
- [x] 5.2 rdf-persistence `docs/lean-delivery` committed

## 6. Close
- [x] 6.4 Fix the checker's findings per design §10 (DD-1..DD-8)
- [x] 6.1 `make validate`, `openspec validate --strict`
- [x] 6.2 Fresh checker over the diff against this PLAN
- [x] 6.3 Commit (owner consent given for this EPIC's implementation, round 2)
