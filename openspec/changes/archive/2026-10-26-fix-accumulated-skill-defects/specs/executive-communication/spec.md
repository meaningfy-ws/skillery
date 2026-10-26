## ADDED Requirements

### Requirement: The register is chosen by purpose, including binding text

`executive-communication` SHALL select the register by the purpose of the artefact, stated before
drafting: teach (technical register), decide (executive register) or bind (formal and contractual
register, for quotations, offers, statements of work and tenders). The bind register SHALL use full
sentences, defined terms and neutral commitment verbs, SHALL route to the Contract/specification genre
of `writing-antipatterns` for its defects, and SHALL state that plain vocabulary does not mean casual
tone. For a contractual document, the skill SHALL write only the cover message or the executive
summary; the document's structure belongs to the offer skill. A client-facing document SHALL use the
company brand assets, named by their location in the company resources and never by a local path. The
worked examples SHALL span at least two service lines, so that no single domain becomes an implicit
default.

#### Scenario: A quotation is requested

- **WHEN** the user asks for help with a formal quotation
- **THEN** the skill states the bind register, writes only the cover message or summary, and does not
  impose the pitch structure on the quotation

#### Scenario: A board paper is requested

- **WHEN** the user asks for a board recommendation
- **THEN** the skill states the decide register and applies the answer-first structure
