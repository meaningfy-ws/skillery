# Creating Skills

The step-by-step authoring guide for this repository. It holds only what Meaningfy adds to the
published methods; everything else is cited. The method it serves (principles, lifecycles, the
Definition of Done) is [`docs/development-method.md`](../docs/development-method.md); this guide does
not restate it.

## What we adopt, and from where

| Topic | Source (follow it as written) |
|---|---|
| Writing and testing one skill: failing baseline first, then the skill, then closing loopholes | superpowers [`writing-skills`](https://github.com/obra/superpowers/tree/v7.0.0/skills/writing-skills) (7.0.0) |
| `SKILL.md` format: frontmatter fields, name rules, description and size limits, directory layout | the [Agent Skills specification](https://agentskills.io/specification) (read 2026-10-26); skillery's field notes are in [`agent-skills-spec.md`](agent-skills-spec.md) |
| Body craft: progressive disclosure, gotchas, when to load each reference, defaults rather than menus | agentskills.io [best practices](https://agentskills.io/skill-creation/best-practices) |
| Writing the description | agentskills.io [*Optimizing descriptions*](https://agentskills.io/skill-creation/optimizing-descriptions) |
| Measuring behaviour (trigger and output evals) | agentskills.io [*Evaluating skills*](https://agentskills.io/skill-creation/evaluating-skills), run with `skill-creator` |

Where a Meaningfy rule below differs from a source, the Meaningfy rule wins in this repository.

## Before you write

1. **Pick the change path.** A new skill, a rename, a boundary move or a retirement is an EPIC in
   `openspec/changes/`. A wording, link, probe or description tweak that moves no boundary is a
   direct PR. When unsure, EPIC.
2. **Decide it is a skill**, not an agent, doc or binding, and that nothing in the catalogue or among
   the declared external skills already owns the job: check
   [`skill-repo-governance.md`](skill-repo-governance.md),
   [`docs/skill-inventory.md`](../docs/skill-inventory.md) and
   [`tests/ownership.yaml`](../tests/ownership.yaml).
3. **Record the failure case**: the prompt, what came out, what should have. It goes in the EPIC's
   `inputs/` or the PR and becomes the acceptance test.
4. **Editing an existing skill? Name its posture first** (R, C or P) and follow the rule for it in
   [§3 of the method](../docs/development-method.md#3-lifecycle--skills).

## Write it

Start from the template:

```bash
mkdir -p skills/my-new-skill
cp spec/skill-template.md skills/my-new-skill/SKILL.md
```

Skills are flat: one directory per skill directly under `skills/`. Bundles group them, not folders.

### Frontmatter

The fields and their limits are the specification's. On top of it:

- Frontmatter is strict YAML. Quote a `description` that contains `: `
  (`description: "Use for: x"`).
- Set `metadata.category`, and a `PURPOSE_OF` entry at registration (below). Every `metadata`
  value is a string.
- No top-level `version`; use `metadata.version` if you need one.
- Claude-only keys are allowed only from the recorded list (see
  [`agent-skills-spec.md`](agent-skills-spec.md)).

### Description

Follow *Optimizing descriptions*: say what the skill does and when to use it, in the imperative
("Use this skill when …; it …"), and list the phrases that should fire it. Meaningfy delta:

- add a `Not for …` clause only when a near-miss probe needs it to separate the skill from a
  neighbour;
- the validator fails a description over the specification's limit and reports long ones as an
  advisory note; aim well under the limit.

### Body

Size and disclosure follow the specification and the best-practices page. Meaningfy delta, required
in every skill:

- **Quick Start** with one real worked example (input → output), the shortest path to a result.
- **`## Boundary & Related Skills`** as a body section: what the skill owns, what it does not own
  (and who does), and related skills cited by name, never restated. The validator checks the
  heading.
- Files in `references/` named for the question they answer (`clarity-gate-checklist.md`, not
  `REFERENCE.md` or `notes.md`), linked from `SKILL.md` where they are needed.
- No "Overview" that repeats the description, no history, no TODOs (those are issues).
- One owner per fact: if another skill owns a rule, name that skill; do not copy the rule.

### Both CLIs

The catalogue ships to Claude Code and opencode from one source. Keep the body CLI-agnostic: no
`/opsx:`-style command forms and no `.claude/` paths, unless the case is on the recorded allow-list.
The rules and their gates are in
[`AGENTS.md` → Dual-CLI authoring rules](../AGENTS.md#dual-cli-authoring-rules).

### Scripts, assets and third-party content

Keep scripts small, deterministic and with their dependencies stated. Content taken from outside
Meaningfy is declared as a dependency and linked, not copied; a vendored skill carries a provenance
note and an entry in [`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md)
([`skill-repo-governance.md`](skill-repo-governance.md)). A skill under another licence carries its
own `LICENSE.txt`.

## Prove it

How much testing a change needs is set by the proportionate test rule in
[§2 of the method](../docs/development-method.md#2-principles): a behavioural baseline run for a new
skill, a boundary move or a discipline rule; probes only for wording, links and descriptions. For the
baseline and the evals, follow `writing-skills` and *Evaluating skills*.

Every description change ships with two probes in
[`tests/trigger_probes.yaml`](../tests/trigger_probes.yaml): one that should fire the skill, and one
near miss that should fire its closest neighbour instead:

```yaml
  - probe: "this explainer reads flat, add a controlling metaphor and a concrete example"
    expect: explanatory-writing
  - probe: "explain how the bundle generator works, for the repo docs"
    expect: technical-writing
    near_miss_of: explanatory-writing   # the skill that must not fire
```

Put the before/after on the failure case in the PR.

## Register it

1. Add the skill to exactly one bundle in [`bundles.yaml`](../bundles.yaml), the one bundle
   definition. Bundles follow roles (`meaningfy-core` plus one per role); use the bundle whose role
   the skill serves rather than adding a bundle. Then run `make bundles`, which renders
   `.claude-plugin/marketplace.json`, `bundles/` and `tools/opencode-catalogue.json`. Never edit
   those by hand.
2. Add a `PURPOSE_OF` entry in [`tools/skill_inventory.py`](../tools/skill_inventory.py) and run
   `make skill-inventory` to regenerate [`docs/skill-inventory.md`](../docs/skill-inventory.md). Run
   it again after any rename, re-bundle, re-description or re-categorisation.
3. Add the skill to its bundle's cell in the README's **What's inside** table and update the skill
   count above it.
4. Run `make validate` until it is green.

A later edit to a skill's content needs no regeneration; a membership change does.

An agent is registered the same way, in its bundle's `agents` list; how to write one is in
[`agent-template.md`](agent-template.md).

## Document and ship

- If the skill is a new entry point, add a README "I want to…" row.
- Write the CHANGELOG line for the person who installs it: what they can now do, what they must do
  (reinstall, rename), what went away and what replaces it.
- Commit with a conventional commit and open a PR into `develop`
  ([`meaningfy-git-workflow`](../skills/meaningfy-git-workflow)). Versions change only through the
  release flow ([`meaningfy-release`](../skills/meaningfy-release)).

## Retiring a skill

Retirement is an EPIC. Remove the skill from `bundles.yaml`, run `make bundles` and
`make skill-inventory`, and name its replacement in the CHANGELOG line.

## When you are done

The checklist is the [Definition of Done](../docs/development-method.md#9-definition-of-done). This
guide carries none of its own.
