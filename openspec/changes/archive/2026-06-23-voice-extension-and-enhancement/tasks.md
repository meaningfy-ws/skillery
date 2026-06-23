# PLAN (tasks half) — explanatory-writing: own voice & texture

> Derived from EPIC "explanatory-writing — own voice & texture (the validated craft)"

## 1. Skill scaffold

- [x] 1.1 Create `skills/explanatory-writing/SKILL.md` — frontmatter (`name`, `description`,
  `boundary`, `related_skills`), overview, and the Diátaxis fit-map (Explanation = home; Tutorial =
  partial; How-to / Reference = off) [satisfies "owns voice/texture" requirement]
- [x] 1.2 `references/craft-moves.md` — the moves with **vetted** before/after examples [satisfies the
  craft + DEC-8 vetting scenarios]
- [x] 1.3 `references/voice-schema.md` — the 8-axis schema + craft-move mapping; the four gap axes
  filled by linking `company-voice.md` (not restated) (D-4)
- [x] 1.4 `references/knobs.md` — positive defaults, each **cross-linked** to its source (primary
  `company-voice.md`; secondary `technical-writing` Writing-style + `clarity-gate`), with "linked
  source wins" (D-2) [satisfies the knob-conflict scenario]
- [x] 1.5 SKILL.md boundary section — precedence rule (structure > clarity > texture), the
  voice-vs-craft ownership split with `executive-communication`, + the worked routing trace (D-3)
  [satisfies the routing scenario]
- [x] 1.6 SKILL.md self-check — variant-batch validation procedure (D-6)
- [x] 1.7 SKILL.md — execute `company-voice.md`'s technical/educational register; defer register
  selection to it; introduce no new dial (D-5)

## 2. By-reference touches

- [x] 2.1 `skills/technical-writing/SKILL.md` — add the Explanation sub-mode link (no restating)
- [x] 2.2 `skills/executive-communication/SKILL.md` — add the one-line texture hook pointing to
  `explanatory-writing` for craft execution of `company-voice.md`'s educational register (no restating)
- [x] 2.3 Reference audit (D-7 map): verify `epic-planning`, `proposal-writing`, `decision-package`,
  `spec-stewardship`, `bdd-gherkin` reference the writing family; add a link only where writing
  guidance is restated; rewrite no consumer content [satisfies the single-home scenario]

## 3. Catalogue wiring

- [x] 3.1 `.claude-plugin/marketplace.json` — add `explanatory-writing` to `meaningfy-core`; version bump
- [x] 3.2 `make validate` green — skill resolves under `meaningfy-core`; `boundary` + `related_skills`
  present; no deferred artefact (bundle / `profiles/` store / Doc) introduced [satisfies the
  deferred-scope scenario]

## 4. Anti-dilution acceptance (DEC-8)

- [x] 4.1 Vet every before/after example against the linked house standard and `clarity-gate`; reject
  and re-author any that read punchier than the current house voice

## Roadmap

- [x] 1.1 · [x] 1.2 · [x] 1.3 · [x] 1.4 · [x] 1.5 · [x] 1.6 · [x] 1.7 · [x] 2.1 · [x] 2.2 · [x] 2.3 · [x] 3.1 · [x] 3.2 · [x] 4.1

## Verification

`make validate` green; the PLAN scores `clarity-gate` ≥9/10 (incl. the routing trace); every shipped
example passes DEC-8 vetting; the fit-map and precedence rule are present; no deferred artefact ships.
