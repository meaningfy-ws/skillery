<!-- PLAN (design half). PLAN = this file + tasks.md. The clarity gate scores the pair (≥9/10). -->

> Parent: [`openspec/changes/single-source-distribution/proposal.md`](proposal.md) (EPIC), which
> derives from [`inputs/2026-10-25-session-findings.md`](inputs/2026-10-25-session-findings.md).
> DEC-5 evidence: [`spike-dec5.md`](spike-dec5.md). Hardening review:
> [`review-hardening.md`](review-hardening.md) (8.2/10). Every finding's disposition is in
> [Review disposition](#review-disposition), and the cross-EPIC interface is in
> [Cross-EPIC contract](#cross-epic-contract-normative).

## Context

State verified by direct read of the working tree (branch `feat/single-source-and-agent-standard`,
HEAD `d45306b`). The human's uncommitted WIP in `AGENTS.md`, `CONTRIBUTING.md`, `README.md`,
`docs/development-method.md` and `.github/ISSUE_TEMPLATE/` is treated as the current state.

| Artefact | Today | Role after this change |
|---|---|---|
| `skills/<name>/` (32 skills), `agents/*.md` (3) | The authored sources. **12 skills have frontmatter that strict YAML rejects** (unquoted `: ` in `description`; PyYAML `safe_load` and eemeli/`yaml` both fail): `conceptual-modelling`, `estimation`, `executive-communication`, `proposal-writing`, `vault-{capture,conventions,daily,planning,promote,resume,setup,tidy}` | Still the only sources. The 12 descriptions are quoted (D18) |
| `.claude-plugin/marketplace.json` | Hand-edited. 5 entries, each `source: "./"`, `strict: false`, `skills: [...]`. It is also the membership truth that `repo_lint`, `opencode_gen` and `skill_inventory` read | **Rendered** from `bundles.yaml`. Entries point at `./bundles/<name>` |
| `.opencode/` | Committed and written by `tools/opencode_gen` (`make generate-opencode`), drift-gated. Holds 208 skill files (a byte copy of `skills/`), 3 agents, `bundles.json`, `PARITY.md`, `GAP.md` | **Deleted from git**, then gitignored |
| `opencode.json` (root) | `{"$schema", "version"}`, a version carrier | **Deleted** |
| `tools/opencode_gen/` | Skill copy, agent mapper, command mapper, reports, gates | **Deleted**. `tools/bundle_gen/` renders the committed files |
| `tools/opencode-bundle-lib.mjs`, `tools/skillery-opencode.mjs` | The installer copies **skills only**; it never installs agents on opencode | Reads the generated `tools/opencode-catalogue.json`, copies skills from `skills/`, and **renders and installs agents** |
| `tools/opencode-plugin.mjs` | Plugin route; adds `.opencode/skills/<x>` to `skills.paths` | Repointed at `skills/<x>`. Still skills only |
| `tools/repo_lint/lint.py` | Reads `marketplace.json`. Pins `EXPECTED_BUNDLE_NAMES`. Its `_frontmatter` silently falls back to a line scanner | Reads via `bundle_gen.load`. Adds `agent_bundle_membership` and `frontmatter_strict_yaml`. Names not pinned |
| `.github/workflows/validate.yml` | Python lint + pytest, and a spine job. **The node installer tests never run** | Adds a node job |
| `package.json` | `files` ships `.opencode/skills` and `.opencode/bundles.json`. No dependencies | Ships `skills/`, `agents/`, the two `tools/*.json` and the three `.mjs`. **Still no dependencies** (D6) |

Spike (DEC-5, [`spike-dec5.md`](spike-dec5.md); evidence re-checked by the review, F19). On Claude
Code CLI 2.1.310, today's explicit `skills` lists already scope skills. **Agents** leak into all five
bundles: 15 registrations for 3 agents, and a 57 MB cache of whole-repo copies. Option (b) gives
32 skills, 3 agents and a 1.9 MB cache, and it upgrades with `claude plugin update`. Cowork / Claude
Desktop, the surface named in inputs §2, was **not** tested (D19).

GitNexus impact (index dated 2026-07-26):
- `opencode_gen.gen.bundle_membership` → **CRITICAL** (7 symbols, 6 flows). This is expected: the
  whole module is deleted, and its only outside caller (`repo_lint.opencode_tree_gates`) is replaced
  in the same commit.
- `repo_lint._bundle_membership` → LOW.
- `opencode-bundle-lib.loadCatalogue` → LOW.

## Goals / Non-Goals

**Goals:**
- `skills/` and `agents/` are the only copies of any skill or agent text in git (DEC-1).
- `bundles.yaml` is the only hand-edited bundle definition (DEC-2).
- Installing one bundle on either CLI yields exactly its skills and agents, and opencode and
  `npx skills` can actually parse every skill (D18).
- A skill **content** edit needs no regeneration. A membership change or an agent-frontmatter change
  needs `make bundles`, and the gate tells you so.
- The migration note lists every user action (DEC-6 re-shaped, R7).

**Non-Goals:**
- No change to skill or agent bodies or names. The only frontmatter edit allowed is the
  byte-preserving quoting of 12 descriptions (D18). The agent `type` field, its rendering and
  the primary-skill lint belong to `agent-authoring-standard` (contract items 3–5). Agents carry
  **no** `bundle:` field.
- No hooks rendering, command registration, Antora, or `npx skills` bundle-awareness.
- No merge of `CONTRIBUTING.md` and `spec/CREATING_SKILLS.md`. Its owner becomes
  `skill-crafting-method` (D20).
- No new opencode plugin features: agents via the plugin route stay a recorded gap (D11).

## Decisions

Settled in the EPIC and cited, not re-argued: DEC-1, DEC-3, DEC-4, DEC-7, DEC-8. This PLAN trims
DEC-2, resolves DEC-5 and re-shapes DEC-6 (proposal revision log R1–R9). New choices:

### D1 — `bundle-manifest` is folded into `dual-cli-distribution`
The manifest exists only to serve distribution. Its requirements land in:
- `dual-cli-distribution`: the manifest and the install outcome;
- `dual-cli-generation`: what is rendered, and when;
- `catalogue-governance`: the one-bundle rule.

A separate capability would split one contract, and the human asked for the existing specs to be
updated.

### D2 — `bundles.yaml` schema (exact; contract item 1)
The root file `bundles.yaml` has exactly these top-level keys: `name`, `owner` (`name`, `email`),
`description` and `bundles` (an ordered list). Each bundle has exactly these keys:
- `name`: kebab-case, unique;
- `description`: one line, shown by `/plugin`;
- `skills`: a list of `skills/` directory names;
- `agents`: a list of `agents/*.md` **stems**. It is required and may be `[]`.

No other key is accepted. The order of `bundles` is the marketplace and inventory order.

```yaml
# bundles.yaml — the one bundle definition (single-source-distribution DEC-2).
# After any membership change, or any agent-frontmatter change, run `make bundles`.
# Never edit .claude-plugin/marketplace.json, bundles/ or tools/opencode-catalogue.json by hand.
name: meaningfy-skillery
owner: {name: Meaningfy, email: info@meaningfy.ws}
description: Meaningfy company-wide skills, agents, methodologies, and engineering standards for working with LLM agents consistently
bundles:
  - name: meaningfy-core
    description: "Cross-cutting basics everyone installs: clear technical writing, ..."
    skills: [technical-writing, explanatory-writing, writing-antipatterns, meaningfy-git-workflow, guardrails]
    agents: []
  - name: meaningfy-building
    description: "The delivery / developer role: ..."
    skills: [epic-planning, spec-stewardship, clarity-gate, bdd-gherkin, meaningfy-code-review,
             cosmic-python, project-setup, ci-cd-delivery, meaningfy-release]
    agents: [epic-planner, implementer, code-reviewer]
  # meaningfy-consulting, meaningfy-architecture, vault-assistant: copied verbatim from today's
  # marketplace.json (same descriptions, same skill order), agents: []
```

There is no external-deps field (R2). They already have one home, `docs/environment/setup.md`.

### D3 — Claude rendering: rendered `marketplace.json` + committed symlink tree, no `plugin.json`
`make bundles` writes:
- `.claude-plugin/marketplace.json`:
  `{"name", "owner", "metadata": {"description", "version": VERSION}, "plugins": [{"name", "description", "source": "./bundles/<name>"}, ...]}`.
  It is written with `indent=2`, `ensure_ascii=False`, a trailing newline and that fixed key order.
  There is no `strict`, `skills`, `agents` or per-entry `version`, so the plugin version stays the
  commit SHA, which is what let the spike upgrade in place.
- `bundles/<bundle>/skills/<skill>` → `../../../skills/<skill>`, one per listed skill.
- `bundles/<bundle>/agents/<agent>.md` → `../../../agents/<agent>.md`, one per listed agent. The
  directory is omitted when the list is empty.

The links are committed because Claude clones the repo. They are pointers, not copies, so DEC-1
holds.

Alternatives considered and rejected:
- **(a)** a per-bundle `plugin.json` with `..` paths: rejected by the validator.
- **(d)** `source: "./"` plus `agents` lists: an empty list does not suppress the scan.
- **A per-bundle `plugin.json` without `..`**: adds nothing over the marketplace entry, because the
  files must still sit under the plugin root.
- **Physical nesting** (`bundles/<b>/skills/<s>` as the real home, no flat `skills/`): Windows-safe
  and free of symlinks, but barred by the Rabbit-hole "do not redesign the skill folder layout", and
  it rewrites every path in the repo (F17).

### D4 — `tools/bundle_gen/` replaces `tools/opencode_gen/` (contract item 2)
A new package (`__init__.py`, `__main__.py`, `gen.py`), run as
`python -m tools.bundle_gen [generate|check] [repo]`. Its functions:

- `load(repo) -> dict` parses `bundles.yaml` with `yaml.safe_load` and validates it against D2. On any
  violation it raises `ValueError` naming the key and the bundle. It returns
  `{"name": str, "owner": {"name": str, "email": str}, "description": str, "bundles": list[{"name": str, "description": str, "skills": list[str], "agents": list[str]}]}`,
  with `bundles` in file order and no defaulting (`agents` is required).
  This is the **only** parser and validator of `bundles.yaml` in Python. `repo_lint`,
  `skill_inventory` and the sibling's lint derive from it and never re-parse the file.
- `agent_frontmatter(repo, stem) -> tuple[dict, str]` splits `agents/<stem>.md` at its frontmatter
  delimiters and parses the block with `yaml.safe_load`, with **no fallback**. It raises
  `ValueError("agent '<stem>': frontmatter is not valid YAML …")` if the block is not a dict
  (F11). It also checks that `model`, when present, is a key of
  `tools/opencode-agent-map.json` `modelAliases`, read with `json.load`; otherwise it raises
  `ValueError("agent '<stem>': unknown model alias '<m>'")`.
- `render(repo) -> tuple[bytes, dict[str, str], bytes]` returns the marketplace bytes, the link map
  (path → target) and the opencode catalogue bytes (D6).
- `write(repo) -> list[str]` writes the marketplace and the catalogue, deletes and recreates
  `bundles/`, and syncs `package.json` `version`.
- `gate_errors(repo) -> list[str]` checks that the renderings match and that versions agree.

`opencode_gen` is deleted, not gutted: none of its logic survives, and a module named for opencode
that writes Claude files would mislead. The make target is `bundles`.

### D5 — Lint: membership, agent membership, strict YAML (contract item 4)
- `_marketplace_skills` and `_bundle_membership` derive from `bundle_gen.gen.load`.
- **`agent_bundle_membership`** is a new entry in `ALL_CHECKS`. It emits exactly these three
  messages (the sibling extends the same function with its primary-skill messages only):
  - `agent '<a>' is in no bundle in bundles.yaml`
  - `agent '<a>' is in multiple bundles: <b1>, <b2>`
  - `bundles.yaml lists agent '<a>' but agents/<a>.md does not exist`
- **`frontmatter_strict_yaml`** is a new check. For every `skills/*/SKILL.md` and `agents/*.md`,
  `yaml.safe_load` of the frontmatter block must return a dict. On failure it emits
  `<path>: frontmatter is not strict YAML (<first line of the parser error>)`. The tolerant
  `_frontmatter` stays for the other checks, so each fault is reported once, by this check.
- **`EXPECTED_BUNDLE_NAMES` is deleted.** It would be a second bundle definition.
- `opencode_tree_gates` is replaced by `bundle_gates` (→ `gate_errors`).
- `agents_canonical_invariant` gains one check: `CLAUDE.md contains a gitnexus block (it lives in AGENTS.md only)`,
  raised when `<!-- gitnexus:start -->` appears in `CLAUDE.md` (D14).
- `_SKIP_DIRS` gains `bundles` and keeps `.opencode`.

### D6 — opencode: the installer reads one generated JSON, with no npm dependency (lead decision 7)
**Chosen (the smallest option).** `make bundles` also writes `tools/opencode-catalogue.json`. It is
committed and drift-gated with the other renderings:

```json
{"version": "3.0.0",
 "bundles": [{"name": "meaningfy-building", "skills": ["epic-planning", "..."], "agents": ["epic-planner", "..."]}, "..."],
 "agents": {"code-reviewer": {"description": "...", "model": "opus", "color": "yellow",
                              "tools": ["Read", "Grep", "Glob", "Bash"],
                              "disallowedTools": ["Write", "Edit", "NotebookEdit"],
                              "skills": ["meaningfy-code-review", "cosmic-python"]}, "...": {}}}
```

The file is written with `indent=2`, `ensure_ascii=False` and a trailing newline; `agents` keys are
sorted and the source key order is kept within each agent. `agents` holds each agent's parsed
frontmatter verbatim, not its body.

The installer:
- loads this file and `tools/opencode-agent-map.json` with `JSON.parse`;
- reads each agent's body from `agents/<a>.md` by splitting at the second `---` line (a string
  operation, not YAML parsing);
- renders with `renderAgent(frontmatter, body, map) -> {content, gaps}`. The output fields and their
  order are today's: `description`, `mode` (`primary` if `primary` is set, else `subagent`), `model`,
  `tools`, `permission`, `color`, `skills`, then the body. Values are emitted as JSON flow scalars,
  which are valid YAML.

**Mapping tables** (contract item 3) live **only** in `tools/opencode-agent-map.json`
(`modelAliases`, `toolNames`, `toolPermission`), moved verbatim from `opencode_gen/gen.py`.
`renderAgent` reads them, and Python reads them only to validate (D4).

**Why this, not the `yaml` npm package.**
- It needs no npm registry at install time and no lockfile decision.
- The repo keeps exactly one YAML parser (PyYAML), which runs at author time under the strict gate,
  instead of a second parser on every user's machine.
- The cost is one gated generated file, plus a regeneration step when an agent's frontmatter
  changes. The gate names the step, and agent changes are rare.
- The reviewer's marketplace-`metadata` idea (F12) would cover membership but not agent frontmatter,
  so it still needed a parser. Rejected.

**Interaction with DEC-1/DEC-4.**
- The catalogue copies agent *frontmatter* (metadata), never a skill or an agent body. It is a
  rendering the opencode installer reads from the repo, which is the case DEC-4 allows ("unless a
  CLI's installer requires it").
- Skill copy filters out `__pycache__/`, `*.pyc` and `*.pyo`.
- JS `loadCatalogue()` checks only the shape it consumes (a `version` string, a `bundles` array,
  an `agents` object). Schema validation is Python's job alone (F12).

### D7 — Where agents land on opencode, and the install manifest (F10)
Agents are written **only** for `--global` (to `~/.config/opencode/agents/`) and `--project` (to
`<cwd>/.opencode/agents/`). With `--target DIR`, skills go to `DIR` as today, and agents are
**skipped**. The installer prints:
`gap: agents not installed with --target (use --global or --project)`.
This rules out writing opencode-format agents into `~/.claude/agents/`.

`.skillery-manifest.json` stays in the skills target with `schemaVersion: 1` and gains
`managedAgents`. A v2.11 manifest that lacks the field is read as `[]`. The unmanaged-overwrite
refusal and `--force` apply to agent files exactly as they do to skill directories.

### D8 — Parity and gap reports on demand, never committed
`skillery-opencode report` (and `make opencode-report`) prints the parity and gap tables. `install`
prints one `gap:` line per gap. CI proves parity by rendering every repo agent (TC-19).

### D9 — Non-opsx command generation is dropped
`map_command` had no input. A first-party command in future is its own change.

### D10 — Version flow
`VERSION` reaches `marketplace.json` `metadata.version`, `tools/opencode-catalogue.json` `version` and
`package.json` `version`, all via `make bundles`. The installer reports the catalogue `version`.
`hooks/inventory.yaml` `version` stays under `hooks_inventory_shape`.

### D11 — The two alternate opencode routes
- **Plugin route:** repointed at `skills/<x>`. It stays skills only, which is a documented gap.
- **Direct-checkout route** (`OPENCODE_CONFIG_DIR=.opencode`): removed. Its replacement is
  `node tools/skillery-opencode.mjs install <bundle> --project` from a checkout. The migration note
  lists this (R7).

### D12 — `.opencode/` gitignored
This stops a `--project` install inside this repo from being re-committed.

### D13 — The work loop and the single checklist; no criterion lost (F6)
`AGENTS.md` already routes to `docs/development-method.md` §9 (the human's WIP). This change edits
existing text; it adds no second checklist:
- **`AGENTS.md`:**
  - add a **Branch flow** bullet (feature branch off `develop`, PR into `develop`;
    release/hotfix per `meaningfy-release`; branch shape owned by `meaningfy-git-workflow`);
  - rewrite "Assigning to a bundle" and the Dual-CLI authoring bullets for `bundles.yaml` +
    `make bundles`;
  - the version bullet names the three rendered files;
  - "How to validate" names the CI node job.
- **`docs/development-method.md`** (pointer-level edits to the human's WIP):
  - §3 step 6 and §6 bullet 1 drop the opencode tree;
  - the §9 line "`make generate-opencode` (until removed)" becomes "`make bundles` if membership or
    agent frontmatter changed";
  - **one new §9 line:** "Licence and provenance recorded for vendored or third-party content —
    per-skill `LICENSE.txt` where it differs from the repo's, `THIRD_PARTY_NOTICES.md`, and a
    provenance note (source, commit, licence, date) per DEC-8."
- **`CONTRIBUTING.md`:**
  - the 40-item "Skill Submission Checklist" becomes one routing paragraph, but only after every item
    has a home (table below);
  - Steps 3–5 and the Summary use `bundles.yaml` + `make bundles`.
- **`spec/skill-repo-governance.md`:**
  - rule 1 gains the DEC-8 exception ("…referenced, not vendored; an adopted copy carries a
    provenance note and is reviewed before upstream changes are pulled");
  - line 18 "`.claude-plugin/`" → "`bundles.yaml` (rendered to `.claude-plugin/`, `bundles/` and
    `tools/opencode-catalogue.json`)";
  - line 35 "marketplace↔dirs" → "`bundles.yaml`↔dirs (skills and agents), strict-YAML frontmatter".

Where each CONTRIBUTING checklist item goes:

| CONTRIBUTING items | New home |
|---|---|
| Skill dir in `skills/`; registered | lint `missing_skill_dirs` / `unregistered_skill_dirs` |
| Dir name == `name` | lint `name_mismatch` |
| Valid YAML frontmatter | lint `frontmatter_present_errors` + **new** `frontmatter_strict_yaml` |
| ~500 lines | lint `skill_too_long` (650 hard) + `spec/CREATING_SKILLS.md` (500 soft) |
| Complex content in `references/`; domain-meaningful filenames; no duplicate content | §9 "SKILL.md is lean; detail is in `references/`"; §9 "No fact stated that another skill owns"; dev-method §5 |
| `## Boundary & Related Skills`; reciprocal Related | lint `boundary_section_present`, `reciprocal_related_report` (advisory) |
| Cite code-principles, never restate | §9 ownership line |
| `name` 1–64 chars, lowercase/hyphens; `description` 1–1024 chars; required fields | `spec/agent-skills-spec.md` / `spec/CREATING_SKILLS.md` "YAML Frontmatter"; lint `frontmatter_errors` (presence) |
| Description clear with use cases | §9 "the description is trigger-shaped" + probes line |
| Overview section | **Dropped:** it contradicts dev-method §5 ("No 'Overview' that repeats the description") |
| Quick Start with example | §9 Quick Start line |
| Key workflows; tips and limitations; runnable examples; relative paths; no hardcoded paths | `spec/CREATING_SKILLS.md` (Markdown Content Structure, Examples); dev-method §2 principle 9 |
| Scripts in `scripts/`, named, commented, handle errors; deps documented; assets in `assets/` | `spec/CREATING_SKILLS.md` "Scripts Organization", "Assets Directory" |
| Registered in a bundle; group chosen; bundle description | §9 "Exactly one bundle"; lint membership; `bundle_gen.load` (description required) |
| Ran `make generate-opencode` | **Dropped:** obsolete (this change) |
| CLI-agnostic body | lint `body_agnosticism` |
| `make validate` passes | §9 |
| Repo-level `LICENSE` exists | **Dropped:** a repository fact, not a per-change check (the file exists) |
| Skill `LICENSE.txt` if different; `THIRD_PARTY_NOTICES.md`; dependency attribution | **new §9 licence/provenance line** |

### D14 — GitNexus block only in `AGENTS.md`, guarded by lint (F16)
The human's brief names "CLAUDE.md GitNexus block dedupe", so this stays in scope:
- `CLAUDE.md` loses its block.
- One line **outside** the markers in `AGENTS.md` scopes the block to `tools/` and `tests/`, and says
  to re-index with `--skip-agents-md`, which skips both files.
- A plain `analyze` re-injects the copy, and the lint check (D5) then fails, so the fix cannot decay
  silently.
- The stats line in `AGENTS.md` may go stale. That is accepted, since it is cosmetic.

### D15 — Release 3.0.0 (MAJOR), re-shaping DEC-6 (lead decision 2, R7)
`docs/development-method.md` §6 defines breaking as "a user must do something", so this is a MAJOR.
The migration note lists every action, in this order:
1. **Claude users of `epic-planner` / `implementer` / `code-reviewer`:** these now come only with
   `meaningfy-building`. The ids `meaningfy-core:code-reviewer` (and the same for the consulting,
   architecture and vault bundles) disappear. Install `meaningfy-building`.
2. **Claude, everyone:** `claude plugin marketplace update meaningfy-skillery`, then
   `claude plugin update <bundle>@meaningfy-skillery` per bundle. No reinstall is needed (spike).
3. **Windows:** enable Developer Mode and run `git config --global core.symlinks true`. An existing
   marketplace checkout must be **removed and re-added** (`claude plugin marketplace remove` / `add`),
   because an update keeps the links as text files (F15).
4. **opencode:** rerun your install command. It now also installs the bundle's agents with `--global`
   or `--project`. The `OPENCODE_CONFIG_DIR=.opencode` direct-checkout route is gone; use the
   installer from a checkout instead.
5. **Cowork / Claude Desktop:** this layout was verified on the Claude Code CLI only (D19).

### D16 — CI runs the node tests
`validate.yml` gains an `opencode-installer` job: `actions/checkout@v4`, `actions/setup-node@v4`
(node 20), `npm run test:opencode-installer`. There is no `npm install`, because there are no
dependencies. `make validate` stays Python-only.

### D17 — Specs naming the `.opencode/` mirror are modified
`linkml-engineering` and `modelling-conventions` get MODIFIED deltas. The review confirmed these are
required (F19 scope check).

### D18 — Strict-YAML frontmatter (lead decision 3, F3)
opencode and `npx skills` now read `skills/` directly and reject the 12 skills listed in Context. The
fix:
- wrap each failing `description` value in double quotes, escaping `\` and `"`. The wording stays
  byte-identical, and the check is
  `yaml.safe_load(new_block)["description"] == old_value_text.strip()`;
- add the lint check `frontmatter_strict_yaml` (D5).

This is the one frontmatter edit allowed by the No-gos. The proposal's Rabbit-hole claim that "`npx
skills add` already works" is corrected (R8).

### D19 — Cowork / Claude Desktop unverified (lead decision 4, F4)
No new spike. **ASSUMPTION:** Cowork and Claude Desktop load marketplace plugins with the same
cache-copy and symlink rules as the CLI. Organisation sync is documented to accept "only some source
types", which makes this the least certain surface. A manual check is added to the release (IT-05),
and the migration note names the CLI as the verified surface.

### D20 — Owners for the descoped merge (lead decision 5, F5)
- The `CONTRIBUTING.md` + `spec/CREATING_SKILLS.md` merge stays out of this EPIC.
- Task 7.12 appends one dated line to `openspec/changes/skill-crafting-method/proposal.md`'s "Half two"
  bullets, recording the merge as an inherited item.
- The same task corrects `openspec/changes/fix-accumulated-skill-defects/proposal.md` line 62, which
  wrongly says the merge "is in `single-source-distribution`", to point at `skill-crafting-method`.

## Cross-EPIC contract (normative)

Adopted verbatim from [`review-hardening.md`](review-hardening.md), as the team lead directed. The
lead's amendment (decision 7, D6) follows it.

Both `single-source-distribution` (SSD, ships first) and `agent-authoring-standard` (AAS) must honour
this interface. SSD's PLAN implements its side; AAS's PLAN must be revised to consume it (its A-1,
D-3 alias source, D-9 mapper location, tasks 2.2, 4.1–4.2, 5.5, and its two delta specs).

1. **`bundles.yaml` schema** (owner: SSD, `dual-cli-distribution` delta).
   - Top level: exactly `name`, `owner{name,email}`, `description`, `bundles`.
   - Each bundle: exactly `name` (kebab-case, unique), `description` (one line), `skills` (list of
     `skills/` directory names), `agents` (list of `agents/*.md` **stems**, bare names, required, may
     be `[]`).
   - No other key. Order = marketplace and inventory order.
   - Agents carry **no** `bundle:` frontmatter; `bundles.yaml` is the only declaration.
2. **Read seam** (owner: SSD). `tools.bundle_gen.gen.load(repo)` is the only parser and validator of
   `bundles.yaml` in Python. It returns the validated document with `bundles` as
   `list[{"name","description","skills":list[str],"agents":list[str]}]` in file order. AAS's
   `_bundle_agents`/`_bundle_skills` derive from it and never re-parse the file.
3. **Agent mapping location** (owner: SSD creates, AAS extends).
   - Tables live in exactly one file, `tools/opencode-agent-map.json`: `modelAliases`, `toolNames`,
     `toolPermission`, and `agentModes`, which AAS adds as `{"delegated":"subagent",
     "lead":"primary","scheduled":"subagent"}`.
   - The renderer is `renderAgent(text) -> {content, gaps}` in `tools/opencode-bundle-lib.mjs`, run at
     install and by `skillery-opencode report` (`make opencode-report`).
   - Python reads the JSON only for validation (AAS A1: the `model` key set and the `type` value set).
   - There is no `tools/opencode_gen`.
   - AAS's `type`→`mode` change and `scheduled` gap are implemented in `renderAgent` and tested in
     `tests/opencode-bundle-installer.test.mjs` (`npm run test:opencode-installer`, CI node job). SSD
     keeps today's `primary`-flag behaviour, and AAS replaces it.
   - Strict YAML: invalid frontmatter throws (F11).
4. **Agent membership lint** (owner: SSD implements, AAS extends).
   - SSD adds `agent_bundle_membership` to `ALL_CHECKS` with the three messages in F8.
   - AAS adds only the primary-skill messages to that same function (`… its primary skill '<s>' is
     not`, `… has no local primary skill`).
5. **Spec-delta ownership.**
   - `dual-cli-distribution`: SSD only.
   - `dual-cli-generation`: SSD owns "Agent frontmatter mapping" (location per item 3). AAS ADDs
     "Agent type is rendered per CLI", reworded "the opencode agent renderer" (not "the generator"),
     with failure meaning "the installer aborts before writing".
   - `catalogue-governance`: SSD owns "every skill and every agent in exactly one bundle". AAS's ADDED
     requirement keeps the frontmatter, body, dispatch-contract, primary-skill and feature-file rules,
     and drops its "outside exactly one bundle" scenario and sentence.
   - `linkml-engineering`, `modelling-conventions`: SSD only.
6. **Shared docs, disjoint edits.**
   - `docs/development-method.md`: SSD edits §3 step 6, §6 bullet 1 and the §9 bundle line (+ F6's one
     provenance line); AAS edits §4, the §5 agent bullet and §8.
   - `docs/environment/dual-cli/mapping.md`: SSD edits the skills/agents/VERSION/bundles.yaml rows;
     AAS edits the `type` rows.
   - AGENTS.md, README, CHANGELOG: SSD's release section first, AAS under `[Unreleased]`.
7. **Verification route.** After SSD, Claude agent loading is tested only from a pushed branch
   (`claude plugin marketplace add meaningfy-ws/skillery#<branch>`), never from a local path. This
   applies to AAS task 5.5.

**Amendment (lead decision 7, applied in D4/D6).** The renderer's input changes; everything else in
item 3 stands.
- Agent frontmatter is parsed **once, in Python**, by `bundle_gen.agent_frontmatter`, strictly and
  with no fallback. The result is written into `tools/opencode-catalogue.json` `agents.<stem>`.
- `renderAgent` therefore takes `(frontmatter, body, map)`, not `text`, and still returns
  `{content, gaps}`. Invalid frontmatter "throws" at `make bundles` / `make lint` time, naming the
  agent, before anything reaches a user.
- When AAS adds `type`, it reads `frontmatter.type` in `renderAgent`, and its A1 lint reads
  `agentModes` keys from the same JSON.
- After an agent frontmatter edit, AAS (like everyone) runs `make bundles`.

## Algorithm / approach

### `make bundles` (render, idempotent)
1. `load` and validate `bundles.yaml`. For every agent listed anywhere, run `agent_frontmatter` (strict
   parse, alias check).
2. `render` the marketplace dict (fixed key order), the link map
   (`bundles/<b>/skills/<s>` → `../../../skills/<s>`, `bundles/<b>/agents/<a>.md` →
   `../../../agents/<a>.md`) and the catalogue dict (D6).
3. `write` both JSON files, run `rmtree("bundles")`, `os.symlink` every link, and sync `package.json`.

Unchanged inputs produce byte-identical files and the same link set. Delete-then-recreate is the
idempotency mechanism.

### `gate_errors` (read-only, inside `make lint`)
- If `marketplace.json` or `tools/opencode-catalogue.json` bytes differ from the render, report
  `<file> is stale — run make bundles`.
- For each expected link, report `missing link`, `not a symlink (copy?)` or `wrong target` as it
  applies. Report any other entry under `bundles/` as `orphan`.
- If the `version` in `marketplace.json`, `tools/opencode-catalogue.json` or `package.json` differs
  from `VERSION`, report a version-sync error.

### Worked example — adding a skill `foo` to `meaningfy-core`
1. Author `skills/foo/`, with a quoted `description` if it contains `: `.
2. Add `foo` to `meaningfy-core.skills`.
3. `make bundles` creates `bundles/meaningfy-core/skills/foo`, and `tools/opencode-catalogue.json`
   gains `foo`. `marketplace.json` is unchanged.
4. Run `make skill-inventory`, then `make validate`.
5. Later edits to `skills/foo/SKILL.md` need no regeneration.

### Worked example — opencode install of `meaningfy-building` with `--global`
1. Load the catalogue and the map.
2. Run the pre-write check of 9 skill directories and 3 agent files. It refuses if any of them is
   unmanaged, unless `--force` is given.
3. Copy the skills atomically to `~/.config/opencode/skills/`, without `__pycache__`.
4. Render and write `~/.config/opencode/agents/{code-reviewer,epic-planner,implementer}.md`, each via
   a temp file and a rename.
5. Print the `gap:` lines (`code-reviewer`: `NotebookEdit`; `implementer`: tool `Skill`;
   `epic-planner`: tool `AskUserQuestion`).
6. Write the manifest last, with 9 `managedSkills` and 3 `managedAgents`.

With `--target`, the same run skips steps 2–4 for agents and prints the D7 notice.

### Verification counts
Skills / agents per bundle at the release fresh install: `meaningfy-core` 5/0 ·
`meaningfy-consulting` 5/0 · `meaningfy-architecture` 4/0 · `meaningfy-building` 9/3 ·
`vault-assistant` 9/0. These are release-time facts and are not written into the normative specs
(F14).

### Test case specifications

Unit tests (Python, `tests/test_bundle_gen.py`):

| ID | Component | Input | Expected output | Edge cases |
|---|---|---|---|---|
| TC-01 | `render` marketplace | 2-bundle fixture, `VERSION` 1.2.3 | Entries `{name, description, source: "./bundles/<n>"}` only; `metadata.version` = "1.2.3" | `agents: []`; unicode kept |
| TC-02 | `render` links | Bundle `b`, skills `[s]`, agents `[a]` | `{"bundles/b/skills/s": "../../../skills/s", "bundles/b/agents/a.md": "../../../agents/a.md"}` | No `agents/` entry when the list is empty |
| TC-03 | Determinism | `write` twice | Identical bytes and link set; `gate_errors` == [] | `bundles/` absent at first |
| TC-04 | Stale gate | Edit a description after `write` | `marketplace.json is stale` | Catalogue stale after an agent `color` edit |
| TC-05 | Link gate | Delete a link; replace one with a copy; add an orphan | missing / not a symlink / orphan | Wrong target |
| TC-06 | Version-sync | `package.json` ≠ `VERSION` | Error naming `package.json` | Catalogue `version` ≠ `VERSION` |
| TC-07 | `load` schema | Unknown key `requires`; missing `description`; duplicate name; missing `agents` | `ValueError` naming key and bundle | Uppercase name |
| TC-07b | `load` shape | Valid fixture | Return value equals the D4 shape, `bundles` in file order | — |
| TC-23 | `agent_frontmatter` | Agent with `description: a: b` unquoted; agent with `model: zzz` | `ValueError` naming the agent (not valid YAML / unknown alias) | Folded `description: >` parses |
| TC-24 | Catalogue render | Fixture agent | `agents.<stem>` equals the parsed frontmatter; `bundles[*].agents` lists stems | Agent with no `skills` |
| TC-22 | Live repo | Real tree | `gate_errors(REPO) == []` | — |

Unit tests (Python, `tests/test_repo_lint*.py`):

| ID | Check | Input | Expected | Edge |
|---|---|---|---|---|
| TC-08 | `expected_bundle_membership` | Skill in two bundles | `skill 'x' is in multiple bundles` | — |
| TC-09 | `unregistered_skill_dirs` | `skills/x/` in no bundle | Error naming `x` | — |
| TC-10 | `agent_bundle_membership` | Agent in no bundle; in two; listed without a file | Exactly: `agent 'a' is in no bundle in bundles.yaml` · `agent 'a' is in multiple bundles: b1, b2` · `bundles.yaml lists agent 'a' but agents/a.md does not exist` | — |
| TC-11 | `missing_skill_dirs` | Listed `x` without a file | Error naming `x` | — |
| TC-11b | `frontmatter_strict_yaml` | `description: Use for: x` unquoted in a skill; same in an agent | One error each, naming the path | Quoted value passes |
| TC-12 | Bundle names | Bundle `meaningfy-devops` | **No** error | — |
| TC-26 | `agents_canonical_invariant` | `CLAUDE.md` containing `<!-- gitnexus:start -->` | `CLAUDE.md contains a gitnexus block…` | Absent → OK |

Unit tests (node, `tests/opencode-bundle-installer.test.mjs`). The fixture has `skills/`, `agents/`,
`tools/opencode-catalogue.json` and `tools/opencode-agent-map.json`:

| ID | Component | Input | Expected | Edge |
|---|---|---|---|---|
| TC-13 | `renderAgent` model | `model: "opus"` | `model: anthropic/claude-opus-4-8` | No `model` → field omitted |
| TC-14 | `renderAgent` tools | `tools [Read, Bash, Skill]`, `disallowedTools [Write, NotebookEdit]` | `read: true`, `bash: true`, `edit: deny`; gaps `Skill`, `NotebookEdit` | Multi-line description kept |
| TC-15 | Install/uninstall | Bundle with skills `[alpha, beta]`, agents `[ag]`, `--project` (cwd = tmp) | `.opencode/skills/{alpha,beta}`, `.opencode/agents/ag.md`, manifest `managedAgents: ["ag"]`; uninstall removes all of it | `--target T`: skills in `T`, **no** agent written, gap notice printed |
| TC-16 | Refuse overwrite | Unmanaged `.opencode/agents/ag.md` exists | Non-zero exit; `Refusing to overwrite unmanaged agent 'ag'`; file untouched | `--force` overwrites |
| TC-17 | pycache filter | `skills/alpha/__pycache__/m.pyc` | Not copied | — |
| TC-18 | Old manifest | v2.11 manifest without `managedAgents` | Install succeeds and adds the field | — |
| TC-19 | Parity on the live repo | Real catalogue + map + `agents/` | Every agent renders and none throws | — |
| TC-20 | Plugin route | Alias `meaningfy-core` | `skills.paths` = `[<root>/skills/alpha]` | — |
| TC-21 | report | One gapped agent | Parity rows and the gap row on stdout; no file written | — |
| TC-25 | Map is the only table | `opencode-bundle-lib.mjs` source | Contains no `claude-opus` literal; `renderAgent` output uses `map.modelAliases` | — |

Integration tests (release candidate; manual commands in tasks.md 9):

| ID | Flow | Setup | Verification | Teardown |
|---|---|---|---|---|
| IT-01 | Claude fresh install | Fresh `CLAUDE_CONFIG_DIR`; marketplace from the pushed branch | `claude plugin details` per bundle = Verification counts | Delete the scratch config |
| IT-02 | Claude upgrade | Install all five from `develop` (2.11.0), switch the ref to the branch, update | Same counts; no reinstall | Delete the scratch config |
| IT-03 | opencode install from git | `npm exec --package=git+…#<branch> -- skillery-opencode install meaningfy-building --global` with `HOME` = tmp | 9 skill dirs, 3 agents; **and** loader acceptance: `npx skills add meaningfy-ws/skillery#<branch> --list` prints no `Skipped … YAML parse error`; if `opencode` is installed, it lists the 9 skills | Delete tmp |
| IT-04 | Package contents | `npm pack --dry-run` | `skills/…`, `agents/…`, `tools/opencode-catalogue.json`, `tools/opencode-agent-map.json`, the three `.mjs`; nothing under `.opencode/` or `bundles/` | — |
| IT-05 | Cowork / Desktop (manual, best-effort) | Install `meaningfy-core` and `meaningfy-building` from the pushed branch in Cowork or Claude Desktop | Record the skill and agent counts in the PR; if they differ from IT-01, the release note says so | Uninstall |

### Anti-patterns

| ❌ Don't | ✅ Do instead | Why |
|---|---|---|
| Hand-edit `marketplace.json`, `tools/opencode-catalogue.json` or anything under `bundles/` | Edit `bundles.yaml` / the agent, then run `make bundles` | The gate fails; a hand edit is the drift surface this change removes |
| Replace a `bundles/` symlink with a copy "for Windows" | Keep symlinks; document `core.symlinks` | It recreates the duplication; the gate flags `not a symlink` |
| Put a model alias or tool name in `.mjs` or `.py` code | Add it to `tools/opencode-agent-map.json` | Two tables drift (`opus` → two ids); contract item 3 |
| Parse YAML in the installer | Read the generated JSON | That adds an npm dependency and a second parser of one schema (D6) |
| Re-parse `bundles.yaml` in lint, inventory or a sibling | Call `bundle_gen.gen.load` | One validator; the contract read seam |
| Put `..` paths in a `plugin.json` | Use the rendered symlink tree | Claude rejects any path that escapes the plugin root |
| Give marketplace entries a `version` | Leave it out | A pinned version blocks `claude plugin update` |
| Leave a `description` with an unquoted `: ` | Quote it | opencode and `npx skills` silently skip the skill (F3) |
| Test Claude agent loading from a local-path marketplace | Use the pushed branch | Local-path marketplaces load 0 agents under (b) (spike) |
| Install agents with `--target` | Use `--global` or `--project` | It could write opencode agents into `~/.claude/agents/` (F10) |

## Error matrix

| Failure mode | Expected handling |
|---|---|
| `bundles.yaml` has an unknown or missing key, or a duplicate or non-kebab name | `load` raises `ValueError` naming it; `make bundles` exits 1; `make lint` reports it under `bundle_gates` |
| Agent frontmatter is not strict YAML, or names an unknown model alias | `agent_frontmatter` raises, naming the agent; `make bundles` exits 1; `frontmatter_strict_yaml` / `bundle_gates` fail; nothing ships |
| Skill frontmatter is not strict YAML | `frontmatter_strict_yaml` names the path |
| A listed skill or agent has no file | `missing_skill_dirs` / `agent_bundle_membership` |
| A skill or agent is in no bundle, or in two | Membership checks (messages D5) |
| A rendering is stale or hand-edited | `bundle_gates`; the fix is `make bundles` |
| `VERSION` bumped without `make bundles` | A version-sync error naming each file |
| opencode install meets an unmanaged skill or agent | Refuse with the path; nothing is written (all checks run first); `--force` overrides |
| `tools/opencode-catalogue.json` missing or malformed in the package | `loadCatalogue` throws `Cannot read Skillery catalogue at <path>` before any write |
| Interrupted install | Skill dirs use temp + rename (`copyDirectoryAtomic`) and agent files use temp + rename. The manifest is written last, so a re-run converges |
| `--target` used | Skills installed, agents skipped, gap notice printed |
| Windows clone without `core.symlinks` | Links arrive as text; the bundle loads 0 skills. Prerequisite in `setup-claude.md` Step 1; existing users remove and re-add the marketplace (D15.3) |
| Maintainer tests from a local-path marketplace | Agents load 0; `setup-claude.md` "Testing a branch" points to the pushed branch |

## Risks / Trade-offs

- **[Windows symlinks]** ASSUMPTION: users run Linux or macOS. The mitigation is the prerequisite and
  the re-add instruction. If Windows users appear, reopen DEC-5 (c); the gate already tells copies
  from links.
- **[GitHub path parity]** ASSUMPTION: a GitHub-hosted marketplace follows the same clone-then-copy
  path the spike exercised over git-HTTP. The review confirms that GitHub hosting clones (F19), and
  IT-01 runs against the real branch.
- **[Cowork / Desktop]** Untested (D19, IT-05). The CLI is the verified surface.
- **[Generated catalogue]** One more committed rendering, and a regeneration step on agent
  frontmatter edits. The gate names the step.
- **[Reviewability]** Rendered opencode agents are invisible in PRs. `make opencode-report` and TC-19
  replace that view.
- **[Sibling coupling]** `agent-authoring-standard` must consume the contract (items 2–5 and the
  amendment): JSON tables, node tests, `agent_bundle_membership` extension, pushed-branch
  verification. Its PLAN needs a PLAN-level revision. This change does not edit that folder.
- **[Release version]** 3.0.0. ASSUMPTION: no other release lands first.

## Open Questions

None blocking. The ASSUMPTIONs (Windows, GitHub path parity, Cowork parity, release ordering) each
name their fallback task. The lead decisions remove the earlier open points (MAJOR vs MINOR, merge
owner).

## Review disposition

| Finding | Severity | Disposition | Where / reason |
|---|---|---|---|
| F1 — mapping location | BLOCKER | **Accepted** | `tools/opencode-agent-map.json` (D6, contract item 3), TC-25; the cross-EPIC contract is adopted verbatim |
| F2 — MINOR contradicts §6 | MAJOR | **Accepted** | 3.0.0 (D15, R7, tasks 8.1–8.2) |
| F3 — strict YAML in 12 skills | MAJOR | **Accepted** | D18, lint `frontmatter_strict_yaml`, task 1.0, IT-03 loader check, R8 |
| F4 — Cowork unverified | MAJOR | **Accepted** (as risk + manual step, per lead) | D19, IT-05, migration note item 5 |
| F5 — merge has no owner | MAJOR | **Accepted** | D20, task 7.12 (proposal line, per lead, rather than an `inputs/` note) |
| F6 — checklist items lost; DEC-8 untasked | MAJOR | **Accepted** | D13 mapping table, one new §9 line, task 7.13 (`spec/skill-repo-governance.md`) |
| F7 — `load` shape unspecified | MAJOR | **Accepted** | D4 shape, TC-07b |
| F8 — duplicated agent-membership lint | MAJOR | **Accepted** | `agent_bundle_membership` with the three messages (D5, TC-10); `catalogue-governance` owned here |
| F9 — stale `bundle:` field claim | MINOR | **Accepted** | Non-Goals and Risks rewritten; pushed-branch rule (contract item 7) |
| F10 — `--target` agent placement | MINOR | **Accepted** | Agents only for `--global`/`--project` (D7, TC-15 edge) |
| F11 — `renderAgent` strictness | MINOR | **Accepted** (moved to Python) | Strict parse in `agent_frontmatter` (D4), TC-23 |
| F12 — `yaml` dep, two validators, lockfile | MINOR | **Accepted, resolved differently** | No dependency at all (lead decision 7, D6); Python is the only validator; no lockfile needed |
| F13 — task gates misfire / red window | MINOR | **Accepted** | Narrowed greps; `skill_inventory.py:230` in task 3.1; commit boundaries in tasks.md |
| F14 — specs hard-code counts | MINOR | **Accepted** | Delta scenarios phrased by `bundles.yaml`; "besides the install manifest"; the upgrade fact moved to IT-02/CHANGELOG |
| F15 — Windows upgrade path | MINOR | **Accepted** | D15 item 3, task 8.2 |
| F16 — D14 fragile | MINOR | **Accepted (guard)** — kept in scope because the human's brief names it | Lint check (D5, TC-26) |
| F17 — nesting alternative unrecorded | MINOR | **Accepted** | D3 alternatives |
| F18 — "one checklist" scope | MINOR | **Accepted** | `catalogue-governance` scenario scoped; `docs/ai-coding/` excluded |
| F19 — spike confirmed | MINOR (info) | **Noted** | No change |

## Clarity gate scorecard (full gate, re-scored after hardening)

| # | Checklist item | Result |
|---|---|---|
| 1 | Anti-patterns ≥5, specific | ✔ 10 rows |
| 2 | ≥5 unit + ≥3 integration tests, with edge cases | ✔ 28 unit, 5 integration |
| 3 | Error matrix with retry/idempotency | ✔ 13 rows |
| 4 | Concrete examples | ✔ schema, catalogue JSON, two worked examples, exact messages |
| 5 | Claims grounded | ✔ spike re-verified (F19); 12-skill strict-YAML list reproduced with PyYAML |
| 6 | Assumptions visible | ✔ 4 `ASSUMPTION:` items, each with a fallback |
| 7 | Single source | ✔ one parser (PyYAML), one table file, one checklist, one membership check |
| 8 | Design why / tasks what | ✔ |
| 9 | Dependencies and order | ✔ roadmap + commit boundaries (no red pushed commit) |
| 10 | Acceptance per task | ✔ |
| 11 | Scope / no-gos | ✔ including the one allowed frontmatter edit |
| 12 | Reference clarity | ✔ seams typed (D4), file paths, messages verbatim |
| 13 | MECE | ✔ membership none/one/two; install target global/project/target; YAML valid/invalid |

Rubric: actionability 9.5 · specificity 9.5 · consistency 9.0 · structure 9.5 · disambiguation 9.0
· reference clarity 9.5 → **9.3 / 10, PASS**.

Remaining deductions:
- **Consistency:** the sibling PLAN still has to be revised to the contract. That is outside this
  folder, and Risks names it.
- **Disambiguation:** Cowork and the Windows behaviour rest on assumptions that are checked only at
  release (IT-05, docs).

## Implementation notes

Applied 2026-10-26 on `feat/single-source-and-agent-standard`, working tree only (no commit, push or
tag, per the human's instruction). Every commit boundary C1–C6 was checked with a green
`make validate` before moving on.

**Baseline (0.1).** `make validate`: lint OK, 94 passed. `make validate-spine`: 25 passed, 4 failed,
the four known shaping-only siblings (`add-devops-bundle`, `add-sales-bundle`,
`fix-accumulated-skill-defects`, `skill-crafting-method`). The same four still fail at 9.1.

**Deviations from the PLAN (each the smallest correct option):**
1. **C1 also touched the 12 `.opencode/skills/*/SKILL.md` mirrors.** The drift gate still existed at
   C1, so `make generate-opencode` was run after quoting. The tree is deleted in C3 anyway.
2. **Task 7.2 (`CLAUDE.md` loses its gitnexus block) was pulled forward into C2.** The TC-26 lint
   check added in 2.2 fails on the real repo until the block is gone, so C2 could not be green
   otherwise.
3. **A temporary bridge in `opencode_gen.bundle_membership` (C2 only).** Once `marketplace.json`
   lost its `skills` lists, the old generator rendered empty bundles and `tests/test_opencode_gen.py`
   went red. The bridge read `bundles.yaml` when present. It was deleted with the module in 5.1.
4. **5.1 used `rm -r`, not `git rm -r`.** This keeps the index untouched, since nothing is committed
   in this run. `git status` shows the deletions as unstaged.
5. **4.2 RED was a whole-file import failure.** The new lib exports did not exist, so the three
   retained behaviours could not run either. They passed again from 4.4 on.
6. **4.5 needed no code edit.** `opencode-plugin.mjs` already gets `SKILLS_ROOT` through
   `skillDirectories`' default, and TC-20 passes.
7. **`gate_errors` returns `load`/`agent_frontmatter` `ValueError`s as gate errors** instead of
   raising. This is how `make lint` "reports it under `bundle_gates`" (error matrix). When
   `bundles.yaml` is invalid, the membership checks skip (`_bundle_list` returns `None`), so the fault
   is reported once. That skip came from post-review fix 4; before it, the checks flooded.
8. **The `--target` agent notice prints only when the selection has agents.** A `meaningfy-core`-only
   `--target` install has nothing to skip.
9. **The rendered agent field values are JSON flow scalars** (`model: "anthropic/claude-opus-4-8"`),
   per D6. The TC-13 table's unquoted form was read as illustrative.
10. **CHANGELOG / README.** The migration-note anchor is `CHANGELOG.md#300---2026-10-26`, and the
    release date is 2026-10-26.

**Integration tests run locally (the branch is not pushed).** These used spike-dec5's method on a
scratch copy of the working tree: a scratch bare repo at `develop` (2.11.0) plus one scratch commit
of the working tree, served over local smart-HTTP git, with a fresh `CLAUDE_CONFIG_DIR` and `HOME`.
Neither the real `~/.claude` nor `~/.config/opencode` was touched.
- **IT-02 (upgrade):** the 2.11.0 baseline showed 5 bundles × 3 agents = 15 registrations and a
  57 MB cache. After `marketplace update` + `plugin update` (no reinstall) the counts were core 5/0,
  consulting 5/0, architecture 4/0, building 9/3, vault 9/0.
- **IT-01 (fresh):** the same counts, a 1.9 MB cache, and 0 symlinks in the cache.
- **IT-03:** `npm exec --package=git+http://…#develop -- skillery-opencode install meaningfy-building
  --global` installed 9 skills and 3 agents and printed the three expected `gap:` lines.
  `npx skills add <url> --list` found 32 skills and skipped 0. `opencode` is not installed, so its
  own listing was not run.
- **IT-04:** `npm pack --dry-run` packs 219 files: `skills/` (208), `agents/` (3), the two
  `tools/*.json` files, the three `.mjs`, README, LICENSE and package.json. Nothing comes from
  `.opencode/` or `bundles/`, and there is no bytecode.
- **IT-05:** not run.

**Still owed on a pushed branch:** 6.1 (CI job green on GitHub), 9.2/9.3 (IT-01…IT-04 against
`meaningfy-ws/skillery#<branch>`) and 9.4 (Cowork / Desktop). 10.x is owed after the merge.

**GitNexus.** Before the edits, impact on `opencode_gen.gen.bundle_membership` was **CRITICAL**
(7 symbols, 6 flows, all inside the deleted module; its one outside caller,
`repo_lint.opencode_tree_gates`, was replaced in the same boundary). `repo_lint._bundle_membership`,
`skill_inventory._bundles` and `opencode-bundle-lib.loadCatalogue` were LOW. After a re-index with
`--skip-agents-md`, which left AGENTS.md and CLAUDE.md byte-identical, `detect_changes(compare,
develop)` reports changed code symbols only in `tools/repo_lint/lint.py`, `tools/skill_inventory.py`,
`tools/opencode-bundle-lib.mjs`, `tools/skillery-opencode.mjs` and the tests. `tools/bundle_gen` is
new and untracked; `tools/opencode_gen` is deleted. It also lists `spine/README.md`,
`prompts/README.md`, `hooks/README.md` and two archive inputs as "touched", but `git diff develop`
on them is empty, so these are index false positives.

**Post-review fixes** ([`review-implementation.md`](review-implementation.md), lead decision; each
fix was test-first):
1. **Kebab-case names are enforced as path segments.**
   - `bundle_gen.load` checks every skill and agent name, not just bundle names.
   - The installer checks catalogue and install-manifest names (`assertSafeNames`) before any path
     join or `rm`.
2. **`--target` never touches agents.** Without an agents root, `install` and `uninstall` leave
   `managedAgents` as it is and list no agent removal.
3. **`install` prunes on upgrade.** It removes the skills and agents this manifest managed that are no
   longer in any installed bundle. User files are never touched.
4. **An invalid `bundles.yaml` is reported once**, by `bundle_gates`.
5. **Doc fixes:**
   - the Makefile comment;
   - the proposal Appetite (major);
   - the dev-method §9 provenance pointer to `spec/skill-repo-governance.md`;
   - `make generate-opencode` → `make bundles` in the open changes `define-ai-domains`,
     `define-blc-engagement-model` and `define-roles-and-raci`;
   - the CONTRIBUTING `git add` line gains the inventory files.
6. **D14 amended: `CLAUDE.md` imports the manual with `@AGENTS.md`.** Claude Code therefore loads
   the GitNexus rules from their one copy. The block itself is still absent from `CLAUDE.md`, so the
   TC-26 lint guard still passes.
