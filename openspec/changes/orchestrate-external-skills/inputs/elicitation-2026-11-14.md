# Elicitation — orchestrate external skills

**Status:** secondary input, never groomed. Recorded on 2026-11-14. The EPIC
([`../proposal.md`](../proposal.md)) is the primary, shaped truth.

## Seeds

- The study of `wondelai/skills`:
  [`findings-wondelai-skills-2026-11-14.md`](findings-wondelai-skills-2026-11-14.md) and the three
  reports in [`wondelai-study/`](wondelai-study/). The study was written for `lean-skills` and
  speaks of "the EPIC" in that sense; it sorted the source against the book rule sets, a frame the
  owner then corrected (below).
- The owner's words, in two messages.

First, asking for the study:

> i have a second source of skills that are very simialr to the ones we have in this repository
> [...] figure out jst like for the books skills which ones to adopt, to extend, to reuse, rewrite
> [...] we can also make them dependent, and point to those instead of having redunandant text, but
> first we must see how they fit,overla, compete, and keep MEaningfy preferences all the time.
> [...] learn also good practices of making skills, resources and templates if any, and how to word
> and how to split

Then, after the study:

> add counterparts to the ones you recommend instaling as they are, they are useful only if they
> are bundleed and instructed where to use, so we need an anchor/call/pointer to these skills, and
> when to ue and how, , and teh same for every otehr sill in that repo, or in the book repo, we
> kepe the meaningfy framework and point to skills elsewhere to be used for apurpose to acheive
> some goals. like an orchestrator, andten we will probably end up with an orchestrator with
> preferences, workflows and guardrails and checks. , no?
>
> adopt practices, if any significant are available
>
> remminder our target may be 6-7KB, but the boundary is 24kb, right?
>
> - okay with your recommendation,
> - and start shaping a new new sales epic
>
> reframing: the last set of skill was not added to compete tith teh books skills, but to
> complete/extend/strenghten manignfy killery in the same way the books skills do

And, during the questions:

> finally, plan to read lean-skills epic change and see what decisisons and specs we have there and
> how that epic interplays, and possibly competes with this epic, that comparison side by side
> will be done at the end when this epic is more or less shaped

"Okay with your recommendation" refers to three suggestions made for `lean-skills`:
`technical-documentation` as a dependency, the sales skills as a separate EPIC, and the five
practices into the lean standard.

## Round 1

| # | Question | Recommended | Answer |
|---|----------|-------------|--------|
| 1 | Where does the pointer to an external skill live? | In the owning skill | **One central orchestrator** |
| 2 | How does skillery depend on `wondelai/skills`? | A Meaningfy fork | A Meaningfy fork |
| 3 | How wide is the sales EPIC? | Sales and positioning | **Plus marketing and messaging, plus strategy and management** |
| 4 | Appetite? | MEDIUM | **LARGE** |

## Round 2

| # | Question | Recommended | Answer |
|---|----------|-------------|--------|
| 5 | How much does the orchestrator cover when this EPIC is done? | Commercial now, built to grow | **The whole catalogue now** |
| 6 | How does an agent reach it? | From our skills and agents | From our skills and agents |
| 7 | What must the EPIC prove? Offered: routing scenarios; overrides hold; no trigger collisions; install on both CLIs. | All four | The first three. Not the install on both CLIs. |
| 8 | Which risks does it act on? | The first two | The orchestrator growing without limit; the context cost of the added skills. Accepted: external advice outweighing ours; the legal status of book summaries. |

## Risks

| Id | Risk | Likelihood | Impact | Answer |
|----|------|------------|--------|--------|
| RISK-1 | The orchestrator grows with every dependency. | High | Medium: a large skill loaded often | Mitigate: the lean budget and a reference per domain (DEC-11). |
| RISK-2 | Sixteen more descriptions in every call of every agent, in every repository. | High | Medium | Mitigate: installed with the bundle whose role uses them (DEC-13). |
| RISK-3 | A loaded external skill of 15 to 30 KB outweighs a one-line Meaningfy override. | Medium | High where it touches price or commitments | Accepted by the owner. The override scenarios still test the known conflicts. |
| RISK-4 | The skills summarise third-party books; a fork brings that into a Meaningfy organisation. | Low | Unknown | Accepted, as for the book rule sets. |
| RISK-5 | This EPIC and `lean-skills` both route to the book rule sets and both edit skills. The agent's own. | High | Medium: rework | Mitigate: the side-by-side below, decided before the PLAN (DEC-16). |

## The agent's own proposals, for the owner to overrule

- Marketing and management get no new skill; the orchestrator is their home (DEC-10). The LARGE
  option the owner chose was described as allowing new skills.
- The appetite stays LARGE with the whole catalogue in reach only because the orchestrator routes
  and cuts nothing (Appetite).
- `technical-documentation` is adopted here, not in `lean-skills`, because the fork is registered
  here (DEC-6).
- Their composite skills are not installed (DEC-8).

## On the budget

The owner asked whether the target is 6 to 7 KB with a boundary of 24 KB. Yes, by `lean-skills`
DEC-2: 24 KB is the limit for a skill's prose, body and references together; about 6 KB is the
target for the body alone. Templates, assets and scripts are outside it.

## Side by side with `lean-skills`

Read on 2026-11-14 from PR #236 as it stood (proposal with DEC-1 to DEC-9, one spec delta,
`lean-skill-standard`). Not merged.

| Topic | `lean-skills` | This EPIC | Relation |
|---|---|---|---|
| Purpose | Shrink every skill to what is Meaningfy's own; generic knowledge from dependencies | Say for which goal each skill, ours or external, is used, with our overrides | Complementary: one cuts, one points |
| Appetite | VERY LARGE, all 51 skills, five stages | LARGE, one new skill and pointers | |
| External sources | `agent-rules-books`, eight sets, Meaningfy fork (DEC-4, DEC-5) | `wondelai/skills`, sixteen skills, Meaningfy fork (DEC-5, DEC-6) | Same pattern. Seven of their engineering skills cover the same books; this EPIC adopts none of those seven |
| Where routing lives | In `implementer`, `code-reviewer` and `system-architect`, by kind of task; skills "name the dependency" (spec, second requirement) | In one orchestrator skill (DEC-2), reached from skills and agents (DEC-4) | **Competes.** Two places would route to the book sets |
| New skills and agents | None; "No change to what any skill owns" | One new skill | No conflict: a new skill, not a boundary move |
| Skill text cut | Everything generic, by assessment | Only the sales restatement (DEC-9) | **Overlap** on `sales-conversations` and `sales-qualification`: its sales stage would assess the same passages |
| `technical-writing` | Rewritten to the lean shape in its last stage | Gains a route to `technical-documentation` | **Overlap** on one skill |
| Size rules | Sets the budget and its lint (DEC-2) | Obeys it (DEC-11) | Depends on `lean-skills` stage 1, or follows the figure by hand until then |
| Skill-making practices | Defines the lean shape; no rule yet for reference pointers or missing dependencies | Uses two of the five practices (DEC-12) | The five belong in its standard; the owner agreed |
| Description changes | None without a probe | New description, with probes | No conflict |
| Evidence | By reasoning, no evals (DEC-1) | Agent scenarios and trigger probes | Different, not in conflict |
| Rules in `docs/rules/` | Adds P-0002 and P-0003 | None | Its two ids collide with the P-0002 now on `develop` |

**Settled on 2026-11-15.** The owner agreed to all four suggestions below, in the reassessment of
the open EPICs
([`reassessment-2026-11-15.md`](../../archive/2026-11-16-delivery-process-and-tools/inputs/reassessment-2026-11-15.md),
S-3, S-4, S-7). The EPIC was re-shaped for it on purpose: DEC-16 closed, DEC-17 to DEC-21 added.

**What the owner had to settle (DEC-16):**

1. **Who routes to the book rule sets.** Suggested: the orchestrator, since the owner chose one
   central place. `lean-skills` then drops its routing in the three agents, and its spec says a
   skill "names the dependency" by pointing to the orchestrator.
2. **Order.** Suggested: `lean-skills` stage 1 (the standard and its lint, with the five
   practices) first; then this EPIC; then the remaining `lean-skills` stages, which rewrite skills
   that already carry the pointer.
3. **The sales cut.** Suggested: done once, here, and the `lean-skills` sales stage starts from the
   result.
4. **`technical-documentation`.** Suggested: registered here; `lean-skills` rewrites
   `technical-writing` around it.
