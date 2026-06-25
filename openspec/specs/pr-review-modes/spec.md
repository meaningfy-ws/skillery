# pr-review-modes Specification

## Purpose

Define the two modes of a Meaningfy PR review (standalone vs interactive), where each runs, how
interactive mode is entered, and the fit-and-refactoring investigation that both modes perform. The
review remains read-only; refactoring output is recommendations only.

## Requirements

### Requirement: The review skill defines two modes with distinct homes

`meaningfy-code-review` SHALL define exactly two review modes — **standalone** and **interactive** —
and SHALL state where each runs: standalone is performed by the `code-reviewer` agent (a read-only
subagent that runs to completion), and interactive is performed in the **main thread** where a
back-and-forth with the developer is possible. The skill SHALL NOT require the `code-reviewer`
subagent to hold a conversation (DEC-1).

#### Scenario: Standalone is the default

- **WHEN** a review is requested and the developer has not started discussing the PR code
- **THEN** the standalone mode runs to completion via the `code-reviewer` agent and returns prioritised findings without dialogue

#### Scenario: Interactive runs in the main thread

- **WHEN** the developer starts discussing the PR code or the returned findings
- **THEN** the review continues in interactive mode in the main thread, not inside the `code-reviewer` subagent

### Requirement: The review analysis always runs in isolated subagents

The standalone review analysis SHALL always be triggered as subagent execution(s), isolated from the
implementation/main context. The review MUST NOT be run inline in the implementation context. Only
aggregation of returned findings and the interactive discussion of them occur in the main thread
(DEC-8).

#### Scenario: Review is requested

- **WHEN** a standalone review is triggered
- **THEN** the analysis runs in one or more subagents, never inline in the implementation context

#### Scenario: Findings return to the main thread

- **WHEN** the subagent passes complete
- **THEN** their findings are aggregated and surfaced in the main thread, where interactive discussion may continue

### Requirement: The analysis is decomposed into a fixed set of lenses, one per subagent run

`meaningfy-code-review` SHALL define a fixed set of **five lenses** — **L1 Security & safety**,
**L2 Spec correctness & tests**, **L3 Architecture conformance**, **L4 Principles & clean code**,
**L5 Fit, elegance & refactoring** — and SHALL execute **each lens as its own subagent run**. Each
lens SHALL bundle its aspects and anchor them to existing `cosmic-python` catalogue ids; the skill
SHALL NOT mint new catalogue entries for the lenses (DEC-6, DEC-7).

#### Scenario: A full standalone review

- **WHEN** a full standalone review runs
- **THEN** each of the five lenses is executed as a separate subagent pass and their findings are merged into one prioritised report

#### Scenario: A single-lens review

- **WHEN** the reviewer is asked to apply one specific lens (e.g. L1 Security)
- **THEN** exactly that lens runs as a subagent and reports only its lens's findings

#### Scenario: Spec-correctness lens checks requirements, not the plan

- **WHEN** the L2 lens evaluates correctness
- **THEN** it checks conformance to the EPIC's requirements/specs and their acceptance criteria, not the implementation plan

### Requirement: Interactive mode is a thinking-partner protocol

In interactive mode `meaningfy-code-review` SHALL act as a thinking partner: explaining findings,
weighing trade-offs against the cited principles, and co-designing fixes with the developer. It SHALL
remain read-only — it MUST NOT modify code — and SHALL leave application of accepted changes to the
`implementer` (DEC-2, DEC-3).

#### Scenario: Developer engages with a finding

- **WHEN** the developer questions or pushes back on a finding in interactive mode
- **THEN** the review responds with reasoned, principle-cited discussion and proposes options, without editing any file

#### Scenario: A fix is agreed in interactive mode

- **WHEN** the developer and the review agree on a fix
- **THEN** the review records the recommendation and defers the edit to the `implementer`, making no change itself

### Requirement: Both modes perform a fit-and-refactoring investigation

Both modes SHALL assess whether the change fits the existing code and honours the architecture and
named principles (`cosmic-python` layering, SOLID, KISS/DRY — cited by id, not restated), and SHALL
propose how the new code and the existing code it touches could be refactored toward a more elegant,
crisp, effective solution. The investigation SHALL produce **recommendations only** and SHALL NOT
edit code (DEC-3, DEC-4).

#### Scenario: New code that fits poorly

- **WHEN** the new code is a near-duplicate of a sibling or breaks a layer boundary
- **THEN** the review reports the misfit citing the relevant catalogue id and recommends a concrete refactor toward a better fit

#### Scenario: Touched existing code can be improved

- **WHEN** the change touches existing code that could be simplified or consolidated for a crisper result
- **THEN** the review recommends the refactor of that existing code as part of the investigation, without applying it

### Requirement: Refactor recommendations carry gitnexus blast radius

For every refactoring candidate, the review SHALL use `gitnexus` to discover the blast radius
(`impact … direction: upstream`) of the code to be refactored and SHALL report HIGH/CRITICAL risk with
the recommendation. When `gitnexus` is unavailable, the review SHALL warn and proceed without it
(DEC-4).

#### Scenario: High blast radius refactor

- **WHEN** a refactor candidate's upstream impact is HIGH or CRITICAL
- **THEN** the recommendation reports that risk so the developer can weigh it before accepting

#### Scenario: gitnexus unavailable

- **WHEN** the gitnexus index is unavailable during the investigation
- **THEN** the review warns that blast radius could not be computed and proceeds with the rest of the review

### Requirement: Cited catalogue ids are preserved with brief glosses

`meaningfy-code-review` SHALL keep citing `cosmic-python` catalogue entries by their stable ids
(`AP-*`, `PR-*`, `BP-*`) and SHALL keep a brief human gloss alongside each cited id. It SHALL NOT
restate the rule text nor relocate any catalogue entry; the four intake anti-patterns
(`AP-IO-IN-MODELS`, `AP-FREESTR-ANYLAYER`, `AP-DICT-AS-MODEL`, `AP-DUP-CONST`) already live in the
catalogue and stay there (DEC-5, DEC-6).

#### Scenario: A checklist line cites an id with a gloss

- **WHEN** the checklist references an architecture or code-quality rule
- **THEN** it shows the cited id plus a one-line gloss and does not copy the catalogue's rule text

#### Scenario: No catalogue relocation

- **WHEN** the change is validated against single-source-of-authority
- **THEN** no `cosmic-python` catalogue entry has been moved, renamed, or restated, and `make validate` stays green
