# skill-crafting-method Specification

## Purpose
What skillery's skill-development method owns and what it adopts by reference from the published
methods: proportionate tests, the description rule, hooks for must-hold rules, third-party content,
on-demand evals, and why the method stays inside skillery for now.
## Requirements
### Requirement: The method states what it owns and what it adopts by reference

`docs/development/README.md` SHALL keep as its own text only what no published method covers: the
three readers, the principles of ownership and installability, the change path, the posture rule,
the agent lifecycle, the issue loop, and the Definition of Done. For writing and testing a single
skill, it SHALL cite the adopted methods instead of restating them: superpowers `writing-skills`,
the agentskills.io specification and its guides, the Claude Code skill and eval docs, and OWASP
Agentic Skills Top 10. Each adopted method SHALL be declared as a dependency in
`docs/environment/setup.md` with the version or date it was read.

#### Scenario: An adopted rule is cited, not restated

- **WHEN** the method needs the size budget for a `SKILL.md` body
- **THEN** it cites the agentskills.io specification and states no number of its own

#### Scenario: An adopted method is declared

- **WHEN** a reader looks up `skill-creator` in `docs/environment/setup.md`
- **THEN** its source and the date or version it was read are listed

### Requirement: Behavioural tests are proportionate to the change

A new skill, a boundary move or a change to a discipline rule SHALL be proven by a behavioural
baseline: the same scenarios run without the skill (or with the previous version) and with it,
repeated, as `writing-skills` and agentskills.io describe. A wording, link or description change
SHALL be proven by trigger probes (one positive, one near-miss) without a baseline run.

#### Scenario: A description is reworded

- **WHEN** a pull request only rewords a skill's description
- **THEN** it ships with a positive and a near-miss probe and needs no baseline run

#### Scenario: A new skill is proposed

- **WHEN** a pull request adds a new skill
- **THEN** it records a baseline run without the skill and a run with it on the same scenarios

### Requirement: Descriptions say what the skill does and when to use it

A skill description SHALL state what the skill does and when to use it, in the imperative form the
agentskills.io guide recommends, in at most 1,024 characters, with an advisory target of 600
characters. A `Not for…` clause SHALL appear only where a near-miss probe needs it.

#### Scenario: A description summarises only the workflow

- **WHEN** a description lists the skill's steps but not when to use it
- **THEN** review asks for the when-to-use sentence before merge

### Requirement: Rules that must hold every time are hooks

The method SHALL state that a rule which must hold every time belongs in a hook, declared in
`hooks.yaml` and rendered per CLI, not in skill prose and not in skill frontmatter.

#### Scenario: A skill rule keeps being skipped

- **WHEN** an agent repeatedly skips a rule that must never be skipped
- **THEN** the fix is a hook intent in `hooks.yaml`, not stronger wording in the skill

### Requirement: Third-party content is read, pinned and recorded

Every file of an external skill, and every URL it tells the agent to read, SHALL be read before the
skill is declared or vendored. It SHALL be pinned to a commit or content hash, and a provenance note
(source, commit, licence, date, reviewer) SHALL be recorded. A skill body SHALL NOT tell the agent to
fetch and follow live remote instructions. An agent SHALL get the fewest tools its job needs, and a
tool denial SHALL survive rendering to every CLI or be recorded as a gap. The method SHALL cite OWASP
AST01, AST02, AST03, AST05, AST07 and AST10 for these rules.

#### Scenario: A skill tells the agent to read a live URL

- **WHEN** a skill body instructs the agent to fetch a remote page and follow it
- **THEN** review asks for a snapshot in `references/` instead

### Requirement: Behavioural evals run on demand

Skill evals SHALL use `skill-creator` on Claude Code, as shipped, with the agentskills.io trigger
method as the default numbers. The repository SHALL provide a GitHub Actions workflow that runs
`claude plugin eval` for one bundle, started by hand only, with a cost ceiling, a pinned model and no
publication of the report. It SHALL NOT run on push, pull request or release. The absence of an
opencode eval runner SHALL be stated in the method as a gap.

#### Scenario: Someone wants evidence for a bundle

- **WHEN** a maintainer starts the eval workflow for `meaningfy-consulting` with a cost ceiling of 5 USD
- **THEN** the suite under `tests/evals/meaningfy-consulting/` runs, stops before exceeding the ceiling, and
  its results are uploaded as an artefact

#### Scenario: A pull request is opened

- **WHEN** a pull request is opened or updated
- **THEN** the eval workflow does not run

### Requirement: The method stays in skillery until an outside consumer appears

The owned method SHALL stay as documentation inside skillery until a team or repository outside
skillery asks to run a catalogue the Meaningfy way. Meanwhile the validator SHALL name its method
checks as a set distinct from its catalogue checks, and the method checks SHALL run against any
repository root that has a `skills/` directory, so a later separation needs no rewrite.

#### Scenario: The method checks run on a minimal tree

- **WHEN** the method checks run on a root containing only `skills/foo/SKILL.md` with a
  `## Boundary & Related Skills` section
- **THEN** they report no error; the catalogue checks are not part of that run

