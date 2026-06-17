# PLAN-02: The Spine — OpenSpec `meaningfy` Schema + Golden Thread

> Derived from [EPIC-02](EPIC-02-spine-openspec.md). Clarity-gate before execution. This is the
> keystone — resist gold-plating before the dogfood gate (EPIC-00 §6).

## Approach (sequence)

**(T1) install + pin OpenSpec → (T2) fork the `meaningfy` schema → (T3) author EPIC/PLAN templates +
rules → (T4) workflows/profiles doc → (T5) golden-thread spec → (T6) seeds + EPIC↔change + memory
mapping → (T7) lessons-loop → (T8) reference example change → (T9) spine bundle + validate.**
T2 depends on T1; T3 on T2; T8 exercises T2–T7 end-to-end; T9 last.

## Task breakdown

### T1 — Install & pin OpenSpec; confirm the schema subcommands *(EPIC C1, RISK-3)*
- **Deps:** none. **Files:** `spine/openspec-version.txt` (the pinned version string).
- **Steps:** install `@fission-ai/openspec` (record exact version in `spine/openspec-version.txt`);
  add it to the **mandatory** dependency list (row owned with EPIC-04 `environment-setup.md`); add a
  CI check that the installed version matches the pin. **Precondition for T2:** run
  `openspec schema --help` and confirm the `fork` and `validate` subcommands exist in the pinned
  version — if the names differ, stop and update T2–T9 to the real command names before proceeding.
- **Acceptance:** version recorded in `spine/openspec-version.txt`; `openspec --version` matches;
  `openspec schema --help` lists `fork` + `validate`.

### T2 — Fork the `meaningfy` schema *(EPIC R1)*
- **Deps:** T1. **Files:** `spine/openspec-meaningfy-schema/{schema.yaml,templates/}`.
- **Steps:** `openspec schema fork spec-driven meaningfy`; relocate the output under
  `spine/openspec-meaningfy-schema/`; commit `schema.yaml` + `templates/`.
- **Acceptance:** `openspec schema validate meaningfy` passes.

### T3 — Author the artifact pipeline + templates + rules *(EPIC R2, R3)*
- **Deps:** T2. **Files:** `schema.yaml`, `templates/{EPIC.md,PLAN.md,spec.md}`, `config.yaml`.
- **Steps:** define artifacts: `EPIC.md` (`requires: []`, Shape-Up vocabulary — appetite/problem/
  solution/decisions/rabbit-holes/no-gos), `PLAN.md` (`requires: [EPIC]`, algorithm/examples/
  anti-patterns/test-specs/error-matrix/task-breakdown/roadmap), spec deltas (RFC-2119 `SHALL` +
  Given/When/Then). Set `apply.requires: [PLAN]`, `apply.tracks: PLAN.md`. Encode per-artifact
  `rules:` (EPIC: appetite+no-gos mandatory; specs: GWT+SHALL; PLAN: cite parent EPIC ID).
- **Acceptance:** schema emits EPIC+PLAN+deltas with the `requires:` DAG; `schema validate` green.

### T4 — Meaningfy workflows / profiles *(EPIC R5–R7)*
- **Deps:** T3. **Files:** `spine/workflows.md`.
- **Steps:** document the named `/opsx` sequences (build-tier `propose→derive PLAN→clarity-gate→
  apply→verify→sync→archive`; exploratory `explore→new→continue→apply`; brownfield delta change);
  **pin the canonical `/opsx` verb roster** at the top of the doc (every other doc references it);
  set the **expanded** profile (`openspec config profile expanded`) per EPIC-02 R6; map each `/opsx`
  command → the driving Meaningfy skill / superpowers discipline.
- **Acceptance:** `workflows.md` contains the pinned verb roster, the sequences, `profile expanded`,
  and the command→skill map.

### T5 — Golden-thread spec *(EPIC R8, R9)*
- **Deps:** none (independent). **Files:** `spine/golden-thread.md`.
- **Steps:** define the ID scheme `requirement → ADR → model-entity → epic → change → task → test →
  commit` + the cite-your-parent rule; specify which checks are per-artifact `rules` (T3) vs
  validator checks (stubbed here, enabled in EPIC-04 R7).
- **Acceptance:** the ID convention + cite-your-parent rule are documented and referenced from T3.

### T6 — Seeds, EPIC↔change & memory mapping *(EPIC R10–R12)*
- **Deps:** T3. **Files:** `spine/epic-change-memory-mapping.md`.
- **Steps:** document the seed convention (`changes/<id>/inputs/`, never deleted/groomed); the
  explicit EPIC≡`proposal.md` / PLAN≡`tasks.md` mapping (so nothing is authored twice); and the
  `.claude/memory/epics/` → `openspec/changes` + `specs/` migration (MEMORY.md = regenerable index,
  ≤200 lines). Mechanics of projecting this are EPIC-09; here it is the *definition*.
- **Acceptance:** mapping + seed + memory-index conventions documented.

### T7 — Lessons-learned loop *(EPIC R14)*
- **Deps:** none. **Files:** `spine/lessons-loop.md`.
- **Steps:** define retro → "what we'd encode differently" note → PR against the relevant skill →
  gated by `make validate`.
- **Acceptance:** `lessons-loop.md` describes the procedure end-to-end.

### T8 — Reference example change *(EPIC A2)*
- **Deps:** T3–T6. **Files:** `changes/example-spine-roundtrip/` (the concrete sample id referenced
  downstream as "the PLAN-02 sample").
- **Steps:** create a minimal worked change demonstrating EPIC→PLAN→spec-delta→archive→`specs/`
  merge; use it as the canonical sample and the dogfood seed.
- **Acceptance:** `openspec validate changes/example-spine-roundtrip` passes and the archive step
  merges its delta into `specs/`.

### T9 — Define the spine bundle + final validate *(EPIC R13, R15)*
- **Deps:** T2–T8. **Files:** `spine/` (bundle-contents note), CI config. **Does NOT edit**
  `.claude-plugin/marketplace.json` — PLAN-04 T3 is the sole editor (it folds the spine bundle into
  the single re-cut).
- **Steps:** define the `meaningfy-spine` meta-bundle's contents (schema + golden-thread +
  lessons-loop refs) for PLAN-04 T3 to consume; wire `openspec validate --strict` + `openspec schema
  validate` into **skillery's own CI**; document the clarity-gate(semantic) + `validate
  --strict`(structural) gate composition per EPIC-02 R13.
- **Acceptance:** spine bundle defined; both validators green.

## Anti-patterns
- ❌ Gold-plating the schema before the dogfood gate teaches what artifacts must carry.
- ❌ Duplicating planning: `PLAN.md` is `tasks.md`'s role — do not also keep `superpowers:writing-plans`
  output inside a spine repo (RISK-4).
- ❌ Re-introducing EARS (DEC-8) — use native `SHALL` + Given/When/Then.
- ❌ Putting `validate`/`archive` (deterministic) inside the LLM-generation path.

## Verification
- `openspec schema validate meaningfy` + `make validate` green.
- The T8 sample change round-trips (propose → apply → archive → `specs/` updated).
- `workflows.md` command→skill map has no behaviour owned twice (cross-check with EPIC-05 table).

## Roadmap
- [ ] T1 install+pin · [ ] T2 fork schema · [ ] T3 templates+rules · [ ] T4 workflows · [ ] T5 golden thread
- [ ] T6 seeds/mapping/memory · [ ] T7 lessons loop · [ ] T8 example change · [ ] T9 bundle+validate

## Clarity-gate self-check
Grounded in the verified OpenSpec mechanics (schema fork, artifact DAG, validate). Open risk
(custom-schema maintenance) is explicit with a documented fallback (lift conventions by hand). The
dogfood-gate dependency is stated so T-extraction work doesn't front-run validation.
