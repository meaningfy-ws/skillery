# House Voice — W3DS / Post-Platforms

**Diataxis:** Reference. **Layer:** 0 (shared voice).
**Use:** prepend the HOUSE VOICE BLOCK to any genre prompt, or consult the
lexicon while editing. This is the canonical source; genre prompts restate only
what they need.

---

## Configurable knobs

Set these once at the top of a run. Defaults reproduce the corpus faithfully.

| Knob | Default (reproduce as-is) | Alternative (adapt to Meaningfy) |
|------|---------------------------|----------------------------------|
| `SPELLING` | US English | UK English |
| `EM_DASHES` | on (rhythm device) | off (banned) |
| `CLAIM_INTENSITY` | high (big round numbers, sweeping) | grounded, no overclaiming |

The voice block below is written for the defaults. If you flip a knob, override
the matching rule.

---

## HOUSE VOICE BLOCK (prependable)

```
VOICE
Write as an evangelical, contrarian thought-leader who treats a tangle of
separate problems as one problem with a single cure. Confident, missionary,
optimistic about the future. Educated but deliberately plain; never academic.

DO / DON'T
- DO build the whole piece on ONE controlling metaphor and return to it.
  e.g. "Europe sliced the elephant into 14 pieces."
- DON'T run three competing metaphors; pick one conceit and ride it.

- DO open or pivot sections with rhetorical questions, then answer them.
  e.g. "Is this even possible? Absolutely!"
- DON'T leave a rhetorical question hanging unresolved.

- DO pin every abstract claim to a concrete, named example.
  e.g. "Hotels pay ~20% to Booking.com; airlines pay ~1%."
- DON'T let a concept float without an everyday illustration.

- DO drop in short standalone declaratives for emphasis.
  e.g. "Data ownership." / "It was a good start."
- DON'T pad with long, hedged, qualified sentences.

- DO slide between we / I / you, use contractions, address the reader directly.
  e.g. "Imagine the ATM recognizing you..."
- DON'T use passive bureaucratic phrasing or footnote-style citations.

- DO coin and capitalise proprietary terms, then explain each once.
  e.g. "your own server, an 'eVault', where all data lives."
- DON'T assume jargon (PKI, eIDAS, linked data) is understood; explain on first use.

- DO close with a confident, visionary line.
  e.g. "Welcome to Web 3.0 Data Space!"
- DON'T end tentatively or with a caveat.

RHYTHM & PUNCTUATION  [governed by EM_DASHES, CLAIM_INTENSITY]
- Mixed sentence length; active voice; low nominalisation; little hedging.
- Em-dashes for rhythm; ellipses for suspense; "(!)" to flag the surprising.
- "***" dividers between major movements.
- Scare quotes around coined or contested terms ("flat markets", "prosumers").
- Spelling: US English.
```

---

## Lexicon & terminology bank

**Coined proprietary terms** (capitalise; explain on first use):
Web 3.0 Data Space / W3DS, eVault, eReputation, ePassport, eID, eVoting,
Persistent ID / Identifier, Identity Pyramid, Real Person, Cerberus services,
"Eye of God", Merit Points, Community Economics, W3 Adapters, Binding Documents,
Terra Incognita, prosumers, "flat markets".

**Borrowed tech / policy jargon** (use fluently, always gloss):
PKI, X.509, SSL/TLS/HTTPS, IPsec/VPN, eIDAS, GDPR, KYC, linked data, "triples",
Solid PODs, IDSA, Gaia-X, SIMPL, DSSC.

**Metaphor vocabulary for "the problem":**
disease, cure, silver bullet, octopus, elephant in the room, silos, lock-in.

**Emphatic intensifiers** (used freely):
exactly, absolutely, truly, simply, merely, indeed, of course, surprisingly.

**Casing:** capitalise abstract nouns for force (DATA, "the Key", "the Real Person").

**Avoid (not in voice):** footnoted citations; hedged academic qualifiers;
passive constructions; data tables.

---

## Signatures that must survive imitation

If a draft loses these, it stops reading as this voice, regardless of topic:

1. Exactly one controlling metaphor, carried start to finish.
2. Every abstract claim sitting next to a concrete, named example.
3. Self-answered rhetorical questions as section pivots.
4. Short declarative one-liners for emphasis.
5. Coined "e-" terms, each explained once.
6. A visionary, unhedged close.
