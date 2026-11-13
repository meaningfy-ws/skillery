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

## Round 3: while the PLAN was derived (2026-11-14)

| # | Question | Answer |
|---|---|---|
| Q-10 | Posts have no capability spec. Where does their requirement go? | A new capability, `company-voice`. Not chosen (the planner's recommendation): a second requirement in the `test-strategy` delta. |
| Q-11 | `proposal-writer` and `sales-agent` have no `Agent` tool and cannot start a reader. How does the profile work for them? | Grant `Agent` to both. Not chosen (the planner's recommendation): no agent file change, the reader run by the calling session; `Agent` for `sales-agent` only. |
| Q-12 | Where do the rules all four profiles share live (the "leaves the company" test, the confirmation, mandatory or on request, pick-up)? | `guardrails`, with the brief. Not chosen: `test-strategy`'s `generic-writing` file. |
| Q-13 | Should `meaningfy-voice`'s description fire on "write a LinkedIn post" or "a blog article"? | Yes, with a positive probe and a near-miss against `explanatory-writing`. Not chosen: no description change. |

Q-10 and Q-11 change two statements of the shaped EPIC ("New Capabilities: none"; "no agent file
changes"). They are recorded in the EPIC as DEC-8 and DEC-9; the bet itself is unchanged.

The shaper added `sales-conversations` as the owner of sales client messages (it was in the seed);
the owner has not objected.
