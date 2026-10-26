## ADDED Requirements

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
