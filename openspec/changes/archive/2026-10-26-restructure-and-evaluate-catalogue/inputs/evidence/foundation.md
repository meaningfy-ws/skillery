# Evidence: foundation skills (task 3.3, D-15)

**Date:** 2026-10-26. **Model runs:** none.

## The first foundation skill

- `company-voice.md` moved (`git mv`, unchanged) from `executive-communication/references/` to
  `meaningfy-voice/references/`. `meaningfy-voice` is in `meaningfy-core`, posture `precise`, with a
  short `SKILL.md` and two probes (a positive, and a near-miss against `executive-communication`).
- Every bundle implicitly requires `meaningfy-core` (`bundle_requirements` rejects listing it), so
  every bundle citing `meaningfy-voice` already depends on it; no `requires:` line was added.
  Citing skills: `executive-communication` (consulting), `explanatory-writing`,
  `writing-antipatterns` (core), `vault-daily` (vault-assistant).

## Cross-skill paths resolved

`cross_skill_paths` found 197 links from one skill into another; all were resolved by name citation.

| Link target | Count | Resolution |
|---|---|---|
| another skill's `SKILL.md` | 177 | the link became the backticked skill name (three anchors into `ci-cd-delivery` and `meaningfy-git-workflow` dropped) |
| `executive-communication/references/company-voice.md` | 7 | moved by the rule of two; cited as `meaningfy-voice` |
| `semantic-consulting-coach/references/engagement-model.md` | 5 | name citation: the engagement model is the coach's own subject |
| `modelling-conventions/references/naming-and-identity.md`, `editor-guardrails.md` | 3 | name citation: these are the conventions skill's own subject |
| `project-setup/references/architecture-guardrails.md`, `settings-pattern.md` | 3 | name citation |
| `cosmic-python/references/principles-and-anti-patterns.md` | 1 | name citation |
| `writing-antipatterns/references/contract.md` (from `company-voice.md`) | 1 | name citation |

**Rule-of-two candidates for the owner:** `engagement-model.md` (read by `decision-package` and
`proposal-writing`) and `naming-and-identity.md` (read by `conceptual-modelling` and
`linkml-engineering`) are each needed by two other skills. They stay with their owner, cited by name,
because each is that skill's own subject, not a shared resource; moving either into a foundation
skill is a follow-on decision.

## Hand-offs the citations exposed

Path-shaped link labels hid four Delegates edges from `bundle_requirements`. Each crossed bundles
against the requirement graph (`meaningfy-architecture` → `meaningfy-building` would be a cycle), so
each became a "see also" sentence (the D-9 rule):

- `conceptual-modelling` → `cosmic-python`; `linkml-engineering` → `cosmic-python`;
- `decision-package` → `conceptual-modelling` and → `architecture` (already worded "hand-offs, not
  peers").
