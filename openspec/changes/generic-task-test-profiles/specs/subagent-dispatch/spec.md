<!-- Reconciled 2026-11-14 with the live `subagent-dispatch` spec (design D-16). The reader's
     brief keeps the live brief requirement, so that one is not modified. The reader's report
     leaves out the verdict of the reviewing fields, so the live report requirement is modified
     below to name that exception. -->

## ADDED Requirements

### Requirement: The adversarial reader has one brief
`guardrails` SHALL hold, in `references/adversarial-reader.md`, the one brief of the adversarial
reader, a fresh subagent. The brief SHALL state every part the requirement *A subagent starts
fresh from a brief* asks for: the goal and why (to read the draft in a role and try to break it,
so the author can fix it before the recipient reads it, with one line about who receives the
piece); the draft as a path; what is already decided (the criteria and who confirmed them, the
attack list its owning skill supplies, and, at a second read, the points already open with the
owner, or "none"); the no-gos (no rewrite, no proposed wording, no verdict); and the report
expected. The brief SHALL also name the tools the reader may use: `Read`, `Grep` and `Glob` for a
piece of prose, and also the code tools (Serena, ast-grep, GitNexus) where the piece read is code
or a repository (DEC-12). What was decided about the piece reaches the reader as criteria and open points: the
brief SHALL carry no dossier, no thread and none of the author's reasoning. The reader SHALL
return an assessment, not a verdict: the base report plus the reviewing fields without their
verdict, with its findings in order of weight, each naming the criterion it bears on and quoting
the draft, and then the criteria it has no finding on. It SHALL NOT give a verdict, a pass, a
fail or a score, and SHALL NOT rewrite the draft or propose wording; the author revises and the owner judges. What it notices that matches
no criterion SHALL be returned as a proposed criterion under *Open questions*, not as a finding
against a criterion. No other skill or agent file SHALL copy the brief
(generic-task-test-profiles DEC-2, DEC-5, DEC-11).

#### Scenario: A finding carries its quotation
- **WHEN** the reader sees that an offer goes against the criterion "every priced deliverable is in scope"
- **THEN** its report holds a finding that names that criterion and quotes the lines of the offer that show it

#### Scenario: A finding outside the criteria
- **WHEN** the reader notices a weak opening that no criterion covers
- **THEN** it returns it as a proposed criterion under *Open questions*, and attaches it to no criterion

#### Scenario: No verdict
- **WHEN** the reader has read a contract draft and has findings on two of four criteria
- **THEN** its report lists the two findings and the two criteria without a finding, and holds no pass, fail, score or approval

#### Scenario: The reader is asked to improve the text
- **WHEN** the reader has a finding on a draft
- **THEN** its report holds no rewritten passage, and the author revises

#### Scenario: A second read
- **WHEN** a contract draft is read a second time and a finding of the first read was handed to the owner as an open point
- **THEN** the brief lists that criterion as open, with the owner, and the reader does not raise it again

#### Scenario: A reader of an offer
- **WHEN** an agent briefs the reader of an offer
- **THEN** the brief names `Read`, `Grep` and `Glob` as the reader's tools, and no other

#### Scenario: The brief is copied elsewhere
- **WHEN** a file under `skills/` or `agents/`, other than `guardrails`' reference, holds the brief's line "Do not rewrite and do not propose wording"
- **THEN** `make validate` fails, naming the file

### Requirement: The reader runs on what leaves the company
The same reference SHALL state, once, when the profile applies. A piece leaves the company when
someone outside Meaningfy will read it and it is one of four kinds: an offer or proposal, a
contract, a public post, or a client message (a sales message to a partner included). Other
text that is read outside Meaningfy (public documentation, a README, a changelog, release notes)
SHALL NOT fall under this requirement. For such a piece the owner SHALL confirm the criteria
before drafting and the reader SHALL run before the piece is handed over as ready to send; for an internal
piece the agent SHALL state the criteria without waiting for confirmation and the reader SHALL run
only on request. One piece SHALL get one profile: a piece that states scope or price is an offer,
whatever its form. An unattended run SHALL do neither step; both SHALL run when the owner picks its
draft up in an attended session. The reader's findings SHALL send the work back to the draft, except
where the owning skill reserves the change to the owner: a finding on such a point SHALL be handed
to the owner as an open point with the reader's quotation. The findings of the second read SHALL go
to the owner with the draft, and no third read is started. When no reader can be started,
the piece SHALL be marked *unread* and SHALL NOT be presented as ready to send (DEC-3, DEC-4).

#### Scenario: An offer
- **WHEN** an agent is asked to write an offer for a client
- **THEN** it proposes the success and failure criteria, drafts only after the owner confirms them, and a reader reports against them before the offer is handed over

#### Scenario: A draft for internal review
- **WHEN** an offer is drafted for a colleague to comment on, and is not yet to be sent
- **THEN** the reader is not mandatory until the offer is about to go to the client

#### Scenario: A changelog line
- **WHEN** an agent writes a changelog line or a page of public documentation
- **THEN** no criteria confirmation and no adversarial reader are required by this requirement

#### Scenario: An unattended run
- **WHEN** a scheduled run drafts a follow-up to a client
- **THEN** the run asks for no confirmation of criteria and starts no adversarial reader

#### Scenario: A finding remains after two reads
- **WHEN** the second reader still has a finding on an offer that was revised after the first read
- **THEN** the agent hands the owner the draft with that finding and its quotation, and starts no third read

#### Scenario: The criteria are corrected after the draft exists
- **WHEN** the owner corrects a criterion after the first read
- **THEN** the draft is revised and read against the corrected criteria, and the count of reads starts again

#### Scenario: No reader can be started
- **WHEN** the agent cannot start a subagent in its session
- **THEN** it marks the piece *unread*, says so first in its report or hand-over, and does not call the piece ready to send

## MODIFIED Requirements

### Requirement: Every subagent returns the base report, extended per purpose
Every subagent SHALL return a report with: status (`done`, `partly done`, `blocked` or `failed`); the
answer; evidence as pointers (paths, lines, commands), not pasted content; what it did not check;
open questions; side effects; recommendations for actions it was not allowed to take. A report SHALL
add the fields of its purpose (exploring, researching, implementing, authoring, reviewing, verifying,
test-running) as listed in the `guardrails` reference, with one exception: the adversarial reader
SHALL add the reviewing fields without their verdict, as the requirement *The adversarial reader
has one brief* says. Material too long for the report SHALL go to a
file, and the report SHALL carry its path and a summary (DEC-4). A report longer than the
report-length key of the guardrails data file is oversized.

#### Scenario: A long crawl returns a pointer
- **WHEN** a research subagent gathers more findings than fit in its report
- **THEN** it writes them to a file and returns the path, a summary and the base fields

#### Scenario: A blocked implementer says so
- **WHEN** an implementing subagent cannot make a test pass without changing the plan
- **THEN** it returns status `blocked`, what it tried, and the question for the coordinator

#### Scenario: An oversized report is flagged
- **WHEN** a subagent's report runs past the report-length key
- **THEN** navigator shows an oversized-report warning naming the subagent

#### Scenario: The adversarial reader's report holds no verdict
- **WHEN** an adversarial reader reports on a draft
- **THEN** its report holds the base fields and its findings, and no verdict
