# delivery-release-dod Specification

## Purpose
The Definition of Done for delivery and release: a build-tier DoD with the Builder's DoD in full,
the Shipper's DoD as a content contract, pointers between the two, a logged re-shape when they
disagree, and ownership that cites only existing skills.
## Requirements
### Requirement: Build-tier-only scope for the build DoD document
`docs/practice/ai-coding/dod-quality-gates.md` SHALL carry only build-tier Definition of Done content. It
SHALL NOT contain an engagement-gates table, a commercial-layer TODO block, or any other
human/commercial engagement-sign-off content; it SHALL instead point to the Shipper's DoD in
`docs/practice/ai-sales/sales-dod.md` and to the commercial stage gates in
`skills/semantic-consulting-coach/references/engagement-lifecycle.md`.

#### Scenario: Reader looks for commercial gates in the build DoD file
- **WHEN** a reader opens `docs/practice/ai-coding/dod-quality-gates.md` looking for engagement or commercial
  sign-off gates
- **THEN** they find no engagement-gates table and no commercial-layer TODO block, only pointers to
  `docs/practice/ai-sales/sales-dod.md` and `engagement-lifecycle.md`

### Requirement: Builder's DoD present in full
The build DoD document SHALL contain the Builder's DoD in full — the SDLC-plane check of whether the
shipped increment conforms to the EPIC and the architecture — explicitly labelled as Builder-side,
with its accountability named and a link to the role's definition rather than a restated definition.

#### Scenario: Reader checks what the Builder's DoD covers
- **WHEN** a reader reads the Delivery & Release section of `docs/practice/ai-coding/dod-quality-gates.md`
- **THEN** they find the Builder's DoD stated in full (verification and validation against the EPIC
  and architecture), labelled as the Builder's accountability, with a link to where the Builder role
  is defined rather than a role description restated in this file

### Requirement: Shipper's DoD content contract
`docs/practice/ai-sales/sales-dod.md`, which instantiates the Shipper's DoD, SHALL contain all six of
the following elements: (1) the concrete document trail it checks against — the request for an
offer, the offer, the contract, meeting minutes and documented exchanges, and any other document
recording a client need and the agreement to fulfil it; (2) the accountability — that the Shipper
answers "did we deliver what was promised?", with the role itself defined only in
`docs/practice/roles-and-raci.md`; (3) the verdict's status as human sign-off, explicitly not CI-automatable;
(4) a pointer back to the Builder's DoD stating that the two close together, on two planes; (5) a one-line citation of the disagreement/re-shape rule,
cited and not restated; (6) light-touch framing — the check is a human judgement that MAY be
agent-assisted, not a mandated tool, required artifact, or automated gate.

#### Scenario: Reader follows the Shipper's DoD pointer and checks the content contract
- **WHEN** a reader follows the pointer from `docs/practice/ai-coding/dod-quality-gates.md` to the Shipper's
  DoD in `docs/practice/ai-sales/sales-dod.md`
- **THEN** the landed content names the concrete document trail, states the Shipper's
  "did we deliver what was promised?" accountability with the role definition linked elsewhere, marks
  the verdict as human sign-off and not CI-automatable, contains a pointer back to the Builder's DoD
  asserting the two close together on two planes, cites the disagreement/re-shape rule in one line without restating it, and frames the check
  as human judgement that MAY be agent-assisted

### Requirement: Reciprocal pointer between the two DoDs
The build DoD document and the Shipper's DoD document SHALL each carry a live pointer to the other,
and neither pointer SHALL present one DoD as substituting for, or sequentially following, the other.

#### Scenario: Reader checks the pairing claim in either direction
- **WHEN** a reader reads either the Builder's DoD pointer to the Shipper's DoD, or the Shipper's
  DoD's pointer back to the Builder's DoD
- **THEN** each pointer states that the two DoDs close together, on two planes — with no wording
  implying that one substitutes for the other, and no wording implying the Shipper's DoD runs after, or depends on
  the prior completion of, the Builder's DoD

### Requirement: Disagreement between the two DoDs routes to a logged re-shape
When the Builder's DoD and the Shipper's DoD disagree, neither verdict SHALL override the other; the
disagreement SHALL be treated as a divergence between the EPIC and the contract, resolved by a
logged re-shape. This rule SHALL be stated exactly once, in `docs/practice/ai-coding/dod-quality-gates.md`,
scoped explicitly to both DoDs regardless of which file each lives in; every other reference to this
rule SHALL cite it rather than restate it.

#### Scenario: The two DoDs disagree
- **WHEN** the Builder's DoD passes while the Shipper's DoD fails, or the reverse
- **THEN** no document states that either role's verdict wins by seniority or automatically
  overrides the other; instead each document either states, or cites without restating, that the
  divergence is resolved by a logged re-shape

#### Scenario: A second document needs to reference the disagreement rule
- **WHEN** the Shipper's DoD document (or any other document) needs to reference what happens on
  disagreement
- **THEN** it contains a one-line citation of the rule stated in `docs/practice/ai-coding/dod-quality-gates.md`
  and does not restate the rule's substance in its own words

### Requirement: Delivery, release, and CD ownership cites only existing skills
Any ownership table or delivery-section citation of delivery, release, or CD/deploy mechanics SHALL
name only skills that exist in the catalogue at the time of the edit, split by concern rather than
merged into a single stale or generic row.

#### Scenario: Reader looks up who owns CD/deploy and release lifecycle
- **WHEN** a reader consults the single-owner ownership table for CD/deploy and release-lifecycle
  ownership
- **THEN** they find two rows — one citing `ci-cd-delivery` for CD/deploy, one citing
  `meaningfy-release` for release lifecycle (versioning, changelog, publish) — and no row citing a
  skill marked "future" or otherwise absent from the catalogue

#### Scenario: Reader looks for branch/commit/PR ownership from the delivery section
- **WHEN** a reader reads the Delivery & Release section's release-mechanics citations
- **THEN** they find links to `ci-cd-delivery`, `meaningfy-release`, and `meaningfy-git-workflow` with
  no restatement of what those skills own, and the existing `meaningfy-git-workflow` ownership-table
  row is not duplicated by a new row

