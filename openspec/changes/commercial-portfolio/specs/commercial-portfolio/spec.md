## ADDED Requirements

### Requirement: Skills work from a package document and the general rules
The skills that coach, frame or produce a sale (`semantic-consulting-coach`, `proposal-writing`,
`decision-package`) SHALL work from the context the user gives (whom the work addresses and what is
being sold or proposed), the company's general commercial rules, and the package document that
matches. They SHALL NOT carry any one package's prices, terms or nuances in their own text. When the
skill does not know where the packages live, it SHALL ask.

#### Scenario: A proposal for a named package
- **WHEN** the user asks for a proposal for a Luxembourg SME client and names the package to offer
- **THEN** the skill reads that package's document, and the offer, stages, prices and perks in the proposal come from it, with the general rules applied

#### Scenario: Where the packages live is unknown
- **WHEN** the skill needs a package and does not know where the packages are kept
- **THEN** it asks the user where they live, or for the document itself, and invents no commercial terms

### Requirement: Every package document follows one light template
skillery SHALL hold one package template listing the fields every package document fills in, and
SHALL NOT hold any package's prices or terms. When a skill reads a package document, it SHALL name
any template field the document lacks instead of filling it in.

#### Scenario: A package without a price
- **WHEN** the package document the user names has no price and pricing basis
- **THEN** the skill reports the missing field and asks, and does not estimate a price
