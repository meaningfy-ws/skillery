## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Antipattern entries are single-sourced; per-genre files are filtered views

**Reason**: The eight per-genre pointer files repeated the compact matrix's columns, one file per
column; under the lean standard (`lean-skill-standard`) that repetition is cut. The single-source
rule itself is kept by the requirement added below.

**Migration**: A reader of one genre uses that genre's column of the compact matrix in
`references/inversion-matrix.md`; the asynchronous approval exception, formerly in `decision.md`,
is stated above the matrix.

## ADDED Requirements

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
