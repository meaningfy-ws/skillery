# Adversarial design review — `single-source-distribution` (PLAN hardening)

> Reviewer: independent design review, 2026-10-26, on branch `feat/single-source-and-agent-standard`.
> Scope: `proposal.md` (R1–R6), `design.md` (D1–D17), `tasks.md`, `spike-dec5.md`, the five delta
> specs, checked against the code they touch, the human's WIP canon (`docs/development-method.md`),
> the sibling `agent-authoring-standard` (read-only), and the live Claude Code docs. The architect's
> files were not edited. Skills applied: `clarity-gate` (full gate), `epic-planning` (PLAN-level vs
> EPIC-level wrongness).
>
> `openspec validate single-source-distribution --strict` (pinned version from
> `spine/openspec-version.txt`) → **`Change 'single-source-distribution' is valid`**. The sibling also
> validates. Structural validity is not in question. The findings below are semantic.

**Counts:** 1 BLOCKER · 7 MAJOR · 11 MINOR.

---

## Findings

### F1 — BLOCKER — The two EPICs disagree on where agent mapping lives; the sibling cannot be built on this PLAN

**Evidence.**
- This PLAN deletes `tools/opencode_gen/` and `tests/test_opencode_gen.py` (tasks.md 5.1) and moves
  `MODEL_ALIASES`/`TOOL_NAMES`/`TOOL_PERMISSION` into `tools/opencode-bundle-lib.mjs`, where they
  "then exist **only** in JS" (design.md D6, lines 143–147; anti-pattern line 351; delta spec
  `dual-cli-generation` "Agent frontmatter mapping": "The mapping tables SHALL exist in exactly one
  place, the installer library").
- The sibling, implemented **after** this one, assumes the opposite (agent-authoring-standard
  design.md lines 33–37, A-1: agents "rendered at install time by
  `tools/opencode_gen/gen.py::map_agent`"). Its lint reads the alias set with
  `from tools.opencode_gen.gen import MODEL_ALIASES` (its design.md line 94, tasks.md 2.2). Its
  `type`→`mode` mapping and the `scheduled` gap are written into `map_agent` (its design.md
  lines 204–208, tasks.md 4.1–4.2), and the tests go into the deleted `tests/test_opencode_gen.py`.
- The sibling's precondition check (its tasks.md 0.1) tests only for `bundles.yaml` and an untracked
  `.opencode/`, so it would pass and then fail with `ModuleNotFoundError: tools.opencode_gen` at its
  task 2.2.
- A-1 also contradicts itself: Python code cannot run "at install time" on a user's machine, because
  the installer is node-only (`tools/skillery-opencode.mjs`; `package.json` has no Python).

**Judgement — which design is right.** Rendering at install has to happen in JS. It runs on the
user's machine from an `npm exec` of a git package, and there is no build or publish step where
Python could pre-render without committing output (and DEC-4 and the human's brief forbid
committing it). So this PLAN is right about where the **renderer** runs. It is wrong to bury the
**tables** inside the `.mjs`. A Python consumer, the sibling's A1 lint ("model is a family alias"),
needs the same alias set, and `make validate` is Python-only (D16). With the tables only in JS,
every option is bad:
- (i) the sibling hard-codes `{opus, sonnet, haiku}` in lint, which is a second copy and breaks its
  own "never a second copy" rule;
- (ii) lint drops the check and relies on the node job in CI, so the local `make validate` misses
  it;
- (iii) Python shells out to node.

"Deletion beats addition" does not save the Python mapper either. Keeping it would mean either
committed agents (which breaks DEC-4) or Python on the user's machine.

**Required fix (this PLAN).**
1. Move the four tables (`modelAliases`, `toolNames`, `toolPermission`, and the sibling's
   `agentModes`, seeded now as `{"primary": "primary", "default": "subagent"}` or left for the
   sibling to add) into one data file, **`tools/opencode-agent-map.json`**. Ship it in
   `package.json` `files`. `renderAgent` imports it, and Python reads it with `json.load` (no import
   of JS, no second copy).
2. Amend D6, the anti-pattern row (line 351) and the `dual-cli-generation` delta ("the mapping tables
   SHALL exist in exactly one place, `tools/opencode-agent-map.json`, read by the installer library
   and by the validator").
3. Add a TC: Python `json.load` of the file equals the keys `renderAgent` uses (or a node test that
   loads the same file).
4. Add a cross-EPIC note to D6/Risks naming the exact seam the sibling must use (see **Cross-EPIC
   contract** below). The sibling's PLAN must then be revised: its task 4 moves to node tests
   (`tests/opencode-bundle-installer.test.mjs`, `npm run test:opencode-installer`), and its lint reads
   the JSON. This is a PLAN-level revision of the sibling, not a re-shape of its bet.

### F2 — MAJOR — The MINOR release contradicts the human's canon definition of "breaking"

**Evidence.** `docs/development-method.md` §6: "breaking = a user must do something (reinstall,
rename, move a file)". The PLAN's own migration note (tasks.md 8.2) is headed **"Action needed"**
and lists three actions:
- (a) install `meaningfy-building` to keep `epic-planner`/`implementer`/`code-reviewer`;
- (b) the documented `OPENCODE_CONFIG_DIR=.opencode` direct-checkout route
  (`docs/environment/dual-cli/setup-opencode.md` lines 170–175) is removed;
- (c) Windows users must enable `core.symlinks`.

A Claude user who invoked `meaningfy-core:code-reviewer` (spike-dec5.md shows it registered under
every namespace) loses that id. For them that is a rename of public surface. `skills/meaningfy-release`
also says "Deprecate before you break" (SKILL.md line 95), and no deprecation cycle is planned. D15's
reading that this "removes an exposure that was never declared" does not survive §6. The definition
turns on user action, not on what was declared.

**Required fix.** Flip the default: D15, DEC-6, tasks.md 8.1/8.2 and the proposal Impact →
**3.0.0**, with MINOR (2.12.0) as the human-override `ASSUMPTION` instead of the other way round.
This costs one string. Do not change DEC-6 silently. Log it as R7 (DEC-6 is an EPIC decision; this
is a logged re-shape, per `epic-planning`).

### F3 — MAJOR — 12 of 32 skills have frontmatter that strict YAML parsers reject; the "loads exactly the bundle" outcome cannot be met on opencode and `npx skills`

**Evidence.**
- PyYAML `safe_load` fails on the frontmatter of `conceptual-modelling`, `estimation`,
  `executive-communication`, `proposal-writing` and `vault-{capture,conventions,daily,planning,
  promote,resume,setup,tidy}`. These are unquoted `: ` inside `description:` at line 2, e.g.
  `skills/estimation/SKILL.md:3`.
- Reproduced with `npx skills add /home/lps/work/repos/skillery --list` and with a clone carrying the
  (b) layout: every one of the 12 prints `⚠ Skipped … YAML parse error: Nested mappings are not
  allowed in compact mappings`. That is eemeli/`yaml`'s message, the same library D6 adds.
- So `vault-assistant` loses 8 of 9 skills via `npx skills`, `meaningfy-consulting` 3 of 5, and
  `meaningfy-architecture` 1 of 4. opencode's own loader was not testable here (no `opencode`
  binary). Any strict YAML loader rejects these files.
- Claude Code tolerates them. So does Python lint, because `_split_frontmatter`
  (`tools/opencode_gen/gen.py` lines 65–84) silently falls back to a line scanner.
- `CONTRIBUTING.md:22` already requires "valid YAML frontmatter".

The proposal's Rabbit-holes ("`npx skills add` already works against flat `skills/`", line 96) and
`docs/development-method.md` §6 assert something that is false today. IT-03 checks files on disk and
the install manifest, not what opencode actually loaded, so this defect would ship with green
counts.

**Required fix.**
1. Add a lint check `frontmatter_strict_yaml` (skills and agents; PyYAML `safe_load` must return a
   dict) with a negative test.
2. Quote the 12 descriptions. This is a mechanical change with no content change, so it does not
   break the "no frontmatter change" no-go in spirit. Name it explicitly in the No-gos as the one
   allowed frontmatter edit. If the human prefers, route it to `fix-accumulated-skill-defects`,
   with a hard ordering *before* this release, and name it in Risks.
3. Correct proposal line 96.
4. Make IT-03 assert that opencode itself lists the bundle's skills, not only that files exist.

### F4 — MAJOR — Cowork / Claude Desktop is not verified, and that is where the bug was observed

**Evidence.** The seed (inputs §2, provenance line 6) is "a Claude **Cowork** session". The spike ran
only Claude Code CLI 2.1.310 (spike-dec5.md line 3). It concluded that skills are "already scoped …
the duplication observed in inputs §2 for skills came from an older install" (Finding 2), but it
never tested the surface where the duplication was seen. Cowork/Desktop/claude.ai organisation sync
may load plugins differently: the docs say org sync "accepts only some source types"
(code.claude.com/docs/en/plugins/host-marketplace.md, "Distribute through organization settings").
Symlink dereferencing is documented for the CLI cache copy only.

**Required fix.** Add IT-05: install `meaningfy-core` and `meaningfy-building` from the pushed branch
in Cowork (or Claude Desktop) and record the loaded skill/agent counts. If no one can run it before
release, add an explicit `ASSUMPTION:` + Risk ("Cowork/Desktop behaviour unverified; the CLI is the
supported surface") and say so in the migration note. Do not leave it unmentioned.

### F5 — MAJOR — The descoped CONTRIBUTING + CREATING_SKILLS merge has no owner

**Evidence.** proposal R3 / design D13 hand the merge to `skill-crafting-method` half two. That
proposal never mentions the merge (`grep CONTRIBUTING|CREATING_SKILLS
openspec/changes/skill-crafting-method/proposal.md` → nothing). `fix-accumulated-skill-defects`
proposal.md line 62 says the merge "is in `single-source-distribution`". Each change points at
another, and none owns it. The human's brief ("work loop and done-checklist in AGENTS.md and
CONTRIBUTING") **is** still met by D13: CONTRIBUTING routes to §9. So the descope itself is
acceptable; the missing owner is the problem.

**Required fix.** Add a task:
- write a dated handoff note into `openspec/changes/skill-crafting-method/inputs/` (append-only seed,
  naming the merge as half-two input);
- correct the one pointer line in `fix-accumulated-skill-defects/proposal.md` and log it there.

Until the human confirms, keep R3 marked `ASSUMPTION`.

### F6 — MAJOR — Deleting CONTRIBUTING's 40-item checklist drops review criteria that §9 does not hold, and DEC-8 has no implementing task

**Evidence.** The CONTRIBUTING "Skill Submission Checklist" (`CONTRIBUTING.md` lines 15–75) carries
licensing items (`LICENSE.txt`, `THIRD_PARTY_NOTICES.md`, attribution), script hygiene and the name
rules. `docs/development-method.md` §9 has none of them. Task 7.5's gate says "no new checklist line
added", so they vanish. DEC-8 adds a normative requirement (delta `catalogue-governance`, "External
skills are referenced, vendored only with provenance"), but no task writes the rule where
contributors read it: `spec/skill-repo-governance.md` rule 1 (line 24) still says only "referenced,
not vendored", and §9 has no provenance line.

**Required fix.** Before deleting, map each of the 40 items in a table in design.md D13 to one of:
- lint-enforced (name it);
- `spec/CREATING_SKILLS.md`;
- §9;
- dropped, with a reason.

Allow exactly one new §9 line, "Licence/provenance recorded for any vendored or third-party content
(DEC-8)", and amend 7.5's gate accordingly. Add a task to edit `spec/skill-repo-governance.md`: rule 1
gains the provenance exception, and lines 18 and 35 (`.claude-plugin/`, "marketplace↔dirs") become
`bundles.yaml`/`bundles/`. That file is in no task today.

### F7 — MAJOR — `bundle_gen.load` has no return shape, and both EPICs' lint reads through it

**Evidence.** D4 gives `load(repo) -> dict` and nothing more. The sibling's `_bundle_agents` and
`_bundle_skills` (its D-4), plus this PLAN's `_marketplace_skills`, `_bundle_membership` (D5) and
`skill_inventory._bundles` (task 3.1), all depend on that shape. The PLAN's clarity scorecard rates
reference clarity at 9.5, but the one cross-module seam is unspecified.

**Required fix.** State the shape in D4: the parsed D2 document, validated, with
`bundles: list[{"name": str, "description": str, "skills": list[str], "agents": list[str]}]` in file
order, and `agents` defaulting to `[]` only if it is also optional in D2 (it is not optional today,
so say so). Add TC-07b asserting the shape.

### F8 — MAJOR — Agent-membership lint and spec are duplicated across the two EPICs

**Evidence.**
- This PLAN adds agent membership to `repo_lint` (D5, TC-10, tasks 2.2) and the scenario "An agent
  outside exactly one bundle is rejected" (delta `catalogue-governance` lines 38–41).
- The sibling adds A5 `agent_bundle_membership`, with exact messages, plus the same scenario (its
  `catalogue-governance` delta line 42; its design.md line 190).

Built in sequence, this gives two checks emitting two different messages for one fault, and two
archived requirements stating one rule.

**Required fix.** This PLAN owns the basic membership check. Implement it as
`agent_bundle_membership`, using the sibling's three messages verbatim:
- `agent '<a>' is in no bundle in bundles.yaml`
- `agent '<a>' is in multiple bundles: <b1>, <b2>`
- `bundles.yaml lists agent '<a>' but agents/<a>.md does not exist`

Put the messages in TC-10. The sibling then *extends* that function with only the primary-skill rule,
and its delta drops the duplicate scenario (see contract).

### F9 — MINOR — The PLAN still describes the sibling's dropped `bundle:` frontmatter field

**Evidence.** design.md Non-Goals lines 52–53 ("The agent `bundle:` frontmatter field and its lint
are `agent-authoring-standard`'s") and Risks lines 390–392 ("adds an agent `bundle:` field that must
equal `bundles.yaml`"). The sibling re-shaped its DEC-5 (its proposal lines 66–72): `bundles.yaml` is
the only declaration, and `bundle:` is **forbidden** (its A1).

**Fix.** Rewrite both passages. Replace the "composes either way" risk with the real coupling: F1 and
F8, plus the sibling's task 5.5, which loads agents "via local plugin install". Per spike-dec5.md
("Local-path marketplace"), a local-path marketplace loads 0 agents under layout (b), so that task
must use the pushed-branch route.

### F10 — MINOR — The `--target` agent placement can write opencode-format agents into another tool's directory

**Evidence.** D7: `--target DIR` → `<parent of DIR>/agents/`. `--target ~/.claude/skills` (opencode
reads `.claude/skills`, inputs §3) would write opencode-format agents into `~/.claude/agents/`, which
Claude Code loads, with `mode`/`model: anthropic/…`/tool maps it does not understand.
`--target ~/.agents/skills` writes to a directory no one reads.

**Fix.** Write agents only for `--global`/`--project`. With `--target`, skip agents and print one
`gap:`-style notice, or require an explicit `--agents-target`. Add an edge case to TC-15.

### F11 — MINOR — `renderAgent` strictness is unspecified

**Evidence.** The Python mapper silently falls back to a line scanner on bad YAML
(`gen.py` lines 65–84), which can drop list fields. D6 moves the tables "verbatim" but says nothing
about this fallback.

**Fix.** Specify that `renderAgent` throws on non-YAML frontmatter, naming the agent, with no
fallback. Add a TC.

### F12 — MINOR — The `yaml` dependency is justified only by agent frontmatter, and two parsers validate one schema

The dependency is acceptable. `bundles.yaml` alone could be avoided by having `make bundles` put
membership into the gated `marketplace.json` entry `metadata` (a free-form field Claude ignores,
per manifest-reference "metadata"). Agent frontmatter, though, uses `description: >` and block
lists, so it needs a real parser. Keep `yaml`, but:
1. Python `bundle_gen.load` is the only schema validator. JS `loadCatalogue` checks only the shape it
   consumes, so two validators of one schema cannot drift (D6 currently says "same validation
   messages").
2. Decide on the lockfile (`package-lock.json` is neither committed nor ignored; task 4.1's
   `npm install` creates it). Either commit it and use `npm ci` in D16, or gitignore it.

### F13 — MINOR — Task gates will misfire

- 5.1's grep (`opencode_gen` in `*.py`) hits `tools/skill_inventory.py:230` (a comment that task 3.1
  does not touch) and the `tools/repo_lint/lint.py:57-59` comment if 2.2 rewords it loosely. Add
  `skill_inventory.py:230` to 3.1.
- 7.1's gate `grep "\.opencode/" AGENTS.md` is fine today. But `.opencode/plugin/` is a legitimate
  consumer-repo path elsewhere (`setup-opencode.md:127`, project-setup hooks). Narrow the doc greps
  in 7.x to `generate-opencode|committed .opencode|\.opencode/skills|OPENCODE_CONFIG_DIR`, or a
  later gate becomes wrong.
- From 1.4 (marketplace rendered without `skills` lists) until 2.2/3.1/5.1, `make validate` is red:
  `unregistered_skill_dirs` for all 32 skills, `opencode_tree_gates`, `test_skill_inventory` and
  `test_opencode_gen`. State the commit boundaries, e.g. 1.4+2.2+3.1 in one commit and 5.1 with
  group 4, so no pushed commit is red (the sibling uses this convention).

### F14 — MINOR — The delta specs hard-code counts and over-claim

- `dual-cli-distribution` "Claude install is scoped" hard-codes "5 skills and 0 agents", and the
  opencode scenario hard-codes "9 skills … 3 rendered agents". `add-devops-bundle`/`add-sales-bundle`
  will falsify a normative spec. Phrase both as "exactly the skills and agents `bundles.yaml` lists".
  Keep the numbers only in design.md "Verification counts".
- "and nothing else is written" ignores `.skillery-manifest.json`. Add "besides the install
  manifest".
- "Upgrading needs no reinstall … from v2.11.0" is a release fact. Move it to the CHANGELOG or IT-02.

### F15 — MINOR — The upgrade path for existing Windows users is missing

A Windows user who already added the marketplace has a checkout taken without `core.symlinks`, so
`marketplace update` keeps the links as text files. The migration note (8.2c) must say: remove and
re-add the marketplace after enabling `core.symlinks` and Developer Mode. The latter is
corroborated by code.claude.com/docs/en/plugins/host-marketplace.md ("On Windows … enable Developer
Mode").

### F16 — MINOR — D14 (GitNexus block) is outside the brief and fragile

Nothing in the human's brief asks for it. `--skip-agents-md` skips **both** files ("Skip updating
the gitnexus section in AGENTS.md and CLAUDE.md", `gitnexus analyze --help`, v1.6.9). So any plain
`analyze` (the command printed *inside* the managed block) re-injects the CLAUDE.md copy, and the
AGENTS.md stats go stale when run with the flag. Either drop D14/task 7.2 (smallest diff) or add a
lint check that fails when CLAUDE.md contains `gitnexus:start`. Otherwise the fix decays silently.

### F17 — MINOR — The alternatives record in D3 is incomplete

The physical-nesting alternative should be recorded as considered and rejected. That means moving
sources to `bundles/<b>/skills/<s>` with no flat `skills/`. It would be Windows-safe, need no render
step and leave no symlinks, but it is barred by the Rabbit-hole "do not redesign the skill folder
layout" and would rewrite every path. The (b) choice itself holds:
- the containment rule rules out `..`;
- a per-bundle `plugin.json` adds nothing over the marketplace entry, because files must still be
  physically under the root;
- (d) fails on empty `agents`.

### F18 — MINOR — The scope of "one checklist" is ambiguous

The `catalogue-governance` scenario "no other file … carries a done or submission checklist for
skill or agent changes" reads against `docs/ai-coding/dod-quality-gates.md` ("Definition of Done &
Quality Gates" for an Epic). Scope it: "for changes to this repository's skills and agents;
`docs/ai-coding/` defines the product-project DoD and is out of scope".

### F19 — MINOR — Spike evidence: confirmed

I re-checked the spike's scratch evidence under the session scratchpad (`spike-dec5/`):
- `cfg-real/plugins/cache` is 59 MB with 32 skills / 3 agents in every bundle;
- `cfg-real-b` is 1.9 MB with 5/0, 5/0, 4/0, 9/3, 9/0 and 0 symlinks in the cache;
- `installed_plugins.json` versions are commit SHAs.

The live docs confirm the three load-bearing claims:
- `..` → `Path contains ".." which could be a path traversal attempt`
  (code.claude.com/docs/en/plugins/manifest-reference.md, "Containment and existence");
- `agents` replaces the default scan, while `skills` adds to it ("How each key combines with its
  default location");
- in-marketplace symlinks are dereferenced on copy into the cache, and local-path installs keep
  only in-plugin links (host-marketplace.md, "Share files within a marketplace with symlinks").

`npx skills` with the (b) layout lists `technical-writing` once, so the symlink tree causes no
duplication there. GitHub hosting clones (`git`), so tarball behaviour does not apply.

The only weak claims are F3 (strict YAML) and F4 (Cowork).

**Scope check, item 2 (no finding):** the `linkml-engineering` and `modelling-conventions` deltas are
**required, not scope creep**. Their living specs require a "regenerated, never-hand-edited
`.opencode/` mirror" (`openspec/specs/linkml-engineering/spec.md:226-239`,
`openspec/specs/modelling-conventions/spec.md:60-67`), which becomes false when this change lands.
They are the only other living specs that name `.opencode/` (grep over `openspec/specs/`).

---

## Cross-EPIC contract

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

---

## Clarity-gate score (full gate, PLAN = design.md + tasks.md, re-scored independently)

| Criterion | Architect | Reviewer | Main deductions |
|---|---|---|---|
| Actionability | 9.5 | 8.5 | F1 breaks the downstream build; F13 red window |
| Specificity | 9.5 | 8.5 | F7 unspecified seam; F14 hard-coded counts |
| Consistency | 9 | 7.0 | F2 contradicts canon §6; F9 stale sibling claim; F8 duplicate rule |
| Structure | 9.5 | 9.0 | — |
| Disambiguation | 9 | 7.5 | F3 strict YAML; F4 Cowork; F10 `--target` |
| Reference clarity | 9.5 | 8.5 | F6 `skill-repo-governance.md` untouched; F13 greps |

**Score: 8.2 / 10 — FAIL (gate ≥ 9).** The bet itself holds. Each finding is PLAN-level except F2,
which is a logged re-shape of DEC-6. Fixing F1–F8 and the F9/F13 edits should bring the PLAN to ≥ 9
without changing the shape: one JSON table file, a quoting pass plus a lint check, one version string,
and doc and task edits.
