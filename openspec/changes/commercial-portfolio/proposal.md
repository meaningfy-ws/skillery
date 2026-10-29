<!-- STATUS: EPIC shaped 2026-10-29 from the owner's request and answers of the same day
     (inputs/qa.md). Where the packages live is decided later, outside git. Next: the PLAN; the
     owner's Luxembourg SME package is the first real input. -->

# EPIC: A commercial portfolio of packages

**Parents:** the archived EPIC [`define-blc-engagement-model`](../archive/2026-10-29-define-blc-engagement-model/proposal.md),
whose engagement model this change generalises from one package to many, and the durable specs
`engagement-model` and `sales-method-ownership`.

## Appetite

**LARGE.** Several related capabilities move: a package structure and the company's general
commercial rules, kept in skillery; packages kept as documents outside git; and three skills
(`semantic-consulting-coach`, `proposal-writing`, `decision-package`) revised so that they read a
package instead of carrying one. If the work starts to price deals automatically, change the CRM,
build a store for the packages, or need a package the owner has not supplied, it has overrun this
appetite.

## Why

Meaningfy sells more than one commercial package, and will sell more: one for SMEs in the
Luxembourg market, one for corporations in the EU market, one for life sciences, and others. The
skills that coach, frame and produce a sale today carry **one** package's specifics as if they were
the company's only offer: the stages, the Proof of Value's 4–6 weeks and safeguards, the Decision
Package as its deliverable, the fixed-frame SoW. An agent writing a proposal for a life-sciences
client would describe the wrong offer, with no way to know.

Packages also change often (prices, perks, nuances), and the people who maintain them work in
documents, not in a git repository.

## Solution outline

- **Two layers.**
  - **General commercial rules**, true for every package: how presale, the sale and the offering
    work at Meaningfy. They stay in skillery, in the skills that own them.
  - **Packages**, each with its own nuances, prices and perks. They live as documents outside git,
    where the owner keeps them (Google Drive, Confluence or elsewhere, decided later).
- **One package structure, light and growing.** skillery holds a package template: a short list of
  fields every package document fills in (proposed below). It holds the shape, never a package's
  prices or terms. The fields are expected to change as real packages arrive.
- **The user gives the context; the skill fetches the package.** The user says whom the work is for
  and what is being sold or proposed. The skill asks where the packages live if it does not know,
  reads the matching package document through the connector available in the session, and checks it
  against the template, naming any missing field rather than inventing it.
- **Skills read a package; they do not carry one.**
  - `semantic-consulting-coach` keeps the general rules and coaches the conversation.
  - `proposal-writing` frames the offer of the package in hand.
  - `decision-package` produces a decision deliverable when the package calls for one.
  - Their method stays theirs; a package's commercial facts come from its document.
- **Today's package becomes a document.** The current specifics (Presale, Discovery & Onboarding at
  two depths, Scaling, the Proof of Value's duration and safeguards) leave
  `engagement-lifecycle.md`. What is general stays as a rule; what belongs to this package is handed
  to the owner as its first package document. The owner's Luxembourg SME package is the second, and
  the test that the template holds more than one.
- **Outcome:** for any client, the agent works from the package the user names and the general
  rules, and states the source of every commercial fact it uses.

## The package template (proposed fields)

Enough to write a proposal from, no more. Each is one short entry in the package document.

| Field | Holds |
|---|---|
| Offer name | the named, irresistible offer; one offer may hold several packages |
| Package name | this package within the offer |
| Market and segment | for example Luxembourg SMEs, EU corporations, life sciences |
| Who it addresses | the buyer and the people it serves, by role |
| Problem it solves | the pains, in the client's words |
| Promise | the outcome the client gets |
| What is included | the stages or steps, each with its deliverable and duration |
| Price and pricing basis | the price, currency, and what it is based on (fixed, per stage, per person) |
| Perks and guarantees | bonuses, safeguards, what happens if the outcome is not reached |
| Terms | payment, validity, conditions |
| Proof | references, cases, figures the package may cite |
| Status and review date | draft, active or retired, and when it was last checked |

## Key decisions

- **DEC-1** (owner, 2026-10-29): Meaningfy has several commercial packages and structures,
  maintained as a whole and evolving. `proposal-writing`, `semantic-consulting-coach` and
  `decision-package` are revised so that they do not capture only one package.
- **DEC-2** (owner, 2026-10-29): Today's position does not change while this is built: presale is
  the only free stage, and the latest vocabulary stands.
- **DEC-3** (owner, 2026-10-29): Packages do not live in git. Where they live (Google Drive,
  Confluence or elsewhere) is decided later; the skill asks where they are.
- **DEC-4** (owner, 2026-10-29): There are general rules for presale, the sale and the offering,
  and each package has its own nuances, prices and perks. The general rules are written once; the
  nuances live in the package.
- **DEC-5** (owner, 2026-10-29): The user provides the context: whom the work addresses and what is
  being sold or proposed. The skill does not choose the package.
- **DEC-6** (owner, 2026-10-29): Who maintains the packages is outside this change; they are simply
  available somewhere. Whether a package has a decision deliverable is decided per package.
- **DEC-7** (proposed): skillery holds the package template and the general rules, never a
  package's prices or terms. Rejected: no template at all (every package would differ, and the skill
  could not tell a missing price from a free stage).
- **DEC-8** (proposed): Building blocks stay one shared services catalogue in skillery; a package
  names the blocks it sells instead of describing them.

## Rabbit-holes

- **Over-modelling.** The template must fit the packages the owner supplies, starting with two.
  Twelve fields is the starting point, not a schema to enforce.
- **Splitting general from specific.** Today's `engagement-lifecycle.md` mixes the two. Every
  sentence moved out must be either a general rule or a package fact; the owner confirms the split.
- **Specs that name one package.** `engagement-model` and `sales-method-ownership` state the current
  package's facts as requirements. They are rewritten as general rules or retired into the package,
  without losing the decisions they record.
- **Connectors.** Reading a Drive or Confluence document depends on the connector in the session,
  and both CLIs differ. The skill must work from a pasted or exported document too.
- **Estimation.** `estimation` prices effort; a package states a price. Keep the two apart.

## No-gos

- No package, price or term committed to skillery (it is a public repository).
- No store, sync or database for packages.
- No automatic pricing or quoting engine, and no change to Odoo or the sales pipelines.
- No package invented by the agent: every package comes from the owner.
- No change to today's position while this is built (DEC-2).
- No skill per package.

---

## What Changes

- A package template and the general commercial rules, in the skills that own them.
- `semantic-consulting-coach`: `engagement-lifecycle.md` keeps the general rules only; today's
  package specifics are handed to the owner as a package document.
- `proposal-writing` and `decision-package`: descriptions, bodies and templates work from the
  package in hand and the user's context, and ask where packages live. Trigger probes follow the
  description changes.
- `docs/practice/ai-sales/`: the services catalogue and runbook point to the general rules and the
  template.
- The specs `engagement-model` and `sales-method-ownership` are revised to hold for any package.

## Capabilities

### New Capabilities

- `commercial-portfolio`: the package template, the general rules, and how skills read a package.

### Modified Capabilities

- `engagement-model` and `sales-method-ownership`: decided in the PLAN.

## Impact

- Three skills in `meaningfy-consulting` and `meaningfy-sales` change; the coach keeps the general
  rules and hands package facts to documents.
- Sessions need access to wherever the packages live, or a pasted package; without one, the skill
  says so and asks.
