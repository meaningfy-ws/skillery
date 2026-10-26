# catalogue-governance Specification

## Purpose

Govern how the catalogue is organised: skills grouped into role bundles, plus one workflow bundle,
with single ownership, a
flat skill layout, and external method skills (superpowers) landing in the spine rather than a
parallel spec tree. The durable rules the validator and contributors hold the catalogue to.
## Requirements
### Requirement: Skills are organised into role bundles with single ownership

The catalogue SHALL group skills and agents into **bundles** declared in `bundles.yaml`: the role
bundles (today `meaningfy-core`, `meaningfy-consulting`, `meaningfy-architecture`,
`meaningfy-building`) and the workflow bundle (`vault-assistant`), which only people who keep a
personal vault install. Every skill SHALL belong to **exactly one** bundle and every agent SHALL
belong to **exactly one** bundle. The disk layout SHALL be flat (`skills/<skill>/`,
`agents/<agent>.md`); bundle grouping lives only in `bundles.yaml`, and the set of valid bundle
names is whatever `bundles.yaml` declares — the validator SHALL NOT pin a second list of names.

#### Scenario: A skill registered in two bundles is rejected

- **WHEN** the validator runs over `bundles.yaml`
- **THEN** any skill listed under more than one bundle is reported as a placement error

#### Scenario: An agent outside exactly one bundle is rejected

- **WHEN** the validator runs over `bundles.yaml` and `agents/`
- **THEN** an agent listed in no bundle, in two bundles, or listed without an `agents/<agent>.md` file is reported as a placement error

#### Scenario: A flat skill directory is discovered

- **WHEN** the validator enumerates `skills/`
- **THEN** each `skills/<skill>/SKILL.md` is discovered and keyed by its directory name

#### Scenario: A new bundle needs no validator change

- **WHEN** a change adds a bundle entry (e.g. `meaningfy-devops`) to `bundles.yaml`
- **THEN** the validator accepts the bundle name and checks its skills and agents like any other bundle's, with no edit to validator code

### Requirement: External method skills land in the spine

External method skills (`superpowers` brainstorming / writing-plans / executing-plans) SHALL NOT
create a parallel spec/plan tree. In a spine-wired repo their artifacts SHALL land in
`openspec/changes/<id>/`: a brainstorming design feeds the EPIC (`proposal.md`), `writing-plans` is
superseded by the PLAN (`design.md` + `tasks.md`), and execution is tracked via `/opsx:apply`.

#### Scenario: A brainstorming design is shaped as the EPIC

- **WHEN** a contributor uses `superpowers:brainstorming` in a spine repo
- **THEN** the resulting design is authored as the change's `proposal.md`, not as a separate
  `docs/superpowers/specs/` file

### Requirement: The repo work loop and the done-checklist are normative
The root `AGENTS.md` SHALL mandate the repo work loop — the change path (EPIC under `openspec/changes/` for a new, renamed, re-bounded or retired skill or agent; a direct PR from a feature branch for a change that moves no boundary), the branch flow (feature branch off `develop`, PR into `develop`), and the Definition of Done — and SHALL route to their substance rather than restate it. The Definition of Done SHALL exist as exactly one checklist, in `docs/development/README.md` §9; `CONTRIBUTING.md` SHALL link to it and SHALL NOT carry a second checklist.

#### Scenario: One checklist
- **WHEN** a contributor looks for what "done" means for a skill or agent change
- **THEN** `AGENTS.md` and `CONTRIBUTING.md` both route to `docs/development/README.md` §9, and no other file carries a done or submission checklist for changes to this repository's skills and agents (`docs/practice/ai-coding/` defines the product-project Definition of Done and is out of scope)

#### Scenario: The checklist matches the tooling
- **WHEN** the Definition of Done names a command
- **THEN** that command is a `make` target that exists, and no step names `make generate-opencode`

### Requirement: External skills are referenced, vendored only with provenance
External skills SHALL be declared as dependencies and linked, not copied into `skills/`; this rule SHALL be stated in `docs/development/governance.md` and checked by the Definition of Done. A skill adopted into `skills/` from an external source SHALL carry a provenance note (source, commit, licence, date) and SHALL be reviewed in full before any upstream change is pulled.

#### Scenario: A vendored skill carries provenance
- **WHEN** a reviewer finds a skill under `skills/` whose content originates outside Meaningfy
- **THEN** it carries a provenance note naming source, commit, licence and date, or the review rejects it

### Requirement: Agents conform to the agent authoring standard
Every `agents/<name>.md` SHALL conform to the agent standard in `docs/development/agent-template.md` — its closed
frontmatter contract (including a declared `type` of `delegated`, `lead` or `scheduled`), its body cap,
its `## Dispatch contract` section with the labels **Input**, **Output**, **Side effects** and
**Refuses**, and CLI-agnostic body text — and the validator SHALL reject any agent that does not. The
bundle that lists an agent (per "Skills are organised into role bundles with single ownership") SHALL
also list the agent's primary skill, the first non-namespaced, non-external entry of its `skills:`
list. Each agent SHALL have `tests/features/agents/<name>.feature` containing a Scenario Outline with
Examples and a Background that names every entry of the agent's `skills:` list.

#### Scenario: An agent without a declared type is rejected
- **WHEN** the validator reads an agent whose frontmatter has no `type` field
- **THEN** it reports `missing required frontmatter field 'type'` for that agent

#### Scenario: A bundle field in agent frontmatter is rejected
- **WHEN** an agent's frontmatter carries `bundle: meaningfy-building`
- **THEN** the validator reports that `bundle` is not in the agent contract

#### Scenario: An unknown type or a pinned model name is rejected
- **WHEN** an agent declares `type: worker` or `model: claude-opus-4-8`
- **THEN** the validator reports the type as not a known agent type, or the model as not a family alias

#### Scenario: A description that does not say when to use the agent is rejected
- **WHEN** an agent's description lacks "Use when" or contains an `<example>` block
- **THEN** the validator reports the description defect for that agent

#### Scenario: A lead or scheduled agent that invites delegation is rejected
- **WHEN** an agent of type `lead` or `scheduled` has a description without "Not for delegation"
- **THEN** the validator reports the missing phrase for that agent

#### Scenario: A body over the cap is rejected
- **WHEN** an agent body is one line longer than the validator's agent body cap
- **THEN** the validator reports the body as over the cap, and a body exactly at the cap passes

#### Scenario: A missing dispatch-contract part is rejected
- **WHEN** an agent has no `## Dispatch contract` section, or the section lacks `**Refuses:**`
- **THEN** the validator names the missing section or label

#### Scenario: A CLI-specific path in an agent body is rejected
- **WHEN** an agent body contains `.claude/memory/`
- **THEN** the validator reports the CLI-specific reference for that agent

#### Scenario: An agent in a bundle without its primary skill is rejected
- **WHEN** `code-reviewer` (primary skill `meaningfy-code-review`) is listed in a bundle that does not
  list `meaningfy-code-review`
- **THEN** the validator reports the bundle and the primary skill it lacks

#### Scenario: An agent without its Gherkin scenarios is rejected
- **WHEN** an agent has no feature file, or its feature file has no Scenario Outline with Examples, or
  its Background omits one of the agent's skills
- **THEN** the validator names the agent and the missing element

#### Scenario: The catalogue's own agents conform
- **WHEN** the validator runs over the repository
- **THEN** `code-reviewer`, `epic-planner` and `implementer` produce no agent-standard errors

### Requirement: Colliding triggers are proven by near-miss probes

For every pair of skills whose triggers are known to collide, `tests/trigger_probes.yaml` SHALL hold a
near-miss probe: a phrase that sounds like one skill, whose `expect` names the skill that should fire,
and whose `near_miss_of` names the skill that should not. Every `near_miss_of` SHALL name a real skill.

#### Scenario: A near-miss probe names its neighbour

- **WHEN** the probe "explain how the bundle generator works" is read
- **THEN** it expects `technical-writing` and names `explanatory-writing` in `near_miss_of`

### Requirement: A skill fix names its posture

The development method SHALL require that a change to a skill names the skill's posture before the
edit: R (reusable core: no domain content enters `SKILL.md`), C (core with profiles: a fix adds a
switch or a profile, never a silent default) or P (precise house standard: a fix adds a guardrail with
an enforcement home). The posture SHALL be recorded on every skill and agent as `metadata.posture`
(`reusable`, `profiled` or `precise`), so a contributor reads it instead of deciding it again.

#### Scenario: A reusable skill receives a domain fact

- **WHEN** a fix to an R skill would add a fact about one client domain to its `SKILL.md`
- **THEN** the fact goes in a reference file or a profile instead

#### Scenario: A contributor fixes a skill

- **WHEN** a contributor prepares a fix to `executive-communication`
- **THEN** its frontmatter states `posture: profiled`, so the fix adds a switch or a profile and no
  silent default

### Requirement: Repo documentation states each fact once

Repo documentation outside `skills/` SHALL state each fact in one place and link to it elsewhere.
A documentation edit SHALL NOT increase the total length of the documents it touches unless it adds a
fact that had no home.

#### Scenario: A fact restated in two documents

- **WHEN** the same setup step is written out in two documents
- **THEN** one keeps it and the other links to it

### Requirement: Skill frontmatter follows the Agent Skills specification

Every `skills/<name>/SKILL.md` frontmatter SHALL use only the top-level keys of the agentskills.io
specification (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`) or a
key on the recorded Claude-only list (`argument-hint`, `disable-model-invocation`), and every
`metadata` value SHALL be a string. A description longer than 1,024 characters SHALL fail
validation. Descriptions longer than 600 characters and `SKILL.md` bodies over 500 lines or about
5,000 tokens SHALL be reported as advisory notes.

#### Scenario: A skill declares a version at the top level

- **WHEN** a skill's frontmatter has `version: 1.2.0` as a top-level key
- **THEN** validation fails and names the key, and `metadata.version` is accepted instead

#### Scenario: A description is too long

- **WHEN** a skill description has 1,025 characters
- **THEN** validation fails for that skill

#### Scenario: A long body is reported

- **WHEN** a `SKILL.md` body has 520 lines
- **THEN** validation passes and the advisory notes list the skill

### Requirement: Authoring guidance has one home

Step-by-step authoring guidance for this repository SHALL live in `docs/development/creating-skills.md` as
Meaningfy deltas plus citations of the adopted methods. `CONTRIBUTING.md` SHALL be a short entry page
that links to that guide and to the Definition of Done. `docs/development/agent-skills-spec.md` SHALL cite the
agentskills.io specification and carry only skillery's field notes.

#### Scenario: A contributor opens CONTRIBUTING.md

- **WHEN** a contributor reads `CONTRIBUTING.md`
- **THEN** it links to `docs/development/creating-skills.md` and to `docs/development/README.md` §9, and holds no
  authoring steps of its own

#### Scenario: Boundary and related skills are described correctly

- **WHEN** `AGENTS.md` or the Definition of Done describes a skill's boundary and related skills
- **THEN** it names the body section `## Boundary & Related Skills`, not frontmatter keys

### Requirement: Bundles declare the bundles they require

A bundle in `bundles.yaml` SHALL list, under `requires:`, every other bundle that one of its skills
depends on; `meaningfy-core` is implicit and SHALL NOT be listed. `meaningfy-core` SHALL require no
bundle, and the requirement graph SHALL be acyclic. Every "depends on" edge between skills (a skill
named on another skill's `**Delegates:**` line) that crosses bundles SHALL point into `meaningfy-core`
or into a required bundle. A hand-off that would break one of these rules SHALL be reworded as
"related" or the skill moved; a requirement SHALL NOT be added to hide a cycle.

#### Scenario: An undeclared cross-bundle dependency

- **WHEN** a skill in `meaningfy-consulting` names a `meaningfy-building` skill on its `**Delegates:**`
  line and `meaningfy-consulting` does not require `meaningfy-building`
- **THEN** validation fails, naming the edge and the missing requirement

#### Scenario: A cycle between bundles

- **WHEN** `meaningfy-building` requires `meaningfy-architecture` and `meaningfy-architecture`
  requires `meaningfy-building`
- **THEN** validation fails and names the cycle

#### Scenario: Core depends outward

- **WHEN** a `meaningfy-core` skill names a skill of another bundle on its `**Delegates:**` line
- **THEN** validation fails, because `meaningfy-core` requires nothing

