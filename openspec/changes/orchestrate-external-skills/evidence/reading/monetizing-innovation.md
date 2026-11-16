# Reading: monetizing-innovation
Fork `meaningfy-ws/wondel-ai-skills` at `c5265583b1a9740f06831e1d3e89b35bba3eb430`, read in full on 2026-11-16 by reader B.

| File | Bytes | What it adds |
|---|---|---|
| `SKILL.md` | 21,035 | Frontmatter, a ten-point score, and six parts from Ramanujam and Tacke: willingness to pay before building, the four monetisation failures, segmenting by willingness to pay, leader, filler and killer packaging, choosing the charging model, and behavioural pricing with launch triggers; each with uses and an ethics line, then mistakes and an eight-row diagnostic. |
| `references/wtp-conversations.md` | 13,415 | How to run willingness-to-pay interviews: ground rules, direct questions, the acceptable, expensive and prohibitive probe, a purchase-likelihood scale, trade-off exercises, a do-it-yourself conjoint, reading the curve, sample sizes, B2B against B2C, and turning the findings into a feature table, spec gates and a living business case. |
| `references/four-failures.md` | 13,170 | Feature shock, underpricing ("minivation"), the unowned hidden gem and the product that should be dead: symptoms, causes, cures and an example each, a decision tree and a quarterly review. |
| `references/packaging-tiers.md` | 11,694 | Classifying features per segment, the rules of three-tier design, tier names, a feature-allocation matrix, upgrade paths, when to bundle or unbundle, and what the pricing page shows. |
| `references/monetization-models.md` | 12,081 | Choosing the price metric by five tests, then subscription, usage, hybrid, freemium, dynamic and outcome-based models with when each wins and fails, how to migrate between models and a selection checklist. |
| `references/case-studies.md` | 14,097 | Three worked cases: a flat price split into three tiers after interviews, a launch cut from seven modules to three, and a freemium fence moved to the habit point; with the shared lessons. |

Total read: 85,492 bytes.

## Goals it serves
Deciding, before something is built, whether buyers value it enough and which parts carry that
value: interviewing economic buyers about worth, spotting a feature nobody will fund, sorting buyers
into a few groups that value different things, packaging what each group values, and picking how to
charge (subscription, usage, outcome). For Meaningfy it fits shaping a product or a packaged service
in the offering work, and reading why an offer stalls (DEC-19 lets it inform the design). It is not
for setting, raising or discounting a price (DEC-7, DEC-19): the offering document and `estimation`
own those. It is software-product pricing at heart; its freemium and pricing-page advice has no
counterpart in Meaningfy's consulting sales.

## Conflicts with Meaningfy rules
| # | Their advice (file, heading, line) | The Meaningfy rule it meets (owner skill) | Named in DEC-7, DEC-19 or DEC-20? |
|---|---|---|---|
| 1 | Set the price from validated willingness to pay, never from cost; cost-based pricing is a listed mistake and scores low (`SKILL.md`, "Core Principle", lines 14-16, "Scoring", line 24, "Common Mistakes", line 189; `references/wtp-conversations.md`, "B2B vs B2C Differences", line 142) | The fixed frame is PERT effort plus contingency, every number traced to a leaf (`estimation` `SKILL.md`, "Workflow", line 50, "Rules", lines 54-70); the offering document sets the price | DEC-7, DEC-19 |
| 2 | Read easy wins and no price pushback as underpricing, then raise the list, add a premium tier above it, and reprice existing clients with notice or grandfathering (`SKILL.md`, "2. The Four Monetization Failures", lines 64-65 and 75, "6. Behavioral Pricing", line 171; `references/four-failures.md`, "Minivation", lines 49-71; `references/monetization-models.md`, "Migrating Between Models", lines 117-126) | An external skill never sets or changes a price; the price is the one the owner approved for the deal (`sales-conversations` `references/selling-method.md`, "Price", lines 63-64) | DEC-19 |
| 3 | Use discounts as tools: 15 to 20 per cent off for annual prepayment, volume and committed-use discounts, a credit or 20 per cent off for switching early (`references/monetization-models.md`, "Subscription", line 50, "Usage-Based", line 65, "Migrating Between Models", line 125; `references/case-studies.md`, "Case Study 1", line 46) | Never discount; concessions are scope, timing or a reference role (`sales-conversations` `references/selling-method.md`, "Principles", line 15, and "Price", line 66) | DEC-7 |
| 4 | Shape the choice with behavioural devices: an anchor works even when arbitrary, a decoy built to be refused, charm or round price endings, the premium tier shown first, and the middle tier designed to take most buyers (`SKILL.md`, "4. Packaging and Bundling", lines 117 and 126, "6. Behavioral Pricing and Price Communication", lines 160-182; `references/packaging-tiers.md`, "Good-Better-Best Design Rules", lines 44-54, "Pricing-Page Implications", lines 117-122) | One recommended option with at most one fallback; reframing must never mislead (`sales-conversations` `references/selling-method.md`, "Principles", line 13, "Where each source is not used", line 54); no unexplained figures (`estimation` `SKILL.md`, "Rules", line 70) | not named |
| 5 | Qualify a sales prospect by the willingness-to-pay segment, told apart by two or three observable markers (`SKILL.md`, "3. Segment by Willingness to Pay", line 101) | The qualification verdict is the five Ps read from MEDDPICC (`sales-qualification` `references/five-ps.md`, "The rubric", lines 10-20) | DEC-7 |
| 6 | Validate stated willingness to pay with pilot agreements and letters of intent at a named price (`references/wtp-conversations.md`, "Interpreting the Answers", line 112, and "B2B vs B2C Differences", line 139) | Any price in a draft is ask first, inside the approved ranges (`sales-qualification` `references/value-equation.md`, "Guarantees and commercial terms", lines 41-42); a price only once the goal is known and the owner approved it (`selling-method.md`, line 64) | DEC-19 |
| 7 | Charge per outcome when it can be measured, and move risk to the vendor to close deals with risk-averse buyers (`SKILL.md`, "5. Choosing the Monetization Model", lines 136 and 143; `references/monetization-models.md`, "Outcome-Based Pricing", lines 102-115, and "Model Selection Checklist", line 135) | Never guarantee an outcome that depends on the client's data, staff or decisions (`sales-qualification` `references/value-equation.md`, lines 42-43); a bounded fixed frame, not an open commitment (`proposal-writing` `SKILL.md`, "Rules", line 66) | DEC-7 |
| 8 | Use a free tier or a free trial to acquire buyers and let them try the leading feature before paying (`SKILL.md`, "5. Choosing the Monetization Model", line 142; `references/monetization-models.md`, "Freemium", lines 77-90; `references/packaging-tiers.md`, "Designing Upgrade Paths", line 91) | Presale is the only free stage; a free pilot or free PoC is a disqualifier and a known defection (`semantic-consulting-coach` `SKILL.md`, "Rules", line 49, and the defection table, line 96; `sales-qualification` `references/five-ps.md`, "Disqualifiers", line 33) | not named |
| 9 | Interview buyers about worth for half an hour or more with several price instruments together (direct worth, the three-point probe, the five-point likelihood scale, trade-offs), 15 to 25 per segment (`references/wtp-conversations.md`, "The Question Toolkit", lines 32-81, and "Sample Sizes and Logistics", line 123; `SKILL.md`, "Quick Diagnostic", line 201) (second reader) | Prospect questions come from the one bank of `sales-qualification`: one or two at a first encounter, the full bank only on a scheduled discovery call (`semantic-consulting-coach` `references/presales-discovery.md`, "The questions", lines 9-11); MEDDPICC is not fired at early prospects (`sales-conversations` `references/selling-method.md`, "Where each source is not used", line 55) | DEC-7 |
| 10 | Pick the unit of charge first (seat, usage, transaction, outcome), then a subscription, usage, hybrid or dynamic model (`SKILL.md`, "5. Choosing the Monetization Model", lines 136-145; `references/monetization-models.md`, "Choosing the Price Metric", lines 22-36, and "Model Selection Checklist", lines 128-139) (second reader) | The Proof of Value has a fixed price and a fixed calendar duration, priced by neither a man-day count nor a rate card (`semantic-consulting-coach` `references/engagement-lifecycle.md`, "Discovery & Onboarding", lines 43-45); a bounded fixed frame, not an open day rate (`proposal-writing` `SKILL.md`, "Rules", line 66) | DEC-7, DEC-19 |
| 11 | Test prices on live buyers: A/B tests of price on real traffic, small percentage price tests, and honouring the lowest price any group was shown (`references/wtp-conversations.md`, "B2B vs B2C Differences", lines 139 and 144; `references/packaging-tiers.md`, "Pricing-Page Implications", line 127) (second reader) | An external skill never sets or changes a price; partners get the approved ranges and a price outside them is ask first (`sales-conversations` `references/selling-method.md`, "Price", line 65) | DEC-19 |

Second reader, 2026-11-16: 3 conflicts added (rows 9 to 11).

Checked and not counted: talking about worth with economic buyers early, as research and never as a
quote (`references/wtp-conversations.md`, "Ground Rules", lines 22-30), does not commit a price; its
ethics lines (no invented "most popular" badge, no hostage downgrades, predictable metrics;
`references/packaging-tiers.md`, lines 117-126 and 92; `SKILL.md`, line 156) agree with the rule
against misleading claims; holding the price on a slow launch rather than cutting it (`SKILL.md`,
line 172) agrees with the no-discount rule; tiered packaging informs offering design, which DEC-19
allows.

## Trigger overlap
`estimation` ("how much should we charge", "pricing", any price figure); `proposal-writing` and the
`proposal-writer` agent (pricing an offer); `semantic-consulting-coach` (the service-portfolio layer,
price frames and what may be free); `sales-qualification` (its description names sales qualification
by segment); `sales-conversations` ("nobody buys at this price", a price objection). Its pricing-page,
freemium and SaaS packaging triggers have no Meaningfy competitor.

## Fallback sentence (draft)
If `monetizing-innovation` is not installed, offer `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/wondel-ai-skills#c5265583b1a9740f06831e1d3e89b35bba3eb430 --skill monetizing-innovation --agent claude-code --global --yes` (the opencode command is in `assets/install.md`); if the person declines, carry on with `estimation` and `semantic-consulting-coach`, and say once that the willingness-to-pay and packaging guidance was not used.
