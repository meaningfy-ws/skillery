# EPIC: Meaningfy Agent-Skills Repository Reorganization

## 0. Original brief (context — verbatim)

- this repository is supposed to be a company wide support for organising, managing and sharing skills, agents, plugins, prompts, company wide methodologies, runbooks on performing tasks with agents and LLMs consistently.
- we shall have guides and specs on methodologies, runbooks, best practices, and standards for how to use agents and LLMs effectively across the company.
- it shall contain skills and agents that are reusable across the company, with clear documentation and guidelines for use.
- propose a proper repository organisation and structure that makes it easy for employees to find and use resources, while maintaining clarity and consistency.
- create requirements specifications, then an implementation plan.

**Frozen (move only, do not edit content):** `executive-communication`, `semantic-consulting-coach`, `docs/ai-coding/`.
**Agents:** content is mostly fine — turn them into skills with proper docs and usage guidelines.
**Repo must align to Meaningfy principles** (cosmic-python: single source of truth, clear boundaries, no duplication, validation as guardrail).
**Process gate:** wait for revision of specs + plan before implementing.

---

## 1. Purpose & goals

Turn this repository from a thin plugin marketplace (4 single-skill plugins + orphaned agents/docs) into the **company-wide home for AI-assisted working**: a coherent, validated catalog of skills, thin agents, human methodology canon, and the binding templates that wire them into any project.

**Goals**

1. **Findability** — every consumer has exactly one obvious entry point for their need.
2. **Single source of truth** — each fact lives in exactly one place; everything else points to it.
3. **Clear boundaries** — knowledge lives in skills/docs; agents and CLAUDE.md *invoke* knowledge, never carry it.
4. **Self-consistency, enforced** — automated validation keeps the catalog, marketplace, README, and links in sync.
5. **The repo practises what it preaches** — its own structure honours cosmic-python principles.

**Non-goals (this EPIC):** authoring the full body content of every new skill to production depth; migrating consuming project repos; changing the content of frozen artifacts.

---

## 2. The organizing model (four artifact types)

Every artifact is exactly one of these, and that determines its home:

| Type | Audience | Loaded | Home | Rule |
|---|---|---|---|---|
| **Skill** | Agents | On-demand (progressive disclosure) | `skills/` | Holds reusable knowledge; one fact, one home |
| **Agent** | Harness | Isolated context | `agents/` | Wrapper only: role + model + tools + `skills:` + glue; **no knowledge** |
| **Doc** | Humans | Never auto-loaded | `docs/` | Human canon; narrates & points, never restates skill rules |
| **Binding** | Harness (every session) | Always | `prompts/` | Mandates & routes to skills; never carries the standard |

Authoring governance (`spec/`, `template/`) and distribution (`.claude-plugin/` + `scripts/`) sit alongside as supporting infrastructure.

> **On the Agent type:** this repo ships **three thin agent wrappers** (R9/D1) — `implementer`, `code-reviewer`, `epic-planner` — because skills cannot pin a model or enforce read-only tools, and the frozen `docs/ai-coding/` runbook references them. Wrappers carry **no knowledge** (role + model + tools + `skills:` + glue only); all knowledge lives in skills. External skills (stream-coding, superpowers, …) are referenced, not copied (R25).

---

## 3. Target repository structure

```
agent-skills/
├── README.md                     # front door + auto-generated skill/agent index
├── CONTRIBUTING.md               # aligned to actual practice
├── LICENSE
├── Makefile                      # validate / lint / index targets
├── .gitignore                    # now excludes .idea/
├── .claude-plugin/
│   └── marketplace.json          # 3 domain bundles
├── skills/                       # agent-facing knowledge (the catalog) — Meaningfy-owned only
│   ├── cosmic-python/
│   ├── architecture/
│   ├── meaningfy-git-workflow/        (new)
│   ├── clarity-gate/                  (promoted to real skill — not externally available)
│   ├── epic-planning/                 (new, from epic-planner)
│   ├── bdd-gherkin/                   (new, from gherkin-writer)
│   ├── meaningfy-code-review/         (new, from code-reviewer; renamed to avoid the external `code-review` collision)
│   ├── technical-writing/             (new, from documenter)
│   ├── semantic-consulting-coach/     (frozen — moved only)
│   └── executive-communication/       (frozen — moved only)
│   # NOTE: stream-coding + superpowers/commit-commands/gitnexus/code-review are EXTERNAL — see docs/environment-setup.md
├── agents/                       # THREE thin wrappers only (no knowledge) — see R9/D1
│   ├── implementer.md            (sonnet; loads cosmic-python + external stream-coding + superpowers TDD; gitnexus gate)
│   ├── code-reviewer.md          (opus; read-only; loads meaningfy-code-review + cosmic-python)
│   └── epic-planner.md           (opus; no Bash/commit; loads epic-planning + clarity-gate)
│   # dropped: gherkin-writer, documenter (skills suffice)
├── scripts/                      # projection: idempotent bootstrap to scaffold/refresh a consuming repo
│   └── init-meaningfy-project.sh
├── docs/
│   ├── ai-coding/                     (frozen — moved only; + new dod-quality-gates.md)
│   ├── engineering-standards/         (new human canon)
│   │   ├── coding-prompt.md           (relocated from MEANINGFY_PROMPT.md)
│   │   ├── project-structure.md
│   │   ├── architectural-guardrails.md
│   │   └── git-and-collaboration.md
│   └── philosophy/
│       └── art-of-coding-with-an-llm.md
├── prompts/                      # binding layer (templates)
│   ├── CLAUDE.md.template
│   ├── AGENTS.md.template
│   └── global-prompt.md
├── spec/                         # skill-authoring governance
│   ├── agent-skills-spec.md
│   └── CREATING_SKILLS.md
└── template/
    └── SKILL.md
```

---

## 4. Requirements

### 4.1 Skill catalog & bundles

- **R1** Marketplace exposes **3 domain bundles** (Meaningfy-owned skills only; external skills are referenced, not bundled):
  - `meaningfy-engineering` → `cosmic-python`, `architecture`, `meaningfy-git-workflow`
  - `meaningfy-ai-coding` → `clarity-gate`, `epic-planning`, `bdd-gherkin`, `meaningfy-code-review`, `technical-writing`
  - `meaningfy-consulting` → `semantic-consulting-coach`, `executive-communication`
- **R2** Every skill conforms to `spec/agent-skills-spec.md`: valid frontmatter, `name` == directory, SKILL.md ≤ ~500 lines, detail in `references/`.
- **R3** Each skill states its **boundary** (what it does NOT own) and **related skills**, so responsibilities don't overlap.
- **R4** `clarity-gate` becomes a **real Meaningfy-owned skill** (sourced from `phase-2-clarity-gate-checklist.md`) — it is not available externally. `stream-coding` is **external** (already installed): the repo points to it (R25) rather than vendoring it. The buried `stream-coding-methodology.md` and `phase-1-strategic-blueprint-checklist.md` are **removed** from `cosmic-python/references/` (the external `stream-coding` skill is their source of truth).

### 4.2 Skill boundaries (single source of truth)

- **R5** `cosmic-python` owns code structure (layers, SOLID, layer-tests, CI guardrails). It does **not** restate TDD (→ `superpowers:test-driven-development`), system design (→ `architecture`), or commit/PR rules (→ `meaningfy-git-workflow`). Canonical vocabulary fixed: `models/`+`services/`+root-modules; book's `/domain`+`/service_layer` documented as synonyms.
- **R6** `architecture` owns system design, the org-wide **ADR template**, and contracts (OpenAPI/AsyncAPI/LinkML). Cross-pointer to cosmic-python at the codegen seam (`make generate-models`).
- **R7** New `meaningfy-git-workflow` skill owns: conventional commits (imperative, no trailing punctuation), branch naming `<type>/<ticket-id>/<short-label>`, rebase/merge & force-push etiquette, `[WIP]`/draft handling, free-tier GitHub constraints (max 1 reviewer, no drafts), dev-environment hygiene (WSL filesystem, RDF auto-format). References `commit-commands` rather than restating git mechanics.
- **R8** Skills derived from agents pull knowledge from the agent bodies: `bdd-gherkin` (Gherkin conventions, Scenario Outline, test-data fabrication), `code-review` (the Meaningfy review checklist), `epic-planning` (EPIC.md template + planning procedure), `technical-writing` (doc types, lightweight clarity check, style).

### 4.3 Agents — thin-wrapper hybrid (supersedes the earlier full-drop; see [decision D1](EPIC-setup-review-decisions.md))

All agent **knowledge** moves to skills. Agent **files** survive only as zero-knowledge wrappers where they provide a capability a skill cannot (model pinning, read-only tools) or keep the *frozen* `docs/ai-coding/` runbook truthful.

- **R9** Keep **three thin wrappers** in `agents/`: `implementer` (model sonnet; loads `cosmic-python` + external `stream-coding` + `superpowers:test-driven-development`/`systematic-debugging`; gitnexus stop-on-HIGH-risk gate as glue), `code-reviewer` (model opus; `disallowedTools: Write/Edit`; loads `meaningfy-code-review` + `cosmic-python`), `epic-planner` (model opus; no Bash/commit; loads `epic-planning` + `clarity-gate`). Each contains **only** role + model + tools + `skills:` + orchestration glue — no engineering knowledge.
- **R10** Knowledge extraction into skills: `gherkin-writer` → `bdd-gherkin`; `code-reviewer` → `meaningfy-code-review`; `epic-planner` → `epic-planning`; `documenter` → `technical-writing`.
- **R11** **Drop** `gherkin-writer` and `documenter` agent files (their skills suffice; no model/tool guarantee worth a wrapper). Their references in the frozen runbook are mapped to the new skills in `docs/environment-setup.md` (the runbook predates the change; not edited — C1).
- **R12** The `implementer` orchestration residue lives in the **`implementer` wrapper as glue**, NOT in `CLAUDE.md.template` (which only *routes*). This keeps the binding layer free of carried knowledge.

### 4.4 Docs (human canon)

- **R13** `docs/engineering-standards/` is created as human canon: `coding-prompt.md` (relocated from `MEANINGFY_PROMPT.md`), `project-structure.md`, `architectural-guardrails.md` (the tooling matrix as an ADR using architecture's template), `git-and-collaboration.md`.
- **R14** `docs/philosophy/art-of-coding-with-an-llm.md` captures the peer-framing philosophy (LLM as a guided peer who explores and proposes, not a fast junior; human sovereignty; model-tiered framing).
- **R15** Docs **narrate and point** to skills; they do not restate layer rules, commit rules, or test rules.
- **R16** `docs/ai-coding/` is moved unchanged; the dangling `dod-quality-gates.md` reference is resolved by **authoring that missing file** (additive — frozen files are not edited).

### 4.5 Binding templates

- **R17** `prompts/` ships: `CLAUDE.md.template` (committed project binding — identity, memory conventions, routing to skills, the `implementer` orchestration residue from R11, pointers to docs), `AGENTS.md.template` (tool-neutral mirror — single source with CLAUDE.md, not a divergent copy), and `global-prompt.md` (slim ~30-line personal default: identity, peer principle, routing, non-negotiables — **not** the 500-line prompt).

### 4.8 External dependencies (O1)

- **R25** The repo **points to, does not vendor**, externally-installed skills/plugins. A single source — `docs/environment-setup.md` — lists them split into:
  - **Mandatory:** `superpowers` (test-driven-development, systematic-debugging, verification-before-completion, brainstorming), `stream-coding`.
  - **Optional/recommended:** `commit-commands`, `code-review`, `gitnexus-*`, `context7`.
  - For each: what it is, why Meaningfy uses it, and the exact install command. Meaningfy skills reference external skills **by name** (e.g. "follow `superpowers:test-driven-development`"), never by copying their content.

### 4.9 Projection / replication (O3)

- **R26** Two distribution channels, documented in `docs/environment-setup.md`:
  - **Skills** propagate via the **plugin marketplace** — install/update with `/plugin` (native, versioned).
  - **Templates + environment** propagate via an **idempotent bootstrap script** `scripts/init-meaningfy-project.sh`: run once to scaffold a consuming repo (writes `CLAUDE.md`/`AGENTS.md` from templates if absent, prints the plugin install commands, creates the `.claude/` memory layout); **re-run to refresh** templates when this repo changes (shows a diff, never clobbers local edits without confirmation). The "initial setup phase" and the "refresh" path are both documented so changes here are easy to push downstream.

### 4.6 Repo self-alignment & validation

- **R18** A `Makefile` provides `make validate` (and `make index`, `make lint`). CI calls the make targets.
- **R19** Validation enforces: `marketplace.json` ↔ `skills/` consistency (every shipped skill exists and vice-versa); SKILL.md frontmatter valid and `name`==dir; no broken internal links; README inventory matches the catalog (ideally generated).
- **R20** `README.md` is rewritten as the repository's front door, with these sections: **What this is** (company-wide home for skills, methodologies, standards, prompts); **Who it's for** (Meaningfy developers, leads, consultants); **What's inside** (skills catalog table across the 3 bundles + docs + prompts + scripts); **Getting started / install** (the 3 bundles + `scripts/init-meaningfy-project.sh` + link to `docs/environment-setup.md`); **How to use it** (mapping each consumer to its entry point); **Repository structure** (final tree); **Contributing** (link to CONTRIBUTING + spec/template); **Licensing** (Apache 2.0, per-skill `LICENSE.txt`); **Support/contact**. No mention of `agents/` (dropped).

### 4.7 Deletions & fixes

- **R21 (ignore, do NOT delete):** `.idea/` is added to `.gitignore`; if already tracked, untrack with `git rm --cached` (files stay on disk). **Never delete a gitignored folder from disk** — this is a standing rule for the whole reorg.
- **R22 (relocate+delete):** `MEANINGFY_PROMPT.md` relocated to `docs/engineering-standards/coding-prompt.md`; buried copy removed from `cosmic-python/references/`.
- **R23 (de-dup):** `stream-coding-methodology.md`, `phase-1-strategic-blueprint-checklist.md`, `phase-2-clarity-gate-checklist.md` moved out of `cosmic-python/references/` into the `stream-coding`/`clarity-gate` skills.
- **R24 (fix):** README `THIRD_PARTY_NOTICES.md` link (create file or remove link); CONTRIBUTING checklist re-aligned to real reference-file practice (drop mandated `REFERENCE.md`/`EXAMPLES.md`/`ADVANCED.md` names).

---

## 5. Constraints

- **C1** Do not edit content of frozen artifacts (`executive-communication`, `semantic-consulting-coach`, `docs/ai-coding/`) — relocation and additive new files only.
- **C2** Preserve git history where feasible (`git mv` for relocations).
- **C3** External skills (stream-coding, superpowers, commit-commands, gitnexus, code-review, context7) are referenced, never vendored (R25); the repo must not copy their content.
- **C4** Work proceeds only after the user revises and approves spec + plan.

---

## 6. Acceptance criteria

- **A1** `make validate` passes: marketplace ↔ catalog consistent, frontmatter valid, no broken internal links, README index in sync.
- **A2** The 3 bundles install cleanly; each skill is discoverable by description.
- **A3** Each canonical fact has a **single source of authority**; any derived copy is marked and points to it (gate **G-DUP**, single-authority matrix). Reframed per [D3] — not literal "never twice".
- **A4** `agents/` holds exactly the **three thin wrappers** (R9), each carrying no reusable knowledge (gate **G-THIN**, `orphan_agent_references`); `gherkin-writer`/`documenter` are gone.
- **A5** Frozen artifacts are byte-identical except for path; only additive new files were introduced (gate **G-FROZEN**).
- **A6** A new employee can, from README alone, find: how to install skills, how to learn the method, how to adopt standards in a repo, and how to contribute a skill (gate **G-BOOTSTRAP** step 6).
- **A7** **Trigger precision** — each new/changed skill fires on its intended probes and does not collide with its nearest external neighbour (gate **G-TRIG**, P1–P8; recorded in the PR body).
- **A8** **Capability preservation** — every guarantee the agents provided (read-only review, opus-for-review, sonnet-for-implement, gitnexus stop-on-HIGH-risk) is preserved by a surviving wrapper or explicitly documented as removed with a migration note.

> **Verification vs validation:** A1/A4/A5 are *verification* (built right); A2/A3/A6/A7/A8 are *validation* (right thing built). The full DoD, per-workstream checks, risks, and the G-* gate definitions live in [`EPIC-setup-quality-gates.md`](EPIC-setup-quality-gates.md). Adopted review decisions are in [`EPIC-setup-review-decisions.md`](EPIC-setup-review-decisions.md).

---

## 7. Open items — RESOLVED

- **O1 — resolved:** `stream-coding` and other currently-installed skills (superpowers, commit-commands, gitnexus, code-review, context7) are **external**. The repo points to them via `docs/environment-setup.md` with mandatory vs optional split (R25). Only `clarity-gate` (not available externally) is owned here.
- **O2 — resolved:** **Drop all agents.** `agents/` is removed; knowledge → skills; project orchestration residue → CLAUDE.md template + runbook (R9–R12).
- **O3 — resolved:** Keep the **3 templates**; projection handled by the marketplace (skills) + an idempotent bootstrap script (templates/env), with documented initial-setup and refresh paths (R26).
- **O4 — resolved:** Keep the repo name `agent-skills`.
```
