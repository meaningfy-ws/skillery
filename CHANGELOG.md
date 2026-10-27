# Changelog

All notable changes to the Meaningfy Skillery catalogue are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/), and the
catalogue version is the root [`VERSION`](VERSION) file (`make bundles` writes it into
`.claude-plugin/marketplace.json`, `tools/opencode-catalogue.json` and `package.json`). The version
of record for a release is the git tag `vX.Y.Z`.

Versions at or below `2.4.0` predate this changelog; see the git history and the
`v2.3.0` tag for earlier detail.

## [Unreleased]

### Added

- **The sales agent and five sales skills in `meaningfy-sales`.** Install the bundle to get
  `sales-agent`, which grooms your Odoo pipelines every working day, prepares meetings and drafts,
  and asks you only through decision cards at the top of its run note. Its skills: `sales-operations`,
  `sales-pipeline-custody`, `sales-accounts`, `sales-qualification`, `sales-conversations`. It needs
  Odoo, Google Workspace and a `sales-config.yaml` in your vault; setup and scheduling are in
  [`docs/environment/sales-agent.md`](docs/environment/sales-agent.md).
  Its daily note is one file a day: a morning plan (whom to talk to, answer or chase, re-checked
  against Odoo so finished work is not carried) and an evening record that gives every deal touched
  a next step. Every item needing attention is listed, ranked P1–P3 with day-over-day counts; the
  weekly review and plan caps your daily actions. Say "Owner: <deal> is won" or "lost" and it is
  done. Your booking link and an offer catalogue note (offerings, commercial structures, approved
  prices) live in your vault configuration.
- **Decision cards.** `executive-communication` now owns the shape of a request a reader decides
  later and alone; `meaningfy-voice` gains the outreach-email channel.

### Changed

- **The offer ladder is renamed:** the Light tier is now the **discovery workshop**, the Deep tier the
  **Proof of Value**, and the build that follows it **Scaling**. What each includes is unchanged.
- **Qualification has one owner:** `sales-qualification` holds the prospect questions;
  `semantic-consulting-coach` keeps the coaching posture, and `proposal-writing` starts from a
  qualified need.

## [3.4.0] - 2026-10-27

### Fixed

- **Claude Desktop can add the marketplace.** Add `meaningfy-ws/skillery` in Claude Desktop (it reads
  the default branch, `develop`) and install any bundle. The cause was a missing
  `.claude-plugin/plugin.json` in each bundle, which claude.ai's marketplace sync needs; every bundle
  now ships one. Install ids are unchanged.

### Changed

- **`bundles/` is committed on every branch, `develop` included**, as generated links into `skills/`
  and `agents/` plus one `plugin.json` per bundle, so the default branch is always installable on
  Claude Desktop.
- **Each bundle's version lives in its `plugin.json`** (from `VERSION`); `/plugin` still shows the
  release number.

### Action needed (contributors)

- **Run `make bundles` after any change to `bundles.yaml` or the root `VERSION`** and commit the
  result; `make validate` fails on a stale link or `plugin.json`. Never edit `bundles/` by hand.
- **Test unreleased work from GitHub, not a local folder:** the Claude Code CLI skips symlinked agent
  files when a marketplace is added from a local path.

## [3.3.1] - 2026-10-27

### Action needed (users)

- **Install from the `releases` branch** (it replaces `dist`): on Claude,
  `/plugin marketplace remove meaningfy-skillery`, then
  `/plugin marketplace add meaningfy-ws/skillery#releases` and reinstall your bundles; on opencode,
  use `git+https://github.com/meaningfy-ws/skillery.git#releases`. A marketplace added from
  `develop` (the default) or `#dist` does not follow releases.

### Changed

- **`/plugin` shows the release number** (each bundle carries `VERSION`) instead of a commit id.
- **Release tags are on the `releases` branch**, so `meaningfy-ws/skillery#vX.Y.Z` installs one exact
  release (from the next release on).
- **Bundles on `releases` are real files, not symlinks**, so the marketplace syncs on claude.ai and
  Claude Desktop too (re-add it there after the next release), and Windows no longer needs
  `core.symlinks`.

### Action needed (contributors)

- **[`docs/development/releasing.md`](docs/development/releasing.md) is the release convention:**
  `.github/workflows/releases.yml` (was `dist.yml`) publishes `releases` and tags it when a
  `release/X.Y.Z` merge lands on `main`; do not tag by hand.

## [3.3.0] - 2026-10-27

### Action needed (users)

- **opencode installs now come from the `dist` branch too:** replace `#develop` with `#dist` in the
  `npm exec --package='git+https://github.com/meaningfy-ws/skillery.git#…'` command and in
  `npx skills add meaningfy-ws/skillery#…`. Only released skills and agents are installable on
  either CLI.
- **Claude Code installs now come from the `dist` branch.** `develop` no longer carries the
  generated `bundles/` tree, so a marketplace added from `meaningfy-ws/skillery` stops loading the
  bundles. Re-add it once: `/plugin marketplace remove meaningfy-skillery`, then
  `/plugin marketplace add meaningfy-ws/skillery#dist`, then reinstall your bundles
  (`/plugin install <bundle>@meaningfy-skillery`). `dist` moves at each release; later updates work as
  before with `/plugin marketplace update`. opencode installs are unchanged.
- **`proposal-writing` and `estimation` moved from `meaningfy-consulting` to the new
  `meaningfy-sales` bundle**, which requires `meaningfy-consulting`. If you use either skill, install
  `meaningfy-sales`: on Claude, `/plugin install meaningfy-sales@meaningfy-skillery`; on opencode,
  `skillery-opencode install meaningfy-sales`. `meaningfy-consulting` keeps
  `semantic-consulting-coach`, `decision-package` and `executive-communication`.

### Added

- **`meaningfy-voice`** in `meaningfy-core`: the Meaningfy company voice profile as its own
  foundation skill, so every skill that writes for Meaningfy loads the same voice. Installing
  `meaningfy-core` brings it.
- **Three agents:** `system-architect` and `conceptual-modeller` (in `meaningfy-architecture`) are
  thinking partners that design a system or build a domain model with you, saying what they think
  and plan before each step; `proposal-writer` (in `meaningfy-sales`) turns a client's requirements
  into a proposal or offer email. All three are `experimental`.
- **[`docs/future-features.md`](docs/future-features.md):** every feature still to build, which use
  cases it serves, the material it needs, and the change that will build it. It replaces the roadmap
  in `docs/catalogue-architecture.md`.
- **Voice channel placeholders** in `meaningfy-voice` (`references/channels/`: LinkedIn, blog,
  offer, internal message); until each is written, the default voice applies.
- **Three more use cases:** advisory engagement (UC-W22), client delivery and project management
  (UC-W23) and content creation for LinkedIn and blogs (UC-W24); every skill now serves at least one
  use case.
- **The use-case catalogue** (`use-cases/`, 21 White use cases) and its gap map
  [`docs/use-cases.md`](docs/use-cases.md): what the catalogue serves today, by area and status.
- **Four `area` facet values:** `operations`, `business`, `legal`, `design`.
- **[`docs/catalogue-architecture.md`](docs/development/catalogue-architecture.md):** the catalogue's model, where
  each part lives, and the proposed target bundles, agent roster and roadmap.
- **[`evals/README.md`](tests/evals/README.md):** how to run a skill's trigger set or an outcome suite, and
  that every model run is approved with its estimate first.

### Changed

- **Every use case is written out in full:** who is served and how, the steps (with the points
  where you decide), what comes out, how success is shown, how a miss becomes a fix, and what is
  released or planned. Each says how confident its text is and what only the owner can answer.
- **`project-setup` now copies the OpenSpec `meaningfy` schema when installed:** the schema ships in
  the skill (`assets/openspec-schema/meaningfy/`); the old path never resolved.
- **`semantic-consulting-coach` carries Meaningfy's engagement lifecycle**
  (`references/engagement-lifecycle.md`, moved from `docs/ai-sales/`), so an installed coach has
  the commercial model it applies.
- **`linkml-engineering` ships its Neo4j generators** in `scripts/linkml_neo4j/`, so an installed
  skill has them. `project-setup`'s `scaffold.sh --neo4j` takes their folder from
  `--linkml-generators` (or `LINKML_NEO4J_DIR`) when the skills are installed.
- **Installed skills no longer carry links that lead nowhere:** links into this repo's docs and
  five broken links to old skill paths are gone; each skill states the fact or names the skill.
- **The README's documentation section has three doors:** Install, Use (starting from the use cases)
  and Develop.
- **UC-W8, UC-W19 and UC-W20 are full use cases:** stakeholders, preconditions, minimal guarantees
  and a main success scenario, which their agents' scenarios follow. UC-W19 and UC-W20 are now
  `covered`; UC-W8 stays `partial` until the company-style PDF exists.
- **`linkml-engineering` and `modelling-conventions` have trigger probes** against their
  neighbours, so a request about LinkML authoring or modelling conventions is checked to reach the
  right skill.
- **Related links between skills are now reciprocal or deliberately one-way:** nine pairs gained
  their return link; eleven stay one-way as a "see also" sentence.

### Action needed (contributors)

- **A use case follows [`docs/development/use-case-template.md`](docs/development/use-case-template.md):**
  the Cockburn core plus Extensions, Out of Scope, Artefacts, Evidence, Feedback Loop, Slices and Open
  Points (with a confidence rating); `use_case_catalogue` fails a missing section.
- **A skill or agent in no bundle is work in progress, not an error.** It may live on `develop`; the
  catalogue map lists it under "Unreleased (WIP)", `dist` leaves it out of every release, and nothing
  released may delegate to or load it (`wip_isolation`). Listing it in `bundles.yaml` releases it.
- **Folders moved (git history follows each file):** `docs/development-method.md` →
  `docs/development/README.md`, the method's one home, which also holds `docs/catalogue-architecture.*`,
  `spec/*.md` (now `creating-skills.md`, `governance.md`, `agent-template.md`, `skill-template.md`,
  `agent-skills-spec.md`), the spine docs (`spine/README.md` → `spine.md`) and the hook docs;
  `spine/golden-thread.md` → `skills/epic-planning/references/`; `spine/openspec-version.txt` →
  `openspec/`; `hooks/inventory.yaml` → `hooks.yaml`; `prompts/global-prompt.md` →
  `docs/environment/` (the AGENTS template is `project-setup`'s); `evals/` → `tests/evals/`;
  `docs/{ai-coding,ai-consulting,ai-sales,engineering-standards,philosophy}/` and
  `docs/roles-and-raci.md` → `docs/practice/`; `tools/linkml_neo4j/` →
  `skills/linkml-engineering/scripts/linkml_neo4j/`. Only `skills/`, `agents/`, `use-cases/`,
  `openspec/`, `docs/`, `tools/`, `tests/`, `.github/` and `.claude-plugin/` may sit at the top level
  (`top_level_folders`), and a skill may link nothing outside its own folder (`cross_skill_paths`).
- **`bundles/` is no longer committed:** it is git-ignored, `make bundles` creates it locally, and
  `.github/workflows/dist.yml` publishes it on `dist` at each release. To test unreleased work on
  Claude Code, push a throwaway branch with the tree force-added (`git add -f bundles`).
- **The `purpose` facet now names Meaningfy's activities:** `software-development`, `modelling`,
  `client-delivery`, `advising`, `content`, `offers`, `proposals`, `crm`, `devops`, `knowledge`
  (`facets.yaml`). `writing`, `offering`, `planning`, `building`, `quality` and `delivery` are gone;
  every skill and agent is re-tagged, and a new skill or agent picks the activity it serves.
- A skill never links into another skill's folder; it names the skill (`cross_skill_paths` in
  `make validate`). A resource two skills need moves into a foundation skill.
- A file in `use-cases/` must pass `use_case_catalogue`; `make skill-inventory` renders the gap map.
- **The `dist` branch** is published by `.github/workflows/dist.yml` on each release tag `v*`: the
  release's tree plus the generated `bundles/` links, one appended commit per release, tagged
  `<tag>-dist`. Its commits never enter `develop`; never edit or force-push it.
- **External dependencies live in [`dependencies.yaml`](dependencies.yaml)**, one entry each (source,
  pin, provenance, opencode status, per-CLI install). The dependency tables in
  `docs/environment/dual-cli/compatibility.md` and `mcp-setup.md` are generated from it by
  `make skill-inventory`; edit the register, not the tables (`dependencies_register` and the drift
  test in `make validate`).
- A `partial` or `missing` use case must name a `change` listed in `docs/future-features.md`
  (`use_case_changes_registered` in `make validate`).
- Every skill and agent must appear in some use case's `served_by` (`use_case_coverage` in
  `make validate`); a new one comes with its use case.
- A skill's trigger set lives in `evals/triggers/<skill>.json` (20 queries, seeded from its probes);
  `executive-communication` has the first one.

## [3.2.0] - 2026-10-26

### Action needed (users)

- **If you use `meaningfy-building`, also install `meaningfy-architecture`.** The developer bundle
  now declares it as a requirement: `cosmic-python` and `project-setup` hand off to the architecture
  skills. On Claude: `/plugin install meaningfy-architecture@meaningfy-skillery`; on opencode:
  `skillery-opencode install meaningfy-architecture`. The catalogue map lists every bundle's
  requirements.

### Action needed (contributors)

- Every skill and agent now declares six facets under `metadata` (`purpose`, `area`, `subject`,
  `posture`, `stage`, `maturity`), each from the vocabulary in `facets.yaml`; `metadata.category` is
  gone. `make validate` fails a missing or unknown value.
- A skill named on another skill's `**Delegates:**` line in a different bundle needs that bundle in
  `requires:` in `bundles.yaml`; `meaningfy-core` requires nothing, and cycles fail validation.
- A new documentation file needs a row in the register (`docs/development-method.md` §8).
- `make validate` now rejects skill frontmatter keys outside the Agent Skills specification (except
  the Claude-only `argument-hint` and `disable-model-invocation`), non-string `metadata` values, and
  descriptions over 1,024 characters. Put a skill version under `metadata.version`, not at the top
  level.

### Changed

- Five skills point to neighbours in other bundles as "related" instead of handing off to them
  (`guardrails`, `estimation`, `executive-communication`, `linkml-engineering`, `vault-setup`), so
  installing one bundle never leaves a hand-off dangling.
- The skill-development method now cites the published methods instead of restating them:
  superpowers `writing-skills` for writing and testing a skill, the agentskills.io specification for
  format, size and descriptions, and OWASP Agentic Skills Top 10 for third-party content.
- Tests are proportionate: a new skill, a boundary move or a discipline rule needs a baseline run; a
  wording, link or description change needs probes only.
- Descriptions say what a skill does and when to use it ("Use this skill when…"); 600 characters is
  the target, reported as an advisory note.
- A rule that must hold every time is a hook in `hooks/inventory.yaml`, not skill prose.
- One authoring guide: `spec/CREATING_SKILLS.md` (CONTRIBUTING.md is now a short entry page; the
  authoring texts went from 1,414 to about 700 lines).

### Added

- The catalogue map (`docs/skill-inventory.md`) shows skills **and agents** by bundle and by facet
  (purpose, area, subject, posture, stage, maturity), with each bundle's requirements.
- The documentation register in `docs/development-method.md` §8: every doc, whether generated or
  hand-written, and what it owns.
- An on-demand GitHub Actions workflow, `plugin-eval`, that runs `claude plugin eval` for one bundle
  with a cost ceiling; it never runs on pull requests or releases and needs the `ANTHROPIC_API_KEY`
  repository secret. A first suite lives in `evals/meaningfy-consulting/`.
- Advisory notes for long descriptions and for skills over the specification's size budget.

## [3.1.0] - 2026-10-26

### Action needed (repos scaffolded with `project-setup`)

- `project-setup` now makes `AGENTS.md` the canonical agent instructions and `CLAUDE.md` a thin
  pointer that imports it, as two regular files. If your repo has the old symlink
  `AGENTS.md -> CLAUDE.md`: remove the symlink, move the content of `CLAUDE.md` into `AGENTS.md`, and
  make `CLAUDE.md` a pointer (`@AGENTS.md`). Repos that are not converted keep working; re-running the
  scaffold reports the symlink instead of replacing it.

### Action needed (vault owners)

1. **Re-run `vault-setup`** from your owner folder. It adds the `.trash/` folder, the root
   `README.md`, the `impact-filter` and `work-shape` templates and the new `skill-change` template,
   and reports the permission changes below. It never overwrites a file you have; compare and copy
   what it reports.
2. **Update your permission settings:** `mv` and `rm` now ask instead of being denied, and the
   scheduled `vault-daily` command line gains `--disallowedTools "Bash(mv:*)" "Bash(rm:*)"` (see
   `vault-setup`'s `scheduler.md`).
3. **Remove your local rules** for `artefacts/`, `07 Perso/` projects and `04 Daily/<agent>/` from
   your vault's `AGENTS.md` ("Vault-specific conventions"): the skills now carry them.

### Added

- **Vault:** you can ask an agent to delete, move or rename notes in the session. It lists the paths,
  names the notes that will show a broken link, moves deleted notes to `.trash/`, and works with
  Obsidian closed when the note's name is unique.
- **Vault:** personal projects live in `07 Perso/` (private, never shared); every project keeps its
  standing files at the root and everything else in `artefacts/`; deployed agents write their run
  notes in `04 Daily/<agent>/`.
- **Vault:** new kinds `impact-filter` and `work-shape`; `vault-promote` checks a kind's required
  sections as well as its properties.
- **Vault:** a root `README.md` that tells a person what each folder is for; agents answer questions
  about your projects from the vault, not from chat memory.
- **Writing:** `writing-antipatterns` flags claims that promise more than the method delivers (U7)
  and verbs impossible for their subject (U8), and treats negative framing by genre (A14).
- **Writing:** `executive-communication` asks for the register first (teach, decide or bind). For a
  quotation, SoW or tender it writes only the cover message and keeps the formal register.

### Changed

- The vault skills resolve projects and move notes through one rule in `vault-conventions`.
- The engineering-standards and dual-CLI setup docs are shorter: they link to the skills instead of
  restating them.
- **`project-setup`:** a scaffolded repo now gets `AGENTS.md` as the canonical agent instructions and a
  thin `CLAUDE.md` that imports it, as two regular files. There is no symlink any more. If your repo
  has `AGENTS.md -> CLAUDE.md`, replace the symlink: move the content into `AGENTS.md` and make
  `CLAUDE.md` the pointer.
- `docs/engineering-standards/coding-prompt.md` keeps its full text; its header now explains that
  `prompts/global-prompt.md` is only a pointer, so there is nothing to keep in sync.
- `prompts/CLAUDE.md.template` is renamed `prompts/AGENTS.md.template`, after the file it fills.
- A vault `skill-change` note now has the fields of the GitHub defect form, so it can be filed as an
  issue by copying.

## [3.0.0] - 2026-10-26

### Action needed

1. **Claude, if you use `epic-planner`, `implementer` or `code-reviewer`:** these agents now come
   only with the `meaningfy-building` bundle. The ids `meaningfy-core:code-reviewer`,
   `meaningfy-consulting:…`, `meaningfy-architecture:…` and `vault-assistant:…` for them disappear.
   Install `meaningfy-building` to keep them.
2. **Claude, everyone:** run `claude plugin marketplace update meaningfy-skillery`, then
   `claude plugin update <bundle>@meaningfy-skillery` for each bundle you have. No reinstall is
   needed.
3. **Windows:** enable Developer Mode and run `git config --global core.symlinks true`. If you added
   the marketplace before that, remove and re-add it (`claude plugin marketplace remove
   meaningfy-skillery`, then `claude plugin marketplace add meaningfy-ws/skillery`): an update keeps
   the bundle links as text files, and the bundle then loads no skills.
4. **opencode:** rerun your install command. With `--global` or `--project` it now also installs the
   bundle's agents; if an agent file of the same name is already there and the installer did not
   put it there, it stops and names the file (move it, or rerun with `--force`). The
   `OPENCODE_CONFIG_DIR=.opencode` direct-checkout route is gone; from a
   checkout, run `node tools/skillery-opencode.mjs install <bundle> --project` instead.
5. **Cowork / Claude Desktop:** this layout was verified on the Claude Code CLI only. If a bundle
   loads different skills or agents there, report it with the Defect issue template.

### Changed

- **Bundles are declared once, in `bundles.yaml`.** Claude bundles now load exactly their own skills
  and agents: 3 agent registrations instead of 15, and a plugin cache of about 1.9 MB instead of
  about 57 MB. opencode installs skills straight from `skills/`, and renders the bundle's agents at install time
  (`--global` / `--project`; `--target` installs skills only). Rerunning `skillery-opencode install`
  removes the skills and agents it installed earlier that no installed bundle carries any more.
- **12 skill descriptions are quoted** (`conceptual-modelling`, `estimation`,
  `executive-communication`, `proposal-writing` and eight `vault-*` skills) so strict loaders
  (opencode, `npx skills`) read them instead of skipping them. The wording is unchanged.
- **Agents follow one written standard** (`spec/agent-template.md`), checked by `make validate`.
  `implementer` no longer commits: it reports, you commit. `code-reviewer` reviews one lens per
  dispatch; ask for a lens (L1–L5), or five for a full review. `epic-planner` returns question rounds
  for you to answer instead of asking mid-run.
- **opencode agents** are rendered from their declared `type` (`mode: subagent` for all three), load
  their skills through a body line instead of an unsupported `skills` field, and get a theme colour.

### Removed

- The committed `.opencode/` tree, `opencode.json` and `make generate-opencode`.
- The opencode direct-checkout route (`OPENCODE_CONFIG_DIR=.opencode`).
- The committed `PARITY.md` / `GAP.md` reports; run `make opencode-report` to print them.

## [2.11.0] - 2026-09-15

### Changed

- **The Meaningfy lifecycle is redefined as three parallel `ai-*` domains**, each with one runbook,
  one Definition of Done and role playbooks: `docs/ai-coding/` (build, tightened; the build plane
  ADLC/MDLC-lite/SDLC replaces the retired two-tier framing), `docs/ai-sales/` (the commercial process,
  new) and `docs/ai-consulting/` (advisory and discovery methodology, new, with named extension points
  for maturity assessment, Wardley mapping and enterprise/process modelling). The Definition of Done
  splits into a Builder's DoD and a Shipper's DoD, and six Meaningfy roles with a RACI matrix are added,
  including the Work Shaper.
- **Commercial model corrected** in `semantic-consulting-coach`, `decision-package` and
  `proposal-writing`: presale is the only free stage; Discovery & Onboarding replaces the P0/P1 labels
  with a Light workshop or a Deep assessment; the outcome is Semantic Layer adoption in six sellable
  building blocks.
- **Environment and tooling docs moved** into one `docs/environment/` cluster (dual-CLI, OpenSpec setup,
  environment setup); `docs/engagement/`, `docs/how-we-work/` and `docs/services/` are retired.

### Fixed

- **`repo_lint` link check**: link targets may hold one level of parentheses and are percent-decoded
  before the existence check, so a filename such as `Handbook (2026) (1).pdf` resolves.
- **Spine validation**: six requirements in the in-flight lifecycle changes now carry their SHALL on
  the first line, as the pinned openspec 1.4.1 requires (no wording changed).
- **`vault-setup`**: the scheduled `vault-daily` run can read mail and calendar and write its note
  headless (read-only connector tools and memory `recall` allowed; `--permission-mode acceptEdits`),
  and the final check covers trusting the vault folder in Claude Code.

## [2.10.0] - 2026-09-15

### Added

- **`vault-assistant` workflow bundle (nine skills).** The skills that maintain a personal Obsidian
  vault: `vault-setup` (bootstrap and check a vault and its tooling), `vault-conventions` (kinds,
  properties, links, binaries, memory etiquette), `vault-project` (charter gate, close and archive),
  `vault-resume` and `vault-capture` (session start and end), `vault-promote` and `vault-tidy`
  (curation after a yes, moves through the Obsidian CLI), `vault-planning` (year, quarter OKRs,
  month, week) and `vault-daily` (the morning note, drafts only). Needs the external
  `obsidian@obsidian-skills` plugin and the company memory. Change: `add-vault-assistant`.

### Changed

- Bundles are four role bundles plus one workflow bundle (`catalogue-governance`,
  `dual-cli-generation`, `dual-cli-distribution`).

## [2.9.0] - 2026-07-24

### Added

- **`writing-antipatterns` skill (`meaningfy-core`).** The register/genre-conditional catalogue of
  how writing fails: a genre map (Tutorial, How-to, Reference, Explanation, Decision, Decision
  record, Contract/specification, Coaching dialogue), a short list of defects that apply regardless
  of genre, and a single-sourced inversion matrix of genre-conditional antipatterns — a rhetorical
  question is craft in an explainer and a defect in an ADR, and the catalogue names exactly where
  each move flips. Per-genre reference files are pointer tables only, never restating an entry, so
  the catalogue doesn't commit its own "uncontrolled duplication" antipattern. Every writing-family
  skill gets a `Related:` cross-link; `explanatory-writing`'s single-home requirement expands to
  include it.
- **Tested Neo4j-targeting LinkML generators (`tools/linkml_neo4j/`).** A Cypher-constraint
  generator and a neomodel OGM generator, vendored as tested repo tooling — not a skill asset, per
  skill-repo governance. Fixes real bugs in the generators' original (external) form: relationship
  targets now resolve correctly against abstract LinkML classes (real Python inheritance mirrors the
  schema's `is_a` hierarchy), existence constraints are emitted for required multivalued
  scalar/enum properties, and an opt-in slot annotation lowers to a generated Neo4j index.
  `project-setup` projects both generators into a consuming repo via a new `--neo4j` scaffold flag,
  conditional on the project using LinkML with a Neo4j target. `linkml-engineering` documents and
  cites the generators without owning them.
- **`docs/skill-inventory.md`, generated.** A skill-by-skill map (purpose, category, dependencies,
  and a related-skills graph) plus per-bundle tables, generated by `tools/skill_inventory.py` with a
  freshness test guarding drift. `README.md` now points here for the per-skill picture instead of
  carrying it inline.

### Changed

- **Install docs rewritten** as a literal, audience-scoped step-by-step (`docs/environment-setup.md`,
  the two per-CLI runbooks, and the reference annex), replacing a narrative walkthrough.
- **README skill count corrected**: 23 skills across the 4 role bundles (was previously stated as 20,
  a stale count predating several additions).

### Fixed

- **`tools/opencode_gen`** no longer mirrors `__pycache__`/`.pyc`/`.pyo` into `.opencode/` when a
  skill directory happens to contain importable Python.
- **CI dependency gap**: `click`, `linkml`, `neomodel`, and `jinja2` — all imported by
  `tools/linkml_neo4j`'s generators and their tests — were missing from `requirements-dev.txt`,
  passing locally only because a dev venv already had them installed. Verified against a genuinely
  clean venv.
- **OpenSpec validator quirk**: its SHALL/MUST keyword check only scans a requirement's first
  physical line, not the full paragraph — a requirement leading with a multi-line list before
  reaching `SHALL` failed `validate-spine` in CI despite reading fine. Worth remembering for future
  spec authoring.
- Archived the `linkml-neo4j-generators` change (completed in a prior session but never archived);
  corrected a stale spec delta in the process — it still named the generators' pre-relocation path.

## [2.8.0] - 2026-07-10

### Added

- **`modelling-conventions` skill (`meaningfy-architecture`).** The shared, representation-agnostic
  modelling-craft layer — naming discipline, modelling anti-patterns, and editor-guiding guardrails —
  reused by the modelling skills the way `cosmic-python` is reused by the build skills. Carries the two
  load-bearing principles: decouple attributes into reusable first-class properties, and identify
  everything by a stable URI (implicit by default).
- **`linkml-engineering` skill (`meaningfy-architecture`).** The operational LinkML craft, positioned
  **downstream of an existing model or spec — never greenfield**: derive LinkML from a UML model / text
  spec / model2owl output / existing model; author with LinkML-specific mechanics (reusable `slots:`,
  the URI-as-datatype artifice, implicit `class_uri`/`slot_uri`, enums, schema-level constraints);
  generate the full target set with custom templates and `make`-target automation (including diagrams)
  and **per-module** output; and establish quality gates **chosen with the user, not imposed**.
  Complete, correct OWL/SHACL generation is a first-class outcome (with MUST-have element lists).

### Changed

- **`conceptual-modelling` refocused.** Sheds its LinkML-operational overhang (relocated to
  `linkml-engineering`) and its generic conventions (relocated to `modelling-conventions`), keeping the
  living conceptual model, UML conceptual modelling, the model-source decision, terminology, and the
  concept-level ontology policy. Boundary/description retuned; delegation pointers added.
- **`project-setup` gains a conditional LinkML branch.** When a project uses LinkML it scaffolds the
  gates, transformation automations, and per-module artefact layout owned by `linkml-engineering`;
  otherwise it skips them.
- **Boundary references repointed** in `architecture` and `cosmic-python` so LinkML authoring/generation
  routes to `linkml-engineering`, not `conceptual-modelling`.

## [2.7.3] - 2026-07-01

### Changed

- **README + CONTRIBUTING made CLI-symmetric and accurate.** The README Installation step is now a
  CLI-neutral intention that links the Claude Code and opencode runbooks as peers; the external-deps
  and "Uninstall & conflicts" sections state the real per-CLI status (7/8 deps work on both CLIs;
  `code-review` is a Claude-only optional runner). `CONTRIBUTING.md` gains the dual-CLI contributor
  path (`make generate-opencode`, CLI-agnostic bodies) and fixes stale/contradictory guidance (the
  `EXPECTED_BUNDLES` claim, the "What's inside" table instruction, the Progressive Disclosure
  example). The `dual-cli/compatibility.md` matrix now classifies every referenced dependency.

## [2.7.2] - 2026-06-30

### Changed

- **Durable spec updated.** The `dual-cli-distribution` capability gains the *Single-home dual-CLI
  authoring rule* requirement (synced from the now-archived `dual-cli-docs-refactor` change): the
  "works on both CLIs" rule has one canonical home (`AGENTS.md`), and install docs form a single
  hierarchy (README → `environment-setup.md` → per-CLI runbooks) with `docs/dual-cli/` as a reference
  annex. No code or behaviour change.

## [2.7.1] - 2026-06-30

### Changed

- **Dual-CLI documentation re-seated.** The README now documents opencode support;
  `docs/environment-setup.md` is the dual-CLI install canon (a "choose your CLI" fork), and
  `docs/dual-cli/` is reframed as the reference annex. The "works on both CLIs" authoring rule is
  consolidated into a single canonical **Dual-CLI authoring rules** section in `AGENTS.md` that the
  other docs link rather than restate. Corrects stale inverted-binding wording and the skill count
  (18 → 20). New `dual-cli-distribution` requirement: *Single-home dual-CLI authoring rule*.

## [2.7.0] - 2026-06-29

### Added

- **Dual-CLI distribution — the catalogue now runs identically on Claude Code and
  opencode from one set of sources.** Skills, agents, command content, and hook
  *intent* are authored once and projected to both CLIs, with verified parity. New
  `dual-cli-distribution` capability spec.
- **opencode tree generator** (`tools/opencode_gen`, `make generate-opencode`).
  Reads the single sources of truth (`skills/`, `agents/`, `marketplace.json`,
  `VERSION`) and emits a deterministic committed `.opencode/` tree — skills
  pass-through, agent frontmatter mapped (model alias → `provider/model-id`,
  tools/`disallowedTools` → opencode tool/permission), four role bundles, and
  `opencode.json` — plus committed parity and gap reports. Anything unmappable is a
  recorded `Gap`, never a silent drop. New `dual-cli-generation` capability spec.
- **Three new gates wired into `make validate`** (via `tools.repo_lint`): **drift**
  (committed tree ≠ regenerated), **parity** (an artifact lacks an equivalent or
  gap on one CLI), and **version-sync** (a tree's version ≠ `VERSION`), plus a
  coverage check that every source artifact is mapped or gap-recorded.
- **Pinned opencode version** in `.opencode-version` (`1.17.11`); the generated
  tree conforms to that version's format.
- **Single-`VERSION` rule** — the root `VERSION` file is now the only version
  source; `marketplace.json` `metadata.version`, `opencode.json`, and the
  `.opencode/` bundle manifest all derive from it and are gate-checked for
  agreement.
- **Hook intent inventory** (`hooks/inventory.yaml` + `README.md` + `bindings.md`):
  single-sourced hook intent classified by mechanism (`git`/`ci`/`agent`) and phase
  (`quality`/`phase-gate`); git/ci bindings are shared across CLIs, agent bindings
  render per CLI.
- **Per-CLI documentation** under `docs/dual-cli/` — Claude and opencode setup
  pages over a shared source→CLI mapping reference, an external-dependency/baseline
  compatibility matrix, per-tool MCP setup templates (no config committed), and the
  skill-body CLI-agnosticism audit.

### Changed

- **Root binding inverted**: `AGENTS.md` is now the canonical, CLI-agnostic
  operating manual (read natively by opencode); `CLAUDE.md` is a thin pointer that
  carries only Claude-specific guidance. The previous symlink between them is
  removed. Maintenance docs note that `.opencode/` is generated and must be
  regenerated with `make generate-opencode` after touching any source.

## [2.6.1] - 2026-06-25

### Fixed

- **PR review now fans out five subagents in parallel, one per lens.** The
  standalone mode gained an explicit *Dispatch contract* — a single combined
  subagent is called out as a defect — fixing the case where only one subagent ran.
- **The review checklist is now catalogue-complete.** The curated subset of ids is
  replaced by a methodical per-lens procedure scoped to a region of the
  `cosmic-python` standard: each lens traverses **every** `PR-*`/`BP-*`/`AP-*` in
  its region plus the matching SKILL sections, so coverage is complete by
  construction and survives catalogue growth. The `code-reviewer` agent is hardened
  to run exactly one lens and refuse a combined pass.

## [2.6.0] - 2026-06-25

### Added

- **Two-mode, five-lens PR review.** `meaningfy-code-review` now defines two
  review modes — **standalone** (the read-only analysis, run as five single-lens
  subagent passes and aggregated) and **interactive** (a thinking-partner protocol
  in the main thread, entered when the developer discusses the PR) — with an
  always-subagent isolation rule that keeps review reasoning out of the
  implementation context.
- **Five review lenses**, one subagent run each, as MECE views over the existing
  checklist: L1 Security & safety, L2 Spec-correctness & tests, L3 Architecture
  conformance, L4 Principles & clean code, L5 Fit, elegance & refactoring. Lenses
  anchor to existing `cosmic-python` catalogue ids — no new ids minted.
- **Fit & refactoring investigation** (lens L5, recommendations-only): assesses how
  new code and the existing code it touches could be refactored for a crisper fit,
  with `gitnexus` blast radius on each candidate.
- New `pr-review-modes` capability spec synced into `openspec/specs/`.

### Changed

- `code-reviewer` agent scoped to **one lens per subagent run** (lens input;
  default dispatches all five), staying read-only and isolated from implementation
  context.

## [2.5.1] - 2026-06-23

### Fixed

- **Spine lifecycle validator hardened against three mechanical flakes** found by
  driving the spine end-to-end:
  - **Archive link depth** — `openspec archive` copied a delta's relative links
    into `specs/` verbatim, leaving over-deep `../` links. Added
    `normalize_spec_links` (a `--fix` mode + `make fix-spec-links`) that recomputes
    depth from the file's location; `broken_links` remains the safety net.
  - **`EXPECTED_BUNDLES` duplication** — bundle membership is now read from
    `marketplace.json` (single source of truth) instead of a hand-kept copy in the
    validator; only the four role names are pinned. Adding a skill no longer edits
    the validator. Placement invariants kept: known role, single home, every skill
    dir registered.
  - **Un-groomed spec `Purpose`** — `make validate` now fails on a `TBD - created
    by archiving` placeholder.

### Changed

- `spec-stewardship` documents the post-archive `make fix-spec-links` step.

## [2.5.0] - 2026-06-23

### Added

- **`explanatory-writing` skill** (`meaningfy-core`) — the craft that makes
  Diátaxis Explanation-quadrant prose read clearly: controlling metaphor,
  concrete-beside-abstract, self-answered question pivots, an 8-axis voice schema,
  positive-default knobs cross-linked to the existing house voice
  (`company-voice.md`, inherited not forked), and variant-batch validation.
- **Writing reference discipline** — writing knowledge lives only in the
  writing-skill family; `technical-writing`, `executive-communication`, and
  `epic-planning` gain by-reference hooks. No bundle reorg.

### Changed

- Archived the `voice-extension-and-enhancement` and `catalogue-ux-and-docs`
  changes, merging their spec deltas into `openspec/specs/`.
