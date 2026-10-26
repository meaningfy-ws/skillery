# Implementation review — single-source-distribution

> Independent review and test of the uncommitted working tree on `feat/single-source-and-agent-standard`,
> compared against `develop`. Reviewed 2026-10-26 using `meaningfy-code-review` (all lenses L1–L5 in one
> pass) and `verification-before-completion`. Every experiment ran in a scratch copy
> (`/tmp/claude-1000/.../scratchpad/review-ssd/repo`) with `HOME` pointed at a scratch directory. The real
> working tree, `~/.claude` and `~/.config/opencode` were not touched.

**Verdict: PASS-WITH-FIXES.** There are no blockers or majors. The core contract holds and is proven:
single source, a deterministic render, gates that catch every kind of drift, a byte-identical quoting
pass, and one mapping table. All findings below are MINOR. Fix 1–4 before merge; 5–7 can land in the
same PR or as follow-ups.

## Evidence summary (all re-run by the reviewer)

| Check | Command | Result |
|---|---|---|
| Validate | `make validate` | lint `OK — repository self-consistent.`; pytest `107 passed, 7 deselected` |
| Node tests | `node --test tests/*.test.mjs` | `tests 16 · pass 16 · fail 0` |
| Spine | `make validate-spine` | `25 passed, 4 failed`: exactly the 4 known siblings (`add-devops-bundle`, `add-sales-bundle`, `fix-accumulated-skill-defects`, `skill-crafting-method`) |
| Claude validator | `claude plugin validate .` | `✔ Validation passed` |
| OpenSpec | `openspec@<pin> validate single-source-distribution --strict` | `Change 'single-source-distribution' is valid` |
| Idempotence | `python -m tools.bundle_gen generate .` run twice in the scratch copy, then `diff -r --no-dereference` against the real tree | `IDENTICAL`; `check` → `OK — bundle renderings in sync.`; 35 links (32 skills + 3 agents) |
| Byte identity (12 descriptions) | Script: `yaml.safe_load(new)["description"] == raw old value` per file, using `git show develop:<path>` | All 12 `identical`, `body_same=True`, `lines_changed=1`. The only other `skills/` change is the task 5.2 one-word path fix in `linkml-engineering/references/generation-and-templates.md`. `agents/` is unchanged |
| Mapping tables | `grep modelAliases/claude-opus` in `tools/**` | Tables only in `tools/opencode-agent-map.json`, verbatim from develop's `MODEL_ALIASES`/`TOOL_NAMES`/`TOOL_PERMISSION` |
| Package | `npm pack --dry-run --json` | 219 files: `skills/` + 3 agents + 2 JSON + 3 `.mjs` + README/LICENSE/package.json; nothing from `bundles/`, `.opencode/` or bytecode |
| Agent parity | `--global` install in scratch `HOME`, then compare bodies with develop's `.opencode/agents/*.md` | 3 agents written; bodies identical; the 3 expected `gap:` lines |
| CI | `.github/workflows/validate.yml` | The new `opencode-installer` job is correct (checkout@v4, setup-node@v4 node 20, `npm run test:opencode-installer`, no `npm install`; package has no deps) |
| GitNexus | `detect_changes(compare, develop)` | Code symbols changed only in `tools/repo_lint/lint.py`, `tools/skill_inventory.py`, the `.mjs` files and the tests (+ new `tools/bundle_gen`). The doc "touched" sections in `spine/`, `prompts/`, `hooks/` and archive are index false positives (`git diff develop` on them is empty). `impact(load)` → HIGH, which is expected: `main`/`write`/`gate_errors` sit on the one read seam |

Lint negative experiments in the scratch copy all fire as specified:
- a skill in no bundle → `unregistered_skill_dirs`;
- an unquoted `: ` → `frontmatter_strict_yaml`;
- a skill in two bundles → `expected_bundle_membership`;
- an agent in 5 bundles → `agent '…' is in multiple bundles: …`;
- an agent in no bundle, and a listed `ghost` → the exact D5 messages;
- a dangling symlink, a real file, a stray dir, a dir copy instead of a link, and a wrong target →
  `orphan` ×3, `not a symlink (copy?)` and `wrong target`, with nothing reported twice;
- `make bundles` repairs all of them.

Installer experiments behave as specified:
- uninstall removes only what was installed; the user's `my-agent.md` and `my-skill/` survive;
- an unmanaged `.opencode/agents/implementer.md` → refusal, exit 1, the file is untouched and no skill
  is written (the pre-write check holds);
- `--force` overwrites;
- `--target` writes 9 skills and no agent, prints the gap notice, and records `managedAgents: []`.

## Traceability

- **TC-01…TC-26:** each has a test, including the edge cases: the uppercase name (TC-07), wrong target
  (TC-05), no model (TC-13), multi-line description (TC-14), `--force` (TC-16) and the `--target`
  edge (TC-15).
- **Delta-spec scenarios:** each is covered by a test, or by behaviour verified above.
- **Not re-verified by this review:** "Claude install is scoped" and "Agents arrive only with their
  bundle" (IT-01/02) and "Every skill is loadable by a strict loader" (IT-03, `npx skills --list`).
  These rest on the implementer's local smart-HTTP run (design.md Implementation notes), which this
  review did not repeat. The PyYAML strict check is the in-repo proxy, and it is green.
- **Ticked tasks:** each matches the tree.
- **Unticked tasks:** 6.1, 9.2–9.4 and 10.x are correctly left open. They need a push, a manual run or
  a merge, and are owed before release, not before merge review.

## Findings

### 1. MINOR (L1 security, defence in depth) — bundle, skill and agent names are not validated as path segments
- **Evidence.** `tools/bundle_gen/gen.py:51-54` (`_str_list`) accepts any non-empty string as a skill
  or agent name, and only bundle names are kebab-checked (`:61`).
- **Experiment.** I added `../../../../escape-me` to a skill list, then ran
  `python -m tools.bundle_gen generate .`, which printed `rendered 38 file(s)/link(s)`. It created the
  symlink `review-ssd/escape-me -> ../../../skills/../../../../escape-me`, **outside the repository**
  (`gen.py:161-163`, `os.symlink` with no containment check).
- **Installer side.** The installer joins names from the catalogue and from the user-local
  `.skillery-manifest.json` straight into paths:
  - `tools/skillery-opencode.mjs:200, 209` (`copyDirectoryAtomic` does `rmSync(destination, {recursive:true})`);
  - `:251` (uninstall `rmSync(path.join(roots.skills, skill), {recursive:true})`);
  - `:255`.

  A corrupted or hand-edited manifest entry like `"../.."` would recursively delete outside the
  target.
- **Mitigation today.** `missing_skill_dirs` would turn `make validate` red for such a name, so it
  cannot ship through CI.
- **Fix:**
  - in `load()`, validate every skill and agent name with `_KEBAB`, raising `ValueError` naming the
    bundle;
  - in the installer, reject any catalogue or manifest name that fails `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
    before any `path.join`;
  - add one test each (TC-07 row; node test with a manifest containing `"../x"`).

### 2. MINOR (L2 correctness) — `uninstall --target` on a `--global`/`--project` install corrupts `managedAgents` and misreports removals
- **Evidence.** `skillery-opencode.mjs:244-261`. With `--target`, `stillAgents` is forced empty, so
  every managed agent is printed as `remove agent X` but **not** removed (`:255` guards on
  `roots.agents`). Then `manifest.managedAgents = []` is written even though the agents' bundle is
  still installed.
- **Experiment:**
  ```
  install meaningfy-building meaningfy-core --global
  uninstall meaningfy-core --target ~/.config/opencode/skills
  → "remove agent code-reviewer|epic-planner|implementer"; manifest "managedAgents": []; the 3 files are still on disk
  install meaningfy-building --global
  → "Refusing to overwrite unmanaged agent 'code-reviewer'"
  ```
- **Fix.** When `roots.agents` is null, leave `manifest.managedAgents` unchanged and list no agent
  removals. Alternatively, refuse `--target` when the manifest has `managedAgents`. Add a node test.

### 3. MINOR (L2 correctness) — install does not prune skills and agents that were dropped from a bundle on upgrade
- **Evidence.** `commandInstall` (`skillery-opencode.mjs:228-232`) recomputes
  `managedSkills`/`managedAgents` from the new catalogue but never removes previously managed items
  that are gone.
- **Experiment.** I installed `meaningfy-building --global`, edited the scratch catalogue to drop
  `implementer`, and re-installed. The manifest became `["code-reviewer","epic-planner"]`, but
  `implementer.md` stayed on disk, now **unmanaged**: it is never uninstalled, and it blocks a later
  install.
- **Scope.** This contradicts "exactly that bundle's skills … and its rendered agents … and nothing
  else" (dual-cli-distribution delta) on the upgrade path. It is pre-existing for skills and new for
  agents. The 3.0.0 migration step "rerun your install command" is where it bites first, if an agent
  ever moves bundle.
- **Fix.** In `commandInstall`, remove the set difference `old managed − new managed`, exactly as
  `commandUninstall` does. Add a node test.

### 4. MINOR (L2 / L4) — an invalid `bundles.yaml` floods lint instead of "reported once"
- **Evidence.** `lint.py:60-66` `_bundle_list` returns `[]` on `ValueError`, so the membership checks
  report every skill and agent.
- **Experiment.** Renaming the top-level `description:` gave `FAIL — 68 problem(s)`: 32
  `unregistered_skill_dirs`, 32 `expected_bundle_membership` and 3 `agent … in no bundle`, plus the
  one real `bundle_gates: bundles.yaml: the top level has unknown key(s) descriptio`.
- **Contradiction.** This contradicts design.md Implementation note 7 ("so the fault is reported
  once"), and the real error is buried.
- **Fix.** Have `_bundle_list` return `None` on failure, and have the membership checks return `[]`
  when it does, leaving `bundle_gates` as the one reporter. Add a test.

### 5. MINOR (documentation sync) — leftover stale references
- `Makefile:33`: the `skill-inventory` comment still says "derived from each SKILL.md +
  marketplace.json". It should say `bundles.yaml`.
- `openspec/changes/single-source-distribution/proposal.md:15`: Appetite still says "One release
  (minor, with a migration note)", which contradicts DEC-6/R7 (3.0.0 MAJOR). Change it to "major".
- `docs/development-method.md` §9 provenance line ends "per DEC-8". DEC-8 is an EPIC-local id that
  dangles once the change is archived. Point it at `spec/skill-repo-governance.md` rule 1 instead.
  This is a pointer-level edit, allowed in the human's WIP.
- **Open sibling changes still instruct the removed target:**
  - `openspec/changes/define-ai-domains/tasks.md:147` (`- [ ] 7.8 Run make generate-opencode …`);
  - `openspec/changes/define-blc-engagement-model/tasks.md:88` (`- [ ] 8.1 Run make generate-opencode`).

  At minimum, note them in the PR. Better: a one-line correction to "`make bundles` if membership
  changed; skill content needs no regeneration".
- `CONTRIBUTING.md:62`: the `git add` list omits `docs/skill-inventory.md` and
  `tools/skill_inventory.py` (`PURPOSE_OF`), which Step 2 and AGENTS.md require for a new skill. This
  is pre-existing, but the line was rewritten here.
- **Checked and clean:**
  - the full-repo grep (excluding archive and this change) for `generate-opencode`, `opencode_gen`,
    `.opencode/skills`, `EXPECTED_BUNDLE_NAMES`, `source: "./"`, `OPENCODE_CONFIG_DIR`, `PARITY.md`,
    `GAP.md` and `bundles.json` finds only CHANGELOG history and migration text, legitimate user
    `opencode.json` config references, and the living specs that 10.x will sync;
  - README, AGENTS.md (work loop, branch flow, bundle step, CI node job), CONTRIBUTING (single
    route to §9), `spec/*`, `docs/environment/dual-cli/*`, and dev-method (§3 step 6, §6, §9 bundle
    line, exactly one new §9 line);
  - CHANGELOG 3.0.0 "Action needed" items 1–5 match D15 and the observed behaviour;
  - the `#300---2026-10-26` anchor is valid;
  - `VERSION`, `package.json`, `marketplace.json`, `tools/opencode-catalogue.json` and
    `hooks/inventory.yaml` are all at 3.0.0.

### 6. MINOR (L5 fit, suggestion) — Claude Code no longer sees the GitNexus MUST rules automatically
- **Evidence.** `CLAUDE.md` now carries only a prose link to `AGENTS.md` (D14). Claude Code auto-loads
  `CLAUDE.md`, but it follows a Markdown link only if the agent chooses to. The "MUST run impact …"
  block therefore left Claude's default context. This applies to the whole operating manual, which
  was link-only before too, so it is consistent with the existing design. It is a behavioural
  regression only for the GitNexus rules.
- **Fix (optional).** Use the `@AGENTS.md` import syntax in `CLAUDE.md`, which keeps one copy in git
  and loads it in Claude, or record the trade-off in D14.

### 7. INFO (L4, pre-existing, not introduced here)
- A skill dir in no bundle is reported twice (`unregistered_skill_dirs` and
  `expected_bundle_membership`).
- The skill "multiple bundles" message prints a Python list repr (`['a', 'b']`), while the new agent
  message prints `a, b`.

  Align them when the sibling `agent-authoring-standard` touches the same function.

## Simplicity (ponytail) check
- **Dead code and bridges:** none left. The C2 bridge in `opencode_gen` went with the module, and
  `grep opencode_gen|generate-opencode|GENERATED_SKILLS_ROOT tools tests Makefile` is empty.
- **Size:** `bundle_gen/gen.py` is 223 lines with no abstraction beyond D4's five functions. The
  catalogue JSON instead of an npm YAML dependency is the smaller option, and it holds.
- **Cosmetic:** `renderBundleAgents` passes `AGENTS_ROOT` explicitly, which is the default.

## Fix disposition

Applied 2026-10-26 by the builder (lead decision: fix all six, test-first where code changed). After
the fixes:
- `make validate`: lint OK, 110 passed.
- `npm run test:opencode-installer`: 20/20.
- `make bundles` run twice: outputs and links identical; `bundle_gen check` reports OK.
- `openspec validate single-source-distribution --strict`: valid.

| Finding | Fix | Test (watched fail first) |
|---|---|---|
| 1 — names not validated as path segments | `bundle_gen.load` (`_str_list`) requires kebab-case skill and agent names. The installer's `assertSafeNames` rejects non-kebab names in the catalogue (`loadCatalogue`) and in the install manifest (`readInstallManifest`) before any path join or `rm` | `test_tc07_load_rejects[escape-me]` and `[Bad_Agent]`; node "finding 1" ×2: a manifest with `../victim` exits non-zero and the victim survives; a catalogue with `../../x` is rejected |
| 2 — `uninstall --target` corrupts `managedAgents` | Without an agents root, `uninstall` keeps every managed agent and lists no agent removal. `install --target` keeps `managedAgents` unchanged | node "finding 2": a `--project` install, then `uninstall … --target <skills>` gives no `remove agent`, `managedAgents` stays `["ag"]`, the file stays, and a re-install is not refused |
| 3 — no prune on upgrade | `commandInstall` removes `old managed − new managed` skills (and agents, when there is an agents root) before writing the manifest. Unmanaged user files are untouched | node "finding 3": after `beta` and `ag` are dropped from the catalogue, a reinstall removes them and keeps `my-skill/` and `my-agent.md` |
| 4 — invalid `bundles.yaml` floods lint | `_bundle_list` returns `None` on `ValueError`. `missing_skill_dirs`, `unregistered_skill_dirs`, `expected_bundle_membership` and `agent_bundle_membership` then return `[]`, so `bundle_gates` is the one reporter | `test_invalid_bundles_yaml_is_reported_once` |
| 5 — stale doc references | `Makefile` skill-inventory comment → `bundles.yaml`. Proposal Appetite → major 3.0.0. dev-method §9 "per DEC-8" → a link to `spec/skill-repo-governance.md` placement rule 1. `define-ai-domains` 7.8 and `define-blc-engagement-model` 8.1 → `make bundles`, and the remaining `make generate-opencode` mentions in open changes (`define-ai-domains/design.md`, `define-blc-engagement-model/{proposal,design}.md`, `define-roles-and-raci/proposal.md`) → `make bundles`; archive left frozen. CONTRIBUTING `git add` + `docs/skill-inventory.md tools/skill_inventory.py` | Doc grep over `openspec/changes` (excluding archive and this change) is empty; `broken_links` green |
| 6 — GitNexus rules not auto-loaded in Claude | `CLAUDE.md` gains an `@AGENTS.md` import line (one copy in git, loaded by Claude Code); D14 amended in design.md "Post-review fixes" | TC-26 guard (`agents_canonical_invariant`) still `[]` on the real repo |
| 7 — INFO | Not changed (pre-existing; for `agent-authoring-standard`) | — |
