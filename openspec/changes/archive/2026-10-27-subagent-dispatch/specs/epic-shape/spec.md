## ADDED Requirements

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
