# The architecture index page

The architecture document of a product repo is one index page: `architecture/index.adoc` (or `.md`).
It summarises and points; the ADRs, use cases, model and diagrams live on their own pages. This file
gives its shape, the consumer-needs table a library adds, and the two validation activities this
skill owns: the walkthrough and the spike.

## The shape

A status line opens the page: draft or accepted, the date, the scope, and the change that made it.
Then, in this order:

1. **Summary.** What this version delivers, in a few sentences, and what changed from the earlier
   plan, each change with a link to its ADR.
2. **Scope.** In scope as a table: service, what the user can do, use cases. Out of scope as a
   short list, with where it goes later.
3. **Architecture drivers.** One row per driver:

   | Id | Driver | Source | Shapes |
   |---|---|---|---|
   | DR-1 | *Short name.* One or two sentences. Mark an assumption as one. | who or what said it, with a date | the ADRs it shaped |

   The *Shapes* column links each driver to its decisions. A driver with no decision is a gap.
4. **Context (C4 level 1)**, **Containers (C4 level 2)**, **Components (C4 level 3)**: one diagram
   each, with a short text. Level 3 has one subsection per container that matters.
5. **Key flows.** A sequence diagram for each flow that crosses containers (for example, sign in
   and call the API).
6. **Decisions.** One row per ADR:

   | ADR | Level | Decision | Status |
   |---|---|---|---|
   | ADR-001 (link) | L1 | the decision in one line | Accepted / Partly accepted / Proposed |

   Say above the table who decided: *Accepted* means the developer took the decision; *Proposed*
   means the author's call, waiting for review. *Partly accepted* means some parts are each; the
   ADR's status line says which. Say where the developer's answers are recorded.
7. **Open questions.** A list, or "none".
8. **References.** The use case catalogue, the conceptual model, the libraries' architecture pages,
   research and source material.

## Consumer needs (a library)

A library built for others adds a **Consumer needs** section after the drivers. It states what its
consumers need, in generic terms, one row per need:

| Id | Need |
|---|---|
| N-1 | Store domain objects as RDF and read them back as typed objects. |

The library never names its consumer. Each consumer maps its own ADRs and use cases onto these ids
in its own architecture page. A consumer need with no library feature, or a feature no need asks
for, is a finding for the library.

## Walkthrough and spike

Both are validation activities: they check that the architecture is the right one, before code
depends on it. Their evidence goes to `evidence/` in the change. When they run in a delivery is
`epic-delivery`'s.

- **Walkthrough** (the architect, with the developer, while shaping). Trace each in-scope use case,
  step by step, through the C4 views and the ADRs: which container and component does each step,
  through which contract, with which access check. Then check that every driver is met by at least
  one decision. A step with no home, or a driver with no decision, sends the ADR back to Proposed.
  Evidence: `evidence/walkthrough.md`.
- **Spike** (a builder, while shaping). A throw-away experiment that answers one question an ADR
  depends on. It ends with yes or no and the evidence, in `evidence/spike-<topic>.md`. Its code is
  not kept.

An ADR becomes Accepted only after the walkthrough has passed it.
