# Documentation: the matrix

Checks on docs, how-tos, tutorials and references. `technical-writing` owns the cold reader and the documentation workflow; `clarity-gate` owns the lightweight gate. This file names them and does not restate their steps. A check that answers two questions has two rows. `gap → C` rows are for the EPIC `activity-test-profiles` to fill or accept.

| Question | Check | Technique owner | Tool | Moment | Decided by | Status |
|---|---|---|---|---|---|---|
| VAL | CHK-33 Cold reader, can a reader act on the page | `technical-writing` | fresh agent given only the page | a how-to or tutorial changed; docs stage | the developer | exists |
| VER | CHK-34 Documentation workflow verify | `technical-writing` | snippets run, docs gate | docs stage | the verifier | exists |
| VER | CHK-13 Review lens L2, spec correctness and tests, docs agree with the code | `meaningfy-code-review` | reviewer subagent | per stage, on the PR | the verifier | exists |
| VER | CHK-35 Docs-owed inventory | `technical-writing` | the inventory phase | docs stage | the verifier | exists |
| ADQ | whether the docs checks would catch a bad page | none yet | none yet | none yet | the checker | gap → C |
| ROB | how the docs hold when the code changes or the reader strays | none yet | none yet | none yet | the adversary | gap → C |
| CLR | CHK-32 Lightweight clarity gate | `clarity-gate` | the five-point check | any doc written | the cold reader | exists |
| CLR | CHK-33 Cold reader | `technical-writing` | fresh agent given only the page | a how-to or tutorial changed; docs stage | the cold reader | exists |
| CLR | CHK-34 Documentation workflow verify | `technical-writing` | `evidence/cold-read.md` | docs stage | the cold reader | exists |
| CLR | a prose style check on docs (Vale) | `technical-writing` | none yet | none yet | the cold reader | gap → C |
| RSK | what outside the docs can make them false or unsafe | none yet | none yet | none yet | the adversary | gap → C |
