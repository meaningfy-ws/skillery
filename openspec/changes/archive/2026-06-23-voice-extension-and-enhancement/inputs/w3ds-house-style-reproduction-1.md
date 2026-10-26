# W3DS Library — House Style Profile & Generation System (v0.1 draft)

Corpus analysed: 5 LinkedIn newsletter articles from *On Web 3.0 Data Space* /
Post-Platforms Foundation — *Wish List Fulfillment*, *The Backbone of Future
Society: eReputation*, *Why Businesses Need W3DS*, *From Fear to Control*, *What's
Wrong With Blockchain?* (authors: Alex Tourski; one by Egor Yakovlev). Five further
articles from the same publication are available on disk if a larger sample is wanted.

> **Scope flags before you use this.**
> 1. **Single genre.** All five documents are the same genre: a long-form
>    persuasive advocacy essay published as a LinkedIn newsletter piece. The
>    two-layer "house voice vs genre convention" split assumes a multi-genre corpus;
>    here the two layers collapse, so what follows is the fingerprint of *one* genre
>    with three macro-structural sub-types, not a cross-genre house voice.
> 2. **Not the Meaningfy voice.** This corpus uses US spelling and heavy em-dash
>    use — the opposite of Meaningfy's stated standard (UK spelling, em dashes
>    banned). Treat this as a separate profile; do not merge it into the Meaningfy
>    house-style assets without an explicit reconciliation decision.
> 3. **Quality is uneven.** The originals contain typos and inconsistent number
>    formatting. These are defects, not style. A reproduction must not imitate them.

---

## 1. House Voice (constant across the corpus)

- **Register:** Semi-formal, essayistic, accessible to an intelligent layperson.
  Educated but deliberately non-academic. Frequent conversational asides.
  Evidence: "Spoiler: Not really."; "Can you picture it? Good."
- **Tone & attitude:** Evangelistic and movement-building, confident, often
  polemical. Optimistic about its own solution; dismissive of rivals. Value-laden
  framing. Evidence: "digital lords"; "the nightmare of corporate data management";
  "the talk of blockchain's 'decentralization' is a lie."
- **Stance to reader:** Collegial-persuasive and didactic. The reader is a
  prospective convert walked through an argument and invited to join. Evidence:
  "We invite you to explore"; "How about you? Join the … project."
- **Person & address:** "We" = the foundation/movement. Occasional "I" for
  first-hand anecdotes (a conference, a hospital visit). "You/your" is pervasive;
  the reader is a participant. Heavy imperative openings: "Imagine…", "Consider…",
  "Let's…".
- **Sentence habits:** Mixed length. Medium explanatory sentences (roughly 15–28
  words) interrupted by very short punch lines for rhythm and emphasis. Active voice
  dominant. Evidence of the punch beat: "Yes, it's possible."; "Both scenarios are
  unacceptable."; "You choose."
- **Lexical character:** Dense proprietary coinage (see Lexicon). Capitalised
  concept nouns. Analogy and metaphor as the primary explanatory engine.
  Liberal cultural/historical name-dropping (Orwell's *1984*, the film *Her*,
  Harari, Berners-Lee, Satoshi, the French Declaration of Rights, Churchill,
  Tulip Mania).
- **Conspicuous absences:** No citations or footnotes despite empirical-sounding
  statistics; no academic hedging; minimal corporate throat-clearing — the argument
  starts fast.
- **Punctuation/formatting fingerprints:** Spaced em/en dashes for asides and
  emphasis; rhetorical-question section headers; a **bold lead/hook paragraph**;
  standalone bold "pull-quote" sentences as emphasis beats; ellipses for dramatic
  trailing; question-then-answer rhythm.

---

## 2. Lexicon & Terminology Bank

**Canonical proprietary terms (preserve capitalisation):** Web 3.0 Data Space
(W3DS), eVault, eReputation, eName, ePassport, eID, eMoney, eVoting, Wish List,
"Internet account", Persistent Identifiers (PIDs), Commons, prosumer, post-platform,
data@source, MetaState.Foundation.

**Recurring problem-frame terms:** data silos, vendor lock-in, data sovereignty /
digital sovereignty, platform monopolies, KYC/AML, man-in-the-middle attack, PKI.

**Real-world entities used as examples:** Uber, Lyft, Glovo, Booking.com, Facebook,
Glassdoor, Google Maps, SAP, IDSA, Gaia-X, Solid, SIMPL, Trezor, Mt. Gox, FTX,
the European Commission, Tim Berners-Lee, Satoshi Nakamoto.

**Spelling/casing:** US spelling in the originals (behavior, neighbor, organize,
recognize). Set this as an explicit toggle in the prompt so the choice is deliberate,
not inherited by accident.

**Avoid:** unsourced hard statistics presented as fact; reproducing the originals'
typos; spaced thousands separators ("2 000").

---

## 3. Rhetorical Device Library (the distinctive layer)

This is what makes the writing recognisable. A reproduction that copies tone but
omits these will read generic. Deploy 2–4 per piece, not all at once.

1. **The two-futures bifurcation.** Frame the present as a fork between a dystopia
   and a flourishing alternative. (Cover art literalises this in *From Fear to Control*.)
2. **Promise-vs-reality debunk.** For a rival technology, list its advertised
   promises, then knock each down: "Promise N: X — Actually, No."
3. **Imagined dialogue / thought experiment.** A short invented scene to dramatise a
   claim (the Elon–Matt exchange, run once under Web 2.0 and once under W3DS).
   **Caution:** the originals put invented quotes in the mouths of real, named public
   figures. Do not reproduce that; use composite or unnamed actors instead.
4. **Concrete everyday vignette.** A small relatable scenario to ground an abstraction
   (borrowing a stepladder; the retired gardener; the seven hospital systems).
5. **Deep analogy.** One sustained metaphor per major point (grain and feudal lords;
   the car-keys-and-ownership story for private keys; the pipe salesman for security).
6. **Historical sweep opener.** Begin with a long-horizon framing ("Since the dawn of
   humanity…"; "Around 12,000 years ago…").
7. **Numbered requirements / options triad.** Enumerate needs (the 15 business needs)
   or force a choice into three options (government / platforms / yourself).
8. **The NB/disclaimer aside.** A short framing caveat that pre-empts objections.
9. **Library cross-linking close.** End with a numbered list of sibling articles plus a
   hashtag block — the publication's signature footer.

---

## 4. Genre Macro-Structures (three sub-types observed)

- **Vision essay** (*Wish List*, *eReputation*): hook → limitation of status quo →
  "imagine instead" → mechanism → second-order social benefits → invitation. ~1,200–2,000 words.
- **Polemic / debunk** (*Blockchain*, *From Fear to Control*): hook → stakes →
  systematic teardown (promise-vs-reality or scenario) → "here is the alternative" →
  reflection/key takeaway. ~2,500–6,000 words; uses sub-headed chapters.
- **Needs/requirements brief** (*Why Businesses Need W3DS*): context/problem →
  scoping ("what we mean by…") → enumerated list with per-item stakeholders and a
  bolded "requirement" line → rollout outlook → conclusion. ~3,000 words.

---

## 5. Shared HOUSE VOICE BLOCK (prepend to any generation prompt)

```
HOUSE VOICE — W3DS Library essay
Write as the Post-Platforms Foundation: an advocacy voice building a movement
around Web 3.0 Data Space.

DO:
- Address the reader directly as "you"; speak as "we" for the foundation.
  e.g. "Imagine everyone having a single personal Internet account."
- Open with a hook that paints a vivid scene or a long-horizon framing.
  e.g. "Since the dawn of humanity, reputation has been the invisible currency…"
- Explain every abstraction through a concrete analogy or everyday vignette.
  e.g. losing a private key = leaving your car keys in a café.
- Vary rhythm: medium explanatory sentences broken by short punch lines.
  e.g. "Both scenarios are unacceptable."
- Use the canonical lexicon exactly (W3DS, eVault, eReputation, eName…).
- Close by inviting the reader to join, and link sibling articles.

DON'T:
- Don't hedge academically or stack qualifiers.
  Not: "It may possibly be the case that data could perhaps be siloed."
- Don't state hard statistics as fact without a source slot.
  Not: "20% of users lost their keys." → flag as {{stat_needs_source}}.
- Don't put invented quotes in the mouths of real named people.
  Not: a fabricated Elon Musk monologue → use an unnamed "a platform CEO".
- Don't use em dashes if {{spelling=UK}} / banned-punctuation mode is set.
- Don't reproduce source typos or spaced thousands separators.

SETTINGS: {{spelling=US|UK}}  {{em_dashes=allow|ban}}  {{length=short|standard|long}}
```

---

## 6. Per-Genre Generation Prompts (copy-ready)

### 6A. Vision essay
```
ROLE: You are writing a Web 3.0 Data Space "vision" essay for LinkedIn.
[PREPEND HOUSE VOICE BLOCK]
INPUTS:
- {{topic}} (the capability or future being painted)
- {{status_quo_limitation}} (what Web 2.0 fails to do)
- {{mechanism}} (how W3DS delivers it)
- {{social_benefit}} (the human/community upside)
STRUCTURE: hook scene → status-quo limitation → "imagine instead" → mechanism →
second-order social benefit → invitation + sibling-article links.
DEVICES (use 2–3): historical-sweep opener OR vivid scene; everyday vignette;
one sustained analogy.
LENGTH: 1,200–2,000 words.
SELF-CHECK: Does it open on a scene, not a definition? Is every abstraction
carried by an analogy or vignette? Does it end on an invitation? Any unsourced
stat flagged?
```

### 6B. Polemic / debunk
```
ROLE: You are writing a Web 3.0 Data Space polemic that dismantles {{rival}}.
[PREPEND HOUSE VOICE BLOCK]
INPUTS:
- {{rival}} (technology or paradigm being critiqued)
- {{rival_promises}} (list of its advertised benefits)
- {{w3ds_alternative}} (what we offer instead)
STRUCTURE: hook → stakes → systematic teardown (promise-vs-reality list OR a
two-futures scenario) → "here is the alternative" → reflection / key takeaway →
sibling-article links.
DEVICES: promise-vs-reality debunk; two-futures bifurcation; an NB/disclaimer
aside up front; optional imagined dialogue (UNNAMED actors only).
LENGTH: 2,500–6,000 words, sub-headed.
SELF-CHECK: Is each promise paired with a concrete rebuttal? Are all dramatised
quotes from composite/unnamed actors? Is the alternative stated, not just the
critique? Stats flagged for sourcing?
```

### 6C. Needs / requirements brief
```
ROLE: You are writing a Web 3.0 Data Space requirements brief for {{audience}}.
[PREPEND HOUSE VOICE BLOCK]
INPUTS:
- {{audience}} (e.g. large corporations, cities)
- {{requirements}} (list; each with stakeholders + the core need)
- {{rollout_note}} (how adoption could happen)
STRUCTURE: context/problem → scope ("what we mean by {{audience}}") → numbered
requirements, each with a stakeholder line and a bold "Business requirement:" line
→ rollout outlook → conclusion → sibling-article links.
DEVICES: numbered enumeration; one vignette per requirement where it helps.
LENGTH: ~3,000 words.
SELF-CHECK: Does every item name its stakeholders and end in a crisp requirement
line? Is the list framed as achievable, not utopian? Stats flagged?
```

### 6D. Cover-image prompt (visual house style)
```
Generate a 16:9 LinkedIn banner. Left third: solid brand-colour panel with the
article title in large bold type. Right two-thirds: an illustration literalising
{{core_metaphor}} (e.g. split dystopia/utopia for a bifurcation; aerial "global
village" for community matching). Include a small "Web 3.0 Data Space Library" tag.
Style: clean, optimistic, slightly editorial-stock. Do NOT include copyrighted
characters, real people, brand logos, or film/TV artwork.
```

---

## 7. Diataxis placement of these artifacts

Diataxis sorts documentation by reader need: learning (tutorial), a goal
(how-to), lookup (reference), understanding (explanation). The reproduction assets
map cleanly:

- **Reference** (information-oriented, looked-up, descriptive):
  Section 1 House Voice Profile, Section 2 Lexicon Bank, Section 3 Device Library,
  Section 4 Genre Macro-Structures. These describe *what the voice is*; they are not
  read start-to-finish.
- **How-to guide** (task-oriented, "produce X"):
  Section 5 House Voice Block, Section 6 generation prompts, and the operating
  instructions (sampling, holdout validation, versioning). These are invoked to get
  a job done. (Caveat: generation prompts are machine-facing instructions; in
  Diataxis terms the human operator uses them as how-to artifacts.)
- **Explanation** (understanding-oriented): a short companion narrative on *why*
  these devices work and why the voice persuades — useful but not yet written here.
- **Tutorial** (learning-oriented): an end-to-end walkthrough that teaches a newcomer
  to run corpus → profile → prompt → validated draft once, hand-held — also not yet
  written.

So: the **profile is Reference**, the **prompts are How-to**, with **Explanation**
and **Tutorial** as the two pieces still missing if you want a complete Diataxis set.

---

## 8. What still needs deciding (open questions)

1. Is this corpus a separate exercise, or intended to fold into the Meaningfy
   tooling? If the latter, the US-spelling/em-dash clash needs an explicit ruling.
2. Should I profile the full 10-PDF set on disk to harden the analysis, or is the
   5-document profile sufficient for now?
3. Do you want the missing **Explanation** and **Tutorial** layers written to
   complete the Diataxis quartet?
