## ADDED Requirements

### Requirement: The offer ladder has one owner and one set of names
`semantic-consulting-coach/references/engagement-lifecycle.md` SHALL own the offer ladder with the
names discovery workshop, Proof of Value (deliverable: the Decision Package) and Scaling; every other
catalogue file SHALL cite it and SHALL NOT use the former Light/Deep names except the one "formerly"
note (DEC-9). Presale SHALL remain the only free stage.

#### Scenario: A file uses a former name
- **WHEN** a file under `skills/`, `docs/`, `use-cases/` or `agents/` says "Light tier" or "Deep tier" outside the "formerly" note
- **THEN** the rename task is not done

### Requirement: Qualification has one owner
`sales-qualification` SHALL own five-P, MEDDPICC and the prospect question bank;
`presales-discovery` SHALL cite it for questions and keep only the coaching posture;
`proposal-writing` SHALL NOT claim to qualify the need (DEC-10).

#### Scenario: A user asks to qualify a prospect
- **WHEN** a probe asks "score this deal on the five Ps"
- **THEN** it routes to `sales-qualification`, and the near-miss "coach me through a first meeting" routes to `semantic-consulting-coach`
