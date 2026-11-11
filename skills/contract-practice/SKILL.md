---
name: contract-practice
description: Use this skill when drafting, revising or aligning a contract in a contract repository — "draft the freelance contract for this mission", "the client sent back their version", "does this match the client addendum", "this clause keeps being overridden, propose a new version"; it runs the contract workflow (intake interview, skeleton and variant choice from the library's own guidance, alignment with parent and back-to-back contracts, sorting counterparty changes, clause proposals with sources and reasons) and lists the points a qualified lawyer must review. Not for commercial offers or negotiation strategy (proposal-writing, sales-conversations).
license: Apache 2.0
metadata:
  purpose: contracts
  area: legal
  subject: generic
  posture: precise
  stage: any
  maturity: experimental
---

# Contract Practice

The judgement no contract repository can hold: what to ask, which skeleton and variant to use, what
must agree with what, how to sort a counterparty's changes, and when a point needs a qualified
lawyer. The repository holds everything else (its clause library, drafting style, lifecycle,
commands, checks and immutability rules) in its own `AGENTS.md` and docs. Read those first, through
`corpus-repository`, and follow them; this skill never restates them.

## Quick Start

All names and figures below are fabricated.

**Input.** The owner, in a session started in the contract repository: "Draft the freelance contract
for the data-migration mission with our consultant. It mirrors the client addendum we signed last
week."

**What you do.**

1. *Intake.* From the request and the addendum you learn: the parties (the company and a
   freelance consultant), the client addendum as the back-to-back contract, the scope, the start
   date. You ask in one round: the consultant's legal form, the daily rate, the notice period. The
   owner gives the rate and the form; the notice period is unknown.
2. *Draft.* The library's guidance points to the freelance-mission skeleton and its
   fixed-duration variant. You draft on a branch, by the repository's own commands, and mark the
   notice period *to be confirmed*.
3. *Align.* The mission states **60 days** at the daily rate; the client addendum states **40
   days**. You change neither number.
4. *Review.* The addendum's liability cap is lower than the library's default for freelance
   missions. You add it to the lawyer-review list.

**Output.** A PR in the contract repository whose description carries:

```
Open points (to be confirmed by the owner)
1. Days: mission 60, client addendum 40. Back-to-back requires one figure; which is right?
2. Notice period: not given; drafted as TO BE CONFIRMED.

For a qualified lawyer
1. Liability cap: the addendum caps lower than our default; check the back-to-back exposure.
```

The owner answers, and you revise on the same branch. Nothing is sent or signed by you.

## The contract workflow

The workflow is the file [`assets/workflows/contract.workflow.json`](assets/workflows/contract.workflow.json);
loading this skill starts it. It is provisional and has no gates: the contract repository adds its
gates, and may turn strict, with its own workflow file that extends this one. Each piece of work is
one branch and one PR in the contract repository.

| Phase | What happens | Evidence |
|---|---|---|
| intake | The interview: what is being agreed, between whom, under which parent or back-to-back contract | the open questions answered or marked |
| draft | Choose skeleton and variant from the library's guidance; draft with unknowns marked | the draft on a branch |
| align | Check the draft against its parent and back-to-back contracts | open points in the PR |
| review | Read it whole; build the lawyer-review list | the list in the PR |
| negotiate | Sort counterparty changes; revise; sending is the owner's act | revisions on the branch |
| sign | Signing and registering are the owner's acts, by the repository's process | the owner's confirmation |
| harvest | Propose library changes from what the contract taught | a proposal PR, or none |

### Intake interview

Ask before drafting, in one round, only what the documents in hand do not answer:

- the parties and their roles (who supplies, who pays);
- the contract's kind, and whether a parent contract (a framework, a master agreement) or a
  back-to-back contract (the client side of a subcontract) governs it;
- the commercial values: duration, volume, price, payment terms;
- anything the owner already knows to be unusual.

A value nobody gives you is drafted as *to be confirmed*, never guessed.

### Skeleton and variant

The library says which skeleton and which variant fit which situation. Read that guidance and
follow it; cite it in the PR ("variant chosen per the library's guidance on fixed-duration
missions"). When the guidance does not decide the case, choose the closest and say so as an open
point. Never write a clause from scratch when the library has one.

### Alignment

A contract must agree with its parent and back-to-back contracts on everything they share: parties,
scope, duration and volume, price basis, liability, confidentiality, termination and notice,
governing law. For each disagreement:

- report it as an open point naming both documents and both values;
- **never change a number** or a term to make them agree; which one is right is the owner's decision.

### Counterparty changes

Read the counterparty's version against the draft, change by change, and sort each one:

| The change | What you propose |
|---|---|
| changes legal effect (removes a cap, shifts a risk, adds an obligation) | the library's matching variant, or an override with its reason |
| keeps the effect, words it better | accept it locally, and note it for harvest as a candidate version |
| keeps the effect, words it worse or unclearly | keep ours, and say why in one line |

Cite the clause for every change, and say which kind it is. A change of legal effect always reaches
the owner, even when the library has a variant for it.

### Proposals

Every proposal (a variant chosen, an override, a new clause version) names its sources (the
library's guidance, the clause, the earlier contracts) and its reason. A proposal without a source
is an opinion; mark it as one.

### Lawyer-review flag

Add a point to the *For a qualified lawyer* list when:

- a change of legal effect has no matching variant in the library;
- the contract departs from the library's defaults on liability, indemnity, intellectual property,
  personal data, non-compete or governing law;
- the parent or back-to-back contracts leave the company exposed on one side and not the other;
- the question turns on how the law reads, not on what the library says.

Your output is a draft for the owner, never final legal advice; say so when asked for an opinion.

### Harvest

When the same clause was overridden in several contracts, open a PR proposing a new version or
variant that names each source contract and the reason. Nothing enters the library until the owner
merges it. One proposal per PR, unless the repository's own rules say otherwise.

## Gotchas

- **Copying the repository's rules.** Its commands, layout and lifecycle live in its `AGENTS.md`;
  cite them at the point of use and read them each session, since they change.
- **Fixing a mismatch.** Making the days agree looks helpful and breaks one of two signed
  commitments. Report; do not reconcile.
- **Treating wording as effect, or effect as wording.** A "clarified" limitation clause that drops
  a cap is a change of legal effect. Read what each party can claim before and after.
- **Acting outside the company.** Sending, signing and registering are the owner's acts; prepare
  them, name the repository's command, and wait for the owner to confirm that one action.

## Boundary & Related Skills

**Owns:** the contract workflow; the intake interview; skeleton and variant choice by reading the
library's own guidance; alignment with parent and back-to-back contracts; sorting counterparty
changes; proposals with sources and reasons; the lawyer-review flag; harvesting clause proposals.

**Does NOT own:** the contract repository's rules, layout, commands, clause model and drafting style
(the repository's own `AGENTS.md` and docs); how to operate a material repository
(`corpus-repository`); negotiation strategy, commercial terms and the decision to send, sign or
register (the owner's).

**Related:** `corpus-repository` (how to work in the contract repository by its own instructions),
`proposal-writing` (the commercial offer a contract often follows), `sales-conversations`
(negotiating with the client before terms reach the contract).
