# Reading: designing-data-intensive-applications
Fork `meaningfy-ws/agent-rules-books` at `893a88a6fce3a80c565bf39ac65021b43a8b2990`, read in full on 2026-11-15 by reader A.

| File | Bytes | What it adds |
|---|---|---|
| `SKILL.md` | 822 | Frontmatter and a short entry pointing to the mini set, with the full text for harder data-system trade-offs. |
| `designing-data-intensive-applications.md` | 16,084 | The full rule set: source of truth, reliability and load description, data and query models, storage engines and indexes, consistency and write semantics, idempotency and replay, ordering, events and streams, schema evolution and encoding, partitioning, replication, transactions and isolation, derived data, faults, clocks and consensus, batch and stream processing, service boundaries by data ownership, tests and forbidden patterns. |
| `designing-data-intensive-applications.mini.md` | 6,949 | The working version: eighteen decision rules, nine triggers and a ten-point final check. |
| `designing-data-intensive-applications.nano.md` | 2,575 | A compact reminder: hidden data contracts are still contracts; idempotency, versioning, explicit staleness. |

Total read: 26,430 bytes.

## Goals it serves
Getting data behaviour right when it is distributed, replicated, cached, streamed or evolving:
naming the source of truth, stating what a write guarantees, making retries and replays safe,
scoping ordering, planning schema and message compatibility, and choosing replication, partitioning
and isolation by the invariant they protect. It fits write paths, event flows, caches and
projections, migrations and service boundaries drawn by data ownership. Do not use it for code
structure inside a service (that is `cosmic-python`) or for a single-process tool with one local
store, where its questions have trivial answers.

## Conflicts with Meaningfy rules
| # | Their advice (file, heading, line) | The Meaningfy rule it meets (owner skill) | Named in DEC-7, DEC-19 or DEC-20? |
|---|---|---|---|

No real conflict found. Checked and not counted: treating encodings and schemas as versioned
contracts (`designing-data-intensive-applications.md`, "Encoding and Data Flow Rules", lines 198-203;
"Schema Evolution Rules", lines 183-192) agrees with the contract-first approach of `architecture`
(OpenAPI, AsyncAPI, LinkML first); monotonic clocks and injected time (lines 269-270) agree with
`cosmic-python` `references/testing-checklist.md`, item 12; describing load concretely before a change
(lines 52-54) matches the architectural drivers of `architecture`, Step 0. The full text calls itself
a binding policy (line 16); DEC-7 answers that.

## Trigger overlap
`architecture` (drivers for performance and availability, contracts, ADRs on data topology);
`conceptual-modelling` (choice of data model and its source); `linkml-engineering` (schema
generation, where schema evolution meets it); `stack-operations` ("upgrade postgres", data cutover).
The overlap is partial: none of these owns consistency, replication or replay semantics.

## Fallback sentence (draft)
If `designing-data-intensive-applications` is not installed, offer `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/agent-rules-books#893a88a6fce3a80c565bf39ac65021b43a8b2990 --skill designing-data-intensive-applications --agent claude-code --global --yes` (the opencode command is in `assets/install.md`); if the person declines, carry on with `architecture` and say once that the data-system guidance was not used.
