## ADDED Requirements

### Requirement: The adversarial reader has one brief
`guardrails` SHALL hold, in `references/adversarial-reader.md`, the one brief of the adversarial
reader: a fresh subagent that is given only the draft as a path, the criteria, the role and the
attack list its owning skill supplies, and one line about who receives the piece. The reader SHALL
return the base report plus the verifying fields, with pass or fail for each criterion and a
quotation from the draft for every fail. It SHALL NOT rewrite the draft or propose wording. What it
notices that matches no criterion SHALL be returned as a proposed criterion under *Open questions*,
never as a fail. No other skill or agent file SHALL copy the brief (generic-task-test-profiles
DEC-2, DEC-5).

#### Scenario: A fail carries its quotation
- **WHEN** the reader judges that an offer fails the criterion "every priced deliverable is in scope"
- **THEN** its report marks that criterion failed and quotes the lines of the offer that show it

#### Scenario: A finding outside the criteria
- **WHEN** the reader notices a weak opening that no criterion covers
- **THEN** it returns it as a proposed criterion under *Open questions*, and no criterion is marked failed for it

#### Scenario: The reader is asked to improve the text
- **WHEN** a draft fails a criterion
- **THEN** the reader's report holds no rewritten passage, and the author revises

#### Scenario: The brief is copied elsewhere
- **WHEN** a file under `skills/` or `agents/`, other than `guardrails`' reference, holds the brief's line "Do not rewrite and do not propose wording"
- **THEN** `make validate` fails, naming the file and the line

### Requirement: The reader runs on what leaves the company
The same reference SHALL state, once, when the profile applies. A piece leaves the company when
someone outside Meaningfy will read it. For such a piece the owner SHALL confirm the criteria before
drafting and the reader SHALL run before the piece is handed over as ready to send; for an internal
piece the agent SHALL state the criteria without waiting for confirmation and the reader SHALL run
only on request. One piece SHALL get one profile: a piece that states scope or price is an offer,
whatever its form. An unattended run SHALL do neither step; both SHALL run when the owner picks its
draft up in an attended session. A failed criterion SHALL send the work back to the draft, except
where the owning skill reserves the change to the owner: such a fail SHALL be handed to the owner
as an open point with the reader's quotation. After the second read, any criterion still failed
SHALL go to the owner with the draft, and no third read is started. When no reader can be started,
the piece SHALL be marked *unread* and SHALL NOT be presented as ready to send (DEC-3, DEC-4).

#### Scenario: An offer
- **WHEN** an agent is asked to write an offer for a client
- **THEN** it proposes the success and failure criteria, drafts only after the owner confirms them, and a reader reports against them before the offer is handed over

#### Scenario: A draft for internal review
- **WHEN** an offer is drafted for a colleague to comment on, and is not yet to be sent
- **THEN** the reader is not mandatory until the offer is about to go to the client

#### Scenario: An unattended run
- **WHEN** a scheduled run drafts a follow-up to a client
- **THEN** the run asks for no confirmation of criteria and starts no adversarial reader

#### Scenario: Still failing after two reads
- **WHEN** an offer still fails one criterion after it was revised and read a second time
- **THEN** the agent hands the owner the draft with that failed criterion and its quotation, and starts no third read

#### Scenario: The criteria are corrected after the draft exists
- **WHEN** the owner corrects a criterion after the first read
- **THEN** the draft is revised and read against the corrected criteria, and the count of reads starts again

#### Scenario: No reader can be started
- **WHEN** the agent cannot start a subagent in its session
- **THEN** it marks the piece *unread*, says so first in its report or hand-over, and does not call the piece ready to send
