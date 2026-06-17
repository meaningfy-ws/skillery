# PLAN-09: `project-setup` Rework — Projection with the Spine Pre-Wired

> Derived from [EPIC-09](EPIC-09-project-setup-projection.md). Clarity-gate before execution.
> **Deps:** PLAN-01 (CLAUDE-canonical, init-script deletion), PLAN-02 (spine/schema/workflows),
> PLAN-04 (bundles), PLAN-06 (conceptual-modelling). **Do last** — after the schema stabilises on
> the dogfood engagement.

## Approach (sequence)

**(T1) absorb the init script as a minimal mode → (T2) scaffold `openspec/` + pinned schema →
(T3) install `/opsx` + profile → (T4) pre-wire golden thread → (T5) conditional `model/` →
(T6) CLAUDE-canonical + global/repo split → (T7) split-by-churn docs → (T8) CI gates →
(T9) brownfield gap-check → (T10) reference scaffold + validate.**

## Task breakdown

> **Files convention:** all tasks edit the **`project-setup` skill** —
> `skills/engineering/project-setup/` (`SKILL.md`, `references/`, `scripts/scaffold.sh`) and the
> **scaffold templates** it writes. Tasks T2–T9 describe what `project-setup` *scaffolds into a target
> repo*, not files edited in skillery; so their "scaffolds:" lines name target-repo paths, and the
> skillery file touched is always the `project-setup` skill + its templates.

### T1 — Absorb the init script (minimal-bootstrap mode) *(EPIC R1, DEC-5)*
- **Deps:** PLAN-01 T5. **Files:** `skills/engineering/project-setup/` + `scripts/scaffold.sh` (the
  single scaffolder).
- **Steps:** add a `--minimal` mode that writes only the agentic files + `.claude/` layout + prints
  install commands — the capability baseline is the deleted `scripts/init-meaningfy-project.sh`
  (DEC-5). One scaffolder only.
- **Acceptance:** the `--minimal` mode reproduces every capability the deleted init script had.

### T2 — Scaffold `openspec/` + pinned `meaningfy` schema *(EPIC R2)*
- **Deps:** PLAN-02. **Steps:** scaffold `openspec/` with `project.md` (≡ repo constitution, chained
  to the global per EPIC-01 R9), `config.yaml` (schema: `meaningfy`; context; per-artifact rules incl.
  clarity-gate + GWT), `schemas/meaningfy/` (**pinned** copy from `skillery/spine` — RISK-3), `specs/`,
  `changes/` (+ `archive/`, with `inputs/` seed convention).
- **Acceptance:** a scaffolded repo has a valid `openspec/` that `openspec validate` accepts.

### T3 — Install `/opsx` commands + profile *(EPIC R3)*
- **Deps:** T2. **Steps:** install OpenSpec `/opsx:*` into the target `.claude/`; set the chosen
  profile (PLAN-02 T4).
- **Acceptance:** `/opsx` commands present; profile set.

### T4 — Pre-wire the golden thread *(EPIC R4)*
- **Deps:** T2, PLAN-02 T5. **Steps:** include the golden-thread ID doc + cite-your-parent rule in
  the scaffolded `openspec/` and the repo `CLAUDE.md`.
- **Acceptance:** golden-thread convention present in a fresh repo.

### T5 — Conditional `model/` *(EPIC R5, DEC-10)*
- **Deps:** PLAN-06. **Steps:** interview asks project type; for **product-dev** repos scaffold
  `model/` (LinkML default) + `make generate-models` + needed targets; for doc/non-product repos
  **skip** the model layer (and skip importlinter/coverage gates that assume Python where
  appropriate).
- **Acceptance:** product repo gets `model/`+codegen; non-product repo correctly omits it.

### T6 — CLAUDE-canonical + global/repo split *(EPIC R6, DEC-4, DEC-12)*
- **Deps:** PLAN-01. **Steps:** scaffold canonical `CLAUDE.md` (+ optional `AGENTS.md → CLAUDE.md`
  symlink), **inverting** the prior AGENTS-canonical choice; the repo `./CLAUDE.md` routes to the
  global `~/.claude/CLAUDE.md` standard (complements, never restates).
- **Acceptance:** scaffold is CLAUDE-canonical; global/repo split present.

### T7 — Split-by-churn docs *(EPIC R7, DEC-3)*
- **Deps:** none. **Steps:** scaffold Markdown for the agent loop + `.claude/` (memory as a
  regenerable index, MEMORY.md ≤200 lines); AsciiDoc/Antora for the durable canon (architecture,
  ADRs, requirements, user docs).
- **Acceptance:** the two doc homes are scaffolded per DEC-3.

### T8 — CI gates *(EPIC R8)*
- **Deps:** T2, T5. **Steps:** scaffold CI as `make` targets: `openspec validate --strict`,
  `make generate-models` + codegen-in-sync check (product repos), `make check-architecture`
  (importlinter), coverage ≥80%, code-review step; mirror PLAN-05 T7; add engagement-gate hooks where
  relevant (EPIC-08). **`clarity-gate` is not a CI step** (human/agent gate per EPIC-05 R11) — CI may
  only remind it must have passed.
- **Acceptance:** scaffolded CI runs the CI-automatable gate set; clarity-gate is not scored in CI.

### T8b — CD/release scaffolding seam *(EPIC R10, EPIC-10)*
- **Deps:** T2; PLAN-10 (templates). **Steps:** for a **deployable** project (interview branch),
  render the `ci-cd-delivery` skill's CD/release templates (release+image-push, the reusable
  deploy-trigger to `infrastructure-stacks`, secrets/`.env` convention); a library/doc-only repo gets
  none. `project-setup` only renders — CD logic stays owned by `ci-cd-delivery`.
- **Acceptance:** deployable repo gets the CD/release workflows; non-deployable repo omits them; no CD
  logic is defined in `project-setup`.

### T9 — Brownfield gap-check *(EPIC R9)*
- **Deps:** T2–T8. **Steps:** preserve/extend the gap-check to assess an existing repo against the
  new standard (spine, CLAUDE-canonical, doc layout) and fill gaps in safe slices (never big-bang;
  large repos land as a shaped EPIC+PLAN — dogfooding the spine).
- **Acceptance:** gap-check reports + fills only missing pieces, never clobbers.

### T10 — Reference scaffold + validate *(EPIC C4, A5)*
- **Deps:** T1–T9 (incl. T8b). **Steps:** scaffold a reference repo (ideally the dogfood repo) end-to-end and run
  its own gates; run skillery `make validate`.
- **Acceptance:** the reference repo passes its gates; skillery `make validate` green.

## Anti-patterns
- ❌ Running this before the schema stabilises on the dogfood engagement.
- ❌ Scaffolding `model/` or importlinter/coverage gates into a doc-only repo.
- ❌ Repo `./CLAUDE.md` restating the global standard instead of routing to it.
- ❌ Clobbering existing files in brownfield mode.
- ❌ Un-pinned schema copy (drift — RISK-3).

## Verification
- A fresh **product** scaffold validates end-to-end (`openspec validate`, `make generate-models`,
  importlinter, coverage, clarity-gate); a fresh **doc-only** scaffold omits the model/code gates;
  brownfield `--dry-run` reports gaps without writing; skillery `make validate` green.

## Roadmap
- [ ] T1 minimal mode · [ ] T2 openspec scaffold · [ ] T3 /opsx+profile · [ ] T4 golden thread · [ ] T5 conditional model
- [ ] T6 CLAUDE-canonical+split · [ ] T7 split-by-churn docs · [ ] T8 CI gates · [ ] T8b CD/release seam
- [ ] T9 brownfield · [ ] T10 reference+validate

## Clarity-gate self-check
Every task names files/acceptance; conditional model and CLAUDE-canonical inversion are explicit; the
schema pin (RISK-3) and the do-last/dogfood dependency are stated. The product-vs-doc branching is
concrete (what is scaffolded vs skipped), avoiding the "scaffold everything" failure mode.
