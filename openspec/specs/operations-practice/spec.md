# operations-practice Specification

## Purpose
How the devops skills and agents operate Meaningfy's infrastructure: the skills hold the practice
and the infra repositories the instance; every change follows the safe-change protocol with a
consent card a non-specialist can judge; credentials are used without being seen; three
documentation audiences stay current; conformance to the hardened target is checked and reported.
## Requirements
### Requirement: The devops skills hold practice; the infra repositories hold the instance
The devops skills SHALL hold the practice and the expectations for setting up and operating
infrastructure; facts specific to an installation (hosts, stacks, ports, traps, per-system runbooks)
SHALL live in `infrastructure-stacks` and `cloud-infrastructure`, and an agent SHALL read them there
(DEC-1). The agents SHALL start in `infrastructure-stacks` and treat `../cloud-infrastructure` as its
sibling (DEC-13).

#### Scenario: A skill draft names a production host
- **WHEN** a devops skill, agent, fixture or input contains a host, address, port, account,
  credential, secret location or a weakness tied to a named system
- **THEN** it is removed or replaced by a placeholder, and the fact stays in the infra repository

#### Scenario: The sibling repository is missing
- **WHEN** an agent run needs `../cloud-infrastructure` and the directory does not exist
- **THEN** the agent reports the missing sibling and stops that part of the work, without guessing a
  location

### Requirement: The devops skills own operations, not application delivery
`ci-cd-delivery` SHALL own the application repository up to a published image and a deploy request;
`stack-operations` SHALL own everything from the request onward in the stacks repository (DEC-2). An
overlap SHALL be resolved by moving text, never by restating it.

#### Scenario: A devops skill restates how an image is built
- **WHEN** a devops skill describes building or tagging an application image
- **THEN** the text moves to `ci-cd-delivery` or is removed, and the devops skill names it

### Requirement: Every operation follows the safe-change protocol
An agent SHALL read the state, state its view and plan, run a dry run, ask for consent with a decision
card a non-specialist can judge (what changes, who notices, for how long, at what cost, how it is
undone), apply exactly what was shown, verify against monitoring, and record the change (DEC-6).

#### Scenario: The dry run shows an unplanned destroy
- **WHEN** the dry run shows a destroy, a replace or a data change that the stated plan did not name
- **THEN** the agent stops, shows the difference, and asks again from the plan step

#### Scenario: The person asked to consent is not a devops engineer
- **WHEN** the agent asks for consent to apply a change
- **THEN** the card states the effect in plain words (service, users affected, duration, cost, undo),
  not only the raw plan

### Requirement: Credentials never enter text
An agent SHALL read a credential from the Infra owner's Vaultwarden session through the `bw` CLI
piped into the command that uses it, so that it uses the value without seeing it; it SHALL NOT print,
echo, store, commit or report a credential value (DEC-10).

#### Scenario: A command needs a database password
- **WHEN** an operation needs a credential
- **THEN** the value is piped from `bw` into the command, and no transcript, report, commit or
  Confluence page contains it

### Requirement: Three documentation audiences stay current; the repository wins
Every recorded change SHALL update the machine record (the OpenSpec change or execution log), the
repository's docs for people, and the Confluence MSC page that summarises it; on a contradiction the
repository SHALL be trusted and Confluence groomed (DEC-11).

#### Scenario: Confluence and the repository disagree
- **WHEN** the daily check-up or a session finds a Confluence page that contradicts the repository
- **THEN** the agent reports the drift and proposes the Confluence edit; it never changes the
  repository to match Confluence

### Requirement: The skills state the hardened target and the agents check conformance
Each applicable control of the small-company minimum set SHALL be a rule in its owning skill with its
reason and minimum version, the do-not-bother list SHALL be stated as no-gos, and the agents SHALL
report conformance gaps rather than fix them outside a change (DEC-5).

#### Scenario: An infrastructure change is ready for merge
- **WHEN** an infrastructure change reaches the middle or the end of its implementation
- **THEN** `infra-reviewer` runs as a subagent and the caller posts its report, headed
  `## infra-reviewer report`, on the PR before the author decides to merge (DEC-8)

#### Scenario: A stack has no backup decision
- **WHEN** a stack's spec or README does not state whether its data is backed up and why
- **THEN** the conformance report lists the missing decision; it does not demand a backup (DEC-14)

#### Scenario: A new stack is created
- **WHEN** an agent creates a new stack, role, VM block or deploy workflow
- **THEN** it starts from the owning skill's standard template, never from another stack's files,
  and the result passes the stack conformance check (DEC-16)

#### Scenario: A repository rule is wrong as written
- **WHEN** a repository's rule contradicts a rule the skill restates (for example the three-layer port
  rule for private ports)
- **THEN** the agent applies the skill's rule and reports the contradiction for the repository's own
  change (DEC-17)

#### Scenario: A stack lacks a healthcheck
- **WHEN** the stack conformance check runs on a compose file whose service has no healthcheck
- **THEN** the report lists the stack, the service and the rule, and no file is changed by the check

