# Study: non-engineering skills of the external repo (wondelai) against skillery

Repo root (external, read only): /tmp/claude-1000/-home-lps-work-repos-skillery/f4ac8776-d12e-4770-9b84-15bedd2c4aa2/scratchpad/wondelai/repo
Ours: /home/lps/work/repos/skillery/skills/. EPIC: /home/lps/work/repos/skillery/openspec/changes/lean-skills/proposal.md.

How to read the sizes: "SKILL.md" is the body in characters; "total" is every file of the skill folder in characters (references included, JSON excluded). Frontmatter descriptions were read for all 50 skills. Bodies and references were read in full only where stated in section 5; for the rest I read the frontmatter, the section headings and the passages quoted.

## 0. Findings that shape the verdicts

1. Our selling method is already a distillation of two of these books. /home/lps/work/repos/skillery/skills/sales-conversations/references/selling-method.md lists Hormozi and Voss as sources (lines 6 and 7), and sales-qualification/references/value-equation.md opens with "Value equation (Hormozi)". The external `hundred-million-offers` and `negotiation` are the originals. But our text is an adaptation with Meaningfy rules ("never discount", cover before upside), so a dependency saves little text (about 3 to 4 KB across the sales skills) and must never override it.
2. Most of the external repo is product, growth and consumer-UX material (about 34 of 50 skills) with low use for a B2B services consultancy. The 8 "create/grow/improve" orchestrators embed their constituent skills inline (each 22 to 25 KB for 2 files) and write `docs/*.md` trackers into the user's repo (create-business/SKILL.md, Operating Rules 2 and 6). They would act on a project folder and duplicate their own constituents.
3. Three real conflicts with Meaningfy preferences: monetary concession tactics and "fast-action discount" against "never discount"; value-based pricing against our effort-based fixed frame; ANUM qualification against our MEDDPICC and five Ps. Em dashes in the external text (38 in hundred-million-offers/SKILL.md, 28 in storybrand-messaging/SKILL.md) conflict with the no-em-dash voice only if output copies their style; Meaningfy voice wins.

## 1. Table

Columns: skill | SKILL.md / total chars | covers | closest ours | relation | relevance | verdict.

| Skill | Size (SKILL.md / total) | Covers | Closest ours | Relation | Relevance | Verdict |
|---|---|---|---|---|---|---|
| negotiation | 18,922 / 35,650 | Voss method: tactical empathy, mirroring, labels, calibrated questions, accusation audit, Ackerman bargaining, black swans | sales-conversations (selling-method principle 11, conversation-tools "Listen first" Voss), semantic-consulting-coach (negotiation prompts, BATNA) | duplicates ours (generic part); competes on Ackerman concessions | high | DEPEND |
| hundred-million-offers | 20,011 / 157,569 | Value equation, grand slam offer, starving crowd, value pricing, bonus stacking, guarantees, scarcity, offer naming | sales-qualification/references/value-equation.md, sales-conversations selling-method principles 5, 9 | duplicates ours (value equation); competes on scarcity, guarantees, pricing | high | DEPEND |
| mom-test | 16,817 / 90,897 | Customer conversations: past specifics, no pitch, commitment and advancement | sales-qualification question bank, semantic-consulting-coach/references/presales-discovery.md (1.5 KB) | complements ours (no restatement found) | high | ADOPT-NEW |
| obviously-awesome | 18,598 / 136,037 | Positioning: competitive alternatives, unique attributes, best-fit customers, category | none | no counterpart | high | ADOPT-NEW |
| jobs-to-be-done | 16,493 / 61,655 | Customer job analysis, switching, functional vs emotional jobs | none (semantic-consulting-coach touches service design, not JTBD) | no counterpart | medium | ADOPT-NEW |
| good-strategy-bad-strategy | 19,456 / 80,069 | Rumelt kernel: diagnosis, guiding policy, coherent action; bad-strategy detection | semantic-consulting-coach (business layer) | complements ours; mode collision (see 4) | medium | ADOPT-NEW |
| storybrand-messaging | 14,858 / 79,951 | SB7 brand script, one-liner, website and email copy, customer as hero | meaningfy-voice, executive-communication (structure only) | complements ours | medium | ADOPT-NEW |
| one-page-marketing | 22,236 / 173,312 | Whole marketing plan, USP, lead nurture, lifetime value | none | no counterpart | medium | ADOPT-NEW |
| influence-psychology | 17,148 / 158,338 | Seven persuasion principles for copy, sales, product | sales-conversations (principle 12 Robbins only) | complements ours; scarcity rule needs care | medium | ADOPT-NEW |
| high-output-management | 20,628 / 87,641 | Grove: managerial leverage, 1:1s, OKRs, delegation | none | no counterpart | medium | ADOPT-NEW |
| predictable-revenue | 12,390 / 117,371 | Outbound SDR/AE/CSM machine, Cold Calling 2.0, ANUM, pipeline math | sales-qualification (MEDDPICC, five Ps), sales-pipeline-custody, sales-conversations email-patterns | competes (ANUM, cold sequence) | medium | BORROW-IDEA: email "above" the decision maker and ask for a referral down; seeds, nets, spears lead types |
| made-to-stick | 16,025 / 147,859 | SUCCESs: simple, unexpected, concrete, credible, emotional, stories; curse of knowledge | explanatory-writing (concrete example beside every abstract claim, craft-moves.md section 2) | complements ours | medium | BORROW-IDEA: the curse-of-knowledge check |
| monetizing-innovation | 21,035 / 85,492 | Willingness-to-pay research, packaging tiers, monetization models | estimation, selling-method "where prices come from", engagement-lifecycle (two-tier package) | competes (value vs effort pricing) | medium | BORROW-IDEA: willingness-to-pay interview before the price, good-better-best packaging |
| crossing-the-chasm | 14,505 / 136,952 | Adoption lifecycle, beachhead segment, whole product | none (sales-pipeline-custody has five routes, not segments) | no counterpart | medium | BORROW-IDEA: beachhead segment and whole product for Meaningfy's own products |
| design-sprint | 15,357 / 141,575 | 5-day map, sketch, decide, prototype, test | decision-package (Proof of Value discovery flow) | no counterpart | low | BORROW-IDEA: time-boxed validation that ends in one decision |
| scorecard-marketing | 14,167 / 52,008 | Quiz and assessment lead funnels | none | no counterpart | low | BORROW-IDEA: a semantic-maturity scorecard as lead magnet |
| 37signals-way | 14,905 / 112,476 | Getting Real, Rework, Shape Up | epic-planning (Shape-Up style, not read) | unknown overlap | low | IGNORE (engineering reader: check epic-planning overlap) |
| blue-ocean-strategy | 13,341 / 162,216 | Value innovation, ERRC, strategy canvas | none | no counterpart | low | IGNORE |
| cold-start-problem | 18,944 / 77,149 | Network effects, marketplaces | none | no counterpart | low | IGNORE |
| contagious | 17,762 / 150,645 | STEPPS virality | none | no counterpart | low | IGNORE |
| continuous-discovery | 15,246 / 104,305 | Opportunity solution trees, weekly interviews | none | no counterpart | low | IGNORE |
| conversion-optimization | 26,651 / 49,182 | Orchestrator over 6 skills for funnels | none | duplicates its own constituents | low | IGNORE |
| cro-methodology | 17,070 / 55,876 | Landing-page audits, A/B tests | none | no counterpart | low | IGNORE |
| create-app | 24,600 / 28,341 | Orchestrator, idea to app, includes engineering skills | none | duplicates constituents | low | IGNORE |
| create-business | 24,584 / 29,500 | Orchestrator over 10 skills, writes docs/*.md | semantic-consulting-coach (collides) | duplicates constituents; competes with the coach's ask-first mode | low | IGNORE |
| create-website | 23,034 / 26,797 | Orchestrator, message-first website | none | duplicates constituents | low | IGNORE |
| design-everyday-things | 15,994 / 162,403 | Affordances, signifiers, mental models | none | no counterpart | low | IGNORE |
| drive-motivation | 12,441 / 117,187 | Autonomy, mastery, purpose | none | no counterpart | low | IGNORE |
| grow-app | 22,464 / 25,195 | Orchestrator, retention engine | none | duplicates constituents | low | IGNORE |
| grow-business | 25,301 / 27,279 | Orchestrator over 9 skills incl. negotiation, predictable-revenue | sales-* (collides) | duplicates constituents | low | IGNORE |
| grow-website | 22,799 / 25,737 | Orchestrator, website growth | none | duplicates constituents | low | IGNORE |
| hooked-ux | 14,064 / 73,454 | Hook model, habit loops | none | no counterpart | low | IGNORE |
| improve-app | 24,645 / 28,916 | Orchestrator, app polish | none | duplicates constituents | low | IGNORE |
| improve-business | 22,063 / 24,947 | Orchestrator over 8 skills (strategy, EOS, negotiation, pricing) | semantic-consulting-coach (collides) | duplicates constituents | low | IGNORE |
| improve-retention | 15,225 / 79,156 | Behaviour design, activation, churn | none | no counterpart | low | IGNORE |
| improve-website | 20,651 / 23,940 | Orchestrator, website fixes | none | duplicates constituents | low | IGNORE |
| inspired-product | 15,860 / 99,697 | Empowered product teams, discovery and delivery | none | no counterpart | low | IGNORE |
| ios-hig-design | 20,409 / 86,407 | Apple HIG | none | no counterpart | low | IGNORE |
| lean-analytics | 17,047 / 83,368 | Startup metrics, OMTM | none | no counterpart | low | IGNORE |
| lean-startup | 17,078 / 166,502 | Build-measure-learn, MVP, pivot | none | no counterpart | low | IGNORE |
| lean-ux | 16,079 / 97,125 | Hypothesis-driven UX | none | no counterpart | low | IGNORE |
| microinteractions | 15,227 / 107,233 | Interaction detail | none | no counterpart | low | IGNORE |
| refactoring-ui | 15,635 / 69,734 | Visual hierarchy, spacing, colour | none | no counterpart | low | IGNORE |
| steve-jobs-design-review | 18,068 / 78,858 | Simplicity-focused review | none | no counterpart | low | IGNORE |
| top-design | 23,127 / 78,980 | Award-level web experiences | none | no counterpart | low | IGNORE |
| traction-eos | 14,259 / 143,261 | EOS operating system: V/TO, rocks, L10 | none | no counterpart; prescribes a whole operating system | low | IGNORE |
| ux-heuristics | 16,518 / 83,310 | Nielsen heuristics, usability audit | none | no counterpart | low | IGNORE |
| web-typography | 18,110 / 62,982 | Font choice, scale, loading | none | no counterpart | low | IGNORE |

Verdict counts: DEPEND 2, ADOPT-NEW 8, BORROW-IDEA 6, IGNORE 34 (total 50).

Note on UX and design: the environment already lists `design:*` and `product-management:*` plugin skills, so the design skills add nothing a Meaningfy session lacks. For a consultancy that rarely designs interfaces, none is worth a dependency.

## 2. Conflicts ("competes" rows)

**negotiation: Ackerman concessions against "never discount".**
- External, /tmp/.../repo/negotiation/SKILL.md, section 7: "open at 65% and raise in decreasing increments: 85% -> 95% -> 100%" and "Decreasing discount increments across contract years".
- Ours, /home/lps/work/repos/skillery/skills/sales-conversations/references/selling-method.md, principle 9: "Never discount; trade scope, timing, or a bonus that removes a named objection." Also objections.md, Price row: "never discount".
- Point: Ackerman moves the money number in steps; ours holds the number and moves scope. Ackerman's closing "non-monetary bonus" is compatible; the 65% opening is not.

**hundred-million-offers: scarcity, bonus pricing and discounts.**
- External, hundred-million-offers/SKILL.md section 7: "Bonus scarcity ('First 20 people also get...') adds urgency"; references/pricing-strategy.md lists a "fast-action discount" and "Offer a fast-action bonus instead of reducing price".
- Ours, selling-method.md principle 3 and 5: "Sell cover, not upside" and "Shrink the yes"; principle 4: "Never write 'leading', 'innovative' or 'cutting-edge'".
- Point: urgency tactics and promotional bonus stacks against calm, evidenced, reversible first steps for EU institutions and enterprises. The skill's own "Ethical boundary" lines soften this but do not remove it.

**hundred-million-offers: guarantees.**
- External, section 6: "Guarantee results to cut risk" with the example "10 qualified leads or you don't pay".
- Ours, sales-conversations/references/objections.md, Risk row: "Guarantees only from the safeguard options of `semantic-consulting-coach` (`engagement-lifecycle`), after the owner's yes".
- Point: ours gates guarantees through the owner and a fixed option list; the external skill encourages inventing and stacking named guarantees.

**hundred-million-offers and monetizing-innovation: price from value or cost.**
- External, hundred-million-offers/SKILL.md section 4: "Charge based on the value you deliver, not your costs". monetizing-innovation: "Price Before Product", willingness-to-pay research.
- Ours, /home/lps/work/repos/skillery/skills/estimation/SKILL.md line 48: "the PERT total + contingency is the fixed-frame price"; line 120 says every price in a draft cites estimation.
- Point: effort-based fixed frame against value-based price. Meaningfy's own rule wins; value pricing can inform the free-to-paid line, not the number in a proposal.

**predictable-revenue: ANUM and cold sequence.**
- External, predictable-revenue/SKILL.md Step 4: "ANUM" (Authority, Need, Urgency, Money) and the Day 3, 7, 14 follow-up with a "break-up email ... (scarcity)".
- Ours, sales-qualification/SKILL.md: five Ps scored from MEDDPICC with graded evidence; selling-method.md principle 1: "80% homework, 20% selling" and principle 2: "Eagerness is a negative signal".
- Point: a lighter qualification framework and a fixed cold cadence against evidence-graded qualification and researched, one-line proof messages. Also, the external skill assumes SDR and AE roles that a small firm lacks.

**create-business / improve-business against semantic-consulting-coach (mode conflict).**
- External, create-business/SKILL.md Operating Rule 6: "Present the draft artifact content for sign-off before writing ... write or extend the docs/ files".
- Ours, semantic-consulting-coach/SKILL.md defection table: "Coach first; produce the artefact only on an explicit synthesis request."
- Point: the orchestrator produces and files artefacts as it goes; the coach forbids producing until the owner asks.

**storybrand-messaging / explanatory-writing against voice (mild).** Not a conflict of rule but of style: storybrand uses 28 em dashes in its body, whereas /home/lps/work/repos/skillery/skills/meaningfy-voice/references/company-voice.md line 16 says "No em dash." Voice wins on output.

## 3. What could be cut from each of our skills, and what must stay

Honest summary: little. Our sales text is already a short Meaningfy adaptation, not a copy of the books. Savings are small and each needs the external skill to carry the generic part.

- **sales-conversations** (SKILL.md 7.1 KB; selling-method.md 9.3 KB; conversation-tools.md 3.1 KB). If negotiation and hundred-million-offers are dependencies: cut the generic sentences of selling-method principles 9 and 11 and the Voss lines of conversation-tools "Listen first" (about 1 KB), and the Hormozi C-L-O-S-E-R flow in conversation-tools.md (about 0.7 KB, but it is marked "adapted", so keep the Meaningfy three-pillar adaptation). Must stay: Sutherland principles 3 to 8, Taleb section, Challenger rules, insights.md (3.8 KB, six Meaningfy insights with proof), objections.md five types and library rule, channel matrix, no-discount rule.
- **sales-qualification** (8.6 KB; value-equation.md 3.1 KB). Cut: the four-lever Hormozi table in value-equation.md (about 1 KB) to a pointer. Must stay: the one-line dossier template, "Risk and blame" (Sutherland cover list), MEDDPICC, five Ps, research checklist, question bank. No external counterpart for those.
- **sales-accounts, sales-operations, sales-pipeline-custody**: Odoo shape, write policy, pipelines and exit criteria are all Meaningfy's own. Cut: nothing from the external repo. (sales-pipeline-custody/references/route-calls-and-tenders.md line 21 names Voss and Hormozi; only that citation could point at the dependency.)
- **proposal-writing, estimation**: no external counterpart. Nothing to cut. Note the conflict in section 2: estimation must keep owning price.
- **executive-communication** (14.2 KB): its Minto, SCQA and pyramid apparatus has no external counterpart in scope. made-to-stick could replace nothing here. Nothing to cut.
- **decision-package**: wholly Meaningfy (Proof of Value, free-to-paid boundary). Nothing to cut; design-sprint offers an idea only.
- **semantic-consulting-coach** (19 KB body, 57 KB total): the defection table, three layers, modes and engagement-lifecycle are Meaningfy's. The only generic candidates are the negotiation prompts (SKILL.md line 71, question-bank.md line 88 "BATNA") and business-layer questions in question-bank.md (6.1 KB); possibly 1 KB, not verified. A good-strategy-bad-strategy dependency could back the business-layer questions but must be invoked by the coach inside its modes.
- **explanatory-writing** (6 KB body, craft-moves.md 4.5 KB): "A concrete example beside every abstract claim" overlaps made-to-stick's Concrete (craft-moves.md section 2). Potential cut under 0.5 KB; made-to-stick is a BORROW-IDEA, not a DEPEND, so I advise keeping ours.
- **meaningfy-voice, writing-antipatterns, technical-writing**: Meaningfy rules and genre inversions with no counterpart. Nothing to cut. (technical-writing may overlap the excluded technical-documentation skill; that is the other reader's.)

## 4. Trigger collision risks

Compared frontmatter descriptions of the external skills with ours (ours are in /home/lps/work/repos/skillery/skills/*/SKILL.md).

- **negotiation** ("contract terms", "handling objections", "deal terms", "BATNA", "they wont budge on price") against sales-conversations ("how do I answer this objection") and semantic-consulting-coach ("negotiation ... BATNA"). High risk. Also meaningfy-legal:contract-practice ("the client sent back their version"). Routing fix: our skills name the dependency, and the dependency is never the first skill for Odoo-related requests.
- **hundred-million-offers** ("make my offer more compelling", "justifying premium pricing", "people say its too expensive") against sales-conversations, estimation, proposal-writing, semantic-consulting-coach (pricing). High risk.
- **mom-test** ("customer interviews", "interview script") against sales-qualification ("what should I ask this prospect") and semantic-consulting-coach presales-discovery. Medium.
- **predictable-revenue** ("sales pipeline", "cold email sequences", "lead-qualification framework") against sales-pipeline-custody, sales-qualification, sales-operations. High; it is also the reason to keep it out.
- **good-strategy-bad-strategy** ("strategic planning", "annual plan") and **create-business**, **improve-business** against semantic-consulting-coach ("thinking through a business ... decision"). Medium to high. The orchestrators mention "business" and "strategy" and would fire on coaching requests.
- **storybrand-messaging** ("elevator pitch", "one-liner", "website copy", "email nurture sequences") and **made-to-stick** ("pitch deck", "value proposition") against executive-communication ("tighten this message"), meaningfy-voice and proposal-writing. Medium.
- **influence-psychology** ("persuasive copy") against executive-communication ("make this persuasive"). Medium.
- **monetizing-innovation** ("how much should we charge", "price increase") against estimation. Medium.
- **obviously-awesome** ("positioning", "category") against sales-conversations "Own the frame and the name". Low.
- **high-output-management** ("one-on-ones", "OKRs", "delegation") against nothing of ours; but the environment has product-management and atlassian skills (stakeholder-update, sprint-planning) that overlap.
- **design-* and ux-* skills** against installed `design:*` plugin skills (design-critique, ux-copy, accessibility-review) and frontend-design. Medium for any install.
- **Orchestrators** (create-*, grow-*, improve-*): each description lists ten constituent skill names, so one prompt may load an orchestrator plus its constituents. They also write `docs/CUSTOMER.md`, `docs/OFFER.md` etc., and clash with the spine rule that artefacts land in openspec/, not ad hoc docs trees (AGENTS.md, "External method skills land in the spine").
- All external descriptions are long and pack many trigger phrases (about 600 to 900 characters), so each one fires on loose conversation.

## 5. What I did not read or could not determine

- I did not read the references of any external skill in full. For negotiation I read the SKILL.md sections 7 and "Handling Common Situations"; for hundred-million-offers sections 4 and the headings; for predictable-revenue the Cold Calling 2.0 and ANUM sections; for mom-test the rules section; for create-business the first 40 lines; for monetizing-innovation and storybrand the headings and selected lines. The other ~35 skills were judged from frontmatter and headings only. Their verdicts are low-confidence for the IGNORE group, but their low relevance is clear from the subject.
- I did not read the contents of negotiation/references/techniques.md (16.7 KB), nor the pricing, guarantees or scarcity references of hundred-million-offers, so the conflicts quoted are the SKILL.md level plus one pricing-strategy.md line.
- I did not read in full our sales-accounts, sales-operations, sales-pipeline-custody (16 KB), proposal-writing, decision-package, writing-antipatterns or technical-writing bodies; I used headings and descriptions. The statement "nothing to cut" for these rests on the absence of any external source named in them (a grep for the source names across our sales, consulting and writing skills found citations only in sales-conversations, sales-qualification and sales-pipeline-custody/route-calls-and-tenders.md).
- I could not determine whether the externals' hundreds of KB of references would be loaded on trigger or only on demand; their SKILL.md files say "See references/x.md when ...", which suggests on demand, but I did not verify.
- I did not check licences (MIT is declared in the frontmatter of the ones I opened), nor how the external repo installs on opencode, nor its version pinning or maintenance record.
- The size savings in section 3 are estimates read off section sizes, not measured diffs.
- I did not check epic-planning against 37signals-way; the engineering reader should.
- I did not run any external script.
