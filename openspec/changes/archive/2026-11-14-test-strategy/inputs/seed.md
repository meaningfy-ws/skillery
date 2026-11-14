# Seed: test-strategy (EPIC A)

**Secondary input, never groomed.** Captured 2026-11-13 from the owner's conversation that first
shaped `harden-checks-and-tests` (see `../../harden-checks-and-tests/inputs/`). That EPIC was
re-shaped into four (A–D); this is A, the foundation.

## The owner's words (condensed, verbatim where quoted)

- "I wonder if we can have a specialised testing skill, and indeed there are plenty of various
  testing types, per purpose and per activity type (software development, documentation, dev ops,
  UI design, work shaping, modelling, architecting, etc. ... not to mention that we might need some
  more generic testing skills for generic tasks, such as sales, linkedin post writing, writing legal
  contracts ...)"
- "for each testing type we will need also to choose what tools are appropriate and when to run
  them, and each test is asking the specific set of questions: are we building the right thing, are
  we building the thing right? are our tests representative, have a strong coverage? is the
  implementation covering edge cases? is the document clear, are there risks in the contract? etc."
- **"Lets agree that TDD/BDD philosophy is core across all activities we do, and for each activity
  we execute we shall know, when/how we fail and how we succeed."**
- "is it a testing skill only or is it a testing and validation and verification and review and
  revising and adversarial testing and criticising etc ... ??? or these are activities in a
  workflow that call on special skills and tools and methods?"
- "what shall we do with all testing and verification and validation that already exists in this
  repo across various skills?"
- "i like test-strategy"

## What the agent found (context, not decided)

Checks already in the catalogue, by phase:

| Phase | Check | Owner today |
|---|---|---|
| Shaping | Clarity gate; test-scenario interview; risk question; attack the PLAN | `clarity-gate`, `epic-planning` |
| Design | Gherkin from use cases; validated examples and competency questions; engine-checked rule sets; ADR Confirmation | `bdd-gherkin`, `conceptual-modelling`, `formal-reasoning`, `architecture` |
| Build | Test-first loop; testing checklist; test tiers, markers, coverage gate; LinkML quality gates | superpowers TDD (external), `cosmic-python`, `project-setup` (`testing-setup.md`), `linkml-engineering` |
| Challenge | Adversarial tester; review lenses L1–L5; checker; check ledger | `epic-delivery`, `meaningfy-code-review` |
| Release, operations | CI, release gates, service levels | `ci-cd-delivery`, `meaningfy-release`, `service-reliability` |
| Docs | Cold reader; docs gate | `technical-writing` |
| Agents | Four-eyes rule, subagent reports; trigger probes; agent Gherkin | `guardrails`, skillery `tests/` |
| Writing (any) | Rule `check` patterns over an output | `rulebook` |

Fragmentation found:

- **Verification vs validation** is defined in `epic-delivery` (§ Verification and validation), so
  activities outside an epic delivery (docs, contracts, sales) cannot reach it.
- **Two homes for fixture rules:** `project-setup/references/testing-setup.md` says "polyfactory per
  model"; `cosmic-python/references/testing-checklist.md` item 6 says "small builder functions,
  through the models". `testing-setup.md` also restates the TDD/BDD loop owned by superpowers TDD and
  `bdd-gherkin`.
- No skill says which technique answers which question, for any activity.

## Owner decisions (round 6)

| Q | Decision |
|---|---|
| Model | Agreed: `test-strategy` owns the discipline (the loop, the questions, the stances, the activity × question → technique matrix); domain skills keep their techniques; workflows own when and who. Review, adversarial testing and revising are workflow steps, not separate skills. |
| Split | A (this) → B (`harden-checks-and-tests`, re-based) → C (`activity-test-profiles`) → D (`generic-task-test-profiles`). |
| Now | "why not seed all of them here in this worktree, then shape A, then move on and rebase B" |
| Testing checklist | "what is best? we shall also be consistent, no? do similarly across other testing activities?" → the agent's answer, taken as DEC-8: technique content stays with the activity's owning skill, so the checklist stays in `cosmic-python`. |
