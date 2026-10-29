# ISWC 2026 vault findings — reasoning, memory, elicitation

Secondary input, never groomed. Mined on 2026-10-28 by a research subagent from the owner's vault
(`03 Resources/ISWC 2026 *.md`, `01 Projects/2026-10-16 ISWC 2026/`, and the Sales Agent lessons memo).
Source abbreviations: **[Conf]** = `ISWC 2026 conference - Tue 27 Oct keynote and sessions.md`,
**[AIAA]** = `ISWC 2026 workshop - AIAA4KE ...`, **[KGMDSE]** = `ISWC 2026 workshop - KGMDSE ...`.
Photo facts come from the note transcriptions, not from re-reading the photos.
It adds to, sharpens or contradicts the handover (`Reasoning and learning skills.md`); Elenchus is not repeated.

## (a) Symbolic reasoning beside LLMs
- **Horrocks keynote**: "Hallucination is treated as a bug, but it is the design." Hybrid RAG: the LLM extracts entities, a vector index grounds them to IRIs, and SPARQL runs as a tool over RDFox with materialised Datalog rules. "LLM = interface, rules = decisions, graph = context, less context sent to the LLM." His decision test has three dimensions: information density, rules known (vague or precise), and cost of failure. [AIAA, Keynote]
- **RDFox Mantix**: a visual rules editor that shows sample data and live rule output beside the rule. The SPARQL drafted in chat is a first-class editable artefact. [AIAA, Keynote]
- **SDR-KG-LLM**: 5 closed intents, each bound to an OWL pattern and a SPARQL template, replace free NL→SPARQL. With GPT-4.1, correctness rose from 0.10 to 0.80 (Door) and from 0.40 to 0.90 (Table), at about 3× latency. Open models scored 0.82–0.91. [KGMDSE, Paper 5]
- **Codex + GraphDB MCP, 63 questions**: errors came from wrong scope, not syntax. "More tool calls did not guarantee completeness." [KGMDSE, Paper 4]
- **LLM-written OWL proofs**: about 80% correct on easy cases, about 32% on hard ones or with distractors. "Check every step with a reasoner; never trust a whole proof unchecked." [OntoLM tutorial]
- **"Narrow, rerank, check"**: an embedding shortlist, then an LLM rerank, then a reasoner or human check. "Validation is the trust layer." [tutorials index]
- **OWL traps**: a Functional property silently merges entities, while disjointness turns wrong inferences into visible inconsistencies. [OWL reasoning tutorial]
- **Shapes in CI**: shapes and expected results live in git and run before and after inference (ontolo-ci). [Shapes tutorial]

## (b) Agent memory and learning
- **IBM PCM (Gentile)**: "The graph is not the win." BM25 scored 57.6, the KG alone 30, the hybrid 60.2. NL→SPARQL is weak because the retry degenerates. Temporal questions score under 40%. Store a coarse KG with provenance and verbatim text, and know "how to forget". [Conf, IBM]
- **PCM stores only "comeback-ness"**: preferences ("don't use em dashes"), procedures and main entity types. "Encoding is generative… Retrieval is imperative." [Conf, IBM]
- **Memory audit**: in Mem0-g, 62 of 150 tasks stored no triples and only 32 of 150 ever retrieved one. Measure what lands in memory. [AIAA, Paper 5]
- **Hendler, "Prove it"**: agents should exchange verifiable justifications. [Conf, Keynote]
- **Panel**: "Human in the loop is not a fix by itself"; measure agreement. "~70% of knowledge is tacit." Describe what agents may do, possibly with deontic logic. [Conf, Panel]
- **Context graphs are enterprise models** (BPMN, DMN, ArchiMate). [KGMDSE]
- **Owner's Sales Agent memo**: "Drafts Eugen sent with few changes" are the signal. "The facts … stay append-only; only the weights move." [01 Projects/2026-10-08 Sales Agent/artefacts/design/Sales Agent - lessons from graph MCP and agent-learning sources.md]

## (c) Elicitation and CQs
- **CQ talk**: evaluating CQs (appraisal theory, framing propagation). NeOn-GPT on Qwen3-14B produced valid output for 9 of 33 user stories. [Conf, CQ]
- **Owner**: generate CQs with an LLM, "but keep the engineer's abstraction step and validate the CQs with the domain expert." [Conf]
- **OSKAR / Siemens Energy**: "Review, don't author." Expected CQ answers were pre-registered with the experts. [AIAA, Paper 1]
- **GOOD tutorial, test-first axioms**: check whether an axiom is entailed, inconsistent or absent, and add only the absent ones. [GOOD]

## (d) NL → formal constraints
- **NL2SHACL-Bench**: no accuracy figure is in the vault; see arXiv 2608.07530. Its motivation: there is no NL↔gold-SHACL benchmark and no evaluation beyond string comparison. [Conf]
- **Owner**: "Let an LLM draft shapes from expert sentences, then test against a gold set and compare semantically (validate sample data both ways), not by string similarity." [Conf]
- A DCTAP CSV can be the expert-facing source that generates SHACL. [Shapes tutorial]

## (e) Evaluation
- **SkillsBench (87 tasks)**: an LLM listwise reranker over names and one-line descriptions moved Recall@10 from 0.612 to 0.767. The dependency graph added +0.057. [AIAA, Paper 4]
- **Burr**: simple rule-based systems beat LLMs at ontology learning. SAP reports industry F1 of about 0.12 against about 0.8 in research. [AIAA, Paper 3]
- Three runs per question with an automated evaluator against a gold standard. [KGMDSE, Paper 4]

## (f) Owner's take-aways, verbatim
- "a KG of skills is not very useful (yet). For our skillery: invest in good one-line descriptions and an LLM reranker before building a skill graph; use explicit `depends_on` only for preloading." [AIAA]
- "before trusting 'graph memory', measure what actually lands in the graph and what is retrieved" [AIAA]
- "our job is to bring the parts it forgets: shared vocabularies, provenance, and proofs an agent can check." [Conf]
- "Agent permissions as models: describe what agents may and may not do in a domain model (deontic rules, SHACL/OWL), not in prompts." [Conf]
- "Agent memory over a client KG: keep it coarse (preferences, procedures, main entity types) with provenance and a forgetting policy." [Conf]
- "Make the gates deterministic … 'invariants go in hooks'." / "The model proposes; the machinery decides." [Sales Agent memo]

## (g) Over-engineering warnings
- A skill KG adds little over a reranker. The graph alone lost to BM25. "Measure before adding graphs" (ARGO). Rule-based systems beat LLMs (Burr). MeMo and knowledge editing are "research, not tooling we can use today".
