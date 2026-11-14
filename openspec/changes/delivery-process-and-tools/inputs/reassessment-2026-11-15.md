# Reassessment of the open EPICs against the three refactoring EPICs

**Status:** secondary input, never groomed. Recorded on 2026-11-15. It concerns every open change
and is kept here because this EPIC goes first. The readers' touch maps are in
[`touchmaps/`](touchmaps/).

Short names: **R1** `lean-skills`, **R2** `orchestrate-external-skills`, **R3**
`delivery-process-and-tools`; **B** `harden-checks-and-tests`, **C** `activity-test-profiles`,
**D** `generic-task-test-profiles`, **E** `test-suite-care`.

## What the owner asked

> bu then there are a few otehr epics planned as well, which might be good to analyse before we do
> such a massive refactoring [...] plan reassessing theose epics and come with suggestions

> but do you see any oportunities to merge combne, drop, modify any of the existent epics?

> proceed and do not hersitate to go a bit deeper to underatdn and make sure the otehr epics do not
> conflict and are really needede, and how this fundamental refactoring interplays with them

## Settled by the owner on 2026-11-15

| # | Point | Settled |
|---|---|---|
| S-1 | B adds a "checked by" note to the ten clean-code and SOLID bullets of `cosmic-python`; R1 would remove the bullets. | The bullets stay, as short catalogue entries each tied to its check. |
| S-2 | E sorts the tester's tests in the fix step; R3 allows one fix pass. | The sort is part of that one pass, before the gate run that checks it. |
| S-3 | Who sets a package's price: `commercial-portfolio` has a price field, R2 brings external pricing skills. | The commercial offering document does. The owner's words are below. External skills inform, they never set a price. |
| S-4 | C adds Vale checks to `technical-writing`; R2 routes it to an external documentation skill. | Meaningfy voice, with Vale as the check; the external skill is guidance only. |
| S-5 | D gives its reader its own tool list; R3 has one tool table. | D cites the table (R3 DEC-8). |
| S-6 | Four EPICs edit the stage loop of `epic-delivery`. | R3 owns every change to the stage loop: the tester condition (was B D-28), the result line (was B D-29), the review set at MEDIUM, the fix rule, the stage boundary. B, C and E cite R3 and drop their own edits of those paragraphs. |
| S-7 | R1 both registers dependencies and shrinks skills. | R2 owns what skillery depends on and how it points there: both forks, the register, the routing. R1 only cuts. |
| S-8 | The retrospective tooling seed lists the result line. | The line is R3's (S-6). The tooling EPIC keeps the skill for the scripts, and phase and stage in the traces. |
| S-9 | New prose for skills in B and E (about 50 to 60 KB by estimate). | Sorted by the lean rule before it is written: a check becomes a tool or a template; a skill stays within 24 KB of prose with a body near 6 KB; no example code copied into a skill. |
| S-10 | Revising a gated PLAN. | No new gate run. The revision is recorded in the PLAN as made after the gate, as on 14 November. |

On S-3, the owner:

> ok packaging and commercial pricing, i'm thinking to have prepared commercial offerings
> descriptions somewhere, likely in drive and those will be structured sandrad and be groomed and
> kept as seed for any discusison and any sales (because each such a commercial offering will
> describe the whole context), bu just like for teh lawyer bundle we have a repo where we keep all
> our contarcts terms and templates, and the skills are geeric, and operate on that repo, we will
> have repos/or drive fodlers with commercial offerings and ththe skills will be operation on thse,
> and then in reltion to poeple

## Order

The order replaces the waves of 14 November. Inside the test EPICs the old order holds: B1, B2,
then C and E1, then B3.

| Wave | In parallel | Why here |
|---|---|---|
| 1 | R3 · R1 stage 1 (the standard, its lint, the five practices) · B's tool side (the `quality/` folder, Ruff, Semgrep, the Makefile template) | R3 and R1 stage 1 set the rules the rest is written to. B's tool side adds no skill prose. |
| | release | |
| 2 | R2 stage 1 (register both sources), then the R1 pilot on `cosmic-python` with the owner's checkpoint · D · shape `rules-first-memory` and the retrospective tooling | The pilot names dependencies, so they are registered first. D needs only the delivered test strategy and R3's tool table. |
| 3 | The rest of R2 · B's prose side and B stage 2 · E stage 1 | All write new skill text, so they follow the lean standard; B's prose follows the pilot. |
| 4 | C · `commercial-portfolio` · the retrospective tooling · E stages 2 and 3 | C waits for B. `commercial-portfolio` shares the sales skills and a spec with R2. |
| 5 | The remaining R1 stages, one domain at a time; then B stage 3 and the closing check | Each skill is rewritten once, after everything that adds to it has landed. |

## Is each open change still needed

Checked on 2026-11-15, after the owner's "make sure the other epics [...] are really needed".

- **`rules-first-memory`: needed, and smaller than drafted.** The agent had guessed it was mostly
  delivered; the audit
  ([`audit-2026-11-15.md`](../../rules-first-memory/inputs/audit-2026-11-15.md)) shows almost none
  of it is: no rules mod, no rule hook, and the line that keeps preferences out of the CLI's
  memory exists only in the owner's private instructions. The audit puts what is left at MEDIUM,
  not the drafted LARGE. It also advised against citing rule ids from the orchestrator (R2
  DEC-18). It edits the instruction template, as R3 does, so the two are not delivered in the same
  wave.
- **`commercial-portfolio`: needed.** The owner restated its core on 2026-11-15 (its DEC-9 and
  DEC-10).
- **B, C, D, E:** each was revised by a reader who also listed what looks overtaken. Their lists
  are in the section below; nothing was dropped without the owner.

## Candidate drops reported by the readers

Each reader revised one EPIC and listed what looks overtaken or of doubtful value. Nothing below
was removed. The readers' reasons are short; each item needs the owner's yes before it goes.

| EPIC | Candidate | Reason given |
|---|---|---|
| B | Task 1.11, the external-source manifest and its script | The PLAN lets the manifest ship empty: machinery with perhaps no user. |
| B | Task 1.9 ls-lint, task 1.10 checkmake | A pinned binary to ban six file names; required files and targets are already tested another way. Weigh ls-lint with C, which reuses it. |
| B | Task 1.8, report-only rules | Their noise is rated high (RISK-2) and they never gate. |
| B | Tasks 3.5 and 3.6, weekly mutation runs | Nobody is named to read them (RISK-4, accepted), and a lock conflict is unresolved. |
| B | D-24, old brief against new brief; D-25, the lead reads mutation results | Extra runs and a lead duty, against R3's fewer rounds and smaller lead. Both were never confirmed. |
| B | Tasks 2.1 and 3.1, re-walks of the delivered strategy | Already walked once; keep as a rebase check only. |
| C | Stages 4 and 5 as nine tasks | Expected to record accepted gaps only; could be one task group or one PR. |
| C | Task 2.8, four baseline runs for a seven-line rule | Heavy for what it proves. |
| C | D-33, a release after stages 1 and 3 | Overlaps the normal release flow. |
| D | Baseline tallies O-1 to O-4 and their cost sign-off | They show the steps happened, not that they helped; only O-5 shows effect. |
| D | Task 2.9, a behavioural trigger evaluation for `meaningfy-voice` | Static probes meet the repository's rule. |
| D | DEC-9 and DEC-10, the `Agent` tool on the sales agent | Separable; it changes scheduled runs and could be its own small change. |
| D | The sales profile | The weakest of the profiles; overlaps the recipient reader; could fold into the executive-communication profile. |
| D | Role-name allow-lists in its test | Duplicate the ownership tripwire; R1 rewrites may trip them. |
| E | Stage 2, UI suites | No trial repository, no owner for the UI rules (issue #230), and the rules restate public documentation. Defer until a repository is named. |
| E | Stage 3 | Partly repeats D's planted-flaw proof; its cost numbers need the scripts to have a home. Better after the retrospective tooling. |
| E | Task 3.7, the closing check | B stage 3 now lands last, so the check belongs there. |
| E | The sources table and rules 17 to 21 of task 1.6 | Published test-smell knowledge; keep the one-line rules. |

## Questions the revisions left open

1. **R3, tester findings and the floor.** Does the severity floor of R3 DEC-4 apply to the
   tester's findings? Suggested: yes; a failing test under the floor is deleted with the reason
   "under the floor".
2. **R3, what "names an invariant" means.** Any row of a PLAN's `## Invariants`, or only rows
   whose test is the tester's? Suggested: the latter, which is C's convention.
3. **E, a stage with nothing above the floor** still has tests to sort. Suggested: the sort is then
   the whole fix pass. And a deletion the lead does not confirm is restored by the builder in the
   same pass.
4. **C, the scrub re-read after review commits** (it guards against a public leak) against R3's
   "no verifier round after the fix pass". Suggested: keep it.
5. **C, Vale rules.** S-4 says the rules follow Meaningfy's voice; C's no-go keeps "no Meaningfy
   own Vale rules" (issue #212). Read as: external rule packages, each marked against the voice.
   Suggested: keep #212 deferred.
6. **B, the register.** B adds six tool entries to `dependencies.yaml` in wave 1, before R2, which
   owns the register. Suggested: they stay in B; they are tools, not skills.
7. **B, two check messages** cite skill text that arrives two waves later. Suggested: allow those
   few lines of skill text on the tool side.

## Answered by the owner on 2026-11-15

Shown the four questions that mattered most, the suggested drops and the rest of this file, the
owner answered "I agree, go ahead", and then "proceeed with reconciliation pull, merge prs, combine
them all into develope". So:

- All seven questions above are settled as suggested. Questions 1 and 2 are written into R3 (DEC-4
  and DEC-3); 3 into E; 4 and 5 stand as C already has them; 6 and 7 into B.
- Dropped or moved, from the table of candidates: E stage 2 (UI suites) is deferred until a
  repository is named; E stage 3 moves after the retrospective tooling; B's weekly mutation runs
  (tasks 3.5 and 3.6, with D-25) are dropped; D's baseline tallies O-1 to O-4 and their cost
  sign-off are dropped.
- What followed from the drops: B registers five tools, not six (mutmut went with the weekly
  runs); B's stage 3 is the import-contract check only and gains the programme's closing check,
  handed over by E; E's skill cap falls to 16.5 KB; D's proof of done is the owner's judgement of
  the kept pairs.
- Added the same day, the owner's proposal that planning belongs to shaping: R3 DEC-19.
- Every other candidate stays for now and is looked at again in its own EPIC's delivery session.
- `lean-skills` was merged (PR #236).

## Limits

The revisions were made by one reader per EPIC and checked by the spine validation and the lint,
not by a second reader of each PLAN. R1, R2 and R3 have no PLAN, so the test EPICs cite decisions
whose final wording does not exist yet. Sizes of new prose are the readers' estimates. No
clarity-gate run followed (S-10).

## Not done

- No two whole EPICs are merged. C and D are both gated and touch different skills.
- `commercial-portfolio` is not merged into R2: one holds Meaningfy's own offerings, the other
  points to external method.
- R1 stays one EPIC, by the owner's earlier choice.
