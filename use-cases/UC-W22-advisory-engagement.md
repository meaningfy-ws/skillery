---
id: UC-W22
title: Advisory engagement
primary_actor: a Meaningfy consultant
trigger: a client needs advice on a decision about their data, semantics or architecture
success_guarantee: the client has a decision package they can act on, framed for their executives
area: consulting
served_by:
  agents: []
  skills:
  - semantic-consulting-coach
  - decision-package
  - executive-communication
status: partial
change: add-advisory-agent
---

# UC-W22 Advisory engagement

## Brief Description

An advisory engagement: coaching a client through a decision, from discovery to a decision package and its executive framing. The skills exist; no agent leads the engagement.

## Stakeholders and Interests

- **The consultant:** a safe path through the engagement without improvising method.
- **The client's decider:** decision-readiness: what to do next, why, what success looks like and
  what comes later.
- **The client's executives:** the recommendation in a form they can act on.
- **The owner:** the free and paid line held, the scope protected, no silent overrun.
- **The build tier:** a ready-to-contract execution brief.

## Preconditions

A paid Discovery & Onboarding engagement is agreed as a discovery workshop or a Proof of Value; presale is over. The
deciding persona is known, and the consultant has access to the client's people and documents.

## Minimal Guarantees

Nothing reaches the client without the consultant. A technique with no owning skill (Wardley mapping,
the maturity assessments, process modelling) is named as missing, never improvised under the Decision
Package's name. If the agreed outcomes cannot be reached in time, one of the three safeguards is
proposed: a scope reduction, a short extension, or a formal stop with partial delivery.

## Main Success Scenario

1. The consultant opens the engagement with its tier and the client's situation.
2. The agent runs intake: the deciding persona, the problem in the client's situation and the
   measurable outcome.
3. The agent reads the landscape: the data estate, governance maturity and legacy constraints.
4. The agent selects the methods; gap analysis is always in scope.
5. The agent runs the gap analysis, frames the options with their trade-offs, sequences the chosen
   one from pilot to scale and decides buy, build or defer per capability.
6. **[human]** The consultant and the client's decider choose the option.
7. The agent assembles the Decision Package and frames it for the executives.
8. **[human]** The consultant reviews the package and hands it, with its execution brief, to the
   client.

## Extensions

- 1a. The client is still asking "is this relevant to us?": this is presale; the agent holds the free
  and paid line and hands back to sales (UC-W10).
- 1b. It is a discovery workshop: the engagement is a one or two day workshop, and the output at 7 is an
  expert read and a strategic roadmap, not a full Decision Package.
- 4a. Intake needs a technique with no owning skill: the agent says so plainly, and the consultant
  tells the client.
- 5a. Stakeholders are unavailable or information arrives late: the agent proposes the three
  safeguards, and the consultant decides at 6.
- 8a. The client wants to build with Meaningfy: the execution brief goes to sales for a build
  proposal (UC-W8).

## Out of Scope

Selling the engagement (UC-W10, UC-W8), pricing (UC-W12), a formal maturity assessment (a separate
service), and building or delivering the solution (UC-W18, UC-W23).

## Artefacts

- The Decision Package (Markdown; owned by `decision-package`): recommendation, in and out scope,
  pilot-to-scale roadmap, buy, build or defer decisions, execution brief; in the engagement's working
  folder, read by the client's decider and the build tier.
- The executive message or summary (`executive-communication`), read by the client's executives.
- Planned: the advisory lead agent (`add-advisory-agent`).

## Evidence

- Trigger probes for the three skills in `tests/trigger_probes.yaml`, and the trigger set
  `tests/evals/triggers/executive-communication.json`.
- The package passes the five-part completeness check in `decision-package` (checked by reading);
  no consulting Definition of Done exists yet (`docs/practice/ai-consulting/consulting-dod.md`).
- Planned: Gherkin scenarios and an outcome suite from a recorded engagement (`add-advisory-agent`).

## Feedback Loop

`decision-package` is provisional until the first real paid engagement; that engagement's lessons
refine it. A miss (a package the client could not act on, a step the agent skipped) becomes a Defect
issue and ends as a fix in the owning skill or a scenario in the agent's feature file.

## Slices

1. The consultant uses the skills directly: released (`semantic-consulting-coach`,
   `decision-package`, `executive-communication`).
2. An advisory lead agent runs the engagement along the advisory runbook: planned
   (`add-advisory-agent`).

## Open Points

**Confidence:** medium. The steps restate `docs/practice/ai-consulting/advisory-runbook.md` and the
released skills; the agent's shape and its test material are not decided.

- Which past or current engagement can be recorded as the agent's test?
- Is the agent a lead that runs the whole runbook, or a partner the consultant calls step by step?
- Does the same agent serve the discovery workshop, or only the Proof of Value?
