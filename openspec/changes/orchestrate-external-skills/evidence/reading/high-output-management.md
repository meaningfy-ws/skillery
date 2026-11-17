# Reading: high-output-management
Fork `meaningfy-ws/wondel-ai-skills` at `c5265583b1a9740f06831e1d3e89b35bba3eb430`, read in full on 2026-11-16 by reader G.

| File | Bytes | What it adds |
|---|---|---|
| `SKILL.md` | 20,628 | Frontmatter and Grove's frame: a manager's output is the team's output; production principles, paired indicators, managerial leverage, meetings, decisions and OKRs, task-relevant maturity and reviews; a 0-10 score, common mistakes and an eight-row diagnostic. |
| `references/indicators-and-production.md` | 13,182 | The breakfast-factory analogy for software teams, finding the limiting step, inspecting early, choosing four to six indicators with quality pairs, leading and trend indicators, the stagger chart, the operation review and rules against gaming. |
| `references/leverage-and-calendar.md` | 12,891 | A one-week time log, the five kinds of managerial activity, scoring leverage, high and negative leverage lists, a delegation protocol, monitoring depth by maturity, calendar redesign, interruptions and a Friday re-audit. |
| `references/meetings-and-one-on-ones.md` | 12,514 | Process and mission meetings, the one-on-one (owner, length, cadence by maturity, agenda template, hold list, notes, remote), the staff meeting and operation review agendas, decision meetings and when to kill a meeting by its cost. |
| `references/decisions-planning-okrs.md` | 13,221 | The three-stage decision (open debate, clear call, full support), a six-question decision brief, deciding at the lowest competent level, countering peer-group hesitation, three-step planning, OKR construction, a worked cascade and pitfalls. |
| `references/case-studies.md` | 15,205 | Three cases (a new manager buried in meetings, velocity bought with quality, a performance review repaired) and five takeaways. |

Total read: 87,641 bytes.

## Goals it serves
Running a team as a manager: deciding where a manager's hours create the most output, setting up
one-on-ones and a staff meeting, choosing team indicators that cannot be gamed alone, delegating
with a stated monitoring plan, preparing a contested decision, running a planning cycle or OKRs,
and preparing a performance review. Meaningfy has no house rule for management (DEC-10), so it is
used as it is. It is not for planning or delivering an EPIC (`epic-planning`, `epic-delivery`),
not for a client estimate (`estimation`), and not for the decision card an owner reads alone
(`executive-communication`).

## Conflicts with Meaningfy rules
| # | Their advice (file, heading, line) | The Meaningfy rule it meets (owner skill) | Named in DEC-7, DEC-19 or DEC-20? |
|---|---|---|---|
| 1 | A decision is framed in a six-question brief (what, by when, who decides, who is consulted, who ratifies, who is informed) sent before the meeting (`references/decisions-planning-okrs.md`, "The Decision Brief: Six Questions", lines 26-60; `SKILL.md`, "5. Decisions and Planning", line 138). The brief carries no recommendation and no options with consequences. | A decision the reader takes later and alone goes in the decision card: question, deadline, recommendation, options with consequences, graded facts (`executive-communication`, `SKILL.md`, "Rules", lines 69-72). | not named |
| 2 | Its agenda templates and prose model em dashes and American spelling (`references/meetings-and-one-on-ones.md`, "The Subordinate's Agenda", line 55; `SKILL.md`, introduction, line 12). | British English and no em dash in every produced artefact (`meaningfy-voice`, `references/company-voice.md`, lines 15-16). | DEC-7, for binding text only |

Checked and not counted: OKRs and quarterly cascades (`references/decisions-planning-okrs.md`,
"Writing OKRs Grove-Style", lines 98-111) and sprint forecasts in story points kept in a stagger
chart (`references/indicators-and-production.md`, "The Stagger Chart", lines 97-108) meet no rule
on the list: `estimation` prices client work in person-days, and the appetite of `epic-planning`
(outside the list) does not forbid a team's own forecast. The meeting-cost sum with an hourly rate
(`references/meetings-and-one-on-ones.md`, "Meeting-Cost Math", lines 141-147) is an internal cost,
not an offering price, so DEC-19 is not engaged. A named decider and a written decision
(`references/decisions-planning-okrs.md`, "The Ideal Decision Process", lines 18-22) agree with
`architecture`'s one ADR per significant decision. Inspecting specs before the build
(`references/indicators-and-production.md`, "Inspect at the Lowest-Value Stage", lines 48-66)
agrees with the clarity gate. No rule in `docs/rules/` applies.

## Trigger overlap
`epic-planning` ("running planning", "planning cycle"); `epic-delivery` and the `team-lead` agent
("delegation", monitoring a team's work, which an agent-team prompt may also say);
`executive-communication` (preparing a decision for someone else); `test-strategy` only at the edge,
through "designing team metrics". Its description also points to the external `drive-motivation`
and `traction-eos`.

## Fallback sentence (draft)
If `high-output-management` is not installed, offer `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/wondel-ai-skills#c5265583b1a9740f06831e1d3e89b35bba3eb430 --skill high-output-management --agent claude-code --global --yes` (the opencode command is in `assets/install.md`); if the person declines, carry on without it (Meaningfy has no management skill) and say once that the management guidance was not used.
