# writing-antipatterns Specification

## Purpose

Define the `writing-antipatterns` skill: the register/genre-conditional catalogue of how writing
fails — a genre map, a short unguarded-defect list, and a single-sourced inversion matrix of
genre-conditional antipatterns. Governs what the catalogue SHALL ship and the boundary that keeps
this skill from duplicating model-structure antipatterns or restating other skills' owned content.
## Requirements
### Requirement: writing-antipatterns owns the register/genre-conditional antipattern catalogue

The catalogue SHALL provide a `writing-antipatterns` skill in `meaningfy-core` that owns a
cross-cutting genre map (8 genres, each naming its owning skill and register signature), a short
list of unguarded defects that apply regardless of genre, and a canonical inversion matrix of
genre-conditional antipatterns (each entry stating where it fails, where the same move is
required, the guard question, the detection cue, and the fix). It SHALL NOT own the voice profile
(`company-voice.md`), the Diátaxis quadrant definitions (`explanatory-writing`'s fit-map), model or
diagram-structure antipatterns (`modelling-conventions`, `architecture`), or a genre for any domain
(sales, PM, BI) that already maps onto one of the 8 named genres.

#### Scenario: A genre is looked up for a drafting task

- **WHEN** a skill is producing prose in one of the 8 named genres
- **THEN** it cites `writing-antipatterns` and uses that genre's column of the inversion matrix
  rather than restating antipattern guidance inline

#### Scenario: A domain is mistaken for a genre

- **WHEN** a contributor considers adding a new genre for a domain (e.g. "sales", "PM", "BI")
- **THEN** the genre map's existing 8 genres are checked first; the domain artefact is classified
  as a flavour of an existing genre unless no current skill could plausibly own it

#### Scenario: A model-structure antipattern is proposed for inclusion

- **WHEN** a proposed addition concerns model or diagram structure rather than prose/rhetoric
  (e.g. "god-class", "free strings where a controlled set belongs")
- **THEN** it is rejected from this skill and pointed at `modelling-conventions` or `architecture`,
  whichever already owns it

### Requirement: Unguarded and guarded defects are kept distinct

The skill SHALL separate defects that hold in every genre (unguarded, stated once in `SKILL.md`)
from defects whose correctness depends on genre (guarded, stated in `inversion-matrix.md` with an
explicit guard question). Hedging (guarded) and weasel words / unattributed authority (unguarded)
SHALL be documented as distinct entries.

#### Scenario: Hedging is confused with weasel words

- **WHEN** a claim uses an epistemic qualifier on the author's own statement
- **THEN** it is classified under the guarded Hedging entry, not the unguarded weasel-words entry

#### Scenario: A claim is attributed to an unnamed source

- **WHEN** a claim reads "studies show" or "some experts believe" with no named source
- **THEN** it is classified under the unguarded weasel-words entry regardless of genre

### Requirement: Every writing-family skill cross-references without restating

Every writing-family skill SHALL carry one `Related:` reference to `writing-antipatterns` and
SHALL NOT copy any antipattern content inline. The family is `technical-writing`,
`explanatory-writing`, `executive-communication`, `proposal-writing`, `decision-package`,
`architecture`, and `semantic-consulting-coach`.

#### Scenario: A writing-family skill's boundary section is audited

- **WHEN** the reference audit checks a writing-family skill's `Related:` section
- **THEN** `writing-antipatterns` is listed, and no antipattern smell/fix/cue text is duplicated in
  that skill's own body

### Requirement: Claim accuracy is catalogued as unguarded defects

`writing-antipatterns` SHALL list two unguarded defects about claim accuracy:

- **Claim exceeds the mechanism:** a claim states an outcome, an intensifier, a vague evaluative
  word or a category that the method cannot guarantee or an outsider cannot check. The fix names the
  mechanism or the checkable property.
- **Impossible predicate:** a verb that is not physically or logically possible for its subject.

Their examples SHALL come from at least two domains. Spelling out an acronym at first use SHALL be
added to the existing guarded *Deferred definitions* entry, not as a new entry. The writing skills'
own examples SHALL NOT show either defect.

#### Scenario: An evaluative word with no checkable property

- **WHEN** copy says an approach makes answers "defensible"
- **THEN** it is classified as Claim exceeds the mechanism, and the fix names a checkable property
  such as "traceable"

#### Scenario: An abstract subject with a physical verb

- **WHEN** copy says "data disagrees"
- **THEN** it is classified as Impossible predicate, whatever the genre

### Requirement: Negative framing is a guarded antipattern

The inversion matrix SHALL hold a guarded entry for negative framing and double negation: a defect in
Decision and persuasive headlines, slogans and governing thoughts, and required in
Contract/specification text, where prohibitions are stated as prohibitions. The entry SHALL carry a
status for each of the eight genres.

#### Scenario: A prohibition in a specification

- **WHEN** a specification states "the service MUST NOT store the token"
- **THEN** the negative framing is not reported as a defect

### Requirement: Antipattern entries are single-sourced in the inversion matrix

Each antipattern SHALL have exactly one canonical prose entry in
`references/inversion-matrix.md`, and the compact matrix there SHALL give its status in each of the
eight genres. No other file of the skill SHALL restate an entry's smell, fix or detection cue.

#### Scenario: A new antipattern is added

- **WHEN** a new genre-conditional antipattern is documented
- **THEN** it is added as one entry in `inversion-matrix.md` and one row of the compact matrix with
  a status for all eight genres, and no antipattern text is duplicated in another file

#### Scenario: One genre's view is needed

- **WHEN** a reviewer checks a Decision record
- **THEN** the Decision record column of the compact matrix gives every move's status, and the
  reviewer opens an entry only for a move it flags

