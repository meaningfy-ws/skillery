# Reading: release-it
Fork `meaningfy-ws/agent-rules-books` at `893a88a6fce3a80c565bf39ac65021b43a8b2990`, read in full on 2026-11-15 by reader A.

| File | Bytes | What it adds |
|---|---|---|
| `SKILL.md` | 694 | Frontmatter and a short entry pointing to the mini set, with the full text for harder reliability trade-offs. |
| `release-it.md` | 13,542 | The full rule set: production readiness as design, mandatory timeouts, bounded retries with backoff, circuit breakers and bulkheads, back pressure, bounded queues and load shedding, stability patterns, restartable automation, resource budgets, untrusted data at boundaries, logs, metrics and health checks, incidents and runtime controls, startup and deployment, chaos work with limits, API failure semantics, caches, scheduled work, tests and forbidden patterns. |
| `release-it.mini.md` | 6,372 | The working version: fifteen decision rules, seven triggers and an eight-question final check. |
| `release-it.nano.md` | 2,205 | A compact reminder: bound everything, retry with discipline, isolate failure, stay observable and stoppable. |

Total read: 22,813 bytes.

## Goals it serves
Making a service survive production: putting explicit time limits on outbound calls, deciding when a
retry is safe, isolating a failing dependency, bounding queues and pools, shedding load, making
health checks honest, and keeping deployment and operational scripts restartable and observable. It
fits outbound integrations, background jobs, API failure contracts and incident follow-up on design.
Despite its name it is not about cutting a release: release work goes through `meaningfy-release`
(rule P-0001 in `docs/rules/`), and running Meaningfy's servers goes through the devops skills.

## Conflicts with Meaningfy rules
| # | Their advice (file, heading, line) | The Meaningfy rule it meets (owner skill) | Named in DEC-7, DEC-19 or DEC-20? |
|---|---|---|---|

No real conflict found. Checked and not counted: validating external input and dependency responses
before trusting them (`release-it.md`, "Data Boundary Rules", lines 174-178; "Runtime State and
Restart Safety Rules", line 132) applies at the trust boundary and in adapters, which agrees with
`cosmic-python:BP-VALIDATE-AT-BOUNDARY` and `PR-MODELS-OVER-DICTS`; structured logs at boundaries
(lines 185-194) agree with the observability rules of `cosmic-python` `SKILL.md`, lines 134-139;
testing timeouts (line 346) is compatible with injected clocks and no real sleeps
(`references/testing-checklist.md`, item 12). Production tests and chaos work (lines 240-242) require
a limited blast radius and a stop condition, which does not contradict the consent rules of the
devops skills. The full text calls itself a binding policy (line 17); DEC-7 answers that.

## Trigger overlap
`service-reliability` (monitoring and alerting, incidents and postmortems); `stack-operations`
(health-gated deploys, rollback); `ci-cd-delivery` (deploy workflow); `infrastructure-operations`
(restartable automation); `architecture` (availability drivers). Its description names "deployment
behavior", which is where it would also claim devops prompts; its name could attract a "cut a
release" prompt that P-0001 assigns to `meaningfy-release`, although its description does not.

## Fallback sentence (draft)
If `release-it` is not installed, offer `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/agent-rules-books#893a88a6fce3a80c565bf39ac65021b43a8b2990 --skill release-it --agent claude-code --global --yes` (the opencode command is in `assets/install.md`); if the person declines, carry on with `architecture` and `cosmic-python` and say once that the production-reliability guidance was not used.
