# Business requirements to architectural drivers

A driver is a requirement that shapes the structure of the system; everything else is
implementation detail. The drivers go to the index page's drivers table
(`architecture-index-page.md`), each with its source and the ADRs it shapes.

## Questions to ask

| Area | Ask | Driver it yields |
|---|---|---|
| Purpose and scope | What problem, for whom, which business goal? What is out of scope? | the L1 boundary |
| Users and scale | How many users, how much data, what throughput? | scalability, data volume |
| Performance | Latency SLA? How stale may data be? | latency, consistency model |
| Availability | Uptime SLA, acceptable downtime? | redundancy, deployment |
| Integration | Which external systems, in which direction? | communication patterns, contracts |
| Security and compliance | Data sensitivity, regulation, retention? | access boundaries, audit |
| Domain complexity | Key entities and relationships, master data? | abstraction levels, canonical ownership |
| Constraints | Existing systems, standards, skills, budget, organisation? | limits on the options |

## What is not a driver

- A technology choice ("use Spring Boot", "use Kubernetes", "RESTful API").
- Infrastructure ("database in the cloud").
- A vague quality ("fast", "reliable", "secure"): state the SLA or the rule ("p95 under 200 ms").
- A UI concern ("user-friendly").
- But "API used by 100K clients" is a scalability driver.

## Traceability

```
Business requirement → Driver → Architecture decision (ADR) → Specification
"Handle 10K concurrent users" → Scalability → async message queue → AsyncAPI: order-events
```

A decision you cannot trace is unjustified: add the requirement or remove the decision. A
requirement you cannot trace to a decision is not architectural, or is a gap. Record explicit
non-drivers (choices left for later) so they are not mistaken for gaps.

## Checklist before you design

- [ ] Business problem and goals documented
- [ ] Primary users and actors identified
- [ ] Core business functions listed
- [ ] Scalability drivers (users, data volume, throughput)
- [ ] Performance drivers (latency, freshness, consistency)
- [ ] Reliability drivers (uptime SLA, acceptable downtime)
- [ ] Integration needs (external systems, protocols)
- [ ] Security and compliance requirements
- [ ] Domain complexity (key entities, relationships)
- [ ] Drivers separated from implementation details
- [ ] An owner for each driver (who cares about it)
- [ ] Drivers prioritised
