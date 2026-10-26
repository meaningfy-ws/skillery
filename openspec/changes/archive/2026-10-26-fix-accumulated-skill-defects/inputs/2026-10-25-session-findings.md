# Seed — defects and smells observed in session (for `fix-accumulated-skill-defects`)

**Status:** SECONDARY input. Preserved verbatim, **never groomed, never deleted**. These are
*observations from a read-only pass*, not a verified defect list; the human's own notes are primary.

**Provenance:** Claude Cowork session with Eugeniu Costetchi, 2026-10-25; repo at v2.11.0.

## §1. Observed in skills / specs

- `spec/CREATING_SKILLS.md`, `spec/skill-template.md`, `spec/agent-skills-spec.md` and
  `CONTRIBUTING.md` overlap in what they say about authoring a skill (merge is handled by
  `single-source-distribution`; any *contradiction* between them is a defect for this EPIC).
- `agents/code-reviewer.md` carries a review-dispatch protocol in prose ("exactly one lens per run";
  five-lens fan-out) that the `meaningfy-code-review` skill describes as its "Dispatch contract" —
  confirm the two say the same thing (agent-side shape is `agent-authoring-standard`'s concern).
- `AGENTS.md` dates from 2026-07-26 and does not mention the `ai-*` domain docs, the vault bundle, or
  `docs/roles-and-raci.md`; the GitNexus block (≈40% of the file) imposes MUST rules written for code
  repos (impact analysis before editing any symbol) on a mostly-markdown repo and is duplicated in
  `CLAUDE.md`. (Binding fix is in `single-source-distribution`; listed so it is not re-reported.)
- README "Uninstall & conflicts" still describes migrating from the previous bundle cut.

## §2. Not skill defects — owned elsewhere (do not re-report)

- Five-fold plugin duplication on install; agents loaded under every plugin namespace → 
  `single-source-distribution`.
- Installed copy on the analysing machine older than the repo (missing four vault skills) → user
  reinstall; same EPIC's migration note.
- Seven open changes with 0/160 tasks ticked → triage PR + archive lint rule.

## §3. Tools available for the fix pass

- `tests/trigger_probes.yaml` (existing trigger probes), `tests/ownership.yaml`.
- `skill-creator` (Anthropic): drafts skills, runs evals, benchmarks versions, tunes descriptions.
- Claude Code: `claude plugin eval`, `/skill-doctor`.

## External notes from Meaningfy vault

there are a buch of skill defects registered in /home/lps/Insync/eugen@meaningfy.ws/Google Drive - Shared drives/Admin space/obsidian/eugen/vault/00 Inbox/proposed

not all the files are really skills improvements and bug reports, so a thorough analisys is a must
