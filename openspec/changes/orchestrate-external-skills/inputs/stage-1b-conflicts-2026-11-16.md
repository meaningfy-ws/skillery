# Stage 1b conflicts: the owner's answers

**Status:** secondary input, never groomed. Recorded on 2026-11-16 (task 1.12, design D-6). The
conflicts come from the sixteen reading records in [`../evidence/reading/`](../evidence/reading/),
read by readers B to G at `wondel-ai-skills` `c5265583b1a9740f06831e1d3e89b35bba3eb430`, with a
second reader on `negotiation`, `hundred-million-offers` and `monetizing-innovation` (12 rows added).

The records hold 66 conflicts marked "not named". They went to the owner in one round, in eight
groups. No skill is dropped: all sixteen are registered.

| # | Group | Records and conflicts | Asked | Recommended | Answer |
|---|---|---|---|---|---|
| A | Pressure and persuasion | influence-psychology 5, 6, 7, 8, 12, 13; negotiation 4, 7, 8; hundred-million-offers 4, 9; mom-test 3; storybrand-messaging 8; made-to-stick 5; obviously-awesome 5; scorecard-marketing 6; one-page-marketing 12 | Urgency, scarcity, fear, leverage, flattery and mirroring in writing, persuasion in binding text and tenders | Override | **Override** |
| B | Honest claims | made-to-stick 2, 7; crossing-the-chasm 5; influence-psychology 10; negotiation 6; obviously-awesome 4; hundred-million-offers 8, 11, 13, 16; jobs-to-be-done 4; storybrand-messaging 7; one-page-marketing 10; scorecard-marketing 5; predictable-revenue 7 | Unsourced figures, stories that need not be true, "the best", hype, a hidden weakness, a confident forecast | Override | **Override** |
| C | Free work | influence-psychology 3; obviously-awesome 3; storybrand-messaging 9; one-page-marketing 4; scorecard-marketing 2; hundred-million-offers 12; monetizing-innovation 8 | A free audit, diagnostic, report, trial or bonus deliverable | Override | **Override** |
| D | Offer shape | monetizing-innovation 4; one-page-marketing 6; scorecard-marketing 7; hundred-million-offers 10, 15, 17 | Decoy tiers, anchors, good/better/best, an offer invented per buyer, a persuasion stack as the offer | Override | **Override** |
| E | People's data and gifts | influence-psychology 4, 11; mom-test 6, 7; jobs-to-be-done 5; predictable-revenue 4, 5; one-page-marketing 11, 13; scorecard-marketing 8; made-to-stick 4 | Gifts, tracked or bought contact data, named testimonials, notes outside Odoo, automated sending | Override | **Override** |
| F | Voice | influence-psychology 9; storybrand-messaging 12 | Their own brand voice, a casual tone | Override | **Override** |
| G | Executive writing and strategy | made-to-stick 6; good-strategy-bad-strategy 3, 4; high-output-management 1 | Hook first, diagnosis first, proposing a strategy outright, a brief with no recommendation | Override | **Accept: guidance, no override** |
| H | Documentation | technical-documentation 8, 9, 10, 11 | Their rewrite protocol, five page types, Markdown only, a changelog not built from commits | Override | **Override** |

The owner also kept the readers' broad readings (about ten rows marked named): outreach tone and the
prospect question bank count as "our outreach rules" (DEC-7); DEC-19's price sentence covers any
skill that names a price; technical-documentation's voice rows fall under DEC-20.

## The overrides stage 2 writes (D-10)

In the orchestrator's own words (DEC-18), for the wondel rows:

1. **Pressure and persuasion.** The selling method of `sales-conversations` wins: no pressure, no
   invented urgency or scarcity, no leverage, no flattery or mirroring in writing, and no
   persuasion in binding text or public procurement (`meaningfy-voice`).
2. **Honest claims.** `meaningfy-voice` wins: no spin, no overclaiming, every figure the client's
   own or published with its source, ranges rather than one confident number.
3. **Free work.** Presale is the only free stage; a free audit, diagnostic or pilot is the paid
   Proof of Value (`semantic-consulting-coach`).
4. **Offer shape.** Offers come from the services catalogue, one recommended option with at most
   one fallback (`proposal-writing`, `sales-qualification`); no decoys or anchors.
5. **People's data and gifts.** The personal-details and Odoo rules win (`sales-accounts`,
   `sales-qualification`): only what a person shared or published, no bought lists, no gifts to a
   buyer under procurement rules, drafts only and never sent by the agent.
6. **Voice.** `meaningfy-voice` is the only voice.
7. **Documentation.** `technical-writing` wins on workflow, Diátaxis page types and format
   (AsciiDoc/Antora or GitHub-flavoured Markdown); the CHANGELOG comes from Conventional Commits
   through release-please (`meaningfy-release`).

One more conflict, found in review (design D-27): `scorecard-marketing` sends a visitor's email and
partial answers before they submit or consent. Asked: widen override 5, drop the skill, or accept;
recommended: widen override 5. **Answer: accept**, no override.

Group G has no override: `good-strategy-bad-strategy`, `high-output-management` and
`made-to-stick` may shape executive writing and strategy reasoning as guidance.
