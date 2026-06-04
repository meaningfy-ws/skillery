# Skill-Repo Governance (Portable Meta-Method)

How to organise **any** Meaningfy prompt/skill/agent repository as a governed catalog. This is
the reusable method behind this repository — apply it when reorganising other repos.

## The four artifact types

Every artifact is exactly one of these, and that decides its home:

| Type | Audience | Loaded | Home | Rule |
|------|----------|--------|------|------|
| **Skill** | Agents | On demand | `skills/` | Reusable knowledge; single source of *authority* per fact |
| **Agent** | Harness | Isolated context | `agents/` | Thin wrapper: role + model + tools + `skills:` + glue; **no knowledge** |
| **Doc** | Humans | Never auto-loaded | `docs/` | Human canon; narrates & points, never restates skill rules |
| **Binding** | Harness (every session) | Always | `prompts/` | Mandates & routes to skills; never carries the standard |

Authoring governance (`spec/`, `template/`) and distribution (`.claude-plugin/`, `scripts/`)
sit alongside as supporting infrastructure.

## Placement rules

1. **Knowledge → a skill.** If two skills could own a fact, the more specific one owns it; the
   other points by name. External skills (superpowers, stream-coding, …) are **referenced, not
   vendored**.
2. **An agent carries no knowledge.** Keep an agent only when it provides a capability a skill
   cannot — model pinning, read-only tools, isolation. Otherwise drop it; the skill suffices.
3. **A doc narrates and points.** Single source of *authority* + marked derivations (e.g. a human
   "coding prompt" canon whose operational twin is a skill — say which is operational).
4. **A binding routes and mandates.** It is thin and always-on; it never restates the standard.

## Validation as guardrail

A repo this method produces validates itself (see `tools/repo_lint`): marketplace↔dirs
consistency, frontmatter present + `name`==dir, bundle composition, no broken navigational
links, skill length, no orphan references to dropped artifacts, README inventory, template
mirroring. Run it in CI. The validator is the reusable guardrail — adopt it alongside this spec.

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
