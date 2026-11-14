<!-- PLAN (design half), derived 2026-11-14 from proposal.md and from A's gated design, before A's
     delivery. Attacked the same day by a fresh subagent (AT-1..AT-21, all folded in, see § Attack
     record). Clarity gate: 8.9, 8.8, 8.9, 8.8, then 9.0/10 PASS on the fifth run, each by an
     independent scorer. Re-shaped the same day on the owner's word (Q-15, DEC-11: an
     assessment, not a test; no contract fixtures or baseline) and gated again: 9.1/10 PASS (run 7, end
     of § Attack record). A was delivered the same day; the PLAN was merged with `develop` and
     checked against A's files (R-1..R-12), which set the check ids, the `ADQ` row and the
     *Moment* wording of D-10. Ready for delivery. -->

> Derives from: EPIC `generic-task-test-profiles` ([`proposal.md`](proposal.md)), DEC-1..DEC-11.
> Depends on: EPIC A `test-strategy`, its
> [`design.md`](../archive/2026-11-14-test-strategy/design.md) (D-1, D-2, D-3, D-8). A was delivered
> and archived on 2026-11-14, while this PLAN was written; the PLAN was then checked against A's
> files (§ *Checked against A as delivered*).

## Context

Four kinds of piece are written today with no criterion stated first and no reader who tries to
break them (`test-strategy`'s `generic-writing` matrix marks both as `gap → D`). What exists:

- **`guardrails`** § 5 *Subagent dispatch* ([SKILL.md](../../../skills/guardrails/SKILL.md), lines
  69–110) owns the brief rules and the base report
  ([`references/subagent-reports.md`](../../../skills/guardrails/references/subagent-reports.md)); the
  *reviewing* purpose adds "findings by severity with location and the rule they break; a
  verdict" (`subagent-reports.md`, line 31). The reader takes the findings and leaves the verdict.
  Its description is 685 characters, over the advisory target of 600.
- **The five owning skills** hold method and no profile:
  [`proposal-writing`](../../../skills/proposal-writing/SKILL.md) (113 lines, *Flow* steps 1–4),
  [`contract-practice`](../../../skills/contract-practice/SKILL.md) (163 lines, phases intake to
  harvest), [`executive-communication`](../../../skills/executive-communication/SKILL.md) (255
  lines, *Start here: diagnose before you structure*),
  [`sales-conversations`](../../../skills/sales-conversations/SKILL.md) (120 lines, an *Acceptance
  criteria* table per work item) and
  [`meaningfy-voice`](../../../skills/meaningfy-voice/SKILL.md) (36 lines; its
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
- **A's side.** `skills/test-strategy/` exists since 2026-11-14. Its
  [`references/generic-writing.md`](../../../skills/test-strategy/references/generic-writing.md)
  has the seven columns of A's D-2 and three rows marked `gap → D`: a `VAL` row ("the owner
  approves the stated success before drafting"), a `ROB` row ("an adversarial reader who tries to
  break the draft") and an `ADQ` row ("whether the writing checks would catch a bad piece"). Its
  *Moment* cells are short free text ("before drafting", "contract revision"). The inventory ends
  at `CHK-144`. Five of the six skills carry A's pointer line; `sales-conversations` has none.
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
  6. *The report*: an assessment, not a verdict (DEC-11). The base report plus the *reviewing*
     fields without their verdict: findings in order of weight, each naming the criterion it bears on and quoting the
     draft; then the criteria that drew no finding. No pass, no fail, no score. A finding that
     matches no criterion goes under *Open questions* as a proposed criterion.
  7. *The loop's end*: at most two reads, and what the agent may not revise (D-6).
  8. *No reader*: the piece is *unread* (D-7).

  `guardrails`' SKILL.md gains one bullet in § 5, "**An adversarial reader for what leaves the
  company.**", two lines, naming the reference. Its description names the reader inside the
  existing dispatch parenthesis ("the second check, the adversarial reader", 24 characters more)
  and adds the trigger "have a reader attack this draft" (35 more). To pay for them it drops two
  triggers that no probe uses and that other triggers cover: "is this agent step safe" and "keep
  the context small" (53 fewer). It ends at 691 characters, six more than today's 685; the lint's
  advisory target of 600 is already exceeded and its hard limit is 1024. The reference names no
  role: the role is an input of the brief.
- **D-2 A profile is one section of fixed shape in its owning skill.** Heading `## Review profile`,
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
  | `sales-conversations` | a busy recipient | the ask unclear or hard to say yes to; whose turn got wrong; a commitment nobody approved; a line any vendor could send; not readable on a phone in 20 seconds | a new subsection *In an attended session: criteria and a reader*, under *Workflow*; it covers a fresh draft and a draft picked up from a scheduled run | the same subsection |

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
- **D-5 The two agent files** (DEC-9, DEC-10). Both gain `Agent` in `tools`, `guardrails` as the
  last entry of `skills` (the first entry is the agent's primary skill for the lint, as in
  `lawyer`) and its line under `## Skills` ("the adversarial-reader subagent and the base report").
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
- **D-6 Two reads at most, and the author revises only what is theirs.** The reader's
  findings send the work back to the draft: the author revises on each finding or says in one
  line why not. A fresh reader then reads the revised draft against all criteria. The findings of
  that second read go to the owner with the draft and the quotations; the owner judges them and
  decides (send, revise, drop). Where the owning skill reserves a change to the owner, the agent
  does not revise it: for a contract, a number or a term that changes what a party can claim or
  must do (`contract-practice`, *Alignment*, *Counterparty changes*). A finding on such a point
  is recorded as an open point or a lawyer point with the reader's quotation. The second read is
  still against all criteria; its brief lists such a criterion as "open, with the owner", so the
  reader does not raise it again. Rejected: reading until the reader has nothing left, which has
  no end and slows daily work (DEC-7).
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
  without exception. The brief quotes the owning skill's *Attacks* bullets; the reader is not sent to the
  skill's file, so it knows the brief and the draft and nothing else. The recipient line is one sentence (role, relationship, what they
  last asked); no dossier, no thread. The reader is a fresh general-purpose subagent (No-gos: no
  new agent) on the caller's model, as the live `subagent-dispatch` requirement says; this change
  adds no model rule.
- **D-10 Matrix rows and checks** (A's D-1, D-2). `inventory.md` gains five checks, one per
  profile: `CHK-145` offer (`proposal-writing`), `CHK-146` contract (`contract-practice`),
  `CHK-147` post (`meaningfy-voice`), `CHK-148` message (`executive-communication`), `CHK-149`
  sales message (`sales-conversations`); if an id is taken by then, the next free ones. The brief
  is the tool of those checks, not a check of its own. In `generic-writing.md` A's two rows
  `VAL … gap → D` and `ROB … gap → D` are replaced by ten rows, a `VAL` and a `ROB` row for each
  profile:

  | Question | Check | Technique owner | Tool | Moment | Decided by | Status |
  |---|---|---|---|---|---|---|
  | `VAL` | the profile's `CHK-<n>` and its name | the owning skill | none | before drafting; at pick-up for an unattended draft | the owner | `exists` |
  | `ROB` | the same `CHK-<n>` | the owning skill | a fresh subagent, briefed per `guardrails` (`references/adversarial-reader.md`) | before hand-over | the author on each finding; the owner after the second read | `exists` |

  *Moment* is short free text, as in A's file. A's third row, `ADQ … gap → D` ("whether the
  writing checks would catch a bad piece"), becomes `accepted`, with the reason: "this work is
  assessed and reviewed, not tested (generic-task-test-profiles DEC-11); the owner judges the
  findings, and one planted-flaw check on an offer is kept as evidence". After that no row names
  D. No row names a role: roles stay in the owning skills. The internal-message case is the same
  `VAL` row of `executive-communication`: the owner decides by correcting or not.

  Pointer lines, each naming `references/generic-writing.md`: `proposal-writing` and
  `contract-practice` go from `VER, RSK` to `VAL, VER, ROB, RSK`; `meaningfy-voice` from `CLR` to
  `VAL, ROB, CLR`; `executive-communication` from `VAL, CLR` to `VAL, ROB, CLR`;
  `sales-conversations` gains the line with `VAL, ROB`. `guardrails` is the tool of these rows,
  not their technique owner, so its line (`VER, RSK`, `cross-cutting.md`) stays. In
  `test-strategy`'s SKILL.md only the Quick Start's sentence on the `VAL` row may change ("This
  row is a `gap` (no check yet), so say so and keep the criterion anyway", lines 33–34), to name
  `CHK-147`; nothing else (No-gos).
- **D-11 Proof mechanics** (DEC-6).
  - *Baseline.* Four fixed tasks, fabricated, written to `evidence/baseline/inputs.md` before any
    run. Contracts have none (DEC-11): contract work is assessed in its own repository, and the
    contract profile is tried in the first real contract session there, with the `lawyer`
    scenario of § Scenarios as its check inside this change.

    | Id | Kind | Task |
    |---|---|---|
    | B-1 | offer | a proposal email for `Example Registry`: map the supplier codes of three systems to one vocabulary, six weeks, ceiling 40 000 EUR |
    | B-3 | post | a LinkedIn post announcing our new SHACL validation service |
    | B-4 | sales message | the follow-up to a first call with a head of data who asked for a one-page summary |
    | B-5 | internal message | a status note to the team: the registry project slips one week |

    Each run is one call, started in an empty scratch directory:
    `claude -p "<prompt>" --model sonnet --output-format json --permission-mode acceptEdits
    --plugin-dir "$P"`, so the run can write its draft into the scratch directory (D-9 needs the
    draft as a file), with
    `CLAUDE_CONFIG_DIR` set to an empty directory that holds only the login, as
    [`tests/evals/README.md`](../../../tests/evals/README.md) does it (section *Trigger sets*,
    paragraph "Isolate the run"), so that no installed copy of a skill answers. `$P` is one
    temporary plugin built from a checkout of one commit: the contents of
    `bundles/meaningfy-core`, `bundles/meaningfy-consulting` and `bundles/meaningfy-sales`
    copied with their links resolved (`cp -rL`) into one directory, and
    one `.claude-plugin/plugin.json` naming it `baseline`, written last so that it replaces the
    manifests the copies brought (the same README, section *Outcome
    suites*, paragraph "Locally", shows the copy). Those three bundles hold the four owning skills the
    tasks need, `guardrails` and `test-strategy` (in `meaningfy-core`), on the base commit as on the head. A run whose output shows a refused tool
    call is discarded, the command is corrected, and the run is made again; that is not counted
    as a rerun. A run sees no repository file. The prompt is the task plus one
    sentence: "where a skill tells you to ask the owner, write the question, take
    the answer as yes and go on". The *without* runs use the base commit; the *with* runs the head
    of stage 2. Before the runs, one calibration call of B-5 gives `total_cost_usd`; eight times
    that (four tasks, twice), doubled for the longer tasks and the reruns, is the amount the owner approves, and the
    runs stop when it is spent. A *with* run that misses an expected observation may be repeated
    at most twice, from the commit that holds the fix, which is recorded.
    `evidence/baseline.md` records the commit of each run and five observations, yes or no, never
    a score:
    - **O-1** success and failure were stated before the first line of the draft;
    - **O-2** the run wrote a confirmation question to the owner (not applicable to B-5);
    - **O-3** a reader's report exists, each finding naming a criterion and quoting the draft, or
      saying it has none (B-5: expected no report);
    - **O-4** a finding led to a change in the draft, or the reader had none;
    - **O-5**, judged by the owner on the kept pair at the acceptance demo: the *with* run's reader
      raised something that the *without* draft still contains.

    The drafts and reports are kept under `evidence/baseline/`. **Proven** means every *with* run
    shows the expected value on O-1 to O-3, O-4 is yes for the *with* runs of B-1, B-3 and B-4,
    and O-5 is yes for at least two of those three. O-1 to O-4 show that the steps happen; only
    O-5 shows that they changed the piece (RISK-10).
  - *Planted flaw: one check, for the offer only* (DEC-11). It is evidence made once during
    delivery, not a test: nothing goes under `tests/`. Two fabricated offers are written to
    `evidence/planted-flaw/`: `offer-planted.md`, whose scope lists a "data-quality dashboard"
    that the price table and the exclusions leave out, and `offer-clean.md`, the same offer with
    the dashboard priced. A scope and price that disagree is a matter of fact, so the check is
    fair. Each run is a fresh general-purpose subagent started from the attended delivery session
    on that session's model (D-9), briefed per D-1 with the sceptical-buyer role, the *Attacks*
    bullets of D-3 and the example criteria of D-3; three runs per file, six in all, which the
    owner is told before the first. **Shown** means: on the planted offer, a finding quotes the
    dashboard in at least two of three runs; on the clean one, no finding claims a scope and price
    mismatch in at least two of three. The clean offer is the theatre check: a reader that finds
    fault with everything shows nothing (DEC-7). On a miss the brief or the *Attacks* may be
    sharpened and the six runs repeated, at most twice; then the owner decides. The role, the
    bullets used, each round's change and the counts go to `evidence/planted-flaw.md`, and task
    2.1 writes those bullets into `proposal-writing`'s section as they were used.
  - *Ownership.* `tests/test_generic_task_profiles.py` checks where the skill text sits, never a
    piece of writing. It scans every file under `skills/` and `agents/`,
    case-insensitively, on the file's text with each run of whitespace, line breaks included,
    turned into one space, so a pattern wrapped over two lines is still found; a failure names the
    file. Each assertion is written in the stage that makes it true, red before that
    stage's edits and green before its PR (D-13):
    - **stage 1:** the patterns `do not rewrite and do not propose wording`, `every finding
      quotes the draft` and `will someone outside Meaningfy read it` each occur in
      `guardrails/references/adversarial-reader.md` and in no other file. They are lines of the
      brief and of the test themselves, so a copy of either is caught. (Checked 2026-11-14: none
      occurs in the repository today.)
    - **stage 2:** each of `proposal-writing/SKILL.md`, `contract-practice/SKILL.md`,
      `executive-communication/SKILL.md`, `sales-conversations/SKILL.md` and
      `meaningfy-voice/references/channels/linkedin.md` has a `## Review profile` section holding
      the four labels in order and the string `adversarial-reader.md`. Each role name, with a
      space or a hyphen between its words, occurs only in its owning skill's files:
      `sceptical[\s-]buyer` (`proposal-writing`), `opposing[\s-]counsel` (`contract-practice`),
      `stranger[\s-]scrolling` (`meaningfy-voice`), `busy[\s-]recipient`
      (`executive-communication`, `sales-conversations`).
    - **stage 3:** `test-strategy/references/generic-writing.md` exists (a missing file
      fails), no row of it names D, every skill it names as technique owner of a `ROB` row has the
      section, and each of the five owning skills is named in a `VAL` and a `ROB` row with status
      `exists`.

    The test carries its own example lines: one that passes and one that fails for each pattern,
    the hyphen form of a role included. `tests/ownership.yaml` gains `adversarial-reader-brief`,
    owner `guardrails`, `claim_patterns: ["do not rewrite and do not propose wording"]`; its
    tripwire is advisory and reads SKILL.md only, so the test above is the guard.
  - *Agent scenarios.* The scenarios below (§ Scenarios) are added to the three existing feature
    files, each with a `# Traces to:` line naming this change. In `proposal-writer.feature` the
    existing outline *The output depends on what the requirements answer* gains the line "And the
    caller passed the criteria the owner confirmed", so its rows stay true. They are run by hand
    on both CLIs (the files' own header) and the results go to `evidence/agent-scenarios.md`: what
    happened at each step, yes or no, and nothing else. The `lawyer` scenario runs in a checkout
    of the contract repository, so its record holds no clause text, no quotation and no
    counterparty name, and the branch and PR it opens there are closed unmerged after the run. The
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
  10 positives and 10 near-misses in `tests/evals/triggers/meaningfy-voice.json`, run as
  `tests/evals/README.md` says (3 runs per query, its pass bar, the owner's approval of the
  estimate first): "before" on the skill as it is and "after" with `--description` and the
  candidate text, both before task 2.3 edits the description, which then takes the text that
  passed. The near-misses aim at `explanatory-writing`, `executive-communication`
  and `technical-writing`. A request about the checks of a post ("which checks does this LinkedIn
  post need before I publish it", A's probe for `test-strategy`) is in neither half: both skills
  may rightly load. The result is recorded where that README says,
  `inputs/evidence/triggers-meaningfy-voice.md`, with its ten-column header. The descriptions of
  the other four skills do not change.
- **D-13 Three stages, each green on its own.** Stage 1, the reader: the *without*
  baseline, the stage-1 assertions, the reference with `guardrails`' bullet, description and
  probes, and the planted-flaw proof. Stage 2, the profiles: the behavioural run of
  `meaningfy-voice`, the five skills, the two agents, the scenarios, `meaningfy-voice`'s probes,
  the stage-2 assertions.
  Stage 3: the matrix and its assertions, the *with* baseline, the docs and the acceptance demo.
  The reader is proven before any skill relies on it, and `make validate` is green at the end of
  every stage.
- **D-14 Definition of Done items.**
  - the failure case, `evidence/failure-case.md`: the three `gap → D` rows of A's
    `generic-writing.md`, and the *without* baseline runs;
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
You know only this brief and the draft.
Criteria (<confirmed by the owner on DATE | stated by the author>):
  Succeeds: <…>
  Fails: <…>
Attack along:
  <the Attacks bullets of the owning skill's Review profile, quoted>
Open, with the owner (second read only): <criteria already handed over as open points, or none>
Do not rewrite and do not propose wording.
Report: the base report plus the reviewing fields, without a verdict. Give your findings in order of weight; each
names the criterion it bears on. Every finding quotes the draft. Then list the criteria you have
no finding on. Give no verdict and no score. Anything you notice that matches no criterion goes
under Open questions as a proposed criterion.
```

**Worked example (an offer, attended).**

> **Input:** "Write the proposal email for Example Registry."
> 1. The agent proposes: *Succeeds:* their head of data can tell her director in two minutes what
>    they get in six weeks, for how much, and what is excluded. *Fails:* a deliverable is in scope
>    but not in the price, or priced but out of scope. The owner: "yes, and it must name the stop
>    option". The criteria now have three lines.
> 2. The agent drafts, runs `rulebook check` and the genre self-check as today.
> 3. A fresh sceptical buyer gets the draft's path, the three criteria, the five
>    *Attacks* bullets of `proposal-writing` and the line "head of data at a public registry; asked for an
>    offer after one call". It reports one finding, on criterion 2, quoting "a data-quality dashboard"
>    from the scope and the price table that does not list it; no finding on the other two; one
>    open question, "should the offer say who signs?".
> 4. The agent prices the dashboard out or in with `estimation`, has a second fresh reader read the
>    revised draft, which has no finding, and hands the owner the draft, the criteria and the report.
>    The open question goes to the owner as a proposed criterion.

**The same offer through `proposal-writer`.** First dispatch, no criteria in the input: it returns
the two proposed criteria under *Open questions*, each with "recommended: yes", and no draft. The
caller asks the owner, then dispatches again with the confirmed criteria: the agent drafts, starts
the reader, revises, and returns the draft and the last report. A third dispatch with corrected
criteria revises the existing draft against them and starts the read count again. If it cannot
start a reader, the report's first recommendation is "unread: run the sceptical-buyer reader"
(D-7).

**A contract.** The opposing-counsel reader raises a finding on the criterion "no right is given
to one side only" and quotes the termination term. Tolic does not change the term (D-6): he records
the open point with the quotation, fixes an undefined term the reader also raised, and has the draft read
once more against all criteria, the termination criterion listed as "open, with the owner".

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
    And it revises on the reader's findings and has the draft read at most twice
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
    And each finding on a number, or on a term that changes what a party can claim or must do, becomes an open point or a point for a qualified lawyer, with the reader's quotation, and he changes neither
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

### Checked against A as delivered

This PLAN was derived from A's design. A was delivered on 2026-11-14, and each assumption was then
checked against `skills/test-strategy/` on `develop` (commit 48dfc9c). Task 1.1 reads the table
again at the start of delivery, since `develop` moves, and fixes this PLAN first if a line no
longer holds.

| # | Assumed from A's design | Found in A's files | Used in |
|---|---|---|---|
| R-1 | The file is `references/generic-writing.md` with the seven columns of A's D-2 | Holds | D-10, D-11 (stage 3) |
| R-2 | A's `gap` rows for `VAL` and `ROB` name D | Holds, and a third row, `ADQ`, names D too | D-10: `ADQ` becomes `accepted` |
| R-3 | Inventory ids are `CHK-<n>`, unpadded | Holds; the last is `CHK-144` | D-10: `CHK-145` to `CHK-149` |
| R-4 | `tests/test_test_strategy.py` checks ids and a row per question | The file exists; it must stay green with the new rows | D-10, task 3.1 |
| R-5 | The stance is *adversary*; the loop and the definition of a test have headings | Holds: *The loop*, *What a test is*, *The five stances* | D-1 § 2 |
| R-6 | Which skills carry A's pointer line | Five of six; `sales-conversations` has none | D-10 |
| R-7 | The Quick Start quotes the `VAL` gap | Holds in other words (SKILL.md lines 33–34) | D-10 |
| R-8 | `recipient-reader` is a `CLR` check of `generic-writing` | Holds: `CHK-95` | D-4 |
| R-9 | A's LinkedIn probe expects `test-strategy` | Holds (`tests/trigger_probes.yaml`, line 251) | D-12 |
| R-10 | The contract and sales workflow files carry `criteria` | Hold; the `intake`, `review` and `offer` lines name evidence and contradict no profile | Non-Goals |
| R-11 | One `CHK-<n>` per row; two rows may share an id | Holds (`CHK-94` is cited twice) | D-10 |
| R-12 | *Moment* is "workflow and phase, or any" | Does not hold: the cells are short free text | D-10 follows the file |

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Copy the brief, or "when it is mandatory", into an owning skill | The fixed section of D-2 and a plain-text pointer | One home (DEC-5, Q-12); the ownership test fails otherwise |
| Link from a skill to `guardrails`' reference by path | Name the skill and the file in backticks | `cross_skill_paths` fails the lint |
| A criterion such as "the offer is convincing" | Name the reader and what they do or decide | It cannot fail (Rabbit-holes) |
| Give the reader the dossier, the thread or the author's reasoning | The draft, the criteria, the role, one recipient line | An anchored reader confirms the author (`guardrails`, *Fresh, not a copy*) |
| Let the reader return a new draft or better wording | It reports; the author revises | Rabbit-holes: a reader that rewrites has left its brief |
| Ask the reader for pass or fail, a verdict or a score | Findings with quotations; the owner judges | DEC-11: qualitative work is assessed, not tested |
| Write test cases or fixtures for a contract or a post | Criteria, the reader (two reads at most, D-6), the owner's review | DEC-11 |
| Attach a finding that matches no criterion to one anyway | A proposed criterion, for the owner | A criterion is agreed before the work (A's DEC-3) |
| Change a contract's number or term because the reader raised it | An open point with the quotation | `contract-practice`: which one is right is the owner's decision |
| Score the baseline or the reader's report | Yes or no observations, and the kept drafts | No-gos: no rubric, no pass mark |
| Present "all criteria passed" as approval of a contract | A read, done; the lawyer-review list and the owner's approval remain | No-gos: no legal advice |
| Add the two steps to a scheduled run, or edit `recipient-reader` | The steps run at pick-up | DEC-4, DEC-10; No-gos |
| Write a technique or a role into `test-strategy` | Rows that name the owning skill | A's DEC-5, DEC-8; No-gos |
| Run a baseline in a session where the catalogue is installed | An isolated configuration directory and a plugin built from one commit | An installed copy of a skill would answer |
| Edit the planted offer, or rerun without limit, until the reader finds the flaw | Sharpen the brief or *Attacks*; two reruns at most | A check that cannot miss shows nothing |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| A's files have changed since they were checked | Task 1.1, the R-1..R-12 table | Fix this PLAN before any other task; a change that touches a DEC goes to the owner |
| An owning skill lacks the section, a label, or the pointer | `tests/test_generic_task_profiles.py` (stage 2) | Complete the section |
| A line of the brief or the "leaves the company" test is copied outside the reference, or missing from it | The same test (stage 1) | Replace the copy with a pointer; restore the line |
| A role name appears in another skill, in an agent file or in `test-strategy` | The same test (stage 2) | Move it to its owner |
| `generic-writing.md` is missing or renamed at stage 3 | The same test fails (stage 3) | Task 1.1 should have caught it: fix R-1 and the test's path |
| The reader misses the planted flaw in 2 of 3 runs | `evidence/planted-flaw.md` | Sharpen the brief or the skill's *Attacks*; run all six again, twice at most; then the owner |
| The reader claims a scope and price mismatch in the clean offer in 2 of 3 runs | `evidence/planted-flaw.md` | The reader is theatre: tighten the brief's report lines; run again within the same limit |
| A *with* run misses O-1, O-2, O-3 or O-4 | `evidence/baseline.md` | Fix the owning skill's step line (D-3); run that task again from the commit with the fix, twice at most and within the approved amount; then the owner |
| The approved amount is spent before the baseline bar can be judged | The sum of `total_cost_usd` | The owner approves more, or the unfinished tasks are recorded as not proven |
| O-5 is yes for fewer than two pairs | The acceptance demo | The profile did not change the pieces: the owner decides whether to ship, sharpen or drop a profile |
| The owner does not answer the confirmation | The agent is waiting | It does not draft a piece that leaves the company; a delegated agent returns the question |
| The owner corrects the criteria after the draft exists | The owner's message | The corrected criteria replace the old ones; the draft is revised and read against them; the read count starts again |
| The second read still has findings | The second report | The draft and the findings with their quotations go to the owner; no third read (D-6) |
| The reader raises a finding on a contract's number or term | The report | An open point or a lawyer point; the agent changes neither (D-6) |
| The reader returns a rewrite, a verdict, or a finding without a quotation | The author reads the report | Discard that part; dispatch a fresh reader once; it counts as the same read |
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
- **RISK-5** The reader is theatre. Mitigation: quotations, the planted offer and its
  clean twin, the capped reruns, O-5 (DEC-7). For contracts and posts nothing is planted (DEC-11):
  there the owner's own reading of the first real findings is the check.
- **RISK-6** The new trigger of `meaningfy-voice` collides with `explanatory-writing`. Likelihood
  medium, impact low. Mitigation: D-12's behavioural run, before and after.
- **RISK-7** `develop` moves between this check against A's files and the start of delivery.
  Likelihood medium, impact low. Mitigation: the table above and task 1.1.
- **RISK-8** Client-confidential text passes through reader subagents. Accepted in DEC-7; D-9
  keeps the reader's inputs to the draft and one line.
- **RISK-9** The reader is a model: one run can miss. Mitigation: three runs in the offer
  check; in daily use the reader only assesses, and the owner still reads the piece and judges.
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
| G-6 | The *Attacks* written in stage 2 were never proven → bullets word for word, asserted by the test (D-11, task 2.0) |
| G-7 | `served_by` key; README paragraphs cited as headings → D-14, D-11 |

**Clarity gate, run 2 (a second independent scorer, on commit 0a8a1a0): 8.8/10, FAIL.** Six gaps,
all folded in: the description cap had no source (D-1, task 1.5); no task gave `guardrails` its
pointer line (task 1.5); *Moment* did not take A's form (D-10); the first week of scheduled run
notes cannot exist before the release (RISK-2, task 3.5); B-2's drafts could be clause text in a
public repository, and the run has no contract repository (D-11, error matrix); O-4 was in no bar
(D-11).

**Clarity gate, run 3 (a third independent scorer, on commit 3a3f2a9): 8.9/10, FAIL.** Nine gaps,
all folded in: the baseline's command, plugin and estimate (D-11); `guardrails` is the rows' tool,
so it gets no `VAL`, `ROB` pointer (D-10, task 1.5); the trigger set's "before" runs ahead of the
description edit (D-12, task 2.9); one rule for the second read (D-6, the brief); D-13 matches the
tasks; the brief quotes the *Attacks* and sends the reader to no file (D-9, the brief), which also
replaces the repeat of the planted-flaw runs by an assertion; `guardrails` is the last skill entry
(D-5); B-2's drafts are discarded and left out of O-5 (D-11); baseline reruns are capped (D-11).

**Clarity gate, run 4 (a fourth independent scorer, on commit c97c17a): 8.8/10, FAIL.** Four gaps,
all in D-11 and all folded in: the baseline command lets the run write its draft; `must_quote` is
a list that fits an omission; how the planted-flaw runs start and that the owner is told their
number; `test-strategy` is in the plugin through `meaningfy-core`.

**Clarity gate, run 5 (a fifth independent scorer, on commit d144b6c): 9.0/10, PASS.** All 13
checklist items passed and no gap blocked delivery. Its three minor recommendations were folded in
afterwards: the criterion of `offer-planted-2.md`, the order in which the plugin manifest is
written, and the error-matrix row for a spent amount (all D-11).

**Re-shape after the gate (2026-11-14, Q-15, DEC-11).** The owner: legal work and posts are
assessed, reviewed and revised, not tested with cases. Changed, in D-1, D-6, D-11, the brief, the
scenarios and the spec deltas: the reader returns findings with quotations and no pass, fail or
verdict, for all four kinds; the contract fixtures, the contract half of the planted-flaw proof
and the contract baseline task are gone; the offer keeps one planted-flaw check, as evidence made
once and not under `tests/`; the fixture checks and `expected.yaml` are gone, so the test file
checks only where the skill text sits. Findings AT-10 and G-4, the fixture fixes of gate
runs 4 and 5 and the B-2 fixes above describe machinery that no longer exists.

**Clarity gate after the re-shape.** Run 6 (a sixth independent scorer, on commit 1262314):
8.9/10, FAIL; one blocking gap, the *reviewing* fields carry a verdict, and four minor ones, all
folded in. Run 7 (a seventh independent scorer, on commit e2ddaf1): **9.1/10, PASS**, all 13
checklist items passed. Its four minor recommendations were folded in afterwards: *Decided by* in
D-10, the "one read" wording, what the `lawyer` scenario's record may hold (D-11), and this
record.

## Delivery decisions

Recorded 2026-11-14, when the five changes of the test strategy work were read against each other
and against A as delivered. These override the decisions above where they differ.

- **D-15 The pointer lines change with the rows, in stage 3 (corrects D-10 and D-13; tasks 2.1
  to 2.5 and 3.1).** A's test (`tests/test_test_strategy.py`, `pointer_errors`) demands that a
  skill's pointer line lists exactly the questions and files of the `exists` rows that name it
  as technique owner. The rows arrive in stage 3. A pointer line changed in stage 2 would turn
  `make validate` red at task 2.10: four skills would name extra question ids, and
  `sales-conversations` would point to the matrix with no row. So tasks 2.1 to 2.5 leave the
  pointer lines alone, and task 3.1 changes the five lines in the commit that adds the rows. The
  stage-2 assertions of D-11 do not read the pointer line, so they stay as written.
- **D-16 The reader's brief and report against the live `subagent-dispatch` spec (corrects D-1
  section 6, D-9 and the spec delta).** The delta said the reader is given "only" five inputs;
  the brief of § Algorithm passes a sixth, the points open with the owner at a second read. The
  delta now lists the inputs under the parts the live requirement *A subagent starts fresh from
  a brief* asks for (goal and why, inputs as paths, what is decided, no-gos, the report), so the
  brief keeps that requirement and no exception is needed. The dossier, the thread and the
  author's reasoning still stay out (D-9): what was decided reaches the reader as criteria and
  open points. The report does differ from the live rule "a report SHALL add the fields of its
  purpose": the reader leaves out the verdict. The delta therefore carries a MODIFIED block for
  *Every subagent returns the base report, extended per purpose* that names this one exception.
- **D-17 Three more lines of `test-strategy` change (corrects D-10, "nothing else", and the
  No-go "only its rows").** D-10 lets only lines 33–34 of `skills/test-strategy/SKILL.md`
  change. Two other places quote the rows this change replaces and would be left wrong:
  - SKILL.md, lines 67–68, the column *Example in a post* of the six questions: "none yet (a
    gap)" for `ADQ` and for `ROB`. Task 3.1 sets the `ROB` cell to the adversarial reader's read
    and the `ADQ` cell to say the gap is `accepted`;
  - `references/generic-writing.md`, line 3: the sentence "`gap → D` rows are for the EPIC
    `generic-task-test-profiles` to fill." Task 3.1 removes it.

  No question, stance or column changes, so the No-go holds in its sense: the edit corrects
  quotations of rows. The legend of gap targets in SKILL.md (lines 111–113) stays, since it also
  serves B and C. If `test-suite-care`'s stage 3 has added the words "assessed on request by
  `CHK-<m>`" to a row (its D-22), task 3.1 keeps them. The spec delta states this as a standing
  rule (a quotation of a row agrees with the row) and no longer says what "this change" edits.
- **D-18 The planted flaw is one that `CHK-91` cannot see (corrects D-11, *Planted flaw*).** The
  flaw of D-11, a deliverable in scope that the price table leaves out, is what the existing
  scope-boundary checklist looks for (`CHK-91`: "the price covers only the in-scope list", and
  every in-scope item maps to a deliverable). Finding it shows nothing the checklist does not
  already give. Its other lines also cover two of D-3's *Attacks*: exclusions and the stop or
  extend mechanics. The planted flaw is therefore on the reader's own ground, "a claim with no
  evidence": `offer-planted.md` says that Meaningfy has done the same mapping for other public
  registries and names no work, client or year; `offer-clean.md` is the same offer with the
  claim tied to one named, fabricated engagement (`Example Agency`). Scope, price, exclusions
  and stop mechanics agree in both files, so the planted offer passes every line of `CHK-91`,
  which task 1.2 records. Whether a claim names work is a matter of fact, so the check stays
  fair. The brief adds one criterion to the examples of D-3: *Fails:* a claim about our past
  work names no work the buyer could check. In D-11's bar, read "a finding quotes the claim" for
  "a finding quotes the dashboard", and "no finding says a claim lacks evidence" for "no finding
  claims a scope and price mismatch"; the error-matrix row on the clean offer reads the same
  way. The dashboard stays as the worked example and in the spec scenario *Scope and price
  disagree*: a reader may find that too, it is only not the proof.
- **D-19 One procedure for assessing an agent check (corrects D-11, *Planted flaw*).**
  `test-suite-care` stage 3 (its D-11) will hold the general procedure in
  `skills/test-suite-care/references/non-code-checks.md`: five planted flaws, three runs on a
  seeded and three on a clean copy, the owner's own ten-minute read, and no pass mark. This
  change keeps its own, smaller proof (one flaw, three and three runs), because it may land
  first and the proof is evidence made once. It writes no procedure into a skill:
  `adversarial-reader.md` and the five sections state no way to assess the reader. Once that
  reference exists, a skill of this change that needs to say how the reader is assessed points
  to it in plain text and states no second procedure.
  *(proposed, the owner confirms at scenario sign-off)*: the bar "at least two of three" of
  D-11 goes. The counts per file are recorded and the owner judges them at the acceptance demo,
  as in the general procedure and as the No-go "no pass mark" asks. Until the owner answers,
  D-11's bar stands.
- **D-20 "Leaves the company" covers four kinds only (corrects D-1, section 1).** The test "Will
  someone outside Meaningfy read it?" also catches public documentation, a README, a changelog
  and release notes. The criteria confirmation and the mandatory reader apply only to the four
  kinds the EPIC names (DEC-1, DEC-3): offers and proposals, contracts, public posts, and client
  messages, a sales message to a partner included. Section 1 of the reference says so beside the
  test, and the spec delta carries the sentence and a scenario. The stage-1 pattern `will
  someone outside Meaningfy read it` is unchanged.
- **D-21 How many reads a post gets (bears on D-6).** `inputs/qa.md`, Q-15, reads "posts keep
  criteria and one read"; D-6 allows two reads at most for every kind.
  *(proposed, the owner confirms at scenario sign-off)*: D-6 stays for posts too, and Q-15's
  "one read" is taken to mean one reader, not one pass. If the owner says one read, D-1 section
  7 and the step lines of `linkedin.md` say so for posts, and nothing else changes.
- **D-22 The follow-up of RISK-11 is an issue (corrects RISK-11 and D-14).** A follow-up that
  lives only in a PR body is lost when the PR is merged. Task 3.3 files a GitHub issue for
  `add-content-creation` (a blog explainer written through `explanatory-writing` gets no
  criteria and no reader) and the PR cites it.
- **D-23 The description of `guardrails` is 681 characters, not 685 (corrects Context and
  D-1).** Counted as the lint counts it (`tools/repo_lint/lint.py`, `description_length_report`:
  the length of the parsed frontmatter value). The edits of D-1 are right as counted there: 24
  and 35 more, 53 fewer, six more in all. The description ends at 687 characters, not 691. Task
  1.5 cites 687.
- **D-24 Names shared with the siblings, and A's terms (bears on D-2, D-4, D-10, D-11).**
  - `evidence/baseline.md`: `test-suite-care` had a file of that name with another meaning and
    renames its own. This change keeps the name.
  - Three readers exist. The *adversarial reader* (this change; brief in `guardrails`; answers
    `ROB`; tries to break a draft against confirmed criteria). The *cold reader*
    (`technical-writing`, `CHK-33`; answers `CLR`; follows a page with nothing else). The
    *recipient-reader* (`sales-operations`, `CHK-95`; answers `CLR`; ten fixed questions). Text
    of this change never says "the reader" where two of them could be meant. The near-miss probe
    of D-12 ("have a cold reader test this installation manual", expects `technical-writing`)
    already separates the first two, so no probe is added.
  - "Profile": here, a `## Review profile` section of a skill (D-2). The sibling
    `activity-test-profiles` uses the word in its title for sets of matrix rows. In A's terms a
    profile of this change is one *check* (a `CHK` id) with two rows, its *technique owner* the
    skill that holds the section, its *tool* the brief, its *stance* the adversary. Tasks and
    spec deltas use A's terms for matrix matters and "profile" only for the section.
  - "Accepted": in A it is a row *status* (a gap left open by a person, with the reason). This
    design also writes "accepted" for risks the owner took (RISK-2, RISK-3, RISK-8, RISK-11).
    Those are not statuses and no row follows from them. Only the `ADQ` row of D-10 has the
    status `accepted`.
- **D-25 Two pairs of checks that look alike, and how each divides the work (bears on D-3 and
  D-4).** Neither older check is removed or edited.
  - `CHK-102` *Governing-thought readiness test* (`executive-communication`, `VAL` and `CLR`,
    before drafting) and the new criteria step. `CHK-102` is the author's diagnosis: who
    decides, what they believe, the one sentence. The criteria step comes after it (D-3:
    "*Start here*, after the three questions") and turns the diagnosis into a success and a
    failure line that the owner confirms. The first is answered by the author, the second is
    decided by the owner.
  - `CHK-95` *Sales recipient-reader* (`sales-operations`, `CLR`) and the busy-recipient
    adversarial reader (`sales-conversations`, `ROB`). `CHK-95` runs on scheduled and attended
    runs, with ten fixed questions and no criteria. The adversarial reader runs only in an
    attended session, at pick-up included, against the criteria the owner confirmed (D-4). A
    draft picked up from a scheduled run may so be read by both; that is intended, since they
    answer different questions.

  *(proposed, the owner confirms at scenario sign-off)*: both older checks stay as divided here,
  and neither is folded into the new step.
- **D-26 Order and rebase (adds to D-13 and D-10).** This change may land at any time after A,
  before or after B, C and E. After each rebase on `develop` the lead reruns `make bundles` and
  `make skill-inventory`, reads R-1..R-12 again (task 1.1), and takes the next five free check
  ids at task 3.1; `CHK-145` to `CHK-149` hold only if no sibling has taken them.

## Open Questions

None.
