> Derived from EPIC "Two-mode PR review with refactoring investigation" (`proposal.md`)

## 1. Skill: review modes

- [x] 1.1 Add `## Review modes` to `skills/meaningfy-code-review/SKILL.md` — standalone (default, via `code-reviewer` agent) and interactive (main thread); satisfies `pr-review-modes` "two modes with distinct homes".
- [x] 1.2 Add the interactive thinking-partner protocol + trigger (developer engages → continue in main thread, read-only, fixes go to `implementer`); satisfies "interactive mode is a thinking-partner protocol".

## 1b. Skill: lenses + always-subagent isolation

- [x] 1.3 Add a `### Lenses` table to the skill — L1 Security, L2 Spec-correctness+tests, L3 Architecture, L4 Principles+clean-code, L5 Fit+elegance+refactoring — each with bundled aspects (incl. the not-named ones: per-layer coverage, naming, exceptions/constants homing, over-fragmentation, validate-at-boundary) and the catalogue ids it anchors to; include the **Lens MECE boundaries** (L3 structural vs L4 within-unit; L4 local-defect vs L5 cross-file-reuse/refactoring; L2 alone judges against requirements/specs); satisfies "fixed set of lenses, one per subagent run".
- [x] 1.4 State the always-subagent isolation rule (analysis in subagents; aggregation + interactive discussion in main thread); satisfies "review analysis always runs in isolated subagents".

## 2. Skill: fit & refactoring investigation

- [x] 2.1 Add `### Fit & refactoring investigation` checklist subsection (fit to existing code + architecture + principles; refactor new + touched code; recommendations-only), citing existing ids only; satisfies "both modes perform a fit-and-refactoring investigation".
- [x] 2.2 Specify the gitnexus blast-radius requirement for refactor candidates incl. warn-and-proceed when unavailable; satisfies "refactor recommendations carry gitnexus blast radius".
- [x] 2.3 Update `## Boundary & Related Skills` for the two modes + recommendations-only refactoring.

## 3. Agent: standalone scoping + investigation step

- [x] 3.1 Scope `agents/code-reviewer.md` to one-lens-per-subagent-run; add a lens input (L1–L5, default note = caller runs all five); keep read-only; always invoked as a subagent.
- [x] 3.2 Add the L5 fit-and-refactoring process step extending the existing gitnexus blast-radius pattern to refactor candidates (new + touched code).

## 4. Editorial + validation

- [x] 4.1 Confirm checklist lines keep cited ids + one-line glosses and that the four intake anti-patterns remain cited (not moved); satisfies "cited catalogue ids are preserved" / "no catalogue relocation".
- [x] 4.2 Run `make validate` and fix any single-source / reciprocal-related / trigger findings.

## Roadmap

- [x] 1.1 · [x] 1.2 · [x] 1.3 · [x] 1.4 · [x] 2.1 · [x] 2.2 · [x] 2.3 · [x] 3.1 · [x] 3.2 · [x] 4.1 · [x] 4.2

## Verification

`make validate` stays green (single-source, reciprocal related-skills, triggers); each spec scenario in `specs/pr-review-modes/spec.md` is satisfied by the edited skill/agent; clarity gate ≥9/10 on the PLAN pair.
