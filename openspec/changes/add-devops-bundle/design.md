<!-- PLAN (design half). PLAN = this file + tasks.md. Document type: Implementation. Revision 4 (clarity-gate round 1 gaps fixed). -->

> Parent: EPIC `add-devops-bundle` ([`proposal.md`](proposal.md)), DEC-1..17. Evidence in
> [`inputs/`](inputs/README.md): A current practice, B gap analysis (G-01..G-27), C best-practice
> baseline, D the owner's answers, E the repos' patterns and anti-patterns.

## Context

Fixed by the repo on `develop` @ 613c9fa (v3.5.0):

- Agent standard: types `lead`, `delegated`, `scheduled` (`docs/development/agent-template.md`);
  body ≤ 40 lines; a `## Dispatch contract` with Input, Output, Side effects, Refuses; agent
  features in `tests/features/agents/<name>.feature`; every skill and agent appears in some use
  case's `served_by`.
- The decision card exists: `executive-communication/references/decision-request.md`, spec
  `agent-decision-requests`.
- The policy-as-data pattern exists: `sales-pipeline-custody/assets/write-policy.yaml` with its
  evaluator and cases in `tests/test_sales_write_policy.py`.
- Skills may ship scripts (`skills/linkml-engineering/scripts/`, `skills/project-setup/scripts/`);
  tests use plain pytest with `pyyaml` only (`requirements-dev.txt`).
- Facet `purpose: devops`, `area: operations`, `subject: delivery-infra` exist in `facets.yaml`.
- `ci-cd-delivery` (bundle `meaningfy-building`) names `devops-toolkit/op-delivery.yml` as the
  reusable deploy mechanism in `SKILL.md`, `references/delivery-model.md` and
  `references/deploy-workflow-template.md` (G-27).
- UC-W6 lists `ci-cd-delivery`, `meaningfy-release`; status partial; four open points.

The infra repos (private) are not edited by this change. Their `AGENTS.md` already expects a skillery
skill named `infrastructure-operations` (file A §5).

## Goals / Non-Goals

**Goals:**
- Four skills and three agents passing `make validate`, installable from `releases` on both CLIs.
- Every gap in file B owned by exactly one skill rule, or named as out of scope.
- Two deterministic checks (stack conformance, unattended-action decision) with tests.
- A colleague who is not a devops engineer can run a routine operation with `devops-engineer` and
  judge every consent card.
- The unattended contract precise enough for `infrastructure-stacks` to build the runtime from it.

**Non-Goals:**
- Fixing the gaps inside the infra repos (their own changes, DEC-5).
- Building the scheduler, alert relay or allow-listed workflows (cut line).
- Running the agent features automatically (hand-run, as for every agent).
- Grooming Confluence MSC (an operation the agents perform after release, DEC-11).

## Decisions

New PLAN-level choices. Bets settled in the EPIC are cited, not re-argued.

- **D-1 Skill names and ownership.** `infrastructure-operations`, `stack-operations`,
  `service-reliability`, `infrastructure-security`. The first name is the one the infra repos already
  expect. Every gap has one owner:
  | Skill | Gaps owned |
  |---|---|
  | `infrastructure-operations` | G-01 (infra repo checks), G-02, G-04, G-05, G-06, G-07, G-24, G-26 (handover: everything an operation needs is in the repos and the skills) |
  | `stack-operations` | G-08, G-09, G-10, G-11, G-12, G-25 |
  | `service-reliability` | G-13, G-14, G-15, G-16, G-17, G-18, G-19 |
  | `infrastructure-security` | G-03 (four-eyes rule and break-glass), G-20, G-21, G-22, G-23 |
  | `ci-cd-delivery` (edited) | G-27 |
- **D-2 File map.** Each skill: `SKILL.md` (Quick Start with one worked example, Workflow, Gotchas,
  `## Boundary & Related Skills`) plus references:
  | Skill | references/ | assets/ · scripts/ |
  |---|---|---|
  | `infrastructure-operations` | `safe-change-protocol.md`, `change-shapes.md` (OpenSpec shapes A/B/C), `terraform-practice.md`, `ansible-practice.md`, `environments.md`, `lifecycle-procedures.md` (create, change, resize, rebuild, sleep, wake, retire), `repo-checks.md`, `documentation.md` (incl. runbook structure), `interventions.md` | `assets/consent-card.example.md`, `assets/templates/` per D-16 |
  | `stack-operations` | `stack-standard.md`, `deploy-workflow.md`, `versions-and-promotion.md`, `rollback.md`, `new-stack.md`, `upgrades-with-data.md`, `cutover.md`, `shared-services.md`, `acceptance-tests.md` | `scripts/check_stack.py`, `assets/templates/` per D-16 |
  | `service-reliability` | `monitoring-standard.md`, `alerting.md`, `daily-checkup.md`, `incident-response.md`, `backup-restore.md`, `unattended-operations.md` | `assets/unattended-actions.yaml`, `assets/postmortem.md`, `assets/templates/` per D-16, `scripts/decide_action.py` |
  | `infrastructure-security` | `access.md`, `secrets.md` (incl. the secret flow), `supply-chain.md`, `exposure.md` (incl. the port rule as it really works) | `assets/templates/` per D-16 |
- **D-3 Hardening rules (DEC-5).** Each control becomes a rule with a level. **MUST** is the
  standard now; **SHOULD** is the next tier, reported by the check-up but not blocking.
  | Control (file C §12) | Skill | Level |
  |---|---|---|
  | PR checks on both infra repos: `terraform fmt -check`, `validate`, `tflint`; `ansible-lint`; `docker compose config`; `promtool check`; `actionlint` + `zizmor`; `gitleaks` | infrastructure-operations (repo-checks) | MUST |
  | Plan posted on the PR; apply only a saved plan from merged `main` | infrastructure-operations | MUST |
  | State locking (`use_lockfile`), lock file committed, providers pinned `~>`, collections pinned exactly | infrastructure-operations | MUST |
  | Weekly drift check (`plan -detailed-exitcode`) | infrastructure-operations | SHOULD |
  | Separate state and credentials per environment; roles rehearsed on a non-production host first | infrastructure-operations (environments) | SHOULD (MUST for client production) |
  | Images built once off the VM, pinned `tag@sha256` in git; promotion and rollback are a PR or revert | stack-operations | MUST for new and changed stacks |
  | Keep the last 3 images per service; never `prune -a` | stack-operations | MUST |
  | Per-stack minimum (D-4), deploy health-gated with `up --wait` | stack-operations | MUST |
  | One reusable deploy workflow in the stacks repo, called per stack | stack-operations | SHOULD |
  | External uptime and TLS-expiry probes, one from outside the fleet | service-reliability | MUST |
  | Two alert tiers (page, ticket), each alert linking a runbook | service-reliability | MUST |
  | Central logs (Loki) | service-reliability | SHOULD |
  | A backup decision per stack, stated with its reason (DEC-14); where backed up: freshness alert, restore drill every 90 days, RPO/RTO stated | service-reliability | MUST |
  | Incident procedure in force: 3 severities, an incident is a GitHub issue (DEC-15), a duty rule (one named person on duty per week — the owner or the colleague — named in the pinned log issue; out of hours best-effort), client notice within 24 h, GDPR 72 h, postmortem for SEV1 and client-visible SEV2 | service-reliability | MUST |
  | MFA on every admin surface; named accounts; same-day offboarding checklist; access review every 6 months | infrastructure-security | MUST |
  | Secrets: Vaultwarden source of truth, inventory with owner and last-rotated date, rotation on leave and on exposure, yearly for high-value | infrastructure-security | MUST |
  | Actions pinned by SHA, `GITHUB_TOKEN` read-only by default, prod secrets in Environments, Dependabot for actions | infrastructure-security | MUST |
  | Trivy image scan, SBOM per release | infrastructure-security (cites `meaningfy-release` for SBOM) | SHOULD |
  | `infra-reviewer` subagent review on every infrastructure change, mid-implementation and/or at its end, report posted on the PR (DEC-8); break-glass: an emergency change is reviewed within one working day | infrastructure-security | MUST (practised, not enforced) |
  | SSH certificates instead of a shared key | infrastructure-security | SHOULD |
  | Temporary rules carry `expires: YYYY-MM-DD` in a comment | infrastructure-operations | MUST |
  | A role's defaults carry no other service's values; a generic role touches only what its caller lists (C-A3) | infrastructure-operations (ansible-practice) | MUST |
  | No insecure fallbacks: no default passwords, no `:-changeme`, no default sudo, no world-open default allow-list (C-A4, S-A10) | infrastructure-security | MUST |
  | Cross-layer facts (volume ids, addresses) are generated from Terraform outputs or inventory facts, never pasted (C-P4, C-A2) | infrastructure-operations | SHOULD |
  | Shared variables and roles instead of copies once a block repeats a third time (C-A1); one generic backup role (C-P9) | infrastructure-operations | SHOULD |
  | Dead code removed when its system is retired, with a tombstone (C-A5, C-P12) | infrastructure-operations | MUST |
  | Docker log rotation set, per service or as the daemon default from Ansible (S-P2) | stack-operations | MUST |
  | Private ports bind a private address or 127.0.0.1: the cloud firewall ignores private traffic and Docker bypasses the host firewall (C-P3, S-A2) | infrastructure-security (exposure) | MUST |
  | Every backed-up service records its last restore test in its README (C-P14); the first run of a new backup is checked by hand, since a never-successful backup raises no alert (S-P7) | service-reliability | MUST |
  | Non-trivial change: a baseline acceptance run before, and an `infra-reviewer` rescoring of the plan before execution (S-P9) | infrastructure-operations (safe-change protocol) | MUST |
- **D-4 Per-stack minimum** (`stack-standard.md`, checked by `check_stack.py`). Rules S1–S9:
  S1 every image pinned to a version tag, no `latest`, no bare major; digest added when the image
  is ours or changes. S2 every long-running service has a `healthcheck`. S3 a memory limit. S4 log
  rotation (`logging:` with `max-size` and `max-file`). S5 `restart: unless-stopped`. S6
  `security_opt: [no-new-privileges:true]`. S7 every published `ports:` entry names its bind address
  (a private address or 127.0.0.1), except the proxy's 80/443. S8 persistent data in a bind mount under `/opt/data/`. S9 no literal secret in
  `environment:` (values must be `${VAR}`) and no default fallback on a secret-looking variable
  (`${VAR:-…}`). S4 is met by a service `logging:` block or by the comment
  `# conformance-exception: S4 daemon default` when Ansible sets the daemon default. An exception is a comment on the service,
  `# conformance-exception: S<n> <reason or DEC id>`; the check reports it as *excepted*, not *met*.
- **D-5 The check script.** `python check_stack.py <compose.yml>...` prints a table
  (stack, service, rule, status: met / missing / excepted) and exits 1 when any rule is missing,
  so the same script runs in an agent session and as a CI step. Reads YAML only; no Docker, no
  network. Standard library plus `pyyaml`.
- **D-6 Unattended-action policy as data** (`assets/unattended-actions.yaml`, DEC-7). Entries:
  `id`, `description`, `tier` (`act`, `park`, `never`), `operation` (the name of the allow-listed
  workflow in the stacks repo, for `act`). Global park triggers, evaluated over the facts of one
  proposed action: `cost_increase_eur_month > 10`, `blocking_minutes > 15`, `data_loss_risk`,
  `touches_data`, `applies_infra_code`, `changes_security`; global never triggers: `destroys`,
  `deletes_data`, `exposes_to_internet`, `handles_secret_value`; the fact `attempts` (integer, the
  number of earlier `act` attempts on this incident, D-9). Precedence: never → `attempts >= 2`
  (escalate) → park triggers → listed tier → unlisted (park). Initial `act` list: restart a container,
  recreate a stack at its pinned version, re-run a failed backup job, rotate logs and remove images
  beyond the last 3, trigger certificate renewal, re-run the last deploy of the same commit. The
  thresholds are the agent's reading of "significantly" and "for a long time" (owner may edit).
- **D-7 The decider script.** `python decide_action.py --action <id> --facts <json>` prints one of
  `act`, `park`, `never`, `escalate` with the rule that decided, reading the YAML; `ops-watch` calls it before
  every unattended action, so the decision is deterministic and the same as in the tests.
- **D-8 Consent card = the existing decision card** (DEC-6). No variant in `executive-communication`.
  `assets/consent-card.example.md` is one worked example: decided = "apply this plan"; the facts are
  the service, who notices, duration, cost, undo; options include "do nothing" with its consequence.
- **D-9 Records** (all GitHub issues live in `infrastructure-stacks`). One rule per kind:
  - **Interactive intervention:** a **PR** when code changed; otherwise an issue labelled
    `ops-intervention` (what, why, how verified). Non-trivial changes also keep the OpenSpec
    `execution-log.md`.
  - **Incident** (every alert `ops-watch` handles, and every incident a person opens, security ones
    included, DEC-15): one issue labelled `incident` and `sev1`..`sev3` (from the alert's severity;
    `sev3` when absent), titled `<symptom> — <service>`; an open issue with that title is reused, never
    duplicated. Each unattended `act` is one comment on it (`attempt n: <operation> → <result>`); the
    count of those comments is the `attempts` fact (D-6). Verified → the issue is closed. Parked → the
    label `ops-parked` is added and the consent card is a comment.
  - **Check-up finding that needs a human** (no alert): an issue labelled `ops-parked`.
  - **Daily check-up report:** a comment on one pinned issue titled `Daily check-up log`; the
    previous comment is "yesterday" for D-10 item 8.
  - **Slack unreachable:** the post goes to an issue labelled `ops-report`; posted on the next run.
  Every opening is notified in `#infra-alerts`; when work is done, a summary goes to `#operations`
  (DEC-7). Notable changes add a line to the Confluence change log page (DEC-11). This answers UC-W6's
  open point on where records live.
- **D-10 Daily check-up content** (`daily-checkup.md`, fixed order): (1) alerts firing or silenced
  > 24 h; (2) scrape targets down; (3) backup freshness per backed-up service and restore-drill age
  > 90 days; (4) TLS expiry < 14 days (from the probes of D-3); (5) disk forecast full < 7 days
  (`predict_linear` on the filesystem metrics); (6) `expires:` dates passed or within 14 days (grep of
  both repos); (7) open `ops-parked` and `incident` issues; (8) stack conformance (`check_stack.py`)
  changes since the previous report (D-9); (9) on Mondays: Confluence-vs-repo drift, infra PRs merged
  in the last 7 days without a comment headed `## infra-reviewer report` (DEC-8), and stacks without
  a backup decision (DEC-14). If monitoring cannot be read, item 1–5 are reported as
  "monitoring unreadable", itself a finding. Output: one post in `#infra-alerts`, problems
  first, then "checked and fine" as one line per area; a summary in `#operations` only when work was
  done.
- **D-11 Agents.**
  | Agent | Type | Skills (first = dispatch) | Delegates to | Contract essentials |
  |---|---|---|---|---|
  | `devops-engineer` | `lead` | infrastructure-operations, stack-operations, service-reliability, infrastructure-security | `infra-reviewer` | Input: the need, in words; Output: the change applied and recorded, or the plan; Side effects: PRs, applies after consent, records (D-9); Refuses: applying without a card answered yes, printing a secret, editing outside the two repos. Stop: recorded, or the person stops. "Not for delegation". |
  | `ops-watch` | `scheduled` | service-reliability, stack-operations, infrastructure-operations, infrastructure-security | none | Input: `schedule: daily check-up`, `alert: <payload>`, `human session`; Output: the Slack report; Side effects: allow-listed operations only, the issues and comments of D-9, logged; Refuses: anything `decide_action.py` does not return `act` for. "Not for delegation". |
  | `infra-reviewer` | `delegated` | infrastructure-operations, stack-operations, infrastructure-security | — | Called as a subagent on the plan before execution and on the branch mid-implementation and/or at the end (DEC-6, DEC-8). Input: an OpenSpec change path, or a PR (number or branch) in either infra repo; Output: a report headed `## infra-reviewer report` — findings by severity, plan summary, blast radius, undo path, conformance result; Side effects: none on files; Refuses: approving, merging, applying. **The caller** (`devops-engineer` or the person) posts the report as a PR comment. |
  Tools: `ops-watch` `[Read, Grep, Glob, Bash, Skill]`, `infra-reviewer` `[Read, Grep, Glob, Bash, Skill]`;
  both `disallowedTools: [Write, Edit, NotebookEdit]` (as `code-reviewer`). `devops-engineer` gets
  `[Read, Grep, Glob, Edit, Write, Bash, Skill]`.
- **D-12 Runtime contract** (`docs/environment/devops-agents.md`, DEC-9). The host is undecided (a
  dedicated server, a Claude scheduled task, or OpenClaw); whichever it is, the unattended runtime
  must: start `ops-watch` in a checkout of `infrastructure-stacks` with `../cloud-infrastructure`
  beside it (DEC-13); pass the trigger (`schedule` or the Alertmanager payload); give it read access
  to the Prometheus API, write to `#infra-alerts` and `#operations`, issue creation and
  `workflow_dispatch` on the allow-listed operations only; run one `ops-watch` at a time (a second
  trigger waits for the first); give it no SSH key and no cloud token.
  Interactive sessions use the owner's `bw` session, piped, never seen (DEC-10).
- **D-13 `ci-cd-delivery` edit** (DEC-2). Remove the `op-delivery.yml` claims (three files); the
  "reusable deploy mechanism" becomes "request a deploy from the stacks repository" (a PR that bumps
  the pinned digest, or a dispatch the stacks repo defines), citing `stack-operations`; the
  description drops "kill the duplicated SSH/bastion/rsync/.env deploy block" (now
  `stack-operations`). Triggers on image release stay.
- **D-14 Facets.** All four skills and three agents: `purpose: devops`, `area: operations`,
  `subject: delivery-infra`, `posture: precise`, `stage: release`, `maturity: experimental`.
- **D-15 Use case.** UC-W6 `served_by` gains the four skills and three agents; slices 2 and 3 move
  to "this change"; the four open points are answered by D-10 (review content), D-9 (records),
  DEC-7 (alone vs second person), D-11 (one interactive agent, one watch). No new use case.

- **D-16 Standard templates from the repos' patterns** (file E, verdict T). Each is a placeholder-only
  asset (no host, address or id; DEC-4) in the skill that owns it; the skill's text says when to use
  it and cites the anti-pattern it replaces.
  | Skill | `assets/templates/` |
  |---|---|
  | `infrastructure-operations` | `vm-module-block.tf` (C-P1, `keep_disk = true`), `group-vars.yml` (C-P5, minimal), `docker-host-playbook.yml` (C-P6), `role-contract/` README + `tasks/main.yml` skeleton with `assert` (C-P7), `fail-closed-tasks.yml` (C-P8), `tombstone.txt` (C-P12), `runbook.md` (S-P11), `execution-log.md` (S-P9, one schema) |
  | `stack-operations` | `stack/` (S-P1: compose with the S-P2 service shape and S-P3 edge, `.env.example`, README with Consumers, backup decision and wake steps), `deploy-workflow.yml` (S-P5, the matrix shape; single instance = a one-row matrix), `cutover.sh` outline (S-P10), `acceptance.feature` (S-P12) |
  | `service-reliability` | `backup-role/` (C-P9 as one parameterised role, with the restore-test record of C-P14), `alert-rule.yml` with runbook link |
  | `infrastructure-security` | `secret-flow.md` (S-P6 commands, values piped, never shown), `offboarding-checklist.md`, `bastion-users.yml` (C-P11, explicit groups) |
  The decided shapes are stated once, in the template; the reference files keep only the why.
- **D-17 Truths the skills state** (file E): the port rule as two layers for private traffic
  (C-P3); the resize and rebuild traps (file E §2); the Terraform idioms (`moved`, `import`, hashed
  certificate names, wildcard override as cutover); the two sleep/wake variants (S-P14); the
  `[skip ci]` rule for doc commits (S-P13); commit scope = the service or VM (C-P18, one line added to
  `meaningfy-git-workflow`, task 4.2).

## Algorithm / approach

**Interactive operation (devops-engineer):** read the need → read both repos (`AGENTS.md`, the
relevant stack, specs) and monitoring → if the need is a code change, open an OpenSpec change in the
right shape (A, B or C, DEC-6) when the stacks repo's rules ask for one, else a branch → for a
non-trivial change: baseline acceptance run, then `infra-reviewer` rescoring the plan → write the
change in both repos, starting from the skill's template when one exists (DEC-16), never from
another stack → dry run → `infra-reviewer` on the branch (mid-implementation and/or at the end) → consent card (D-8) → on yes, the person or the agent
applies exactly the saved plan → verify (monitoring, healthchecks, `check_stack.py`) → record (D-9,
three audiences).

**Worked example (consent card).** *Decide by today:* apply the plan that adds a memory limit and a
healthcheck to `<stack>`. *Recommendation:* yes. *Options:* A apply now — the stack's UI restarts, users see an error for about 30 s, cost unchanged; B apply tonight — same, nobody
working; C do nothing — the stack can still exhaust the server's memory. *Facts:* plan
changes 1 file, recreates 2 containers, no data touched (confirmed, dry run); undo = revert the PR and
redeploy (confirmed). *"Yes" will:* merge, deploy, verify the healthchecks pass.

**Unattended run (ops-watch):** trigger → if alert: open or reuse the `incident` issue (D-9), notify
`#infra-alerts` → identify the symptom → propose one action → `decide_action.py` with the facts and
`attempts` → `act`: invoke the named operation, comment the attempt, wait, verify; cleared → post the result to
`#infra-alerts`, close the issue, summary to `#operations`; not cleared → next run counts the attempt; `park`: label
`ops-parked`, comment the consent card, notify; `never` or `escalate`: comment and notify that a human
is needed → if schedule: run D-10 → post to `#infra-alerts` and comment on the pinned log issue.

**Idempotency.** Every `act` operation is idempotent by contract (D-12): restarting a running
container, re-running a backup, recreating at the same pin. `check_stack.py` and `decide_action.py`
are pure functions of their inputs. Incident issues are de-duplicated by title (D-9).

### Anti-patterns

- ❌ A skill sentence that names a host, an address, a port number tied to a service, or a page that
  holds credentials (DEC-4).
- ❌ Restating the decision card's fields in a devops skill (cite `executive-communication`).
- ❌ "The agent decides if it is safe" without `decide_action.py` (DEC-7 is data, not judgement).
- ❌ An unattended action through SSH (DEC-9).
- ❌ Copying a runbook for one system into skillery (DEC-1).
- ❌ Changing the repository to match Confluence (DEC-11).
- ❌ Creating a stack, role or workflow by copying another stack's files instead of the skill's
  template (DEC-16).
- ❌ Marking S4 `excepted` when Ansible does not set the Docker daemon's log rotation (D-4).
- ❌ A template that holds a real host, address, id or account (DEC-4, TC-03).

## Error matrix

| Failure mode | Expected handling |
|---|---|
| `../cloud-infrastructure` missing | Report and stop that part (spec operations-practice) |
| Dry run shows an unplanned destroy or replace | Stop, show the difference, back to the plan step |
| Apply fails midway | Stop; show state; propose the documented undo; record the failure (D-9) |
| Verification fails after apply | Propose rollback (revert + redeploy, or the stack's documented undo) as a new card |
| `bw` locked or item missing | Ask the person to unlock or name the item; never ask for the value in chat |
| Unattended action not in the policy | Park (spec unattended-operations) |
| Allowed action has no named operation | Park and report the missing operation |
| Second failed attempt on the same symptom | Escalate, no third attempt |
| Slack unreachable | Write the report to an `ops-report` issue; post it on the next run (D-9) |
| Duplicate alert while an incident issue is open | Comment on the existing issue; no new issue (D-9) |
| Monitoring (Prometheus API) unreachable | Report "monitoring unreadable" as a finding; no unattended action on unverifiable state; the open incident is labelled `ops-parked` |
| A `workflow_dispatch` fails or times out | Counts as an attempt (comment on the incident); verify not possible → next run decides with `attempts` |
| Alert payload malformed or missing the service | Park: an incident issue titled `<alertname or 'malformed alert'> — unknown` with the raw payload, notify |
| Two triggers at once | One run at a time (D-12); the second waits and re-reads state |
| `check_stack.py` cannot parse a compose file | Report the file as `unreadable`, exit 1 |
| Policy YAML invalid | `decide_action.py` exits non-zero; the agent treats every action as park |
| A template and the repo's existing stack disagree | The template wins for new work; the existing stack's difference is reported as a conformance gap, not copied |
| A rule in the repo's `AGENTS.md` contradicts a skill rule restated by DEC-17 | The skill rule is applied; the contradiction is reported for the repo's own change |

## Test cases

| ID | Component | Input | Expected output | Edge cases |
|---|---|---|---|---|
| TC-01 | `decide_action.py` | each case of `action_cases.yaml` (action id + facts) | the case's decision and deciding rule | a never trigger beats a listed `act`; `attempts: 2` on an `act` action → `escalate`; an unlisted action → `park`; invalid YAML → non-zero exit |
| TC-02 | `check_stack.py` | the fixtures under `compose/`: per rule S1–S9 one missing, one met, one excepted | the table row per service and rule; exit 1 iff a rule is missing | `excepted` never counts as met; S7 port without a bind address; S9 `${VAR:-default}` on a secret-looking name; unreadable YAML → `unreadable`, exit 1 |
| TC-03 | privacy test | every file of the four skills, three agents, `tests/fixtures/devops/` and this change's `inputs/` | no IPv4 outside RFC 5737 examples (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24); no hostname under `meaningfy.ws`; no name from the local list | the name list is `tests/fixtures/devops/private-names.local.txt`, git-ignored; absent → that part skipped with a warning, and the human privacy review of task 7.1 covers it |
| TC-04 | agent features | `tests/features/agents/{devops-engineer,ops-watch,infra-reviewer}.feature` | one scenario per spec scenario mapped to an agent below | feature shape check |
| TC-05 | trigger probes | one positive, one near-miss per new description | routes to the new skill / does not | near-misses against `ci-cd-delivery`, `meaningfy-release`, `project-setup`, `guardrails` |
| TC-06 | templates | every file under the four skills' `assets/templates/` | the stack template passes `check_stack.py`; every YAML template parses; TC-03 green on them | placeholders in `<angle brackets>` only |
| IT-1 | `devops-engineer`, hand-run | one stack in `infrastructure-stacks` brought to the per-stack minimum | branch from the template rules, reviewer report on the PR, card answered, applied, record per D-9 | the reviewer rescoring before execution |
| IT-2 | `ops-watch`, hand-run, human session | the daily check-up | post in `#infra-alerts`, comment on the pinned log issue, nothing changed | monitoring unreadable → reported as a finding |
| IT-3 | `ops-watch`, hand-run | a recorded payload for a restarting container; then a resize | `act` with an incident issue and an attempt comment; `park` with no operation invoked | a third trigger on the same incident → `escalate` |
| IT-4 | `infra-reviewer`, hand-run | one real infra PR | a report headed `## infra-reviewer report`, posted by the caller | an OpenSpec change path as input |

**Spec scenario → test.**

| Spec · scenario | Covered by |
|---|---|
| operations-practice · A skill draft names a production host | TC-03; task 7.1 privacy review |
| operations-practice · The sibling repository is missing | TC-04 (devops-engineer, ops-watch) |
| operations-practice · A devops skill restates how an image is built | task 4.1 grep; task 2.2 acceptance |
| operations-practice · The dry run shows an unplanned destroy | TC-04 (devops-engineer) |
| operations-practice · The person asked to consent is not a devops engineer | TC-04 (devops-engineer); IT-1 |
| operations-practice · A command needs a database password | TC-04 (devops-engineer) |
| operations-practice · Confluence and the repository disagree | TC-04 (devops-engineer, ops-watch) |
| operations-practice · An infrastructure change is ready for merge | TC-04 (infra-reviewer, devops-engineer); IT-4 |
| operations-practice · A stack has no backup decision | TC-04 (ops-watch); D-10 item 9 |
| operations-practice · A new stack is created | TC-06; TC-04 (devops-engineer) |
| operations-practice · A repository rule is wrong as written | TC-04 (devops-engineer, infra-reviewer) |
| operations-practice · A stack lacks a healthcheck | TC-02 (S2) |
| unattended-operations · A container is crash-looping at night | TC-01; TC-04 (ops-watch); IT-3 |
| unattended-operations · The fix needs a bigger server | TC-01; IT-3 |
| unattended-operations · The fix risks losing data | TC-01 |
| unattended-operations · An action is not in the policy | TC-01 |
| unattended-operations · The restart did not help twice | TC-01 (`escalate`); IT-3 |
| unattended-operations · An act-and-report action has no operation defined | TC-04 (ops-watch) |
| unattended-operations · The daily check-up finds nothing wrong | TC-04 (ops-watch); IT-2 |
| unattended-operations · A restart fixed an incident | TC-04 (ops-watch); IT-3 |

## References

| Topic | Location |
|---|---|
| Current practice, gaps G-01..G-27 | [`inputs/2026-10-27-A-current-practice.md`](inputs/2026-10-27-A-current-practice.md), [`inputs/2026-10-27-B-gap-analysis.md`](inputs/2026-10-27-B-gap-analysis.md) §1 |
| Hardening baseline and do-not-bother list | [`inputs/2026-10-27-C-best-practices.md`](inputs/2026-10-27-C-best-practices.md) §12 |
| Owner's answers | [`inputs/2026-10-27-D-shaping-qa.md`](inputs/2026-10-27-D-shaping-qa.md) Q1–Q9 |
| Patterns C-P*, S-P* and anti-patterns | [`inputs/2026-10-27-E-repo-patterns.md`](inputs/2026-10-27-E-repo-patterns.md) §1, §2 |
| Agent standard and types | [`docs/development/agent-template.md`](../../../docs/development/agent-template.md), [`docs/environment/dual-cli/mapping.md`](../../../docs/environment/dual-cli/mapping.md) |
| Decision card | [`skills/executive-communication/references/decision-request.md`](../../../skills/executive-communication/references/decision-request.md) |
| Policy-as-data precedent | [`skills/sales-pipeline-custody/assets/write-policy.yaml`](../../../skills/sales-pipeline-custody/assets/write-policy.yaml), [`tests/test_sales_write_policy.py`](../../../tests/test_sales_write_policy.py) |

## Risks / Trade-offs

- [The skills state MUSTs the repos do not meet yet] → expected (DEC-5); the first check-up lists
  them and seeds the repos' changes. MUST is the target, not a claim of current state.
- [Thresholds in D-6 are guesses] → they are data; the owner edits them; each edit ships with a case.
- [A public skill describes the hardening target] → it describes good practice, not Meaningfy's
  gaps; the gap list stays private to the repos (DEC-4).
- [An unattended agent with write access] → hands limited to named idempotent operations, no shell,
  no secrets (DEC-9, D-12); every action logged.
- [Non-specialists approve changes] → the card states effect in plain words; the reviewer agent adds
  a second reading; break-glass is written.

## Open Questions

None open. Resolved by the owner on 2026-10-27 (file D; EPIC re-shape log):
OPEN-1 no paid GitHub plan, review by subagent as discipline (DEC-8); OPEN-2 unattended host
undecided, contract only (DEC-9, D-12); OPEN-3 incidents as GitHub issues (DEC-15); OPEN-4 backups
per stack, unencrypted allowed (DEC-14); OPEN-5 the owner's `bw` session (DEC-10); OPEN-6 the full
reports stored in `infrastructure-stacks/docs/assessments/2026-10-27/`.
