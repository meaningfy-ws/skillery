# Catalogue overlap audit — handover proposals vs what skillery already has

Secondary input, never groomed. Read-only audit by a research subagent, 2026-10-28, of the handover's
proposed artifacts (`Reasoning and learning skills.md` §3, §5) against the catalogue at `develop` 4576c7e.
Each verdict carries file:line evidence. Lines marked *inference* are the auditor's judgement.

## Verdict per proposed artifact

**`learned-rules` (meaningfy-core): EXTEND-EXISTING. Owners: vault-conventions, vault-planning, skillery-feedback. Only the rule schema is new.**
- Capture: vault-capture keeps the owner's words and never invents substance (`skills/vault-capture/SKILL.md:58-64`).
- Staging and approval: an agent's unasked claim goes to `00 Inbox/proposed/`, and a person or `vault-promote` moves it on (`skills/vault-conventions/SKILL.md:146-150`, `skills/vault-promote/SKILL.md:55`).
- Personal → company: `memory: common`, set only by a person (`vault-conventions/SKILL.md:81`).
- Into skillery: an agent never edits a skill. It writes a `kind: skill-change` note and a person opens the PR (`:152-154`, `references/kinds.md:56-59`). The note is accepted as intake (`docs/development/README.md:180-184`).
- Weekly review: vault-planning sweeps `00 Inbox/proposed/` weekly and turns friction into skill-change notes (`skills/vault-planning/SKILL.md:63-66, 71-72`).
- Personal preferences: the vault's `AGENTS.md` holds the owner's profile (`vault-conventions/SKILL.md:27`).
- New: the rule schema (precedence, strength, lifecycle, counts), as a `rule` kind proposed via a skill-change note (`:75-76`). A new top-level `09 Rules/` folder needs the owner's request (`:48-49`).
- *Inference*: the handover's personal → company-proposed → validated → skillery path duplicates staging → vault-promote → `memory: common` → skill-change → PR.

**vault-capture / vault-planning / vault-conventions changes: ALREADY-COVERED for the sweep.** Only a "rules" line in the sweep and the `rule` kind would be new.

**`rules-from-text`: partly CONFLICTS / EXTEND-EXISTING.**
- Elicitation is owned by epic-planning (`skills/epic-planning/SKILL.md:33-36`).
- Assumption surfacing is owned by clarity-gate (`skills/clarity-gate/SKILL.md:18-24`).
- Traced positive and negative cases are owned by bdd-gherkin (`skills/bdd-gherkin/SKILL.md:63-64`).
- New: the deontic classification, "formalise only what paraphrases back", and the source hash. *Inference*: a reference file inside `rule-reasoning`.

**`rule-reasoning`: NEW-NEEDED, narrowly.**
- No skill mentions clingo, Prolog, Datalog, reasoner runs or competency-question tests.
- The modelling skills only generate and check OWL/SHACL (`skills/linkml-engineering/SKILL.md:49-51`, `references/owl-shacl-completeness.md:20`, `references/quality-gates.md:21`, `skills/conceptual-modelling/SKILL.md:60-64`).

**`reasoning-project`: CONFLICTS / absorbable.**
- The charter, tests, runs, log and cadence repeat the spine (EPIC, design, tasks, archive, `docs/development/lessons-loop.md`).
- Scaffolding belongs to project-setup, and decisions to architecture ADRs (`skills/architecture/SKILL.md:210-342`) or the vault's `decisions.md`.
- The reuse test: "A skill with one user and one project is a project file" (`docs/development/README.md:175-176`). *Inference*: a template plus a section in `rule-reasoning`.

**`dialectical-elicitation`: EXTEND-EXISTING. Owner: semantic-consulting-coach (meaningfy-consulting).**
- "Only asks and challenges" already exists in the Exploration mode ("Elicit … no solutions", `skills/semantic-consulting-coach/SKILL.md:116-120`), the Alignment mode (`:122-126`) and "No assumptions, especially domain premises" (`:152-155`).
- New: pyNMMS commitment and tension tracking.

**`rulekit` in `tools/`: CONFLICTS.**
- `tools/` is catalogue build tooling and never ships. Bundles ship only skill and agent symlinks plus `plugin.json`.
- Precedent of the failure: `scaffold.sh` reaching outside the skill (`docs/future-features.md:26`).
- Every shipped executable lives in its owning skill's `scripts/`, tested from `tests/test_*.py` by path (for example `tests/test_devops_check_stack.py:14`).

**Stop hook parsing a rule footer into `log.jsonl`: CONFLICTS with current distribution.**
- `Stop` maps to Claude `Stop` and opencode `session.idle` (`docs/development/hook-bindings.md:80`), so it is feasible in principle.
- Hooks are projected only into repos by project-setup (`:88-100`). No bundle `plugin.json` ships hooks, and `tools/bundle_gen` has no hook support.
- The vault is not a project-setup target, so there is no install path.

**Reusable loop already in use**: sales weekly review. "a kind of finding seen in two sweeps becomes a proposed new filter … as a decision card" (`skills/sales-operations/references/run-types.md:65`). Also `references/goal-loop.md:43,93`.

**Voice**: meaningfy-voice holds only the company profile (`skills/meaningfy-voice/SKILL.md:17`). A personal voice belongs in the vault `AGENTS.md`. **guardrails** has no preference or correction mechanism.

**Open work nearby**: `evaluate-catalogue` (parked) owns per-skill evals. `docs/future-features.md` has "Agent aspects … memory" (`extend-agent-template`) and "Odoo memory skill". No open change covers reasoning engines.

## Hard constraints for the child EPICs
1. Failure-first: a recorded failure case per skill, which becomes the acceptance test (DoD `docs/development/README.md:281`).
2. Exactly one bundle (`bundles.yaml`), then `make bundles` and `make skill-inventory`. Nothing released may depend on work in progress (`README.md:157-161`).
3. Six facets from `facets.yaml`. There is no "reasoning" subject value, so a one-line PR is needed. `maturity: experimental` is available.
4. One positive and one near-miss probe in `tests/trigger_probes.yaml`, plus a baseline run.
5. Check `tests/ownership.yaml` and add a `## Boundary & Related Skills` section.
6. External engines go in `dependencies.yaml` (kind `cli-tool`: pin, provenance, used_by, opencode_status, install lines) and in the setup docs. Nothing is bundled.
7. Scripts live in the owning skill's `scripts/` with a pytest under `tests/`, and reach nothing outside the skill.
8. Bodies stay CLI-agnostic (`body_agnosticism`).
9. Any hook is a `hooks.yaml` entry with per-CLI bindings and a shared script. A vault distribution path would be new design work.
10. Vault rules: new kinds and folders go through a skill-change note, only a person sets `memory: common`, and nothing calls `remember`.
11. Third-party code needs `THIRD_PARTY_NOTICES.md` and a provenance note.
12. Docs: a Quick Start with a worked example, a README row for entry points, and a CHANGELOG line.
