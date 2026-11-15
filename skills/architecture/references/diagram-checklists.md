# Diagram checklists

Apply silently while drawing; name each failed item when reviewing.

## ArchiMate L1: Context / Cooperation

- ✓ Business Actors are people, organisations or roles only, without responsibilities spelled out.
- ✓ Application Components: the system under design and each external system; the boundary is clear.
- ✓ Application Services: named, stable, business capabilities ("Entity Resolution", not "Query Engine").
- ✓ Serving relationships only: "this actor or system benefits from this capability".
- ✗ No processes, functions, events, workflows or sequencing.
- ✗ No internal structure, technology, protocols, data objects.
- ✗ No comma-separated labels on a relationship ("resolve, validate, store"): lift each into a Service.

## ArchiMate L2: Application Cooperation

- ✓ One Application Component per runtime deployable unit, with one runtime responsibility, named
  for it ("Entity Repository"), never for a technology ("Kafka", "Redis Cache").
- ✓ Application Services realised by containers (optional but clean); Application Interfaces where
  the interaction modality or contract ownership matters.
- ✓ Realization, Serving, and Flow marked sync or async only; if async is critical, name the topic or queue.
- ✓ Contract ownership is clear: which side defines the interface.
- ✗ No orchestration, pipeline steps, pre/post conditions, task sequences.
- ✗ No functions, processes, events, data objects, schema or persistence detail.
- ✗ No protocol specifics (Kafka vs RabbitMQ, REST vs gRPC).
- Replaceability: a container claimed pluggable has an explicit interface, its owner, and a contract
  in OpenAPI or AsyncAPI.

## UML L3: Component

- ✓ One container only; one diagram per container that matters.
- ✓ Each component has one responsibility, named for it (Orchestrator, Validator, Adapter), not a
  technology ("REST Adapter" passes; "Spring Bean", "Database Layer" fail).
- ✓ Every interaction goes through an explicit interface; each dependency is labelled with its
  style (REST, async event, in-process); async is never drawn as a sync call.
- ✓ Interface ownership: incoming interfaces are owned by the consumer or orchestrator, outgoing by the provider.
- ✗ No Flow between internal components (use Dependency); no behaviour (Triggering, sequencing).
- ✗ No classes, database specifics, external-system concerns inside the boundary.
- More than 6–8 components suggests L4 detail.

## UML L4: Class (domain)

- ✓ Domain concepts with business names and business-language attributes; semantic types
  (Date, Currency, Status); multiplicity and optionality intentional.
- ✓ Expressible in LinkML (or the model source `conceptual-modelling` chose) and matching it; a
  difference is explained.
- ✓ Inheritance is real specialisation (Customer → Individual / Corporate), at most 2–3 levels.
- ✗ No tables, keys, ORM or framework annotations, getters/setters, lifecycle methods, design
  patterns as classes, technical superclasses ("BaseEntity", "Auditable"), multiple inheritance.
- ✗ Not too abstract ("Thing", "Data"); more than 15–20 classes is too much detail.
- Test: would the model change with a technology choice? Then it is implementation, not domain.
- Code is the source of truth below the stable public abstractions.

## UML Sequence

- ✓ Participants are real L2 containers or L3 components, named specifically, never "service" or "API".
- ✓ The happy path and at least one failure or timeout path, each with an explicit end state and
  recovery (retry, fallback, abort).
- ✓ Sync and async are explicit: a broker or queue is a participant; async replies with an
  acknowledgement (202 Accepted) and the client polls by version; errors are drawn (`--x`);
  parallel work in `par` blocks; who blocks and who proceeds is visible.
- ✓ The messages match the L3 interfaces; async contracts (topics, queues) are named.
- ✗ Not a replacement for an L3 structure diagram. More than 10–15 messages: split it.

## UML Activity (technical workflow)

- ✓ One owner (one component); swimlanes are responsibility boundaries; only meaningful decisions.
- For internal workflows, state machines, algorithms; never for messages (use Sequence).

## BPMN Process / Collaboration (business workflow)

- ✓ For stakeholders: a complete end-to-end business process a business person could approve.
- ✓ Pools are independent actors or systems, never technical layers; message flows only between
  pools, sequence flows only within one.
- ✓ Tasks and messages have business meaning ("Validate Address", "Payment Approved"), never "REST
  call", "Database insert".
- ✓ The happy path and a separate failure or timeout path, each with a clear end event.
- ✗ Not for internal algorithms (use Activity). More than 10–12 tasks or 2–3 decision points: split it.
