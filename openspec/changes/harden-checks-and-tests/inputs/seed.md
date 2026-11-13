# Seed: harden checks and tests

**Secondary input, never groomed.** Captured 2026-11-13 from the owner's conversation; the shaped
EPIC is `../proposal.md`.

## Where the conversation started

The owner asked how adversarial testing is specified in the catalogue. Findings:

- It is prescribed only in `epic-delivery`: a conditional **adversarial tester** brief
  (`references/team-and-briefs.md` §Adversarial tester), played by `implementer` (sonnet), once per
  stage in the Challenge step, writing tests only; a failing test is a bug the lead decides in
  step 4.
- The review set of each appetite is data in
  `skills/epic-delivery/assets/workflows/epic-delivery.workflow.json` (`reviews.<appetite>.tester`):
  the tester runs only at LARGE, VERY LARGE and HUGE.
- The brief names targets ("edge cases, bad input, failures, limits"), not techniques. Hypothesis is
  item 10 of `cosmic-python/references/testing-checklist.md` only. Mutation testing, static
  analysis rules and formal methods appear nowhere.

## What the owner asked for (own words, condensed)

1. "lets include in the testing suite using semgrep with their open suite of tests ... we can
   probably harden the cosmic python rules, or never use a freetext key rule in dicts ... mainly for
   general good practice rules. not project specific."
2. "maybe some rule on adocs ..., maybe rules on how a makefile shall be? ... we can pair it with
   codeql, both running locally with meaningfy and external rules libraries"
3. "relate return to adversarial tester discussion, so lets start using hypothesis for that?"
4. "and of course mutmut to strengthen tests, super important, to be done once a week only."
5. "we need once in a while, why not on every epic implementation, a revision of the import linter
   if it is extensive, if it is correct"
6. On folder structure: "anything for folder structure, if possible and folder names?"

## Owner decisions taken in the conversation (round 0)

| Q | Decision |
|---|---|
| CodeQL scope | **Semgrep only.** CodeQL is free only on public/open-source code; private repos would need paid GitHub Code Security. CodeQL is dropped from the standard for now. |
| Tester cutoff | **MEDIUM and up**, Hypothesis-driven (properties, stateful tests, Schemathesis where an OpenAPI contract exists). |
| Non-Python checks | **Vale** for AsciiDoc/Markdown; a **Makefile vs template** check; and a **folder structure / folder names** check if possible. |
| Next step | Shape the EPIC now, in a new worktree. |

## Context the agent brought (not decided)

- Semgrep: YAML rules with code-shaped patterns; `semgrep --test` with `# ruleid:` / `# ok:`
  annotations makes each rule test-first. Registry packs (`p/python`, `p/security-audit`,
  `p/secrets`) give a baseline under the Semgrep Rules License (internal use allowed). Free taint
  mode is intra-procedural only.
- Semgrep has no AsciiDoc or Makefile parser (only `generic` mode), hence Vale and a template check.
- Candidate Meaningfy rules map to `cosmic-python` antipatterns: `AP-IO-IN-MODELS`,
  `AP-FREESTR-ANYLAYER`, `AP-DICT-AS-MODEL`, `AP-EXCEPTIONS-EMBEDDED`, `AP-GENERIC-MODULE-NAMES`,
  `AP-PARALLEL-LAYOUTS`; plus generic hygiene (no `requests` without timeout, no naive `datetime`,
  no bare `except`, no SPARQL built from strings).
- `meaningfy-code-review` L3 already says "an automatable Confirmation that is not automated is a
  finding"; Semgrep gives ADR Confirmations a tool.
- `project-setup` already owns the Makefile template (`assets/templates/root/Makefile.tmpl`), the
  `.importlinter` template and the canonical layout (`references/layout.md`).
- mutmut: too slow per PR; weekly scheduled run, report-only at first, survivors become an issue.
- Import-linter review: a mechanical part (every top-level package covered by a contract;
  `ignore_imports` did not grow without a `DEC-n`) and a judgement part (contracts match the
  layering and the EPIC's ADRs, in the L3 lens), once per EPIC.
- TLA+/Alloy/CrossHair: design-time tools, parked; no change in this EPIC unless the owner says so.
- Ordering: the open EPIC `navigator-follows-the-work` (DEC-12) also edits the review sets in
  `epic-delivery.workflow.json`.
