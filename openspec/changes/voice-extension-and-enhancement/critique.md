# Critique & Recommendations — `voice-extension-and-enhancement/proposal.md`

> Input for a revision pass. Each finding has: **what's wrong**, **why**, **recommended change**,
> and a **decision the author must make**. Grounded in (a) the `inputs/` kit's own caveats and
> (b) three external write-ups on AI voice capture (agent.ai, moonproduct, Copilot-Studio guide).
> External steals are marked `[ext]`.

## TL;DR verdict

The EPIC bundles **two deliverables of different readiness** into one change:

- **The craft** (`explanatory-writing`) — validated, concrete, reusable today. **Ship it.**
- **The capture method + profile store + bundle + Doc** (`style-capture`) — a factory with no raw
  material (DEC-4 defers the only thing it consumes: a real corpus). **Defer to a follow-up EPIC.**

Recommended shape: **ship one skill in `meaningfy-core`, two by-reference touches, nothing else.**
Everything below either supports that split or hardens whatever survives.

---

## A. Structural findings (change the shape of the EPIC)

### A1 — `style-capture` ships a factory with no raw material `[ext]`
- **What:** The skill's whole method is `corpus → profile → layered prompts → holdout`. DEC-4 defers
  capturing a real corpus. The one shipped profile is "rule-derived, not corpus-captured" — it
  bypassed the method entirely.
- **Why it's wrong:** Zero validated runs at ship time. All three external sources make
  "capture from 10–20 performant samples" **step 1**, and explicitly name *authored-from-rules /
  aspirational* profiles as the **failure case** ("a mirror to your real voice, not your aspirational
  one"). The proposal ships the known-bad input as its only product.
- **Recommend:** Remove `style-capture`, the profile store, the `meaningfy-writing` bundle, and the
  Doc from this EPIC. Move them to a follow-up EPIC whose **entry condition is "a real
  10–20-piece Meaningfy corpus exists."**
- **Decision:** Is the deliverable *the craft* (ready) or *the method* (no input exists)? Pick one
  per EPIC.

### A2 — The corpus is closer than DEC-4 assumes `[ext]`
- **What:** DEC-4 treats corpus capture as a distant follow-up "once a labelled, multi-genre corpus
  exists."
- **Why it's wrong:** The external method needs ~10–20 representative, recent, performant pieces —
  that's a half-day of gathering existing Meaningfy docs/posts, not a research project.
- **Recommend:** Either (a) gather the corpus **now** and make it the real input to a `style-capture`
  EPIC, or (b) explicitly accept "no corpus yet" and defer the whole method half (A1). Do **not**
  ship a method against a hand-authored profile.
- **Decision:** Grab the corpus now, or defer the method? (Not: ship the method with no corpus.)

### A3 — One skill, not two (for now)
- **What:** DEC-1 splits into two skills for "crisp triggers."
- **Why it's wrong:** `style-capture` has no usable trigger until a corpus exists (A1). Splitting now
  ships a skill nobody can fire. The validated craft is one coherent thing.
- **Recommend:** Ship `explanatory-writing` only. When the corpus EPIC lands, split out
  `style-capture` then — splitting is cheap later and justified by a real second use.
- **Decision:** Confirm the split is deferred, not cancelled.

### A4 — No new bundle for a single skill
- **What:** DEC-6 adds an additive `meaningfy-writing` bundle for the two new skills.
- **Why it's wrong:** A bundle is family-level org overhead. After A3 there's one skill, whose natural
  neighbour is `technical-writing` in `meaningfy-core`.
- **Recommend:** Put `explanatory-writing` in `meaningfy-core`. Create `meaningfy-writing` only when
  the family actually exists (craft + capture + profiles).
- **Decision:** Confirm core placement vs. new bundle.

### A5 — Drop the standalone Doc
- **What:** DEC-7 ships a `docs/` page narrating the system.
- **Why it's wrong:** After A1/A3 the "system" is one skill. A Doc narrating one skill is
  scaffolding-for-later; the purpose×style map is a single table.
- **Recommend:** Fold the map into `explanatory-writing`'s overview. Author the Doc in the follow-up
  EPIC when there's a multi-part system to narrate.
- **Decision:** Confirm fold vs. standalone.

---

## B. Content findings (harden whatever ships)

### B1 — The "warm" end of the register dial is undefined — possibly the banned rhetoric `[ext]`
- **What:** DEC-4's dial: `measured/reference ↔ warm/thought-leadership`, warm = "where the
  kit-inspired craft lands, gated to Meaningfy norms."
- **Why it's wrong:** The kit's voice IS evangelical/contrarian/sweeping. Gate off US spelling,
  em-dashes, overclaiming, evangelism (all Meaningfy defaults) and the no-go ("no W3DS rhetoric in
  any product artefact") leaves the warm end either **empty** or **smuggling banned rhetoric** under
  a euphemism.
- **Recommend:** Reframe the dial as **"idiosyncrasy budget / blandness tolerance"** — moonproduct's
  documented fix for "lifeless consistency from statistical averaging" (inject one idiosyncratic move
  per piece). That gives the warm end something real and **non-W3DS** to control, dissolving the
  no-go tension. If you can't define what the warm end contains under this framing, **delete the dial**
  and ship one flat house voice.
- **Decision:** Reframe the dial, or drop it?

### B2 — Adopt the 8-axis voice schema instead of a prose blob `[ext]`
- **What:** The kit's `house-voice.md` is a prose VOICE BLOCK + DO/DON'T list.
- **Why it's wrong:** Prose blobs are hard to diff, validate, or compare across genres. moonproduct
  decomposes voice into 8 measurable axes: **tone, sentence rhythm, vocabulary/jargon density, hook
  style, punctuation density, argument structure, citation pattern, closings.**
- **Recommend:** Structure the house voice (and any future profile) as these 8 axes. Your craft moves
  already map onto ~4 (hook = self-answered question; citation = concrete-beside-abstract; closings =
  confident line; rhythm = short declaratives) — make the coverage explicit and fill the gaps.
- **Decision:** Adopt the 8-axis schema as the profile structure?

### B3 — Validation is specified too weakly
- **What:** "Holdout validation" — but the kit's holdout is single-genre.
- **Why it's wrong:** Single-genre holdout proves nothing about reuse, and needs a corpus you don't
  have.
- **Recommend `[ext]`:** Use **variant-batch validation**: generate 3–5 variants per prompt, collect
  ~20–30, inspect for drift; accept/reject feedback calibrates. This runs **today** on existing
  Meaningfy docs — no corpus-capture project needed. Make this the validation move in
  `explanatory-writing`.
- **Decision:** Replace holdout with variant-batch as the day-one validation?

### B4 — Knob-gate: positive framing over prohibition `[ext]`
- **What:** The knob-gate is framed as "quarantine / banned / off" (three prohibitions).
- **Why it's wrong:** Copilot-Studio guidance: "tell the agent what to do, not what to avoid" — models
  follow positive rules better.
- **Recommend:** Reframe each knob as a positive default (e.g. "UK spelling; grounded claims with
  named figures; rhythm via short sentences not em-dashes"), with the foreign-voice flip as the
  exception.
- **Decision:** Invert the gate to positive defaults?

---

## C. Boundary / governance findings

### C1 — Four skills now touch one paragraph; prove the routing `[ext]`
- **What:** "Write an explainer" now routes through `technical-writing` (Explanation sub-mode) →
  `explanatory-writing` (texture) → `clarity-gate` (check) → maybe `executive-communication`
  (structure). `boundary` + `related_skills` frontmatter documents seams but doesn't make a
  four-way carve trigger cleanly.
- **Recommend:** Add to the PLAN **one concrete worked routing trace** — a single real request,
  showing which skill owns which sentence. If it can't be written crisply, the boundary isn't crisp.
- **Decision:** Author the routing trace before the PLAN passes the clarity gate.

### C2 — State a precedence rule, not just non-overlapping scopes `[ext]`
- **What:** DEC-2/3/5 carve ownership but don't say who wins when directives compete.
- **Why it's wrong:** Copilot guidance: competing directives need an explicit priority hierarchy
  (e.g. "structure > clarity > texture"), or the model picks arbitrarily.
- **Recommend:** Add a one-line precedence rule to the surviving skill's boundary section.
- **Decision:** Fix the precedence order.

### C3 — The Layer 0–3 architecture is canonized from a description, not a working system
- **What:** Solution outline commits to the faceted Layer 0–3 model as durable capability.
- **Why it's wrong:** The kit's own §4 admits Layer 1 was never split out and Layer 2 is one genre —
  the architecture is aspirational *in the kit too*, validated on n=1 genre.
- **Recommend:** Don't canonize Layer 0–3 in a skill yet. Keep it as a `references/` note in the
  follow-up `style-capture` EPIC, where a second genre can actually test it. The craft skill doesn't
  need it.
- **Decision:** Demote Layer 0–3 from committed architecture to deferred hypothesis?

---

## D. Recommended target shape (the lazy ship)

If you accept A1–A5, the EPIC collapses to:

- **One skill** — `skills/explanatory-writing/` in `meaningfy-core`:
  - the validated craft moves (with before/after examples),
  - the Diátaxis fit-map,
  - the 8-axis voice schema `[B2]`,
  - the knob-gate as **positive Meaningfy defaults + 3 foreign-voice flips** `[B4]`,
  - **variant-batch validation** as the self-check `[B3]`,
  - boundary section with a **precedence rule** `[C2]` and a **routing trace** `[C1]`.
- **Two by-reference touches** — `technical-writing` Explanation-sub-mode link;
  `executive-communication` one-line texture hook. (Unchanged from DEC-5; these are good.)
- **Deferred to a follow-up EPIC** (entry condition: real 10–20-piece corpus exists `[A2]`):
  `style-capture`, the profile store, the `meaningfy-writing` bundle, the standalone Doc, and the
  Layer 0–3 architecture.

This closes the actual gap the EPIC names (nobody owns voice/texture) with the **validated** half of
the kit, and lets the method half earn its place when its input exists.

---

## E. Open decisions for the author (consolidated)

1. **Craft now, method later** — accept the A1–A5 split, or argue the method ships against a
   hand-authored profile?
2. **Corpus** — gather 10–20 real pieces now (half-day) and feed a method EPIC, or defer entirely?
3. **Register dial** — reframe as idiosyncrasy budget `[B1]`, or drop it?
4. **Profile schema** — adopt the 8-axis structure `[B2]`?
5. **Validation** — replace single-genre holdout with variant-batch `[B3]`?
6. **Knob framing** — invert to positive defaults `[B4]`?
7. **Routing + precedence** — commit to authoring the trace `[C1]` and precedence rule `[C2]` in the
   PLAN?
