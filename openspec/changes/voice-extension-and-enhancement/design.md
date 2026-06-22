# PLAN (design half) — explanatory-writing: own voice & texture

> Parent: EPIC "explanatory-writing — own voice & texture (the validated craft)" (proposal.md in this change)

## Context

Skills/docs-only change. The EPIC ships **one** skill, `skills/explanatory-writing/`, into
`meaningfy-core`, plus two by-reference touches into `technical-writing` and
`executive-communication`. The capture method, profile store, bundle, Doc, and Layer 0–3 architecture
are deferred (proposal Deferred section). No runtime code; the testable surface is the validator,
the skill's own self-check, and the anti-dilution vetting (DEC-8).

The "current Meaningfy voice" is **already captured**, not merely tacit: the authoritative house-voice
profile lives at
[`company-voice.md`](../../../skills/executive-communication/references/company-voice.md) (British
English, no em dash, no overclaiming, the SMILE values, and a **two-register split** —
technical/educational vs general/executive — with before/after examples). Secondary homes are the
**Writing style** section of [`technical-writing/SKILL.md`](../../../skills/technical-writing/SKILL.md)
and [`clarity-gate/SKILL.md`](../../../skills/clarity-gate/SKILL.md). This PLAN's central constraint:
the new skill must **inherit** `company-voice.md`, never fork a second copy. `explanatory-writing` adds
the *craft execution* layer (how to write the technical/educational register well) that
`company-voice.md` does not cover; it restates none of its rules.

## Goals / Non-Goals

**Goals:** a self-contained `explanatory-writing` skill carrying the craft moves (with vetted
before/after examples), the Diátaxis fit-map, the 8-axis voice schema, the knob-gate as positive
defaults cross-linked to the house standard, the variant-batch self-check, and a boundary section
with a precedence rule and a worked routing trace; the two by-reference touches; the `meaningfy-core`
membership + validator wiring.

**Non-Goals:** the capture method, profile store, `meaningfy-writing` bundle, standalone Doc, and
Layer 0–3 architecture (deferred EPIC); capturing a real Meaningfy corpus; any runtime code.

## Decisions

Settled bets are in the EPIC (DEC-1…DEC-8); below are the **new** technical choices this PLAN makes.

- **D-1 — Skill layout.** `SKILL.md` (frontmatter + overview + fit-map + boundary) plus
  `references/{craft-moves.md, voice-schema.md, knobs.md}`. Three small reference files over one
  blob, so each axis is diffable (mirrors how the deferred method will consume the schema). Rejected:
  a single fat SKILL.md (hard to diff, collides with the "small focused skills" preference).
- **D-2 — DEC-3 realised as links, not copies.** `knobs.md` states each positive default as a one-line
  rule whose authority is a **link** to its house source — primary:
  [`company-voice.md`](../../../skills/executive-communication/references/company-voice.md);
  secondary: the Writing-style section of
  [`technical-writing/SKILL.md`](../../../skills/technical-writing/SKILL.md) and
  [`clarity-gate/SKILL.md`](../../../skills/clarity-gate/SKILL.md) — with the rule "if a default and
  its linked source disagree, the linked source wins." No house rule is restated. The
  `explanatory-writing` ↔ `executive-communication` boundary is: `company-voice.md` (owned by
  `executive-communication`) holds *what the voice is*; `explanatory-writing` holds *how to execute the
  craft* within it.
- **D-3 — Precedence + routing trace (DEC-7, critique C1/C2).** Boundary section fixes
  **structure > clarity > texture** and ships one concrete worked trace (see Algorithm). The trace is
  the crispness test: if ownership can't be assigned sentence-by-sentence, the boundary fails the gate.
- **D-4 — 8-axis schema with explicit gap-fill (DEC-4).** The four axes the craft already covers are
  mapped; the four it does not (tone, vocabulary/jargon density, punctuation density, argument
  structure) are filled from the house standard, not invented.
- **D-5 — No new register dial (DEC-6, gate-driven).** The idiosyncrasy-budget dial is dropped:
  [`company-voice.md`](../../../skills/executive-communication/references/company-voice.md) already
  owns the register split and its selection rule ("teach → technical/educational; decide →
  general/executive"). `explanatory-writing` executes the **technical/educational** register and
  defers register *selection* to `company-voice.md`. No parallel dial is introduced.
- **D-6 — Variant-batch self-check (DEC-5).** The skill's quality gate is: generate 3–5 variants,
  collect ~20–30 across prompts, inspect for drift against the fit-map + knobs, calibrate on
  accept/reject. Runs on existing Meaningfy docs; needs no corpus capture.
- **D-7 — Single writing home + reference audit (DEC-9).** Writing knowledge lives only in the
  writing-skill family; consumers reference it. The audit is **verification-first**: for each consumer
  below, confirm an existing reference or add one; rewrite no consumer content. The reference map:

  | Consumer skill | Produces | References (writing family) | Status today |
  |---|---|---|---|
  | `epic-planning` | EPIC/PLAN prose | `technical-writing`, `clarity-gate` | verify; add `explanatory-writing` for Explanation prose |
  | `proposal-writing` | proposal + SoW | `executive-communication` | already references — verify |
  | `decision-package` | decision artefact | `executive-communication` | already references — verify |
  | `spec-stewardship` | spec/groom prose | `technical-writing` | verify; add link if missing |
  | `bdd-gherkin` | business-language scenarios | `executive-communication` (plain business voice) | add link if a writing rule is restated |

  Edits land only where a consumer **restates** writing guidance; otherwise the cell is a no-op.

## Algorithm / approach

**The craft, as the skill applies it.** Given a drafting request already classified as
Explanation-quadrant prose: pick one controlling metaphor; set a concrete named example beside every
abstract claim; use a self-answered question as a section pivot; break rhythm with short
declaratives; coin-and-explain any term once; close on a confident grounded line — all within the
knob defaults.

**Worked routing trace (the C1 deliverable).** Request: *"Write an explainer of how eVault sync works,
for the docs site."*
- `technical-writing` owns **placement & form**: it is a `docs/` Explanation page (AsciiDoc/Antora),
  not Reference; it invokes the Explanation sub-mode.
- `explanatory-writing` owns **texture**: the controlling metaphor, example-beside-claim, the
  question pivot, the rhythm, the close — under UK/grounded/short-sentence knobs.
- `clarity-gate` owns **the check**: actionable · current · specific refs · single-source.
- `executive-communication` is **not** invoked (no decision to drive). *Were* this a client
  recommendation, it would own answer-first structure — and **precedence (structure > texture)** means
  its "lead with the answer" overrides the essay's slow-burn metaphor lede: lead with the answer, then
  apply texture beneath it.

This is idempotent by nature: the skill emits guidance/text, holds no state, and is safe to re-run.

### Anti-patterns
- ❌ Restating a `company-voice.md` rule in `knobs.md` instead of linking it (forks the baseline — DEC-3).
- ❌ Applying the craft to Reference/How-to prose (the fit-map says off — dilutes those quadrants).
- ❌ Introducing a new register dial instead of deferring to `company-voice.md`'s two registers (DEC-6).
- ❌ Shipping any deferred artefact (profile store, bundle, Doc, Layer 0–3) in this change.
- ❌ A before/after example that reads punchier than the current house standard (DEC-8 vetting).
- ❌ A consumer skill restating writing guidance instead of linking the family (DEC-9 — duplicates the home).
- ❌ Reintroducing a writing/communication bundle (reverses `catalogue-ux-and-docs` DEC-3).

## Error matrix

| Failure mode | Expected handling |
|---|---|
| A knob default contradicts its linked house source | Linked source wins (D-2); the default is corrected, not the source |
| Craft requested for Reference/How-to text | Fit-map declines; skill points back to `technical-writing`/how-to form |
| Routing trace can't assign ownership sentence-by-sentence | Boundary fails `clarity-gate`; revise the carve, do not ship |
| A shipped example drifts from the house standard | DEC-8 vetting rejects it; re-author against the linked sources |
| Register selection ambiguous (teach vs decide) | Defer to `company-voice.md`'s selection rule (DEC-6); no parallel dial |
| `explanatory-writing` trigger collides with `technical-writing`/`executive-communication` | `boundary` + `related_skills` frontmatter + the routing trace + the `company-voice.md` ownership split disambiguate |

## Risks / Trade-offs

- **[Voice dilution toward rhetoric]** → Mitigation: knobs as linked defaults (DEC-3), precedence
  texture-last (DEC-7), example vetting (DEC-8). Residual is live authoring discipline, guarded by
  `clarity-gate`.
- **[Trigger overlap with `technical-writing`]** → Mitigation: the fit-map (texture vs placement) and
  the worked routing trace make the seam concrete, not just declared.
- **[Boundary overlap with `executive-communication`'s `company-voice.md`]** → Mitigation: the explicit
  ownership split (voice = `company-voice.md`; craft execution = `explanatory-writing`) and the
  link-don't-copy rule (D-2) keep a single source for every voice rule.

## Open Questions

- **HQ-VOICE.1 — RESOLVED by the clarity gate.** The dial question is closed: `company-voice.md`
  already owns the register split, so `explanatory-writing` executes its technical/educational
  register and adds no dial (D-5). No open questions remain.
