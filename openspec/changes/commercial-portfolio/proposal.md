<!-- STATUS: EPIC shaped 2026-10-29 from the owner's request of the same day (inputs/qa.md).
     Six questions are open for the owner (Q-1 to Q-6); answer them before the PLAN. The first
     package (Luxembourg SMEs) is the owner's next input. -->

# EPIC: A commercial portfolio of packages

**Parents:** the archived EPIC [`define-blc-engagement-model`](../archive/2026-10-29-define-blc-engagement-model/proposal.md),
whose engagement model this change generalises from one package to many, and the durable specs
`engagement-model` and `sales-method-ownership`.

## Appetite

**LARGE.** Several related capabilities move: a new portfolio of commercial packages with one shared
structure, and three skills (`semantic-consulting-coach`, `proposal-writing`, `decision-package`)
revised so that they read a package instead of carrying one. Facts migrate out of
`engagement-lifecycle.md` into the first package. If the work starts to price deals automatically,
change the CRM, or need a package before the owner supplies it, it has overrun this appetite.

## Why

Meaningfy sells more than one commercial package, and will sell more: one for SMEs in the
Luxembourg market, one for corporations in the EU market, one for life sciences, and others. The
skills that coach, frame and produce a sale today carry **one** package's specifics as if they were
the company's only offer: the stages, the Proof of Value's 4–6 weeks and safeguards, the Decision
Package as its deliverable, the fixed-frame SoW. An agent writing a proposal for a life-sciences
client would describe the wrong offer, with no way to know.

The packages also need to evolve together. A change in one structure (a new stage, a revised
safeguard) should be visible against the others, reviewed and versioned, not scattered across
skill references.

## Solution outline

- **One portfolio, many packages.** A portfolio holds every current commercial package, each in one
  file with the same structure: who it is for (market, segment, sector), its stages and what each
  costs or delivers, durations, deliverables, safeguards, pricing basis, and terms. A package is
  added, revised or retired through review, and the portfolio keeps a change history.
- **One structure, checked.** The shared package structure is defined once, and a check confirms
  every package follows it, the way the catalogue already checks skills and use cases.
- **Skills read a package; they do not carry one.**
  - `semantic-consulting-coach` coaches the boundary and the choice of package from the portfolio.
  - `proposal-writing` frames the offer of the package chosen for the client.
  - `decision-package` produces the decision deliverable of any package that has one.
  - Their method stays theirs; the package's commercial facts come from the portfolio.
- **Today's package becomes the first entry.** The current model (Presale, Discovery & Onboarding,
  Scaling) moves from `engagement-lifecycle.md` into the portfolio unchanged, as one package. The
  Luxembourg SME package the owner supplies next is the second, and the test that the structure
  holds more than one.
- **Outcome:** for any client, the agent names the package that applies and frames, coaches and
  produces against that package's facts, and the owner maintains all packages in one place.

## Key decisions

- **DEC-1** (owner, 2026-10-29): Meaningfy has several commercial packages and structures, kept in
  one repository, maintained as a whole and evolving. `proposal-writing`, `semantic-consulting-coach`
  and `decision-package` are revised so that they do not capture only one package.
- **DEC-2** (owner, 2026-10-29): Today's position does not change while this is built: presale is
  the only free stage, and the latest vocabulary stands.
- **DEC-3** (proposed): Packages are data, not skills. One file per package in a fixed structure,
  read by the skills; no skill per package and no package text inside a skill. Rejected: one
  reference file per package inside `semantic-consulting-coach` (it ties the portfolio to one
  skill and one bundle).
- **DEC-4** (proposed): Building blocks stay one shared catalogue. Packages reference the services
  catalogue's building blocks by name rather than copying them, so a block is described once.

## Open questions (answer before the PLAN)

- **Q-1 Where the portfolio lives.** skillery is a **public** repository. Packages carry prices,
  terms and market positioning. Options:
  1. a private repository (for example `meaningfy-ws/commercial-portfolio`) that the skills find
     through a setting, the way the rule skills find the vault (recommended);
  2. skillery itself, with prices and terms left out;
  3. the owner's vault.
- **Q-2 The package structure.** Which fields does every package have? Proposed: name, status
  (draft, active, retired), market, segment, sector, language, stages (each with name, free or paid,
  duration, deliverable, exit), pricing basis, safeguards, terms, the building blocks it sells, and
  owner. Your Luxembourg SME package will test it.
- **Q-3 What is shared across packages.** Is "presale is the only free stage" a company rule for
  every package, or a property of each? The same question for the safeguards and the calendar-boxed
  frame.
- **Q-4 Choosing the package.** How does a session know which package applies to a client: the
  client's market and segment in Odoo (`sales-accounts`), the user naming it, or the coach asking?
- **Q-5 Who maintains it.** Who may add or change a package, and is every change approved by you
  through a pull request?
- **Q-6 The Decision Package.** Is the Decision Package a deliverable of some packages only, or the
  company's standard decision deliverable that every package ends its first paid stage with?

## Rabbit-holes

- **Leaking prices into a public repository** (Q-1). Nothing commercial is committed to skillery
  until Q-1 is answered.
- **Over-modelling.** The structure must fit the packages the owner actually supplies, starting with
  two. A rich schema built before the second package exists will be wrong.
- **Specs that name one package.** `engagement-model` and `sales-method-ownership` state the current
  package's facts as requirements. They must be rewritten as requirements on any package, or moved
  into the package, without losing the decisions they record.
- **Estimation.** `estimation` prices effort; a package states a pricing basis. Keep the two apart.

## No-gos

- No automatic pricing or quoting engine.
- No change to Odoo or the sales pipelines.
- No package invented by the agent: every package comes from the owner.
- No change to today's position while the portfolio is built (DEC-2).
- No skill per package.

---

## What Changes

- A portfolio of packages with one structure and a check, in the location Q-1 decides.
- `semantic-consulting-coach`: `engagement-lifecycle.md` becomes package-agnostic; today's package
  moves into the portfolio.
- `proposal-writing` and `decision-package`: descriptions, bodies and templates read the chosen
  package instead of naming one offer. Trigger probes follow the description changes.
- `docs/practice/ai-sales/`: the services catalogue and runbook point to the portfolio.
- The specs `engagement-model` and `sales-method-ownership` are revised to hold for any package.

## Capabilities

### New Capabilities

- `commercial-portfolio`: the packages, their shared structure, and how skills read them.

### Modified Capabilities

- `engagement-model` and `sales-method-ownership`: decided in the PLAN, once Q-1 to Q-6 are answered.

## Impact

- Three skills in `meaningfy-consulting` and `meaningfy-sales` change; the coach loses commercial
  facts to the portfolio.
- If Q-1 chooses a private repository, the skills gain one setting to find it, and sessions without
  it say so once and carry on, as the rule skills do without a vault.
