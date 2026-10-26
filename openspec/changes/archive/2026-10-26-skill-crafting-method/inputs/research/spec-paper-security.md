# Research — specification, paper, distribution, security (half one, part A)

**Change:** `skill-crafting-method` · **Read on:** 2026-10-26 · **Method under test:**
[`docs/development-method.md`](../../../../../docs/development-method.md) §1–§9.
**Status:** input to `design.md`. Closes dossier rows 5–8 and 10 against their primary sources (DEC-8).
Web pages were treated as data. Quotes are verbatim and short; "where" names the page section.

## 1. Sources and read status

| # | Source | URL | Read status |
|---|---|---|---|
| P | Destefanis, *Authoring Agent Skills: A Software-Engineering Approach* (arXiv 2607.25032v1, 27 Jul 2026, CC BY 4.0) | https://arxiv.org/html/2607.25032v1 | **primary, full text** (§1–§12). The dossier's title ("…view") is wrong: it is "…Approach". Sole author, UCL. |
| S | Agent Skills specification + its "For skill creators" pages + `skills-ref` validator source | https://agentskills.io/specification ; …/skill-creation/best-practices ; …/optimizing-descriptions ; …/evaluating-skills ; github.com/agentskills/agentskills `skills-ref/src/skills_ref/validator.py` | **primary, full** (spec, three creator pages, validator). Not read: quickstart, using-scripts, client-implementation. |
| V | Vercel `skills` CLI and skills.sh | github.com/vercel-labs/skills (README, `docs/creating-skills.md`, `docs/commands.md`, `docs/troubleshooting.md`); https://skills.sh/docs | **primary, full** for README, creating-skills, troubleshooting, skills.sh docs; commands.md read for install/scope/update/lock sections only. |
| O | OWASP Agentic Skills Top 10 (v1.0 "2026 Edition", public review; entries dated Mar–Jun 2026) | https://owasp.org/www-project-agentic-skills-top-10/ ; repo OWASP/www-project-agentic-skills-top-10 `ast01.md`…`ast10.md`, `skill-development-guide.md` | **primary, all ten entries in full**; skill-development-guide skimmed (first half). README, checklist, case studies not read. |
| C | opencode docs — Agent Skills, Agents | https://opencode.ai/docs/skills/ ; https://opencode.ai/docs/agents/ (both "Last updated: Oct 24, 2026") | **primary, full** both pages. |

**OWASP naming note.** Search summaries disagree on AST05 ("Unsafe Deserialization" in v0.5 PDF, "Prompt
Injection" in the proposal). The current repo file is **AST05 — Untrusted External Instructions**;
deserialization now sits inside AST04. Cite by the repo file names below, with the version.

## 2. What each source prescribes, by dimension

Dimensions: (a) deciding a skill should exist · (b) descriptions/triggers · (c) body structure and size
· (d) testing/evals · (e) maintenance/versioning/retirement · (f) collection organisation · (g) agents ·
(h) security/supply chain · (i) determinism (hooks vs skills).

### P — the paper

| Dim | Prescription | Quote (where) |
|---|---|---|
| a | Single responsibility; build only for observed gaps, measured without the skill first | "keeps the skill aimed at real gaps rather than imagined ones" (§9) |
| b | Third person; state what it does and when; concrete terms; frontmatter is first suspect when it fails to fire | "Write it in the third person" (§5); "state both what the skill does and when" (§5) |
| b | Explicit-invocation-only for actions that must never fire on model judgement | "Use this for actions that should never fire on the model's own judgement" (§5) |
| c | Body < ~500 lines; add only what the model lacks; references one level deep, ToC for >100-line files; one term per concept; legacy in a marked section; degrees of freedom match fragility | "References stay one level deep" (§6); "Avoid time-sensitive statements that will date" (§6) |
| d | Behavioural evaluation: pass rate over runs, rubric or judge; evals before the skill; two-instance loop; test per model; bundled scripts unit-tested normally | "judged by a pass rate over several runs rather than a single pass or fail" (§2); "Test with each model intended for use" (§9) |
| e | Silent beyond "maintained as the surrounding system changes" (§1); no versioning or retirement guidance | — |
| f | Silent (only personal vs project skill directories, §3) | — |
| g | Subagent placed in a mechanism table only: "separate instance with its own context window" (Table 1); no authoring guidance | — |
| h | Third-party skill = dependency; read SKILL.md, scripts, references and URLs before use | "a skill from a third party should be read in full before it is used" (§12) |
| i | Decision rule: judgement → skill; must-hold-every-time → hook | "a requirement that must hold every time belongs in a hook" (§12) |

### S — agentskills.io specification and creator guides

| Dim | Prescription | Quote (where) |
|---|---|---|
| a | Start from real expertise or project artefacts; if the agent already does the task, the skill adds nothing | "if the agent already handles the entire task well without the skill, the skill may not be adding value" (best-practices) |
| a | Scope like a function: not so narrow that several load, not so broad it misfires | "Skills scoped too broadly become hard to activate precisely" (best-practices, Design coherent units) |
| b | `description` 1–1024 chars, says what and when, with keywords; imperative "Use this skill when…"; focus on user intent; "be pushy"; ~20 trigger queries (8–10 each), near-miss negatives, 3 runs, 0.5 threshold, 60/40 train/validation split | "The most valuable negative test cases are near-misses" (optimizing-descriptions) |
| c | Format: `SKILL.md` + optional `scripts/ references/ assets/`; body < 500 lines and < 5,000 tokens; references one level deep; say *when* to load each file; gotchas in SKILL.md; templates, checklists, validation loops; defaults not menus | "Keep your main SKILL.md under 500 lines." (spec, Progressive disclosure) |
| c | Frontmatter fields: `name`, `description` (required); `license`, `compatibility` (≤500), `metadata` (string→string), `allowed-tools` (experimental) | "A map from string keys to string values" (spec, metadata field) |
| d | `evals/evals.json` in the skill; each case run with and without the skill (or old version); assertions added after first run; grading with evidence; benchmark of pass rate, tokens, time; human review; blind comparison | "run each test case twice: once with the skill and once without it" (evaluating-skills) |
| e | Old version as baseline when improving; otherwise silent on versioning, deprecation, retirement (`metadata.version` only as an example) | "use the previous version as your baseline" (evaluating-skills) |
| f | Silent | — |
| g | Silent (subagents only as eval-isolation mechanism) | — |
| h | Silent in the pages read (`allowed-tools` is the only privilege lever) | — |
| i | Silent; prescriptive scripts for fragile steps is the nearest ("Do not modify the command") | best-practices, Match specificity to fragility |
| — | Validator `skills-ref` enforces an allow-list of top-level keys | "Unexpected fields in frontmatter" (validator.py `ALLOWED_FIELDS`) |

### V — Vercel `skills` CLI / skills.sh

| Dim | Prescription | Quote (where) |
|---|---|---|
| a, b, c, d | Silent beyond a template (`npx skills init`) with "When to Use" and "Steps" sections; requires `name` + `description` only | "Brief explanation of what the skill does" (creating-skills) |
| e | `skills check` / `skills update`; `experimental_sync` tracks `skills-lock.json`; pin Git refs for reproducibility | "Pin a Git ref when you need reproducible remote content" (commands.md, sync) |
| f | Discovery walks `skills/` up to three levels (flat or one/two category levels); reads `.claude-plugin/marketplace.json`; `metadata.internal: true` hides WIP skills; packs bundle skills | "covering flat layouts … and catalog layouts with one or two category levels" (creating-skills) |
| f | Install as symlink to one shared copy, per project or global | "Symlink (Recommended) … Single source of truth" (commands.md) |
| g | Silent (skills only) | — |
| h | Routine audits but no guarantee; review before install; download size caps | "we cannot guarantee the quality or security of every skill listed" (skills.sh/docs) |
| i | Silent | — |

### O — OWASP Agentic Skills Top 10 (all ten)

| ID (severity) | Risk | Mitigations that reach an *author/curator* (registry/runtime ones omitted) |
|---|---|---|
| AST01 Malicious Skills (Critical) | Payloads in prose and code; skills run with full agent permissions | Never auto-execute "Prerequisites"; hash-pin installed skills and alert on change; protect identity files (`MEMORY.md`, `AGENTS.md`) |
| AST02 Supply Chain Compromise (Critical) | No provenance; nested deps; repo config (hooks, `.claude/settings.json`) as execution path | Provenance tied to a digest of SKILL.md + resources ("can live in the `SKILL.md` `metadata` extension point"); pin nested deps to `sha256:`; treat hooks/settings as executable code; internal mirror/allow-list |
| AST03 Over-Privileged Skills (High) | Broader permissions than function | Declare a permission manifest; scoped credentials; flag writes to identity files; data ≠ instruction hierarchy |
| AST04 Insecure Metadata (High) | Spoofed names/descriptions; unsafe YAML; hidden Unicode/base64 | `safe_load` + key allow-list "rejecting any unexpected fields"; schema validation; scan prose for zero-width/base64 |
| AST05 Untrusted External Instructions (High) | URLs a skill tells the agent to read become instructions; rug-pull | "Prefer inlining over fetching"; pin and re-verify hashes of referenced content; audit references transitively |
| AST06 Weak Isolation (High) | Skills share host context; workspace skill shadowing | Container by default; confirm workspace overrides (runtime-level) |
| AST07 Update Drift (Medium) | Installed and forgotten; malicious "patch" | Pin to content hashes "not version ranges"; human approval of updates; inventory with version, hash, last-verified date |
| AST08 Poor Scanning (Medium) | Scanners miss natural-language payloads | Scan code and prose; scanner skills advisory only; scan every file; re-scan |
| AST09 No Governance (Medium) | No inventory, approval, revocation | Central inventory (name, version, hash, installer); approval workflow; revocation process |
| AST10 Cross-Platform Reuse (Medium) | Security metadata lost when ported | "require a full security metadata re-validation — never assume equivalence"; proposes a "Universal Skill Format" |

Dimensions a–g and i: OWASP is silent on authoring method, size, evals, organisation and agents. On
(i) it names hooks only as an *attack* surface ("Treat repository configuration files (hooks …) as
executable code", AST02).

### C — opencode docs

| Dim | Prescription | Quote (where) |
|---|---|---|
| a, c, d, e, i | Silent (format and permissions only) | — |
| b | `description` 1–1024 chars, "specific enough for the agent to choose correctly"; listed in `<available_skills>` | skills, Follow length rules |
| c | Fields: `name`, `description`, `license`, `compatibility`, `metadata` (string→string); name must match directory | "Unknown frontmatter fields are ignored." (skills, Write frontmatter) |
| f | Six discovery paths incl. `.claude/skills/` and `.agents/skills/`; names unique across locations | skills, Place files |
| g | Agents: `primary` / `subagent` / `all`; `description` required; `permission` (edit, bash, webfetch, skill, task…) replaces deprecated `tools`; `steps`, `hidden`; `opencode agent create` | "tools is deprecated. Prefer the agent's permission field" (agents, Tools) |
| h | Per-skill `allow/deny/ask` and per-agent permission globs — the only least-privilege lever named | skills, Configure permissions |

## 3. Coverage of skillery's method

Cells: **covers / partially / silent / contradicts** + evidence (≤15 words).

| Skillery row | P (paper) | S (spec + guides) | V (Vercel) | O (OWASP) | C (opencode) |
|---|---|---|---|---|---|
| §1 Three readers | partially — interface (description) vs implementation framing | partially — agent reader only; human review of eval outputs | silent | silent | silent |
| §2 Principles | covers — single responsibility, low coupling, token economy | covers — coherent units, add what agent lacks | silent | partially — least privilege only | silent |
| §2.3 One owner per fact | partially — low coupling, explicit dependencies | partially — avoid overlapping skills loading together | silent | silent | silent |
| §2.4 Reference, don't copy | covers — third-party skill is a dependency, read in full | silent | partially — symlink to one shared copy | **contradicts in part** — AST05 prefers inlining over fetching | silent |
| §2.5 Failure-first | covers — evals before the skill, baseline without it | covers — with/without-skill runs, real failures as source | silent | silent | silent |
| §3 Skill lifecycle (8 steps) | partially — eval-driven loop, two-instance drafting | partially — authoring + eval loop, no registration/ship | silent | silent | silent |
| §3 Posture R/C/P | silent | partially — "match specificity to fragility" per part | silent | silent | silent |
| §4 Agent lifecycle | silent — subagent only in a mechanism table | silent | silent | partially — AST03 least privilege applies to agents | partially — type (mode), description, permissions |
| §5 Documentation standard | partially — templates, worked examples, ToC for long refs | covers — gotchas, templates, say when to load each file | partially — "When to Use" template section | partially — "Document all permission requirements" (AST01) | partially — "When to use me" example |
| §6 Installability and reuse | silent | partially — `compatibility` field for environment needs | covers — install, scope, update, lock, packs | partially — pin, inventory, mirror (AST02/07/09) | covers — discovery paths, name uniqueness |
| §7 Feedback loop | partially — bring observations back to drafting instance | partially — human feedback.json per eval case | silent | partially — report suspicious skills; revocation | silent |
| §8 Where things live | silent | silent | silent | silent | silent |
| §9 Definition of Done | silent | partially — validator + eval pass criteria | silent | partially — AST01 deployment checklist | silent |
| Frontmatter/format | covers — name/description limits | covers — the normative format; validator rejects unknown keys | covers — name + description, `metadata.internal` | **contradicts S** — Universal format adds top-level `version`, `permissions` | covers — same fields, ignores unknown ones |
| Description rules | covers — third person, what + when, concrete terms | covers — imperative, intent, pushy, near-miss tests | partially | partially — AST04: descriptions can impersonate | partially — length only |
| Size budgets | covers — <~500 lines body; ~100 tokens metadata | covers — <500 lines, <5,000 tokens | silent | silent | silent |
| Evals/behavioural testing | covers — pass rate over runs, rubric, per model | covers — trigger rate, train/validation, assertions, benchmark | silent | partially — sandbox runtime vs declared behaviour | silent |
| Security | covers — read third-party skills in full incl. URLs | silent | partially — review before install, no guarantee | covers — ten risks with mitigations | partially — skill/agent permissions |
| Hooks vs skills | covers — explicit decision rule (§7–§8) | silent | silent | partially — hooks as executable attack surface | silent |
| Cross-CLI portability | partially — core format portable, tool fields may not transfer | covers — open format; `compatibility` field | covers — 75+ agents, one source | covers — AST10 re-validate on porting | covers — reads `.claude/skills` and `.agents/skills` |

## 4. What these sources do better than skillery's text

1. **The skill/hook decision rule** (P §7–§8). Skillery has `hooks/inventory.yaml` but the method never
   says "if it must hold every time, it is a hook, not skill prose". One sentence in §2 would close it.
2. **Behavioural evaluation as a measured rate.** S and P both define a pass/trigger *rate* over
   repeated runs, with a no-skill baseline. Skillery's §3 step 5 asks for one positive and one near-miss
   probe and a "before/after" — a single-shot check. S's numbers (≈20 queries, 3 runs, 0.5 threshold,
   60/40 split) are a citable default; skillery can adopt them by reference.
3. **Concrete size budget.** S: "under 500 lines and 5,000 tokens"; P: "under about five hundred lines".
   Skillery §2.7 says "a few hundred words" and `spec/CREATING_SKILLS.md` says "~500 lines": two numbers,
   neither tied to the spec. Cite the spec's number once.
4. **Authoring craft rules** skillery lacks: references one level deep with a ToC over ~100 lines;
   say *when* to read each reference; a "Gotchas" section fed by every correction; defaults not menus;
   no time-sensitive wording; test with each model in use (P §6, §9; S best-practices).
5. **Description style** is more specific in S (imperative "Use this skill when…", intent not mechanics,
   explicit near-miss boundary). Skillery's "Use when… / Not for…" agrees but is less operational.
6. **"Start from real expertise"** (S) widens the failure-first rule: runbooks, review comments and
   fix history are valid failure sources, not only a failed prompt.
7. **Least privilege for agents** (O AST03, C permissions). Skillery agents declare `tools` and
   `disallowedTools`, but the method's dispatch contract (§4) does not require the minimum tool set.

## 5. Contradictions and tensions with skillery

1. **`boundary` and `related_skills` are not frontmatter in practice.** AGENTS.md and §9 say frontmatter
   "must declare its `boundary` and list any `related_skills`". None of the 32 `skills/*/SKILL.md` has
   either key; they live as body sections ("When not to use", "Related skills"). Good for spec
   compliance (they would fail `skills-ref validate`), but the binding and the DoD describe something
   the repository does not do. Fix the wording, not the files.
2. **`metadata.category` is compliant** (string value under `metadata`, the spec's extension point;
   28 skills). `spec/agent-skills-spec.md` describes `metadata` as "object"; the spec says string→string
   map — tighten the wording so nobody nests values.
3. **Non-spec top-level keys exist.** `argument-hint` (7 skills), `disable-model-invocation` (4),
   `version` (3), in 11 skills (`vault-*`, `cosmic-python`, `semantic-consulting-coach`,
   `executive-communication`). `skills-ref` rejects them ("Unexpected fields in frontmatter"); opencode
   ignores them; Claude uses the first two. Decide: record them as Claude-only fields in the dual-CLI
   gap list, and move `version` into `metadata.version` (or drop it — root `VERSION` is the one version).
4. **Reference vs inline.** Skillery §2.4 says reference external skills, do not copy. OWASP AST05 says
   prefer inlining *externally fetched instruction text*. They are reconcilable: declared installable
   skills pinned to a commit are dependencies (AST02/07), whereas a skill body that tells the agent to
   read a live URL is AST05. The method should say so.
5. **OWASP's "Universal Skill Format" conflicts with the agentskills spec** (top-level `version`,
   `permissions`, `signature`…). Skillery should not adopt it; AST02 itself allows provenance in
   `metadata`, which is the compliant home.
6. **Description voice.** P says third person; S says imperative ("Use this skill when…"). Skillery's
   "Use when…" matches S. Not a skillery defect, but the method should name which source it follows.

## 6. OWASP entries skillery should cite, and the operational line (DEC-5)

Cite in the method (one line each, linking the OWASP entry): **AST01, AST02, AST03, AST05, AST07**;
mention **AST10** in the dual-CLI section. AST04, AST06, AST08, AST09 are registry/runtime/enterprise
controls: cite as "further reading" only. Note that skillery already meets AST04's parser rule
(`yaml.safe_load` in `tools/repo_lint/lint.py`, `tools/bundle_gen/gen.py`) and partly AST09 for its
own catalogue (`skill-inventory.md`, `bundles.yaml`).

Minimal operational line to keep (replaces any longer security prose):

> **Third-party content.** Read every file of an external skill — SKILL.md, scripts, references, any
> URL it tells the agent to read — before declaring or vendoring it (AST01). Pin it to a commit or
> content hash, never a branch or range, and record a provenance note: source, commit, licence, date,
> reviewer (AST02, AST07). A skill body never tells the agent to fetch and follow live remote
> instructions; snapshot the text into `references/` instead (AST05). An agent gets the fewest tools
> its job needs, and a tool denial must survive rendering to every CLI or be recorded as a gap
> (AST03, AST10). Hooks and settings files are reviewed as code (AST02).

This is close to DEC-5's list (read in full, hash-pin, provenance note, least privilege); the two
additions — no live remote instructions, permissions survive porting — are the ones skillery's
dual-CLI and reference-don't-copy rules make specific to this repo.

## 7. Gaps — what could not be verified

- **Paper status.** arXiv v1, a single-author "note"; no peer review shown. Its claims are drawn from
  Anthropic docs, which it cites, so it adds synthesis, not new evidence. No empirical evaluation.
- **agentskills.io** pages not read: quickstart, using-scripts, client-implementation. The spec page
  does not itself say unknown keys are invalid; that comes from the `skills-ref` validator source.
- **Vercel** `docs/agents.md` (per-agent paths and compatibility) and the full `docs/commands.md` not
  read; skills.sh "security audits" are described but their method is not published on the pages read.
- **OWASP**: v1 is in public review; entry text may change. The README, `checklist.md`,
  `remediation-guide.md` and `platform-comparison.md` were not read. OWASP's evidence statistics
  (ClawHavoc, USENIX, Air Security) were not checked against the original reports. OWASP's Claude
  Code example uses a `skill.json` manifest that does not match the Agent Skills format — treat its
  platform-specific examples as illustrative.
- **opencode**: whether `opencode agent create` output follows any authoring guidance was not tested;
  the docs prescribe format and permissions only.
- **Skillery check** in §5 counted frontmatter keys with a column-0 scan of `skills/*/SKILL.md`; it
  did not run `skills-ref validate` itself.
