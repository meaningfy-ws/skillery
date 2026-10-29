## ADDED Requirements

### Requirement: PROJECT-tier steps each name their owning skills
Every PROJECT-tier step in `docs/practice/ai-coding/build-lifecycle.md` (Requirements & UC, ADLC, MDLC-lite, project/repo setup) SHALL cite its owning skill(s) by name and path; the doc SHALL NOT restate those skills' rules.

#### Scenario: ADLC step names its owner
- **WHEN** a reader reads the PROJECT-tier ADLC step
- **THEN** the step names `architecture` as its single owning skill (ADRs, C4, UC White/Blue) and
  does not restate `architecture`'s internal rules

#### Scenario: MDLC-lite step names its owners
- **WHEN** a reader reads the PROJECT-tier MDLC-lite step
- **THEN** the step names `conceptual-modelling` and `linkml-engineering` as owners, cross-checked by
  `modelling-conventions`, and names MDLC-standalone as a one-line known gap with no owning skill

### Requirement: EPIC-tier steps each name exactly one owner
Every EPIC-tier step (shape the EPIC, derive the PLAN, clarity-gate the PLAN, BDD, TDD, review, archive) SHALL cite exactly one owning skill per step.

#### Scenario: Clarity-gate step names its owner
- **WHEN** a reader reads the "clarity-gate the PLAN" EPIC-tier step
- **THEN** the step names `clarity-gate` as the sole owner of the ≥9/10 scoring gate

### Requirement: Requirements & UC is documented as one capability at two depths, not a pipeline stage
The doc SHALL present Requirements & UC elicitation as a single capability invoked at two depths
(deep — White + Blue, feeding ADLC; shallow — White only, feeding the Proof of Value) rather than as a
sequential pipeline stage, and SHALL cite the shallow invocation to
`skills/semantic-consulting-coach/references/engagement-lifecycle.md` rather than restate its
commercial framing.

#### Scenario: Deep invocation is documented in this doc
- **WHEN** a reader looks for the deep Requirements & UC invocation
- **THEN** the doc describes White + Blue use-case elicitation feeding ADLC, owned by `architecture`

#### Scenario: Shallow invocation is a citation, not a restatement
- **WHEN** a reader looks for the shallow (White-only) invocation
- **THEN** the doc points to `engagement-lifecycle.md` for the commercial framing and does not
  restate Discovery & Onboarding packaging content

### Requirement: The doc states its governance model in one named, up-front principle
`docs/practice/ai-coding/build-lifecycle.md` SHALL open with a single named principle — "Light steering, heavy
agents, cheap verification" — stating that agents execute and verify while humans steer and decide,
and that every gate offers a low-effort artifact-based check. The principle SHALL cite `guardrails`
and `stream-coding` and SHALL NOT expand into a per-step column, maturity model, or approval workflow.

#### Scenario: Governance principle appears once, up front
- **WHEN** a reader opens `build-lifecycle.md`
- **THEN** the "Light steering, heavy agents, cheap verification" principle appears as one paragraph
  before the tier narrative, citing `guardrails` and `stream-coding`, and no per-step governance
  column or approval matrix appears anywhere else in the doc

### Requirement: The diagram and responsibility table reflect the current artifact vocabulary and agents
The Mermaid lifecycle diagram and the developer-vs-agent responsibility table SHALL represent EPIC as
`proposal.md`, PLAN as `design.md` + `tasks.md`, and the build-loop agents as the thin wrappers
`epic-planner`, `implementer`, `code-reviewer`. Neither artifact SHALL reference a single-file
`EPIC.md`, a retired agent (`gherkin-writer`, `documenter`), `.claude/memory/epics/`, or
`MEMORY.md`-as-truth.

#### Scenario: Diagram uses current artifact vocabulary
- **WHEN** a reader inspects the lifecycle diagram
- **THEN** its EPIC node is labelled `proposal.md` and its PLAN node is labelled `design.md` +
  `tasks.md`, with no node referencing a single-file `EPIC.md`

#### Scenario: Responsibility table names no retired agent
- **WHEN** a reader inspects the responsibility table
- **THEN** no agent other than `epic-planner`, `implementer`, and `code-reviewer` is named, and
  neither `gherkin-writer` nor `documenter` appears

### Requirement: One build-plane lifecycle doc in docs/practice/ai-coding/
`docs/practice/ai-coding/` SHALL contain exactly one build-plane lifecycle narrative doc
(`build-lifecycle.md`), and no file under `docs/practice/ai-coding/` SHALL reference a retired agent
(`gherkin-writer`, `documenter`) or a single-file `EPIC.md` model.

#### Scenario: v1 files are absent
- **WHEN** the repository is inspected
- **THEN** `docs/practice/ai-coding/` holds no `ai-coding-methodology.md`, `ai-coding-runbook.md`,
  `ai-coding-setup-guide.md` or `two-tier-methodology.md`

#### Scenario: No live doc names a retired agent
- **WHEN** `repo_lint`'s `orphan_agent_references` check runs against `docs/practice/ai-coding/`
- **THEN** it reports zero references to `gherkin-writer` or `documenter` in that directory
