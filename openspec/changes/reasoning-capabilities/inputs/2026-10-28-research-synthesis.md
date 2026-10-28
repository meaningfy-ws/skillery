# Research synthesis: reasoning capabilities

Written 2026-10-28 by Claude while the owner was away (no approvals were given in that time).
It challenges and strengthens the handover (`Reasoning and learning skills.md`) using three research
inputs and one spike, all in this folder:

| Input | What it adds |
|---|---|
| [`2026-10-28-catalogue-overlap-audit.md`](2026-10-28-catalogue-overlap-audit.md) | What skillery already owns, with file:line evidence, plus the catalogue's hard constraints |
| [`2026-10-28-iswc-vault-findings.md`](2026-10-28-iswc-vault-findings.md) | ISWC 2026 evidence and the owner's own take-aways |
| [`2026-10-28-external-verification.md`](2026-10-28-external-verification.md) | Engine install reality, native CLI memory, TellOnce prior art |
| [`spike/`](spike/) | The same toy playbook linted in plain Python and in clingo |

Everything here is a proposal. The owner decides.

## 1. The verdict in one paragraph

The handover's direction is right, but it is about three times bigger than the evidence supports.

It bundles three bets of very different strength:
- **Learning from corrections**: high payoff and daily evidence.
- **Exact reasoning with engines**: a real gap, but a narrow slice of the work.
- **Dialectical elicitation**: promising, but unproven.

It also re-invents machinery the catalogue and the CLIs already have:
- The vault already stages, approves and promotes claims.
- Claude Code already learns from corrections.
- `tools/` never ships to users.
- A plain script already does the rule-consistency job.

The KISS version is **three child EPICs plus one trial**, with no new tool, no new hook, no
monitoring stack and no Prolog. That comes to **two new skills, one skill extension and one
dependency (clingo)**, against the handover's five skills, shared tool, hook, folder and Langfuse.

## 2. Challenges to the handover, and what replaces each part

| Handover proposal | Challenge (evidence) | Replacement |
|---|---|---|
| 5 skills + `rulekit` | One skill each for method, governance and text-to-rules splits one practice in three. `reasoning-project` repeats the spine, and `rules-from-text` overlaps epic-planning, clarity-gate and bdd-gherkin (audit). A skill with one user is a project file (`docs/development/README.md:175`) | **2 new skills**: `learned-rules` and `rule-reasoning`. Text-to-rules and the project layout become references inside `rule-reasoning` |
| `learned-rules` in meaningfy-core with its own promotion path | Capture, staging, approval, sharing, the weekly sweep and skill-change already exist in the vault skills (audit §learned-rules). The rules live in the vault anyway | Put it in **vault-assistant** and reuse `00 Inbox/proposed/`, vault-promote, `memory: common` and skill-change. Only the schema, precedence and lint are new. *Caveat:* the playbooks are *used* from activity skills that sit in other bundles (sales, proposal-writer), so **loading is EPIC A's main design question** (see §4 A). If loading has to be cross-cutting, meaningfy-core (the handover's placement) comes back as an option |
| Personal learning built from scratch | Claude Code auto memory *already* learns from corrections, and so do Windsurf Cascade and TellOnce. What is missing is the approval gate, scope by activity, consistency checks and opencode support (external §native, §prior art) | Do not compete with auto memory inside code repos. `learned-rules` covers what auto memory cannot: **approved, activity-scoped playbooks that work on both CLIs** because they are plain markdown that a skill tells the agent to read |
| Storage and recall are the problem | TellOnce: agents with memory still violated 57.5% of applicable preferences. Loading a rule is not obeying it. ISWC: "the model proposes; the machinery decides", "invariants go in hooks" (owner) | **Adherence is the problem.** Each rule is classed as `judgement` (loaded as context) or `checkable` (a deterministic check run on the output: a regex or script). Checkable rules are the strongest lever, and that is the owner's own principle |
| `rulekit` in `tools/` | `tools/` never ships, and every shipped executable lives in its owning skill's `scripts/` (audit) | `learned-rules/scripts/playbook_lint.py` (stdlib only). No shared tool and no MCP |
| One note per rule in a new `09 Rules/` folder | A new top-level folder and a per-rule kind cost the most of the options. About 30 rules per playbook reads best as one page | **One `playbook` note per activity**, rules as ID'd list items with inline fields, in whatever folder vault-conventions assigns. Per-rule notes only if Bases views prove necessary (they are not needed yet) |
| clingo for rule-set consistency | Spike: a stdlib Python lint (about 70 lines) and a 26-line clingo encoding found the same conflict over 18 situations, both instantly. Only the Python lint (as encoded) reports the dead rule (R9) and the redundant one (R8, which a broader rule already covers). Finite scope tags make enumeration trivial. **Untested:** precedence cycles and circular exceptions | **Plain Python lint for playbooks** (no dependency). clingo stays for real rule-set problems in client work (`rule-reasoning`). Recorded limit: the lint covers only rules that declare a `slot`; free-text rules are checked by a person |
| SWI-Prolog for data-heavy work | It needs a system install, since no pip route exists (external). The handover's own table says "or SPARQL/DuckDB if data is in a store", and Python, SPARQL and recursive SQL cover closure and lineage | **Drop Prolog** until a recorded failure needs it. Engine set: clingo, plus the existing SPARQL/SHACL/OWL toolchain, plus Python |
| Three monitoring signals: stop-hook footer, Langfuse spans, overrides | The footer is self-reported and unreliable (the handover says so). No bundle can ship a hook into the vault (audit). Langfuse needs 4 data services and 16 GiB RAM (external) | **One signal: overrides**, recorded by a person at capture time against the cited rule ID. Add an `overrides` counter and a `last-confirmed` date on each rule. Langfuse moves out of this EPIC into a devops backlog row |
| `dialectical-elicitation` as a new skill on pyNMMS | Elenchus is one MIT prompt file plus `gh`, and pyNMMS is alpha code from one author (external). **Partial overlap only:** semantic-consulting-coach elicits and reflects with "no solutions" (audit), but it does not challenge commitments or track tensions. The paper is an existence proof, not an evaluation | **Trial first, then extend the coach**: run the Elenchus protocol once on a real ontology session, with state in project markdown files rather than GitHub issues. pyNMMS is optional. A skill or reference appears only if the trial passes |
| `reasoning-project` governance skill | The spine already gives charter (EPIC), tests, runs, log and archive | A short section plus a `templates/` folder in `rule-reasoning`: a one-off check shrinks to one run record |
| SysML v2, eclingo, argumentation, Z3, DuckDB, Soufflé, RL, a KG mirror of Odoo | No recorded failure needs them, and ISWC evidence warns against graphs added before a question needs them ("measure before adding graphs") | **No-gos** for this EPIC family. Revisit only on a recorded failure |
| Competency-question testing inside `rule-reasoning` | CQ tests are SPARQL ASK/SELECT plus expected answers in git (ontolo-ci, GOOD test-first axioms). That is modelling quality, owned by linkml-engineering quality gates | **A small direct PR to linkml-engineering** (`references/quality-gates.md`): CQ tests with pre-registered expected answers. No engine is needed |

## 3. What the evidence strengthens (keep and sharpen)

- **Explicit, approved rules rather than RL or opaque memory.** The ISWC IBM talk stores only what you come back to (preferences, procedures, main entities) with provenance and forgetting. The owner's Sales Agent memo says "facts append-only, only weights move". TellOnce shows the opaque route still misses most rules.
- **Injection defence**, borrowed from TellOnce: "context cannot authorize a rule". A candidate rule must cite the owner's own words (a correction or edit), never mail, web or file content. This hardens the handover's risk §8.7 into a lint check: every rule has a `source:` pointing to an owner turn or approved note.
- **TellOnce's mutation vocabulary** gives the distil step a closed set of outcomes. Use a subset: `NEW`, `UPDATE`, `SUPERSEDE`, `NEEDS_OWNER`, `REJECT`, `RETIRE`. The handover asked for "conflicts flagged, never resolved by recency", and `SUPERSEDE` and `NEEDS_OWNER` make that explicit.
- **Exact reasoning loop.** ASP-Bench shows an agent with solver feedback solves every instance, while LLM-written proofs collapse to about 32% on hard cases (OntoLM). So the skill's core is a loop, not one generation: **write rules, then tests with known answers, then run, then paraphrase back, then fix**.
- **Closed forms beat free generation.** SDR-KG-LLM moved correctness from 0.10 to 0.80 with intent templates. In `rule-reasoning`, this means **pattern templates** (consistency, exceptions and priority, minimal fix, closure) rather than free ASP.
- **Measure before you trust.** Mem0-g stored no triples at all for 62 of 150 tasks. Each trial gets a baseline before it starts: override rate on offers, and draft→final edit size.

## 4. The child EPICs

Appetite sizes follow the epic-planning skill. The order reflects payoff and the "corrections log feeds everything" argument.

### EPIC A: `learned-rules` (vault-assistant): **MEDIUM**, first

- **What it is about.** Activity playbooks of approved rules that the agent reads before working on that activity, learned from the owner's corrections, with a lint that checks the playbook.
- **Solution.**
  - A new skill **`learned-rules`** (bundle vault-assistant, `maturity: experimental`) owns:
    - the **rule line format**: `ID`, type (start with: default-with-exception, preference, constraint, procedure, convention, escalation), strength `hard|default|soft`, scope tags, rule text, `because`, `source`, status, `added`, `last-confirmed`, `overrides`, an optional `slot` and `value` (what the rule decides, for example `pricing: fixed`; only rules with a slot take part in conflict checks), and an optional `check`;
    - a **scope vocabulary** declared at the top of each playbook (the closed dimensions and values, for example `client: public|private|us`), which the lint enumerates;
    - **`last-confirmed`**, set by the owner in the weekly sweep when a rule was seen to work, or when the owner re-approves it. "Stale" means not confirmed for 90 days *(a proposed number)*. This replaces the handover's self-reported `times applied`;
    - **golden examples**, kept as the handover proposed (§4.6 step 6): each playbook links one or two approved final outputs, and `playbook_check.py` runs on them so that a rule change which breaks a golden output shows up;
    - **precedence**: hard > default > soft, then more specific scope wins, and same-level ties go to the owner;
    - the **distil procedure** using the closed mutation set from §3;
    - the **checkable vs judgement** classification;
    - **`scripts/playbook_lint.py`**, which finds conflicts, dead rules, redundant rules, missing `source`, stale rules and size over 30, using the spike's enumeration;
    - **`scripts/playbook_check.py`**, which runs the `check:` rules (regex) on a draft. This is the deterministic adherence layer.
  - **Extensions** (cite only, never restate):
    - vault-conventions gains the `playbook` kind via a skill-change note.
    - vault-capture files a correction as a candidate in `00 Inbox/proposed/` citing the rule it overrides.
    - vault-planning's weekly sweep gains a "playbook" line covering candidates, rules overridden twice and stale rules. This is the sales "two sweeps → proposed filter" pattern.
  - **Loading is the open design question of A.** A rule that never enters context does nothing, and offers work runs through sales skills and the proposal-writer agent, not through `learned-rules`. Vault paths must stay machine-neutral (handover §0). The options, cheapest first:
    - (a) The vault's `AGENTS.md` names the playbooks and says "before activity X, read `<playbook>`". This works in vault sessions on both CLIs.
    - (b) Each activity skill carries one line: "if the vault has a playbook for this activity, read it and run its checks". This reaches repo sessions too, but it adds a line to every activity skill.
    - (c) A `UserPromptSubmit` hook that injects matching rules. It is the strongest option but has no distribution path today (audit).

    *Recommendation:* (a) now, and (b) only for the activity the trial covers (offers). (c) only if the trial shows rules being missed.
  - **No hook** in A.
- **Execution.**
  - (1) Failure cases: the owner supplies three real corrections from offers work. The repo's own auto-memory feedback files, such as `yagni-kiss-no-config` and `move-files-dont-regenerate`, show the pattern but are repo-scoped.
  - (2) Baseline: override rate and edit size on the last 3 offers.
  - (3) Build the skill, the two scripts with pytest, probes and the Gherkin for the capture→sweep→approve flow.
  - (4) Trial 1 for one month on the offers playbook. Keep it if the override rate falls and the weekly review takes minutes.
- **Open questions (owner):**
  - the folder for playbooks;
  - whether repo-level learning should also move into playbooks, or stay in auto memory (recommended: stay);
  - whether the personal voice profile is a playbook (recommended: yes, `activity: writing`).

### EPIC B: `rule-reasoning` (meaningfy-architecture): **MEDIUM**, second (it can run in parallel with A's trial)

- **What it is about.** Giving the agent an exact, auditable engine for the narrow slice where prose reasoning fails: rule sets with defaults, exceptions and priorities, minimal-fix and allocation problems, and compliance rules over bounded cases.
- **Solution.**
  - One skill `rule-reasoning`, `maturity: experimental`, with a narrow trigger.
  - **clingo is the only engine**, declared in `dependencies.yaml` (pip, MIT, wheels on all OSs). It is not bundled.
  - **`scripts/run_rules.py`** takes rules, facts and tests, and returns the answer, the derivation, the grounding size, the time, and the plain-language paraphrase of each rule, in a fixed format.
  - **`references/`**:
    - `patterns.md`: consistency, exceptions and priority, minimal fix, closure; each is an ASP template;
    - `rules-from-text.md`: the handover's 5.1 steps 2, 3 and 8 only, citing bdd-gherkin and clarity-gate for the rest;
    - `when-not.md`: use SHACL/OWL for conformance, SPARQL/SQL/Python for closure over data, and keep anything in prose that cannot be paraphrased back;
  - a templates folder for a reasoning project (rules, facts, tests, runs) that cites the spine and does not restate it;
  - one-line pointers from conceptual-modelling and linkml-engineering.
- **Execution.**
  - Failure case: Claude reasoning in prose about one real rule set (a regulation clause set with exceptions, or the offer-anatomy cross-references) gets a case wrong. This needs recording. The owner picks the case.
  - Trial 2: run it on that case. CQ tests are not part of it; they go to the linkml-engineering side PR.
  - Keep it if the owner reaches for it again and the fix-up loops are few.
- **Side PR (TINY, direct, not an EPIC):** CQ tests with pre-registered expected answers in linkml-engineering `references/quality-gates.md`.
- **Dependency.** clingo goes in `dependencies.yaml`: kind `framework` (the script imports it) or `cli-tool` (`clingo` is also a command), to be settled in B. `run_rules.py` fails with a one-line install hint (`pip install clingo`) when the import fails. This replaces the handover's `check_env.sh`.
- **Facets.** Use the existing values: subject `modelling` (`facets.yaml:31`) for `rule-reasoning` and `obsidian` (`:36`) for `learned-rules`. No `facets.yaml` change.
- **Open question:** whether a real client rule set exists to serve as the failure case.

### EPIC C: `dialectical-elicitation`: **SMALL**, trial-first, last

- **What it is about.** An Elenchus-style session in which the agent only challenges and the expert commits, retracts or refines. It produces the model plus the auditable rationale behind each commitment, which is a sellable deliverable aligned with the explainability positioning.
- **Solution.**
  - **Trial first, no catalogue change**: adapt the Elenchus `CLAUDE.md` protocol (MIT) to keep state in project markdown files (commitments, denials, tensions, resolutions), never GitHub issues, since client material must stay out of trackers. Run one real ontology workshop of at most 45 minutes. pyNMMS is used only if the formal check adds something the expert notices.
  - **If the trial passes**: extend semantic-consulting-coach (meaningfy-consulting) with a "dialectical mode" reference. The coach already owns no-solutions elicitation, and the new reference adds challenge and tension tracking. A one-line pointer from conceptual-modelling (meaningfy-architecture) is the only cross-bundle touch. Upgrade it to its own skill only if a second user appears.
  - It can also run on the owner's own tacit principles (handover 8.15), which would feed playbooks in A.
- **Execution.** Trial 3, with the keep and drop tests from handover §6.
- **Open questions:**
  - which session or client;
  - the third-party notice if any protocol text is reused verbatim.

### Not an EPIC here

| Item | Where it goes |
|---|---|
| Langfuse spike | A `docs/future-features.md` row under devops. It is an observability question (4 services, 16 GiB), not reasoning |
| Stop-hook "applied" footer, MCP over rules, Chat-mode gap | Dropped. Revisit only if the override signal proves insufficient after trial 1 |
| SysML v2, eclingo, argumentation, Z3, Prolog, DuckDB, Soufflé, RL, Odoo KG mirror | No-gos until a recorded failure needs them |
| HumemAI as a memory MCP replacement | Out of scope; the memory MCP is a separate concern |

## 5. How we execute

1. **Now**: the umbrella `reasoning-capabilities` holds the research (this folder) and the split. It ships no specs itself. Each child EPIC cites it as golden-thread parent and carries its own capability spec.
2. **Owner session** (about 30 min): settle the open questions below, and supply the failure cases for A and B.
3. **EPIC A**: shape, run the PLAN gate (≥9/10), implement on `feat/learned-rules`, release, then the one-month trial.
4. **EPIC B**: same flow, and can start once A's PLAN is gated.
5. **EPIC C**: the trial needs no catalogue change, and the EPIC is written only if the trial passes.
6. **Side PRs**: the CQ-tests line in linkml-engineering and the Langfuse future-features row.

The split (A/B/C), the order and every no-go above are **proposed**. Only DEC-1 (umbrella plus children) is the owner's.

## 6. Questions only the owner can answer (most important first)

1. **Approve the cut**: 2 new skills (`learned-rules`, `rule-reasoning`), the coach extension after a trial, and everything else listed as a no-go. Or name what to restore.
2. **Failure cases**: three real corrections for A, and one real rule-set case where prose reasoning failed for B. Without them, the method's failure-first rule blocks both.
3. **Playbook home and loading**: which vault folder, whether the new kind is `playbook` (recommended) or `rule`, and how a playbook reaches the session (option (a) vault `AGENTS.md` plus (b) a line in the offers skills, recommended; see §4 A).
4. **Approval rhythm**: a weekly batch in the sweep (recommended, reuses what exists) or inline at the end of each session.
5. **Repo learning**: leave it to auto memory and CLAUDE.md (recommended), or route it into playbooks too.
6. **Elenchus trial**: which session, and whether the owner wants to be the first respondent (on the owner's own principles).

## 7. Research still open (only if needed)

- The NL2SHACL-Bench per-model numbers (arXiv 2608.07530). They matter only if B grows a SHACL-from-text path, which it does not.
- The TellOnce paper's rule representation in detail. Worth a 20-minute read before A's design, to borrow its scope and conflict logic.
- Whether opencode's `instructions` globs can load a vault playbook outside the repo. This feeds the loading options in §4 A.
- Precedence cycles and circular exceptions were not exercised by the spike. Add one case each to the lint's tests in A.

## 8. Review record

An independent review subagent checked this synthesis on 2026-10-28.
- It re-ran the spike and spot-checked 15 of the audit's citations. It found 12 accurate.
- Of the 3 it disputed, two are correct on re-check:
  - `sales-operations/references/run-types.md:65` does contain "The filters learn: a kind of finding seen in two sweeps…";
  - `vault-promote/SKILL.md:55` is the "Owns: the promotion check" line.
- The third was wrong: the rule on new folders is at `vault-conventions/SKILL.md:48-49`, not 40-42. It is corrected in the audit.
- Its other findings are applied above: the rule format slot and scope vocabulary, the spike claim, loading as A's main question, `last-confirmed` and golden examples, the trial 2 scope, existing facet values, the partial coach overlap, the "proposed" markers, and the dependency kind and failure hint.
