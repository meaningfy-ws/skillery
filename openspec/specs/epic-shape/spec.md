# epic-shape Specification

## Purpose
How big an EPIC may be and how its templates read: the appetite is one of six named sizes
saying how deep and extensive the solution may be, never a duration; the EPIC and PLAN templates
every project receives speak plain, precise language.
## Requirements
### Requirement: An EPIC's appetite is a named size, never a duration
An EPIC's appetite SHALL be one of `TINY`, `SMALL`, `MEDIUM`, `LARGE`, `VERY LARGE` or `HUGE`, each
defined in `epic-planning` by how deep and how extensive the solution may be, and SHALL NOT be stated
in days or weeks (DEC-10). A `HUGE` bet SHALL be split into several EPICs before it is planned. The
vault's `work-shape` SHALL use the same names without a week mapping. Archived EPICs SHALL NOT be
edited.

#### Scenario: A template asks for a named size
- **WHEN** a new project renders the proposal template
- **THEN** its Appetite guidance lists the six sizes and points to their definitions, and mentions no
  duration

#### Scenario: A HUGE bet is split
- **WHEN** an EPIC is shaped as `HUGE`
- **THEN** the shaper splits it into several EPICs before a PLAN is derived

### Requirement: The EPIC and PLAN templates speak plain language
The `meaningfy` schema's instructions and its `proposal`, `design` and `tasks` templates SHALL state
their guidance in common, precise words, without method jargon such as "golden thread", "spine",
"altitude", "bet", "Shape-Up" or lists of acronyms; their files and headings SHALL stay as they are (DEC-12).
`epic-planning` SHALL have no second EPIC template (DEC-13).

#### Scenario: The parent citation is asked for in plain words
- **WHEN** a reader opens the `design` or `tasks` template
- **THEN** it asks them to name the EPIC the plan derives from, without the term "golden thread"

#### Scenario: Headings are unchanged
- **WHEN** the rewritten proposal template is compared with the previous one
- **THEN** its `##` headings are identical

### Requirement: Planning effort follows the appetite
A PLAN's depth SHALL follow its appetite. At every appetite, and on any re-gate, the clarity gate
SHALL run at most twice; the second run SHALL read only the gaps the first one listed. Gaps left
after the second run SHALL go to the developer as one question round, and a gap the developer
accepts SHALL be recorded as a `DEC-` in `design.md`, the one case in which a PLAN proceeds below
9/10 (DEC-2). Elicitation SHALL ask its questions in rounds (lean-delivery DEC-6, DEC-7).

#### Scenario: A SMALL PLAN at 8.6 after two runs
- **WHEN** a SMALL PLAN scores 8.6 on its second clarity-gate run
- **THEN** the remaining gaps go to the developer in one round, and no third revision runs

#### Scenario: A LARGE PLAN at 8.8 after two runs
- **WHEN** a LARGE PLAN scores 8.8 on its second clarity-gate run
- **THEN** the remaining gaps go to the developer in one round, and no third run is made

#### Scenario: A re-gate
- **WHEN** a gated PLAN is changed and gated again
- **THEN** the gate runs at most twice for that re-gate, and its second run reads only the gaps the first listed

### Requirement: The lead marks shaping and the PLAN
`epic-planning` SHALL cite the mark line defined in `epic-delivery`. The lead SHALL write it with
`phase=shape` at the start of shaping and with `phase=plan` at the start of the PLAN (proposal
DEC-3). Archive and release SHALL write no mark (proposal DEC-4).

#### Scenario: Shaping starts
- **WHEN** the lead starts shaping change `x`
- **THEN** it writes `mark: change=x phase=shape stage=-`

#### Scenario: The PLAN starts
- **WHEN** the lead starts deriving the PLAN of change `x`
- **THEN** it writes `mark: change=x phase=plan stage=-`

#### Scenario: A change is archived
- **WHEN** a change is archived or released
- **THEN** no mark line is written and the report labels that work `guessed`

### Requirement: The PLAN is derived and gated while shaping
Deriving the PLAN and gating it SHALL be part of the shaping session, in one workflow owned by
`epic-planning`: seeds, the EPIC, the PLAN, the gate. A shaping session SHALL end with each EPIC's
PLAN gated, not "shaped, not planned". Between the EPIC and its PLAN the session MAY be reset with
a hand-over note whose template is the file in `epic-delivery`. Scenario sign-off SHALL happen at
the PLAN gate, which is now in shaping. A change shaped under the old split and half-way through
SHALL be read by the same phases (DEC-19, D-17).

#### Scenario: A shaping session ends
- **WHEN** a shaping session finishes an EPIC
- **THEN** its PLAN is derived and gated, and the session does not end with the EPIC "shaped, not planned"

#### Scenario: A reset between EPIC and PLAN
- **WHEN** the session is reset after the EPIC and before the PLAN
- **THEN** a hand-over note with the standard headings carries the work to the fresh session

#### Scenario: Scenarios are signed off at the gate
- **WHEN** a PLAN passes its clarity gate in shaping
- **THEN** the developer signs off its scenarios at that gate, and delivery does not ask again unless a scenario changes

#### Scenario: A change half-way through the old split
- **WHEN** a change was shaped under the old split and has an EPIC but no PLAN
- **THEN** the shaping phases derive and gate the PLAN, and delivery does not

