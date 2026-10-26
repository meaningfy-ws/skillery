# Seed — skillery analysis session findings (for `single-source-distribution`)

**Status:** SECONDARY input. Preserved verbatim, **never groomed, never deleted**. The shaped EPIC
(`../proposal.md`) supersedes this as the primary truth but does not replace it.

**Provenance:** Claude Cowork session with Eugeniu Costetchi, 2026-10-25, read-only analysis of
`/home/lps/work/repos/skillery` at v2.11.0 on `develop` (clean tree, HEAD d45306b), plus web research
on the Agent Skills ecosystem. Numbers below were measured on that checkout.

---

## §1. Measured duplication

- `skills/`: 208 files, 1.8 MB. `.opencode/skills/`: 208 files, 1.8 MB. `cmp` on every file:
  **208 identical, 0 differing.**
- `.opencode/` contents: `GAP.md`, `PARITY.md`, `agents/` (3 files), `bundles.json`, `skills/`.
- The opencode installer (`tools/skillery-opencode.mjs`) copies skills from `GENERATED_SKILLS_ROOT`
  (= `.opencode/skills`) into `~/.config/opencode/skills` (default) or `<cwd>/.opencode/skills`.
- Agents differ only in frontmatter. Example (`implementer`): Claude `model: sonnet`,
  `tools: [Read, Edit, Write, Glob, Grep, Bash, Skill]`; opencode `mode: subagent`,
  `model: anthropic/claude-sonnet-4-6`, `tools: {bash: true, edit: true, ...}`, plus superpowers
  skills appended to the `skills` list.

## §2. Claude packaging as observed

- `.claude-plugin/` contains only `marketplace.json`; no `plugin.json`.
- Every plugin entry: `"source": "./"`, `"strict": false`, explicit `skills: [...]` list.
- In the analysis session's own tool list, the following existed simultaneously:
  `meaningfy-core:architecture`, `vault-assistant:cosmic-python`, `meaningfy-consulting:epic-planning`,
  and the agents `code-reviewer`, `epic-planner`, `implementer` each under all five plugin
  namespaces (`meaningfy-architecture:`, `meaningfy-building:`, `meaningfy-consulting:`,
  `meaningfy-core:`, `vault-assistant:`).
- The installed copy on the analysing machine lacked `vault-setup`, `vault-tidy`, `vault-promote`,
  `vault-daily` — i.e. it was older than the repo; the duplication is therefore a property of the
  layout, not of one stale install.
- README claim being contradicted: "every skill lives in exactly one bundle (no duplication)".

## §3. opencode discovery facts (opencode docs, read 2026-10-25)

- Skills discovered from six locations, each `<name>/SKILL.md`: `.opencode/skills/`,
  `~/.config/opencode/skills/`, `.claude/skills/`, `~/.claude/skills/`, `.agents/skills/`,
  `~/.agents/skills/`. Required frontmatter: `name`, `description`; unknown fields ignored.
- Agents: `.opencode/agents/<name>.md` (project) or `~/.config/opencode/agents/` (global); nested
  files get namespaced ids; frontmatter `description`, `mode` (primary|subagent|all), `model`,
  `permissions` (ordered allow/ask/deny rules, last match wins), `steps`, `hidden`, `color`.
- Instructions: `CLAUDE.md` used only if no `AGENTS.md`; `~/.claude/CLAUDE.md` only if no global
  opencode `AGENTS.md`. Disable switches: `OPENCODE_DISABLE_CLAUDE_CODE=1`,
  `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1`, `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1`.
- opencode does **not** read `.claude/agents/` and does **not** read Claude plugins.
- `opencode agent create` generates an agent `.md` from a description (LLM-written system prompt),
  interactive or with `--description/--mode/--tools/--model`.

## §4. Ecosystem facts relevant to the design

- **Cross-agent installer:** `npx skills add <owner/repo> [--skill <name>]` installs SKILL.md folders
  into 40+ agents; universal agents (incl. opencode) share `.agents/skills/`; Claude Code uses
  `.claude/skills/`. Feature compatibility: basic skills and `allowed-tools` everywhere;
  `context: fork` and hooks Claude-only.
- **Precedent for dual publication:** Basecamp publishes the same skills as a Claude marketplace
  (`claude plugin marketplace add basecamp/claude-plugins`) and via `npx skills add basecamp/house-skills`.
- **Supply chain:** OWASP Agentic Skills Top 10 ranks malicious skills #1; "ClawHavoc" (Jan 2026)
  shipped 1,184 malicious skills across 12 publisher accounts; a USENIX Security 2026 study found
  157 malicious among 98,380 skills; three lines of markdown in a SKILL.md sufficed to exfiltrate
  SSH keys (Snyk, Feb 2026). Mitigations cited: review before install, hash-pin, least privilege,
  provenance.
- **Policy constraint noted by the human's context:** since Feb 2026 Anthropic's terms bar using a
  Claude subscription through third-party harnesses; opencode on Claude models therefore means API
  billing. Claude Code stays the primary CLI; opencode support is kept for portability and
  non-Claude models.

## §5. Spine hygiene observed (handled outside this EPIC)

- Seven open changes under `openspec/changes/` with 160 unticked tasks and 0 ticked; v2.11.0 is
  titled "ai-* lifecycle domains" and `docs/ai-sales/`, `docs/roles-and-raci.md` exist, so part of
  that work shipped without closing tasks. Decision in session: triage as a direct PR first; add a
  lint rule that blocks `archive` on a change with unticked tasks.

## §6. Human's stated intent (verbatim where recorded)

- "organise my skills and agents, locally but also as a repository in github, so that anyone using
  either claude cli or opencode can install these skills and agents"
- "can we make the whole opencode layer thinner (especially around eliminating duplicated texts)"
- "the fewer [epic changes] the better"
- Preference: keep current methods (spine, Shape Up EPICs, thin agents, dual-CLI, `make validate`);
  make the repo "more reusable and simpler easier and cleaner and more powerful".
