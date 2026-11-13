<!-- STATUS: EPIC shaped 2026-11-13 from the owner's conversation (inputs/seed.md, inputs/qa.md).
     EPIC D of four: A test-strategy → B harden-checks-and-tests → C activity-test-profiles → D
     (this). Not yet readiness-checked; PLAN not derived. It is derived when its epic session
     starts, after A is delivered; it does not depend on B or C. DEC-5 is the shaper's proposal and
     awaits the owner's confirmation. -->

# EPIC: generic task test profiles

**Parents:** EPIC A [`test-strategy`](../test-strategy/proposal.md) (the loop, the adversary stance
and the `generic-writing` rows this EPIC fills); the owner's requests of 2026-11-13
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
  before drafting; an unattended run uses the criteria recorded for that kind of task and asks
  nobody — rejected: stated without confirmation; confirmation for offers and contracts only (Q-4).
- **DEC-5** *(proposed, awaits the owner)*: The adversarial reader's brief is written once, in
  `technical-writing` beside the cold reader, because both are fresh-reader techniques with the
  same mechanics. Each owning skill supplies its reader's role and what it attacks:
  `proposal-writing` (sceptical buyer), `contract-practice` (opposing counsel), `meaningfy-voice`
  (stranger scrolling), `executive-communication` (busy recipient) — rejected: a copy of the brief
  in each skill; the brief in `test-strategy`, which owns the stance but no technique (A's DEC-5).
- **DEC-6**: D proves three things (Q-5): for each of the four kinds, the same task done with and
  without the profile, the difference recorded; the reader finds a planted flaw (a scope and price
  mismatch in an offer, a one-sided clause in a contract); each technique sits in its owning skill
  and `test-strategy` gains only rows.
- **DEC-7**: Mitigated risks (Q-6): checks that slow daily work (one line of criteria; the reader
  only where DEC-3 makes it mandatory); a reader that is theatre (it reports only against the
  stated criteria, with quotes, and the baseline of DEC-6 compares with and without). Accepted
  risk: client-confidential text passes through reader subagents; they run in the same session
  with the same permissions and send nothing outside.

## Rabbit-holes

- **Criteria that say nothing.** "The offer is convincing" cannot fail. A criterion names the
  reader and what they do or decide.
- **A reader that rewrites.** It reports; the author revises. A reader that returns a new draft has
  left its brief.
- **Contracts are not legal advice.** The opposing-counsel reader finds one-sided or risky clauses
  for the owner and the lawyer worker to decide; it does not approve a contract.
- **"Leaves the company"** needs one plain test: will someone outside Meaningfy read it? A draft
  for internal review does not count until it is about to be sent.
- **Unattended runs.** DEC-4 gives them recorded criteria; the sales agent's own behaviour is not
  changed here (No-gos).

## No-gos

- No scored rubric and no pass mark.
- No new agent; the reader is a brief for a fresh general-purpose subagent.
- No change to the sales agent's scheduled runs or to any worker's workflow phases.
- No legal advice, and no reader verdict that replaces the owner's or the lawyer worker's decision.
- No documentation, DevOps, UI, modelling or architecture checks (C); no software checks (B).
- No change to `test-strategy`'s questions, stances or matrix shape (A); only its rows.

---

## What Changes

- `technical-writing`: the adversarial reader's brief, beside the cold reader (DEC-5).
- `proposal-writing`, `contract-practice`, `meaningfy-voice`, `executive-communication`: each gains
  its criteria step, its reader's role and what the reader attacks.
- `test-strategy`: the `generic-writing` rows for `VAL` and `ROB` become `exists`.
- Trigger probes for each description that changes.

## Capabilities

### New Capabilities
<!-- None: every change lands in an existing capability. -->

### Modified Capabilities
- `test-strategy`: the `generic-writing` rows.
- `documentation-workflow`: the adversarial reader's brief.
- `legal-contract-practice`: the contract profile.
- `executive-communication`: the message profile.
- `sales-method-ownership`: the offer profile.

## Impact

- Skills: `technical-writing`, `proposal-writing`, `contract-practice`, `meaningfy-voice`,
  `executive-communication`, `test-strategy`.
- Agents that write such pieces (`proposal-writer`, `lawyer`, `sales-agent`) follow the profile
  through their skills; no agent file changes.
- Order: after A. Independent of B and C.
