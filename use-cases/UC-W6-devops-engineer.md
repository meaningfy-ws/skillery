---
id: UC-W6
title: DevOps engineer
primary_actor: a Meaningfy engineer responsible for infrastructure
trigger: infrastructure needs building, a daily review is due, or an intervention is needed
success_guarantee: the infrastructure, CI/CD and monitoring follow the Meaningfy way, and every intervention is reviewed and recorded
area: operations
served_by:
  agents: []
  skills:
  - ci-cd-delivery
  - meaningfy-release
status: partial
change: add-devops-bundle
---

# UC-W6 DevOps engineer

## Brief Description

DevOps engineer: the Meaningfy way of infrastructure, CI/CD, monitoring, daily reviews, interventions; also developing, testing, operationalising and monitoring new infrastructure stacks. "I need this badly." Materials exist outside the repo; the change is drafted.
The boundary is operations against delivery: `ci-cd-delivery` owns how a change reaches an
environment; the planned devops skills own how environments exist and stay healthy.

## Stakeholders and Interests

- **The DevOps engineer:** environments built and changed the same way every time, and an
  intervention they can defend afterwards.
- **The developers:** a working path from merge to a running environment, without asking.
- **The owner:** systems that stay up, costs that stay known, and no secret leaked.
- **The clients:** their environments healthy and an incident explained.

## Preconditions

The engineer has access to the infrastructure repositories (Terraform, Ansible) and to the
monitoring (Prometheus, its alerts by email and Slack). Credentials and host inventories stay in
those repositories and the engineer's own tooling, never in a skill or agent.

## Minimal Guarantees

Nothing is applied to an environment without the engineer's consent; a failed or abandoned
intervention leaves the environment as it was or as recorded; no secret, host or credential is
written into a skill, an agent or a report.

## Main Success Scenario

1. The engineer states the need: a new environment or stack, the daily review, or an intervention
   on an alert.
2. The agent reads the relevant infrastructure code, the delivery setup and the recent alerts.
3. The agent states its view of the current state and the plan of change.
4. **[human]** The engineer agrees the plan, or amends it.
5. The agent prepares the change as infrastructure code and a dry run, never a manual edit on a
   host.
6. **[human]** The engineer reviews the dry run and applies it.
7. The agent checks the environment is healthy afterwards against the monitoring.
8. The agent records the intervention: what changed, why, and how it was verified.

## Extensions

- 1a. The need is a deploy of a new version: it is delivery, owned by `ci-cd-delivery`; the agent
  follows that standard rather than an operations path.
- 2a. The infrastructure code and the live environment disagree (drift): the agent reports the
  drift first, and the engineer decides whether to reconcile it before the planned change.
- 5a. The change needs a secret or a credential: the agent names where it is expected and asks the
  engineer to provide it out of band; it never writes the value.
- 6a. The dry run shows destruction the plan did not state: the agent stops and returns the
  difference; the use case restarts at 3.
- 7a. The environment is unhealthy after the change: the agent proposes a rollback or a fix, and the
  engineer decides (back to 4).

## Out of Scope

Building, versioning and releasing an application (UC-W18, through `ci-cd-delivery` and
`meaningfy-release`); choosing new infrastructure tooling or an observability vendor; reading
Prometheus alerts unattended (a planned `scheduled` agent, a follow-up of `add-devops-bundle`);
offering devops as a service to clients (UC-W8).

## Artefacts

- The infrastructure change as Terraform or Ansible code, in the infrastructure repository, read by
  the engineer and the reviewer.
- The intervention record (what, why, how verified), read by the engineer and the owner; its form
  and home are not decided.
- The runbook a system needs, kept with that system, not in skillery.
- Planned: the devops skills and agent in a `meaningfy-devops` bundle (`add-devops-bundle`).

## Evidence

- Planned: a Gherkin feature for the devops agent under `tests/features/agents/`
  (`add-devops-bundle`).
- Planned: one real run on a Meaningfy repository as the acceptance test (`add-devops-bundle`).
- Today only the delivery side is checked: the trigger probes for `ci-cd-delivery` and
  `meaningfy-release` in `tests/trigger_probes.yaml`, run by `make validate`.

## Feedback Loop

An intervention the engineer had to redo, or a step the agent should have checked, becomes a Defect
issue (`.github/ISSUE_TEMPLATE/defect.yml`); it ends as a fix in the owning devops skill, or in
`ci-cd-delivery` when the miss was on the delivery side. Incident retrospectives feed the same loop
(`docs/development/lessons-loop.md`).

## Slices

1. Deliver a change to an environment: released (`ci-cd-delivery`, `meaningfy-release` in
   `meaningfy-building`).
2. Build and change environments as code, daily review, interventions: planned
   (`add-devops-bundle`).
3. Read alerts in the background: planned, a follow-up named by `add-devops-bundle`.

## Open Points

**Confidence:** medium. The steps extrapolate from the brief and the drafted change; the devops
package that defines the real method is not yet in `add-devops-bundle/inputs/`.

- What does the daily review cover, and what does it produce: a note, a ticket, a Slack message?
- Where does an intervention record live (the infrastructure repository, Confluence, Jira, the
  vault)?
- Which interventions may the engineer apply alone, and which need a second person?
- Is "developing new infrastructure stacks" the same agent as daily operations, or a second one?
