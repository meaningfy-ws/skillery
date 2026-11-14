# Modelling: the matrix

Checks on conceptual models, LinkML schemas and rule sets. `conceptual-modelling` owns model validation, `formal-reasoning` the engine-checked rules, `linkml-engineering` the schema gates and `modelling-conventions` the per-edit review. This file also holds the V-model row for the model. A check that answers two questions has two rows. `gap → C` rows are for the EPIC `activity-test-profiles` to fill or accept.

| Question | Check | Technique owner | Tool | Moment | Decided by | Status |
|---|---|---|---|---|---|---|
| VAL | CHK-70 Model validation, example instances | `conceptual-modelling` | real-case instances | model changes; shaping | the developer | exists |
| VAL | CHK-71 Competency questions | `conceptual-modelling` | queries with agreed expected answers | model changes | the domain expert | exists |
| VAL | CHK-72 Domain-expert review | `conceptual-modelling` | `evidence/model-validation.md` | model changes; shaping | the domain expert | exists |
| VAL | CHK-77 Rules-from-text test per obligation | `formal-reasoning` | a test per obligation | deriving rules from a text | the developer | exists |
| VER | CHK-73 Engine-checked rule sets | `formal-reasoning` | clingo, SWI-Prolog, `tests.toml` | rule authoring; every model change | the verifier | exists |
| VER | CHK-74 LinkML quality gates | `linkml-engineering` | schema lint, codegen freshness, round trip | every commit; CI | the verifier | exists |
| VER | CHK-75 Modelling anti-pattern review and per-edit checklist | `modelling-conventions` | the per-edit checklist | each model edit | the verifier | exists |
| VER | CHK-76 Paraphrase-back and runner refusals | `formal-reasoning` | `run_rules.py` | rule authoring | the verifier | exists |
| ADQ | CHK-70 Model validation, example instances | `conceptual-modelling` | real-case instances | model changes | the checker | exists |
| ADQ | CHK-71 Competency questions | `conceptual-modelling` | queries with agreed answers | model changes | the checker | exists |
| ADQ | CHK-77 Rules-from-text test per obligation | `formal-reasoning` | a test per obligation | deriving rules from a text | the checker | exists |
| ROB | CHK-73 Engine-checked rule sets, UNSAT cases | `formal-reasoning` | clingo, SWI-Prolog | rule authoring; every model change | the adversary | exists |
| CLR | CHK-76 Paraphrase-back and runner refusals, a human reads each `means:` line | `formal-reasoning` | the `%%` paraphrase | rule authoring | the cold reader | exists |
| RSK | what outside the model can go wrong (a vocabulary changes, a consumer breaks) | none yet | none yet | none yet | the adversary | gap → C |
