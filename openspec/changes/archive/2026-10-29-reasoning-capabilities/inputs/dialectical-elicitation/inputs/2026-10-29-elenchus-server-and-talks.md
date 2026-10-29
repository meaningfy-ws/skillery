# elenchus-server and the two Elenchus talks

Secondary input, never groomed. Read-only research by a subagent on 2026-10-29. Clone and slides were
downloaded to the session scratchpad. No downloaded code was executed. Items marked *inferred* are the
researcher's judgement.

## elenchus-server (https://github.com/bradleypallen/elenchus-server)
- **Licence and basics:** MIT, "Copyright (c) 2026 University of Amsterdam". Python 3.11+, PyPI `elenchus` (per the badge, not checked). v0.14.1, Alpha.
- **History and size:** 201 commits from 2026-03-01 to 2026-10-13, one author. About 60k lines in the repo; `src/` is about 15.9k, of which `server.py` is 4,863. 61 test files with about 1,176 tests.
- **Architecture:** a FastAPI web app with a single-page UI, an `elenchus-cli` REPL and a REST API (`/api/sessions/{id}/message`, `/tensions/{id}`, `/derive`).
  - **Not MCP, not an agent skill.**
  - Multi-user: roles admin, researcher, user, judge and participant; invites, bcrypt, magic links, a cost ledger, alerting, backup.
  - A user-study harness (Sloan-funded: blinded judging, questionnaires, export).
  - Single process, because DuckDB allows one writer per file.
- **Storage:** DuckDB. `platform.duckdb` holds identity. Each dialectic is a file, `bases/{actor}/{base}.duckdb`, with migrations 0001–0007. The per-dialectic schema:
  - `atoms(sentence PK, added_by, description, contributor_id, paraphrases, references)` are flat NL sentences, shown as P1…Pn.
  - `positions(atom, side C|D, status open|retracted, actor_id, case_id)`.
  - `tensions(id, gamma, delta, reason, status open|accepted|contested, proposed_at, resolved_at, case_id)`, shown as T1….
  - `assessments(premises, conclusions, judgment holds|rejected, contributor, reason, domain, provenance, status active|disputed|retracted)` form the consequence relation, shown as material implications I1…. Accepting a tension writes a "holds" assessment with provenance `{source: tension, earned_via_tension, reason}`. Contesting only sets the tension's status.
  - Also `conversation`, `cases` (a stub), and two append-only tables: `turn_log` (raw LLM output, the prompt's SHA-256, state before and after, tokens) and `state_events` (applied, noop or dropped, with source opponent, ui or direct).
- **Opponent** (`opponent.py`, `prompts/elenchus.md`, 105 lines):
  - Calls the Anthropic API or any OpenAI-compatible endpoint. Default model `claude-opus-4-6`, temperature 1.0, no tool use.
  - Each turn returns one JSON object: `{speech_acts:[COMMIT|DENY|ACCEPT_TENSION|CONTEST_TENSION|RETRACT|REFINE], new_tensions:[{gamma, delta, reason}], response}`.
  - Prompt rules:
    - propositions are atomic and declarative;
    - gamma is copied word for word from C;
    - prefer tensions whose delta hits D;
    - one focal tension at a time, the rest in a hidden queue;
    - items are referred to as P, T and I;
    - the first draft of the respondent's text is the positum, and later edits are read as commits, retracts and refines;
    - the opponent never writes prose for the respondent;
    - a rolling summary replaces older history.
  - "Phase B" (off by default) adds ASSERT_IMPLICATION, INTRODUCE_BEARER and RETRACT_IMPLICATION.
- **pyNMMS:** a hard dependency (`>=0.6.2`), used only for derivability queries with a proof trace (`material_base.py`).
- **RDF/OWL:** none in the code. RDF translation happens "offline from captured data" (design note).
- **Multi-respondent:** deferred. Columns `actor_id` and `case_id` exist for it.

## AIAA4KE talk (talks/elenchus_aiaa4ke_talk.pdf, 21 slides, ISWC 2026, 26 Oct 2026)
- **Framing:** commit, challenge, resolve, instead of generate, validate, repair. "The LLM asserts nothing." The expert adjudicates only the tensions.
- **State:** ⟨[C : D], T, I⟩. A tension is Γ ⊆ C, Δ ⊆ D. The responses are retract, refine or contest, and an accepted tension becomes a material implication. The material base is the atoms C ∪ D, with consequence I ∪ Containment; it is nonmonotonic and nontransitive.
- **PROV-O case:**
  - Setup: Section 3.1 (350 words) as the starting position, a PROV co-editor as respondent, Claude Opus 4.6 as opponent, two sessions (Feb 2026).
  - Run: 10 commitments led to 7 challenges, ending with 19 commitments, 9 implications and 1 retraction. Six of the seven challenges match Moreau et al. 2015.
  - pyNMMS check: all 9 implications derivable, no atom both asserted and denied, 34 cross-chain pairs independent. Each nontransitivity and nonmonotonicity check maps to a documented design decision.
- **RDF serialization:** each implication is reified as `mb:MaterialImplication, prov:Entity` with `mb:antecedent` and `mb:consequent`, plus `prov:wasGeneratedBy :moveN` (`mb:DialogueMove, prov:Activity`). It validates against PROV-CONSTRAINTS. The `mb:` IRI is not shown.
- **Limitations:** an existence proof, not an evaluation; training-data leakage; oracle bias; fatigue; one expert only; not an RDFS/OWL ontology.
- **Current work:** RDF triples as atoms; pyNMMS with RDFS and OWL 2 RL regimes on Oxigraph; the Sloan study (30–40 biodiversity scientists, Elenchus against free-form chat, 5 blinded judges).

## ROLE talk (talks/elenchus_role_talk.pdf, 12 slides, 3 Feb 2026)
- An early version that keeps state in GitHub issues, with pseudocode for the agent loop.
- In that loop, retraction or refinement moves X ⊢ Y into I, and contestation removes it. That is a different reading from the server, where *accept* moves it into I.
- An open question on first-order NMMS for quantified commitments.
- *Inferred:* "ROLE" is a logic or philosophy research group (the slides thank Ferguson, Logan, Rossberg and Kouri Kessel).

## Implications for the pitch (researcher's view)
- **The minimal core ⟨[C:D], T, I⟩ is what the paper and server use.** The 786-line protocol's extras (typed items, QUD, separate challenges, four incoherence types, distinction, revision of logic) are not in the production server. Make the core normative and the extras optional.
- **Missing requirements:**
  - a material-implication store with tension provenance;
  - a focal-tension queue (the fatigue answer);
  - proposition-quality rules;
  - a positum-extraction step;
  - an append-only event log;
  - a rolling summary;
  - an optional PROV-O RDF export of I;
  - acceptance oracles from the PROV-O case.
- **Server as a dependency:** not recommended. It is a multi-user study platform (FastAPI, DuckDB, two LLM SDKs, auth) that calls its own LLM, has no MCP or skill surface, and its schema churns (7 migrations in 7 months). Treat it as a reference specification.
- **Licence:** reusing prompt text or the schema needs "Copyright (c) 2026 University of Amsterdam" in `THIRD_PARTY_NOTICES.md`. The talks repo's licence was not checked, so cite the talks and don't copy them.
