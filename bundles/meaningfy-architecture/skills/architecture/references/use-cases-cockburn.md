# Use cases: Cockburn White and Blue

The conventions of a use case catalogue, after Cockburn's *Writing Effective Use Cases*, as a
reviewed catalogue (the Entity Resolution System, ERSys) settled them. The skeletons to copy are
`assets/use-case-template-white.adoc` and `assets/use-case-template-blue.adoc`.

## What the catalogue is

The authoritative specification of externally observable behaviour: what the system guarantees to
its actors, under which conditions, with which limits. A behavioural contract, not an API, a schema
or an implementation guide; it cross-references the contracts, ADRs and C4 views and never inlines
schemas or code. It is an annexe of the architecture document (ERSys: *Annexe B*), cross-linked with
the glossary and the ADRs.

## Two levels only

| | Cockburn label | States | Audience | Specified at |
|---|---|---|---|---|
| **White** | Summary | the contract: value and guarantees that always hold, degraded conditions included | reviewers, stakeholders | the C4 L1 boundary |
| **Blue** | User-goal | the realisation: how the value is fulfilled through internal responsibilities | implementers, integrators | the C4 L2–L3 responsibility boundaries |

This is a black-box/white-box split, not Cockburn altitude: White and Blue describe the same goal,
White as the black-box contract, Blue as its white-box realisation. A catalogue that needs altitude
aggregation (one summary over many user goals) adds that structure explicitly instead of overloading
White/Blue. Skip the subfunction and very-high-summary levels unless a shared sub-goal is referenced
by three or more use cases. Both levels stay technology-agnostic: Blue names responsibility
boundaries, idempotency rules and failure paths, never frameworks, protocols or wire formats.

## White states the contract, Blue realises it (DRY)

- A White use case is self-contained: the full contract.
- A Blue use case refines exactly one White parent. It opens with a cross-reference to the parent,
  names the shared elements (guarantees, scenarios, business rules) and states only the realisation
  deltas.
- One White may fan out to several Blue, one per realisation surface (sync API, async integration,
  bulk sync).
- A Blue page that repeats the White guarantees means the split failed: collapse or re-cut it.

## Numbering and anchors

- White `UC-W<n>`, anchor `[#uc-w<n>]`. Blue `UC-B<n>.<m>` refining `UC-W<n>`, anchor `[#uc-b<n>-<m>]`.
- The doctitle is the use case name and matches the catalogue index link exactly.

## The canonical skeleton

Every page has one `=` doctitle, then `==` sections in a fixed order; a section appears only when it
has content, always under this name and in this position. Metadata lines after the doctitle:
**Use Case Level**; **Primary Actor** (a glossary preferred term; the system itself may be primary
where a large use case is split); **Supporting Actors**, Blue only, the internal components each with
a one-line role (White has none); **Scope** (Blue narrows it to the realising surface).

Sections: Stakeholders and Interests; Brief Description; Preconditions; Trigger; Success Guarantee
(Postconditions); Minimal Guarantees (On Failure); Main Success Scenario; Alternate Scenarios;
Extensions; Out of Scope; Special Requirements; Notes and Business Rules; Technology and Data
Variations; Frequency of Occurrence.

## Conventions

- Actor names bind to the glossary; a conflict resolves in the glossary's favour.
- Guarantees, not steps, carry the contract: observable outcomes independent of the flow.
- Name the degraded-mode guarantee in Minimal Guarantees (ERSys: a deterministic provisional
  identifier on engine timeout).
- Extensions are step-keyed deltas: `<step><letter>. <condition> — <handling>`.
- Idempotency, authority and lineage are stated once in White and only realised in Blue.
- A reading guide opens the catalogue: stakeholders read White; implementers read Blue with the ADRs.

## Derivation mapping: the catalogue is the source for BDD

Gherkin is the executable projection of the catalogue, not a second specification; `bdd-gherkin`
writes the `.feature` files from it.

| Use case element | Gherkin |
|---|---|
| Main Success Scenario | the happy-path `Scenario` |
| Alternate Scenarios | one `Scenario` each |
| Extensions | one `Scenario` each, keyed back to the step |
| Preconditions | `Given` / `Background` |
| Trigger | `When` |
| Success Guarantee | `Then` |
| Minimal Guarantees | `Then` of the failure and degraded scenarios |
| Technology and Data Variations | `Scenario Outline` + `Examples:` axes |

- Coverage floor: every Main Success Scenario, Alternate Scenario and Extension has at least one
  Gherkin scenario.
- Gherkin invents no behaviour: a scenario with no use case (or, without a catalogue, no EPIC
  acceptance criterion) is a catalogue gap; fix the use case first, then project.
- Gherkin adds data, not behaviour: `Examples:` rows, boundary values, edge-case data.
- Project from Blue where it exists (it names the error codes and boundaries); else from White.
- Tag or name each scenario with its use case id (`UC-W1`, `UC-B1.1`).

## Building a catalogue

- Each user-visible goal from the drivers is a candidate White use case (typically 3–7 per service);
  each realisation surface of a White becomes one Blue.
- The index table (`index.adoc`) moves in lockstep: one row per page, link text equal to the
  doctitle, a one-line purpose that tells White (value) from Blue (realisation).
