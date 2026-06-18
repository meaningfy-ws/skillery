# Documentation Standard (Engineering Standard)

Governs where documentation lives and which format it uses. Applies to this repository
(**agent-skills / skillery**) and all projected Meaningfy repositories.

Decision reference: **DEC-3** (split-by-churn).

---

## The Rule: Split by Churn

Documentation lives in one of two homes, chosen by how fast it changes.

| Home | Format | What belongs here |
|------|--------|-------------------|
| `.claude/` and repo root | **Markdown** | HIGH-CHURN, agent-loop artifacts: EPICs, PLANs, runbooks, memory indexes, agentic instructions, READMEs, working state |
| `docs/` (Antora / AsciiDoc) | **AsciiDoc** | DURABLE published canon: architecture decisions (ADRs), requirements specifications, user-facing documentation, cross-referenced reference material |

## Choosing Heuristic

Ask two questions:

1. **Rate of change** — does this content change every sprint (or faster), or does it
   stabilise once written?
2. **Audience** — is this consumed primarily by the agent loop / developers in the
   working tree, or by readers of the published doc site?

| Rate of change | Audience | Home |
|---------------|----------|------|
| High — sprint-level or faster | Agent loop / working-tree developers | Markdown in `.claude/` or repo root |
| Low — stabilises after authoring | Published doc site readers | AsciiDoc in `docs/` |

When in doubt, prefer Markdown until the content stabilises, then promote it to AsciiDoc.

## Rationale

- **Markdown** has minimal syntax overhead, is diff-friendly, and is natively understood
  by agents and GitHub rendering. It matches the cadence of iterative, agentic work.
- **AsciiDoc / Antora** provides cross-referencing, versioning, include directives, and
  a publishable site — the right investment for content that must remain accurate over
  time and be navigable by external readers.

Mixing the two in a single artefact adds friction; the split keeps each format in its
natural habitat.

## Related Standards

- `docs/engineering-standards/project-structure.md` — canonical repo layout, including
  where `docs/` sits relative to root modules.
- `docs/engineering-standards/git-and-collaboration.md` — branching and commit conventions
  that interact with doc promotion workflows.
