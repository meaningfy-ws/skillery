# Assessment: semantic-consulting-coach
Before: body 18232 bytes, references 38152 bytes. After: body 7836, references 24185.

Total prose 56384 → 32021 bytes, still over the 24576 budget: the remaining text is Meaningfy's
commercial engagement model (company fact, cited by anchor from about twenty docs, six sales skills
and four specs) plus its coaching frame, domain map and question bank, all sorted keep. The builder
recommends an `over_budget` entry (lead decides). `decision-phase-posture.md` is merged into
`engagement-model.md` and deleted. Line numbers are those of the files before the rewrite.

## SKILL.md body

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Title, § Overview l. 17-28 (senior partner, coach first, protect interests) | keep | body intro | the bias sentence |
| 2 | § Overview l. 30-38 (meta-business skill, design own engagement process; method draft vs facts decided) | keep | body intro; Rules pointer sentences to `engagement-lifecycle.md` and `engagement-model.md` | |
| 3 | § Overview l. 40-41 (personalised for Meaningfy) | keep | body intro | |
| 4 | § Overview l. 43-47 (domain list, pointer to domain map) | keep | Rules, pointer to `semantic-consulting-domain.md` | domain list itself is in the description |
| 5 | § The core insight l. 49-62 (decision-readiness, presale only free, leak) | keep | Rules "Sell decision-readiness"; thesis quote kept once in `engagement-model.md` | repetition of the quote dropped |
| 6 | § When to use l. 64-73 | drop | | repeats the description; negotiation and communication bullets → Triggers |
| 7 | § When NOT to use l. 75-80 | keep | Triggers first bullet | |
| 8 | § The three layers table l. 82-91 | keep | Rules, table with shortened focus column | "state the layer" → Workflow step 2 |
| 9 | § Working modes, "Modes are not Phases" l. 95-102 | keep | Rules "Modes are not stages"; `engagement-model.md` intro | |
| 10 | Mermaid mode diagram l. 104-113 | drop | | restates the transition rules as a picture |
| 11 | § Exploration / Alignment / Synthesis l. 115-133 | keep | Rules mode bullets; Workflow step 4 (Synthesis via `executive-communication`, B2G compliance) | Minto/SCQA restatement → owner `executive-communication` |
| 12 | § Mode transitions l. 135-146 | keep | Rules mode bullets; Workflow step 5 | |
| 13 | § Operating principles l. 148-162 | keep | Workflow step 2 (name the layer); Rules "No assumptions", "Method over tools" | |
| 14 | § The defection table l. 164-178 | keep | Rules, Common mistakes table (Mistake / Why it fails / Do instead), all seven rows | name "defection table" kept (cited by `writing-antipatterns`) |
| 15 | l. 180-181 meta-cognitive prompts pointer | keep | Workflow step 3 pointer to `question-bank.md` | |
| 16 | § Worked examples, intro l. 183-187 | drop | | |
| 17 | Worked example 1, refusing to synthesise, l. 189-202 | example | cut; the rule is defection rows 2 and 3 | |
| 18 | Worked example 2, business layer, resale, l. 204-211 | example | cut; the probe survives in `question-bank.md` (research/product/resale) | |
| 19 | Worked example 3, B2G free PoC, l. 213-228 | keep | Quick Start (shortened) | real worked example for the DoD |
| 20 | § Reference material l. 230-237 | drop | pointer sentences at the point of need | closing list (D-5 b) |
| 21 | § Tone & style l. 239-248 | keep | Rules "Voice" | |
| 22 | § Start instruction l. 250-255 | keep | Workflow step 1 | |
| 23 | § Boundary & Related Skills l. 257-269 | keep | Boundary | the file name in "Does not own" became words (pointer form); Related list unchanged |

## references/engagement-lifecycle.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 24 | Intro l. 3-7 | keep | shortened | |
| 25 | § The free→paid boundary l. 9-13 | keep | unchanged | |
| 26 | § Presale l. 17-28 | keep | heading unchanged (anchor cited); repeated boundary sentence shortened | |
| 27 | § Discovery & Onboarding table, "formerly" note, gap analysis, maturity-assessment distinction l. 32-51 | keep | unchanged in substance | "4–6 weeks, calendar-boxed" and "1–2 day workshop" kept (`tests/ownership.yaml`); "formerly" note kept verbatim (spec `sales-method-ownership`) |
| 28 | Duration note l. 53-55 | keep | merged with "fixed price and fixed duration" (was only in `engagement-model.md`, spec `engagement-model` Req 5) | |
| 29 | Safeguards l. 57-61 | keep | unchanged | cited as "safeguard options" by sales skills |
| 30 | Skills behind Discovery & Onboarding l. 63-75 | keep | one paragraph | |
| 31 | Boundary l. 77-78 | keep | unchanged | |
| 32 | § Direct-to-build l. 80-96 | keep | shortened; broken relative path `../ai-coding/build-lifecycle.md` written as the repo path | |
| 33 | § The outcome: Semantic Layer adoption l. 100-126 | keep | heading unchanged (anchor cited); bare `semantic-layer-services.md` written as its repo path | |
| 34 | § Repeat clients, hand-off, "Your done" l. 130-154 | keep | headings `Repeat clients` kept (anchor cited); "Your done" folded into the hand-off paragraph | |
| 35 | § Known gaps l. 158-177 | keep | one paragraph: not decided, must not be invented, the six areas, the single place to check | the numbered sub-list is in that proposal, not duplicated |

## references/engagement-model.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 36 | Intro, meta-business, draft vs facts l. 3-15 | keep | shortened | |
| 37 | Modes ≠ Stages l. 17-20 | keep | body Rules (one copy) | |
| 38 | § What you are really selling l. 22-34 | keep | "What is being sold" | Governing Thought distinction kept |
| 39 | § The free → paid boundary l. 36-46 | owner | cut; `engagement-lifecycle.md` | restated a commercial fact (spec Req 5) |
| 40 | § Three cognitive states table, state-2 signals l. 48-63 | keep | unchanged in substance | |
| 41 | § The engagement stages table l. 65-87 | keep | prose: do not collapse, intent outward, not a ladder, workshop not a substitute | table of pointers to the lifecycle dropped (repetition) |
| 42 | § The Proof of Value intent, is / is not, when it fits l. 89-107 | keep | unchanged in substance | |
| 43 | Decision Package output l. 109-114 | owner | `decision-package`; lifecycle | |
| 44 | Duration and shape, boundary safeguard l. 116-126 | owner | `engagement-lifecycle.md` (cited) | commercial facts (spec Req 5) |
| 45 | Design questions, working names l. 128-140 | keep | compacted | |
| 46 | § Related reference l. 142-147 | drop | | the posture is merged into this file |

## references/decision-phase-posture.md (deleted, merged into engagement-model.md)

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 47 | Intro, purpose l. 3-10 | keep | `engagement-model.md` § Holding the boundary, intro | |
| 48 | Load-bearing principles l. 12-39 | keep | same section, all ten principles; two of five sample formulations dropped | wording samples, the principle stays |
| 49 | Internal red flags l. 41-46 | keep | same section | |
| 50 | Where the boundary shows up l. 48-54 | drop | | repeats state-2 and the lifecycle rule |

## references/presales-discovery.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 51 | Intro, boundary quote l. 3-8 | keep | shortened | |
| 52 | § The questions l. 10-16 | keep | unchanged (cites `sales-qualification`, spec `sales-method-ownership`) | |
| 53 | § Internal decision table l. 18-24 | keep | unchanged | |
| 54 | § Boundary reminder l. 26-30 | keep | one sentence | |

## references/question-bank.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 55 | Intro l. 3-9 | keep | shortened | |
| 56 | § By mode: Exploration, Alignment l. 13-22 | drop | one opening question per mode kept in the intro | generic coaching questions a model asks unprompted |
| 57 | § By mode: Synthesis l. 24-27 | owner | `executive-communication` (diagnose: who decides, one sentence) | |
| 58 | § By layer l. 29-47 | keep | bullets, unchanged questions | |
| 59 | § By semantic-service area l. 49-82 | keep | bullets, unchanged questions | |
| 60 | § Negotiation meta-questions l. 84-97 | drop, keep | kept: interests before tactics, walk-away fixed before the room, who can walk away, concession precedent, deal vs relationship vs precedent; dropped: BATNA/ZOPA/anchoring/claim-vs-create definitions | generic negotiation (R2 will point to `negotiation`) |
| 61 | § Communication meta-questions l. 99-109 | owner, keep | drafting → `executive-communication`; first objection and channel/timing kept | |
| 62 | § Meta-cognitive prompts l. 111-115 | keep | three kept; "deal, relationship or precedent" moved to negotiation | |

## references/semantic-consulting-domain.md

| # | Passage | Class | Where it went | Note |
|---|---|---|---|---|
| 63 | Intro l. 3-6 | keep | shortened | hypothesis rule kept |
| 64 | § 0 Positioning & vocabulary l. 8-34 | keep | unchanged in substance | |
| 65 | § 1 Service families table l. 36-61 | keep | table kept, "Includes" cells tightened; "maturity assessment" kept (cited by `data-maturity-assessment.md`) | |
| 66 | Public service names, standards l. 63-67 | keep | one sentence | |
| 67 | Two engagement models l. 69-77 | keep | shortened | |
| 68 | § 2 Revenue models table l. 79-95 | drop, keep | kept: the mix is the question and the five watch-outs; dropped: leverage and margin columns | generic consulting economics |
| 69 | § 3 B2B vs B2G table and anchors l. 97-115 | drop, keep | kept: B2G traits that change coaching, anchors, the two levers; dropped: cycle length and drivers rows | generic market knowledge |
| 70 | § 4 Where IP and scope risk concentrate l. 117-131 | keep | prose, both lists kept | |

Second reader: general-purpose subagent (fresh), 2026-11-16. Verdict: lost: the posture line "silence is an acceptable outcome" (row 48, End cleanly); restored in the second reading in `engagement-model.md`.
Other fixes: `proposal-writing/references/scope-boundary-checklist.md` now cites the safeguards of the engagement lifecycle (the model no longer states them); blank line before `## Triggers`; the `proposal-writing/SKILL.md` citation of `engagement-lifecycle.md`'s safeguards checked true. Cut generic questions, BATNA/ZOPA, the revenue-table columns and worked examples 1-2 checked: generic or kept elsewhere (defection rows, question bank).
