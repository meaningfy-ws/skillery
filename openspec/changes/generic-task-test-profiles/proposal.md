<!-- STATUS: EPIC shaped 2026-11-13 from the owner's conversation (inputs/seed.md, inputs/qa.md).
     EPIC D of five (E, `test-suite-care`, was added on 2026-11-14): A test-strategy → B harden-checks-and-tests → C activity-test-profiles → D
     (this). Not yet readiness-checked; PLAN not derived. It is derived when its epic session
     starts, after A is delivered; it does not depend on B or C. Readiness-checked 2026-11-13; the
     fixes and the owner's second round (Q-7..Q-9) are folded in. PLAN derived 2026-11-14 from A's
     gated design, before A's delivery. The owner's third round (Q-10..Q-13) amended two statements,
     logged as DEC-8 and DEC-9: Capabilities and Impact below follow them. After the attack on the
     PLAN, Q-14 narrowed DEC-4 and one no-go, logged as DEC-10. No other DEC changed. Clarity gate
     9.0/10 PASS on the fifth run by an independent scorer. After that gate the owner's Q-15
     re-shaped the proofs and the reader's output, logged as DEC-11, which narrows DEC-6; the
     PLAN was gated again, 9.1/10 PASS. A was delivered and archived the same day and the PLAN
     was checked against its files. Ready for delivery. Revised 2026-11-14 by owner decision
     (the reader's tool list), logged as DEC-12, which narrows one no-go; not gated again.
     Revised 2026-11-15 after the owner's settlement of the open EPICs
     (`../delivery-process-and-tools/inputs/reassessment-2026-11-15.md`): the reader's tools come
     from the one table of `guardrails` (R3 DEC-8), `guardrails` keeps its size budget, and the
     order is wave 2; design D-28 to D-32; not gated again. Also on 2026-11-15, the owner agreed to
     drop the baseline tallies O-1 to O-4 and the cost sign-off (design D-33); the baseline keeps
     its pairs and O-5. -->

# EPIC: generic task test profiles

**Parents:** EPIC A [`test-strategy`](../archive/2026-11-14-test-strategy/proposal.md) (the loop,
the adversary stance and the `generic-writing` rows this EPIC fills); the owner's requests of
2026-11-13 and 2026-11-14
(`inputs/seed.md`, `inputs/qa.md`).

## Appetite

**LARGE.** Four kinds of work across five skills gain a profile, one new shared technique appears
(the adversarial reader), and a step becomes mandatory for anything that leaves the company. If the
work starts writing scored rubrics, or changing what the sales agent does on its scheduled runs, it
has overrun.

## Why

The owner: "for each activity we execute we shall know when/how we fail and how we succeed", and
this includes "sales, linkedin post writing, writing legal contracts". Today an offer, a contract, a
post or a client message is drafted and then judged by feel. Nothing states beforehand what would
make it fail, nobody reads it as the other side would, and the inventory shows it: for generic
writing there is no robustness check at all, and nothing states success before a post or a contract
is drafted.

## Solution outline

Every offer, contract, public post and message follows the same three steps.

1. **Criteria first.** Before drafting, the agent proposes in one or two lines how the piece
   succeeds and how it fails. For anything that leaves the company the owner confirms or corrects
   them in one line. Outcome: the draft is written against something that can be checked.
2. **An adversarial reader.** A fresh reader with a role tries to break the draft and reports only
   against the stated criteria, quoting the text: a sceptical buyer for an offer, opposing counsel
   for a contract, a stranger scrolling for a post, a busy recipient for a message. Mandatory for
   anything that leaves the company; on request for internal messages.
3. **The existing checks.** The owner's rules with check patterns (`rulebook check`) and the genre
   defects (`writing-antipatterns`) run as they do today.

A failed criterion sends the work back to the draft. Each owning skill says what its reader attacks;
`test-strategy` gains the rows.

## Key decisions

- **DEC-1**: Four kinds of work get a profile: offers and proposals; contracts; posts and public
  writing; client and internal messages (Q-1).
- **DEC-2**: A profile is criteria stated before drafting, one adversarial reader, and the existing
  rule checks — rejected: a scored rubric per genre; both (Q-2).
- **DEC-3**: The adversarial reader is mandatory for anything that leaves the company (offers,
  contracts, public posts, client messages) and on request for internal messages — rejected:
  offers and contracts only; always; never mandatory (Q-3).
- **DEC-4**: For anything that leaves the company the owner confirms the criteria in one line
  before drafting. Unattended runs are unchanged: a draft made by a scheduled run gets its criteria
  and its reader when the owner picks it up to send, so nothing leaves the company unchecked and
  every `VAL` row is still decided by a person — rejected: stated without confirmation;
  confirmation for offers and contracts only; standing criteria recorded per kind of task (Q-4,
  Q-7).
- **DEC-5**: The adversarial reader's brief is written once, in `guardrails`, with the subagent
  dispatch and brief rules (the owner's choice, Q-9). Each owning skill supplies its reader's role
  and what it attacks:
  `proposal-writing` (sceptical buyer), `contract-practice` (opposing counsel), `meaningfy-voice`
  (stranger scrolling; it fills its LinkedIn and blog channel, today a placeholder, with the
  criteria and the reader's role), `executive-communication` (busy recipient, for decision requests
  and internal messages) and `sales-conversations` (busy recipient, for sales emails and
  follow-ups to clients) — rejected: `technical-writing` beside the cold reader;
  `writing-antipatterns`; a copy of the brief in each skill; the brief in `test-strategy`, which
  owns the stance but no technique (A's DEC-5).
- **DEC-6**: D proves four things (Q-5, Q-8): for each of the four kinds, the same task done with
  and without the profile, the difference recorded; the reader finds a planted flaw (a scope and
  price mismatch in an offer, a one-sided clause in a contract); each technique sits in its owning
  skill and `test-strategy` gains only rows; and one Gherkin scenario per agent whose behaviour
  changes (`proposal-writer`, `lawyer`, `sales-agent`) under `tests/features/`, as the repository's
  rule requires.
- **DEC-7**: Mitigated risks (Q-6): checks that slow daily work (one line of criteria; the reader
  only where DEC-3 makes it mandatory); a reader that is theatre (it reports only against the
  stated criteria, with quotes, and the baseline of DEC-6 compares with and without). Accepted
  risk: client-confidential text passes through reader subagents; they run in the same session
  with the same permissions and send nothing outside. The third mitigated risk of Q-6, external
  styles and tools that change, belongs to C (its DEC-8).
- **DEC-8** (added 2026-11-14, Q-10): posts get a capability of their own, `company-voice`, for
  `meaningfy-voice` and its channel profiles — rejected: a second requirement in the
  `test-strategy` delta. This replaces "New Capabilities: none".
- **DEC-9** (added 2026-11-14, Q-11): `proposal-writer` and `sales-agent` gain the `Agent` tool so
  each can start its own reader — rejected: no agent file change, with the reader run by the
  calling session; the tool for `sales-agent` only. This replaces "no agent file changes". What a
  profile is still not applied on a scheduled run (DEC-4); no new agent is added.
- **DEC-10** (added 2026-11-14, Q-14): with the tool, the sales agent's scheduled runs may start the
  three reviewers `sales-operations` already names, so runs recorded *unverified* become verified —
  rejected: starting subagents in human sessions only; no tool for `sales-agent`. This narrows
  "unattended runs are unchanged" (DEC-4) to: no criteria step and no adversarial reader on an
  unattended run.
- **DEC-11** (added 2026-11-14, Q-15, after the PLAN was gated): this work is assessed, reviewed
  and revised, not tested with cases. The reader returns an assessment (findings against the
  criteria, each with a quotation) and no pass, fail or verdict; the author revises and the owner
  judges. Contracts and posts get no fixtures and no test cases: the contract profile is tried in
  the first real contract session. Of DEC-6's planted flaws only the offer's stays, as evidence
  made once and kept out of `tests/`; of its baselines, the contract's goes — rejected: the
  planted contract clause, the contract baseline, pass or fail per criterion.
- **DEC-12** (added 2026-11-14 by owner decision, after the PLAN was gated;
  [`cross-check-test-epics.md`](../delivery-retrospective/inputs/cross-check-test-epics.md),
  decision 2): the reader gets a named tool list: `Read`, `Grep` and `Glob` for prose, and also
  the code tools (Serena, ast-grep, GitNexus) where the piece read is code or a repository —
  rejected: a general-purpose subagent with every tool of the session, which starts heavier
  (about 11,500 tokens for the two workers in a test run, PR #234). This replaces "a fresh
  general-purpose subagent" in the No-gos.
- **DEC-13** (added 2026-11-14 by owner decision, after the PLAN was gated): the reader is a thin
  agent with that tool list, because only an agent definition makes a subagent start smaller; a
  line in a brief does not (design D-27) — rejected: the list in the brief only, with the heavy
  start accepted. This replaces "No new agent" for the reader; no other agent is added.
- **Revised 2026-11-15** (design D-28): DEC-12's list is not defined here. The reader takes the
  tools the one table of `guardrails` gives for reading prose (R3 DEC-8); the agent file still
  lists them in its frontmatter. DEC-13 stands.

## Rabbit-holes

- **Criteria that say nothing.** "The offer is convincing" cannot fail. A criterion names the
  reader and what they do or decide.
- **A reader that rewrites.** It reports; the author revises. A reader that returns a new draft has
  left its brief.
- **Contracts are not legal advice.** The opposing-counsel reader finds one-sided or risky clauses
  for the owner and the lawyer worker to decide; it does not approve a contract.
- **"Leaves the company"** needs one plain test: will someone outside Meaningfy read it? A draft
  for internal review does not count until it is about to be sent.
- **Unattended runs.** DEC-4 leaves them as they are; the profile starts when the owner picks the
  draft up. The sales agent's attended sessions do change (criteria first, a reader), which is why
  it has a scenario in DEC-6.

## No-gos

- No scored rubric and no pass mark.
- No pass, fail or verdict from the reader, and no test cases or fixtures for contracts or posts
  (DEC-11).
- No new agent other than the thin reader, which carries the tools the table of `guardrails` gives and no method
  (DEC-12 as revised, DEC-13; was: "No new agent; the reader is a brief for a fresh general-purpose subagent").
- No criteria step and no adversarial reader on the sales agent's scheduled runs (narrowed by
  DEC-10, which lets them start the reviewers they already name), and no change to any worker's
  workflow phases.
- No legal advice, and no reader verdict that replaces the owner's or the lawyer worker's decision.
- No documentation, DevOps, UI, modelling or architecture checks (C); no software checks (B).
- No change to `test-strategy`'s questions, stances or matrix shape (A); only its rows.

---

## What Changes

- `guardrails`: the adversarial reader's brief, with the dispatch and brief rules (DEC-5).
- `proposal-writing`, `contract-practice`, `meaningfy-voice`, `executive-communication`,
  `sales-conversations`: each gains its criteria step, its reader's role and what the reader
  attacks.
- `test-strategy`: the `generic-writing` rows for `VAL` and `ROB` become `exists`.
- Trigger probes for each description that changes; three agent scenarios under `tests/features/`.
- `agents/proposal-writer.md`, `agents/sales-agent.md`: the `Agent` tool and the `guardrails` skill
  (DEC-9).

## Capabilities

### New Capabilities
- `company-voice`: the post profile in `meaningfy-voice`'s LinkedIn and blog channels, and the
  trigger that finds it (DEC-8).

### Modified Capabilities
- `test-strategy`: the `generic-writing` rows.
- `subagent-dispatch`: the adversarial reader's brief.
- `legal-contract-practice`: the contract profile.
- `executive-communication`: the message profile.
- `sales-method-ownership`: a requirement that the offer profile is owned by `proposal-writing`,
  and the sales-message profile by `sales-conversations`.

## Impact

- Skills: `guardrails`, `proposal-writing`, `contract-practice`, `meaningfy-voice`,
  `executive-communication`, `sales-conversations`, `test-strategy`.
- Agents that write such pieces (`proposal-writer`, `lawyer`, `sales-agent`) follow the profile
  through their skills, and each gets a scenario. `proposal-writer` and `sales-agent` change
  (DEC-9); `lawyer` does not.
- Order: wave 2 of the order of 2026-11-15: after A, after R3 (the tool table) and after R1 stage
  1 (the lean standard), before the main part of R2 (design D-32). It lands before B, C and E.
- Size: `guardrails` may grow by at most 6 KB, to stay within 24 KB of prose (design D-29).
