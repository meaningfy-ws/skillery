# EPIC: dual-CLI docs refactor — make install the front door, single-source the authoring rule

## Appetite

Small. Pure documentation grooming under an *existing* capability
(`dual-cli-distribution` → "Per-CLI documentation split"). No new capability, no code, no spec
delta. Ceiling: churning links/moving files for their own sake — forbidden by the low-impact mandate.

## Why

`docs/dual-cli/` grew during the v2.7.0 build as a flat seven-file folder that reads like a parallel
documentation silo rather than part of the install flow:

- The **install canon** ([`docs/environment-setup.md`](../../../docs/environment-setup.md)) is still
  Claude-only — its §1 is `/plugin install …` with no opencode path — so a reader installing on
  opencode never lands there; they must find `docs/dual-cli/setup-opencode.md` on their own.
- The **"works on both CLIs" authoring rule** is scattered: a single bullet in `AGENTS.md`
  (regenerate the tree), the contract in `docs/dual-cli/mapping.md`, the audit allow-list in
  `repo_lint`. There is no one place a contributor reads before adding a skill/agent/command/spec.
- `docs/dual-cli/README.md` presents itself as *the* dual-CLI hub (including install), competing with
  the real install canon instead of being the **reference annex** it actually is.

## Solution outline

Re-seat the content, don't relocate files (keeps the blast radius tiny — only 4 inbound link sites
touch the setup pages):

1. **Install canon becomes dual-CLI.** `environment-setup.md` §1 gains a "choose your CLI" fork — the
   Claude `/plugin` path and the opencode path — each linking its per-CLI runbook for full detail.
   The per-CLI pages (`setup-claude.md`, `setup-opencode.md`) stay as the focused detail, now clearly
   subordinate to the canon.
2. **Reference annex reframed.** `docs/dual-cli/README.md` states up front that **install starts at
   `environment-setup.md`**; the annex holds only the *reference* set (mapping, compatibility,
   mcp-setup, body-agnosticism audit) + the per-CLI runbooks.
3. **Single-sourced authoring rule.** Promote the scattered guidance into one **"Dual-CLI authoring
   rules"** subsection in `AGENTS.md` (the canonical binding): any skill / agent / command / spec
   added or updated must work on both CLIs — regenerate `.opencode/`, keep bodies CLI-agnostic,
   register commands per-CLI; `make validate` enforces it. `CREATING_SKILLS.md` and
   `environment-setup.md` *point* to it (no restatement). `CLAUDE.md` already says "read AGENTS.md
   first", so it inherits the rule — nothing to duplicate there (single-source-of-authority).

## Key decisions

- **DEC-1**: **Re-seat, don't move.** Files stay; entry points and framing change. Rationale: moving
  `setup-*.md` would repoint 4 link sites and the openspec-spec narrative for no reader benefit.
- **DEC-2**: **One home for the authoring rule** — `AGENTS.md` (canonical). Everyone else links it.
  Rationale: the repo's single-source-of-authority rule; `CLAUDE.md` inherits via its pointer.
- **DEC-3**: **Two bindings stay distinct.** Skillery's *own* repo binding is AGENTS-canonical
  (v2.7.0); the binding `project-setup` *scaffolds into other repos* is still CLAUDE-canonical. This
  refactor does **not** touch the scaffolding convention — that is a separate, larger question parked
  in memory.

## Rabbit-holes

- Don't physically relocate `docs/dual-cli/*` into `docs/` root or into `environment-setup.md` body.
- Don't "fix" the CLAUDE-canonical language in `project-setup`/`prompts`/`environment-setup §3-4` —
  that describes the *scaffolding* convention, not skillery's own binding (DEC-3).
- Don't add a CLAUDE.md copy of the authoring rule (DEC-2).

## No-gos

- No **new capability**. A single ADDED requirement to the existing `dual-cli-distribution`
  capability records the durable invariant the refactor establishes (one canonical home for the
  authoring rule; install-canon-vs-annex hierarchy) — that is the spec delta, nothing more.
- No code changes; no `.opencode/` regeneration (no source touched).
- No file deletions.

## Critique — how the improvements must be applied

A self-review of the plan before implementing, so the edits land well:

- **Risk: environment-setup.md sprawl.** It is already a dense multi-concern doc. *Mitigation:* §1
  gains only a short fork (commands + links), not the full per-CLI runbooks inline. Net growth ≈ 12
  lines.
- **Risk: two competing "install here" entry points** (README, environment-setup, dual-cli/README).
  *Mitigation:* establish a strict hierarchy — README (front door) → environment-setup.md (canon) →
  per-CLI runbook (detail); dual-cli/README is explicitly *reference only*. Every touched file states
  its place in that hierarchy in one line.
- **Risk: the AGENTS.md rule drifts from the gates it describes.** *Mitigation:* phrase it as
  pointers to the enforcing mechanism (`make generate-opencode`, `make validate`) and the contract
  (`mapping.md`), not a re-derivation — so it cannot rot independently.
- **Risk: scope creep into project-setup / the scaffolding binding.** *Mitigation:* DEC-3 fences it
  out explicitly; candidate follow-ups recorded in memory, not implemented here.
- **Verification:** `make validate` (repo_lint link/consistency gate + tests) must stay green; the
  body-agnosticism allow-list must not need to grow (no new CLI-ism in any skill body).

## What Changes

- `docs/environment-setup.md` — §1 becomes a dual-CLI install fork; header points to the per-CLI
  pages and the reference annex.
- `docs/dual-cli/README.md` — reframed as the reference annex; names `environment-setup.md` as the
  install entry.
- `AGENTS.md` — new "Dual-CLI authoring rules" subsection (consolidates the lone regenerate bullet).
- `spec/CREATING_SKILLS.md` — one "Dual-CLI obligation" note pointing to the AGENTS.md rule.
- `README.md` — dual-cli docs row reframed as "reference annex"; authoring rule surfaced.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities
- `dual-cli-distribution`: **+1 ADDED requirement** — *Single-home dual-CLI authoring rule* (one
  canonical home for the "works on both CLIs" rule; install-canon-vs-annex hierarchy). No existing
  requirement changes.

## Impact

- **Depends on**: `dual-cli-distribution` (the per-CLI doc-split requirement), `dual-cli-generation`
  (the `make generate-opencode` target the authoring rule cites).
- **Docs**: 5 files re-seated/edited; 0 moved, 0 deleted.
- **Spec**: 1 ADDED requirement (delta) on `dual-cli-distribution`.
- **Code/CI**: none.
