# Creating Skills

The step-by-step authoring guide for this repository. It holds only what Meaningfy adds to the
published methods; everything else is cited. The method it serves (principles, lifecycles, the
Definition of Done) is [`docs/development/README.md`](README.md); this guide does
not restate it.

## What we adopt, and from where

| Topic | Source (follow it as written) |
|---|---|
| Writing and testing one skill: failing baseline first, then the skill, then closing loopholes | superpowers [`writing-skills`](https://github.com/obra/superpowers/tree/v7.0.0/skills/writing-skills) (7.0.0) |
| `SKILL.md` format: frontmatter fields, name rules, description and size limits, directory layout | the [Agent Skills specification](https://agentskills.io/specification) (read 2026-10-26); skillery's field notes are in [`agent-skills-spec.md`](agent-skills-spec.md). Its size limits (body under 500 lines and 5,000 tokens, references one level deep) are the outer limit; skillery's own, smaller budget is [the lean standard](#the-lean-standard) |
| Body craft: progressive disclosure, gotchas, when to load each reference, defaults rather than menus | agentskills.io [best practices](https://agentskills.io/skill-creation/best-practices) |
| Writing the description | agentskills.io [*Optimizing descriptions*](https://agentskills.io/skill-creation/optimizing-descriptions) |
| Measuring behaviour (trigger and output evals) | agentskills.io [*Evaluating skills*](https://agentskills.io/skill-creation/evaluating-skills), run with `skill-creator` |

Where a Meaningfy rule below differs from a source, the Meaningfy rule wins in this repository.

## Before you write

1. **Pick the change path**, EPIC or direct PR, by the rule in
   [§3 of the method](README.md#3-lifecycle--skills).
2. **Decide it is a skill**, not an agent, doc or binding, and that nothing in the catalogue or among
   the declared external skills already owns the job: check
   [`skill-repo-governance.md`](governance.md),
   [`docs/skill-inventory.md`](../skill-inventory.md) and
   [`tests/ownership.yaml`](../../tests/ownership.yaml).
3. **Record the failure case**: the prompt, what came out, what should have. It goes in the EPIC's
   `inputs/` or the PR and becomes the acceptance test.
4. **Editing an existing skill? Name its posture first** (R, C or P) and follow the rule for it in
   [§3 of the method](README.md#3-lifecycle--skills).

## Write it

Start from the template:

```bash
mkdir -p skills/my-new-skill
cp docs/development/skill-template.md skills/my-new-skill/SKILL.md
```

Skills are flat: one directory per skill directly under `skills/`. Bundles group them, not folders.

### Frontmatter

The fields and their limits are the specification's. On top of it:

- Frontmatter is strict YAML. Quote a `description` that contains `: `
  (`description: "Use for: x"`).
- Declare the six facets under `metadata` (see *Facets and requirements* below). Every `metadata`
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

### The lean standard

A skill holds the minimum necessary: what is Meaningfy's own and what a capable model would not do
unprompted. General knowledge comes from a named dependency, a fact another skill owns is cited.
This section is the single statement of a skill's shape; the method and the template link here.

#### Tiers and budget

| Tier | Files | Read | Limit |
|---|---|---|---|
| Body | `SKILL.md` below the frontmatter | whenever the skill fires | target 6 KB (advisory note) |
| Reference | every file under `references/`, any kind, at any depth | when a pointer says so | body plus references at most 24 KB (failing) |
| Material | `assets/`, `templates/`, `scripts/`, any other folder | never as instructions | none |

A KB is 1,024 bytes: the budget is 24,576 bytes, the body target 6,144. The frontmatter is not
counted. Less is the default. `make validate` fails a skill over budget (`prose_budget`).

[`skill-budget.yaml`](../../skill-budget.yaml), at the root, lists two kinds of entry:

- `pending`: a skill that existed when this standard came in and waits for its lean rewrite, with
  the checks it is exempt from (`budget`, `pointers`). Every skill was rewritten by EPIC
  `lean-skills` (2026-11-16) and the key is gone; a new or changed skill is never listed: it meets
  the standard on arrival.
- `over_budget`: a skill over 24 KB for a reason recorded after its assessment. Exempt from the
  budget only.

The list cannot rot: `prose_budget` fails an entry for a skill that no longer needs it, a name that
is not a skill, and a malformed file. Moving prose into material to pass the budget gains nothing;
review and the assessment record catch it.

#### The shape of a body

In this order; sections 3 to 5 are left out when empty:

1. `# Title`, then one or two sentences: the bias or mistake this skill corrects.
2. `## Quick Start`: one real worked example (input → output). An activity skill puts its
   `## Workflow` next.
3. `## Rules`: the decision rules. Where they have typical failures, a **Common mistakes** table:
   Mistake | Why it fails | Do instead.
4. `## Triggers`: rules of the form "when X appears, do Y".
5. `## Before you hand over`: the final checklist, as a **Quick diagnostic** table: Question | If
   not | Action.
6. `## Boundary & Related Skills`: what the skill owns, what it does not (and who does), related
   skills by name. The validator checks this heading.

Name reference files for the question they answer (`clarity-gate-checklist.md`, not `notes.md`).
No "Overview" that repeats the description, no history, no TODOs (those are issues).

#### Sorting the content

When a skill is assessed, every passage goes to one class. Doubt goes to **keep**.

| Class | Test | Goes to |
|---|---|---|
| keep | Meaningfy's own (a house rule, a convention, a rule from a review or the owner, a rule a check enforces) and non-obvious | stays, in the body or a reference |
| dependency | general knowledge a registered dependency states | cut; name the dependency once |
| owner | a fact another skill owns | cut; cite the owner skill |
| example | example code copied from another project | cut; a `docs/` page links the source; a short form stays only for a convention a model cannot guess |
| material | really a template or a script | moved to `assets/` or `scripts/` |
| drop | generic knowledge a model already has; a "why it works" that restates the rule; repetition | cut |

The record of one skill's sorting is an `assessment-<skill>.md` in the `evidence/` folder of the
change that rewrites it (every skill's first record is in
`openspec/changes/archive/2026-11-16-lean-skills/evidence/`):
sizes before and after, one row per passage (passage, class, where it went), and the verdict of a
second reader who did not make the cuts.

#### The five practices

1. **Pointers say when and what.** Every mention of a file in the skill's own `references/` is one
   sentence at the point of need: "Read `<file>` when `<situation>`: it adds `<what>`." Accepted
   variants: Read or Open; when, if, before, after, while, once, whenever, until or unless; it
   adds, gives or holds. No heading closes the body with a list of references ("References", "See
   also", "Resources", "Further reading", "Supporting materials"). Checked by `reference_pointers`.
2. **Two table forms.** Common mistakes for rules, Quick diagnostic for the final checklist.
3. **Content filters.** Non-obvious points only; no "why it works" that restates the rule; nothing
   the model already does. They are the test for keep.
4. **Shared rules once.** A rule several workflows of one skill use is stated once in that skill
   and cited; a rule several skills use lives in one skill.
5. **A fallback for a named external dependency.** One sentence: "If `<dependency>` is not
   installed, offer `<install command>`; if the person declines, say that you work without it and
   what is lost." The install command is the one `dependencies.yaml` records for the running CLI.

Pointers, good and bad:

```markdown
- Read `references/alerting.md` when writing or reviewing an alert
  rule: it adds the severity table and the routing per channel.        <- passes
- Read `references/alerting.md` when needed.                           <- fails: no "it adds"
- `references/patterns.md`: conflict, dead rule, minimal fix           <- fails
| Open day | `references/run-types.md` |                               <- fails: a cell needs the sentence too
```

The check sees that both halves are there, not that they are good: "when needed" says nothing, and
review rejects it. A path into another skill's `references/` and fenced code are not pointers.

### Both CLIs

The catalogue ships to Claude Code and opencode from one source. Keep the body CLI-agnostic: no
`/opsx:`-style command forms and no `.claude/` paths, unless the case is on the recorded allow-list.
The rules and their gates are in
[`AGENTS.md` → Dual-CLI authoring rules](../../AGENTS.md#dual-cli-authoring-rules).

### Activity skills

There is one Skill type, in two kinds. A skill that ships a workflow file in `assets/workflows/` is
an **activity skill**: it owns a kind of work with phases a person walks through, such as
`meaningfy-release` (branch, bump, validate, merge, publish, back-merge). Any other skill is a
**know-how skill**: it holds a craft that several activities use. `bdd-gherkin` is a know-how
skill: it has no `assets/workflows/`, and its craft, writing scenarios, is used inside epic shaping
and epic delivery, which are the activities.

Give a skill a workflow when its job has phases that a person walks through in order, each phase
with something to check (a file written, a command run), and the same phases come back each time.
A craft used inside other people's phases stays know-how. One activity skill hosts one workflow;
which agent leads it is set in [`agent-template.md` § *Workers*](agent-template.md#workers).

Adding a workflow takes three edits:

1. The file `skills/<skill>/assets/workflows/<name>.workflow.json`, with `"owner": "<skill>"`
   (schema in [`mods.md`](mods.md#workflow-files)). Each phase states its `criteria`, how it
   succeeds and how it fails; `make validate` requires them in a default file.
2. Its file name in TC-16's list of default files in
   [`mods/navigator/lib/workflow.test.ts`](../../mods/navigator/lib/workflow.test.ts).
3. A row in the table of [`workflows.md` § *Workflow files*](workflows.md#workflow-files), naming
   its lead.

Then `make bundles` copies it into navigator's data, and `make mods` and `make validate` check it.

### Scripts, assets and third-party content

Keep scripts small, deterministic and with their dependencies stated. Content taken from outside
Meaningfy is declared as a dependency and linked, not copied; a vendored skill carries a provenance
note and an entry in [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md)
([principle 4 of the method](README.md#2-principles)). A skill under another licence carries its
own `LICENSE.txt`.

## Prove it

How much testing a change needs is set by the proportionate test rule in
[§2 of the method](README.md#2-principles): a behavioural baseline run for a new
skill, a boundary move or a discipline rule; probes only for wording, links and descriptions. For the
baseline and the evals, follow `writing-skills` and *Evaluating skills*.

Every description change ships with two probes in
[`tests/trigger_probes.yaml`](../../tests/trigger_probes.yaml): one that should fire the skill, and one
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

1. Add the skill to exactly one bundle in [`bundles.yaml`](../../bundles.yaml), the one bundle
   definition. Bundles follow roles (`meaningfy-core` plus one per role); use the bundle whose role
   the skill serves rather than adding a bundle. Then run `make bundles`, which renders
   `.claude-plugin/marketplace.json`, `bundles/` and `tools/opencode-catalogue.json`. Never edit
   those by hand.
2. Run `make skill-inventory` to regenerate the catalogue map
   [`docs/skill-inventory.md`](../skill-inventory.md). Run it again after any rename,
   re-bundle, description or facet change.
3. Add the skill to its bundle's cell in the README's **What's inside** table and update the skill
   count above it.
4. Run `make validate` until it is green.

Every later edit to a skill — content or membership — needs `make bundles`, whose copies you commit.

An agent is registered the same way, in its bundle's `agents` list; how to write one is in
[`agent-template.md`](agent-template.md).

## Facets and requirements

- **Facets.** Every skill and agent declares one value for each facet of
  [`facets.yaml`](../../facets.yaml) (`purpose`, `area`, `subject`, `posture`, `stage`, `maturity`)
  under `metadata`. A value that is not in the file is a one-line PR to `facets.yaml` first.
- **Requirements.** A skill named on another skill's `**Delegates:**` line in a different bundle
  needs that bundle in the delegating bundle's `requires:` list in `bundles.yaml`.
  `meaningfy-core` requires nothing, and cycles are not allowed. When a hand-off would break that,
  name the skill on the Related line instead.
- **Where docs go.** A new documentation file needs a row in the register,
  [§8 of the development method](README.md#8-where-things-live).

## Document and ship

- If the skill is a new entry point, add a README "I want to…" row.
- Write the CHANGELOG line for the person who installs it: what they can now do, what they must do
  (reinstall, rename), what went away and what replaces it.
- Commit with a conventional commit and open a PR into `develop`
  ([`meaningfy-git-workflow`](../../skills/meaningfy-git-workflow)). Versions change only through the
  release flow ([`meaningfy-release`](../../skills/meaningfy-release)).

## Retiring a skill

Retirement is an EPIC. Remove the skill from `bundles.yaml`, run `make bundles` and
`make skill-inventory`, and name its replacement in the CHANGELOG line.

## When you are done

The checklist is the [Definition of Done](README.md#9-definition-of-done). This
guide carries none of its own.
