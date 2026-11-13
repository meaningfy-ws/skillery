<!-- PLAN (design half), derived 2026-11-14 from proposal.md and from A's gated design, before A's
     delivery. Not yet attacked or gated. -->

> Derives from: EPIC `generic-task-test-profiles` ([`proposal.md`](proposal.md)), DEC-1..DEC-9.
> Depends on: EPIC A `test-strategy`, its gated [`design.md`](../test-strategy/design.md) (D-1, D-2,
> D-3, D-8). Delivery starts after A is delivered (proposal, *Impact*).

## Context

Four kinds of piece are written today with no criterion stated first and no reader who tries to
break them (A's inventory draft, `generic-writing`: "no ROB; VAL is only sales"). What exists:

- **`guardrails`** § 5 *Subagent dispatch* ([SKILL.md](../../../skills/guardrails/SKILL.md), lines
  69–109) owns the brief rules and the base report
  ([`references/subagent-reports.md`](../../../skills/guardrails/references/subagent-reports.md)); the
  *verifying* purpose already adds "the criteria checked; pass or fail per criterion; the gaps".
- **The five owning skills** hold method and no profile:
  [`proposal-writing`](../../../skills/proposal-writing/SKILL.md) (111 lines, *Flow* steps 1–4),
  [`contract-practice`](../../../skills/contract-practice/SKILL.md) (161 lines, phases intake to
  harvest), [`executive-communication`](../../../skills/executive-communication/SKILL.md) (253
  lines, *Start here: diagnose before you structure*),
  [`sales-conversations`](../../../skills/sales-conversations/SKILL.md) (120 lines, an *Acceptance
  criteria* table per work item) and
  [`meaningfy-voice`](../../../skills/meaningfy-voice/SKILL.md) (34 lines; its
  `references/channels/linkedin.md` and `blog.md` are three-line placeholders).
- **A reader exists for sales drafts already:** `sales-operations`'
  [`recipient-reader`](../../../skills/sales-operations/assets/prompts/recipient-reader.md) runs on
  every client-facing draft of every run, scheduled ones included. It answers ten fixed questions
  as the recipient (`CLR`); it is given no criteria and does not attack.
- **The three agents.** `lawyer` is a lead with `Agent` and `guardrails`. `proposal-writer` is
  `delegated` (it cannot ask mid-run; questions go back in its output) with
  `tools: [Read, Grep, Glob, Write, Skill]`. `sales-agent` is `scheduled`, may lead a human session,
  and has no `Agent` tool. Their scenarios are in `tests/features/agents/`; a lint checks their
  shape, and they are run by hand per CLI.
- **A's side.** `skills/test-strategy/` does not exist yet. A's design fixes what this PLAN builds
  on: the row columns (D-2), the question ids `VAL` and `ROB` and the adversary stance (D-3), the
  inventory ids `CHK-<n>` and their test (D-1, D-7), and the pointer line (D-8).
- `openspec/specs/legal-contract-practice` forbids clause text, templates and real names in
  `contract-practice`, the `lawyer` agent and their tests.

## Goals / Non-Goals

**Goals:** the reader's brief and the shared rules, once (DEC-5, Q-12); a profile in each of the
five skills (DEC-1, DEC-2); the two agents able to start a reader (DEC-9); the `generic-writing`
rows; the four proofs of DEC-6; the post capability and its trigger (DEC-8, Q-13); the Definition
of Done of a discipline rule (`docs/development/README.md` §9).

**Non-Goals:** the proposal's No-gos. In particular: no score or pass mark; no new agent; nothing
new in what a scheduled run does; no edit to `sales-operations`, its reviewer prompts or any
workflow file; no tone profile for LinkedIn or blog (`add-content-creation`).

## Decisions

New choices made while planning; settled ones are cited.

- **D-1 One reference holds the brief and the shared rules** (Q-12).
  `skills/guardrails/references/adversarial-reader.md`, with these sections:
  1. *When it applies*: the test "will someone outside Meaningfy read it?"; a draft for internal
     review does not count until it is about to be sent.
  2. *The three steps*: criteria before drafting; the reader before hand-over; the existing checks
     (`rulebook check`, `writing-antipatterns`) as today. For the loop and what a test is, it cites
     `test-strategy` and restates neither.
  3. *Who confirms*: for a piece that leaves the company, the owner, in one line (yes, or a
     correction); for an internal piece nobody, and the reader runs only on request.
  4. *Unattended runs*: neither step; both run at pick-up. **Pick-up** is the owner asking an
     agent, in an attended session, to finish, revise or make ready to send a draft that an
     unattended run made.
  5. *The brief* (below, § Algorithm).
  6. *The report*: the base report plus the *verifying* fields; a quotation for every fail; a
     finding that matches no criterion goes under *Open questions* as a proposed criterion.
  7. *The loop's end*: at most two reads (D-6).
  8. *No reader*: the piece is *unread* (D-7).

  `guardrails`' SKILL.md gains one bullet in § 5, "**An adversarial reader for what leaves the
  company.**", two lines, pointing to the reference; its description gains "the adversarial reader"
  in the dispatch list and the trigger "have a reader attack this draft". The reference names no
  role: the role is an input of the brief.
- **D-2 A profile is one section of fixed shape in its owning skill.** Heading `## Test profile`,
  then one pointer sentence to `guardrails`' reference and four bold labels in this order:
  **Succeeds**, **Fails**, **Reader**, **Attacks**. *Succeeds* and *Fails* are example criteria in
  the form the rabbit-hole demands: each names the reader and what they do or decide. *Attacks* has
  three to five bullets. The section states no step, no "when mandatory" and no report format;
  those are D-1's. The skill's own flow gains one line per step, at the place D-3 names, each
  citing the section. For `meaningfy-voice` the section is in `references/channels/linkedin.md`;
  `blog.md` points to it and adds its differences (the reader sees the title and the first
  paragraph, in a search result or a feed).
- **D-3 Content and placement per skill.**

  | Skill | Reader | Attacks (the bullets) | Criteria step goes | Reader step goes |
  |---|---|---|---|---|
  | `proposal-writing` | a sceptical buyer who must defend the spend | scope and price that name different deliverables; a claim with no evidence; what is excluded left unsaid; no way to stop or extend; a reason to wait | *Flow* step 1, last sentence | a new step 5, *Have it read* |
  | `contract-practice` | opposing counsel | a right or risk given to one side only; a term that reads two ways; an undefined term; a gap against the parent or back-to-back contract; a missing cap or exit | *Intake interview*, a fifth bullet | *The contract workflow* table, row *review*, and one sentence under *Lawyer-review flag* |
  | `meaningfy-voice` (`linkedin.md`) | a stranger scrolling | the first two lines do not say what this is or why to care; it reads as an advert; jargon unexplained; a claim that names no real work; no next step | the profile itself (the skill has no flow) | the profile itself |
  | `executive-communication` | a busy recipient | the ask not found in ten seconds; no decision or deadline; an answer that needs another document; a claim they would doubt; heavier than the artefact deserves | *Start here*, after the three questions | a new closing line of *Start here* |
  | `sales-conversations` | a busy recipient | the ask unclear or hard to say yes to; whose turn got wrong; a commitment nobody approved; a line any vendor could send; not readable on a phone in 20 seconds | a new subsection *At pick-up: criteria and a reader*, under *Workflow* | the same subsection |

  Example criteria (offer): *Succeeds:* the budget holder can say in two minutes what they get,
  what it costs and what is excluded, and has no question left before signing. *Fails:* a
  deliverable is in scope but not in the price, or priced but out of scope.
  `sales-conversations` proposes a piece's criteria from the matching row of its *Acceptance
  criteria* table plus what is specific to the thread; the table itself is unchanged.
- **D-4 The existing `recipient-reader` stays as it is.** It answers `CLR` on every run; the
  busy-recipient adversarial reader answers `ROB` at pick-up, against confirmed criteria. Rejected:
  turning `recipient-reader` into the adversarial reader, which would change scheduled runs and a
  sixth skill (No-gos).
- **D-5 The two agent files** (DEC-9). Both gain `Agent` in `tools`, `guardrails` in `skills` and
  its line under `## Skills` ("the adversarial-reader subagent and the base report"). `Agent` stays
  unscoped (`docs/development/agent-template.md`, *Leads delegate*).
  - `proposal-writer`: **Input** adds "the criteria the owner confirmed". **Output** names the
    proposed criteria among the questions, and the reader's report with the draft. **Side effects**
    adds "may spawn a reader subagent per `guardrails`". **Refuses** adds "it delegates only the
    read, to a subagent given the draft, the criteria and the role". It stays `delegated`: with no
    confirmed criteria in its input it returns them as an open question with a recommended answer
    and no draft.
  - `sales-agent`: **Side effects** adds "may spawn the reviewers of `sales-operations` and, in a
    human session, a reader subagent per `guardrails`". **Refuses** adds "it delegates only a
    review or a read, to a subagent given its inputs and nothing else".
  - `lawyer` is unchanged: it has `Agent` and `guardrails`, and its Refuses line already allows "a
    check, to a read-only subagent".

  Both bodies stay under the 40-line cap (22 and 26 lines today). The grant also lets the sales
  agent start `sales-operations`' three reviewers on scheduled runs, which that skill already tells
  it to do; no instruction of a scheduled run changes (RISK-2).
- **D-6 Two reads at most.** A failed criterion sends the work back to the draft. A fresh reader
  then reads the revised draft against all criteria. Whatever still fails after that second read
  goes to the owner with the draft and the quotations; the owner decides (send, revise, drop).
  Rejected: reading until everything passes, which has no end and slows daily work (DEC-7).
- **D-7 *Unread*.** When the agent cannot start a subagent (the tool is absent, or the CLI does not
  let a subagent start another one), the piece is marked *unread*: said first in the hand-over or
  the report, under *Recommendations* for a delegated agent. An unread piece is never called ready
  to send; the session that receives it runs the reader. This is the fallback for
  `proposal-writer` when it runs as a subagent on a CLI without nested dispatch (RISK-1).
- **D-8 Where criteria and reports are kept.** Never inside the piece. With the piece's work: the
  agent's report (authoring fields) for an offer; the place the contract repository's instructions
  name for open points, for a contract; the session's run note for a sales draft; the conversation
  for a post or a message. A confirmed criterion is quoted with its date.
- **D-9 The reader's inputs and model.** The brief gives the draft as a path. A message under 200
  words that exists only as a mail draft is pasted, the one exception to "inputs as paths". The
  recipient line is one sentence (role, relationship, what they last asked); no dossier, no
  thread. The reader is a fresh general-purpose subagent (No-gos: no new agent). Its model follows
  `guardrails`' rule, unchanged: a second read where a miss is costly takes the top model, which
  the reference names for offers and contracts.
- **D-10 Matrix rows and checks** (A's D-1, D-2). `inventory.md` gains six checks, numbered from
  the next free id at delivery: the reader's brief (`guardrails`) and one profile per owning skill.
  `generic-writing.md` gains or updates ten rows, a `VAL` and a `ROB` row for each of the five
  profiles (offer, contract, post, message, sales message):

  | Question | Check | Technique owner | Tool | Moment | Decided by | Status |
  |---|---|---|---|---|---|---|
  | `VAL` | the profile's check | the owning skill | none | before drafting; at pick-up for an unattended draft | the owner | `exists` |
  | `ROB` | the profile's check and the brief's check | the owning skill (role, attacks); `guardrails` (brief) | a fresh subagent | before hand-over | the adversary stance; the owner after the second read | `exists` |

  The internal-message case is the same `VAL` row of `executive-communication`: the owner decides
  by correcting or not. Each of the five skills, and `guardrails`, carries A's pointer line with
  `VAL`, `ROB` added. In `test-strategy`'s SKILL.md only a status quoted from a changed row may
  change (the Quick Start's "`gap` → D"); nothing else (No-gos).
- **D-11 Proof mechanics** (DEC-6).
  - *Baseline.* Five fixed tasks, fabricated, written to `evidence/baseline/inputs.md` before any
    run:

    | Id | Kind | Task |
    |---|---|---|
    | B-1 | offer | a proposal email for `Example Registry`: map the supplier codes of three systems to one vocabulary, six weeks, ceiling 40 000 EUR |
    | B-2 | contract | our response to the term table `Example Client SA` sent back (`tests/fixtures/readers/contract-planted.md`) |
    | B-3 | post | a LinkedIn post announcing our new SHACL validation service |
    | B-4 | sales message | the follow-up to a first call with a head of data who asked for a one-page summary |
    | B-5 | internal message | a status note to the team: the registry project slips one week |

    Each task is run by a fresh general-purpose subagent on `sonnet`, with one brief: the task, the
    owning skill by path, and "where the skill tells you to ask the owner, write the question,
    take the answer as yes and go on". The *without* runs happen first, on the base commit, before
    any skill is edited; the *with* runs after stage 2, with the same briefs. For each run
    `evidence/baseline.md` records four observations, yes or no, never a score: **O-1** success
    and failure were stated before the first line of the draft; **O-2** the owner was asked to
    confirm them (not applicable to B-5); **O-3** a reader's report exists with pass or fail per
    criterion and a quotation per fail (B-5: expected no); **O-4** a fail led to a change in the
    draft, or all criteria passed. The drafts and reports are kept under `evidence/baseline/`.
    **Proven** means every *with* run shows the expected value on O-1 to O-3 and at least one
    *without* run does not. The owner reads the pairs in the acceptance demo.
  - *Planted flaw.* Four fabricated fixtures under `tests/fixtures/readers/`: `offer-planted.md`
    (the scope lists a "data-quality dashboard"; the price table and the exclusions leave it out),
    `offer-clean.md` (its twin with the dashboard priced), `contract-planted.md` (a term table in
    plain words, not clause text: one party may end the contract without cause at five days'
    notice, the other may not) and `contract-clean.md` (both may, at thirty days). `expected.yaml`
    names for each planted file its twin, the owning skill, the criteria and `must_quote`, a
    substring of the planted line. `tests/test_generic_task_profiles.py` checks the fixtures
    deterministically: `must_quote` occurs in the planted file, and the twin differs from it in at
    most three lines. The model runs are by hand: a reader briefed per D-1, with the role and
    attacks of the owning skill, three runs per file on the model D-9 names. **Proven** means the
    criterion is failed and `must_quote` quoted in at least two of three runs on each planted
    file, and failed in at most one of three on each twin. The twin is the theatre check: a reader
    that fails everything proves nothing (DEC-7). Results go to `evidence/planted-flaw.md`.
  - *Ownership.* The same test file scans `skills/` and `agents/` line by line,
    case-insensitively:
    - each of `proposal-writing/SKILL.md`, `contract-practice/SKILL.md`,
      `executive-communication/SKILL.md`, `sales-conversations/SKILL.md` and
      `meaningfy-voice/references/channels/linkedin.md` has a `## Test profile` section holding the
      four labels in order and the string `adversarial-reader.md`;
    - `brief`, pattern `only against the (stated|confirmed) criteria`, and `leaves-the-company`,
      pattern `someone outside Meaningfy`: allowed only in `guardrails/references/adversarial-reader.md`;
    - each role name is allowed only in its owning skill's files and in a table row of
      `test-strategy/references/generic-writing.md`: `sceptical buyer` (`proposal-writing`),
      `opposing counsel` (`contract-practice`), `stranger scrolling` (`meaningfy-voice`),
      `busy recipient` (`executive-communication`, `sales-conversations`);
    - every skill named as technique owner in a `ROB` row of `generic-writing.md` has the section.
      While `generic-writing.md` does not exist the two checks that read it are skipped with a
      message; they run once A is delivered.

    `tests/ownership.yaml` gains `adversarial-reader-brief`, owner `guardrails`,
    `claim_patterns: ["only against the (stated|confirmed) criteria"]`. The test carries its own
    fixture lines: one that passes and one that fails for each pattern.
  - *Agent scenarios.* The scenarios below (§ Scenarios) are added to the three existing feature
    files, each with a `# Traces to:` line naming this change. In `proposal-writer.feature` the
    existing outline *The output depends on what the requirements answer* gains the line "And the
    caller passed the criteria the owner confirmed", so its rows stay true. They are run by hand on
    both CLIs (the files' own header) and the results go to `evidence/agent-scenarios.md`.
- **D-12 Triggers.** Two descriptions change. Static probes in `tests/trigger_probes.yaml`:
  - `guardrails`, positive: "brief a reader subagent to attack this draft against its criteria";
    near-miss, expects `technical-writing`: "have a cold reader test this installation manual";
  - `meaningfy-voice`, positive: "write a LinkedIn post announcing our new SHACL validation
    service"; near-miss, expects `explanatory-writing`: "write a blog-style explanation of how
    SHACL validation works".

  `meaningfy-voice` also gets one behavioural run, because a blog request sits close to
  `explanatory-writing`: a set of 10 positives and 10 near-misses in
  `tests/evals/triggers/meaningfy-voice.json`, run before and after as
  [`tests/evals/README.md`](../../../tests/evals/README.md) says (3 runs per query, its pass bar,
  the owner's approval of the estimate first). The near-misses include A's probe "which checks does
  this LinkedIn post need before I publish it". Results go to `evidence/triggers.md`. The
  descriptions of the other four skills do not change.
- **D-13 Three stages.** Stage 1, the reader: the *without* baseline, the reference, the fixtures,
  the test file and the planted-flaw proof. Stage 2, the profiles: the five skills, the two agents,
  the scenarios, the probes. Stage 3, the rows and the proofs that need everything: the matrix,
  the *with* baseline, the docs and the acceptance demo. The reader is proven before any skill
  relies on it.
- **D-14 Definition of Done items.**
  - the failure case, `evidence/failure-case.md`: the gap line of A's inventory for
    `generic-writing`, and the *without* baseline runs;
  - a baseline run (a discipline rule needs one): D-11;
  - `CHANGELOG.md`: one line for the installer ("an offer, a contract, a post or a client message
    now starts from criteria you confirm and is read by an adversarial reader before it is handed
    to you"), naming the EPIC, as no issue exists;
  - `README.md`: no new row (no new skill; the `meaningfy-core` row already lists both skills);
  - `docs/future-features.md`, the row *Content creation and voice channel profiles*: the LinkedIn
    and blog channels now hold the post profile; their tone is still to write;
  - `skills/meaningfy-voice/SKILL.md`, lines 23–24: LinkedIn and blog are no longer plain
    placeholders;
  - `use-cases/`: `guardrails` is added to the `served_by` of UC-W8, UC-W16 and UC-W24; UC-W15
    stays `missing` (no agent sends internal briefings);
  - `make bundles` (two agents changed), `make skill-inventory` (two descriptions changed);
  - scenario sign-off at the PLAN gate and the acceptance demo (mandatory at LARGE), both recorded
    in `evidence/acceptance.md`.

## Algorithm / approach

**The brief** (the text D-1 puts in the reference; the angle brackets are its inputs):

```text
Goal: read <draft path> as <role> and try to break it, so its author can fix it before
<recipient, one line> reads it.
You know only this brief and the draft.
Criteria (<confirmed by the owner on DATE | stated by the author>):
  Succeeds: <…>
  Fails: <…>
Attack along: <owning skill's path>, section "Test profile", Attacks.
Do not rewrite and do not propose wording.
Report: the base report plus the verifying fields. For each criterion: pass or fail. Every fail
quotes the draft. Anything you notice that matches no criterion goes under Open questions as a
proposed criterion.
```

**Worked example (an offer, attended).**

> **Input:** "Write the proposal email for Example Registry."
> 1. The agent proposes: *Succeeds:* their head of data can tell her director in two minutes what
>    they get in six weeks, for how much, and what is excluded. *Fails:* a deliverable is in scope
>    but not in the price, or priced but out of scope. The owner: "yes, and it must name the stop
>    option". The criteria now have three lines.
> 2. The agent drafts, runs `rulebook check` and the genre self-check as today.
> 3. A fresh sceptical buyer gets the draft's path, the three criteria, the path of
>    `proposal-writing`'s profile and the line "head of data at a public registry; asked for an
>    offer after one call". It reports: criterion 2 **fail**, quoting "a data-quality dashboard"
>    from the scope and the price table that does not list it; the others pass; one open question,
>    "should the offer say who signs?".
> 4. The agent prices the dashboard out or in with `estimation`, has a second fresh reader read the
>    revised draft, gets three passes, and hands the owner the draft, the criteria and the report.
>    The open question goes to the owner as a proposed criterion.

**The same offer through `proposal-writer`.** First dispatch, no criteria in the input: it returns
the two proposed criteria under *Open questions*, each with "recommended: yes", and no draft. The
caller asks the owner, then dispatches again with the confirmed criteria: the agent drafts, starts
the reader, revises, and returns the draft and the last report. If it cannot start a reader, the
report's first recommendation is "unread: run the sceptical-buyer reader" (D-7).

**Pick-up (sales).** Yesterday's close-day run left three follow-up drafts. In a working session
the owner says "let's finish the follow-ups". The agent lists the three with their proposed
criteria in one message; the owner answers "1 yes, 2 yes, 3: no price in it". Three readers run in
parallel, one per draft. Nothing is sent.

### Scenarios

Added to `tests/features/agents/proposal-writer.feature`:

```gherkin
  Scenario: Criteria come back as a question before any draft
    Given the caller asks for a proposal email
    And the requirements leave 0 questions open
    And the caller passed no confirmed criteria
    When the caller dispatches the proposal-writer with the requirements
    Then it returns the proposed success and failure criteria as an open question with a recommended answer
    And it returns no draft

  Scenario: A sceptical buyer reads the draft before it comes back
    Given the caller passed the criteria the owner confirmed
    When the proposal-writer has drafted the proposal
    Then it starts a fresh reader with the sceptical-buyer role, the draft and the criteria only
    And it revises on each failed criterion and has the draft read at most twice
    And it returns the draft with the reader's last report

  Scenario: No reader can be started
    Given the caller passed the criteria the owner confirmed
    And the session does not let the proposal-writer start a subagent
    When the proposal-writer has drafted the proposal
    Then it returns the draft marked unread, with the read as its first recommendation
```

Added to `tests/features/agents/lawyer.feature`:

```gherkin
  Scenario: Opposing counsel reads the draft before it is reported ready
    Given the owner asks to draft a freelance mission contract for `Example Freelancer`
    When the lawyer runs the intake round
    Then he proposes the success and failure criteria in that round and drafts after the owner confirms them
    And before reporting the PR he starts a fresh reader with the opposing-counsel role, the draft and the criteria only
    And each failed criterion becomes an open point or a point for a qualified lawyer, with the reader's quotation
    And he presents the reader's report as a read, not as approval or legal advice
```

Added to `tests/features/agents/sales-agent.feature`:

```gherkin
  Scenario: A draft picked up in a working session gets criteria and a reader
    Given yesterday's close-day run drafted a follow-up to a client
    And the owner opens a working session and asks to finish that follow-up
    When the agent handles the request
    Then it proposes the success and failure criteria and waits for the owner's confirmation
    And it starts a fresh reader with the busy-recipient role, the draft and the criteria only
    And it presents the draft with the reader's report
    And nothing is sent

  Scenario: A scheduled run asks for no confirmation and starts no adversarial reader
    Given the notes of today's meeting arrived
    When the close day runs
    Then the agent drafts the follow-up as before
    And the run note holds no criteria confirmation and no adversarial reader's report
```

**Idempotency.** Every delivery step is a file edit under review; the test is a pure read. A reader
reads and writes nothing, so a read can be repeated; D-6 caps how often. Picking the same draft up
twice proposes the criteria again unless the session's note already holds them confirmed (D-8), in
which case the agent quotes them and asks nothing.

### Re-check once A is delivered

This PLAN was derived from A's design, not from A's files. Task 1.1 checks each line below against
`skills/test-strategy/` as delivered, before any other task, and fixes this PLAN first if one fails.

| # | Assumed from A's design | Used in |
|---|---|---|
| R-1 | The file is `skills/test-strategy/references/generic-writing.md` and its table has the seven columns of A's D-2 | D-10, spec `test-strategy` |
| R-2 | The statuses are `exists`, `gap`, `accepted`; A's `gap` rows for `VAL` and `ROB` name D | D-10: none may still name D afterwards |
| R-3 | Inventory ids are `CHK-<n>`, unpadded; the next free number is read from `inventory.md` | D-10 |
| R-4 | `tests/test_test_strategy.py` fails on an uncited or undefined id and on a family without a row per question | D-10: it must stay green with the new rows |
| R-5 | The stance is named *adversary*; the loop and the definition of a test are in `test-strategy`'s SKILL.md, under headings that can be cited | D-1 § 2, D-10 |
| R-6 | Which of the five skills and `guardrails` already carry A's pointer line (D-8), and its exact wording | D-10 |
| R-7 | The Quick Start quotes "`VAL` → … (`gap` → D)" | D-10: the one line of SKILL.md that may change |
| R-8 | `sales-operations`' `recipient-reader` is in the inventory as a `CLR` check of `generic-writing` | D-4: its row stays as A wrote it |
| R-9 | The probe "which checks does this LinkedIn post need before I publish it" expects `test-strategy` | D-12: a near-miss in the behavioural set |
| R-10 | A added `criteria` to the phases of `contract.workflow.json` and the sales workflow file; this change edits neither | Non-Goals: read them, and report a line that contradicts a profile as a finding for A's owner |

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Copy the brief, or "when it is mandatory", into an owning skill | The fixed section of D-2 and a pointer | One home (DEC-5, Q-12); the ownership test fails otherwise |
| A criterion such as "the offer is convincing" | Name the reader and what they do or decide | It cannot fail (Rabbit-holes) |
| Give the reader the dossier, the thread or the author's reasoning | The draft, the criteria, the role, one recipient line | An anchored reader confirms the author (`guardrails`, *Fresh, not a copy*) |
| Let the reader return a new draft or better wording | It reports; the author revises | Rabbit-holes: a reader that rewrites has left its brief |
| Mark a finding outside the criteria as a fail | A proposed criterion, for the owner | A test is a criterion agreed before the work (A's DEC-3) |
| Score the baseline or the reader's report | Yes or no observations, and the kept drafts | No-gos: no rubric, no pass mark |
| Present "all criteria passed" as approval of a contract | A read, done; the lawyer-review list and the owner's approval remain | No-gos: no legal advice |
| Add the two steps to a scheduled run, or edit `recipient-reader` | The steps run at pick-up | DEC-4; No-gos |
| Put clause text or a real name in a fixture | A fabricated term table in plain words | `legal-contract-practice`: no contract material in skillery |
| Write a technique or a role into `test-strategy` | Rows that name the owning skill | A's DEC-5, DEC-8; No-gos |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| A's delivered files differ from A's design | Task 1.1, the R-1..R-10 table | Fix this PLAN before any other task; a change that touches a DEC goes to the owner |
| An owning skill lacks the section, a label, or the pointer | `tests/test_generic_task_profiles.py` | Complete the section |
| The brief or the "leaves the company" rule is restated outside the reference | The same test; `ownership.yaml`'s advisory flag | Replace the text with a pointer |
| A role name appears in another skill or in `test-strategy` prose | The same test | Move it to its owner, or into the row |
| The reader misses the planted flaw in 2 of 3 runs | `evidence/planted-flaw.md` | Sharpen the brief or the skill's *Attacks*; run all twelve runs again; never edit the fixture to fit |
| The reader fails the clean twin in 2 of 3 runs | `evidence/planted-flaw.md` | The reader is theatre: tighten "pass or fail per criterion, a quotation per fail"; run again |
| The *without* runs already show O-1 to O-3 everywhere | `evidence/baseline.md` | The profile adds nothing there: stop and bring it to the owner before stage 2 |
| A *with* run misses O-1, O-2 or O-3 | `evidence/baseline.md` | Fix the owning skill's step line (D-3); run that task again |
| The owner does not answer the confirmation | The agent is waiting | It does not draft a piece that leaves the company; a delegated agent returns the question |
| The owner corrects the criteria after the draft exists | The owner's message | The corrected criteria replace the old ones; the draft is revised and read against them; the read count starts again |
| A criterion still fails after the second read | The second report | The draft, the criterion and the quotation go to the owner; no third read (D-6) |
| The reader returns a rewrite, or a fail without a quotation | The author reads the report | Discard that part; dispatch a fresh reader once; it counts as the same read |
| No subagent can be started (tool absent, or no nested dispatch) | The tool call is refused or missing | *Unread*, said first; never "ready to send" (D-7) |
| The draft exists only in the mail system | The agent has no path to give | Paste it if under 200 words (D-9); otherwise save it to a scratch file first |
| A piece is internal, then is to be sent outside | The "leaves the company" test at hand-over | Confirm the criteria and run the reader then |
| The owner sends a scheduled draft straight from the mail client | Not detected | Accepted (RISK-3) |
| An agent body passes 40 lines, or frontmatter is invalid | `make validate` (agent lint) | Shorten the added lines; D-5 names them |
| `bundles/` is stale after the agent edits | `bundle_gates` | `make bundles`, commit the result |
| `meaningfy-voice` fires on an explainer request, or not on a post | The static probes; the behavioural run | Sharpen the description; run the set again; record both in `evidence/triggers.md` |
| A scenario's shape is wrong | The agent-feature lint in `make validate` | Fix the feature file |
| A scenario fails when run by hand on one CLI | `evidence/agent-scenarios.md` | Fix the skill or agent line; if the CLI cannot do it (nested dispatch), record the *unread* path as the observed result |

## Risks / Trade-offs

- **RISK-1** A delegated agent that itself runs as a subagent may not be allowed to start another
  subagent on one or both CLIs, so the grant of DEC-9 has no effect there. Likelihood medium,
  impact medium. Mitigation: D-7 (*unread*), its scenario, and task 2.7, which runs it on both
  CLIs and records what each allows.
- **RISK-2** With `Agent`, the sales agent can start `sales-operations`' three reviewers on
  scheduled runs, where it may have recorded "unverified" until now: more tokens per run, and
  findings the owner has not seen before. Likelihood high, impact low. Accepted with the owner's
  answer to Q-11; the CHANGELOG line says so, and the first week's run notes are read at the
  acceptance demo.
- **RISK-3** The owner sends a draft from a scheduled run straight from the mail client, so it
  leaves unread. Likelihood medium, impact medium. Accepted: the profile binds agents, not the
  owner, and marking such drafts would change scheduled runs (DEC-4). The acceptance demo shows the
  pick-up path so that it is the easy one.
- **RISK-4** Confirming criteria becomes a reflex "yes". Likelihood medium, impact medium.
  Mitigation: one or two lines, one message for a batch, and a form that can fail; the baseline's
  kept drafts show the owner what a confirmed criterion bought.
- **RISK-5** The reader is theatre. Mitigation: quotations, the clean twins, the baseline (DEC-7).
- **RISK-6** The new trigger of `meaningfy-voice` collides with `explanatory-writing`. Likelihood
  medium, impact low. Mitigation: D-12's behavioural run, before and after.
- **RISK-7** A is delivered differently from its design. Likelihood medium, impact low.
  Mitigation: the re-check table and task 1.1.
- **RISK-8** Client-confidential text passes through reader subagents. Accepted in DEC-7; D-9
  keeps the reader's inputs to the draft and one line.
- **RISK-9** The reader is a model: one run can miss. Mitigation: three runs and a 2-of-3 bar in the
  proof; in daily use the owner still reads the piece before sending.
- **Trade-off:** the reference in `guardrails` holds rules about content work (criteria, owners),
  in a skill about agent behaviour. Chosen by the owner (Q-9, Q-12) for one home beside the brief
  rules; `test-strategy` stays rows only.

## Open Questions

None blocking. One default the owner may overrule: the contract fixtures are fabricated term
tables in plain words (D-11), which this PLAN reads as allowed by `legal-contract-practice`'s "no
clause text". If they are not, the contract half of the planted-flaw proof runs in the contract
repository and skillery records only its result.
