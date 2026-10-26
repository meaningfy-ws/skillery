# Skill-Repo Governance (Portable Meta-Method)

How to organise **any** Meaningfy prompt/skill/agent repository as a governed catalog. This is
the reusable method behind this repository — apply it when reorganising other repos.

## The four artifact types

Every artifact is exactly one of these, and that decides its home:

| Type | Audience | Loaded | Home | Rule |
|------|----------|--------|------|------|
| **Skill** | Agents | On demand | `skills/` | Reusable knowledge; single source of *authority* per fact |
| **Agent** | Harness | Isolated context | `agents/` | Thin wrapper — see [`agent-template.md`](agent-template.md) |
| **Doc** | Humans | Never auto-loaded | `docs/` | Written for people; narrates & points, never restates skill rules |
| **Binding** | Harness (every session) | Always | `prompts/` + root `AGENTS.md`, `CLAUDE.md` | Mandates & routes to skills; never carries the standard |

Authoring governance (`spec/`, incl. `spec/skill-template.md`) and distribution
(`bundles.yaml`, rendered to `.claude-plugin/`, `bundles/` and
`tools/opencode-catalogue.json`) sit alongside as supporting infrastructure. The durable
spec **spine** (`spine/` + `openspec/`) is projected into project repos by the
`project-setup` skill.

## Placement rules

1. **Knowledge → a skill.** If two skills could own a fact, the more specific one owns it; the
   other points by name. External skills (superpowers, stream-coding, …) are **referenced, not
   vendored**; an adopted copy carries a provenance note and a review, as set out in
   [principle 4 of the development method](../docs/development-method.md#2-principles).
2. **An agent carries no knowledge.** Keep an agent only when it is a named worker others dispatch,
   needs a declared runtime type, or needs a model pin or a tool denial that must hold on both CLIs
   (skill-level `model`, `allowed-tools`, `context: fork` are Claude-only; a tool restriction holds on
   both CLIs only as a denial, `disallowedTools`). Refusals a tool
   restriction can enforce are enforced, not written — see
   [`agent-template.md`](agent-template.md#deterministic-before-prose).
3. **A doc narrates and points.** Single source of *authority* + marked derivations (e.g. a human
   "coding prompt" document whose operational twin is a skill — say which is operational).
4. **A binding routes and mandates.** It is thin and always-on; it never restates the standard.

## Agents

The agent authoring standard is [`agent-template.md`](agent-template.md), checked by
`agent_conformance` in `tools/repo_lint`.

## Validation as guardrail

A repo this method produces validates itself (see `tools/repo_lint`). The checks are the
`ALL_CHECKS` list in `tools/repo_lint/lint.py`: among them `bundles.yaml`↔dirs consistency,
strict-YAML frontmatter with `name`==dir, declared facets, no broken navigational links, skill
size, rendered bundle files in sync with `bundles.yaml` (`bundle_gates`), agents conforming to
[`agent-template.md`](agent-template.md) (`agent_conformance`) and a complete documentation
register (`doc_register_complete`). Run it in CI. The validator is the reusable guardrail — adopt it alongside this spec.

## Beyond verification

`make validate` is **verification** (built right). For a prompt corpus, add **validation** (right
thing built): a trigger-precision probe set (do skills fire when intended, without colliding with
external neighbours?) and an end-to-end bootstrap walk on a scratch repo. Prefer **noun/artifact-
anchored** skill descriptions for any skill that sits near an external one, to keep triggers crisp.

## Known limits

- The validator cannot detect drift in **external** skills (renamed/removed upstream) — keep a
  documented mandatory-dependency list and check it on adoption.
- Semantic de-duplication is assisted-manual (a candidate report + a single-authority sign-off
  matrix), not fully automated.
