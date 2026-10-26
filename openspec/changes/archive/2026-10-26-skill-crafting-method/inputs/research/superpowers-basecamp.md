# Research — superpowers `writing-skills` and Basecamp `house-skills` against skillery's method

**Change:** `skill-crafting-method`, half one (DEC-3, DEC-8). **Date read:** 2026-10-26.
**Method under test:** [`docs/development-method.md`](../../../../../docs/development-method.md) §1–§9.
Every file listed below was read in full unless marked otherwise. Quotes are ≤ 20 words.

## 1. Sources

| # | Source | Location | Read |
|---|---|---|---|
| S1 | obra/superpowers `writing-skills` v7.0.0 (installed plugin) | `~/.claude/plugins/cache/claude-plugins-official/superpowers/7.0.0/skills/writing-skills/`: `SKILL.md` (3,814 words), `testing-skills-with-subagents.md`, `persuasion-principles.md`, `anthropic-best-practices.md` (a bundled copy of Anthropic's authoring guide, undated), `examples/CLAUDE_MD_TESTING.md`; `graphviz-conventions.dot` and `render-graphs.js` skimmed (diagram tooling only) | primary |
| S2 | basecamp/house-skills @ `11a3df5` (2026-10-24) | `github.com/basecamp/house-skills`: `README.md`, `AGENTS.md`, `.claude/CLAUDE.md`, `plugins/ai/skills/skill-crafting/{SKILL.md,references/guide.md}`, `plugins/ai/skills/agents-md/{SKILL.md,references/guide.md,references/spec.md}`, `plugins/ai/.claude-plugin/plugin.json`, `bin/ci`, `scripts/validate-structure`, `scripts/validate-heavyweight-skill-activation`, `plugins/dev/hooks/hooks.json`, `plugins/dev/agents/pr-worker.md`, git tree listing; `basecamp/claude-plugins` `marketplace.json` | primary |

## 2. What each prescribes, by dimension

### S1 — superpowers `writing-skills`

- **(a) Deciding a skill should exist.** Create when the technique "wasn't intuitively obvious", recurs "across projects", applies broadly (SKILL.md, *When to Create*). Don't create for one-offs, "Project-specific conventions (put in your instructions file)", or mechanical constraints. Skill typing: technique, pattern, reference, plus discipline-enforcing (*Testing All Skill Types*).
- **(b) Descriptions.** "describes ONLY when to use (NOT what it does)"; start "Use when..."; third person; "NEVER summarize the skill's process or workflow"; "Keep under 500 characters if possible"; frontmatter "Max 1024 characters total" (SKILL.md, *SKILL.md Structure*, *SDO §1*). Reason given: an agent followed a workflow summary in the description and skipped the body. The bundled `anthropic-best-practices.md` says the opposite: "include both what the Skill does and when to use it".
- **(c) Body and size.** Template: Overview, When to Use, Core Pattern, Quick Reference, Implementation, Common Mistakes. Word targets: getting-started "<150 words each", frequently loaded "<200 words total", others "<500 words" (*SDO §4*). Separate files only for "Heavy reference (100+ lines)" or reusable tools; keep everything else inline. "One excellent example beats many mediocre ones". Cross-reference by skill name; no `@` links ("force-loads, burns context"). Anthropic copy: body "under 500 lines", references "one level deep", table of contents for files over 100 lines. S1's own SKILL.md (3,814 words) breaks its own 500-word target.
- **(d) Testing.** Iron law "NO SKILL WITHOUT A FAILING TEST FIRST", which "applies to NEW skills AND EDITS"; "Write skill before testing? Delete it. Start over." RED = baseline run with a subagent *without* the skill, rationalisations recorded verbatim; GREEN = minimal skill, same scenarios; REFACTOR = close loopholes. Pressure scenarios combine "3+ pressures" (testing file). Test approach differs by skill type. *Match the Form to the Failure* table: prohibitions for discipline failures, recipes for wrong-shaped output, required slots for omissions, conditionals for conditional behaviour; "No nuance clauses". Micro-tests: "Always include a no-guidance control", "5+ reps per variant", "Variance is a metric". Meta-testing: ask the failing agent how the skill should have been written. Anthropic copy: "Build evaluations first", "three scenarios", test "with all models you plan to use".
- **(e) Maintenance.** Per-skill deployment: "Create multiple skills in batch without testing each" is forbidden. Deployment = commit and "Consider contributing back via PR". Anthropic copy: no time-sensitive wording; legacy in an "Old patterns" section. Silent on versioning and retirement.
- **(f) Organisation.** "Flat namespace - all skills in one searchable namespace"; personal skills directory per runtime. Silent on collections, bundles, ownership.
- **(g) Agents.** Subagents only as the test harness (Agent A writes, Agent B tests in the Anthropic copy). Silent on authoring agents.
- **(h) Security.** Silent on supply chain. `persuasion-principles.md` gives an ethics test: "Would this technique serve the user's genuine interests". Anthropic copy: "Avoid assuming tools are installed".
- **(i) Determinism.** "if it's enforceable with regex/validation, automate it—save documentation for judgment calls" (*When to Create*). Anthropic copy: "Prefer scripts for deterministic operations"; low-freedom instructions for fragile operations. Hooks are not named.

**Dossier row 3 checked against the file.** Holds: RED→GREEN→REFACTOR; iron law including edits; pressure scenarios; rationalisation tables; "Use when…", when-not-what, third person; verb-first/gerund names; cross-reference by name, not `@`; one runnable example; no batching. Needs correction: "<1024 chars" is the frontmatter total, and the description target is <500 characters; "workflows <150" is "getting-started workflows <150 words each"; "Silent on … agents" holds for authoring but subagents are the test harness. Missing from the summary: *Match the Form to the Failure*, micro-tests with a no-guidance control, skill types with type-specific tests, the "automate mechanical constraints" rule, and the bundled Anthropic guide that contradicts the description rule.

### S2 — Basecamp `house-skills`

- **(a) Deciding.** `skill-crafting` guide, Phase 1: "What task does this skill perform?", "What does 'good' look like", "Who will use this skill?". No explicit gate against creating one. `agents-md` classifies every line of an instruction file: OBVIOUS (cut), GOTCHA, TASTE, POINTER (SKILL.md, *Classify every line*).
- **(b) Descriptions.** `skill-crafting` frontmatter has a one-line description plus a 50-line `triggers:` list. `agents-md/references/spec.md` contradicts it: `triggers:` is "documented by neither the Agent Skills spec nor Claude Code"; write "*what it does* plus *when you'd want it*"; Claude caps `description`+`when_to_use` at 1,536 characters. `scripts/validate-heavyweight-skill-activation` fails CI if a heavyweight skill declares `triggers:` or `when_to_use:`, or if required boundary phrases are missing from the description.
- **(c) Body and size.** `skill-crafting`: SKILL.md is a stub ("Open `@references/guide.md` and follow it"); "Don't design structure upfront. Let it emerge from friction." `agents-md`: instruction-file budget "roughly 100 lines and 2.5k always-on tokens", as review thresholds, not quotas; no fixed section template ("makes an author invent commands"); prefer real repo paths to invented examples; "Never restate".
- **(d) Testing.** Co-development flywheel: skill v0 + a real target, update mid-flight, graduate output to exemplar, repeat on a different target. Each skill encodes an eval-check table (`grep`, `wc -l`, `jq`; subjective checks "Binary pass/fail, not scores") and a failure-modes table. Maturity: "Zero open H/M issues AND no new H/M issues across 2 consecutive review rounds", with an external model as second reviewer. Escalation triggers (design trade-off, scope change, "by design", repeated issue) and "Log: Approved: [decision] by [user]". `agents-md`: verify every path, command and literal; pin literals by "capturing both ends"; mutation-test each pin.
- **(e) Maintenance.** Maturity signals ("Skill changes shrink", "Others succeed with the skill"); "Mature ≠ frozen". Version per plugin in `plugin.json` (`ai` 1.2.1). `agents-md`: keep ephemera out (PR numbers, branch names). No retirement procedure.
- **(f) Organisation.** "Real skill files live inside their owning plugin" (`AGENTS.md`); top-level `skills/` holds only symlinks; `bin/ci` → `validate-structure` checks every symlink resolves to `../plugins/{plugin}/skills/{name}`, every plugin skill has one, and no `plugin.json` declares `skills`. README table has a Plugin column. Distribution: `basecamp/claude-plugins` uses `git-subdir` sources (`path: plugins/ai`), and `npx skills add basecamp/house-skills` dereferences the symlinks.
- **(g) Agents.** `plugins/dev/agents/pr-worker.md`: one phase per run, a refusal ("never merge"), and a fixed handoff block (Phase, Repo, PR, Checks, Decisions, Open, Next). Agents "don't reach `npx skills add`". No agent-authoring method.
- **(h) Security.** `AGENTS.md` *Trust Boundaries*: skills processing untrusted input "must document trust boundaries"; two tiers (org OWNER/MEMBER and trusted bots are advisory; everyone else's text is withheld by a script). `agents-md`: untrusted-audit mode is static only, with containment rules (resolve real paths, no symlink escape, bounded work, fail closed); "This skill deliberately ships no verifier."
- **(i) Determinism.** One plugin hook (a `Stop` hook keeping `ralph-lisa-loop` alive). `agents-md`: lines for checks "a linter or CI check rejects" are "the highest-value lines"; "Reserve absolutes for genuine invariants". No general hooks-versus-skills rule.
- **AGENTS.md/CLAUDE.md.** The repo's own `.claude/CLAUDE.md` is one line, `@../AGENTS.md` (an import, as skillery does). The `agents-md` spec offers either the import or `ln -s AGENTS.md CLAUDE.md`, and prefers the import only on Windows.

**Dossier row 4 checked.** Holds: the quoted descriptions, the plugin/symlink layout, both distribution channels, MIT. Closed: the method text has now been read. Correction: the plugins are `dev`, `ai`, `security`, `recap`; skill-crafting is a co-development and eval-table method, not a behavioural-eval harness.

## 3. Coverage against `development-method.md`

| Section | S1 superpowers `writing-skills` | S2 Basecamp `house-skills` |
|---|---|---|
| §1 Start from the person who installs it | partially: discovery flow for the agent; no installer or maintainer reader | partially: "Others succeed with the skill" as maturity; README table |
| §2 Principles | partially: failure-first, progressive disclosure, reference-don't-copy; no one-owner-per-fact | partially: "Never restate", point at the authority; no ownership tripwire |
| §3 Lifecycle — skills (incl. R/C/P) | covers steps 2, 4, 5 in depth; silent on steps 6–8 and posture | partially: steps 2–5 as co-development; silent on registration and posture |
| §4 Lifecycle — agents | silent: subagents only as test harness | partially: `pr-worker` shows one job, refusal, handoff; no method |
| §5 Documentation standard | partially: body template, one example; no Quick Start for users, no CHANGELOG | partially: failure-modes, exemplars, eval table; rejects fixed templates |
| §6 Installability and reuse | silent: personal directory, "contributing back via PR" | covers layout and two install channels; no fresh-install check |
| §7 Feedback and improvement loop | silent: no issue intake | silent: escalation is per session, not issue-driven |
| §8 Where things live | partially: flat namespace, supporting-file rules | covers: `AGENTS.md` contributing section, CI gate |
| §9 Definition of Done | covers: per-skill checklist (RED/GREEN/REFACTOR, quality, deployment) | partially: self-eval table plus maturity gate |
| Description rules | covers, but contradicts its bundled Anthropic copy (when-only vs what+when) | covers in `agents-md` spec; contradicted by own `triggers:` lists |
| Size budgets | covers: word targets per skill type; 500 lines (Anthropic copy) | partially: 100 lines / 2.5k tokens for instruction files only |
| Evals / behavioural testing | covers: baseline subagent runs, pressure, controls, 5+ reps | partially: runnable eval checks, external review rounds, no baseline |
| Security | silent on supply chain | covers trust tiers and untrusted-audit containment |
| Hooks vs skills | partially: "automate it" for mechanical constraints | partially: CI-enforced rules valued; one hook, no rule |
| Agent-instruction file authoring | silent (one test campaign on CLAUDE.md variants) | covers: classify, budget, verify, never restate, import or symlink |

## 4. What these do better than skillery's text

1. **A behavioural baseline.** Skillery asks for "before/after on the failure case" and "`skill-creator` evals where available". S1 says how: subagent without the skill, verbatim record, same scenario with the skill, a no-guidance control, five or more repetitions, variance read as a signal.
2. **Matching the fix to the failure.** S1's four-row table (prohibition, recipe, required slot, conditional) and "no nuance clauses" give an author a choice skillery's text does not offer. It sits well beside the R/C/P posture rule.
3. **Test approach by skill type.** Discipline, technique, pattern and reference skills are tested differently (S1). Skillery tests triggers only, through probes.
4. **Numbers.** Word targets (S1), a 500-line ceiling and one-level references (Anthropic copy), 100 lines / 2.5k tokens for instruction files (S2). Skillery says "a few hundred words": its median SKILL.md is 805 words (max 4,581), and 24 of 32 descriptions exceed 500 characters (median 688).
5. **Description evidence.** S1 records why a workflow summary in the description causes the body to be skipped. Many skillery descriptions summarise the workflow (for example `project-setup`).
6. **Eval and failure-mode tables inside the skill** (S2), with runnable checks, plus maturity signals and logged human decisions at trade-offs.
7. **Static contract tests on activation text** (S2 `validate-heavyweight-skill-activation`): a CI check that a description keeps its boundary phrases. Skillery's probes are fixtures, but no gate asserts description content.
8. **Trust boundaries** for skills that read untrusted text (S2), and an audit mode for someone else's repo. Skillery's method has no security section.
9. **Authoring the agent-instruction file** (S2 `agents-md`): classify every line, cut the obvious, verify every command and path, pin literals, keep ephemera out. Skillery's `AGENTS.md` (12 KB) has no method behind it in §1–§9.
10. **Agent handoff shape** (S2 `pr-worker`): a fixed final block a fresh agent can resume from; a concrete form of skillery's "what it returns".

## 5. Contradictions with skillery's method

1. **Description content.** Skillery: "*Use when… / Not for…*, listing the phrases that should fire it". S1: when only, never the workflow, under 500 characters. Anthropic copy and S2: what *and* when. Skillery must pick one and state the reason.
2. **Iron law on edits.** S1: every edit needs a failing test first; "Delete means delete". Skillery routes a wording or description tweak to a direct PR with a probe, and its failure case need not be a behavioural run.
3. **Where detail lives.** Skillery: "details, tables and templates go to `references/`". S1: keep inline unless heavy reference (100+ lines) or a tool. S2's `skill-crafting` goes the other way: SKILL.md is a stub.
4. **Fixed templates.** Skillery §5 mandates Quick Start, When not to use, Related skills. S2 warns that a fixed template makes authors invent content and lets structure emerge.
5. **Absolutes.** S1 (persuasion principles) recommends "YOU MUST", "No exceptions" for discipline skills. S2: "Reserve absolutes for genuine invariants", give each its reason. Skillery uses both styles without a rule.
6. **`@` loading.** S2's `skill-crafting` loads its guide with `@references/guide.md`; S1 forbids `@` links, and S2's own spec says use plain links. Skillery cites by name; it agrees with S1.
7. **AGENTS.md and CLAUDE.md.** Skillery: `AGENTS.md` is the source, `CLAUDE.md` a thin pointer that imports it, never a symlink. S2's `agents-md` presents `ln -s AGENTS.md CLAUDE.md` as an equal option. S2's own repo uses the import (`.claude/CLAUDE.md` → `@../AGENTS.md`), which agrees with skillery. S1 is silent.
8. **Non-standard frontmatter.** S2 rejects undocumented keys (`triggers:`) for activation. Skillery adds `boundary` and `related_skills`; they are not used for activation, so there is no direct conflict, but the method should say they are catalogue metadata only.
9. **Layout direction.** S2 keeps real files in the bundle and symlinks the flat view. Skillery keeps real files flat and symlinks the bundles (§7 below).

## 6. Dossier question 1 — `writing-skills` as skillery's authoring method?

**Answer: yes for the authoring core, with deltas; no as a whole method.** S1 is stronger than skillery's text on §3 steps 2, 4 and 5 and on the skill-body part of §5 and §9. It says nothing about steps 6–8, §4, §6, §7 or security, and its description rule conflicts with its own bundled guide. It also pulls in `superpowers:test-driven-development` as required background; that skill is already a declared dependency. Its examples use `~/.claude/` paths, so skillery bodies may cite it by name but not copy its wording (body-agnosticism gate).

Deltas skillery keeps:

1. One owner per fact and `tests/ownership.yaml`; `boundary` and `related_skills` as catalogue metadata.
2. Trigger probes as repo fixtures, one positive and one near-miss per description change.
3. The R/C/P posture rule before an edit.
4. A proportionate test rule: which changes need an S1 baseline run (new skill, boundary move, discipline rule) and which a probe only (wording, link). Without it, the iron law silently overrules §3's change path.
5. One description rule, chosen and justified (when-only vs what+when; whether "Not for…" stays; a character limit).
6. Size budgets as review thresholds, with a gate or report.
7. Bundles, `bundles.yaml`, `PURPOSE_OF`, inventory, `make validate`.
8. Dual-CLI body agnosticism.
9. Agents: type, dispatch contract, Gherkin scenarios.
10. User documentation: Quick Start with a worked example, README row, CHANGELOG line.
11. The issue loop, release, fresh install on both CLIs, licence and provenance.
12. Supply-chain and trust-boundary rules (from S2 and OWASP, row 8 of the dossier).
13. The hooks-versus-skills rule, tied to `hooks/inventory.yaml`.
14. The pinned version of the dependency (7.0.0 read here) and the eval tool choice (dossier question 3).

## 7. Basecamp's layout compared with skillery's `bundles/` tree

| | Basecamp | Skillery |
|---|---|---|
| Real files | `plugins/<plugin>/skills/<name>/` | `skills/<name>/`, `agents/<name>.md` |
| Symlinks | `skills/<name>` → `../plugins/<plugin>/skills/<name>` (flat view) | `bundles/<b>/skills/<name>` → `../../../skills/<name>` (per bundle) |
| Membership source | Directory location; hand-made symlink | `bundles.yaml`, rendered by `make bundles` |
| Claude install | `git-subdir` extracts only the plugin directory, so files must be physically there | Marketplace entry `source: ./bundles/<b>`; relies on Claude dereferencing symlinks within one marketplace (spike-dec5, Claude Code 2.1.310) |
| Other agents | `npx skills add` dereferences the flat symlinks | `npx skills add` and the opencode installer read real files in `skills/` |
| Gate | `validate-structure` in `bin/ci` | `bundle_gates` in `make validate` |
| Moving a skill | Move the directory; history moves with it | Edit one line of `bundles.yaml` |
| Agents | Only in the plugin; Claude only | Rendered for opencode too |

The two are mirror images. Basecamp's direction is forced by `git-subdir`; skillery's would break under `git-subdir`, because its symlinks leave the bundle directory. Basecamp's layout does not overturn `single-source-distribution` DEC-5 (b): skillery keeps real files where both CLIs read them and a declarative membership file. It is the ready fallback if Claude stops dereferencing in-marketplace symlinks: invert, with real files under `bundles/<b>/` and `skills/` as symlinks. That costs a declarative `bundles.yaml` (location becomes membership) and makes Windows checkouts depend on symlinks for the opencode path instead of the Claude path.

## 8. Unverifiable or open

- S1's quantitative claims are not sourced in a way that can be checked here: the description-shortcut incident, the "fully separated distributions" wording tests, and Meincke et al. (2025) "33% → 72%".
- `anthropic-best-practices.md` is an undated copy; it may differ from Anthropic's live page (dossier row 1 covers the blog, not this page).
- S2 `skill-crafting` names exemplar `skills/llms-txt/`, which is not in the repository tree at `11a3df5` (a dead reference in the method's own exemplar list). The Codex thread ID and review rounds cannot be checked.
- S2's Claude Code claims (1,536-character cap, four-hop `@` import depth, "reads `CLAUDE.md`, not `AGENTS.md`") were not checked against Claude Code's documentation in this pass.
- Upstream superpowers on GitHub was not compared with the installed 7.0.0.
- `scripts/validate-heavyweight-skill-activation` was read in full; the `test/address-pr-reviews` fixtures were not read (outside the method).
- Side finding: the *installed* skillery `project-setup` in the local plugin cache still describes "CLAUDE.md as the source, AGENTS.md an optional symlink", while the repo source says AGENTS.md is the source and CLAUDE.md never a symlink. Stale installs carry the contradicted rule until users update.
