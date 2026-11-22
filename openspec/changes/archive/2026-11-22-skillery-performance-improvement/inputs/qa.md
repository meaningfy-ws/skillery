# Q&A record: skillery-performance-improvement

**Secondary input, never groomed.** Seed: `seeds/langfuse-analysis-2026-11-22.md`.

## Round 0 (2026-11-22)

## Q-0: What does the owner want?
- Asked because: the request.
- Answer: analyse the last two weeks of coding in Langfuse, find why so many tokens and so much time
  are consumed, and save it as a new EPIC with its inputs, on skillery performance improvement.

## Round 1 (2026-11-22; Q-1 to Q-6, Q-8, Q-9 answered; Q-7 open)

## Q-1: Appetite: one LARGE EPIC, or split into several?
- Asked because: six outcomes (measure, floor, session length, verification, round trips, model
  routing) may outgrow one appetite.
- Recommendation: one LARGE EPIC delivered in stages, measurement first; split only if stage 1's
  measurement shows one lever dominates.
- Answer: one LARGE, staged (the recommendation).
- → DEC-1

## Q-2: What reduction counts as success?
- Asked because: success must be stated before the work (R-0003).
- Recommendation: on the seed's queries over two weeks after release: tokens per user turn -40 %,
  median main-thread context < 120 k, heaviest subagent floor < 40 k, no drop in gates passed.
- Answer: -40 % tokens per turn, with the other three measures (the recommendation).
- → DEC-2

## Q-3: May the verification fan-out shrink?
- Asked because: about 55 % of spawns review, check or fix; the owner's rules R-0004 and P-0006 ask
  for parallel subagents.
- Recommendation: keep every gate, scale the fan-out by appetite and risk, let the lead fix small
  findings in its own context, bound fix loops to one pass; revise R-0004/P-0006 to say "when it
  pays".
- Answer: scale by appetite and risk (the recommendation), including revising R-0004/P-0006.
- → DEC-3

## Q-4: How is session hygiene made to happen?
- Asked because: the rule exists but sessions reach 500-980 k.
- Recommendation: a mod that warns at a threshold (e.g. 200 k) and at stage boundaries, plus a
  hand-over note; never a blocking hook.
- Answer: a warning mod and a hand-over note (the recommendation).
- → DEC-4

## Q-5: Who picks the model per role?
- Asked because: Fable and Opus run long and routine work.
- Recommendation: the agent definition names the model (builders and reviewers on Sonnet, lead on
  Opus, Fable on request); the owner can override per session.
- Answer: yes, name the model per role.
- → DEC-5

## Q-6: Is the usage report a committed tool or a documented procedure?
- Asked because: the measurement must be repeatable to judge the EPIC.
- Recommendation: a documented procedure (the seed's queries through the Langfuse MCP) first; a tool
  only if it is run more than monthly.
- Answer: the report is valuable; keep it somewhere it can be compared with later ones as
  skillery advances; similar reports exist in archived EPICs or docs. Found: the 2026-11-09
  transcript-based evidence in `archive/2026-11-09-lean-delivery/inputs/evidence-skillery-time.md`
  and the rdf-persistence efficiency issue beside it; `session-retrospective` owns reading
  "where agent-session time and money went" from transcripts and has no Langfuse half yet.
- → DEC-6

## Q-8: Are the rdf-persistence and MWB2 fixes part of this EPIC?
- Asked because: the audit (§8) found repository-side causes (P-0016 "same session", `-v`
  gates, Serena misconfigured, the GitNexus block twice) that skillery cannot change.
- Recommendation: no; file them as issues in each repository now (they are quick and pay at
  once), and fix the templates here so new repositories do not repeat them.
- Answer: file them as issues. Filed 2026-11-22:
  - rdf-persistence: #280 quiet gates (R-1, R-6); #281 P-0016 session boundary (R-2); #282 merge
    `--auto` (R-3); #283 Serena per worktree (R-4); #284 builder load (R-7, R-8, R-9).
  - mapping-workbench-v2: #104 GitNexus block twice + per-edit impact (M-1, M-2); #105 Serena
    python (M-4); #106 slim AGENTS.md (M-5, M-6, M-9); #107 duplicate skills + agent models (M-3,
    M-10); #108 gates and hook (M-7, M-8, M-11).
- → DEC-8

## Q-9: Replace the borrowed clarity checklist and drop the stream-coding preload?
- Asked because: audit S-2, S-3: the Stream Coding checklist pushes PLAN size (design.md 45-83 KB)
  and stream-coding (25 KB) is preloaded beside a gate it duplicates.
- Recommendation: yes; a Meaningfy checklist of about 4 KB with minimums scaled by appetite, and a
  design.md size budget per appetite enforced by lint.
- Answer: agreed.
- → DEC-9

## Round 3 (2026-11-22; the owner's inputs on the audit, in the order of its levers)

## Q-10: Does skillery still evolve for both CLIs?
- Asked because: the owner stated it.
- Answer: "we could abandon for now the need for skillery to evolve for opencli, because it is
  used mainly for Claude CLI."
- Conflict flagged: `AGENTS.md` mandates dual-CLI parity and `make validate` gates enforce it; the
  no-go "nothing that works on one CLI only" is dropped from this EPIC, the opencode gates are not
  broken on purpose, and the governance change itself is the owner's, outside this EPIC.
- → DEC-10; candidate rule for the rulebook (shown at wrap-up).

## Q-11: Session resets (D-1, R-2, S-5)
- Answer: do something about D-1; plan to remove rdf-persistence's P-0016 (issue #281); reset or
  compact wherever possible, because the state is always saved in artefacts; shape and plan one
  EPIC in the same session.
- Clarification given: for one EPIC, shaping and planning already share a session; S-5 is about
  one session running over every EPIC of an initiative. Now: compaction after `proposal.md` is
  saved, a fresh session per EPIC in an initiative.
- → folds into DEC-4 and stage 2.

## Q-12: The fixer loop (D-6)
- Answer: the fixer has a limit and does not loop; past it, it raises the issue for a solution or a
  re-analysis.
- → DEC-12

## Q-13: Verification fan-out (S-1, D-2, D-3)
- Answer: mitigate S-1, lighter but not less effective over the whole EPIC; make verification,
  validation and adversarial review lighter with combined goals where possible.
- → folds into DEC-3 and stage 3.

## Q-14: The lead's own work (D-5)
- Answer: the lead does lightweight chores itself and delegates the heavyweight ones; always runs
  things in parallel when possible to minimise time; instructs subagents how results come back;
  knows when to reset or compact itself. Question: do subagents inherit the parent's context?
- Answer given: no. A Claude Code subagent starts from the system prompt, the bindings, the tool
  definitions, the skill listing and the brief; it does not see the parent's conversation (the
  `fork` type is the exception and copies it all). That is the 32-81 k floor, and why the brief
  and the report shape matter.
- → DEC-13

## Q-15: GitNexus cadence (D-4, M-2)
- Answer: run it once when work on a piece of the plan starts; once the work is done, re-index,
  then impact analysis; use it wisely, as often as necessary, never in excess.
- → DEC-11

## Q-16: The heavy floor (D-7)
- Answer: run a sanitation session on this machine and the other one to find which skills are
  used and which can be uninstalled.
- Data: the trace tags of the fortnight name about 36 distinct skills loaded (meaningfy: rulebook,
  rule-learner, epic-delivery, epic-planning, clarity-gate, spec-stewardship, meaningfy-release,
  meaningfy-code-review, bdd-gherkin, cosmic-python, guardrails, technical-writing,
  explanatory-writing, writing-antipatterns, test-strategy, test-suite-care, project-setup,
  git-workflow, skillery-feedback, architecture, conceptual-modelling, modelling-conventions,
  contract-practice, service-reliability; external: opsx ×3, openspec ×2, superpowers ×4,
  plugin-authoring, update-config, claude-in-chrome, ponytail ×2, langfuse, claude-api) against
  about 370 installed `SKILL.md` files.
- → DEC-17

## Q-17: What builders load (D-10)
- Answer: not sure what for; probably reduce it.
- → folds into stage 4 (a short builder card; the principles catalogue read by id).

## Q-18: Stream coding (S-2, S-3)
- Answer: what are better ways of using it, do we need it, is there a better way of doing
  spec-driven implementation, or is it useful and kept?
- Answer given: its useful idea, documentation so clear that code follows, is already the spine
  (EPIC → PLAN → Gherkin → TDD); its 13-item gate is the ancestor of `clarity-gate`, which owns
  the gate now (DEC-9). Keep it as an external reference loaded on demand, never preloaded.
- → DEC-16

## Q-19: Model declarations (D-9)
- Answer: fix them; is there a central place deciding which task uses which model, perhaps in
  the workflow definitions or a matrix?
- Answer given: today `guardrails` has a `model_rank` list and a prose rule, and each agent sets
  its own `model:`; nothing ties them. One matrix (role × task class → model) as a `guardrails`
  asset; agents must match it (lint); workflows name roles, not models.
- → DEC-15 (refines DEC-5)

## Q-20: A principle for tool output (R-1, M-11)
- Answer: `-v` is bad, but we need a principle for all tools so subagents keep outputs small;
  how would it sound?
- Draft: "A tool call returns a result, not a log. Ask the tool for its summary (`-q`, `--stat`,
  `-rfE`, `| tail -20`); when the output may exceed about 40 lines, send it to a file and read
  back only the lines that decide the next step; never print a file to read it, use Read. The
  lines are the deliverable only when the owner asked for them."
- → DEC-14

## Q-21: Repository bugs (M-4, R-4, M-1) and MWB2's AGENTS.md
- Answer: M-4 is a big bug; R-4 needs fixing; M-1 needs fixing; MWB2's 22 KB AGENTS.md needs
  rewriting and slimming now that the project is set up and can advance.
- Filed already as #105, #283, #104 and #106 (DEC-8); the rewrite request noted on #106.

## Q-7: Risk: what outside this work could change the result?
- Asked because: risk question (R-0002).
- Sub-questions: what in the CLIs, models or pricing could change under us; who is hurt and how
  badly if a cut lowers quality; what we do; what we accept.
- Answer (2026-11-22):
  - What could change: the CLIs (context, compaction, window handling); models and prices. Not
    chosen: Langfuse tracing changes, our own rules growing back.
  - Who is hurt: the EPIC guards explicitly against a weak PLAN passing the slimmer gate. Not
    chosen as explicit guards: a defect reaching develop, a template misfiring in a new repo, a
    session ending mid-step.
  - What we do: numbers gate each stage; the deep review stays one flag away; the baseline
    queries are frozen in the procedure. Not chosen: a single thresholds-and-models asset.
  - What we accept: misses a fifth lens would catch; re-tuning when the CLIs change; a noisy first
    measurement; repositories lagging the templates.
- Risks for the PLAN:
  - RISK-1 the CLIs change how context or compaction works — likely over a year, medium impact;
    mitigate: stage gated by numbers, frozen queries; accept: a re-tuning pass per release.
  - RISK-2 models or prices change — likely, medium; mitigate: stage gated by numbers; accept: a
    re-tuning pass.
  - RISK-3 a weak PLAN passes the slimmer checklist — possible, medium (rework in delivery);
    mitigate: the full checklist available on a recorded risk, the design budget scaled by
    appetite, measured against gates-passed.
  - RISK-4 a grouped review misses a defect a fifth lens would catch — possible, medium;
    mitigate: five lenses on a recorded risk; accept at SMALL and MEDIUM.
  - RISK-5 the first two-week measurement carries a different work mix — likely, low; accept.
  - RISK-6 existing repositories lag the templates — certain, low; accept, their issues carry it.
- → DEC-7
