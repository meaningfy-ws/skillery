# Study: how wondelai/skills makes its skills, and what skillery should take

Read-only study of the clone at `/tmp/claude-1000/-home-lps-work-repos-skillery/f4ac8776-d12e-4770-9b84-15bedd2c4aa2/scratchpad/wondelai/repo` (called REPO below), checked against skillery's standard and the `lean-skills` EPIC. No script of theirs was run; script sources were read. All sizes are bytes (`wc -c`), not characters. The clone has one git commit (c526558, 2026-11-13), so history, release cadence and tags could not be studied.

## 1. Their skill anatomy

### Shape

65 top-level skill directories, each `<name>/SKILL.md` plus `<name>/references/*.md`. Nothing else: no `assets/`, `scripts/`, templates or example folders inside any skill (measured: 0 files outside `SKILL.md` and `references/` in all 65). 51 are "book" skills (one framework from one book or style guide); 14 are "metaskills" (composite journeys). Source of the split: `REPO/CLAUDE.md` ("Fourteen of them are metaskills").

Frontmatter is identical in every skill, exactly four keys: `name`, `description`, `license: MIT`, `metadata: {author, version}` (counted over all 65). No `allowed-tools`, no facets, no model pin. The rule is in `REPO/.github/copilot-instructions.md`: "All SKILL.md files must have valid YAML frontmatter with `name`, `description`, `license`, and `metadata` fields."

### Book-skill body order (`REPO/CLAUDE.md`, "Skill File Format"; checked on `REPO/clean-architecture/SKILL.md` and `REPO/negotiation/SKILL.md`)

1. Title and one intro paragraph.
2. `## Core Principle` (one bold sentence plus a paragraph).
3. `## Scoring` (a 0-10 rule tied to the Quick Diagnostic, with bands).
4. 5 to 8 numbered framework sections, each with the same fields: Core concept, Why it works, Key insights (bullets), a table (Context | Pattern or Application | Example), optional Copy patterns, optional Ethical boundary, then one inline pointer to a reference file.
5. `## Common Mistakes` (table: Mistake | Why It Fails | Fix).
6. `## Quick Diagnostic` (table: Question | If No | Action).
7. `## Further Reading` (affiliate book links with `?tag=wondelai00-20`) and `## About the Author`.

### Metaskill body order (`REPO/CLAUDE.md`, "Metaskill Format"; read in full: `REPO/create-app/SKILL.md`)

intro, Core Principle, Journey Map (table: Phase | Skill | Question it answers | Artifact), Operating Rules (8), Intake, Phases (each with six fields: Purpose, Brief (fallback), Invoke, Decide with the user, Artifact, Done when), Optional Phases (table), Common Mistakes, Completing the Journey (checklist).

### Measured sizes over ALL 65 skills

Command: for each dir with `SKILL.md`, `wc -c` on `SKILL.md`, `find <dir> -type f -exec cat {} + | wc -c`, `find -type f | wc -l`, then summarised (raw numbers in `/tmp/claude-1000/-home-lps-work-repos-skillery/f4ac8776-d12e-4770-9b84-15bedd2c4aa2/scratchpad/wondelai/sizes.txt`).

| Measure | Min | Median | Mean | P90 | Max |
|---|---|---|---|---|---|
| SKILL.md bytes | 12,390 (predictable-revenue) | 17,070 | 18,544 | 24,645 | 29,595 (architecture-optimization) |
| Total bytes per skill (SKILL.md + references) | 23,940 (improve-website) | 85,492 | 87,709 | 150,645 | 173,312 (one-page-marketing) |
| Files per skill | 2 | 7 | 6 (mean) | 10 | 12 |
| Reference files per skill | 1 | 6 | 5 | 9 | 11 |
| SKILL.md lines | 171 | 231 | | | 343 |
| description bytes (line 3, with prefix) | 550 | 703 | | | 1,042 |

Reference files themselves (356 files, excluding the generated `plugins/` copies): median 13,059 bytes, max 29,205, min 704. `REPO/CLAUDE.md` asks for "each 1500-3000 words".

Two populations. Book skills: SKILL.md 12 to 21 KB, total 60 to 173 KB (references are 4 to 8 times the body). Metaskills: SKILL.md 22 to 30 KB, total 24 to 50 KB, usually just 2 files (SKILL.md plus `references/artifact-templates.md`), because their phases are the body.

### Comparison with ours (same method, `*.md` and `*.txt` following symlinks, 51 skills)

| Measure | Theirs (65) | Ours (51) |
|---|---|---|
| SKILL.md median / range | 17,070 / 12,390 to 29,595 | 7,524 / 1,951 to 36,473 |
| Prose per skill, median / max | 85,492 / 173,312 | 16,909 / 141,892 |
| Files per skill, median / max | 7 / 12 | 4 / 81 |

So their bodies are 2.3 times our median body and their reference prose is 5 times our median total. Their size is not a model for the lean standard; their structure may be.

### Splitting into files and the "when to open" rule

Each framework section ends with a one-line conditional pointer. Example, `REPO/clean-architecture/SKILL.md`: "See `[references/dependency-rule.md](references/dependency-rule.md)` when an inner-circle import points outward and you need the four-circle code walkthrough, the data-crossing rules, and the four-step dependency-inversion procedure to fix it." The pointer states the situation ("when ...") and what the file adds ("covers ..."). The rule is stated in `REPO/CLAUDE.md`: "inline when-to-read pointer, at the point of need; no trailing roster". Reference files are named for the topic (`dependency-rule.md`, `boundaries.md`, `techniques.md`), start with a table of contents, and are one per framework section (clean-architecture has 6 files for 6 sections). In `REPO/negotiation/SKILL.md` line 50 a single `references/techniques.md` serves 8 sections and the body says "each section below points to the part you need at the moment you need it". One composite file, one pointer: `REPO/create-app/SKILL.md` Operating Rule 7 sends the agent to `references/artifact-templates.md` "when creating a docs/ file for the first time".

Templates: only in metaskills, and only as `references/artifact-templates.md` (3.7 to 5 KB), copied from the maintainer registry `REPO/docs/ARTIFACT-REGISTRY.md`. They are skeletons of files the agent writes into the user's project `docs/` folder. There are no executable scripts in skills.

Examples inside skills: tables with an Example column, quoted copy patterns, and code in reference files (for example Python controller code in `REPO/clean-architecture/references/adapters-frameworks.md`). A separate repo-level `REPO/EXAMPLES.md` (70 KB, persona scenarios with copy-paste prompts) is not read by agents.

### Scoring and checklists

Every book skill has `## Scoring` and `## Quick Diagnostic` (34 of 65 also contain "Ethical boundary" fields). Scoring example, `REPO/clean-architecture/SKILL.md`: "Score one point for each of the seven Quick Diagnostic rows the architecture satisfies (0-7), then map to a 0-10 band ... Report the score, the failed diagnostic rows, and the specific inversion needed to fix each." Metaskills end with an exit checklist (`- [ ]` items) in "Completing the Journey".

## 2. How composite skills depend on other skills

The mechanism is prose, plus a runtime fallback. There is no frontmatter field and no manifest field.

1. **Names in prose, by slug.** The description lists the constituents: `REPO/create-app/SKILL.md` line 3, "Orchestrates ten skills phase by phase - lean-startup, design-sprint, clean-architecture, ...". The Journey Map table has a Skill column. Each phase has an `**Invoke:**` line: "Use the `lean-startup` skill with the idea and, if CUSTOMER.md exists, the job statement."
2. **Missing-dependency handling is in Operating Rule 4** (word-identical in all 14 metaskills, checked on five by grep): "Load the phase's skill and use it ... If it is not available, offer: `npx skills add wondelai/skills/<slug> --global`. If the user declines, run the phase from its Brief — the minimum viable method. State which mode you are in." So there are two fallbacks: offer the install command, else run the inline **Brief (fallback)** paragraph (5 to 8 lines) of that phase.
3. **Two metaskills are fully standalone.** `REPO/conversion-optimization` and `REPO/architecture-optimization` description: "each phase carries its full method inline so it runs standalone". They ship `references/methods.md` (16 KB for architecture-optimization, whose header says "The full fallback method for each phase — read the relevant section before running a phase from its Brief (constituent skill not installed)"). Cost: the method of 8 skills is stated twice (in the constituent and in `methods.md`).
4. **Plugin manifests do not declare it.** `REPO/.claude-plugin/marketplace.json`, collection `metaskills`: `"skills": ["./create-business", ... "./architecture-optimization"]`, the 14 metaskills only. grep for "depend" finds 0 hits in `marketplace.json` and `REPO/plugins/metaskills/plugin.json`. Installing the `metaskills` plugin therefore does not install the constituents; only the install offer in Rule 4 and the Brief protect it. The all-in-one plugin `REPO/plugins/wondelai-skills` exists as the way to get everything.
5. **Book skills point to siblings by name only**, in the description's last sentences: `REPO/clean-architecture/SKILL.md`, "For code-level quality, see clean-code. For domain modeling, see domain-driven-design." Those are negative triggers, not dependencies.
6. **Routing between composites** is also by name in the description (the "5-sentence formula" in `REPO/CLAUDE.md`, fourth sentence "routes to sibling metaskills"): `create-app` says "App already exists: use improve-app or grow-app. Business idea not yet validated: run create-business first."
7. **State between sessions** goes through files in the user's project: a tracker `docs/CREATE-APP-PLAN.md` and shared UPPERCASE artifacts (`docs/ARCHITECTURE.md`); section headings are the cross-skill contract (`REPO/docs/ARTIFACT-REGISTRY.md`: "Section headings are the cross-metaskill contract").

## 3. Wording practices

| Practice | Evidence |
|---|---|
| Description = what it does, then "Use when the user mentions" followed by 6 to 10 quoted trigger phrases, then "Also trigger when ..." for situations, then "Covers ...", then negative routing "For X, see Y". Single quotes, one line, under 1,024 bytes. | `REPO/clean-code/SKILL.md` line 3: "Use when the user mentions "clean up this code", "this function is too long", "code smells" ..." |
| Trigger phrases are things users say, in quotes, including complaints, not concept names. | `REPO/cro-methodology/SKILL.md`: "landing page isnt converting", "people add to cart but dont buy" |
| Composite description formula (5 sentences) with negative triggers to siblings. | `REPO/CLAUDE.md`: "Descriptions follow a 5-sentence formula whose 4th sentence routes to sibling metaskills (negative triggers)" |
| Core Principle is one bold sentence, then why. | `REPO/clean-architecture/SKILL.md`: "**Source code dependencies must point inward — toward higher-level policies.**" |
| Rules that cut filler, stated in the contributor guide. | `REPO/CLAUDE.md`: "**Why it works:** ... (only when it states a real mechanism — cut if it just restates the Core concept)"; "Ethical boundary: ... (only when a concrete, behavior-changing constraint — omit platitudes the model already follows)"; "**Key insights:** (bullet list of non-obvious points only)". |
| Scoring must be reproducible and reach 10. | `REPO/CLAUDE.md`: "Don't write '1 point per row' when there are fewer than 10 rows: the top band becomes unreachable." |
| Imperative, second-person, short operating rules that each end in a "Done when" check. | `REPO/create-app/SKILL.md` Rule 1: "A journey with a tracker is resumed, never restarted." Rule 5: "A decision made silently is a defect." |
| Questions to the human are mandatory and carry options plus a recommendation. | Rule 5: "Ask every question under "Decide with the user" — with concrete options and your recommendation." |
| Bounded human role stated as a rule. | Rule 8 of create-app: "The agent prepares and processes; only the human talks to customers and test users." |
| "Invoke, do not improvise." | `REPO/create-app/SKILL.md` Core Principle: "The constituent skills carry the method. Invoke them rather than improvising their frameworks." |
| Examples are in tables and bullets, short; long code goes to references. | `REPO/clean-architecture/SKILL.md` section tables, column "Example", e.g. "`UserRepository` interface in Use Cases; `PostgresUserRepository` in Adapters" |
| Tests rule in the repo guide: no tautological tests. | `REPO/CLAUDE.md`, "Testing": "Delete tautological tests on sight rather than fixing them" |
| A rule against rule-less rosters. | `REPO/CLAUDE.md`: pointer "inline ... no trailing roster" |

Rules against examples: they have none. The opposite: every framework section must carry an Example column. Their only brake on volume is "non-obvious points only" and the 500-line cap in `REPO/.github/copilot-instructions.md` ("Keep main SKILL.md under 500 lines; move detailed content to reference files"). Max measured is 343 lines, so the cap never bites.

## 4. Tooling and distribution

### Scripts (all in `REPO/scripts/`, read as source)

- `sync-ide-skills.sh` (67 lines): finds every top-level dir with `SKILL.md` and re-creates relative symlinks `../../<skill>` in `.claude/skills`, `.cursor/skills`, `.windsurf/skills`, `.pi/skills`, `.agents/skills`; checks no symlink is broken; then runs `generate-plugins.sh`.
- `generate-plugins.sh` (144 lines): from `.claude-plugin/marketplace.json` ("SINGLE SOURCE OF TRUTH: collections, skill membership, versions") it renders `plugins/<collection>/plugin.json` (Agent Plugins v1.0.0), `plugins/<collection>/.codex-plugin/plugin.json` (Codex), `.agents/plugins/marketplace.json` (Codex marketplace), and real copies of each skill into `plugins/<collection>/skills/`, plus the all-in-one `plugins/wondelai-skills`. Copies, not symlinks, because "the Agent Plugins spec requires every package path to resolve inside the plugin root". Cost: `plugins/` is 14 MB of 22 MB in the clone, 131 duplicated SKILL.md files, all committed.
- `sync-marketplace-versions.sh` (47 lines): sets every `version` in `marketplace.json` to one release number, then regenerates plugins.
- `build-agent-skills-index.mjs` (124 lines): builds `.well-known/agent-skills/index.json` (Agent Skills discovery schema 0.2.0), one entry per skill with name, description, a commit-pinned `raw.githubusercontent.com` URL and a `sha256` digest, read from the git commit, not the working tree. It fails on a missing or unparseable `name` or `description`, on a name that differs from its directory, on name pattern `^[a-z0-9-]{1,64}$` and on description over 1,024. This is the only structural validation in the repo.

### CI (`REPO/.github/workflows/`)

- `agent-skills-index.yml`: on push to main touching `*/SKILL.md`, rebuilds the index and commits it with `GITHUB_TOKEN` (skips if a newer run already published).
- `sync-marketplace-version.yml`: on a published GitHub release, runs the version sync and commits to main.
- `claude-review.yml`: one Claude review per PR, report-only high-severity defects, model `sonnet`, read-only tool allow-list. It tells the reviewer to check breaches of `CODING_STANDARDS.md`, a file that does not exist in REPO.

There is no lint, no link check, no size check, no trigger probe, no eval and no test in CI. `REPO/CLAUDE.md` says "Commit directly to main".

### One source, several CLIs

One set of `SKILL.md` files at repo root; per-tool discovery is by symlink dirs (Claude `.claude/skills`, Cursor, Windsurf, Pi, Codex `.agents/skills`); packaging is per-standard manifests rendered from one JSON. No per-CLI body variants. The body is not kept CLI-agnostic by a check; it is naturally agnostic because the skills hold no commands or tool names (only `npx skills add`).

### Versioning

Two layers. Per skill: `metadata.version` bumped by hand on every edit (`REPO/CLAUDE.md`: content addition bumps MINOR, small fix bumps PATCH); values seen: 1.0.1 (create-app), 1.4.0 (clean-architecture), 1.5.0 (negotiation), 1.6.0 (top-design). Per plugin/marketplace: one number for all collections, set by CI from the latest GitHub release (1.8.0 now). The two do not interact; nothing checks that a skill bump is made.

### Licence

`REPO/LICENSE` is MIT, "Copyright (c) 2025 Wondel.ai sp. z o.o.". What it allows us: use, copy, modify, merge, publish, distribute, sublicense and sell, including inside our own catalogue, on condition that the copyright and permission notice stay in all copies or substantial portions. So we may copy a structural idea or a passage, with the notice, and list it in `THIRD_PARTY_NOTICES.md` as `creating-skills.md` already requires. Caution outside the licence: the skills are summaries of third-party books (the README's "Copyright & Disclaimer" section), so MIT from wondelai does not clear the book authors' rights. Our EPIC already flags the same issue for `agent-rules-books`. Our "no copying of book rule text" no-go applies equally here. We would take patterns, not text.

## 5. Comparison table

| # | Practice | Theirs | Ours | Verdict |
|---|---|---|---|---|
| 1 | Body plus references split | Body 12 to 30 KB, references 4 to 8 times larger, all in `references/` | `references/` and `assets/`; lean EPIC wants body at most 6 KB, prose at most 24 KB (DEC-2) | ALREADY-OURS (structure). Their sizes REJECT: median total 85 KB is 3.5 times our budget and shows what happens without a cap. |
| 2 | "When to open" pointer, inline at point of need | "See [file] when <situation> — <what it adds>"; no trailing roster | `creating-skills.md`: references "linked from `SKILL.md` where they are needed"; `cosmic-python` still has a "REFERENCE MATERIALS" roster (`skills/cosmic-python/SKILL.md` line 348) | ADAPT: make the form mandatory and lintable: every reference link sits in a sentence beginning "when" or naming a trigger; no roster section. Directly serves the EPIC fail test "moving text is not shrinking" (a pointer that says when keeps files unread until needed). |
| 3 | One reference file per body section, named for the topic | `dependency-rule.md`, `boundaries.md` | Named "for the question they answer" (`creating-skills.md`) | ALREADY-OURS (ours is stricter) |
| 4 | Frontmatter minimal and uniform | 4 keys | spec fields plus six facets under `metadata`, strict YAML, string values | ALREADY-OURS. REJECT their lack of facets and of strict-YAML check. |
| 5 | Description formula: what, "Use when the user mentions" + quoted phrases, "Also trigger when", "Covers", negative routing "For X, see Y" | Fixed order, 550 to 1,042 bytes | "Use this skill when ...; it ..." imperative, `Not for` only when a probe needs it, `tests/trigger_probes.yaml` | ADAPT: take the fixed sentence order and "quoted user phrasing, including complaints" as guidance in `creating-skills.md`; keep our `Not for` rule and probes (they have none). Their descriptions run to 1,042 bytes, above the 1,024 limit counted with prefix; ours must stay under. |
| 6 | Negative triggers by name to neighbours | Last sentence of description | `Not for` clause + near-miss probe | ALREADY-OURS (probes prove it) |
| 7 | Body section list is fixed (Core Principle, Scoring, Framework, Common Mistakes, Quick Diagnostic) | Same skeleton for all 51 book skills | EPIC leaves "the exact section names of the lean shape" vague on purpose; agent-rules-books shape: bias, decision rules, trigger rules, checklist, boundary | ADAPT: fix the lean shape's section names in the standard; take their Common Mistakes (Mistake, Why, Fix) and Quick Diagnostic (Question, If No, Action) tables as the form of "decision rules" and "final checklist". Drop Scoring for most skills, see row 9. |
| 8 | Content filters in the contributor guide ("non-obvious points only", cut "Why it works" if it restates, omit platitude fields) | In `REPO/CLAUDE.md` | EPIC step 3 sorts passages (keep, cut, cite, example, move) | ADOPT the three filter sentences as wording for the sorting step; they are the same test, said shorter. |
| 9 | Reproducible 0-10 scoring tied to a diagnostic | Every book skill | `clarity-gate` has a rubric; no scoring elsewhere | ADAPT: only for skills whose output is judged (review, gates). Elsewhere REJECT: it is size with no Meaningfy-specific content. Keep their rule that the top band must be reachable. |
| 10 | Composite skill = journey map, 8 operating rules, phases with six fields | 14 metaskills, 22 to 30 KB each, rules 1-7 copied word for word in 14 files (about 3.3 KB each) | Activity skills with `assets/workflows/*.workflow.json` read by the navigator mod; `epic-delivery`, `epic-planning` | ADAPT the idea, REJECT the copy. Our workflow JSON already holds phases with criteria; the shared rules (resume first, announce phase, ask with options and recommendation, present before writing, done-when) belong once in a skill (candidate: `guardrails` or the activity-skill rule) and each workflow cites it. Phase fields "Done when" and "Decide with the user" map to our `criteria` (success and failure). |
| 11 | Dependency on other skills | Names in prose + install offer + inline Brief fallback; nothing in manifests | `requires:` between bundles in `bundles.yaml`, checked by validator; `dependencies.yaml` for external; "Delegates:" line | ALREADY-OURS and stronger. ADAPT one thing: the fallback sentence "If it is not available, offer `<install command>`; if declined, say which mode you are in" for skills that name an external dependency (the book rule sets, DEC-4). Do not copy their inline Brief paragraphs: duplicated method is exactly what the EPIC removes. |
| 12 | Standalone variant by duplicating method (`methods.md`) | 2 metaskills | Single source of authority per fact | REJECT: duplicates 16 KB of other skills' method; contradicts governance rule 1. |
| 13 | Artifact registry: shared section headings as cross-skill contract, templates copied per skill | `REPO/docs/ARTIFACT-REGISTRY.md` | Spine and OpenSpec schema define artifacts; templates in `assets/` cost no context | ALREADY-OURS. One idea worth keeping: put templates in one place, not copied into 14 skills. |
| 14 | State across sessions in a project tracker file with statuses | `docs/<SKILL>-PLAN.md`, statuses `pending, in-progress, awaiting-evidence, done, deferred, skipped` | OpenSpec `tasks.md` and navigator | ALREADY-OURS. Their `awaiting-evidence` (agent drafts, then waits for human evidence) is a useful name; ADAPT into the workflow criteria vocabulary if we lack it. |
| 15 | Ethical-boundary field per section | 34 skills | Not in standard | REJECT: platitudes, their own guide says to omit those the model already follows; zero Meaningfy-specific content. |
| 16 | Body size cap | "under 500 lines" (copilot-instructions), never enforced; max 343 | DEC-2: 24 KB prose, 6 KB body, lint-enforced, exceptions recorded | ALREADY-OURS. A cap with no check is not a cap: theirs is evidence for DEC-2's lint. |
| 17 | Validation | Index builder checks name, description, limits; nothing else | `make validate`: frontmatter, facets, links, size, bundle sync, probes, agents | ALREADY-OURS. ADOPT one detail: the index builder reads from the commit, writes deterministically, fails loudly rather than truncating a YAML value. Our lint already fails; the commit-pinned sha256 digest of each SKILL.md is the new idea. |
| 18 | Commit-pinned discovery index with digest | `.well-known/agent-skills/index.json`, schema agentskills.io discovery 0.2.0 | `tools/opencode-catalogue.json` | ADAPT, low priority: publishing a discovery index would let others depend on one skill at a fixed commit (see section 6). Not part of lean-skills; note for the distribution owner. |
| 19 | Multi-CLI via symlink dirs per tool | 5 dirs of symlinks | Install only from `releases` branch; `bundles/` symlinks; opencode renders agents | ALREADY-OURS |
| 20 | Generated plugin copies committed | 14 MB of duplicated skills | `bundles/` as symlinks, `make bundles` | ALREADY-OURS; REJECT their copies (14 MB, 131 duplicated SKILL.md). |
| 21 | Version | Hand-bumped per skill + one marketplace number from the release | Root `VERSION`, release flow, no per-skill version | ALREADY-OURS; REJECT per-skill versions (unchecked, noisy). |
| 22 | "No tautological tests" rule | `REPO/CLAUDE.md` | `test-strategy` skill | ALREADY-OURS in intent; wording is short and strong, could be a one-line rule in `test-strategy` if absent. Not verified, not read. |
| 23 | Human-facing docs separate from skills | `README.md` (135 KB), `EXAMPLES.md` (70 KB) with copy-paste prompts per persona | `docs/` for people, Quick Start with a worked example inside each skill (`creating-skills.md`) | ADAPT: our "Quick Start with one real worked example" in every skill is body weight the EPIC may cut. Their approach, examples as prompts in a human doc, not in the skill, fits DEC-7's direction. Decide in the PLAN whether Quick Start moves to `docs/`. |
| 24 | Review bot on PR | One Claude review, defects only, severity | `meaningfy-code-review`, human owns PR | ALREADY-OURS |

## 6. Depending on single skills of this repository

Marked **verified-from-docs only**; nothing was installed or run.

Claude Code (`REPO/README.md`, "Via Claude Code Plugin Marketplace"):
- `/plugin marketplace add wondelai/skills`, then `/plugin install <collection>@wondelai-skills` for one of 10 collections (product-strategy, ux-design, marketing-cro, sales-influence, product-innovation, strategy-growth, team-motivation, code-craftsmanship, systems-architecture, metaskills). Granularity is the collection, 3 to 14 skills, not one skill. `code-craftsmanship` and `systems-architecture` hold the engineering ones. There is also an all-in-one plugin directory `plugins/wondelai-skills` but the README documents it only for Agent Plugins clients ("Clone this repo and point your client at a plugin directory"), not as a `/plugin install` target.
- Single skill: `npx skills add wondelai/skills/<skill> --global`, "Via skills.sh" section (examples: `jobs-to-be-done`, `create-app`). The README says this "targets Codex as well (Codex is a supported agentskills.io agent)". The tool `skills.sh` is third-party and its behaviour (where it writes, what it supports) is not documented in this repo.
- In a clone, `.claude/skills/<skill>` symlinks to `../../<skill>` exist for every skill (`REPO/.claude/skills`, created by `sync-ide-skills.sh`).

opencode: the README does not mention opencode (grep for "opencode" returns nothing; the named agents are Claude, Claude Code, Cowork, Codex, Cursor, OpenClaw, Hermes). Our own register says opencode reads `.claude/skills/` natively (`/home/lps/work/repos/skillery/dependencies.yaml`, entry `stream-coding`: "copy it into `.claude/skills/stream-coding/`; opencode reads that path natively"). So a copy of one skill directory into `.claude/skills/<skill>/` is the likely path, and `npx skills add wondelai/skills/<skill>` is unverified for opencode. This matches the EPIC's own rabbit-hole ("Installing the book skills on opencode through `npx skills add` is not verified"). Treat as unverified.

Pinning: the skills.sh install takes no version in any README example; the only version-addressable artefact is the commit-pinned URL plus digest in `REPO/.well-known/agent-skills/index.json`. A dependency we would register in `dependencies.yaml` should be a fork or a pinned commit (EPIC DEC-4 logic).

Fit to our need: their book skills overlap the agent-rules-books sets the EPIC already chose (clean-architecture, domain-driven-design, refactoring-patterns, working-with-legacy-code, release-it, ddia-systems, software-design-philosophy). They are 16 to 20 KB bodies plus 60 to 110 KB of references each, 4 to 20 times the size of a `mini` rule set (4 to 8 KB). We found no reason to prefer them for the engineering areas; they could matter only for non-engineering areas we do not own (negotiation, pricing, positioning), which is outside this EPIC.

## 7. Weaknesses in their approach, with evidence

1. **Size without a cap.** Median skill is 85 KB; one-page-marketing is 173 KB; SKILL.md bodies of 12 to 30 KB are read in full whenever the skill fires. The 500-line guard in `REPO/.github/copilot-instructions.md` exists but nothing checks it. Same pattern as our worst skills.
2. **Bodies restate generic book knowledge.** `REPO/clean-architecture/SKILL.md` explains SOLID and the component principles, material a capable model has and `agent-rules-books` compresses into 4 to 8 KB. Their own "cut if it just restates" rule is applied by hand, with no check.
3. **Duplicated method.** Operating Rules 1-7 are copied into 14 files (identical text confirmed for rules 4, 5, 6 on five files); `methods.md` repeats eight constituent skills; plugin trees repeat every skill (131 SKILL.md copies, 14 MB). Edits must be synced by script; the repo guide warns "re-run `scripts/sync-ide-skills.sh` ... or they go stale".
4. **Composite dependency is soft and unenforced.** The `metaskills` plugin lists only the 14 composites (`marketplace.json`), so a Claude user who installs it gets orchestrators whose 10 constituents are absent; the safety net is an install offer and a paragraph "Brief" per phase. No tool checks that every named slug exists or that routing is mutually consistent, although `REPO/CLAUDE.md` demands that ("keep the routing mutually consistent when editing").
5. **No validation of content.** CI checks name, description and length of SKILL.md only (`build-agent-skills-index.mjs`). No link check, no section check, no trigger probes, no evals. Descriptions reach 1,042 bytes with the key prefix; `CLAUDE.md` claims "Descriptions follow a 5-sentence formula" without a check.
6. **No evidence the skills help.** There is no benchmark, no baseline-failure record, no probe. Skills are written from books, not from observed agent failures; our "failure-first" rule has no counterpart.
7. **Commercial and legal exposure.** Affiliate-tagged Amazon links in every skill body (`?tag=wondelai00-20`) cost tokens and push a commercial link into agent context; skills summarise copyrighted books under MIT.
8. **Trigger crowding.** 51 broad book skills with overlapping phrases ("code smells" appears in both `clean-code` and `refactoring-patterns`, line 3 of each SKILL.md). Negative routing is by name only and unproven.
9. **Reference-file order depends on the agent obeying prose.** Nothing makes the agent open a reference; skills with 8 to 11 reference files rely on a "when" pointer being followed. Not measured here.
10. **Version hygiene.** `metadata.version` is hand-bumped; no check that a changed skill bumped it; marketplace version is a separate number (1.8.0) from skill versions (1.0.1 to 1.6.0).
11. **Wrong pointers.** `claude-review.yml` cites `CODING_STANDARDS.md`, which does not exist in REPO.
12. **A direct commit policy** ("Commit directly to main", `REPO/CLAUDE.md`) plus CI bots that commit to main: no review gate on generated content.

## 8. Not read or not determined

- Not read in full: the other 12 composites beyond `create-app`, `architecture-optimization` and `conversion-optimization` (checked by heading list, description and Operating Rules 4 to 6 by grep): `create-business`, `create-website`, `grow-*`, `improve-*`, `remove-technical-debt`, `design-code-architecture`, `improve-code-quality`. I did not diff their Operating Rules 1-3 and 7-8 line by line; identity of rules 4, 5, 6 was confirmed on five composites only. `top-design` was read by headings, scoring tables and pointers only (it is a style skill with a 0-10 weighted rubric, not a composite despite the brief's list).
- Book skills sampled: `clean-architecture` (full), `negotiation` (headings, scoring, pointer, reference header), `clean-code`, `top-design`, plus descriptions of ten others. Reference files were read only by their first 20 to 40 lines.
- `README.md` (135 KB) read for install and a few skill details, not entirely. `EXAMPLES.md` read for its first 30 lines. `docs/ARTIFACT-REGISTRY.md` first 60 lines.
- `.windsurf`, `.pi`, `.cursor`, `.cursorrules`, `.worktreeinclude` checked as directories of symlinks or boilerplate (the `.worktreeinclude` is a git-worktree file-copy list for secrets, unrelated to skills); `.cursorrules` content not examined beyond the first lines.
- Git history: the clone has one commit, so cadence, authorship, churn and whether the skills were ever revised after failures are unknown.
- Whether `npx skills add wondelai/skills/<skill>` works as documented, where it writes, whether it handles `references/`, and whether it works on opencode: not tested, not documented in REPO.
- Whether Claude Code installs only the collection's listed skills, and how it treats `"strict": false`: from `marketplace.json` only, not tested.
- Whether the "Brief (fallback)" paragraphs and "when" pointers change agent behaviour: no eval exists in REPO and we ran none (consistent with DEC-1).
- The upstream site skills.wondel.ai was not visited.
- Our side: only `epic-planning` and `cosmic-python` were read for headings and sizes, not their full text; `docs/development/README.md` was not read beyond sizing (26 KB), so its rules on size, probes and Definition of Done may already cover items I marked ADAPT.

## Five practices most worth taking (summary)

1. The mandatory conditional pointer form for every reference link ("See X when <situation> — <what it adds>"), with no trailing roster, enforced by lint. Directly prevents the EPIC's "moving text is not shrinking" failure.
2. A fixed lean section list with Common Mistakes (Mistake, Why, Fix) and Quick Diagnostic (Question, If No, Action) tables as the decision-rule and checklist forms.
3. Content-filter sentences for the sorting step: "non-obvious points only"; cut a mechanism that restates the principle; omit fields the model already follows.
4. One shared set of operating rules for guided workflows (resume, announce, ask with options and a recommendation, present before writing, done-when), stated once and cited by each workflow, instead of copied 14 times; plus the status name `awaiting-evidence`.
5. A fallback sentence for named external dependencies: offer the install command; if declined, say which mode you are in. Applies to the book rule sets of DEC-4.
