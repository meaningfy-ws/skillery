# Architecture: the matrix

Checks on C4 views, ADRs, diagrams and their traceability to requirements. `architecture` owns the walkthrough, the ADR template and the diagram checklists; `meaningfy-code-review` owns the conformance lens (L3); `bdd-gherkin` owns the Gherkin checks the use-case derivation relies on. This file also holds the V-model row for architecture. A check that answers two questions has two rows. `gap → C` rows are for the EPIC `activity-test-profiles` to fill or accept.

| Question | Check | Technique owner | Tool | Moment | Decided by | Status |
|---|---|---|---|---|---|---|
| VAL | CHK-78 Architecture walkthrough and spike | `architecture` | walkthrough against use cases and drivers; `evidence/walkthrough.md` | shaping; before an ADR is accepted | the developer | exists |
| VAL | CHK-81 Requirements-to-architecture traceability | `architecture` | Phase 5 trace | architecture design | the developer | exists |
| VER | CHK-79 ADR Confirmation | `architecture` | the ADR's stated check, a tool or a reading | ADR accepted; every stage (L3) | the verifier | exists |
| VER | CHK-80 Diagram checklists and diagram review | `architecture` | per-notation checklists, Pattern 3 | diagram authoring and review | the verifier | exists |
| VER | CHK-81 Requirements-to-architecture traceability | `architecture` | Phase 3 verify and trace | architecture design | the verifier | exists |
| VER | CHK-82 Architecture conformance review (L3) | `meaningfy-code-review` | L3 reviewer subagent | per stage, on the PR | the verifier | exists |
| VER | CHK-84 ADR best-practice review | `architecture` | ADR Best Practices | ADR authoring | the verifier | exists |
| VER | CHK-85 Diagram anti-pattern review | `architecture` | the seven smells | diagram review | the verifier | exists |
| ADQ | CHK-11 Gherkin quality checks and use-case traceability | `bdd-gherkin` | UC id on each scenario | design | the checker | exists |
| ADQ | CHK-83 Requirements-extraction checklist | `architecture` | the twelve-box checklist | architecture design, step 0 | the checker | exists |
| ROB | how the architecture holds under failure, load and attack | none yet | none yet | none yet | the adversary | gap → C |
| CLR | CHK-80 Diagram checklists and diagram review | `architecture` | per-notation checklists | diagram authoring and review | the cold reader | exists |
| CLR | CHK-83 Requirements-extraction checklist | `architecture` | the twelve-box checklist | architecture design, step 0 | the cold reader | exists |
| CLR | CHK-84 ADR best-practice review | `architecture` | ADR Best Practices | ADR authoring | the cold reader | exists |
| RSK | CHK-78 Architecture walkthrough and spike | `architecture` | spikes for risky ADR assumptions | before an ADR is accepted | the adversary | exists |
