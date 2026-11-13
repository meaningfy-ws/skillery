# Q&A record: generic task test profiles (EPIC D)

**Secondary input, never groomed.** The owner's answers of 2026-11-13.

| # | Question | Answer |
|---|---|---|
| Q-1 | Which kinds of work get a profile first? | All four: offers and proposals; contracts; posts and public writing; client and internal messages. |
| Q-2 | What form does a profile take? | Criteria plus an adversarial reader: success and failure stated before drafting, then one reader with a role tries to break the draft and reports against the criteria; plus the existing rule checks. Not a scored rubric. |
| Q-3 | When is the adversarial reader mandatory? | For anything that leaves the company (offers, contracts, public posts, client messages); internal messages only on request. |
| Q-4 | Who confirms the criteria before drafting something that leaves the company? | The owner, in one line: the agent proposes, the owner says yes or corrects. Unattended runs use the criteria recorded for that kind of task. |
| Q-5 | What must D prove? | A baseline with and without the profile for each kind; the reader finds a planted flaw; the profiles live with their owning skills. Not chosen: a Gherkin scenario for unattended runs. |
| Q-6 | Risks (shared with C): which do we mitigate? | Mitigate: checks slow daily work; external styles and tools change; the adversarial reader is theatre. **Accepted:** client-confidential text passes through reader subagents. |

## Round 2: after the readiness check

| # | Question | Answer |
|---|---|---|
| Q-7 | What happens on the sales agent's unattended runs? | The profile applies at pick-up: unattended runs are unchanged, and their drafts get criteria and a reader when the owner picks them up to send. |
| Q-8 | Gherkin for the agents whose behaviour changes? | A scenario per agent (`proposal-writer`, `lawyer`, `sales-agent`). |
| Q-9 | Where does the adversarial reader's brief live? | `guardrails`. |

The shaper added `sales-conversations` as the owner of sales client messages (it was in the seed);
the owner has not objected.
