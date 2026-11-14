<!-- PLAN (design half), derived 2026-11-14 from proposal.md and from A's gated design, before A's
     delivery. Attacked the same day by a fresh subagent (AT-1..AT-21, all folded in, see § Attack
     record). Not yet gated. -->

> Derives from: EPIC `generic-task-test-profiles` ([`proposal.md`](proposal.md)), DEC-1..DEC-10.
> Depends on: EPIC A `test-strategy`, its gated [`design.md`](../test-strategy/design.md) (D-1, D-2,
> D-3, D-8). Delivery starts after A is delivered (proposal, *Impact*).

## Context

Four kinds of piece are written today with no criterion stated first and no reader who tries to
break them (A's inventory draft, `generic-writing`: "no ROB; VAL is only sales"). What exists:

- **`guardrails`** § 5 *Subagent dispatch* ([SKILL.md](../../../skills/guardrails/SKILL.md), lines
  69–109) owns the brief rules and the base report
  ([`references/subagent-reports.md`](../../../skills/guardrails/references/subagent-reports.md)); the
  *verifying* purpose already adds "the criteria checked; pass or fail per criterion; the gaps".
  Its description is 681 characters, over the advisory target of 600.
- **The five owning skills** hold method and no profile:
  [`proposal-writing`](../../../skills/proposal-writing/SKILL.md) (111 lines, *Flow* steps 1–4),
  [`contract-practice`](../../../skills/contract-practice/SKILL.md) (161 lines, phases intake to
  harvest), [`executive-communication`](../../../skills/executive-communication/SKILL.md) (253
  lines, *Start here: diagnose before you structure*),
  [`sales-conversations`](../../../skills/sales-conversations/SKILL.md) (120 lines, an *Acceptance
  criteria* table per work item) and
  [`meaningfy-voice`](../../../skills/meaningfy-voice/SKILL.md) (34 lines; its
  `references/channels/linkedin.md` and `blog.md` are three-line placeholders).
- **A reader exists for sales drafts already:** `sales-operations` tells every run to start three
  reviewers, one of them the
  [`recipient-reader`](../../../skills/sales-operations/assets/prompts/recipient-reader.md), which
  answers ten fixed questions as the recipient (`CLR`), is given no criteria and does not attack.
  The sales agent has no `Agent` tool today, so where it cannot start them the run is recorded
  *unverified* (`sales-operations`, *Independent reviewers*; `references/goal-loop.md`, lines 68–70).
- **The three agents.** `lawyer` is a lead with `Agent` and `guardrails`. `proposal-writer` is
  `delegated` (it cannot ask mid-run; questions go back in its output) with
  `tools: [Read, Grep, Glob, Write, Skill]`. `sales-agent` is `scheduled` and may lead a human
  session. Their scenarios are in `tests/features/agents/`, run by hand per CLI; the lint
  (`tools/repo_lint/lint.py`, `_agent_feature_errors`) requires each feature's Background to name
  every skill of the agent's `skills:` list in backticks.
- **Lint rules this change meets:** a skill may not link by path into another skill
  (`cross_skill_paths`), so a pointer to `guardrails` is plain text; an agent body holds at most 40
  lines (22 and 26 today for the two agents that change).
- **A's side.** `skills/test-strategy/` does not exist yet. A's design fixes what this PLAN builds
  on: the row columns (D-2), the question ids `VAL` and `ROB` and the adversary stance (D-3), the
  inventory ids `CHK-<n>` and their test (D-1, D-7), and the pointer line (D-8).
- `openspec/specs/legal-contract-practice` forbids clause text, templates and real names in
  `contract-practice`, the `lawyer` agent and their tests. `openspec/specs/subagent-dispatch`
  requires a brief's inputs as paths and the subagent's model to be the agent's or the caller's.

## Goals / Non-Goals

**Goals:** the reader's brief and the shared rules, once (DEC-5, Q-12); a profile in each of the
five skills (DEC-1, DEC-2); the two agents able to start a reader (DEC-9, DEC-10); the
`generic-writing` rows; the four proofs of DEC-6; the post capability and its trigger (DEC-8,
Q-13); the Definition of Done of a discipline rule (`docs/development/README.md` §9).

**Non-Goals:** the proposal's No-gos. In particular: no score or pass mark; no new agent; no
criteria step and no adversarial reader on a scheduled run; no edit to `sales-operations`, its
reviewer prompts, `explanatory-writing` or any workflow file; no tone profile for LinkedIn or blog
(`add-content-creation`).

## Decisions

New choices made while planning; settled ones are cited.

- **D-1 One reference holds the brief and the shared rules** (Q-12).
  `skills/guardrails/references/adversarial-reader.md`, with these sections:
  1. *When it applies*: the test, worded "Will someone outside Meaningfy read it?"; a draft for
     internal review does not count until it is about to be sent.
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
  7. *The loop's end*: at most two reads, and what the agent may not revise (D-6).
  8. *No reader*: the piece is *unread* (D-7).

  `guardrails`' SKILL.md gains one bullet in § 5, "**An adversarial reader for what leaves the
  company.**", two lines, naming the reference. Its description names the reader inside the
  existing dispatch parenthesis ("the second check, the adversarial reader", 24 characters more)
  and adds the trigger "have a reader attack this draft" (35 more). To pay for them it drops two
  triggers that no probe uses and that other triggers cover: "is this agent step safe" and "keep
  the context small" (53 fewer). It ends at 687 characters, six more than today; the lint's advisory target of 600 is already
  exceeded and its hard limit is 1024. The reference names no
  role: the role is an input of the brief.
- **D-2 A profile is one section of fixed shape in its owning skill.** Heading `## Test profile`,
  then one pointer sentence in plain text, with no link (the lint forbids a path into another
  skill): "The steps, and when they apply, are in `guardrails`
  (`references/adversarial-reader.md`)." Then four bold labels in this order: **Succeeds**,
  **Fails**, **Reader**, **Attacks**. *Succeeds* and *Fails* are example criteria in the form the
  rabbit-hole demands: each names the reader and what they do or decide. *Attacks* has three to
  five bullets. The section states no "when mandatory", no report format and no brief; those are
  D-1's. The skill's own flow gains one line per step, at the place D-3 names, each citing the
  section. `meaningfy-voice` has no flow, so its section, in `references/channels/linkedin.md`,
  ends with two step lines of its own: "Before drafting: propose the criteria; the owner
  confirms." and "Before hand-over: the reader reads the draft." Both cite `guardrails` for the
  rules and add no writing method. `blog.md` names that section in plain text and adds its
  differences (the reader sees the title and the first paragraph, in a search result or a feed).
- **D-3 Content and placement per skill.**

  | Skill | Reader | Attacks (the bullets) | Criteria step goes | Reader step goes |
  |---|---|---|---|---|
  | `proposal-writing` | a sceptical buyer who must defend the spend | scope and price that name different deliverables; a claim with no evidence; what is excluded left unsaid; no way to stop or extend; a reason to wait | *Flow* step 1, last sentence | a new step 5, *Have it read* |
  | `contract-practice` | opposing counsel | a right or risk given to one side only; a term that reads two ways; an undefined term; a gap against the parent or back-to-back contract; a missing cap or exit | *Intake interview*, a fifth bullet | *The contract workflow* table, row *review*, and one sentence under *Lawyer-review flag* |
  | `meaningfy-voice` (`linkedin.md`) | a stranger scrolling | the first two lines do not say what this is or why to care; it reads as an advert; jargon unexplained; a claim that names no real work; no next step | the section's first step line (D-2) | the section's second step line (D-2) |
  | `executive-communication` | a busy recipient | the ask not found in ten seconds; no decision or deadline; an answer that needs another document; a claim they would doubt; heavier than the artefact deserves | *Start here*, after the three questions | a new closing line of *Start here* |
  | `sales-conversations` | a busy recipient | the ask unclear or hard to say yes to; whose turn got wrong; a commitment nobody approved; a line any vendor could send; not readable on a phone in 20 seconds | a new subsection *At pick-up: criteria and a reader*, under *Workflow* | the same subsection |

  Example criteria (offer): *Succeeds:* the budget holder can say in two minutes what they get,
  what it costs and what is excluded, and has no question left before signing. *Fails:* a
  deliverable is in scope but not in the price, or priced but out of scope.
  `sales-conversations` proposes a piece's criteria from the matching row of its *Acceptance
  criteria* table plus what is specific to the thread; the table itself is unchanged.

  **Which profile, when two could apply:** a piece that states scope or price is an offer and takes
  `proposal-writing`'s profile, whatever its form (a proposal email included). A cover message
  that states neither takes `executive-communication`'s. A sales email or follow-up in a deal's
  thread takes `sales-conversations`'. One piece gets one profile and one reader. The rule is
  written in D-1's reference, section 1, since it is shared.
- **D-4 The existing `recipient-reader` stays as it is.** It answers `CLR`; the busy-recipient
  adversarial reader answers `ROB` at pick-up, against confirmed criteria. Rejected: turning
  `recipient-reader` into the adversarial reader, which would add the profile to scheduled runs and
  change a sixth skill (No-gos).
- **D-5 The two agent files** (DEC-9, DEC-10). Both gain `Agent` in `tools`, `guardrails` in
  `skills` and its line under `## Skills` ("the adversarial-reader subagent and the base report").
  `Agent` stays unscoped (`docs/development/agent-template.md`, *Leads delegate*). The Background
  of each agent's feature file gains `guardrails` in its skill list, which the lint requires.
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

  Both bodies stay under the 40-line cap. **A known effect, accepted by the owner (Q-14, DEC-10):**
  with the tool, a scheduled run can start `sales-operations`' three reviewers, which that skill
  already tells it to do, so runs recorded *unverified* until now become verified. No instruction
  of a scheduled run changes, and a scheduled run still gets no criteria step and no adversarial
  reader (RISK-2).
- **D-6 Two reads at most, and the author revises only what is theirs.** A failed criterion sends
  the work back to the draft. A fresh reader then reads the revised draft against all criteria.
  Whatever still fails after that second read goes to the owner with the draft and the quotations;
  the owner decides (send, revise, drop). Where the owning skill reserves a change to the owner,
  the agent does not revise it: for a contract, a number or a term that changes what a party can
  claim or must do (`contract-practice`, *Alignment*, *Counterparty changes*). A fail on such a
  point is recorded as an open point or a lawyer point with the reader's quotation; that counts as
  handled, and the second read checks only what the agent did revise. Rejected: reading until
  everything passes, which has no end and slows daily work (DEC-7).
- **D-7 *Unread*.** When the agent cannot start a subagent (the tool is absent or withheld), the
  piece is marked *unread*: said first in the hand-over or the report, under *Recommendations* for
  a delegated agent. An unread piece is never called ready to send; the session that receives it
  runs the reader (RISK-1).
- **D-8 Where criteria and reports are kept.** Never inside the piece. With the piece's work: the
  agent's report (authoring fields) for an offer; the place the contract repository's instructions
  name for open points, for a contract; the session's run note for a sales draft; the conversation
  for a post or a message. A confirmed criterion is quoted with its date.
- **D-9 The reader's inputs and model.** The brief gives the draft as a path; a piece that exists
  only as a mail draft is first saved to a scratch file, so the live rule "inputs as paths" holds
  without exception. The reader knows the brief, the draft and the *Attacks* list at the path the
  brief names, and nothing else. The recipient line is one sentence (role, relationship, what they
  last asked); no dossier, no thread. The reader is a fresh general-purpose subagent (No-gos: no
  new agent) on the caller's model, as the live `subagent-dispatch` requirement says; this change
  adds no model rule.
- **D-10 Matrix rows and checks** (A's D-1, D-2). `inventory.md` gains five checks, one per
  profile, numbered from the next free id at delivery; the brief is the tool of those checks, not
  a check of its own. `generic-writing.md` gains or updates ten rows, a `VAL` and a `ROB` row for
  each of the five profiles (offer, contract, post, message, sales message):

  | Question | Check | Technique owner | Tool | Moment | Decided by | Status |
  |---|---|---|---|---|---|---|
  | `VAL` | the profile's `CHK-<n>` | the owning skill | none | see below | the owner | `exists` |
  | `ROB` | the same `CHK-<n>` | the owning skill | a fresh subagent, briefed per `guardrails` (`references/adversarial-reader.md`) | see below | the adversary stance; the owner after the second read | `exists` |

  *Moment* takes A's form, a workflow and phase or "any": for a contract, `contract`, phase
  `intake` (`VAL`) and phase `review` (`ROB`); for an offer, the sales workflow of
  `sales-operations`, phase `offer`; for a post, a message and a sales message, "any". When inside
  that moment the step runs (before drafting, before hand-over, at pick-up) is the owning skill's
  and the reference's to say, not the row's. No row names a role: roles stay in the owning skills. The internal-message case is the same
  `VAL` row of `executive-communication`: the owner decides by correcting or not. Each of the five
  skills, and `guardrails`, carries A's pointer line with `VAL`, `ROB` added. In `test-strategy`'s
  SKILL.md only a status quoted from a changed row may change (the Quick Start's "`gap` → D");
  nothing else (No-gos).
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

    Each run is one `claude -p` call on `sonnet`, started in an empty scratch directory with an
    isolated configuration directory and a temporary plugin assembled from the repository at one
    commit, as [`tests/evals/README.md`](../../../tests/evals/README.md) describes (section
    *Trigger sets*, paragraph "Isolate the run"; section *Outcome suites*, paragraph "Locally"),
    so that no installed copy of a skill answers. A run sees no repository file: B-2's prompt
    carries the term table inline, copied from the fixture. The prompt is the task plus one
    sentence: "where a skill tells you to ask the owner, write the question, take
    the answer as yes and go on". The *without* runs use the base commit; the *with* runs the head
    of stage 2. The owner approves the estimate of the ten runs first, as that README requires.
    `evidence/baseline.md` records the commit of each run and five observations, yes or no, never
    a score:
    - **O-1** success and failure were stated before the first line of the draft;
    - **O-2** the run wrote a confirmation question to the owner (not applicable to B-5);
    - **O-3** a reader's report exists with pass or fail per criterion and a quotation per fail
      (B-5: expected no);
    - **O-4** a fail led to a change in the draft, or all criteria passed;
    - **O-5**, judged by the owner on the kept pair at the acceptance demo: the *with* run's reader
      failed something that the *without* draft still contains.

    The drafts and reports are kept under `evidence/baseline/`, except B-2's: a contract response
    may read as clause text, which skillery does not hold, so B-2's drafts stay in the session's
    scratch directory for the demo and the evidence keeps only its observations and the reader's
    pass or fail lines. B-2's prompt says "there is no contract repository; work from the table
    in this prompt". If a B-2 run still stops for lack of one, the stop is its result: O-1 to O-4
    are recorded as no, and B-2 is left out of the bar. **Proven** means every *with* run shows
    the expected value on O-1 to O-3, O-4 is yes for the *with* runs of B-1 to B-4, and O-5 is yes
    for at least two of B-1 to B-4. O-1 to O-4 show that the steps happen; only O-5 shows that
    they changed the piece (RISK-10).
  - *Planted flaw.* Six fabricated fixtures under `tests/fixtures/readers/`:

    | File | What is planted |
    |---|---|
    | `offer-planted.md` | the scope lists a "data-quality dashboard"; the price table and the exclusions leave it out (DEC-6) |
    | `offer-planted-2.md` | the offer is "valid until 30 June" in one place and "valid for 14 days" in another; no bullet of *Attacks* names this kind of flaw |
    | `offer-clean.md` | the twin of both: the dashboard priced, one validity date |
    | `contract-planted.md` | a term table in plain words, not clause text: one party may end the contract without cause at five days' notice, the other may not (DEC-6) |
    | `contract-clean.md` | its twin: both may, at thirty days |
    | `expected.yaml` | for each planted file: its twin, the owning skill, the criteria as an owner would confirm them, and `must_quote`, a substring of the planted line |

    `tests/test_generic_task_profiles.py` checks the fixtures deterministically: `must_quote`
    occurs in the planted file and not in its twin, and the twin differs from it in at most three
    lines. The model runs are by hand: a reader briefed per D-1 with the role and *Attacks* of the
    owning skill, three runs per file, fifteen in all. `offer-clean.md` is read with the criteria
    of both offer fixtures together, and each of the two planted criteria is counted on its own.
    **Proven** means, on each planted file, the criterion is failed and `must_quote` quoted in at
    least two of three runs; and on each twin, each planted criterion is failed in at most one of
    three. In stage 1 the role and the *Attacks* bullets of D-3 are written into the brief; the
    sections written in stage 2 hold those bullets word for word, and the fifteen runs are
    repeated once at the end of stage 2 with the brief's "Attack along" line naming the skill's
    file, to the same bar. The twins are the theatre check: a reader
    that fails everything proves nothing (DEC-7). `offer-planted-2.md` checks that the reader
    finds what the criteria cover even where the attack list does not point at it. On a miss the
    brief or the skill's *Attacks* may be sharpened and all fifteen runs repeated, at most twice;
    a third miss goes to the owner. Every round, the change made and the counts go to
    `evidence/planted-flaw.md`; a fixture is never edited to fit.
  - *Ownership.* The same test file scans every file under `skills/` and `agents/`,
    case-insensitively, on the file's text with each run of whitespace, line breaks included,
    turned into one space, so a pattern wrapped over two lines is still found; a failure names the
    file. Each assertion is written in the stage that makes it true, red before that
    stage's edits and green before its PR (D-13):
    - **stage 1:** the patterns `do not rewrite and do not propose wording`, `every fail quotes
      the draft` and `will someone outside Meaningfy read it` each occur in
      `guardrails/references/adversarial-reader.md` and in no other file. They are lines of the
      brief and of the test themselves, so a copy of either is caught. (Checked 2026-11-14: none
      occurs in the repository today.)
    - **stage 2:** each of `proposal-writing/SKILL.md`, `contract-practice/SKILL.md`,
      `executive-communication/SKILL.md`, `sales-conversations/SKILL.md` and
      `meaningfy-voice/references/channels/linkedin.md` has a `## Test profile` section holding
      the four labels in order and the string `adversarial-reader.md`. Each role name, with a
      space or a hyphen between its words, occurs only in its owning skill's files:
      `sceptical[\s-]buyer` (`proposal-writing`), `opposing[\s-]counsel` (`contract-practice`),
      `stranger[\s-]scrolling` (`meaningfy-voice`), `busy[\s-]recipient`
      (`executive-communication`, `sales-conversations`).
    - **stage 3:** `test-strategy/references/generic-writing.md` exists (a missing file fails; A
      is delivered by then), every skill it names as technique owner of a `ROB` row has the
      section, and each of the five owning skills is named in a `VAL` and a `ROB` row with status
      `exists`.

    The test carries its own fixture lines: one that passes and one that fails for each pattern,
    the hyphen form of a role included. `tests/ownership.yaml` gains `adversarial-reader-brief`,
    owner `guardrails`, `claim_patterns: ["do not rewrite and do not propose wording"]`; its
    tripwire is advisory and reads SKILL.md only, so the test above is the guard.
  - *Agent scenarios.* The scenarios below (§ Scenarios) are added to the three existing feature
    files, each with a `# Traces to:` line naming this change. In `proposal-writer.feature` the
    existing outline *The output depends on what the requirements answer* gains the line "And the
    caller passed the criteria the owner confirmed", so its rows stay true. They are run by hand
    on both CLIs (the files' own header) and the results go to `evidence/agent-scenarios.md`. The
    *No reader can be started* path is forced on Claude Code by starting the session with
    `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1`; on opencode the run records what the CLI allows
    (RISK-1).
- **D-12 Triggers.** Two descriptions change. Static probes in `tests/trigger_probes.yaml`:
  - `guardrails`, positive: "brief a reader subagent to attack this draft against its criteria";
    near-miss, expects `technical-writing`: "have a cold reader test this installation manual";
  - `meaningfy-voice`, positive: "write a LinkedIn post announcing our new SHACL validation
    service"; near-miss, expects `explanatory-writing`: "write a blog-style explanation of how
    SHACL validation works".

  Both descriptions, before and after, are kept in `evidence/probes.md`. `meaningfy-voice` also
  gets one behavioural run, because a blog request sits close to `explanatory-writing`: a set of
  10 positives and 10 near-misses in `tests/evals/triggers/meaningfy-voice.json`, run before and
  after as `tests/evals/README.md` says (3 runs per query, its pass bar, the owner's approval of
  the estimate first). The near-misses aim at `explanatory-writing`, `executive-communication`
  and `technical-writing`. A request about the checks of a post ("which checks does this LinkedIn
  post need before I publish it", A's probe for `test-strategy`) is in neither half: both skills
  may rightly load. The result is recorded where that README says,
  `inputs/evidence/triggers-meaningfy-voice.md`, with its ten-column header. The descriptions of
  the other four skills do not change.
- **D-13 Three stages, each green on its own.** Stage 1, the reader: the *without* baseline, the
  reference, the fixtures, the stage-1 assertions and the planted-flaw proof. Stage 2, the
  profiles: the five skills, the two agents, the scenarios, the probes, the stage-2 assertions.
  Stage 3: the matrix and its assertions, the *with* baseline, the docs and the acceptance demo.
  The reader is proven before any skill relies on it, and `make validate` is green at the end of
  every stage.
- **D-14 Definition of Done items.**
  - the failure case, `evidence/failure-case.md`: the gap line of A's inventory for
    `generic-writing`, and the *without* baseline runs;
  - a baseline run (a discipline rule needs one): D-11;
  - `CHANGELOG.md`: two lines for the installer, naming the EPIC as no issue exists: "an offer, a
    contract, a post or a client message now starts from criteria you confirm and is read by an
    adversarial reader before it is handed to you"; and "the sales agent can now start its
    reviewers on scheduled runs, so run notes that said *unverified* carry their findings";
  - `README.md`: no new row (no new skill; the `meaningfy-core` row already lists both skills);
  - `docs/future-features.md`, the row *Content creation and voice channel profiles*: the LinkedIn
    and blog channels now hold the post profile; their tone is still to write;
  - `skills/meaningfy-voice/SKILL.md`, lines 23–24: LinkedIn and blog are no longer plain
    placeholders;
  - `use-cases/`: `guardrails` is added under `served_by.skills` of UC-W7, UC-W8, UC-W16 and
    UC-W24;
    UC-W15 stays `missing` (no agent sends internal briefings);
  - `make bundles` (two agents changed), `make skill-inventory` (two descriptions changed);
  - scenario sign-off at the PLAN gate and the acceptance demo (mandatory at LARGE), both recorded
    in `evidence/acceptance.md`;
  - the fresh install on both CLIs is the release's check, not this change's.

## Algorithm / approach

**The brief** (the text D-1 puts in the reference; the angle brackets are its inputs):

```text
Goal: read <draft path> as <role> and try to break it, so its author can fix it before
<recipient, one line> reads it.
You know only this brief, the draft, and the Attacks list named below.
Criteria (<confirmed by the owner on DATE | stated by the author>):
  Succeeds: <…>
  Fails: <…>
Attack along: <owning skill's file>, section "Test profile", Attacks.
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
the reader, revises, and returns the draft and the last report. A third dispatch with corrected
criteria revises the existing draft against them and starts the read count again. If it cannot
start a reader, the report's first recommendation is "unread: run the sceptical-buyer reader"
(D-7).

**A contract.** The opposing-counsel reader fails the criterion "no right is given to one side
only" and quotes the termination term. Tolic does not change the term (D-6): he records the open
point with the quotation, fixes an undefined term the reader also failed, and has the draft read
once more for that second point only.

**Pick-up (sales).** Yesterday's close-day run left three follow-up drafts. In a working session
the owner says "let's finish the follow-ups". The agent lists the three with their proposed
criteria in one message; the owner answers "1 yes, 2 yes, 3: no price in it". Each draft is saved
to a scratch file and three readers run in parallel, one per draft. Nothing is sent.

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
    And each failed criterion on a number or a term becomes an open point or a point for a qualified lawyer, with the reader's quotation, and he changes neither
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
    Then the agent drafts the follow-up
    And the run note holds no criteria confirmation and no adversarial reader's report
    And its Verification holds the output of the reviewers of `sales-operations`, or "unverified"
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
| R-1 | The file is `skills/test-strategy/references/generic-writing.md` and its table has the seven columns of A's D-2 | D-10, D-11 (stage 3), spec `test-strategy` |
| R-2 | The statuses are `exists`, `gap`, `accepted`; A's `gap` rows for `VAL` and `ROB` name D | D-10: none may still name D afterwards |
| R-3 | Inventory ids are `CHK-<n>`, unpadded; the next free number is read from `inventory.md` | D-10 |
| R-4 | `tests/test_test_strategy.py` fails on an uncited or undefined id and on a family without a row per question | D-10: it must stay green with the new rows |
| R-5 | The stance is named *adversary*; the loop and the definition of a test are in `test-strategy`'s SKILL.md, under headings that can be cited | D-1 § 2, D-10 |
| R-6 | Which of the five skills and `guardrails` already carry A's pointer line (D-8), and its exact wording | D-10 |
| R-7 | The Quick Start quotes "`VAL` → … (`gap` → D)" | D-10: the one line of SKILL.md that may change |
| R-8 | `sales-operations`' `recipient-reader` is in the inventory as a `CLR` check of `generic-writing` | D-4: its row stays as A wrote it |
| R-9 | The probe "which checks does this LinkedIn post need before I publish it" expects `test-strategy` | D-12: kept out of the behavioural set |
| R-10 | A added `criteria` to the phases of `contract.workflow.json` and the sales workflow file; this change edits neither | Non-Goals: read them, and report a line that contradicts a profile as a finding for A's owner |
| R-11 | The *Check* column holds one `CHK-<n>` per row, and two rows may cite the same id | D-10: a profile's `VAL` and `ROB` rows share its id |

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Copy the brief, or "when it is mandatory", into an owning skill | The fixed section of D-2 and a plain-text pointer | One home (DEC-5, Q-12); the ownership test fails otherwise |
| Link from a skill to `guardrails`' reference by path | Name the skill and the file in backticks | `cross_skill_paths` fails the lint |
| A criterion such as "the offer is convincing" | Name the reader and what they do or decide | It cannot fail (Rabbit-holes) |
| Give the reader the dossier, the thread or the author's reasoning | The draft, the criteria, the role, one recipient line | An anchored reader confirms the author (`guardrails`, *Fresh, not a copy*) |
| Let the reader return a new draft or better wording | It reports; the author revises | Rabbit-holes: a reader that rewrites has left its brief |
| Mark a finding outside the criteria as a fail | A proposed criterion, for the owner | A test is a criterion agreed before the work (A's DEC-3) |
| Change a contract's number or term because the reader failed it | An open point with the quotation | `contract-practice`: which one is right is the owner's decision |
| Score the baseline or the reader's report | Yes or no observations, and the kept drafts | No-gos: no rubric, no pass mark |
| Present "all criteria passed" as approval of a contract | A read, done; the lawyer-review list and the owner's approval remain | No-gos: no legal advice |
| Add the two steps to a scheduled run, or edit `recipient-reader` | The steps run at pick-up | DEC-4, DEC-10; No-gos |
| Put clause text or a real name in a fixture | A fabricated term table in plain words | `legal-contract-practice`: no contract material in skillery |
| Write a technique or a role into `test-strategy` | Rows that name the owning skill | A's DEC-5, DEC-8; No-gos |
| Run a baseline in a session where the catalogue is installed | An isolated configuration directory and a plugin built from one commit | An installed copy of a skill would answer |
| Edit a fixture, or rerun without limit, until the reader passes | Sharpen the brief or *Attacks*; two reruns at most | A proof that cannot fail proves nothing |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| A's delivered files differ from A's design | Task 1.1, the R-1..R-11 table | Fix this PLAN before any other task; a change that touches a DEC goes to the owner |
| An owning skill lacks the section, a label, or the pointer | `tests/test_generic_task_profiles.py` (stage 2) | Complete the section |
| A line of the brief or the "leaves the company" test is copied outside the reference, or missing from it | The same test (stage 1) | Replace the copy with a pointer; restore the line |
| A role name appears in another skill, in an agent file or in `test-strategy` | The same test (stage 2) | Move it to its owner |
| `generic-writing.md` is missing or renamed at stage 3 | The same test fails (stage 3) | Task 1.1 should have caught it: fix R-1 and the test's path |
| The reader misses a planted flaw in 2 of 3 runs | `evidence/planted-flaw.md` | Sharpen the brief or the skill's *Attacks*; run all fifteen again, twice at most; then the owner |
| The reader fails a clean twin in 2 of 3 runs | `evidence/planted-flaw.md` | The reader is theatre: tighten the brief's report lines; run again within the same limit |
| A B-2 run stops because there is no contract repository | The run's output | The stop is recorded as its result; B-2 is left out of the bar (D-11) |
| A *with* run misses O-1, O-2, O-3 or O-4 | `evidence/baseline.md` | Fix the owning skill's step line (D-3); run that task again |
| O-5 is yes for fewer than two pairs | The acceptance demo | The profile did not change the pieces: the owner decides whether to ship, sharpen or drop a profile |
| The owner does not answer the confirmation | The agent is waiting | It does not draft a piece that leaves the company; a delegated agent returns the question |
| The owner corrects the criteria after the draft exists | The owner's message | The corrected criteria replace the old ones; the draft is revised and read against them; the read count starts again |
| A criterion still fails after the second read | The second report | The draft, the criterion and the quotation go to the owner; no third read (D-6) |
| The reader fails a contract's number or term | The report | An open point or a lawyer point; the agent changes neither (D-6) |
| The reader returns a rewrite, or a fail without a quotation | The author reads the report | Discard that part; dispatch a fresh reader once; it counts as the same read |
| No subagent can be started (tool absent, or withheld at the CLI's depth limit) | The tool is missing or the call is refused | *Unread*, said first; never "ready to send" (D-7) |
| The draft exists only in the mail system | The agent has no path to give | Save it to a scratch file first (D-9) |
| A piece is internal, then is to be sent outside | The "leaves the company" test at hand-over | Confirm the criteria and run the reader then |
| Two profiles could apply to one piece | The piece states scope or price, or it does not | The rule of D-3: one profile, one reader |
| The owner sends a scheduled draft straight from the mail client | Not detected | Accepted (RISK-3) |
| An agent body passes 40 lines, or frontmatter is invalid | `make validate` (agent lint) | Shorten the added lines; D-5 names them |
| A feature's Background does not name `guardrails` after the agent gained it | `make validate` (agent-feature lint) | Add it to the Background (D-5) |
| `bundles/` is stale after the agent edits | `bundle_gates` | `make bundles`, commit the result |
| `meaningfy-voice` fires on an explainer request, or not on a post | The static probes; the behavioural run | Sharpen the description; run the set again; record both |
| A scenario fails when run by hand on one CLI | `evidence/agent-scenarios.md` | Fix the skill or agent line; if the CLI cannot nest, record the *unread* path as the observed result |

## Risks / Trade-offs

- **RISK-1** Whether an agent that itself runs as a subagent can start a reader depends on the CLI.
  Claude Code: its documentation (code.claude.com/docs/en/sub-agents, read 2026-11-14 by the
  attacker) says a subagent whose `tools` list `Agent` may spawn subagents of its own up to a depth
  limit, and that the tool is withheld at the limit. opencode: not documented for custom subagents,
  and the repository maps `Agent` to `task`, verified on opencode 2.1.4 only. Likelihood of a
  refusal: low on Claude Code, unknown on opencode; impact medium. Mitigation: D-7 (*unread*), its
  scenario, and task 2.7, which runs both paths on both CLIs and records what each allows.
- **RISK-2** With `Agent`, scheduled sales runs start `sales-operations`' three reviewers: more
  tokens per run, and findings in run notes that said *unverified*. Likelihood high, impact low.
  Accepted by the owner (Q-14, DEC-10); the CHANGELOG says so. Inside this change, the scheduled
  scenario of § Scenarios is run once by hand from the stage-2 head (task 2.7) and shown at the
  acceptance demo. Real scheduled runs get the new agent file only with the release that ships
  this change; the owner reads their first week of run notes then, and a problem becomes an
  issue. That check is after this change, not a task of it.
- **RISK-3** The owner sends a draft from a scheduled run straight from the mail client, so it
  leaves unread. Likelihood medium, impact medium. Accepted: the profile binds agents, not the
  owner, and marking such drafts would add the profile to scheduled runs (DEC-4). The acceptance
  demo shows the pick-up path so that it is the easy one.
- **RISK-4** Confirming criteria becomes a reflex "yes". Likelihood medium, impact medium.
  Mitigation: one or two lines, one message for a batch, and a form that can fail; the baseline's
  kept pairs show the owner what a confirmed criterion bought.
- **RISK-5** The reader is theatre. Mitigation: quotations, the clean twins, the unpointed second
  offer fixture, the capped reruns, O-5 (DEC-7).
- **RISK-6** The new trigger of `meaningfy-voice` collides with `explanatory-writing`. Likelihood
  medium, impact low. Mitigation: D-12's behavioural run, before and after.
- **RISK-7** A is delivered differently from its design. Likelihood medium, impact low.
  Mitigation: the re-check table and task 1.1.
- **RISK-8** Client-confidential text passes through reader subagents. Accepted in DEC-7; D-9
  keeps the reader's inputs to the draft and one line.
- **RISK-9** The reader is a model: one run can miss. Mitigation: three runs and a 2-of-3 bar in the
  proof; in daily use the owner still reads the piece before sending.
- **RISK-10** The baseline's O-1 to O-3 can only show that the steps were followed, and its
  confirmation is simulated. Likelihood certain, impact low. Mitigation: O-5, the owner's own
  reading of the pairs; accepted beyond that, since a scored comparison is a no-go.
- **RISK-11** An explainer published as a blog article fires `explanatory-writing`, which claims
  blog posts and is not edited here, so it may be written with no criteria and no reader.
  Likelihood medium, impact medium. Accepted for this change: the rule of D-1 covers the piece
  whenever `guardrails` or `meaningfy-voice` is loaded, and `add-content-creation` owns the
  content flow. Recorded as a follow-up for that EPIC in the PR.
- **Trade-off:** the reference in `guardrails` holds rules about content work (criteria, owners),
  in a skill about agent behaviour. Chosen by the owner (Q-9, Q-12) for one home beside the brief
  rules; `test-strategy` stays rows only.

## Attack record

A fresh subagent attacked the first draft (commit 651be4d) on 2026-11-14. Findings and where they
went:

| Id | Finding | Folded into |
|---|---|---|
| AT-1 | The "leaves the company" pattern already matched a `sales-operations` prompt | D-11: the question form, checked against the repository |
| AT-2 | The test stayed red until stage 3, so no stage PR could be green | D-11, D-13, tasks 1.4, 2.0, 3.1: assertions land per stage |
| AT-3 | `Agent` lets scheduled sales runs start the reviewers; Context was wrong | Q-14, DEC-10; Context, D-5, RISK-2, spec `sales-method-ownership`, the scenario |
| AT-4 | Feature Backgrounds must name every agent skill | Context, D-5, error matrix, task 2.6 |
| AT-5 | The brief's guard pattern was not in the brief | D-11: the brief's own lines, asserted present in the reference |
| AT-6 | "Back to the draft" contradicted "Tolic changes no term" | D-6, the contract example, specs `subagent-dispatch` and `legal-contract-practice` |
| AT-7 | The post's two steps had no home | D-2, D-3: two step lines in the channel file |
| AT-8 | Baseline runs could load installed skills | D-11: isolated runs from one commit; error matrix |
| AT-9 | The baseline bar could not fail | D-11: O-5; RISK-10 |
| AT-10 | The planted flaws were named by the attack lists; reruns unlimited | D-11: `offer-planted-2.md`, two reruns at most; RISK-5 |
| AT-11 | A's probe as a near-miss; blog explainers | D-12; RISK-11 |
| AT-12 | RISK-1 assumed no nesting on Claude Code | RISK-1, D-7, D-11 (forcing the path), task 2.7 |
| AT-13 | A skill may not link into another skill | Context, D-2, anti-patterns |
| AT-14 | Pasted drafts and a "top model" broke live requirements | D-9: paths only, the caller's model |
| AT-15 | A row with two check ids, and a role in a row | D-10, R-11, spec `test-strategy` |
| AT-16 | The headline requirement restated the rule in `test-strategy` | Spec `test-strategy`: removed; the rule is in `subagent-dispatch` |
| AT-17 | Skip-when-missing hid a renamed file | D-11: a missing file fails at stage 3 |
| AT-18 | Role patterns missed the hyphen form | D-11 |
| AT-19 | A proposal email had two candidate profiles | D-3: one rule; spec `executive-communication` |
| AT-20 | Where trigger results are recorded | D-12 |
| AT-21 | Before and after of `guardrails`' description; its length; UC-W7 | D-1, D-12, D-14 |

**Clarity gate, run 1 (independent scorer, on commit f579064): 8.9/10, FAIL.** All 13 checklist
items passed; seven gaps, all folded in:

| Gap | Fix |
|---|---|
| G-1 | The description edits could not meet their own cap → D-1 names the two triggers dropped and the count |
| G-2 | A guarded line wrapped over two lines would not match → D-11 scans whitespace-normalised text |
| G-3 | The baseline used a fixture written by a later task → tasks reordered; B-2's table inline; the run's directory stated |
| G-4 | Which criteria the shared clean twin is read against → D-11 |
| G-5 | No signal for a contaminated baseline run → the error-matrix row removed; the isolation steps are the guard |
| G-6 | The *Attacks* written in stage 2 were never proven → bullets word for word, and one repeat of the runs (D-11, task 2.9) |
| G-7 | `served_by` key; README paragraphs cited as headings → D-14, D-11 |

**Clarity gate, run 2 (a second independent scorer, on commit 0a8a1a0): 8.8/10, FAIL.** Six gaps,
all folded in: the description cap had no source (D-1, task 1.5); no task gave `guardrails` its
pointer line (task 1.5); *Moment* did not take A's form (D-10); the first week of scheduled run
notes cannot exist before the release (RISK-2, task 3.5); B-2's drafts could be clause text in a
public repository, and the run has no contract repository (D-11, error matrix); O-4 was in no bar
(D-11).

## Open Questions

None blocking. One default the owner may overrule: the contract fixtures are fabricated term
tables in plain words (D-11), which this PLAN reads as allowed by `legal-contract-practice`'s "no
clause text". If they are not, the contract half of the planted-flaw proof runs in the contract
repository and skillery records only its result.
