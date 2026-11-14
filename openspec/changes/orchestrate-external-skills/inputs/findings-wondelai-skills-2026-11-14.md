# Findings — a second source of skills: `wondelai/skills`

**Status:** secondary input, never groomed. Made on 2026-11-14 at the owner's request, for the
`lean-skills` EPIC ("the EPIC" below, with its DEC-4 and DEC-5); moved here when the owner asked
for an EPIC of its own. The owner then corrected its frame: the source completes skillery, it does
not compete with the book rule sets. Three readers studied a shallow clone of
<https://github.com/wondelai/skills> (commit `c526558`, 13 November 2026, MIT licence, 65 skills).
Their full reports are in [`wondelai-study/`](wondelai-study/): engineering, business and craft.
This file is the summary and what it means for the EPIC.

## What the owner asked

Study the repository like the book rule sets: which skills to adopt, extend, reuse or rewrite;
whether skillery can depend on them instead of keeping redundant text; how they fit, overlap and
compete, with Meaningfy's preferences kept throughout. Also learn their practices for making
skills: resources, templates, wording, splitting.

## How far the reading went

No reader read everything. The verdicts below are a first sort, good enough to decide where to
look closer, not to cut text.

- Of 17 engineering skills, three were read in full; the rest by frontmatter, headings and key
  sections. Of 50 other skills, about 15 were read beyond headings. Reference files were listed
  and searched, not read.
- `agent-rules-books` was not cloned. "Keep the book set" rests on what this folder's inputs say
  about those sets.
- No install command was run, no trigger was tested, and opencode is not mentioned in their README.
- On our side, the bodies of `architecture`, `test-strategy`, `bdd-gherkin`, `ci-cd-delivery`,
  `conceptual-modelling`, `modelling-conventions` and `epic-planning` were not compared.

## Result in four sentences

The repository is not a second dependency on the scale of the book rule sets. One skill is worth
depending on (`technical-documentation`), two more are candidates in sales, and eight have no
counterpart here and could be installed as they are. Their skills are two to five times the size
of ours, so their size is no model. Their structure has five practices worth taking into the lean
standard.

## Verdicts

| Group | Skills | Depend | Install as new | Borrow an idea | Keep the book set | Ignore |
|---|---|---|---|---|---|---|
| Engineering | 17 | 1 | 0 | 2 | 7 | 7 |
| Business, sales, product, design | 48 | 2 | 8 | 6 | n/a | 34 |

The second row's verdicts add to 50, two more than the 48 skills in that group. The reader's
count is not reconciled; treat the "ignore" figure as approximate.

- **Depend:** `technical-documentation` (our `technical-writing` has no voice, procedure,
  API-reference or release-note rules); `negotiation` and `hundred-million-offers` (our sales text
  is already a short adaptation of the same two authors, so the saving is about 3 to 4 KB).
- **Install as new, no counterpart here:** `mom-test`, `obviously-awesome`, `jobs-to-be-done`,
  `good-strategy-bad-strategy`, `storybrand-messaging`, `one-page-marketing`,
  `influence-psychology`, `high-output-management`.
- **Keep the book set of DEC-5** over their `clean-architecture`, `ddia-systems`,
  `domain-driven-design`, `refactoring-patterns`, `release-it`, `software-design-philosophy` and
  `working-with-legacy-code`: the same books at 4 to 20 times the size.
- **Borrow:** pin behaviour first, and never change structure and behaviour in one commit
  (`improve-code-quality`); decide only the choices that are expensive to reverse
  (`design-code-architecture`).

## Where they compete with a Meaningfy preference

Each is quoted from both sides in the reports.

- **Writing:** American spelling against British; em dashes; contractions in binding text. Their
  skill says a project's own style guide comes first, so three stated overrides are enough.
- **Code:** functions of 4 to 6 or 20 lines against our 25; the Rule of Three against
  PR-REUSE-COMPACT and PR-SURVEY-FIRST; a guard at every function entry against
  BP-VALIDATE-AT-BOUNDARY; a test per public method against "test the decisions".
- **Sales:** stepped concessions and a fast-action discount against "never discount"; value-based
  pricing against the effort-based fixed frame of `estimation`; another qualification scheme and a
  fixed cold-email cadence against ours; stacked guarantees against "only after the owner's yes".
- **Method:** their fourteen composite skills (create, grow, improve) keep their own tracker files
  under `docs/` and ask at every decision point, against the spine and the single question round.
  Their descriptions name ten skills each and would fire on our coaching and business prompts.

## A defect found in our own text

`cosmic-python` gives one extraction threshold in its body ("2-3 similar lines OK, 5+ extract")
and a stricter one in its catalogue. To fix in the pilot stage, whatever is decided here.

## Practices for the lean standard

| # | Practice | Why it matters here |
|---|---|---|
| 1 | Every link to a reference says when to open it and what it adds, at the point of need, and no list of references closes the body. Checkable by lint. | It is the guard against "moving text is not shrinking" (Rabbit-holes). |
| 2 | Two table forms: Common Mistakes (mistake, why, fix) and Quick Diagnostic (question, if no, action). | A ready form for the decision rules and the final checklist of the lean shape. |
| 3 | Content filters: non-obvious points only; cut a "why it works" that restates the rule; omit what the model already does. | Wording for the sorting step of the assessment. |
| 4 | Rules shared by several workflows are stated once and cited. They copy theirs into 14 files; that copy is the anti-example. | Our own single-owner rule, with evidence of the cost of breaking it. |
| 5 | A named external dependency carries a fallback sentence: offer the install command, and say which mode you are in if it is declined. | A missing book rule set (DEC-4) is not handled today. |

Not to take: their sizes (bodies of 12 to 30 KB, no cap enforced), committed plugin copies, a
version bumped by hand per skill, scoring sections on most skills, affiliate links in bodies.

## How a dependency on it would work

- A single skill installs with `npx skills add wondelai/skills/<skill> --global`. Their Claude Code
  marketplace installs collections only, and the collections bring `clean-code`,
  `pragmatic-programmer` and `system-design`, which DEC-5 leaves out. So: per skill, never a
  collection, never a composite. From their documents only; not run, and not checked on opencode.
- Their composites depend on other skills by naming them in prose, with an inline fallback when
  one is missing. No frontmatter or manifest field exists for it.
- MIT allows copying with the notice kept. The skills summarise third-party books, like the book
  rule sets, so the same legal question applies and the same no-copy rule should hold.

## What this suggests for the EPIC, for the owner to decide

1. **DEC-4 and DEC-5 stand.** No book set is replaced.
2. **One new dependency at most in this EPIC:** `technical-documentation`, routed from
   `technical-writing` with the three overrides. It needs a trigger probe, because their
   description claims every documentation task.
3. **The sales pair and the eight new skills are a separate choice**, not part of slimming: they
   add capability and bring four conflicts with the sales rules. Suggested: its own small EPIC, or
   declined.
4. **The five practices go into the lean standard** of stage 1.
5. **Before any of 2 or 3 is fixed:** read the chosen skills and their references in full, clone
   `agent-rules-books` for a true side-by-side, and try the install on both CLIs.
