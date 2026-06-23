# Explanation: Why the Package Is Built This Way

**Diataxis:** Explanation. **Audience:** maintainers and stakeholders.
Understanding-oriented; no steps. For steps, see the how-to.

---

## Why separate voice from genre

A house voice is the fingerprint that stays constant whatever you are writing.
A genre convention is what changes with the document type: the structure of an
essay differs from a meeting note, but the personality behind both is the same.
If you fuse the two into one prompt, every new genre forces you to re-derive the
voice, and the voice drifts a little each time. Holding voice in one shared
reference (`house-voice.md`) and letting genre doers prepend it keeps the
fingerprint stable across an expanding set of document types.

There is an honesty problem specific to this corpus, though. It is a single
genre written almost entirely by one author. So here, voice and genre collapse
into one signal: what the profile captures is really "this author's essay
voice", not a company fingerprint observed across genres. The separation is
sound as an architecture; it just cannot be *exercised* until a second genre or
author enters the corpus. Treat the current profile as one author's long-read
voice, not as a validated multi-genre house style.

## Why one controlling metaphor is load-bearing

Across the five articles, the single most reliable signature is that each piece
is organised around one vivid conceit and keeps returning to it: the elephant,
the octopus, the golden key, the Identity Pyramid. The metaphor is not
decoration; it carries the argument and gives the essay its shape. An imitation
can get the vocabulary and the punctuation right and still fail if it scatters
three half-metaphors instead of committing to one. That is why the metaphor rule
sits first in every do/don't list and first in the self-check.

## Why the operative artefacts sit outside Diataxis

Diataxis classifies documentation: text a human reads to learn, to do a task, to
look something up, or to understand. A generation prompt is none of these. It is
an instruction a machine executes. It is closer to source code or configuration
than to a how-to guide. The nearest doc-analogue is Reference, because a prompt
is declarative and authoritative, but calling an executable prompt "Reference
documentation" confuses the product with the documentation about it.

So the package is governed by two different schemes at once. The human-facing
half (profile, voice reference, how-to, explanation) is organised by Diataxis.
The machine-facing half (genre prompt, banner brief) is organised by the
prompt-engineering layering: shared voice, then structure, then channel doer,
then quality gate. Keeping these two schemes distinct is what stops the package
from turning into an undifferentiated pile of "docs".

## Why three traits are knobs, not defaults

The corpus uses US spelling, leans on em-dashes, and makes sweeping claims with
large round numbers. All three run against the Meaningfy house standards, where
spelling is UK, em-dashes are banned, and overclaiming is the most load-bearing
thing to avoid. Rather than silently pick a side, the package isolates these as
explicit switches at the top of `house-voice.md`. Default-on reproduces the
target voice faithfully; flipping them adapts the same machinery toward Meaningfy
norms. The decision is surfaced rather than buried, and reversible in one line.

## What "good" looks like

The package is working when a generated essay, given a real brief, is
indistinguishable from a held-out real one to someone who knows the corpus. No
trait list proves this on its own. The holdout comparison is the test that
matters; everything else is scaffolding to make passing it repeatable.
