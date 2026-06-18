# EPIC-setup — Review Synthesis & Adopted Decisions

Source: four parallel adversarial reviews (repo layer, consuming-project layer, abstract/meta layer, DoD/quality engineering). This file records the self-criticism collected and the decisions adopted. It is an **authoritative addendum** to `EPIC-setup.md` and the four plan files; where it conflicts with them, this file wins and the spec/plan edits below are applied.

## D1 — Agents: full-drop → thin-wrapper hybrid (REVERSES O2)

**Decision:** Keep **three zero-knowledge thin agent wrappers** — `implementer`, `code-reviewer`, `epic-planner`. Drop only `gherkin-writer` and `documenter`.

**Why (evidence from review):**
- A skill **cannot pin a model or enforce read-only/tool restrictions** — it is injected knowledge. `code-reviewer` (opus + `disallowedTools: Write/Edit`) and `implementer` (sonnet + gitnexus stop-on-HIGH-risk gate) provide guarantees skills structurally can't.
- The **frozen** `docs/ai-coding/` runbook/methodology/setup reference these agents by name and file path. C1 forbids editing them. Fully dropping agents would make the primary onboarding doc instruct users to run artifacts that don't exist.
- The EPIC's own four-type model already defines a legitimate thin-wrapper Agent ("role + model + tools + `skills:` + glue; no knowledge"). Keeping wrappers does **not** violate "knowledge → skills" — all knowledge still moves to skills.

**Honoring the user's "drop if we can":** we drop where we can (`gherkin-writer`, `documenter` — no model/tool guarantee worth keeping; their skills suffice) and keep only where a capability or frozen-doc truth requires it. Reversible: 3 small files. The 2 dropped agents' runbook references are mapped to their skills in `docs/environment-setup.md`.

**Taxonomy-leak fix:** the implementer orchestration residue (gitnexus sequence, generate-verify-integrate loop, commit-on-consent) lives in the **`implementer` wrapper as glue**, NOT in `CLAUDE.md.template`. The binding only *routes*.

## D2 — Success metric: add validation, not just verification (L2)

`make validate` green is **verification** (catalog built to spec). For a prompt corpus the real quality is behavioural. **Adopted:** add **G-TRIG** (trigger-precision probe set, manual) and **G-BOOTSTRAP/E2E** (scratch-repo runbook walk) as acceptance gates; add acceptance criterion **A7 (trigger precision)** and **A8 (capability preservation)**. Skill descriptions for Meaningfy skills adjacent to external ones must be **noun/artifact-anchored** (see D5).

## D3 — SSOT reframed: single source of *authority* + marked derivations

"Each fact one home" is too absolute — the plan itself deliberately mirrors the gate table and the coding prompt. **Adopted:** principle becomes **single source of authority; any derived copy is marked and points to the authority**. The coding prompt is a *documented dual* (human canon in `docs/engineering-standards/coding-prompt.md`; operational in `cosmic-python`). A3/A4 get a **G-DUP** gate: automated *assist* (`duplicate_fact_candidates`, non-failing) + a manual sign-off matrix in the quality-gates doc.

## D4 — Validator: CLI + new checks + light layering

**Adopted:** `tools/repo_lint/lint.py` exposes a `main()` (prints findings, non-zero exit); `make validate` runs it AND pytest. New checks (with tests): `frontmatter_present_errors` (all skills incl. `architecture`), harden `name_mismatch` (try/except), `expected_bundle_membership` (constant `EXPECTED_BUNDLES` = the R1 map), `orphan_path_mentions`, `orphan_agent_references` (excludes `docs/ai-coding/`), `skill_too_long` (≤~500), `readme_inventory_gaps`, `templates_mirrored`, `duplicate_fact_candidates` (assist). Link-check glob includes `*.template`. Light cosmic-python shape: a thin read-layer (parse marketplace/files) vs. check-logic.

## D5 — Trigger disambiguation (consuming layer)

**Adopted:** `epic-planning` description anchors on "Work Shape → EPIC.md spec + clarity gate", explicitly NOT generic build/implement (defer those to external `stream-coding`). `meaningfy-code-review` anchors on "Meaningfy review **checklist/criteria** — architecture-conformance, SOLID, security, testing, spec-conformance", deferring the read-only review *run* to the external `code-review` command / the `code-reviewer` wrapper. Verified via G-TRIG probes (P1–P8 in quality-gates doc).

## D6 — Remove the green-washing guard (reflexive integrity)

**Adopted:** author `docs/ai-coding/dod-quality-gates.md` **in Workstream 1** (additive, frozen-safe) so the only dangling link resolves from the start. The temporary `if md.parent.name == "ai-coding": continue` guard is **deleted from the plan entirely** — `make validate` is never green over a known-broken link.

## D7 — Atomic move+repoint; .idea verify-only; THIRD_PARTY_NOTICES created

**Adopted:** every `git mv`/`git rm` of a referenced file repoints its referrers **in the same step** before validating (kills WS2 / WS4.1 dangling windows). WS1 Task 1.2 becomes **verify-only** (`.idea/` is already ignored + untracked; never delete). **Create** `THIRD_PARTY_NOTICES.md` (apt now that we reference external skills) — kills the three stale references at once. Realign CONTRIBUTING's README-table example and bundle guidance to the 3 fixed bundles.

## D8 — Coverage gaps: R6 + architecture R3

**Adopted:** one new task gives `skills/architecture/SKILL.md` its top-of-file frontmatter (D4), an R3 **Boundary + Related** section, and the R6 ADR-template/codegen cross-pointer to cosmic-python.

## D9 — Generalization (meta layer)

**Adopted (lightweight):** promote the four-type model + placement rules into a portable `spec/skill-repo-governance.md` so the meta-method outlives this EPIC; note in it that `tools/repo_lint` is the reusable guardrail. Full packaging of the validator as an installable tool is **out of scope** (recorded as future work).

## D10 — External-dependency blind spot

**Adopted:** `docs/environment-setup.md` lists load-bearing external skills with install commands and an explicit note that **the validator cannot detect external-skill drift** (rename/removal) — mitigation is the documented mandatory set + periodic manual check.

---

## Spec/plan deltas (applied)

- `EPIC-setup.md`: R9–R12 rewritten to the thin-wrapper hybrid (D1); add A7/A8 (D2); SSOT note on §2/A3 (D3); R6 + architecture R3 task (D8). Open-items already RESOLVED.
- `EPIC-setup-plan.md`: fix "R1–R26"; "skills + 3 thin wrappers"; point to this file and the quality-gates charter as authoritative.
- WS1: verify-only `.idea`; add architecture-frontmatter+R3+R6 task; validator gains all D4 checks + CLI; author `dod-quality-gates.md` here (D6); create `THIRD_PARTY_NOTICES.md`; realign CONTRIBUTING (D7).
- WS2: atomic move+repoint (D7); de-dup buried stream-coding files.
- WS3: extract 4 skills; keep 3 thin wrappers (D1); drop 2 agents; residue → implementer wrapper (D1).
- WS4: remove guard-lift (moot, D6); environment-setup with external-drift note (D10); templates_mirrored + version stamp; bootstrap idempotence; full README; spec governance doc (D9).

The concrete DoD, per-workstream checks, risks, and the G-* gate index live in **`EPIC-setup-quality-gates.md`**.
