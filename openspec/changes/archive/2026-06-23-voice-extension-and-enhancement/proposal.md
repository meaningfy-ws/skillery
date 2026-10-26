# EPIC: explanatory-writing — own voice & texture (the validated craft)

> Shaped via `superpowers:brainstorming` from the `inputs/` kit, then narrowed by `critique.md`.
> The kit is **provenance only** — the craft is extracted; the topic (post-platforms / W3DS / data
> spaces) is dropped. The kit's *method* half (capture → profiles → Layer 0–3) is **deferred** to a
> follow-up EPIC because it has no raw material yet (see Deferred). This EPIC ships only the part
> that is validated and usable today.

## Appetite

Small. One new cross-cutting skill plus two by-reference touches into existing skills. No new bundle,
no Doc, no runtime code.

## Why

Meaningfy has skills that own document **structure** (`executive-communication`, `proposal-writing`,
`decision-package`) and doc **production** (`technical-writing`), but nothing owns **voice and
texture** — the craft that makes explanatory prose read clean. The `inputs/` kit isolated that craft
as a set of topic-independent moves. Shipping it closes a real gap with the kit's *validated* half;
the kit's capture *method* has no input (no real Meaningfy corpus exists) and is deferred rather than
shipped against a hand-authored, aspirational profile — the documented failure case.

## Solution outline

Ship **one skill**, `explanatory-writing`, in `meaningfy-core`, and wire two existing skills to it
**by reference only**:

- `explanatory-writing` owns the craft: one controlling metaphor; concrete-beside-abstract;
  self-answered question pivots; short declaratives; direct address; coin-and-explain; story spine.
  It carries the **Diátaxis fit-map** (home = Explanation; partial = Tutorial framing; off = How-to /
  Reference), an **8-axis voice schema**, a **knob-gate as positive Meaningfy defaults**, and
  **variant-batch validation** as the self-check.
- `technical-writing` gains a scoped **Explanation sub-mode** that links to `explanatory-writing`.
- `executive-communication` gains a one-line **texture hook** (controlling metaphor ≈ Governing
  Thought).

## Key decisions

- **DEC-1**: Ship the **validated craft only**. The capture method, the profile store, the
  `meaningfy-writing` bundle, the standalone Doc, and the Layer 0–3 architecture are **deferred** to a
  follow-up EPIC (see Deferred). Splitting out a second `style-capture` skill is **deferred, not
  cancelled** — cheap to split later, and justified only by a real second use.
- **DEC-2**: Place `explanatory-writing` in **`meaningfy-core`** beside `technical-writing`. **No
  bundle reorg** — the role bundles from `catalogue-ux-and-docs` (DEC-1/DEC-3, which removed the old
  `meaningfy-communication` bundle) stay intact; "one place for writing" is achieved by the reference
  discipline in DEC-9, not by a topic bundle.
- **DEC-9**: **Writing knowledge has a single home: the writing-skill family.** The family is
  [`technical-writing`](../../../skills/technical-writing/SKILL.md) (docs / explanations / summaries /
  docstrings), [`executive-communication`](../../../skills/executive-communication/SKILL.md)
  (structure / persuasion **+ the `company-voice.md` profile**), and `explanatory-writing` (the
  explanatory craft). These three own *all* reusable writing guidance. Every other skill that produces
  prose — e.g. [`epic-planning`](../../../skills/epic-planning/SKILL.md),
  [`proposal-writing`](../../../skills/proposal-writing/SKILL.md),
  [`decision-package`](../../../skills/decision-package/SKILL.md),
  [`spec-stewardship`](../../../skills/spec-stewardship/SKILL.md),
  [`bdd-gherkin`](../../../skills/bdd-gherkin/SKILL.md) — **references** the relevant family skill and
  **never restates** its guidance. This EPIC runs a bounded **reference audit**: where a consumer
  already restates writing guidance, replace it with a link; where it produces Explanation-quadrant
  prose, point it at `explanatory-writing`. Most consumers already reference the family
  (proposal-writing → executive-communication; technical-writing → clarity-gate); the audit verifies
  and closes the gaps, it does not rewrite consumer content.
- **DEC-3**: The knob-gate is framed as **positive Meaningfy defaults**, not prohibitions — "UK
  spelling; grounded claims with named figures; rhythm via short sentences, not em-dashes" — each with
  a single foreign-voice **flip** as the explicit exception. (Models follow positive rules better than
  bans.) **The defaults do not restate the house standard — they cross-link to it.** The authoritative
  house-voice profile already exists at
  [`company-voice.md`](../../../skills/executive-communication/references/company-voice.md) (British
  English, no em dash, no overclaiming, the two registers); the secondary sources are the
  **Writing style** section of [`technical-writing/SKILL.md`](../../../skills/technical-writing/SKILL.md)
  and [`clarity-gate/SKILL.md`](../../../skills/clarity-gate/SKILL.md). The skill *inherits* that baseline rather
  than forking a second copy; if a default and a linked source ever disagree, the linked source wins.
- **DEC-4**: The voice is structured on an **8-axis schema** — tone, sentence rhythm,
  vocabulary/jargon density, hook style, punctuation density, argument structure, citation pattern,
  closings. The craft moves map onto ~4 axes (hook = self-answered question; citation =
  concrete-beside-abstract; closings = confident line; rhythm = short declaratives); the EPIC makes
  that coverage explicit and fills the gaps. This schema is diffable and reused by the future method.
- **DEC-5**: Day-one validation is **variant-batch**, not single-genre holdout: generate 3–5 variants
  per prompt, collect ~20–30, inspect for drift, calibrate on accept/reject. This runs **today** on
  existing Meaningfy docs and needs no corpus-capture project.
- **DEC-6**: **No new register dial.** The earlier "warm/thought-leadership" dial — and its
  idiosyncrasy-budget reframe — is **dropped**: the clarity gate surfaced that
  [`company-voice.md`](../../../skills/executive-communication/references/company-voice.md) already
  defines the register split (**technical/educational** for explainers, articles, docs vs
  **general/executive** for decisions) and its selection rule. `explanatory-writing` **executes the
  existing technical/educational register**; it does not introduce a parallel one. (This supersedes
  the prior DEC-6; the gate-driven change is logged here, not silently edited.)
- **DEC-7**: Enhancements are **by reference only** (single-source-of-authority); structure and
  texture **compose, never merge**. The skill's boundary states an explicit **precedence rule**
  (structure > clarity > texture) for competing directives, and the PLAN must include **one concrete
  worked routing trace** (a single real "write an explainer" request showing which skill owns which
  sentence). If the trace can't be written crisply, the boundary isn't crisp.
- **DEC-8**: Governance — the derived PLAN (incl. the routing trace) passes `clarity-gate` ≥9/10;
  lifecycle per `spec-stewardship`; the skill carries `boundary` + `related_skills` frontmatter so
  triggers don't collide with `technical-writing` / `executive-communication`. **Anti-dilution gate:**
  every before/after example the skill ships must be **vetted against the current house standard**
  (the DEC-3 linked sources) and pass `clarity-gate` — so the examples demonstrate the existing
  Meaningfy voice *with* the craft applied, never a drifted register. This vetting is a PLAN
  acceptance item.

## Rabbit-holes

- Defining the "warm" end of the dial as gated evangelism (rejected — that smuggles the banned
  rhetoric under a euphemism; DEC-6 reframes to an idiosyncrasy budget instead).
- Shipping the capture method against a hand-authored profile (rejected — it bypasses the method's
  own step 1 and ships the known-bad input as the product).
- A new bundle / standalone Doc for one skill (rejected — org overhead for a one-member family).
- Canonizing Layer 0–3 from a description (rejected — the kit itself validated it on n=1 genre).

## No-gos

- No W3DS / Post-Platforms / data-spaces content in any product artefact.
- No capture method, profile store, bundle, Doc, or Layer 0–3 architecture in **this** EPIC.
- No new runtime code — one skill, two reference touches, the DEC-9 reference audit (verification +
  link-fixes only), and the `meaningfy-core` membership edit.
- No bundle reorg and no reintroduction of a `meaningfy-communication`/`meaningfy-writing` bundle.

## Deferred — follow-up EPIC

A second EPIC, **entry condition: a real 10–20-piece Meaningfy corpus exists** (recent,
representative, performant — roughly a half-day to gather, not a research project), will own:
`style-capture` (corpus → profile → layered prompts), the **profile store**, the **Layer 0–3**
faceted architecture (where a second genre can actually test it), and the standalone **Doc** that
narrates the multi-part system. The 8-axis schema (DEC-4) is the hand-off contract between the two
EPICs. **No `meaningfy-writing` bundle** is planned — "one place for writing" is the reference
discipline (DEC-9), and the role-bundle taxonomy stays as `catalogue-ux-and-docs` set it.

---

## What Changes

- New `skills/explanatory-writing/` (`SKILL.md` + `references/`: craft moves with before/after
  examples; the Diátaxis fit-map; the 8-axis schema; the positive-default knob table; the
  variant-batch self-check; a boundary section with precedence rule).
- `skills/technical-writing/SKILL.md` — add the Explanation sub-mode reference (by link, no restating).
- `skills/executive-communication/SKILL.md` — add the texture hook (by link, no restating).
- **Reference audit (DEC-9)** — verify `epic-planning`, `proposal-writing`, `decision-package`,
  `spec-stewardship`, `bdd-gherkin` reference the writing family rather than restate writing guidance;
  add the link where a gap exists. Verification only; no consumer content is rewritten.
- `.claude-plugin/marketplace.json` — add `explanatory-writing` to `meaningfy-core`; version bump.
- Validator: confirm `explanatory-writing` resolves under `meaningfy-core` (no bundle-set change).

## Capabilities

### New Capabilities

- **explanatory-writing** — reusable voice/texture craft for Explanation-quadrant and broad-audience prose: the moves, the Diátaxis fit-map, the 8-axis schema, positive-default knobs, and variant-batch validation.

### Modified Capabilities

- **technical-writing** — gains an Explanation sub-mode that borrows `explanatory-writing` craft for explainers (terse/reference output unchanged).
- **executive-communication** — gains an optional texture hook for client-facing narrative; grounded-claim defaults stay in force.

## Impact

Skills / config only — no runtime behaviour. Closes the actual gap the work names (nobody owns
voice/texture) with the validated half of the kit; establishes a **single writing-knowledge home**
(the writing-skill family) that consumers reference rather than duplicate (DEC-9); and lets the
capture method earn its place in a follow-up EPIC when its input — a real corpus — exists. The
role-bundle taxonomy is unchanged.
