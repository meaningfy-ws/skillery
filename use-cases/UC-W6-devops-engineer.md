---
id: UC-W6
title: DevOps engineer
primary_actor: a Meaningfy engineer responsible for infrastructure
trigger: infrastructure needs building, a daily review is due, or an intervention is needed
success_guarantee: the infrastructure, CI/CD and monitoring follow the Meaningfy way, and every intervention is reviewed and recorded
area: operations
served_by:
  agents:
  - devops-engineer
  - ops-watch
  - infra-reviewer
  skills:
  - ci-cd-delivery
  - meaningfy-release
  - infrastructure-operations
  - stack-operations
  - service-reliability
  - infrastructure-security
  - skillery-feedback
status: partial
change: add-devops-bundle
---

# UC-W6 DevOps engineer

## Brief Description

DevOps engineer: the Meaningfy way of infrastructure, CI/CD, monitoring, daily reviews, interventions; also developing, testing, operationalising and monitoring new infrastructure stacks. "I need this badly."
The engineer is often the owner or a colleague who is not a devops specialist, working with the
`devops-engineer` agent; `ops-watch` runs the daily check-up and answers alerts alone.
The boundary is operations against delivery: `ci-cd-delivery` owns the application repository up to
a published image and a deploy request; the devops skills own everything from the request onward and
how environments exist and stay healthy.

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
- 5a. The change needs a secret or a credential: the agent pipes it from the engineer's `bw`
  session into the command that uses it; it never sees, prints or writes the value.
- 6a. The dry run shows destruction the plan did not state: the agent stops and returns the
  difference; the use case restarts at 3.
- 7a. The environment is unhealthy after the change: the agent proposes a rollback or a fix, and the
  engineer decides (back to 4).

## Out of Scope

Building, versioning and releasing an application (UC-W18, through `ci-cd-delivery` and
`meaningfy-release`); choosing new infrastructure tooling or an observability vendor; building the
unattended runtime and its allow-listed operations (a follow-up in `infrastructure-stacks`, contract
in `docs/environment/devops-agents.md`); offering devops as a service to clients (UC-W8).

## Artefacts

- The infrastructure change as Terraform or Ansible code, in the infrastructure repository, read by
  the engineer and the reviewer.
- The intervention record (what, why, how verified): a PR, or a GitHub issue in
  `infrastructure-stacks`; incidents and parked actions are issues there too; read by the engineer
  and the owner.
- The daily check-up report, in `#infra-alerts` and on the pinned `Daily check-up log` issue.
- The runbook a system needs, kept with that system, not in skillery.
- The devops skills and agents in the `meaningfy-devops` bundle.

## Evidence

- Gherkin features for the three agents under `tests/features/agents/`, run by hand.
- The stack check and the unattended-action decider, tested in `tests/test_devops_check_stack.py`
  and `tests/test_devops_action_policy.py`, run by `make validate`.
- The owner's hand-runs IT-1..IT-4 on the real repositories (`add-devops-bundle`, task 7.2).
- The trigger probes for the devops skills, `ci-cd-delivery` and `meaningfy-release` in
  `tests/trigger_probes.yaml`.

## Feedback Loop

An intervention the engineer had to redo, or a step the agent should have checked, becomes a Defect
issue on skillery (`.github/ISSUE_TEMPLATE/defect.yml`), drafted with `skillery-feedback`; it ends as a fix in the owning devops skill, or in
`ci-cd-delivery` when the miss was on the delivery side. Incident retrospectives feed the same loop
(`docs/development/lessons-loop.md`).

## Slices

1. Deliver a change to an environment: released (`ci-cd-delivery`, `meaningfy-release` in
   `meaningfy-building`).
2. Build and change environments as code, daily review, interventions: this change
   (`add-devops-bundle`, `meaningfy-devops`).
3. Read alerts in the background: this change for the agent and its policy (`ops-watch`); the
   runtime that triggers it is a follow-up in `infrastructure-stacks`.

## Open Points

**Confidence:** high. The owner answered the shaping questions on 2026-10-27
(`add-devops-bundle/inputs/2026-10-27-D-shaping-qa.md`).

- The daily review is the `ops-watch` check-up: a fixed list of checks, posted in `#infra-alerts`
  and on a pinned GitHub issue (`service-reliability`, `references/daily-checkup.md`).
- Intervention records live in `infrastructure-stacks`: a PR when code changed, otherwise an issue;
  notable changes add a line to the Confluence change log.
- Alone or with a second person: an `infra-reviewer` subagent reads every infrastructure change; the
  person consents with a card; unattended, only the actions the policy marks act are taken.
- One interactive agent (`devops-engineer`) and one watch (`ops-watch`); new stacks are developed by
  the interactive agent from the stack template.
- Open: where the unattended watch runs (a dedicated server, a Claude scheduled task, or another
  runner).
