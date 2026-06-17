# EPIC-09: `project-setup` Rework — Projection with the Spine Pre-Wired

> Part of the Skillery v2 series. See [EPIC-00](EPIC-00-master-index.md). **Tier:** projection (last).
> **Depends on:** EPIC-01 (CLAUDE-canonical, init-script deletion), EPIC-02 (spine/schema/workflows),
> EPIC-04 (bundles), EPIC-06 (conceptual-modelling, conditional), EPIC-10 (CD/release workflow
> templates it scaffolds, conditional).

## 1. Purpose & goals (the shaped bet)

**Appetite:** medium. Make `project-setup` *project* the whole operating system into a client/product
repo with the spine pre-wired — so a new repo is born with an unbroken golden thread from requirement
to commit. Do this **last**, after the schema's shape has stabilised on the dogfood engagement.

**Problem.** `project-setup` scaffolds the Meaningfy-standard repo but knows nothing about the spine,
OpenSpec, the CLAUDE-canonical agentic file, or the conditional conceptual model. And the deleted init script
(EPIC-01, DEC-5) leaves a gap that this skill must fully absorb.

**Solution outline (Research B §7.2).** Extend `project-setup` to scaffold `openspec/` (with the
pinned `meaningfy` schema + `/opsx` + per-artifact rules), a conditional `model/`, CLAUDE-canonical
agentic files (+ optional AGENTS symlink), the split-by-churn doc layout, and the CI gates — folding
in the init script's minimal-bootstrap capability.

**Non-goals.** The schema/workflows themselves (EPIC-02); the new skills' content (EPIC-06/07/08);
changing the engineering layout that already works (cosmic-python layers, root tool configs, Antora).

---

## 2. Requirements

### 2.1 Absorb the init script (DEC-5)

- **R1** `project-setup` fully absorbs the deleted `scripts/init-meaningfy-project.sh` capability
  (the baseline to preserve — DEC-5): a **`--minimal` mode** writes only the agentic files + `.claude/`
  layout + prints install commands, so no capability is lost. `project-setup` uses a single
  scaffolder (`scripts/scaffold.sh`); there is no second bootstrap path.

### 2.2 Scaffold the spine (Research B §7.2)

- **R2** Scaffold `openspec/` into the target repo: `project.md` (≡ the constitution for that repo —
  one-constitution chain from EPIC-01 R9), `config.yaml` (schema: `meaningfy`; injected context;
  per-artifact rules incl. clarity-gate + Given/When/Then), `schemas/meaningfy/` (copied/**pinned**
  from `skillery/spine` — RISK-3), `specs/` (durable), `changes/` (+ `archive/`, with the
  `inputs/` seed convention from EPIC-02 R11).
- **R3** Install the OpenSpec **`/opsx:*`** commands/skills and set the chosen **profile** (EPIC-02
  R6) in the scaffolded repo.
- **R4** Pre-wire the **golden thread** (EPIC-02 R8) — the ID convention doc + the cite-your-parent
  rule — into the scaffolded `openspec/` and the repo `CLAUDE.md` (DEC-4 — the canonical agentic file).

### 2.3 Conditional conceptual model (DEC-10 / EPIC-06)

- **R5** For **product-development** projects, scaffold `model/` (LinkML default) + the
  `make generate-models` bridge + the generation targets the project needs. For doc-only/non-product
  repos, **skip** the model layer (and skip importlinter/coverage gates that assume Python code as
  appropriate). The interview asks the project type and branches.

### 2.4 Canonical `CLAUDE.md` & docs (DEC-4 / DEC-3 / DEC-12)

- **R6** Scaffold the **canonical `CLAUDE.md`** (+ optional `AGENTS.md` → `CLAUDE.md` symlink),
  **inverting** `project-setup`'s prior "`AGENTS.md` canonical + `CLAUDE.md` symlink" choice to
  CLAUDE-canonical (DEC-4 / EPIC-01 R4). Scaffold the **global vs repo `CLAUDE.md` split** (DEC-12 /
  EPIC-01 R11): the repo `./CLAUDE.md` is the repo operating manual and **routes to** the global
  `~/.claude/CLAUDE.md` standard, never restating it.
- **R7** Scaffold the **split-by-churn** doc layout (DEC-3): Markdown for the agent loop + `.claude/`
  (memory as a regenerable index, MEMORY.md ≤200 lines); AsciiDoc/Antora for the durable canon
  (architecture, ADRs, requirements, user docs).

### 2.5 CI gates

- **R8** Scaffold CI that runs the **CI-automatable** gates as `make` targets: `openspec validate
  --strict` (structural), `make generate-models` + a codegen-in-sync check (product repos),
  `make check-architecture` (importlinter), coverage ≥80%, and the code-review step. **`clarity-gate`
  is NOT a CI step** — it is the human/agent semantic gate per EPIC-05 R11 (the automation boundary is
  pinned there); CI may emit a reminder that it must have passed, but does not score it. Mirror
  EPIC-05's gate set; add engagement-gate hooks (EPIC-08) where relevant.

### 2.6 CD/release scaffolding seam (EPIC-10)

- **R10** For a **deployable** project (the interview asks — same branch as R5), scaffold the
  **CD/release workflow templates provided by the `ci-cd-delivery` skill** (EPIC-10): the
  release+image-build-push job, the reusable deploy-trigger to `infrastructure-stacks`, and the
  secrets/`.env` convention. A **library or doc-only** repo gets **no** deploy/release workflow. The
  templates live with `ci-cd-delivery`; `project-setup` only renders them — it does not define CD
  logic (single-owner; EPIC-05 map).

### 2.7 Brownfield

- **R9** Preserve `project-setup`'s brownfield mode: gap-check an existing repo against the new
  standard (spine, CLAUDE-canonical, doc layout) and fill gaps in safe slices, never big-bang — land as a
  shaped EPIC + PLAN for large repos (dogfooding the spine).

---

## 3. Constraints

- **C1** Pin the `meaningfy` schema version copied into a project (RISK-3); document the refresh path
  (re-run `project-setup` to pick up a newer pinned schema; show a diff, never clobber).
- **C2** Templates remain **self-contained** (the skill works with or without the skillery installed,
  per its current design).
- **C3** Honour the one-constitution chain (EPIC-01 R9): `openspec/project.md` points to the canon,
  does not fork it.
- **C4** `make validate` (in skillery) passes; a scaffolded sample repo passes its own gates.

---

## 4. Acceptance criteria

- **A1** `project-setup` absorbs the init-script capability as a mode; no capability lost (R1).
- **A2** A scaffolded repo has a working `openspec/` (pinned `meaningfy` schema, `/opsx`, config
  rules, specs/changes/archive with `inputs/`) and the golden thread pre-wired (R2–R4).
- **A3** Product repos get a conditional `model/` + codegen bridge; non-product repos correctly skip
  it (R5).
- **A4** Scaffolded repos are CLAUDE.md-canonical (+ optional AGENTS symlink) with the global/repo
  `CLAUDE.md` split (DEC-12) and the split-by-churn doc layout (R6–R7).
- **A5** Scaffolded CI runs the full gate set; brownfield gap-check works (R8–R9). A reference
  scaffolded repo passes end-to-end (ideally the dogfood repo).

---

## 5. Added / changed / deleted

| Action | Artifact |
|---|---|
| **Changed** | `skills/engineering/project-setup/` (SKILL.md + references + scaffolder): spine wiring, CLAUDE-canonical (+ optional AGENTS symlink), global/repo CLAUDE split, conditional model, CI gates, minimal-bootstrap mode |
| **Added** | scaffolded-repo templates for `openspec/`, conditional `model/`, split-by-churn docs, CI gate targets |
| **Deleted** | the "`AGENTS.md`-canonical + `CLAUDE.md`-symlink" scaffolding choice (→ CLAUDE-canonical + optional AGENTS symlink); any residual reference to the deleted init script |

**R-DOCS (cross-cutting):** this EPIC **owns** the `project-setup` ripple row and the setup-guide
scaffold mechanics; coordinate the setup-guide *description* with EPIC-05.
