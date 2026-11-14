# Elicitation record — lean-skills (2026-11-14)

Secondary. The EPIC ([`../proposal.md`](../proposal.md)) is the shaped truth; this is what was
asked and answered. Owner's words are quoted.

## Choice of approach

The agent offered three ways: (1) measure first, then cut; (2) cut by rule, restore on failure;
(3) pilot on `cosmic-python`, then roll out. The owner answered each and chose all three, changed:

> 1. assume/speculate dont measure, follow intuition, think as a chain of thought to detect what is
> best

> 2. okay fine, we could even have the skill in sizes, or at least get inspired from the sizes of
> the skills in the books new repo. didnt you say that the templates and assets never cost context
> and reference prose only when applied? these could also be mechanism to make them efficient

> 3. yes and i would still run an assessment to keep what is meaningfy specific, and what we
> distilled as preferences and adjustments. Indeed I think a 24kb budget per skill is a good idea,
> but even as little as necessary by default, and identify what could be templates and reference
> prose.

> lets do 1, 2 and 3.

## Side question: Stream Coding

> i am not sure about stream coding, is it actually used? or redundant?

The agent's reasoning: redundant (its three jobs are done by `epic-planning`, `clarity-gate`,
`epic-delivery` and `superpowers` TDD; its one live idea, the Rule of Divergence, is already in
`epic-planning`; it is a 30 KB file installed by hand that two agents still load). Recommendation:
retire. **The owner chose "Keep as is".**

## Round 1

| Question | Recommended | Owner's answer |
|---|---|---|
| How far should this one EPIC go? | Standard plus pilot | **Whole catalogue** |
| Which book rule sets to rely on? | Core four | All four options, and: "take all of them, no? or not all are useful?" |
| Stream Coding? | Retire it | **Keep as is** |
| The 79 KB of example code in `cosmic-python`? | Keep house conventions only | **Move to docs for people** (then changed in round 2) |

On "take all of them": the agent answered that six sets overlap the chosen eight by the source
repository's own compatibility matrix, cost description context in every session and can fire
beside `cosmic-python`; eight are taken. The owner did not object.

## Round 2 (risks, and what must be proven)

| Question | Recommended | Owner's answer |
|---|---|---|
| Upstream is v0.6 with one maintainer. How to depend on it? | Pin a commit | "you are right: i created our own fork https://github.com/meaningfy-ws/agent-rules-books" |
| A cut removes something agents relied on. How to contain it? | One release per stage | **Accept it** |
| What must be true to call the EPIC done? | Lint budget, second reader, tests green | All three, plus **a size target for the whole** |
| Example copies go stale in docs. | Move, mark the source | **Link instead of copy** |

The fork exists and stood at upstream commit `893a88a` when checked. `meaningfy-ws/mapping-suite-sdk`
is public, so links to it work for any reader.

## The agent's own calls, not the owner's

- The 24 KB budget covers body plus references; the body target is 6 KB; templates and scripts are
  outside it.
- The size target for the whole: the agent proposed 0.7 MB; the owner set it: "total size could go
  to 1MB instead of 0.7MB". "Don't measure, follow intuition" holds for this EPIC only, not as a
  standing rule ("only in this session, not a rule").
- Whole catalogue sized VERY LARGE in stages, not HUGE.
- The change was renamed from `book-rule-sets` to `lean-skills` when the scope widened.
