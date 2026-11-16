# Touch map: commercial-portfolio, rules-first-memory, delivery-retrospective

Read on 2026-11-14 in the worktree `.claude/worktrees/delivery-process-and-tools`. Paths below are relative to it unless absolute. R1 = `lean-skills` (read at /home/lps/work/repos/skillery/openspec/changes/lean-skills/proposal.md), R2 = `orchestrate-external-skills`, R3 = `delivery-process-and-tools`.

Sizes are `wc -c` of `SKILL.md` plus `references/` (prose only; templates, scripts and assets are outside R1's budget by R1 DEC-2). R1's limit is 24,576 bytes (24 KB), body target about 6 KB.

| Skill | SKILL.md | references/ | Prose total | vs 24 KB |
|---|---|---|---|---|
| semantic-consulting-coach | 19,049 | 38,152 | 57,201 | 2.3x over |
| proposal-writing | 7,129 | 7,333 | 14,462 | within |
| decision-package | 9,620 | 12,372 | 21,992 | near (89%) |
| estimation | 7,392 | 4,269 | 11,661 | within |
| rulebook | 8,464 | 18,904 | 27,368 | over (rules.py in scripts/ is outside the budget) |
| rule-learner | 9,256 | 7,653 | 16,909 | within |
| rule-steward | 7,524 | 3,119 | 10,643 | within |
| sales-conversations | 7,077 | 21,654 | 28,731 | over |
| sales-qualification | 8,574 | 14,430 | 23,004 | near (94%) |
| epic-delivery | 12,063 | 24,905 | 36,968 | over |
| guardrails | 13,347 | 2,323 | 15,670 | within |
| epic-planning | 10,871 | 5,827 | 16,698 | within |

Coach references: engagement-lifecycle 8,893; engagement-model 8,755; semantic-consulting-domain 9,396; question-bank 6,108; decision-phase-posture 3,538; presales-discovery 1,462. Rulebook references: commands 8,641; rule-model 10,263.

---

## 1. commercial-portfolio

### 1.1 State
- Shaped EPIC, no PLAN. Shaped 2026-10-29 (`openspec/changes/commercial-portfolio/proposal.md`, header comment). Appetite LARGE.
- Decides: two layers, general commercial rules in skillery and packages as documents outside git (DEC-3, DEC-4); a twelve-field package template held in skillery, never a package's prices or terms (DEC-7, proposed); skills read a package and do not carry one (DEC-1); the user names whom the work is for and what is sold, the skill does not choose (DEC-5); today's position unchanged, presale the only free stage (DEC-2); the shared building-blocks catalogue stays in skillery (DEC-8, proposed).
- Still open: where the packages live (DEC-3, "decided later"); where the template and the general rules live (the proposal says only "in the skills that own them"); whether the twelve fields hold (the owner's Luxembourg SME package is the first test); how `engagement-model` and `sales-method-ownership` are rewritten ("decided in the PLAN"); DEC-7 and DEC-8 are still "proposed". The owner's first real input, the Luxembourg SME package, has not been supplied (proposal header and `inputs/qa.md`).
- Delta spec shaping-level only: `openspec/changes/commercial-portfolio/specs/commercial-portfolio/spec.md` (two requirements: skills work from a package document; every package follows one template).

### 1.2 Touch table
| Artifact | Change | Basis |
|---|---|---|
| skill `semantic-consulting-coach` | `references/engagement-lifecycle.md` keeps general rules only; the Proof of Value 4 to 6 weeks, its three safeguards, the two Discovery depths and Scaling go out as a package document for the owner | proposal "What Changes", "Today's package becomes a document" |
| skill `semantic-consulting-coach` | SKILL.md and `engagement-model.md` (8.7 KB, "commercial facts and coaching knowledge live in separate coach references", spec `engagement-model` Req 5) read a package | inferred: the proposal names the skill, not the files |
| skill `proposal-writing` | description, body, `proposal-template.md`, `sow-template.md`, `scope-boundary-checklist.md` reframed from "the Proof of Value as fixed frame" to "the package in hand"; trigger probes follow | proposal "What Changes"; `inputs/qa.md` ("Where one package is baked in today") |
| skill `decision-package` | description and body stop saying it is "the paid keystone deliverable of the Proof of Value"; produced "when the package calls for one" (DEC-6) | proposal; skills/decision-package/SKILL.md line 3 |
| skill `estimation` | not edited; the proposal only says keep it apart ("Estimation" rabbit-hole). A line may be needed on how an effort-based estimate meets a package price | inferred |
| skill `sales-qualification`, `sales-conversations` | their pointers "offer ladder owned by `semantic-consulting-coach`, `engagement-lifecycle`" (sales-qualification SKILL.md lines 69 and 123; sales-conversations line 114) and "offer ladder and guarantees" must follow the split | inferred; not in the proposal |
| agent `proposal-writer` | thin wrapper, preloads proposal-writing and estimation; likely needs a line that packages come from a document | inferred |
| new: package template | home undecided. Candidate homes are a reference of `proposal-writing` or of the coach. Nothing is decided | proposal "Solution outline" |
| doc `docs/practice/ai-sales/services/index.md`, `semantic-layer-services.md` | point to the general rules and the template | proposal "What Changes" |
| spec `engagement-model` (5 requirements), `sales-method-ownership` (requirement "The offer ladder has one owner and one set of names") | rewritten as general rules or retired into the package | proposal "Specs that name one package"; "Modified Capabilities: decided in the PLAN" |
| new spec `commercial-portfolio` | adds the two requirements | specs/commercial-portfolio/spec.md |
| tests | trigger probes for the changed descriptions in `tests/trigger_probes.yaml`; Gherkin for "a proposal for a named package" and "where packages live is unknown" | AGENTS.md "Proven triggers"; spec scenarios |
| bundles, inventory | `make bundles`, `make skill-inventory` after any description change | AGENTS.md |

No mod, no tool, no new skill, no new agent. The No-gos forbid a store, a pricing engine and a skill per package.

### 1.3 Against R1 (lean-skills)
- Over or near 24 KB: `semantic-consulting-coach` (57,201, the largest catalogue file set after project-setup, R1 must cut about 33 KB), `decision-package` (21,992, near), `sales-qualification` (23,004, near), `sales-conversations` (28,731, over). `proposal-writing` (14,462) and `estimation` (11,661) are within.
- Same files, same passages: the coach's `engagement-lifecycle.md` is exactly what commercial-portfolio empties of package facts. R1 stage 5 ("sales, devops and the rest") reassesses the whole coach. Work done by commercial-portfolio before R1 moves out of the coach what R1 would then assess again; the reverse order makes the split smaller input for R1 to sort.
- Text commercial-portfolio adds that R1 would cut or hold: the general-rules text it keeps in `engagement-lifecycle.md` (generic if it is the same coaching advice any consultant knows), and any new "ask where the packages live" and "name the missing field" prose repeated in three skills (coach, proposal-writing, decision-package). R1 DEC-2 and "no repetition inside skillery" would make that one place, not three. The proposal says the three skills each revise; the single-source rule in AGENTS.md wants one owner of the fetch-and-check procedure. This is a design point for the PLAN.
- Is "skills carry no package prices or terms" the same idea as R1's "a skill holds only what is Meaningfy's own"? No, they cut along different lines, and they only partly overlap. R1 cuts generic knowledge a model or a dependency already has, keeps Meaningfy's own distilled rules (R1 "Solution outline" 3, DEC-1). commercial-portfolio removes Meaningfy's own facts (the Proof of Value, its price frame, its safeguards) from skills because they are volatile and specific to one package, and places them in a document outside git (DEC-3, DEC-4). Both shrink the skill, but a package fact is Meaningfy-specific and R1 would keep it; only commercial-portfolio moves it. The two ideas agree on the effect "less text in the skill" and disagree on the test: R1 asks "is it generic?", commercial-portfolio asks "is it one package's?". R1 does not cover a rule to hold package data out of skills. A second reader checking R1's "no Meaningfy-specific rule lost" (R1 DEC-9) would flag a Proof of Value fact moved out as lost unless commercial-portfolio has recorded it first.

### 1.4 Against R2 (orchestrate-external-skills)
Both rules pull on price and the offer.
- Price basis. commercial-portfolio, template field: "Price and pricing basis | the price, currency, and what it is based on (fixed, per stage, per person)" (proposal, template table). R2 DEC-7: "the effort-based price frame of `estimation`, over value-based pricing". The template allows "per person" and any basis; R2 forces effort-based for external advice. The two do not say who sets a package's price: a package document may state a value-based or per-person price while `estimation` is told to win. Needs one sentence in the PLAN of either: the package states the price, `estimation` informs it (commercial-portfolio "Estimation" rabbit-hole: "`estimation` prices effort; a package states a price. Keep the two apart").
- `monetizing-innovation` (R2 DEC-6; `inputs/wondelai-study/study-business.md` line 32: "competes (value vs effort pricing)", "good-better-best packaging", "willingness-to-pay interview"). commercial-portfolio: "one offer may hold several packages", "Building blocks stay one shared services catalogue" (DEC-8). The external packaging-tier advice would route into the package structure the owner is only now defining. R2's override says effort-based frame wins, but nothing says whether tiered packaging (good, better, best) is allowed. Unresolved.
- `hundred-million-offers` (study-business.md line 21: "competes on scarcity, guarantees, pricing", "bonus stacking", "offer naming"). commercial-portfolio template fields "Offer name | the named, irresistible offer" and "Perks and guarantees | bonuses, safeguards, what happens if the outcome is not reached". "Irresistible offer" and "perks" are the external book's vocabulary. R2 DEC-7: "a guarantee only after the owner's yes" and "no discount". The template invites a guarantee field the orchestrator says needs the owner's approval; the Proof of Value safeguards (three options: scope reduction, short extension, other, `engagement-lifecycle.md` lines 55 onward) are a guarantee of sorts. The PLAN must say safeguards in a package are the owner's already, not a new guarantee.
- `negotiation`. R2 DEC-7: "no discount, over their concessions". commercial-portfolio DEC-2 keeps "presale is the only free stage", and sales-conversations already carries "no discount" (line 92). The "Terms | payment, validity, conditions" field is where a concession would land. No conflict, but a package must not be able to set a discount field; the template has none.
- `obviously-awesome` (study-business.md line 23, positioning, "no counterpart"). Template fields "Market and segment", "Who it addresses", "Problem it solves", "Promise" are the positioning content. Adopting `obviously-awesome` gives a method to fill those fields. Likely synergy, no conflict. Not mentioned in either proposal.
- R2 DEC-9 cuts about 3 to 4 KB from `sales-conversations` and `sales-qualification`, restating Hormozi and Voss. commercial-portfolio does not edit those two skills' bodies except the ladder pointers. Both touch the same two files; the two edits are small and compatible if made in sequence.
- Both modify the same spec: R2 "Modified Capabilities: `sales-method-ownership`: the sales skills point to external method skills" and commercial-portfolio rewrites its requirement "The offer ladder has one owner and one set of names". Two deltas on one spec in two open changes; whichever archives second must rebase.
- New skills the orchestrator must list: none from commercial-portfolio. It adds no skill. The orchestrator would need a row for "proposal for a named package" that points at the package fetch, and the package template as the thing a Meaningfy sales row cites.

### 1.5 Against R3 (delivery-process-and-tools)
- No overlap with the delivery rules, the hand-over note, the tool table or the instruction template. R3 touches `epic-delivery`, `guardrails`, `epic-planning`, `project-setup`, `implementer`, `code-reviewer`, `AGENTS.md`, `CLAUDE.md` (R3 "What Changes"); commercial-portfolio touches none of them.
- One indirect contact: commercial-portfolio is itself an EPIC that will be planned and delivered under the changed rules (two-run gate limit at all sizes, hand-over note per stage, DEC-1, DEC-2). R3 DEC-17 says the four test EPICs and `lean-skills` are delivered after R3; it does not name commercial-portfolio. It would benefit from R3 first but nothing blocks.
- The proposal's own shaping is LARGE and gate-free so far; if it is gated, R3's two-run limit applies (epic-planning step 8).

---

## 2. rules-first-memory

### 2.1 State
- Seed inputs only, no EPIC. `inputs/seed.md` (the owner's words and the diagnosis of 2026-11-11), `inputs/draft-proposal.md` (a delegated draft, parked, not accepted, DEC-1..DEC-12, LARGE in three stages), `inputs/open-questions.md` (Q-1..Q-6, M-1..M-3 open). The STATUS comment says "DRAFT, parked 2026-11-11 as an input"; the owner keeps it as a note to shape later (open-questions.md). The MEMORY index calls it "seeded 2026-11-11 (#192), inputs only".
- What the draft decides (proposed, not accepted): stage 1 setup you can see (a new plain mod `rules-first` with a session-start hook running `rules.py where`); stage 2 rules before memory (a prompt-cue hook that only adds context, a pre-write hook denying `feedback` and `user` auto-memory notes, one policy sentence); stage 3 migration of existing memory notes through one approval card (DEC-1..DEC-12).
- Still open: Q-1 where project-state notes go; Q-2 how auto-memory is restricted; Q-3 hook eagerness; Q-4 where a personal repository authority grant goes; Q-5 how `rule-steward` shows it worked; Q-6 migration for all or once; M-1..M-3 on the owner's first card; unchecked RISK-2 (opencode plugin events) and RISK-3 (memory note format stability). Also the local trial's observations are not yet written down (open-questions.md, last bullet). The draft reverses `rules-in-every-session` DEC-6 on purpose (draft DEC-1).

### 2.2 Touch table (all inferred from `inputs/draft-proposal.md` "What Changes" and "Impact"; none decided)
| Artifact | Change | Basis |
|---|---|---|
| mod, new `mods/rules-first/` | session-start, prompt-submit, pre-tool-use-on-write hooks | draft DEC-2 |
| `hooks.yaml` (14,954 B) | one new intent, several bindings | draft DEC-2 |
| `bundles.yaml`, `tools/bundle_gen/gen.py`, spec `catalogue-governance` | a bundle may hold several plain mods; today one mod per bundle | draft DEC-3; open-questions drafting notes |
| `tools/opencode-plugin.mjs` | the two hooks where opencode events allow; else a recorded gap | draft DEC-12 |
| `tools/repo_lint/lint.py` | only if a check changes | draft Impact |
| skill `rulebook` (27,368 prose; rules.py outside budget) | routing text as a data file; `rules.py where` reports the policy; `rules.py stats` counts rules written; `references/commands.md` (8,641) updated | draft DEC-4, DEC-7, DEC-10 |
| skill `rule-learner` (16,909) | cue list as a data file; a migration procedure under L-1 | draft DEC-4, DEC-8 |
| skill `rule-steward` (10,643) | the new count in its weekly report | draft Impact; DEC-10 |
| `docs/environment/global-prompt.md` (2,043), `docs/environment/rules.md` (11,289), `setup.md`, `dual-cli/compatibility.md`, `docs/development/mods.md`, `hook-bindings.md`, `CHANGELOG.md` | updated | draft "What Changes" |
| specs `rule-learning` (modified), new `rules-first-routing`, `catalogue-governance` | as above | draft Capabilities |
| tests | `tests/test_rulebook.py`, `tests/trigger_probes.yaml`, `tests/features/` including the replay of the 2026-11-11 failure | draft Impact |
| `docs/rules/` | repository rule store; Q-4 is whether a personal grant lands here (recommended: no, the vault) | open-questions.md Q-4 |
| the owner's own files (global CLAUDE.md, auto-memory) | the draft says "no change to any user's settings"; the stage 3 only reads and, on approval, cleans memory | draft No-gos |

### 2.3 Against R1
- `rulebook` is 27,368 bytes of prose, over 24 KB by about 2.8 KB; R1 will cut or justify it. Its `references/rule-model.md` (10,263) and `commands.md` (8,641) are core Meaningfy content (the rule model is Meaningfy's own), so R1 may grant it an exception (R1 DEC-2). Adding stage-2 and stage-3 text to `rulebook` and `rule-learner` before R1 makes the over-budget skill larger; the draft keeps the new routing text and cue list as data files, which is the right shape for R1 (data outside the prose budget, but see R1 "Moving text is not shrinking": a data file that the skill says to always read is not outside).
- `rule-learner` (16,909) and `rule-steward` (10,643) are within budget and have room.
- Text it adds that R1 would cut: the long explanation of why the CLI memory wins and the diagnosis of the three missing setup pieces, if copied into the skills or the global policy. The draft puts the routing text in one data file and has the global policy quote it (draft DEC-4), which is R1's "no repetition inside skillery".

### 2.4 Against R2
- Does R2's "Meaningfy preferences override" duplicate the rulebook? Partly the same job, two mechanisms. R2 DEC-7 states its overrides as fixed text in the orchestrator ("no discount, ... effort-based price frame, ... our qualification scheme and outreach rules ... a guarantee only after the owner's yes; British spelling, no em dash and no contractions in binding text"). The rulebook is the store of the owner's preferences, loaded per activity ("at the start of an activity (writing, offers, reviews, coding, ...) `load` for it", the global policy; `skills/rulebook/SKILL.md`). Several R2 overrides are exactly the kind of thing a rule holds (a preference, scope "offers", strength must). Two consequences. First, if the orchestrator lists them as text, they can drift from the rulebook. Second, R2 itself says "the Meaningfy skill that owns the work" and "the Meaningfy preference that overrides it" (R2 proposal, solution outline 1), and it says "A Meaningfy preference always wins" (DEC-7). Recommendation, as a finding and not as a decision of this study: the orchestrator should name the rule ids that apply (loaded by `rulebook load` for the activity) and keep in its own text only the rows where no rule exists yet; and rules-first-memory is what makes that load reliable. Without rules-first-memory, an override that lives only as a rulebook rule is not loaded when the CLI's memory wins (the seed, finding 1 and 2).
- R2's risk "A loaded external skill of 15 to 30 KB outweighs a one-line override" (R2 RISK-3, accepted) is the same mechanism as the seed's finding 1: "A standing instruction beats a skill description." A hook that adds the rules at activity start (rules-first-memory stage 1) would give the override a stronger channel than the orchestrator's one line. R2 DEC-13 rejects a hook for the orchestrator itself ("No hook, no mod, no change to the navigator" in R2 No-gos), which is compatible: rules-first-memory is a separate mod.
- Personal vs repository rules: R2's overrides are company-wide (a public skill catalogue). A rule in the owner's vault is personal. `docs/rules/P-0001`, `P-0002` are repository rules. The no-discount and effort-based frame belong to the company, so they are skill text or repository rules, not personal vault rules. This limits how far the orchestrator can lean on the rulebook for DEC-7.
- New skills the orchestrator must list: rules-first-memory adds no skill. Its mod is not a skill. Rows for `rulebook`, `rule-learner`, `rule-steward` already exist as part of "every Meaningfy skill" (R2 DEC-3).

### 2.5 Against R3
- `guardrails` Session hygiene (R3 DEC-1) and the instruction template (R3 DEC-12, habits block, size budget) are separate from the rule skills; no direct overlap.
- Shared concern: the global policy text and the template habits block both put routing lines in the agent's instructions. The owner's own global file already carries the rule routing (`/home/lps/.claude/CLAUDE.md`). R3's `AGENTS.md` budget and rules-first-memory's added policy sentence compete for the same instruction space; both are small.
- R3 DEC-13 "No new hook or mod, and no change to the `no-poll-loops` mod". rules-first-memory adds a mod. R3's No-go is scoped to R3; rules-first-memory DEC-3 widens the mod rule of `catalogue-governance`. No contradiction, but whoever writes the R3 text should not state "no mod in the catalogue" as a general rule.
- The hand-over note (R3 DEC-1): a note written at the stage end and read by a fresh session is not a rule and not a memory note; but the owner's habit "mark that permission" (seed) and the stage rule "one session delivers one EPIC" mean rules-first-memory's session-start block runs at the start of each fresh stage session; R3 multiplies the number of fresh sessions, so the session-start context block (draft "Context budget") is paid more often. It must stay a few lines.

---

## 3. delivery-retrospective (to become "retrospective tooling")

### 3.1 State
- Seed only, no EPIC. `inputs/seed.md` (decisions 1 to 17 of 2026-11-14), `inputs/findings-2026-11-14.md`, `inputs/second-pass-2026-11-14.md`, `inputs/cross-check-test-epics.md`, `inputs/scripts/session_digest.py` (16,391 B) and `epic_report.py` (8,167 B). Seed: "No EPIC is shaped yet"; "This folder becomes the retrospective tooling EPIC". Appetite not set; the seed says the elicitation "still owes, for each: the appetite, the test-scenario interview and the risk question".
- Decided (seed decisions): two EPICs, process and tools first (rows 14, 15); the scripts get a new skill with them in `scripts/` (row 17); skills declare phase, stage and review outcome so traces carry them, with proper setup instructions and "every important parameter" traced (row 4); repository and branch stay on the turn, joined by trace id (row 1); no model prices, cost stays relative (row 10, which revises row 2); the plugin's duplicate-turn defect is not reported upstream, the script handles the glitches (row 3); the result line is `harden-checks-and-tests` D-29 (row 13).
- Open: the appetite; the skill's name and bundle; what exactly goes into the trace (the plugin that sends to Langfuse is outside skillery; the seed does not say which tool carries phase and stage into traces); whether the scripts are run when an epic is archived (findings R-11); how phase is read once skills declare it; the five-second cap and the one-third event gap in Langfuse (F-14, "cause not established").

### 3.2 Touch table (all inferred, marked)
| Artifact | Change | Basis |
|---|---|---|
| new skill (name open) with `scripts/session_digest.py`, `scripts/epic_report.py` | durable home for the two scripts, a method for the review ("self-reflection" sessions) | seed decision 17 |
| `tests/` for the scripts (the scripts have `--selftest`) | tests move with them | inferred; session_digest.py docstring mentions `--selftest` |
| bundle assignment in `bundles.yaml`, `make bundles`, `make skill-inventory`, trigger probes | for a new skill | AGENTS.md; inferred |
| skill `epic-delivery` (36,968) | declare stage, task and review outcome in a form a tool reads | seed decision 4; second-pass change 11; findings R-9 |
| skill `epic-planning` (16,698) | declare the phase | seed decision 4; inferred |
| skill `guardrails` (15,670) | possibly the session or phase marker | inferred |
| `docs/environment/langfuse-setup.md` | "proper setup instructions" and the extra trace parameters; PR #232 changed it already (seed decision 5) | seed decisions 4, 5 |
| the Langfuse plugin or a hook that adds attributes | unknown whether skillery owns any code for it; the plugin is external | not determined |
| spec: a new spec for retrospective tooling; possibly `epic-delivery` | inferred |
| the test EPIC `test-suite-care` D-11 consumes the scripts for the cost of a check (cross-check R-11) | consumer, not touched |

### 3.3 Against R1
- The new skill must meet R1's budget from the start (24 KB prose, body near 6 KB, scripts outside). The scripts (24.5 KB together) cost no context if they live in `scripts/`, so a lean skill is easy. It should be written to the lean shape after R1 stage 1 sets the standard and the lint; if written before, it must be re-checked.
- Touched skills: `epic-delivery` is over budget (36,968, over by 12.4 KB); R1 stage 3 (other engineering skills) will cut it. Adding a result-line, stage and phase declaration there before R1 adds text R1 will reshape; add it as short as possible, or after R1's stage for `epic-delivery`. `epic-planning` (16,698) and `guardrails` (15,670) are within budget.
- Text it adds that R1 would cut: a long explanation of the measurement method inside the skill; the findings narrative belongs in `docs/` or the openspec inputs, not the skill body.

### 3.4 Against R2
- The orchestrator (R2 DEC-3: "covers every Meaningfy skill") must list the new skill. Its trigger ("review last two weeks of sessions", "why was the epic slow") sits next to `epic-delivery` and `guardrails`, so it needs a probe against them (R2 rabbit-hole "A description that fires on everything").
- No external skill is involved. `high-output-management` (R2 DEC-6) is a management-metrics skill and could be the external pointer for "self-reflection on delivery" rows; unverified and not in either document.
- R2 DEC-4 gives skills a one-line pointer to the orchestrator; the new skill is a candidate for that line.

### 3.5 Against R3
- What it needs from R3 first: (a) R3's stage boundary and hand-over note (DEC-1) define what a "stage" is in a trace; declaring "stage" in skills before the stage boundary changes means declaring a concept that is about to change. (b) R3 DEC-4 and DEC-5 (severity floor, one fix pass, MEDIUM small set) change the rounds the result line records; the result line itself is in `harden-checks-and-tests` D-29 (R3 DEC-17 and No-gos: "no result line ... and no phase or stage in the traces. Those belong to `harden-checks-and-tests` D-29 and to the retrospective tooling EPIC"). So the retrospective tooling EPIC depends on both R3 and `harden-checks-and-tests` D-29 for the line format; it can only fix its parser once the line exists.
- R3's No-gos also say "No change to the two retrospective scripts and no new home for them. They are used as they are to measure." So R3 will use the scripts from `openspec/changes/delivery-retrospective/inputs/scripts/`. If the retrospective tooling EPIC moves them to a skill before R3's acceptance measurement, the path R3's acceptance points to changes. Keep the scripts in place until R3 is accepted, or have R3's PLAN record the path as a parameter.
- What R3's acceptance needs from it: R3 "succeeds when ... the first call of an implementer and of a main session is measured smaller than before ... and the next EPIC delivered under the new rules shows no session holding two stages and no PLAN with a third gate run, with the lead's peak context reported against the old runs." These are measurements by the scripts (session_digest.py reads sessions, subagents and events; epic_report.py gives per-epic signals including `compact` counts and phases). R3 can run them as they are, but phase is a guess from the last skill loaded (findings "Phase is a guess"; epic_report.py `SKILL_PHASE` regex), "no session holding two stages" is not directly readable until stage is declared. So R3's acceptance partly needs the retrospective tooling's declared stage, or must infer stage from the hand-over note files. That is a loop: R3 first, the scripts as they are; the declared stage later.
- Also R3 DEC-14 and its closing sentence: "the next retrospective measures whether they did" (habits). The retrospective skill is the instrument.

---

## 4. Order

Facts used: R3 DEC-17 "This EPIC is delivered before `lean-skills` and before the four test EPICs." R2's elicitation suggests `lean-skills` stage 1, then R2, then the remaining `lean-skills` stages (orchestrate-external-skills/inputs/elicitation-2026-11-14.md, "What the owner has to settle", item 2), and that the sales cut is done once, in R2.

| Change | Must be delivered before it | Must precede | Free or not | Reason |
|---|---|---|---|---|
| commercial-portfolio | R2's sales cut, ideally (both edit `sales-conversations`, `sales-qualification`, spec `sales-method-ownership`); R1 stage 1 only for the format of any new text; the owner's Luxembourg SME package (input, outside git) | R1 stage 5 for the coach and the sales skills | Not free of R2 and R1; free of R3 | Moving package facts out of the coach before R1 reassesses it means R1 sorts a smaller coach once; the same spec and the same two sales skills are edited by R2 |
| rules-first-memory | Nothing in R1, R2, R3 blocks it. It needs the owner's answers to Q-1..Q-6 and an EPIC, which do not exist | R2 only if the orchestrator wants rule ids instead of override text; R1 stage 3 if `rulebook` must be cut first | Largely free | It touches the rule skills (no refactoring EPIC deals with them first), a mod, hooks, bundle generator and docs; R1 touches `rulebook` only for size; the hook mechanism does not overlap R3 |
| delivery-retrospective (tooling) | R3 (stage boundary, hand-over note) and `harden-checks-and-tests` D-29 (result line) | `test-suite-care` (D-11 uses the scripts for a check's cost); R3's own acceptance measure only partly | Not free: ordered after R3 | A declared stage and result line have no meaning until the stage boundary and the line exist; but R3's acceptance can use the scripts unchanged |

Notes on R3 versus the other two: R3 touches no skill the commercial-portfolio or rules-first-memory touches, so R3 does not need to wait for them.

## 5. Conflicts and dependencies worth the owner's attention
1. Package price basis versus R2's override: commercial-portfolio's template allows any pricing basis ("fixed, per stage, per person"), R2 DEC-7 makes the effort-based frame win over value-based pricing and R2 adopts `monetizing-innovation` (packaging tiers). One of the two PLANs must say who sets a package's price.
2. The coach: 57 KB, over R1's budget; commercial-portfolio splits `engagement-lifecycle.md`; R1 stage 5 rewrites the whole skill; R2 cuts negotiation prompts out of the coach (study line 117). Three passes over the same skill: one order fixes them.
3. R2's fixed override text versus the rulebook: R2 states preferences as skill text; the rulebook is where preferences live and rules-first-memory is what makes it load reliably. Same spec `sales-method-ownership` is modified by both R2 and commercial-portfolio.
4. delivery-retrospective needs R3 (stage boundary) and `harden-checks-and-tests` D-29 (result line); R3's acceptance needs measurement the retrospective tooling later improves; R3 says the scripts stay where they are until it is done.

## 6. Not read, not determined
- Not read: the full text of the three refactoring EPICs' specs/ folders beyond `skill-orchestration/spec.md`; `lean-skills` inputs and its spec delta; `harden-checks-and-tests` D-28 and D-29 (read only through citations in R3 and the seed); the full `second-pass` and `findings` files (read in part: the first and last portions); the scripts' source (skimmed head and a grep only); `engagement-model.md`, `decision-package`, `proposal-writing` and coach SKILL.md bodies (read headings and grep hits, not all text); the specs `engagement-model` and `sales-method-ownership` beyond requirement titles; `docs/rules/` file contents (listed only: P-0001, P-0002); `rulebook/SKILL.md` and `rules.py` (sized, not read in full); `docs/environment/rules.md`, `global-prompt.md`, `hooks.yaml` (sized only).
- Not determined: where the package template will live; whether `proposal-writer` and `sales-agent` agents change under commercial-portfolio; which tool carries phase and stage into the Langfuse traces and whether skillery owns code for it; whether opencode supports the rules-first hooks (draft RISK-2); the appetite of the retrospective EPIC; whether R1 will grant `rulebook` an exception; whether the orchestrator will cite rule ids; any listed byte counts for non-md files (scripts, assets) outside the budget; the exact line counts of passages each refactoring EPIC would cut.
