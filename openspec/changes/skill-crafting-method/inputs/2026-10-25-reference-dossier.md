# Reference dossier — published methods for authoring and maintaining skills and agents

**Status:** SECONDARY input and the **living research record** of this change. Entries are preserved;
verification status is updated as sources are read in full. Never groomed, never deleted.

**Provenance:** Claude Cowork session with Eugeniu Costetchi, 2026-10-25. Column *Read* says how the
source was read that day: **primary** = the author's own page/file; **summary** = a directory or
third-party paraphrase (to be verified against the source in half one).

## §1. The methods

| # | Source | What it is | What it prescribes (as read) | Silent on | Read |
|---|---|---|---|---|---|
| 1 | Anthropic — *Equipping agents for the real world with Agent Skills* (engineering blog) | Vendor design guidance | Skill = directory with SKILL.md + frontmatter `name`/`description`; progressive disclosure as *the* core principle; descriptions are the first disclosure level, loaded at startup, "give them particular care"; "start with evaluation" — run agents on representative tasks, build skills to close gaps; ask the agent to reflect when it goes off track; split SKILL.md when unwieldy; install only from trusted sources, audit scripts and network access | Collection/repo management (explicitly); agents; retirement | primary |
| 2 | Anthropic — `skill-creator` skill (installed in the human's Claude) | Authoring tool | Drafts a skill, runs evals, benchmarks versions, tunes the description for triggering | Repo governance | primary (tool present; SKILL.md not yet read in full) |
| 3 | obra/superpowers — `writing-skills` | Practitioner method | TDD for process docs: RED (watch the agent fail without the skill) → GREEN → REFACTOR; "NO SKILL WITHOUT A FAILING TEST FIRST", applies to edits too; pressure scenarios for discipline skills; rationalisation tables; description = *when to use*, not what it does, "Use when…", third person, <1024 chars; verb-first names; size targets (frequently-loaded <200 words, workflows <150, others <500); cross-reference by name not `@`; one runnable example; per-skill test→refactor→verify→commit, no batching | Bundles, dual-CLI, issue loop, agents | summary (mcpservers.org paraphrase) — **verify against the repo file** |
| 4 | Basecamp/37signals — `house-skills`: `skill-crafting`, `agents-md` | Practitioner method + a real multi-plugin repo | `skill-crafting`: "create and refine agent skills through co-development and eval loops"; `agents-md`: write/slim/audit a repo's agent-instruction file, decide "what earns always-on context and what belongs behind disclosure". Repo layout: real skills under `plugins/<plugin>/skills/`, top-level `skills/` as symlinks for a unified view; published both as Claude marketplace (`basecamp/claude-plugins`) and `npx skills add basecamp/house-skills`; MIT | Method text not visible from the listing | summary (repo README only) — **read the two SKILL.md files and their AGENTS.md** |
| 5 | *Authoring Agent Skills: A Software-Engineering [view]* (alphaXiv 2607.25032, 2026) | Paper | Single responsibility per skill; description = interface, body = implementation; few explicit dependencies; context tokens as shared budget; staged loading, references one level deep; evals first (run without the skill, turn gaps into tests, write the minimum to pass); behavioural evaluation as pass rates over runs, judged by rubric; test with every model used; avoid time-sensitive wording; legacy guidance in a marked section; **requirements that must hold every time belong in hooks, skills are advisory**; third-party skills are dependencies, read in full | Full lifecycle, repo organisation (says so) | summary (abstract page) — **read the paper** |
| 6 | agentskills.io — Agent Skills specification | Open standard | `<name>/SKILL.md`, required `name` + `description`, optional `license`, `compatibility`, `metadata`; `allowed-tools` widely supported; `context: fork` and hooks Claude-only | Everything above the file format | primary (via opencode + Vercel compatibility pages) |
| 7 | Vercel — `skills` CLI and skills.sh | Installer + directory | `npx skills add <owner/repo> [--skill x]` into 40+ agents; `.agents/skills/` for universal agents, `.claude/skills/` for Claude; `npx skills find`; TanStack Intent for package-shipped skills | Authoring method; curation (directory is open listing) | primary (vercel.com docs) |
| 8 | OWASP — Agentic Skills Top 10, AST01 Malicious Skills | Security reference | Skills run with full agent permissions; incidents: ClawHavoc 1,184 malicious skills/12 publishers (Jan 2026); 157 malicious of 98,380 (USENIX Sec 2026); 3 lines of markdown exfiltrated SSH keys (Snyk); mitigations: signing, behavioural scanning, isolation, logging, reputation, never auto-run "Prerequisites", hash-pin, least privilege, audit installed skills | Authoring | primary |
| 9 | Claude Code docs — `claude plugin eval`, `/skill-doctor`, `/agents`, subagents, agent teams | Vendor tooling | Plugin eval suites; skill health report; agent generation; team mechanics (see `agent-authoring-standard` inputs) | Method | primary |
| 10 | opencode docs — skills, agents, `opencode agent create` | Vendor tooling | Six skill discovery paths incl. `.claude/skills`; agent file format; LLM-generated agent files | Method | primary |

## §2. What skillery has that none of the above cover (candidate "own" rows)

- One owner per fact with a machine tripwire (`tests/ownership.yaml`).
- Bundles by role ("the hat you wear"), one bundle per skill/agent.
- Dual-CLI parity from one source, with gates.
- Trigger probes as repo fixtures (`tests/trigger_probes.yaml`) incl. the near-miss rule.
- Issue-driven loop with templates (Defect / Request), weekly triage, batch EPICs for small fixes.
- Retirement via spec REMOVED delta with Migration.
- A Definition of Done checklist for a skill/agent change.
- The spine (OpenSpec) as the change path for boundary moves.

## §3. What the published methods cover better than skillery's text (candidate "adopt" rows)

- Failure-first / TDD for skills, with pressure scenarios and rationalisation tables (3, 5).
- Description writing rules with size limits and anti-patterns (3, 1).
- Behavioural evaluation as pass rates, model-by-model (5, 2).
- "Must-hold-every-time → hooks, not skills" (5) — skillery's `hooks/inventory.yaml` already embodies
  this but the method text does not state the rule.
- Supply-chain security (8).
- Skill-size budgets per skill type (3).

## §4. Open questions for half one

1. Is superpowers `writing-skills` (already a declared external dependency of skillery for coding
   disciplines) acceptable as the *authoring* method too, with skillery keeping only deltas?
2. Does Basecamp's symlink layout answer `single-source-distribution` DEC-5 (Claude per-bundle roots)?
3. Which eval tool does Meaningfy standardise on for the defect pass: `skill-creator`, the superpowers
   loop, `claude plugin eval`, or a combination — and does it run on opencode?
4. Who is the second consumer of a separated method (DEC-4): the vault-assistant repo? client repos
   scaffolded by `project-setup`? another Meaningfy team?
5. Which `spec/` files survive if 3 and 5 are adopted: `CREATING_SKILLS.md` (525 lines),
   `agent-skills-spec.md`, `skill-template.md`, `skill-repo-governance.md`?

## §5. Human's framing (verbatim)

> "is there anywhere documented a similar method, to maintain a clean and clear repo? like this one?"
> "document these methods into a new epic change to be taken further research and implementation,
> maybe skillery does too much, and we shall separate how that is done"

## §6. Verification, 2026-10-26 (half one)

Every row above was re-read from its primary source; the full records are in `research/`.

| Row | Status now | Correction to the 2026-10-25 entry |
|---|---|---|
| 1 Anthropic blog | primary, full | — |
| 2 `skill-creator` | primary, full (some scripts skimmed) | the eval loop and the description optimiser run only on Claude (`claude -p`) |
| 3 superpowers `writing-skills` | primary, full (7.0.0) | description target is < 500 characters (1,024 is the frontmatter limit); "workflows < 150" means getting-started workflows < 150 words each; adds *Match the form to the failure*, no-guidance controls, tests by skill type; its bundled Anthropic guide contradicts its "when only" description rule |
| 4 Basecamp `house-skills` | primary, full (`11a3df5`) | plugins are `dev`, `ai`, `security`, `recap`; `agents-md` offers a CLAUDE.md symlink as an equal option, though the repo itself imports |
| 5 paper | primary, full | title is *…A Software-Engineering Approach* (arXiv 2607.25032v1, single author, not peer reviewed) |
| 6 agentskills.io | primary, full + `skills-ref` validator | the validator rejects unknown top-level frontmatter keys |
| 7 Vercel | primary (README, creating-skills, troubleshooting, skills.sh) | — |
| 8 OWASP | primary, all ten entries (v1.0, public review) | AST05 is now *Untrusted External Instructions* |
| 9 Claude Code docs | primary | not silent on method: baseline comparison, "move a must-hold rule into a hook", always-on cost |
| 10 opencode docs | primary | unknown frontmatter fields are ignored |

Questions in §4 are answered in `design.md` §3.
