# Shaping: the matrix

Checks on EPICs, PLANs, scenarios and the iteration that closes them. `epic-planning` owns the interview, the attack and the gate step; `clarity-gate` owns the score; `bdd-gherkin` owns scenario sign-off; `epic-delivery` owns the validation review. This file also holds the V-model rows for the EPIC and PLAN, the scenarios (sign-off) and the iteration. A check that answers two questions has two rows. `gap → C` rows are for the EPIC `activity-test-profiles` to fill or accept.

| Question | Check | Technique owner | Tool | Moment | Decided by | Status |
|---|---|---|---|---|---|---|
| VAL | CHK-66 EPIC and PLAN validation | `test-strategy` | the developer's agreement on why, appetite and success measure | shaping, before the first task | the developer | exists |
| VAL | CHK-62 Test-scenario interview | `epic-planning` | the interview | seed intake | the developer | exists |
| VAL | CHK-65 Gate failure recovery and accepted-gap decision | `epic-planning` | a recorded decision | at the gate | the developer | exists |
| VAL | CHK-68 Scenario sign-off *(provisional)* | `bdd-gherkin` | the developer reads the scenarios | PLAN gate, once per EPIC | the developer | exists |
| VAL | CHK-69 Validation review *(provisional)* | `epic-delivery` | the lead with the developer | end of an iteration | the developer | exists |
| VER | CHK-60 Clarity gate, full | `clarity-gate` | the 13-item rubric, at least 9 of 10 | gate the PLAN, before the first task | the verifier | exists |
| VER | CHK-61 EPIC readiness check | `epic-planning` | the lightweight clarity gate | before deriving the PLAN | the verifier | exists |
| VER | CHK-65 Gate failure recovery and accepted-gap decision | `epic-planning` | the Failure Recovery table | at the gate | the verifier | exists |
| VER | CHK-67 Golden thread, PLAN cites its parent EPIC | `epic-planning` | `openspec validate` | PLAN | the verifier | exists |
| VER | CHK-114 `openspec validate --strict` and the opsx verify command, every change archived with its specs merged | `spec-stewardship` | `openspec validate --strict` | end of an iteration; archive | the verifier | exists |
| VER | CHK-137 No open plan drift at archive | `spec-stewardship` | the navigator's Archive check, `deviations.md` | archive | the verifier | exists |
| ADQ | CHK-62 Test-scenario interview | `epic-planning` | the interview | seed intake | the checker | exists |
| ROB | CHK-64 Attack the PLAN | `epic-planning` | a fresh agent | before the gate | the adversary | exists |
| ROB | which invariants must hold, and how they reach the tester | `epic-planning` | none yet | none yet | the adversary | gap → C |
| CLR | CHK-60 Clarity gate, full | `clarity-gate` | the 13-item rubric | gate the PLAN | the cold reader | exists |
| CLR | CHK-61 EPIC readiness check | `epic-planning` | the lightweight clarity gate | before deriving the PLAN | the cold reader | exists |
| RSK | CHK-63 Risk question | `epic-planning` | the interview; RISK-n entries | seed intake; PLAN | the adversary | exists |
| RSK | CHK-64 Attack the PLAN | `epic-planning` | a fresh agent | before the gate | the adversary | exists |
