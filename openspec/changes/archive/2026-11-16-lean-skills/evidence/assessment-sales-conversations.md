# Assessment: sales-conversations
Before: body 6323 bytes, references 21654 bytes. After: body 5814, references 18750.

Measured with `lean_check.py` (the lint's body rule). Total 27977 → 24564 bytes, under the 24576
budget; the skill leaves `pending` with no `over_budget` entry. No file added, moved or deleted;
`assets/templates/meeting-plan.md` (material) unchanged. Line numbers are those before the rewrite.
Generic sales technique a capable model knows is drop; Meaningfy's own selling rules are keep.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title and bias, l. 14-17 | keep | body intro | |
| 2 | Called by `sales-operations`, l. 18-19 | owner | `sales-operations` (its routing) | the calls this skill makes stay |
| 3 | Calls accounts, qualification (dossier missing or stale), custody, l. 19-21 | keep | body intro | |
| 4 | Quick Start, l. 23-36 | keep | body Quick Start | insights link folded to text; the pointer is in Workflow |
| 5 | Workflow Before, steps 1-2, 4, l. 42-43, 58 | keep | body Workflow | |
| 6 | Workflow Before, step 3 field list, l. 44-55 | drop | template `assets/templates/meeting-plan.md` holds every field | repetition of the template; commitment and question order stay |
| 7 | Hold the offer in Discovery, l. 57 | keep | body Workflow step 3 | |
| 8 | During: tools, l. 60-62 | keep | body Workflow, pointer sentence | |
| 9 | After: notes, follow-up, next step, objections, l. 64-69 | keep | body Workflow After | links → pointer sentences |
| 10 | Replies and revivals, whose turn, l. 71-75 | keep | body Rules, "Whose turn first" | merged with Gotchas line 100-101 |
| 11 | Write rules, l. 77-81 | keep | body Rules | |
| 12 | The method, l. 83-85 | keep | body intro, pointer sentence to `selling-method.md` | |
| 13 | Acceptance criteria table, l. 87-95 | keep | body Before you hand over: acceptance criteria | unchanged; cited by CHK-94 |
| 14 | Gotchas: drafts only, hold the offer, l. 99, 103 | drop | | repeat rows 7 and 11 |
| 15 | Gotchas: cc, no technique in tender, l. 102, 104 | keep | body Rules | |
| 16 | Boundary & Related Skills, l. 106-120 | keep | body Boundary | the tools list in Owns shortened (rapport section dropped) |

## references/selling-method.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 17 | Intro, links to the other references | keep | intro, shortened | |
| 18 | Sources list (books) | drop | | the names stay where each source is used |
| 19 | Principles 1, 3-9, 12 | keep | unchanged in substance | Sutherland, Hormozi, Robbins applied to Meaningfy |
| 20 | Principle 2 "ask more than you tell" | drop | | generic; the "never sound desperate" line stays |
| 21 | Principle 10 "teaching earns the right to ask" | drop | | repeats insights rule "Teach, then ask" |
| 22 | Principle 11 Voss definitions | drop | pointer to conversation-tools | repeats conversation-tools Listening |
| 23 | Principle 13 "follow-up the same day" | drop | | repeats body Workflow After step 2 |
| 24 | Taleb, how clients decide: blow-up fear, irreversible bet, skin in the game | keep | one paragraph | the cover list repeats principles 3 and 5 and is cited |
| 25 | Taleb, our own judgement | keep | unchanged; dossier's evidence against winning cites `sales-qualification` (owner) | |
| 26 | Personal touches intro "people are people" | drop | | a "why" |
| 27 | Personal touches, four rules | keep | unchanged | `sales-accounts` personal-details points here |
| 28 | Channel matrix | keep | unchanged | |
| 29 | Where not used: Hormozi in tenders, partner frame; Voss in tender clarifications; Challenger in tenders | drop | channel matrix (B2G and partner rows) and conversation-tools ("not in tenders") | repetition; a lead-in sentence says the matrix rules them out |
| 30 | Where not used: Voss price ladder, Robbins, Sutherland, MEDDPICC, five Ps, power frameworks, discovery flow | keep | unchanged | |
| 31 | Where not used: Voss accusation audit, Challenger unsourced numbers | drop | conversation-tools Listening; insights Rules "Source the numbers" | repetition, cited |
| 32 | Price | keep | unchanged | |
| 33 | Cadence | keep | unchanged | |

## references/conversation-tools.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 34 | Intro | keep | unchanged | |
| 35 | Discovery flow, six steps, three pillars, not closing in the room | keep | one line, same steps | Meaningfy adaptation |
| 36 | Commercial teaching, step choreography (warmer, reframe, …) | drop | step names kept as one parenthesis | generic Challenger |
| 37 | Commercial teaching: own or sourced numbers, anonymised unless consent, not named before the end, small first step, not in tenders or partner-led | keep | bullets | |
| 38 | Rapport (Robbins) | drop | selling-method principle 12 and "Where not used, Robbins" | repetition |
| 39 | Listening: mirror, label, no-oriented, "that's right", calibrated question examples | drop | named in one line | generic Voss |
| 40 | Listening: accusation audit with evidence, graceful no, focus question, people behind the table | keep | bullets | |
| 41 | Belief-breaking | keep | unchanged | doubt goes to keep |
| 42 | Price pointer | drop | | selling-method holds price |

## references/email-patterns.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 43 | Intro; tone examples ("fake deadlines…") | owner | `meaningfy-voice` `outreach-email` | the cite stays, the examples go |
| 44 | Copy rule (cc), three bullets | keep | one sentence, same rule | |
| 45 | Second sender's address, decision card | keep | unchanged | |
| 46 | Proposing a meeting | keep | unchanged; "so the other side can pick…" dropped (a why) | |
| 47 | Whose turn | keep | unchanged | |
| 48 | Patterns table | keep | unchanged | |
| 49 | Never list | drop | one line citing selling-method and the body Rules | repetition of price, commitments, channel matrix |

## references/insights.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 50 | Intro, definition of a commercial insight | keep | shortened | generic definition dropped |
| 51 | "never as a statistic we cannot source" | drop | Rules "Source the numbers" | repetition |
| 52 | Duplicate heading "Commercial insights" | drop | | |
| 53 | Six insights table | keep | unchanged | |
| 54 | Rules | keep | unchanged | |

## references/objections.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 55 | Intro, ownership of the taxonomy | keep | shortened | |
| 56 | Five types, library | keep | unchanged | |

Second reader: general-purpose subagent (fresh), 2026-11-15. Verdict: nothing lost
Other fixes: none. Checked: the warmer's "two or three challenges of their role" is generic Challenger, and its Meaningfy part (tailor to role, profile and dossier) stands in `insights.md`; the cut "where not used" lines (Hormozi and Challenger in tenders, Voss in written clarifications, partner frame) stand in the channel matrix's B2G and partner rows, `conversation-tools.md` ("not in tenders") and the body Rules.
