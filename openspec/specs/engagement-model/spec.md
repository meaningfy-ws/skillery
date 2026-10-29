# engagement-model Specification

## Purpose
Meaningfy's commercial engagement model: no gate before a client's first paid purchase, a
calendar-boxed Proof of Value with safeguards, build work scoped against Semantic Layer building
blocks, repeat business as a plain fact, and commercial facts kept apart from coaching knowledge.
## Requirements
### Requirement: A client's first paid purchase has no gate
The engagement model SHALL offer two first paid purchases after presale: Discovery & Onboarding
(sold at two depths, the discovery workshop and the Proof of Value) and direct-to-build. A client
SHALL be able to buy a build contract directly, without first completing Discovery & Onboarding;
direct-to-build's precondition SHALL be an input condition (requirements/use-case elicitation done at
the start of the build contract), not a gate.

#### Scenario: A client wants to buy a build contract directly
- **WHEN** a client already knows what they want and asks for a build contract without having bought
  Discovery & Onboarding
- **THEN** the model permits selling the build contract directly, with the use-case elicitation done
  at the start of that contract

#### Scenario: A gate is found requiring Discovery & Onboarding before build
- **WHEN** a document states that a build engagement is valid only once Discovery & Onboarding is
  complete
- **THEN** the document is out of conformance with this requirement and the gate MUST be removed

### Requirement: The Proof of Value is a calendar-boxed fixed frame with a safeguards mechanism
The Proof of Value SHALL be documented as running 4–6 weeks, calendar-based rather than
effort-based, at a fixed price and fixed duration. The engagement model SHALL state a safeguards
mechanism: when agreed outcomes cannot reasonably be reached within the agreed duration for reasons
outside Meaningfy's control, Meaningfy SHALL signal this explicitly and propose one of exactly three
options — a scope reduction, a short extension, or a formal stop with partial delivery. A silent
overrun SHALL NOT be an available outcome.

#### Scenario: The Proof of Value risks running past its agreed duration
- **WHEN** stakeholder unavailability, information access problems, late decision-makers, or a
  reorganisation puts the agreed outcomes at risk within the 4–6 week window
- **THEN** Meaningfy signals this explicitly to the client and proposes one of scope reduction, a
  short extension, or a formal stop with partial delivery

#### Scenario: A document anchors the Proof of Value to a man-day or rate-card estimate
- **WHEN** a document describes the Proof of Value's price as derived from a number of man-days or a
  rate card
- **THEN** the document is out of conformance — the frame is calendar-based, not effort-based, and
  the distinction MUST be stated alongside the 4–6 week figure

### Requirement: Build work is scoped against composable Semantic Layer building blocks
The engagement model SHALL describe build work as Semantic Layer adoption, decomposed into six
building blocks — modelling/ontology, software development, data mappings & integration,
analytics/BI connections, agentic framework development, and training & capability building. A
commercial project SHALL be able to scope against one block, several, or the whole Semantic Layer;
no block SHALL require another to be bought first.

#### Scenario: A client wants to buy only the training block
- **WHEN** a client requests only training & capability building
- **THEN** the model permits selling that block on its own

#### Scenario: A document presents the blocks as fixed contract types in a set order
- **WHEN** a document numbers the building blocks as sequential phases or requires one before another
- **THEN** the document is out of conformance — the blocks are composable and carry no implied order

### Requirement: Repeat business is a plain fact, not a labelled phase
A client who has closed two or more contracts SHALL be described as a repeat client, stated as a
plain fact rather than as a capitalised status label (e.g., "Partner") or as a numbered phase (e.g.,
"P3"). Sales/Presales SHALL lead the repeat-client relationship, drawing on
`executive-communication` for client-facing messaging.

#### Scenario: A client closes their second contract
- **WHEN** a client closes a second contract with Meaningfy
- **THEN** the client is described as a repeat client and Sales/Presales leads that relationship — no
  status is awarded, recorded, or expires

#### Scenario: A document reintroduces the "Partner" label or a P3 phase
- **WHEN** a document uses a capitalised "Partner" label or numbers repeat business as a phase
- **THEN** the document is out of conformance with this requirement and MUST state the plain fact
  instead

### Requirement: Commercial facts and coaching knowledge live in separate coach references
`skills/semantic-consulting-coach/references/engagement-lifecycle.md` SHALL state the engagement
model's commercial facts (the stages, the free/paid line, the tiers, the building blocks, the
repeat-client rule). `skills/semantic-consulting-coach/references/engagement-model.md` SHALL carry
only reusable coaching knowledge (the client cognitive states, state-2 signals, boundary-holding
technique, and engagement-design questions) and SHALL cite `engagement-lifecycle.md` for commercial
facts rather than restating them.

#### Scenario: The coaching reference states a commercial fact directly
- **WHEN** `engagement-model.md` states a commercial fact (a duration, a free/paid boundary) without
  citing `engagement-lifecycle.md`
- **THEN** the file is out of conformance and MUST cite the owning reference instead

#### Scenario: A commercial fact exists only in the coaching reference
- **WHEN** a commercial fact about the engagement model appears in `engagement-model.md` but not in
  `engagement-lifecycle.md`
- **THEN** the fact MUST be added to `engagement-lifecycle.md` and `engagement-model.md` updated to
  cite it

