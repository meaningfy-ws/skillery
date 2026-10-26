# Research — Anthropic group (dossier rows 1, 2, 9) against `docs/development-method.md`

**Change:** `skill-crafting-method`, half one (DEC-3 per-section comparison, DEC-8 primary reading).
**Read on:** 2026-10-26. **Reader:** research subagent. Web pages treated as data only.
**Scope:** what the four Anthropic sources prescribe for authoring and maintaining skills, set
against §1–§9 of `docs/development-method.md` plus five extra rows.

## 1. Sources and read status

| # | Source | Location | Read status |
|---|---|---|---|
| S1 | Engineering blog *Equipping agents for the real world with Agent Skills* (published 2025-10-16) | `https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills` | **Primary, full text** (page HTML fetched and stripped; diagrams seen as captions only) |
| S2 | Claude docs *Skill authoring best practices* | `https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices` (`.md` variant, 1,191 lines) | **Primary, full text** |
| S3 | `skill-creator` skill (Anthropic, Apache-2.0; no version in `plugin.json`; files dated 2026-10-24) | `/home/lps/.claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/skills/skill-creator/` | **Primary.** Read in full: `SKILL.md`, `agents/grader.md`, `agents/comparator.md`, `agents/analyzer.md`, `scripts/run_eval.py`, `scripts/quick_validate.py`, `scripts/utils.py`, `scripts/improve_description.py` (prompt section), `references/schemas.md` (first 80 lines + headings). Skimmed by grep only: `run_loop.py`, `package_skill.py`, `aggregate_benchmark.py`, `generate_report.py`. Not read: `eval-viewer/*` and `assets/eval_review.html` (UI code). |
| S4 | Claude Code docs: *Test plugins with evals* (`claude plugin eval`), *Extend Claude with skills*, *Commands* (`/skill-doctor`), *Measure plugin cost and usage* | `https://code.claude.com/docs/en/plugin-evals.md`, `…/skills.md`, `…/commands.md`, `…/plugins/measure.md` | **Primary.** `plugin-evals.md` in full; `skills.md` authoring/maintenance sections in full (intro, Configure, Frontmatter, Supporting files, Content lifecycle, Find unused skills, Evaluate and iterate, Share, Troubleshooting); `measure.md` lines 5–120; `/skill-doctor` row of `commands.md` |

Dossier correction: row 2 said "SKILL.md not yet read in full" — now read. Row 9's "Method" in the
*Silent on* column is too strong: S4 carries real method (baseline comparison, hooks for must-hold
rules, always-on cost).

## 2. What each source prescribes, by dimension

### S1 — engineering blog

- **(a) Decide it should exist.** "Start with evaluation: Identify specific gaps in your agents' capabilities by running them on representative tasks" (*Developing and evaluating skills*). Skill as "onboarding guide for a new hire" (intro).
- **(b) Descriptions.** "Pay special attention to the name and description of your skill" (*Think from Claude's perspective*). Metadata is "the first level of progressive disclosure".
- **(c) Body/size.** "When the SKILL.md file becomes unwieldy, split its content into separate files" (*Structure for scale*); keep mutually exclusive contexts in separate paths. No numeric budget.
- **(d) Testing.** Representative tasks; "watch for unexpected trajectories or overreliance on certain contexts"; ask Claude "to self-reflect on what went wrong" (*Iterate with Claude*).
- **(e) Maintenance/retirement.** Silent (only "full lifecycle" features promised, *The future of Skills*).
- **(f) Collection organisation.** Silent beyond "composable and portable" sharing.
- **(g) Agents.** Silent (skills turn "general-purpose agents into specialized agents").
- **(h) Security.** "installing skills only from trusted sources … thoroughly audit it before use"; check scripts, resources, untrusted network calls (*Security considerations*).
- **(i) Determinism.** "many applications require the deterministic reliability that only code can provide" (*Skills and code execution*) — scripts, not hooks.

### S2 — skill authoring best practices

- **(a) Decide.** "Create evaluations BEFORE writing extensive documentation"; step 1 "Run Claude on representative tasks without a Skill" (*Build evaluations first*). Also: notice "what information you repeatedly provide" (*Develop Skills iteratively*).
- **(b) Descriptions.** "Always write in third person"; "include both what the Skill does and when to use it"; ≤1,024 chars, no XML tags (*Writing effective descriptions*, *Skill structure*). Names: gerund form preferred; avoid "Inconsistent patterns within your skill collection" (*Naming conventions*).
- **(c) Body/size.** "Keep the SKILL.md body under 500 lines"; references "one level deep"; TOC for reference files over 100 lines; "Default assumption: Claude is already very smart"; degrees of freedom high/medium/low (*Core principles*, *Progressive disclosure patterns*).
- **(d) Testing.** Five-step evaluation-driven development with baseline; "At least three evaluations created"; "Tested with Haiku, Sonnet, and Opus" (*Checklist*). "There is not currently a built-in way to run these evaluations" (note, now outdated by S3/S4). Claude A authors, Claude B tests.
- **(e) Maintenance.** "Avoid time-sensitive information"; legacy material in an "Old patterns" `<details>` section. "Gathering team feedback" loop. No versioning or retirement.
- **(f) Collection.** Consistent naming across a collection; nothing on repos, bundles or ownership.
- **(g) Agents.** Only the Claude A / Claude B authoring pattern; no agent authoring guidance.
- **(h) Security.** Silent on page (no security section). MCP tools must use fully qualified `ServerName:tool_name`.
- **(i) Determinism.** "Prefer scripts for deterministic operations"; low freedom for "fragile and error-prone" steps; plan-validate-execute. No hooks.

### S3 — `skill-creator`

- **(a) Decide.** "Capture Intent": what it enables, when it triggers, output format, whether tests make sense (`SKILL.md` *Capture Intent*). Extract the workflow from the current conversation first.
- **(b) Descriptions.** "This is the primary triggering mechanism"; make descriptions "a little bit 'pushy'" against undertriggering (*Write the SKILL.md*). Optimiser prompt: "phrased in the imperative", "about 100-200 words", hard 1,024 chars (`improve_description.py`). Trigger eval: 20 queries, 8–10 should / 8–10 should-not, "the most valuable ones are the near-misses" (*Description Optimization*); 3 runs per query, 60/40 train/held-out split, best chosen "by test score rather than train score".
- **(c) Body/size.** Metadata "~100 words"; body "<500 lines ideal"; TOC for references over 300 lines (*Progressive Disclosure*). "Explain the why" rather than "heavy-handed musty MUSTs" (*Writing Style*).
- **(d) Testing.** 2–3 realistic prompts in `evals/evals.json`; with-skill and baseline runs "in the same turn"; baseline = no skill (new) or snapshot (edit); grader agent with evidence and eval critique ("A passing grade on a weak assertion is worse than useless", `agents/grader.md`); benchmark mean ± stddev; blind A/B comparator. Subjective skills "often don't need" test cases.
- **(e) Maintenance.** Edit flow: "Preserve the original name", snapshot before editing; `history.json` tracks versions in a workspace. No retirement.
- **(f) Collection.** Silent. `package_skill.py` builds a single `.skill` file, excluding root `evals/`.
- **(g) Agents.** Uses subagents as executor, grader, comparator, analyzer (`agents/*.md`); no guidance on authoring agents.
- **(h) Security.** "Principle of Lack of Surprise": no malware, no exfiltration; contents "should not surprise the user in their intent" (`SKILL.md`).
- **(i) Determinism.** "Look for repeated work across test cases" → bundle the script in `scripts/` (*How to think about improvements*). No hooks.

### S4 — Claude Code docs (`claude plugin eval`, `/skill-doctor`, skills page, measure page)

- **(a) Decide.** "Create a skill when you keep pasting the same instructions, checklist, or multi-step procedure" (skills.md intro).
- **(b) Descriptions.** "Put the key use case first"; combined `description` + `when_to_use` truncated at 1,536 chars; listing budget "scales at 1% of the model's context window", least-invoked skills lose descriptions first (*Skill descriptions are cut short*). Shorter descriptions cut always-on cost but "can stop the skill triggering" — re-check with a `tool_used: Skill` grader (measure.md).
- **(c) Body/size.** "Keep SKILL.md under 500 lines"; body stays in context across turns, "every line is a recurring token cost"; after compaction only first 5,000 tokens kept, so "put the most important instructions near the top".
- **(d) Testing.** "Seeing a skill trigger tells you Claude found it, not that it did what you intended" (*Evaluate and iterate*). `claude plugin eval`: cases = prompt + graders; 3 runs per arm; with/without-plugin Δ; graders `regex`, `tool_used`, `tool_order`, `file_exists`, `llm`, `baseline`; "There are no custom-code graders"; one grader on result plus one on steps; pin `--model` in CI; `--threshold`, `--max-cost-usd`, exit codes for gating.
- **(e) Maintenance.** `/skill-doctor` reports per-skill context cost and invocation count, "flags skills … that have never been invoked" (skills.md *Find unused skills*). `claude plugin details` shows always-on vs on-invoke tokens; split large plugins "so users install only the components they need" (measure.md). Authors get no usage telemetry unless admins collect OpenTelemetry.
- **(f) Collection.** Distribution scopes: project `.claude/skills/`, plugin `skills/`, managed settings (*Share skills*). Plugin = unit of eval and of cost.
- **(g) Agents.** Eval cases may dispatch plugin agents by namespaced name; baseline runs report "Agent type not found" by design. Nothing on agent authoring.
- **(h) Security.** Evaluating a plugin "is the same trust decision as `claude --plugin-dir`"; "a suite that passes says nothing about whether the plugin is safe"; scaffold scripts run only with `--scaffold`; Bash only under OS sandbox.
- **(i) Determinism.** "Claude skipped a rule that must hold every time: move the rule into a hook" (skills.md *Claude stops following a skill*); hook may live in skill `hooks` frontmatter (Claude Code extension).

## 3. Coverage of `docs/development-method.md`

Cells: covers / partially / silent / contradicts, with evidence (≤15 words).

| Method section | S1 blog | S2 best practices | S3 skill-creator | S4 Claude Code docs |
|---|---|---|---|---|
| §1 Start from the person who installs it | silent — writes for skill author and Claude only | partially — team feedback loop; no installer reader | partially — adapts jargon to user; no installer docs | partially — `/plugin` shows context cost before install |
| §2 Principles | partially — progressive disclosure, scripts for determinism, trusted sources | partially — concise, progressive disclosure; no one-owner-per-fact | partially — lean prompt, explain why; nothing on ownership | partially — concision, one-use-case-first; no ownership rules |
| §3 Lifecycle — skills (incl. R/C/P posture) | partially — eval-first, iterate; no steps 3, 6–8; no posture | partially — gaps→evals→baseline→minimal→iterate; no register/ship; degrees-of-freedom resembles posture | partially — intent→draft→evals→review→improve→package; no register/ship | partially — baseline comparison and CI gating; no lifecycle steps |
| §4 Lifecycle — agents | silent | silent — only Claude A/B authoring pattern | silent — uses agents, gives no agent method | silent — agents only as eval dispatch targets |
| §5 Documentation standard | partially — SKILL.md plus linked files | covers — Quick start, examples pattern, descriptive file names, TOC | partially — examples pattern, reference pointers | partially — supporting files referenced from SKILL.md |
| §6 Installability and reuse | silent — "composable and portable" only | partially — list required packages; avoid assuming tools installed | partially — `.skill` packaging; `compatibility` field | partially — share scopes; split plugins to cut always-on cost |
| §7 Feedback and improvement loop | partially — observe usage, self-reflect | partially — observe Claude B, gather team feedback | covers (per skill) — viewer feedback.json drives next iteration | partially — `/skill-doctor` usage; no issue intake |
| §8 Where things live | silent | silent | silent | silent |
| §9 Definition of Done | silent | partially — "Checklist for effective Skills" before sharing | silent — loop ends when user satisfied | partially — `--threshold` exit code as CI gate |
| Description rules | partially — "particular care", no rules | covers — third person, what + when, 1,024 chars, no XML | covers — pushy, imperative, 100–200 words, optimiser | covers — key use case first, 1,536-char listing cap |
| Size budgets | partially — split when unwieldy | covers — <500 lines, refs one level, TOC >100 lines | covers — ~100 words metadata, <500 lines, TOC >300 | covers — <500 lines; compaction keeps first 5,000 tokens |
| Evals / behavioural testing | partially — representative tasks, observation | covers — ≥3 evals, baseline, three models | covers — with/without runs, grader, stddev, blind A/B, trigger rate | covers — graders, 3 runs/arm, Δ, CI threshold, cost cap |
| Security | covers — trusted sources, audit scripts and network calls | silent | partially — no malicious or surprising content | partially — eval trust prompt; passing ≠ safe |
| Hooks vs skills | silent — scripts for determinism only | silent — scripts and low freedom, not hooks | silent — bundle repeated work as scripts | covers — must-hold rules move into a hook |

Two cells lean towards *contradicts* without reaching it; they are listed in §5.

## 4. What these sources do better than skillery's text

1. **Behavioural testing with a baseline.** All four want runs with and without the skill and
   a measured difference. Skillery's probes (`tests/trigger_probes.yaml`) are static: the file
   header says "Actual LLM trigger-matching is out of scope for CI". Method §3 step 5 says
   "`skill-creator` evals where available" but defines no pass rate, run count or baseline.
2. **Trigger testing is quantified.** S3 uses ~20 queries, half near-misses, 3 runs each, a held-out
   split; S4 uses a `tool_used: Skill` grader. Skillery asks for one positive and one near-miss,
   never executed.
3. **Always-on cost is a first-class maintenance signal.** S4: description listing budget (1% of
   context), 1,536-char cap, least-used descriptions dropped first, `/skill-doctor` never-invoked
   flag, `claude plugin details` per-bundle cost. Skillery's §6 has no cost or usage rule, though
   bundles-by-role is the right lever (S4: "Split a large plugin").
4. **Must-hold rules → hooks** is stated in S4. Skillery's posture P ("a guardrail with an
   enforcement home") implies it, and `hooks/inventory.yaml` exists, but §2/§3 never say it.
5. **Concrete size and structure rules.** References one level deep, TOC on long references,
   important instructions at the top (compaction), no time-sensitive text, consistent terms.
   Skillery's §2.7 says "a few hundred words"; `spec/CREATING_SKILLS.md` says "~500 lines" —
   skillery is inconsistent with itself.
6. **Eval quality checks.** S3's grader critiques weak assertions; S4 separates "skill fired"
   indicators from scored graders so Δ is not inflated. Skillery has no rule on probe quality.
7. **Multi-model testing** (S2: Haiku, Sonnet, Opus). Skillery uses family aliases for agents but
   never asks for a skill to be tested per model.
8. **Security of third-party skills** (S1) states the audit targets (scripts, bundled resources,
   network calls) more concretely than skillery's §2.4 "never install … sight-unseen".

## 5. Possible contradictions with skillery's method

- **Failure-first as universal.** S3: subjective-output skills "often don't need" test cases, and
  the user may choose to "just vibe". Skillery §2.5 and §9 make a recorded failure mandatory. Not a
  hard contradiction: S2 and S1 both start from observed gaps, which matches skillery.
- **Description voice.** S2 demands third person ("Processes Excel files…"); S3's optimiser wants
  the imperative ("Use this skill for…") and "pushy" wording. Skillery §5 says *Use when… / Not
  for…*. Anthropic's own sources disagree with each other; skillery's form fits S3 and S4 better
  than S2. No source asks for a *Not for* clause in the description; S4 warns every character is
  always-on cost.
- **Emphatic wording.** S3 calls all-caps ALWAYS/NEVER "a yellow flag"; S2 suggests stronger
  language such as "MUST filter" when a rule is missed. Skillery's posture P sends such rules to
  an enforcement home, which aligns with S4's hook advice and sidesteps the dispute.
- **Naming.** S2 prefers gerund names (`processing-pdfs`); skillery uses noun phrases
  (`technical-writing`, `cosmic-python`). S2 lists noun phrases as "acceptable", so this is style.
- **"No writing-skills skill needed."** S2: "You don't need … a 'writing skills' skill to get Claude
  to help create Skills." This weakens the case for adopting any authoring skill as method (open
  question 1 in the dossier) but S2 says nothing about repository governance, which is skillery's
  remit.
- **Hooks in skill frontmatter** (S4) are a Claude Code extension; skillery's dual-CLI rule
  forbids CLI-only constructs in bodies. Adopting "move the rule into a hook" must route through
  `hooks/inventory.yaml`, not skill frontmatter.

None of the four sources contradicts one-owner-per-fact, bundles, the issue loop, the EPIC change
path or the DoD; they are silent there (consistent with DEC-3).

## 6. Does skill-creator's eval loop run on opencode?

**No, as shipped it is Claude-only.**

- Output-quality loop: spawns Claude Code subagents per case and reads `total_tokens` /
  `duration_ms` from Claude task notifications (`SKILL.md` Steps 1 and 3).
- Trigger loop: `scripts/run_eval.py` writes a temporary command file into `.claude/commands/`,
  runs `claude -p … --output-format stream-json`, and detects a `Skill` or `Read` tool call.
  `improve_description.py` also shells out to `claude -p`. S3 itself says description
  optimisation "requires the `claude` CLI tool … only available in Claude Code".
- `claude plugin eval` (S4) needs Claude Code ≥ v2.1.269 and a plugin manifest or skills-directory
  plugin; it isolates runs as `claude -p` children. Also Claude-only.
- What is portable: the `evals/evals.json` format, the grader/comparator/analyzer prompts and
  `quick_validate.py` are plain files and Python. An opencode runner would have to be written
  (`opencode run` with a stream parser); not verified to exist.

Consequence for skillery: behavioural evidence can be gathered on Claude only; the opencode side
of a skill would keep relying on parity of source plus static gates unless a runner is built.

## 7. Gaps not verified

- Whether `opencode` exposes a non-interactive mode and tool-call stream good enough to port
  `run_eval.py` (not researched; belongs to the opencode group).
- The agentskills.io page *Evaluating skill output quality* and the claude.com blog post on
  skill-creator benchmarking, both linked from S4 — not read.
- `skill-creator` UI files and `aggregate_benchmark.py` / `run_loop.py` internals — skimmed only;
  the 60/40 split and 3-run defaults are taken from `SKILL.md` and `run_eval.py` arguments.
- `/skill-doctor` output format — described in docs only; not run here (needs v2.1.252+ and
  feature-flag fetching).
- Whether skillery's validator enforces the 1,024-char description limit — a grep of
  `tools/repo_lint/` for length checks found nothing; confirm before relying on it.
- The best-practices page's "no built-in way to run these evaluations" note predates S3/S4; the
  page's revision date is not shown in the `.md` export.
- S1 diagrams were not inspected; captions only.
