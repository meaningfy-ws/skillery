# House Style Profile — W3DS Library (Prompt A output)

**Corpus:** 8 LinkedIn newsletter articles, *On Web 3.0 Data Space* / Post-Platforms
Foundation. Authors: Alex Tourski (CEO), one by Egor Yakovlev.
*Wish List Fulfillment · eReputation · Why Businesses Need W3DS · From Fear to Control ·
What's Wrong With Blockchain? · Sovereign Identifiers · Interoperability via eVaults ·
Future of Work and Adult Learning.*

> **Method caveat (read first).** The canonical system assumes a multi-genre corpus
> with authoritative `GENRE:` labels, so house voice can be cleanly separated from
> genre convention. This corpus is **single-genre** (all 8 are the same publication
> format: the long-form advocacy article) and arrived **unlabelled**. The "genres" in
> §3 are therefore *macro-structural sub-types* I inferred, not given labels. The
> voice/structure split still works, but treat §3's labels as my inference. See §4.

---

## 1. House Voice (constant across all sub-types)

- **Register & formality** — RULE. Semi-formal, essayistic, accessible to an intelligent
  layperson; educated but non-academic; frequent conversational asides. Evidence:
  "Spoiler: Not really."; "Can you picture it? Good."
- **Tone & attitude** — RULE. Evangelistic, confident, movement-building; optimistic
  about W3DS, polemical toward rivals. Evidence: "digital lords"; "the nightmare of
  corporate data management".
- **Stance toward reader** — RULE. Collegial-persuasive and didactic; reader is a
  prospective convert. Evidence: "We invite you to explore"; "How about you? Join".
- **Person & address** — RULE. "We" = the foundation; "I" for grievance/field anecdotes;
  pervasive "you/your"; imperative openers. Evidence: "It's your problem."; "Imagine
  everyone having a single personal".
- **Sentence habits** — RULE. Mixed length; medium explanatory sentences broken by very
  short punch lines; active voice dominant; little hedging. Evidence: "Both scenarios
  are unacceptable."; "It's your problem."
- **Lexical character** — RULE. Very high proprietary-coinage density; capitalised concept
  nouns; analogy as the primary explanatory engine; liberal cultural name-dropping.
  Evidence: "eVault"; "treating a headache by cutting off the head".
- **Conspicuous absences** — TENDENCY. Usually no source citations even for hard stats;
  little academic hedging; minimal corporate throat-clearing. Counter-evidence: Gallup
  and Korn Ferry are cited once for an $8T figure (so: usually absent, not always).
- **Punctuation & formatting fingerprints** — RULE. Spaced em/en dashes; question-headers;
  a **bold lead/hook paragraph**; standalone bold or blockquoted pull-quotes; ellipses
  for trailing; question-then-answer rhythm. TENDENCY: an epigraph sometimes opens.

---

## 2. Lexicon & Terminology Bank

**Preferred terms (+ meaning):** Web 3.0 Data Space / W3DS (the architecture);
eVault (personal data server); post-platform ("dataless platform"); Sovereign Identifier
(an eVault's self-generated UUID-style ID); eName (lifelong person identifier);
ePassport, eID (auth credentials); eReputation (portable signed reputation); eMoney,
eVoting; Wish List; "Internet account"; Persistent Identifiers (PIDs); Commons; prosumer;
W3 Adapter (translation bridge); W3DS envelopes (RDF triples + ACL); Cerberus (anti-fraud
registries); Registries; Identity Pyramid; Personal Development Triangle; Global Skills
Marketplace; virtual companies; data@source; "military-grade security".

**Technical vocabulary in play:** Linked Data, RDF triples, ontologies, schema.org, UUID,
PKI, X.509, eIDAS, zero-knowledge / PETs, man-in-the-middle.

**Internal abbreviations:** W3DS (Web 3.0 Data Space), PID (Persistent Identifier),
LLL (Life Long Learning), KYC/AML, ACL (Access Control List), PET (Privacy Enhancing Tech).

**Default named personas:** Alice (primary), Bob, Clara, Susan, John Smith, Anna, Matt.

**Spelling/casing conventions** — RULE. US spelling ("behavior", "neighbor", "favorite",
"organize", "recognize"). TENDENCY (defect): spaced thousands separators ("2 000").

**Words/phrases to avoid (reproduction guardrails):** unsourced hard statistics stated as
fact; source typos ("Monopolie", "survivial", "freedome"); invented quotes attributed to
real named people.

---

## 3. Genre (sub-type) Profiles

### 3.1 Vision essay — *Wish List, eReputation*
- **Purpose & audience:** paint a desirable future capability for a general LinkedIn reader.
- **Structure:** hook scene → status-quo limitation → "imagine instead" → mechanism →
  second-order social benefit → invitation.
- **Length:** ~1,200–2,000 words.
- **Formatting:** bold hook paragraph; question-headers; pull-quote beats; hashtag close.
- **Opening/closing:** opens on a vivid scene or historical sweep ("Since the dawn of
  humanity"); closes inviting the reader + sibling-article links.
- **Tone shift:** none; warmest and most lyrical end of the range.
- **Characteristic phrases:** "Imagine…"; "It's like having a friend who spots a rare book".

### 3.2 Polemic / debunk — *Blockchain, From Fear to Control*
- **Purpose & audience:** dismantle a rival paradigm for sceptics and partners.
- **Structure:** hook → stakes → systematic teardown (promise-vs-reality OR two-futures
  scenario) → "here is the alternative" → reflection/key takeaway.
- **Length:** ~2,500–6,000 words, sub-headed chapters.
- **Formatting:** numbered "Promise N: … – Actually, No" sections; NB/disclaimer aside.
- **Opening/closing:** opens by naming the target and stakes; closes on a key takeaway line.
- **Tone shift:** sharper, more combative. Evidence: "the talk of … 'decentralization' is a lie".
- **Characteristic phrases:** "Promise N: X – Actually, No"; "like a drowning man clutching a lifebuoy".

### 3.3 Requirements brief — *Why Businesses Need W3DS*
- **Purpose & audience:** enumerate concrete demands for large corporations / cities / gov.
- **Structure:** context → scope ("what we mean by…") → numbered requirements → rollout → conclusion.
- **Length:** ~3,000 words.
- **Formatting:** each item has a "Stakeholders:" line and a bold "Business requirement:" line.
- **Opening/closing:** opens on an EC/Data-Space framing; closes on rollout outlook.
- **Tone shift:** more measured, consultative.
- **Characteristic phrases:** "Business requirement:"; "out of the scope of Data Space".

### 3.4 Explainer / systemic deep-dive — *Sovereign Identifiers, Interoperability*
- **Purpose & audience:** explain one mechanism/concept rigorously for specialists + lay readers.
- **Structure:** optional epigraph → problem statement → proposed mechanism → enumerated
  properties/components → "Concern:/Addressing Concerns" Q&A → "how real is it" status close.
- **Length:** ~2,000–5,000 words, numbered sections and sub-sections.
- **Formatting:** numbered §; "Component 1/2/3" or "6.1/6.2/6.3"; "Concern:" subheads;
  inline diagrams (corporate-vector family).
- **Opening/closing:** sometimes opens on an epigraph (the Confucius lines); closes on
  prototype/launch status and a partner invitation.
- **Tone shift:** most analytical; still uses a named persona (Alice) to stay concrete.
- **Characteristic phrases:** "Concern: …"; "Let's start by asking ourselves".

### 3.5 Use-case cascade — *Future of Work*
- **Purpose & audience:** show a domain transformed, through many concrete scenarios.
- **Structure:** bold-italic hook → current-situation diagnosis → "unleash imagination" →
  numbered named-persona use cases → synthesis (unifying concept + diagram) →
  multi-stakeholder discussion → rollout → invitation.
- **Length:** ~4,000–6,000 words.
- **Formatting:** "Use Case N:" headers with personas; a synthesising diagram; POV subheads.
- **Opening/closing:** opens on a bold-italic manifesto paragraph; closes "No one should
  ever live in fear of losing their job again."
- **Tone shift:** aspirational, future-tense throughout.
- **Characteristic phrases:** "Jobs will search for people."; "Use Case N: …".

---

## 4. Confidence & Gaps

- **Well-evidenced (high confidence):** all of §1 House Voice; the Lexicon (§2); the five
  sub-type structures (§3), each seen in ≥1 full document, most in 2.
- **Thin / single-source:** the epigraph-opener device (one instance, Sovereign Identifiers);
  the "cites a source" behaviour (one instance, Future of Work) — hence tagged TENDENCY.
- **Structural caveat (the load-bearing one):** this is a **single-genre** corpus. The
  canonical house-voice-vs-genre split assumes multiple document types (minutes, wiki,
  handbook). Here the "genres" are macro-structural sub-types of one publication format.
  The voice layer is genuinely constant; what varies is structure. If you later add truly
  different document types (a whitepaper, a tender response, an email), re-run Prompt A
  with `GENRE:` labels so the split is clean.
- **Labels inferred, not given:** the corpus arrived unlabelled; §3's sub-type names are my
  inference. Confirm or relabel before treating them as authoritative.
- **Author skew:** 7 of 8 by one author (Tourski). The profile is really *his* voice as
  much as the foundation's; a second author's pieces would test that.
- **Open questions for the team:** (a) is US spelling / em-dash use intentional house style
  or incidental? (b) should the reproduction keep the originals' unsourced-statistics and
  invented-real-people-quotes habits, or correct them? (c) are there document types beyond
  the LinkedIn article that this profile should eventually cover?
