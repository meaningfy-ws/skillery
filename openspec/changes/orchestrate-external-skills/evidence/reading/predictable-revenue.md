# Reading: predictable-revenue
Fork `meaningfy-ws/wondel-ai-skills` at `c5265583b1a9740f06831e1d3e89b35bba3eb430`, read in full on 2026-11-16 by reader C.

| File | Bytes | What it adds |
|---|---|---|
| `SKILL.md` | 12,390 | Frontmatter, a 10-point score, three lead types (referrals, inbound, outbound), separate roles for prospecting, closing and retention, the five steps of referral-first cold mail, ANUM qualification, pipeline arithmetic, hiring, ramp, pay and metrics. |
| `references/case-studies.md` | 14,733 | Six implementations (two well-known software firms, three anonymised firms, one consultancy), each with starting state, system, results and timeline, plus shared patterns and failure modes. |
| `references/cold-calling-2.md` | 12,539 | The referral mail and its rules, subject lines, a five-touch sequence over thirty days, personalisation tiers, A/B testing, reply handling, sending tools, deliverability and benchmarks. |
| `references/lead-types.md` | 11,290 | Each lead type in depth (referral programmes, inbound channels, outbound plays), a budget split by company stage and deal size, comparative benchmarks and a quarterly planning sheet. |
| `references/metrics.md` | 13,827 | Activity, pipeline, revenue and efficiency metrics with benchmarks, reducing no-shows, review cadence from daily to quarterly, quota setting and a dashboard layout. |
| `references/pipeline-math.md` | 10,734 | Working back from a revenue target to mails and headcount, capacity tables, conversion benchmarks by industry and deal size, pipeline velocity, three scenarios and how the model is tuned over a year. |
| `references/qualification.md` | 15,782 | ANUM in depth (authority, need, urgency, money) with question banks, a points matrix and A to C grades, a call script, disqualification scripts and a comparison with BANT and MEDDIC. |
| `references/roles.md` | 12,938 | Charters, daily schedules and metrics for the prospecting, inbound, closing and customer-success roles, career paths, hiring profiles, interview questions, US pay ranges and team ratios. |
| `references/team-building.md` | 13,138 | Hiring traits and sources, a four-week onboarding, training modules and role-plays, ramp warnings, variable pay design, one-to-ones, motivation and when to scale or add a manager. |

Total read: 117,371 bytes.

## Goals it serves
Building a repeatable outbound sales function: deciding the mix of referral, inbound and outbound
leads, splitting prospecting from closing, writing a short mail that asks a senior person who the
right contact is, sizing a team from a revenue target and running the dashboards and quotas around
it. For Meaningfy the usable parts are narrow: the referral-first mail as an idea for reaching the
right person at a large client, the lead-type mix as a lens on how dependent the pipeline is on
partner referrals (its consultancy case), the habit of planning from conversion rates, and the
buying-committee map in its qualification guide. It assumes a software company with salaried
prospecting staff and sending at volume; a small consultancy where the owner sells, with drafts that
are never sent by an agent, cannot adopt the machine as written. Not for qualifying a Meaningfy deal
(`sales-qualification`), not for outreach or its cadence (`sales-conversations`), not for pipeline
stages and grooming (`sales-pipeline-custody`).

## Conflicts with Meaningfy rules
| # | Their advice (file, heading, line) | The Meaningfy rule it meets (owner skill) | Named in DEC-7, DEC-19 or DEC-20? |
|---|---|---|---|
| 1 | Qualify with ANUM, score each letter up to three points, grade A to C and pass or nurture by grade; move to MEDDIC only once a closer takes over (`SKILL.md`, "Step 4: Qualify with ANUM", lines 91-100; `references/qualification.md`, "Scoring Matrix" and "Total Score Interpretation", lines 237-253, and "ANUM vs. BANT vs. MEDDIC", lines 279-294) | The verdict is the five Ps read from MEDDPICC, every element sourced or OPEN (`sales-qualification`, `references/five-ps.md` and `references/meddpicc.md`) | DEC-7 |
| 2 | Outbound by volume: personalised mass mail, 50 to 100 new mails a day per person, about 20,000 mails for a revenue goal, the lowest tier carrying only the company name (`SKILL.md`, "Core Principle", line 16, and "Pipeline Math", lines 121-125; `references/cold-calling-2.md`, "Personalization at Scale", lines 169-177) | Every message proves the homework in one specific, sourced line; first outreach is one sourced observation, one insight and one question (`sales-conversations`, `references/selling-method.md`, principle 1, and `references/email-patterns.md`, "Patterns") | DEC-7 |
| 3 | A five-touch sequence on days 1, 3, 7, 14 and 30, the day-3 touch only a reminder, the day-14 "close your file" mail used for its scarcity effect, and always the full sequence (`SKILL.md`, "Step 3: Follow Up", lines 79-89; `references/cold-calling-2.md`, "Day-by-Day Sequence", lines 87-154, and "Common Email Mistakes and Fixes", line 293; `references/lead-types.md`, "Common Spear Mistakes", line 121) | At most three touches without a reply and one message per contact per seven days (`sales-conversations`, `references/selling-method.md`, "Cadence"); every message adds something, no fake scarcity (`meaningfy-voice`, `references/channels/outreach-email.md`) | DEC-7 |
| 4 | Send through sequencing tools that automate the touches, from a separate sending domain, with mailboxes rotated across staff (`references/cold-calling-2.md`, "Tools and Technology", line 244, and "Deliverability Checklist", lines 253-259; `references/case-studies.md`, "Case Study 4", line 178) | Drafts only: sending or scheduling a send is *never*; the other sender is in cc on every external draft (`sales-conversations`, "Rules") | not named |
| 5 | Build contact lists and find mail addresses and phone numbers with LinkedIn Sales Navigator and contact-data vendors, and count LinkedIn touches (`SKILL.md`, "Step 1: Build Target Account List", line 73; `references/cold-calling-2.md`, "Tools and Technology", lines 245-247; `references/metrics.md`, "Activity Metrics Dashboard", line 31) | No LinkedIn scraping; list what the owner should check there (`sales-qualification`, "Workflow", step 3); never research what a person did not share or publish (`sales-accounts`, outside the list) | not named |
| 6 | The prospecting caller states a price range in the qualification call and in the disqualification script (`references/qualification.md`, "Money: Budget Qualification", line 144; "Qualification Call Script Template", line 190; "Graceful Disqualification Scripts", line 277) | Direct clients get one precise price the owner approved, once the goal is known; ranges only for partners and frameworks, from the offer catalogue (`sales-conversations`, `references/selling-method.md`, "Price"; `estimation`) | DEC-19 (its general sentence: an offering sets the price; this skill is not one of the three it names) |
| 7 | Treat the tuned model as a forecast of next quarter's revenue to within a tenth or two, stated with confidence (`references/pipeline-math.md`, "Month 7-12: Refined Model", line 255, and the closing paragraph, line 264) | Probabilities and expected revenue are ranges with their basis, never one confident number (`sales-conversations`, `references/selling-method.md`, "Decisions under uncertainty") | not named |

Checked and not counted: its own three-scenario section (`references/pipeline-math.md`, "Scenario
Planning", lines 148-150) agrees with ranges, so only the confidence claim is counted (row 7);
honouring opt-outs at once and following spam law (`SKILL.md`, line 106) agrees with ours; mapping
the buying committee, arming the champion and keeping two or three contacts
(`references/qualification.md`, "Navigating Buying Committees") agree with MEDDPICC and the
two-contacts cover in `sales-conversations`; asking a senior person for the right contact is not
against any rule, though in a partner-led deal the channel matrix still applies. Hiring, pay and
quotas for sales staff (`references/roles.md`, `references/team-building.md`) meet no Meaningfy rule;
management is DEC-10 territory.

## Trigger overlap
`sales-pipeline-custody` ("sales pipeline", stages and grooming); `sales-operations` (the weekly
pipeline review, "fill my pipeline"); `sales-qualification` ("lead-qualification framework");
`sales-conversations` ("cold email sequences", first outreach and revival); the `sales-agent` agent,
which runs the pipeline days. Of the three skills read here it claims the most Meaningfy prompts.

## Fallback sentence (draft)
If `predictable-revenue` is not installed, offer `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/wondel-ai-skills#c5265583b1a9740f06831e1d3e89b35bba3eb430 --skill predictable-revenue --agent claude-code --global --yes` (the opencode command is in `assets/install.md`); if the person declines, carry on with `sales-conversations` and `sales-pipeline-custody`, and say once that the outbound-machine guidance was not used.
