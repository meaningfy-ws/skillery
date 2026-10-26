# EPIC: Single-source distribution — one set of sources, two CLIs, no copies

> **Golden thread.** Parent: [`inputs/2026-10-25-session-findings.md`](inputs/2026-10-25-session-findings.md),
> the verbatim findings of the 2026-10-25 skillery analysis session (Claude Cowork + Eugeniu Costetchi).
> It supersedes nothing: it corrects the *implementation* of the existing living specs
> [`dual-cli-distribution`](../../specs/dual-cli-distribution/spec.md) and
> [`dual-cli-generation`](../../specs/dual-cli-generation/spec.md), whose intent (one source, two CLIs,
> verified parity) stands.
> **Sibling EPICs shaped in the same round, cited never restated:** `agent-authoring-standard` (depends on
> DEC-3 here for the bundle rule), `add-devops-bundle`, `fix-accumulated-skill-defects`, `add-sales-bundle`.
> **Order:** this EPIC ships first; every sibling installs through the layout it defines.

## Appetite

**Medium.** One release (major, 3.0.0, with a migration note — DEC-6 / R7), one generator rewrite, one new manifest, one
binding edit. If it grows a second generated tree or a new CLI-specific source format, the bet was
mis-shaped.

## Why

The catalogue promises "one set of sources, no duplication" and does not deliver it on either CLI.

- **opencode:** `.opencode/skills/` is a committed, byte-identical copy of `skills/` — 208 of 208
  files, 1.8 MB — kept equal by a drift gate, a `make generate-opencode` step and a commit chore
  that exist only to protect the copy. The only genuinely different artefacts in `.opencode/` are
  three agent files, `bundles.json` and two reports.
- **Claude Code:** every bundle in `marketplace.json` declares `source: "./"` with no plugin
  manifest, so each plugin's root is the whole repo and the loader auto-discovers all of `skills/`
  and `agents/` on top of the listed ones. A machine with the five bundles installed carries five
  copies of every skill description in context (`meaningfy-core:architecture`,
  `vault-assistant:cosmic-python`, `code-reviewer` five times) — observed in the session, not inferred.

Why now: three new bundles (devops, sales, and the agent standard's re-homing of agents) are about to
land. Each one built on today's layout multiplies the duplication and locks in the chore.

## Solution outline

Flat `skills/` and `agents/` become the **only** sources; everything else is derived and, where the
CLI allows, derived at install time rather than committed.

1. **One neutral bundle manifest**, `bundles.yaml` (name, description, skills, agents).
   `marketplace.json`, the Claude bundle tree and the opencode catalogue JSON are rendered from it.
2. **opencode layer thinned to its real content.** The installer copies skills from `skills/`
   directly; agent files are rendered at install time from a generated JSON catalogue (parsed
   frontmatter) and one mapping-table file, with no npm dependency; `.opencode/` leaves git. Parity and gap reports become `make`-on-demand outputs, not committed files.
3. **Claude packaging fixed** so that installing a bundle loads exactly that bundle's skills and
   agents: one plugin root per bundle, `bundles/<name>/`, made of committed symlinks into `skills/`
   and `agents/` (DEC-5, decided by [`spike-dec5.md`](spike-dec5.md)).
4. **The work loop in `AGENTS.md`** — when a change needs an EPIC vs a direct edit, the branch flow,
   and the route to the one done-checklist (`docs/development-method.md` §9) — updated because the
   checklist changes when this lands (`generate-opencode` drops out). `CONTRIBUTING.md` loses its
   second checklist and routes to §9.

## Key decisions

- **DEC-1: Skills are never copied inside the repo.** Skills follow the Agent Skills open standard;
  opencode reads a `SKILL.md` folder exactly as Claude does and already copies into
  `~/.config/opencode/skills` at install. The installer's source becomes `skills/`; the skills drift
  gate is deleted, not relaxed.
- **DEC-2: `bundles.yaml` is the single bundle definition.** Today the bundle lives in a
  Claude-specific file and is re-expressed in `bundles.json`. One neutral file, two renderings.
  Rationale: the next three bundles must be declared once. *(Revised 2026-10-26, R2: the manifest
  carries name, description, skills, agents — no external-deps field; those keep their one home in
  `docs/environment/setup.md`.)*
- **DEC-3: An agent belongs to exactly one bundle, declared in `bundles.yaml`.** Today agents are
  auto-discovered into every bundle. The three existing agents move to `meaningfy-building`. The
  sibling `agent-authoring-standard` makes this a lint rule; this EPIC makes it true.
- **DEC-4: Generated means not committed, where the CLI permits.** Agents for opencode are rendered
  at install (node is already required by the installer); CI proves generation succeeds and parity
  holds. Reviewability of generated output is traded for the absence of a drift surface.
- **DEC-5: The Claude per-bundle layout is decided by a spike, in this order of preference:**
  (a) plugin manifests whose skill paths point at `../../skills/<x>`; (b) symlinks inside a
  `bundles/<name>/` root; (c) a committed per-bundle copy. Only (c) duplicates, and only because
  Claude's installer imposes it; if (c) wins, the copy is generated and drift-gated like today's
  `.opencode/` was. The spike runs on a fresh install and counts loaded skills before and after.
  **Outcome (2026-10-26, R1): (b).** (a) fails Claude's validator (`Path contains ".."`); (b) loads
  exactly each bundle (32 skills, 3 agents instead of 15 agent registrations; cache 57 MB → 1.9 MB)
  and upgrades with a plain `claude plugin update`. Evidence: [`spike-dec5.md`](spike-dec5.md).
- **DEC-6: Ships as a MAJOR release (3.0.0) with a migration note.** *(Re-shaped 2026-10-26, R7 —
  originally "a minor release, not a major".)* `docs/development-method.md` §6 defines breaking as
  "a user must do something", and users must: install `meaningfy-building` to keep the agents (the
  `meaningfy-core:code-reviewer`-style ids disappear), update their bundles, re-add the marketplace
  on Windows after enabling symlinks, and drop the removed opencode direct-checkout route. No
  reinstall is needed (spike).
- **DEC-7: The `AGENTS.md` work loop lands in this EPIC**, not in a separate binding change. Writing
  it before the packaging change would make it stale within one release.
- **DEC-8: External skills stay referenced, never vendored by default; when one is adopted it is
  copied in with a provenance note (source, commit, licence, date) and reviewed before upstream
  changes are pulled.** Rationale: the agent-skills supply chain has documented malicious campaigns
  (inputs §4); a skill runs with the agent's full permissions.

## Rabbit-holes

- **Do not redesign the skill folder layout.** Flat `skills/<name>/` stays; bundles group, they do
  not nest.
- **Do not build a plugin for opencode** to replace the installer. The installer is a copy step; a
  plugin would be a new runtime surface to maintain.
- **Do not chase `npx skills` parity in this EPIC.** `npx skills add meaningfy-ws/skillery` works
  against flat `skills/` once the 12 strict-YAML failures are quoted *(corrected 2026-10-26, R8 —
  the original said it "already works"; 12 skills were skipped)*; bundle-aware install via that CLI
  is a nice-to-have, named in Impact.
- **Do not port the body-agnosticism check into the new manifest.** It stays as-is; it is the one
  dual-CLI gate that checks content rather than copies.

## No-gos

- **No new skills, no new agents, no agent re-authoring** — the three agents move bundle, nothing
  else changes in them (that is `agent-authoring-standard`). **One allowed frontmatter edit (R8):**
  the `description` of 12 skills is wrapped in quotes so strict YAML parses it, wording
  byte-identical.
- **No changes to hooks rendering or command registration.** They are already per-CLI by design.
- **No GitHub Pages / Antora work.** Tracked elsewhere.
- **No triage of the seven open changes inside this EPIC.** That is a direct PR (plus a lint rule
  blocking archive with unticked tasks), run before this EPIC starts.
- **No merge of `CONTRIBUTING.md` and `spec/CREATING_SKILLS.md`** (R3) — it moves to
  `skill-crafting-method` half two, which decides which authoring prose skillery keeps at all.

---

## What Changes

- Add `bundles.yaml`; render `.claude-plugin/marketplace.json` and the `bundles/` symlink tree from
  it (`make bundles`; gate: renderings match).
- Rewrite the opencode installer to copy from `skills/` and render agents at install; delete
  `.opencode/` from git; delete the skills drift gate; make parity/gap reports on-demand.
- Per-bundle Claude plugin roots `bundles/<name>/` of symlinks (DEC-5 outcome (b)); agents homed in
  `meaningfy-building`. Delete `tools/opencode_gen`, `opencode.json`, `make generate-opencode`.
- **Install layout changes** (plugin roots, cache contents, agents now installed on opencode); user
  commands do not. Released as **3.0.0** (MAJOR, R7) with a migration note listing every user action.
- `AGENTS.md`: the work loop the human's WIP already added gains the branch flow and the new bundle
  step; GitNexus block present only here, scoped to `tools/`; `CLAUDE.md` loses its duplicate copy.
- `CONTRIBUTING.md`: its second checklist is replaced by a route to `docs/development-method.md` §9;
  prune the README's old-bundle migration section.

## Capabilities

### New Capabilities

- None. *(R5: the proposed `bundle-manifest` capability is folded into `dual-cli-distribution`;
  design.md D1.)*

### Modified Capabilities

- `dual-cli-distribution`: one neutral bundle manifest; skills and agents installed from their single
  source on both CLIs; installing a bundle loads exactly that bundle; no committed per-CLI copy.
- `dual-cli-generation`: rendering targets the Claude manifest + symlink tree (committed, because
  Claude clones the repo) and opencode agents + reports (at install / on demand, never committed).
- `catalogue-governance`: every skill and every agent in exactly one bundle of `bundles.yaml`, no
  pinned bundle names; the work loop and the single done-checklist become normative; DEC-8 provenance.
- `linkml-engineering`, `modelling-conventions`: their "`.opencode/` mirror" clause becomes "installed
  from `skills/`" (design.md D17).

## Impact

- **Repo:** −208 files, −1 Makefile target for skill changes, −1 gate, +1 manifest, +1 spike record.
- **Tooling:** `tools/opencode_gen` (deleted; `tools/bundle_gen` renders the Claude files), `tools/skillery-opencode.mjs`, `tools/repo_lint` (drift gate
  removed, manifest-match gate added), `tests/test_opencode_gen.py`, `tests/opencode-bundle-installer.test.mjs`.
- **Users:** one normal update on both CLIs (no reinstall — spike-dec5.md); agents only with `meaningfy-building`.
- **Siblings:** every later EPIC declares its bundle in `bundles.yaml` and nowhere else.
- **Deferred nice-to-have:** bundle-aware `npx skills add` (would make the custom opencode installer
  optional).

## Revision log (2026-10-26, PLAN derivation)

The PLAN ([`design.md`](design.md), [`tasks.md`](tasks.md)) was derived without the human (who asked
for complete results without questions). Every change to the shaped bet is logged here, not made
silently.

- **R1 — DEC-5 resolved: option (b).** Evidence in [`spike-dec5.md`](spike-dec5.md). The spike also
  corrected the diagnosis: on Claude Code 2.1.310 skills were already scoped by the explicit lists;
  agents and whole-repo cache copies were the live duplication.
- **R2 — DEC-2 trimmed:** no external-deps field in `bundles.yaml` (one home already exists).
- **R3 — CONTRIBUTING + CREATING_SKILLS merge descoped** to `skill-crafting-method` half two (team-lead
  decision). Owner made explicit by tasks.md 7.12: one inherited-item line in that proposal, and the
  wrong back-pointer in `fix-accumulated-skill-defects` corrected.
- **R4 — superseded by R7.**
- **R5 — `bundle-manifest` capability folded** into `dual-cli-distribution` (design.md D1).
- **R6 — No-go "No design.md / tasks.md in this change round" removed**; this is that round.
- **R7 — DEC-6 re-shaped to MAJOR (3.0.0)** after the hardening review (F2) and the team lead's
  decision: the repo's own rule (`docs/development-method.md` §6) decides "breaking".
- **R8 — Strict-YAML frontmatter in scope** (review F3, lead decision): opencode and `npx skills`
  now read `skills/` directly and skip 12 skills whose `description` holds an unquoted `: `. Added: a
  strict-YAML lint check and a byte-preserving quoting pass (the one allowed frontmatter edit); the
  `npx skills` Rabbit-hole claim corrected.
- **R9 — Hardening review folded in** ([`review-hardening.md`](review-hardening.md), 8.2/10): every
  finding's disposition is in design.md "Review disposition"; its Cross-EPIC contract is normative in
  design.md; the `yaml` npm dependency is replaced by a generated `tools/opencode-catalogue.json`
  (lead decision 7, design.md D6).
