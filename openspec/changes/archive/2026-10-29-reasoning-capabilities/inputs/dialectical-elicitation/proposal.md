<!-- STATUS: POSTPONED (owner, 2026-10-29). An Elenchus server implementation exists
     (https://github.com/bradleypallen/elenchus-server), so this pitch must be re-shaped around a
     decision on how to set that server up. Do not derive a PLAN until then. Research on the server
     and the talks: inputs/2026-10-29-elenchus-server-and-talks.md. -->

> **Note on the requirements below.** The research found that the author's own server and the ISWC paper
> use a minimal state ⟨[C : D], T, I⟩, where an accepted tension becomes a material implication in I.
> The richer item types used below come from the earlier protocol file, which the server does not use.
> Re-base the requirements on that minimal core when this EPIC resumes (see the input file).

> **Postponed (2026-10-29). Setup decided:** option 1, a skill that re-implements the minimal core
> ⟨[C : D], T, I⟩ with the host agent as opponent, using the server only as a reference specification;
> plus option 2, one local server trial by the owner ([`inputs/2026-10-29-local-server-trial.md`](inputs/2026-10-29-local-server-trial.md)).
> Resume after that trial. The questions this answered were: (1) how the server is set up and hosted (local, per project, or a shared Meaningfy
> instance in the infrastructure stacks repo); (2) whether the skill becomes a thin client of the server
> instead of re-implementing the protocol over markdown files (that would overturn DEC-4 and the no-go
> on a server or RDF store); (3) how client data is kept out of shared storage. Sources to re-read: the
> server repo and the talks [AIAA4KE](https://github.com/bradleypallen/talks/blob/main/elenchus_aiaa4ke_talk.pdf)
> and [ROLE](https://github.com/bradleypallen/talks/blob/main/elenchus_role_talk.pdf).

# EPIC: Dialectical elicitation — an Elenchus-style opponent for traceable modelling

**Golden-thread parent:** the umbrella EPIC [`reasoning-capabilities`](../../proposal.md).

**Sources for the requirements:**
- Allen, "Elenchus: Generating Knowledge Bases from Prover-Skeptic Dialogues", arXiv:2603.06974, and the AIAA4KE ISWC 2026 talk (handover §4.3).
- The Elenchus repository's "Dialectical Opponent Protocol" (`CLAUDE.md`, MIT, https://github.com/bradleypallen/elenchus).
- pyNMMS 0.15.1 (MIT, https://github.com/bradleypallen/pyNMMS).

## Appetite

**MEDIUM.** One new production-ready skill with its state format, scripts and tests, released as
experimental and evaluated in a later trial. If it grows multi-respondent support, argumentation
frameworks or an RDF state store, it has overrun.

## Why

Experts know more than they say, and models built from what they say carry unrecorded tensions.
Elenchus turns the usual generate-validate-repair loop around. The expert states commitments and
denials; the LLM only challenges, pointing out what cannot stand together; the expert retracts,
refines or contests. The result is a knowledge base *plus the auditable dialogue that justifies each
commitment*. That fits Meaningfy's explainability and traceability positioning, and it is a deliverable
a client can keep. In the paper's test, six of seven challenges matched documented design tensions.

## Solution outline

One skill, **`dialectical-elicitation`** (bundle meaningfy-architecture, `maturity: experimental`,
facet subject `modelling`). Its requirements come from the paper and the protocol.

**Roles.** The respondent (the expert) commits, denies, answers, resolves, retracts and refines. The
opponent (the agent):
- may propone, challenge, distinguish, counter, reduce, and make bilateral probes;
- **asks and never asserts**, is charitable, and never imposes a positum;
- acts as a defeasible oracle on incoherence.

**State model.** `[Commitments : Denials]` plus questions (a question hierarchy), challenges and tensions:
- commitments and denials are typed background, empirical or normative;
- statuses: open, resolved, retracted;
- every item is dated and linked;
- a tension states its derivation as a sequent `X ⊢ Y`.

**Incoherence types:** direct contradiction, contrary commitments, subcontrary denials, cross-side.

**Resolutions:** retraction, refinement, distinction, revision of logic. A revision of logic is recorded
as a methodological commitment, and denial is never collapsed into negation without one.

**Storage:** markdown files in the project, one per item, with frontmatter. The protocol keeps state in
GitHub issues; we replace that because client material must not live in an issue tracker. The files
are versioned with the project.

**Sessions.**
- *Start:* load the open challenges, tensions and questions, then the current state, and brief the expert.
- *End:* summarise new items, give the current state, and preview what is unresolved.
- Sessions are time-boxed against fatigue.

**Scripts:**
- `status`: counts and the `[C : D]` view;
- `export`: the dialectical state as an NMMS material base for optional pyNMMS verification (the paper's verification step). pyNMMS is an optional dependency, and the skill works without it.

**Literature grounding** follows the protocol: challenges, not conclusions; never fabricate a citation;
flag sources that could not be verified.

**Acceptance test (failure-first).** Re-run the paper's PROV-O demonstration with the skill. Pass if
the challenges surface the documented design tensions (the paper reports six of seven) and every item
is traceable. A real-session trial follows later.

## Key decisions

- **DEC-1** (owner): A new skill in the modelling and architecture bundle (meaningfy-architecture), marked
  experimental. Rejected: extending semantic-consulting-coach.
- **DEC-2** (owner): Build it production-ready now and test it in a later trial. Rejected: a throwaway
  prompt-only trial.
- **DEC-3** (owner): Requirements come from the Elenchus paper and its software (protocol and pyNMMS).
  Rejected: inventing our own dialectic.
- **DEC-4** *(proposed)*: State lives in project markdown files, not GitHub issues. Rejected: the
  protocol's issue tracker, because client data must stay out of it.
- **DEC-5** *(proposed)*: pyNMMS is optional, through an export. Rejected: making the skill depend on
  alpha, single-author code.
- **DEC-6** *(proposed)*: Rewrite the protocol in our own words, citing the MIT source with a
  `THIRD_PARTY_NOTICES.md` entry if any text is reused. Rejected: vendoring the 786-line `CLAUDE.md`.

## Rabbit-holes

- **Oracle bias.** False negatives are invisible to both parties. Say so in every session summary; don't claim completeness.
- **Fatigue.** Being challenged is tiring. The time-box and a "park this" move are required.
- **Training-data leakage.** The PROV-O test history is probably known to the model, so the acceptance test proves the mechanism works, not that the model discovers anything.
- **Boundary with semantic-consulting-coach**, which elicits without solutions but does not challenge. State the boundary both ways.

## No-gos

- No multi-respondent dialectic and no argumentation frameworks (ABA, ASPIC+).
- No RDF/OWL state store or Oxigraph (the paper's current work, not ours yet).
- No GitHub issues as storage.
- The opponent never proposes content.
- No hard dependency on pyNMMS.

---

## What Changes

- New skill `dialectical-elicitation` in meaningfy-architecture: `SKILL.md`, references (protocol, state
  format, incoherence and resolution types), `scripts/status` and `scripts/export` with tests, and templates.
- `dependencies.yaml` gains pyNMMS (optional).
- `THIRD_PARTY_NOTICES.md` gains an entry if protocol text is reused.
- A boundary line in semantic-consulting-coach, and a pointer from conceptual-modelling.

## Capabilities

### New Capabilities

- `dialectical-elicitation`: the opponent protocol, the dialectical state, session flow, and export.

### Modified Capabilities

_None._

## Impact

- Bundle meaningfy-architecture (new skill), plus one line in semantic-consulting-coach (meaningfy-consulting).
- Optional pyNMMS on the user's machine (Python 3.12 or later is tested upstream).
