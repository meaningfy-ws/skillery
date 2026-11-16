# Reading: scorecard-marketing
Fork `meaningfy-ws/wondel-ai-skills` at `c5265583b1a9740f06831e1d3e89b35bba3eb430`, read in full on 2026-11-16 by reader E.

| File | Bytes | What it adds |
|---|---|---|
| `SKILL.md` | 14,167 | Frontmatter, a 10-point score from a six-row diagnostic, the four steps (landing page with a concept hook, questionnaire with contact capture first and scored categories, results page by tier, promotion and tiered follow-up), naming formulas, claimed conversion benchmarks, the psychology, a checklist and common mistakes. |
| `references/psychology.md` | 5,531 | Pain, desire and frustration as tension, dormant against active desire, emotion, logic and urgency as purchase conditions, why scoring motivates, warming up, the path of least resistance and personalisation statistics. |
| `references/industry-examples.md` | 7,616 | Scorecard concepts by industry, question templates (yes or no, scales, multiple choice, qualifying questions), result copy for low, medium and high tiers, and results, abandonment and follow-up mail templates. |
| `references/technical-implementation.md` | 14,346 | Quiz platforms compared, JavaScript for additive, category, weighted and tier scoring, branching and dynamic results, PDF generation, a webhook that feeds CRM and mail, progress saving, abandonment capture, rate limiting and validation. |
| `references/analytics-optimization.md` | 10,348 | Metrics with benchmarks per funnel stage, what to A/B test, drop-off analysis, segmentation by score and behaviour, CRM fields and lead points, workflow triggers, a review cadence, event tracking and a dashboard. |

Total read: 52,008 bytes.

## Goals it serves
Designing a self-assessment that a prospect fills in: the hook and landing page, the questions and
their scoring, the result per tier, the mails after it, the analytics, and the tool itself. For
Meaningfy it fits a public, short self-check (for example on data readiness) used as marketing, with
no house rule for marketing yet (DEC-10), as long as it stays on the presale side of the free to paid
line. Not for qualifying a deal (`sales-qualification`), for the paid maturity assessment, which is a
separately sold service, or for follow-up mails to a deal's contacts (`sales-conversations`). Its
description claims "lead qualification", which in Meaningfy means the five Ps of
`sales-qualification`, not a quiz score.

## Conflicts with Meaningfy rules
| # | Their advice (file, heading, line) | The Meaningfy rule it meets (owner skill) | Named in DEC-7, DEC-19 or DEC-20? |
|---|---|---|---|
| 1 | Qualification by self-scored form and lead points: `SKILL.md`, "2. Questionnaire", line 65 (budget, urgency and size questions), and "Psychology Behind Why This Works", line 164; `references/industry-examples.md`, "Budget/Investment Signals", lines 98-103, and "Qualifying Questions", lines 105-121; `references/analytics-optimization.md`, "Lead Scoring Integration", lines 205-217, and "Workflow Triggers", lines 219-228 (a high score plus a click goes straight to sales). | The verdict is the five Ps read from MEDDPICC, each with a source, never asked as a question list (`sales-qualification` `SKILL.md`, lines 104-105; `references/five-ps.md`, lines 22-28); a lead becomes an opportunity only on a cited two-way signal (`sales-pipeline-custody` `SKILL.md`, lines 80-86; outside the list). | DEC-7 |
| 2 | A free personalised report and a free call: `SKILL.md`, "3. Results Page", lines 95-96 (a personalised PDF with recommendations; a free event, a discovery call or a direct consultation by tier), and line 36 (a free consultation as a bonus); `references/psychology.md`, line 189 (a free strategy call); `references/industry-examples.md`, lines 5-9 and 29-32 (readiness and digital-transformation assessments as concepts). | Presale is the only free stage and produces no deliverable (`semantic-consulting-coach` `references/engagement-lifecycle.md`, lines 9-19); a semantic and data maturity assessment is a separate, separately sold service (lines 40-41); a free audit gives the method away (`SKILL.md`, defection table, lines 93 and 96). A short generic self-check that teaches stays in presale; tailored recommendations do not. | not named |
| 3 | `references/psychology.md`, "The 3 Conditions for Purchase", lines 47-52 (limited time, a price that may rise), and the results example, line 189 (a bonus with only a few places left); `references/industry-examples.md`, line 191 (a select number of clients), line 221 (an urgency P.S.) and line 258 (an offer with a deadline). | No fake deadlines or scarcity (`meaningfy-voice` `references/channels/outreach-email.md`, line 20); a bonus only removes a named objection and is *ask first*; no scarcity, urgency or bonuses in a tender (`sales-conversations` `references/selling-method.md`, lines 15 and 42). | DEC-7 |
| 4 | `SKILL.md`, "4. Sales and Marketing", line 123 (results at once, then abandonment mails); `references/industry-examples.md`, "Abandon Email", lines 224-247, and "Follow-Up Sequence", lines 249-263 (days 0, 3, 7 and 14); `references/analytics-optimization.md`, "Workflow Triggers", lines 226-228 (reminders after 24 and 48 hours). | At most one message per contact per 7 days and three unanswered touches, then stop (`sales-conversations` `references/selling-method.md`, lines 71-72). | DEC-7 |
| 5 | Figures with no source: the description, line 3, and "Conversion Benchmarks", lines 154-158; `references/psychology.md`, line 93 and "Personalization Statistics", lines 141-150, and the example claim of years of research with thousands of households, line 179; `references/industry-examples.md`, line 181 (tell the respondent their percentile). | A figure is the client's own, a published one with its source, or left out (`sales-conversations` `references/insights.md`, line 18); no inflated claims (`outreach-email.md`, line 21); never inflate value (`sales-qualification` `references/value-equation.md`, line 64). | not named |
| 6 | Selling by created tension: `SKILL.md`, "Core Principle", lines 16-18; `references/psychology.md`, "Dormant vs Active Desires", lines 15-27 (dormant buyers are easier to influence and open on price), lines 54-57, and "Path of Least Resistance", lines 110-137. | Sell cover, not upside; reframing must never mislead; no hype register with compliance, CFO or bank buyers (`sales-conversations` `references/selling-method.md`, lines 9, 43, 51 and 54); no persuasion in public procurement (`outreach-email.md`, line 23). The fork's own limits (`SKILL.md`, lines 51, 111 and 140) remove the worst cases, not the stance. | not named |
| 7 | `SKILL.md`, line 96, and `references/analytics-optimization.md`, "Score-Based Segmentation", lines 158-164: an introductory, a consultation or a premium offer chosen by score tier. | One lead offer from the ladder with at most one fallback, taken from the services catalogue, never invented (`sales-qualification` `SKILL.md`, lines 66-69). | not named |
| 8 | `references/analytics-optimization.md`, "CRM Integration", lines 188-204 (store answers and scores in the CRM), and "Heatmap and Session Recording", lines 296-302; `references/technical-implementation.md`, "Integration Architecture", lines 369-445 (HubSpot or Salesforce, Mailchimp, a Google Sheet copy). | The CRM is Odoo and every write goes through `sales-pipeline-custody`; a personal detail is used only when the person shared or published it (`sales-accounts` `SKILL.md`, lines 53 and 122). Outside the list. | not named |
| 9 | The fork's own wording, which an agent copies into result pages and mails: US spelling and em dashes (`SKILL.md`, lines 16 and 18) and an emoji in the results mail (`references/industry-examples.md`, line 215). | British English and no em dash in every produced artefact (`meaningfy-voice` `references/company-voice.md`, lines 13-16). | DEC-7 |
| 10 | The quiz asks for the email early, and when the visitor leaves the page it sends the email and the partial answers to the server before any submission or consent: `references/technical-implementation.md`, "Abandonment Recovery", lines 495-510. | Personal data only as the person shared it (`sales-accounts` `SKILL.md`, lines 53 and 122; outside the list). | not named; owner accepted, 2026-11-16 (review, D-27) |

Checked and not counted: the webhook in `references/technical-implementation.md`, lines 396-433, does
the PDF, CRM, mail and analytics calls in one handler; a Python build in a Meaningfy repository would
split it into a service and injected adapters (`cosmic-python:AP-LOGIC-IN-EDGES`, catalogue line 48),
but the example is illustrative JavaScript, so it is not counted. Its server-side validation
(lines 546-567) agrees with `cosmic-python:BP-VALIDATE-AT-BOUNDARY`. The example
`getCategoryTier` (lines 172-186) reads a variable it never defines, a defect of the fork, not a
conflict. The ethical limits (no inflated or deflated score, no use of volunteered pain to pressure,
every qualifying question shaping the result) agree with Meaningfy's integrity rules; asking before
recommending (`references/psychology.md`, lines 129-137) agrees with listening first
(`selling-method.md`, line 17).

## Trigger overlap
`sales-qualification` (its description claims "lead qualification", that skill's core);
`sales-conversations` (follow-up sequences after a result); `sales-pipeline-custody` (lead scoring
against its leads and opportunities in Odoo); `semantic-consulting-coach` (whether to offer a free
assessment is a free to paid question); `architecture` and `cosmic-python` when it is asked to build
the tool ("calculators or graders"). Among agents, `sales-agent` and `implementer` (building the
tool). Its description also points to the external `cro-methodology` and `one-page-marketing`.

## Fallback sentence (draft)
If `scorecard-marketing` is not installed, offer `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/wondel-ai-skills#c5265583b1a9740f06831e1d3e89b35bba3eb430 --skill scorecard-marketing --agent claude-code --global --yes` (the opencode command is in `assets/install.md`); if the person declines, carry on with `sales-qualification` for anything that qualifies a deal, and say once that the scorecard method was not used and that Meaningfy has no house marketing method yet.
