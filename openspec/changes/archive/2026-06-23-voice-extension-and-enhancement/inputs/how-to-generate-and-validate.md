# How-To: Generate, Validate, Refresh, Extend

**Diataxis:** How-to guide. **Audience:** an operator who knows what they want.
Recipes only, no theory. For the "why", see `explanation-design-rationale.md`.

---

## 1. Generate a new essay

1. Open `genre-w3ds-essay.md` and copy the prompt block.
2. Fill the five inputs:
   - `{{topic}}`: the one problem or feature this article tackles.
   - `{{controlling_metaphor}}`: one conceit only.
   - `{{key_examples}}`: 3 to 6 concrete or brand examples.
   - `{{author_name}}` / `{{author_title}}`.
   - `{{sibling_articles}}`: titles for the library list.
3. Run it.
4. Read the draft against the self-check at the foot of the prompt. The most
   common failure is metaphor drift: a second conceit creeping in halfway
   through. If that happens, name the single metaphor explicitly and rerun.

---

## 2. Validate against a holdout (the honest test)

This is the only reliable check. Do it before trusting the prompt on real work.

1. Before any analysis, set aside one genuine essay from the corpus. Do not feed
   it into the profile or the prompt.
2. Note its brief: topic, metaphor, key examples.
3. Generate a new essay from the same brief using the prompt.
4. Put the generated essay beside the held-out real one and compare on the six
   signatures in `house-voice.md` (one metaphor, examples beside claims,
   self-answered questions, short declaratives, explained coinages, visionary
   close).
5. The bar: a colleague who knows the corpus cannot reliably say which is which.
   If they can, note what gave it away and add a do/don't pair for it.

---

## 3. Refresh the profile when the voice drifts

The profile is the durable asset; the prompts are derived from it. When the
house voice shifts or you notice the prompt missing new habits:

1. Collect 3 to 5 recent, canonical essays. Skip drafts and outliers.
2. Rerun Prompt A on them to regenerate the House Style Profile.
3. Diff the new profile against `../post-platforms-style-profile.md`. Carry only
   changed traits into `house-voice.md`.
4. Regenerate any genre prompt whose voice rules changed.

---

## 4. Add a new genre

The single essay genre is one instance of the architecture. To add another
(say a short LinkedIn post, or a whitepaper):

1. Gather 3 to 5 labelled samples of the new genre.
2. Run Prompt A on them. Because the house voice is already known, focus the new
   analysis on what is genre-specific: structure, length, opening and closing
   conventions, any tone shift.
3. Run Prompt B to produce the new genre prompt. Have it prepend the existing
   `house-voice.md` rather than restating voice from scratch.
4. Validate the new genre against its own holdout (step 2 above).

A caution worth heeding: this corpus is a single genre by a single main author,
so the current profile cannot separate the company fingerprint from one author's
habits. A second genre, or a second author, is what makes that separation real.
